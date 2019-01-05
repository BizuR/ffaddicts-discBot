import fetch from 'node-fetch';
import { Item } from './item';
import { JobClass } from './jobClass';
import { Recipe } from './recipe';
import * as LRU from 'lru-cache';
import { Character } from './character';
import { isContext } from 'vm';
import { Utils } from './utils';

const props = require(process.cwd() + "/" + process.argv[2]);
const xivapi_key = props.xivApi.secretKey;
const xivapi_baseurl = props.xivApi.baseUrl;
const cacheOptionsData: any = {};
cacheOptionsData.max = 100;
cacheOptionsData.maxAge = 60 * 60 * 1000;
const cacheData: any = new LRU(cacheOptionsData);
const cacheConst: any = new LRU(500);
export class XIVapi {

    public static async getRecipe(name: string) : Promise<Recipe> {
        try {
            //if in cache
            if (cacheData.has('recipe-'+name)) {
                let recipe_id = cacheData.get('recipe-'+name);
                console.log('cache used ! ' + name + " => " + recipe_id);
                return cacheData.get('recipe-'+recipe_id);
            }
            //api search
            else {
                let responseSearch = await fetch(xivapi_baseurl + "/search?language=fr&indexes=recipe&key=" + xivapi_key + "&string=" + encodeURIComponent(name));
                let searchList = await responseSearch.json();
                if (searchList.Pagination.Results === 0) {
                    throw "Aucun nom ne correspond de près ou de loin.";
                } else if (searchList.Pagination.Results > 1) {
                    //retour d'une réponse d'erreur avec les possibilités
                    let response = "Demande trop vague, quelques pistes :";
                    for (let i = 0; (i < searchList.Pagination.Results) && (i < 5); i++) {
                        response += "\n- " + searchList.Results[i].Name;
                    }
                    throw response;
                } else {
                    //chercher plus d'info sur la recette
                    let responseRecipe = await fetch(xivapi_baseurl + "/recipe/" + searchList.Results[0].ID + "?language=fr&key=" + xivapi_key);
                    let recipeInfo = await responseRecipe.json();
                    const rec : Recipe = new Recipe();
                    rec.id = recipeInfo.ID;
                    rec.name = recipeInfo.Name;
                    rec.difficulty = recipeInfo.RecipeLevelTable.Difficulty;
                    rec.quality = recipeInfo.RecipeLevelTable.Quality;
                    rec.durability = recipeInfo.RecipeLevelTable.Durability;
                    rec.craftType = recipeInfo.CraftType.Name;
                    rec.levelRequired = recipeInfo.RecipeLevelTable.ClassJobLevel;
                    rec.job = await XIVapi.getJobClass(recipeInfo.ClassJob.ID);
                    rec.iconUrl = new URL(xivapi_baseurl + recipeInfo.Icon);
                    for (let i = 0; i < 9; i++) {
                        let curQte : number = recipeInfo["AmountIngredient" + i];
                        if (curQte > 0) {
                            let curItem = recipeInfo["ItemIngredient" + i];
                            let item : Item = new Item(curItem.Name, curItem.ItemUICategory.Name, curItem.Description);
                            rec.addIngredient(item, curQte);
                        }
                    }
                    cacheData.set('recipe-'+name, rec.id);
                    cacheData.set('recipe-'+rec.id, rec);
                    return rec;
                }
            }
        } catch (err) {
            throw err;
        }

    }

    public static async getCharacter(server : string, name: string) : Promise<Character> {
        try {
            //if in cache
            if (cacheData.has('char-'+server+'-'+name)) {
                let char_id = cacheData.get('char-'+server+'-'+name);
                console.log('cache used ! ' + name + " => " + char_id);
                return cacheData.get('char-'+char_id);
            }
            //api search
            else {
                let responseSearch = await fetch(xivapi_baseurl + "/character/search?name=" + name + "&server=" + server +"&key=" + xivapi_key);
                let charsList = await responseSearch.json();
                if (charsList.Pagination.Results === 0){
                    throw "Personnage inexistant, essaie autre chose !";
                } else {
                    let responseChar = await fetch("https://xivapi.com/character/" + charsList.Results[0].ID + "?key=" + xivapi_key);
                    let charInfo = await responseChar.json();
                    if (charInfo.Info.Character.State === 1){
                        throw 'Reviens dans 2 minutes, le temps que je recherche un peu dans mes archives.';
                    } else {
                        let charResponse : Character = new Character();
                        charResponse.id = charInfo.Character.ID;
                        charResponse.name = charInfo.Character.Name
                        if (charInfo.Character.Title !== null){
                            charResponse.title = await XIVapi.getTitle(charInfo.Character.Title,charInfo.Character.Gender);
                        }
                        charResponse.avatar = charInfo.Character.Avatar;
                        charResponse.portrait = charInfo.Character.Portrait;
                        let listAttr = Object.keys(charInfo.Character.GearSet.Attributes);
                        let attrInfos = await XIVapi.loadAttributes();
                        for(let i=0; i < listAttr.length; i++){
                            charResponse.addAttribute(attrInfos.get(Number.parseInt(listAttr[i]).valueOf()),charInfo.Character.GearSet.Attributes[listAttr[i]]);
                        };
                        let listJobs = Object.keys(charInfo.Character.ClassJobs);
                        let jobInfos = await XIVapi.loadJobClasses();
                        for(let i=0; i < listJobs.length; i++){
                            let curJob = charInfo.Character.ClassJobs[listJobs[i]];
                            charResponse.addJob(jobInfos.get(curJob.JobID), curJob.Level);
                        };
                        console.log("-- jobs OK");
                        charResponse.activeJob = await this.getJobClass(charInfo.Character.ActiveClassJob.JobID);

                        cacheData.set('char-'+server+'-'+name, charResponse.id);
                        cacheData.set('char-'+charResponse.id, charResponse);
                    return charResponse;
                    }
                }
            }
        } catch (err) {
            throw err;
        }

    }

    public static async getTitle(title : number, gender: number) : Promise<string> {
        let responseTitle = await fetch (xivapi_baseurl + "/Title/" + title + "?language=fr" +"&key=" + xivapi_key);
        let titleInfo = await responseTitle.json();
        return gender === 1 ? titleInfo.Name : titleInfo.NameFemale;
    }

    public static async loadJobClasses() : Promise<Map<number,JobClass>> {
        //if in cache
        if (cacheConst.has('jobClasses')) {
            return cacheConst.get('jobClasses');
        }
        //api search
        else {
            let response = await fetch (xivapi_baseurl + "/ClassJob?columns=ID,Name,Icon,Abbreviation,ClassJobCategory.Name&language=fr" +"&key=" + xivapi_key);
            let jobList = await response.json();
            let jobs : Map<number,JobClass> = new Map();
            for (let i = 0;i < jobList.Pagination.Results; i++) {
                let curEntry = jobList.Results[i];
                if (curEntry.Name != ''){
                    let curJob = new JobClass(curEntry.ID, Utils.upperCaseFirst(curEntry.Name), curEntry.Abbreviation , Utils.upperCaseFirst(curEntry.ClassJobCategory.Name), new URL(xivapi_baseurl + curEntry.Icon));
                    jobs.set(curEntry.ID,curJob);
                    cacheConst.set('jobClass-'+curEntry.ID,curJob);
                }
            }
            cacheConst.set('jobClasses', jobs);
            return jobs;
        }
    }

    public static async getJobClass(id : number) : Promise<JobClass> {
        //if in cache
        if (cacheConst.has('jobClass-'+id)) {
            return cacheConst.get('jobClass-'+id);
        }
        //api search
        else {
            let response = await fetch (xivapi_baseurl + "/ClassJob/" + id + "?language=fr" +"&key=" + xivapi_key);
            let jobInfo = await response.json();
            let jobResponse : JobClass = new JobClass(jobInfo.ID, Utils.upperCaseFirst(jobInfo.Name), jobInfo.Abbreviation, Utils.upperCaseFirst(jobInfo.ClassJobCategory.Name), new URL(xivapi_baseurl + jobInfo.Icon));
            cacheConst.set('jobClass-'+id, jobResponse);
            return jobResponse;
        }
    }

    public static async loadAttributes() : Promise<Map<number,string>> {
        //if in cache
        if (cacheConst.has('attributes')) {
            return cacheConst.get('attributes');
        }
        //api search
        else {
            let response = await fetch (xivapi_baseurl + "/BaseParam?language=fr" +"&key=" + xivapi_key);
            let attrList = await response.json();
            let attributes : Map<number,string> = new Map();
            for (let i = 0;i < attrList.Pagination.Results; i++) {
                attributes.set(attrList.Results[i].ID,attrList.Results[i].Name);
                cacheConst.set('attr-'+attrList.Results[i].ID, attrList.Results[i].Name);
            }
            cacheConst.set('attributes', attributes);
            return attributes;
        }
    }

}