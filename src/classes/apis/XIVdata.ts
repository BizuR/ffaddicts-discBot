import { Item } from '../beans/item';
import { Recipe } from '../beans/recipe';
import { Character } from '../beans/character';
import { XIVcontent } from './XIVcontent';
import { XIVrequester } from './XIVrequestBuilder';
import { IMCache } from '../misc/cache';

const props = require(process.cwd() + "/" + process.argv[2]);
const xivapi_baseurl = props.xivApi.baseUrl;
const cache: any = new IMCache(100,60 * 60 * 1000);

export class XIVapi {

    public static async getRecipe(name: string) : Promise<Recipe> {
        try {
            //if in cache
            if (cache.exists('recipe-'+name)) {
                let recipe_id = cache.get('recipe-'+name);
                return cache.get('recipe-'+recipe_id);
            }
            //api search
            else {
                let searchList = await XIVrequester.searchContent('recipe',name);
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
                    let recipeInfo = await XIVrequester.getContent('recipe',searchList.Results[0].ID);
                    const rec : Recipe = new Recipe();
                    rec.id = recipeInfo.ID;
                    rec.name = recipeInfo.Name;
                    rec.en_name = recipeInfo.Name_en;
                    rec.difficulty = recipeInfo.RecipeLevelTable.Difficulty;
                    rec.quality = recipeInfo.RecipeLevelTable.Quality;
                    rec.durability = recipeInfo.RecipeLevelTable.Durability;
                    rec.craftType = recipeInfo.CraftType.Name;
                    rec.levelRequired = recipeInfo.RecipeLevelTable.ClassJobLevel;
                    rec.job = await XIVcontent.getJobClass(recipeInfo.ClassJob.ID);
                    rec.iconUrl = new URL(xivapi_baseurl + recipeInfo.Icon);
                    for (let i = 0; i < 9; i++) {
                        let curQte : number = recipeInfo["AmountIngredient" + i];
                        if (curQte > 0) {
                            let curItem = recipeInfo["ItemIngredient" + i];
                            let item : Item = new Item(curItem.Name, curItem.ItemUICategory.Name, curItem.Description, curItem.Name_en);
                            rec.addIngredient(item, curQte);
                        }
                    }
                    cache.put('recipe-'+name, rec.id);
                    cache.put('recipe-'+rec.id, rec);
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
            if (cache.exists('char-'+server+'-'+name)) {
                let char_id = cache.get('char-'+server+'-'+name);
                return cache.get('char-'+char_id);
            }
            //api search
            else {
                let charsList = await XIVrequester.searchCharacter(server, name);
                if (charsList.Pagination.Results === 0){
                    throw "Personnage inexistant, essaie autre chose !";
                } else {
                    let charInfo = await XIVrequester.getContent("character",charsList.Results[0].ID);
                    if (charInfo.Info.Character.State === 1){
                        throw 'Reviens dans 2 minutes, le temps que je recherche un peu dans mes archives.';
                    } else {
                        let charResponse : Character = new Character();
                        charResponse.id = charInfo.Character.ID;
                        charResponse.name = charInfo.Character.Name
                        if (charInfo.Character.Title !== null){
                            charResponse.title = await XIVcontent.getTitle(charInfo.Character.Title,charInfo.Character.Gender);
                        }
                        charResponse.avatar = charInfo.Character.Avatar;
                        charResponse.portrait = charInfo.Character.Portrait;
                        let listAttr = Object.keys(charInfo.Character.GearSet.Attributes);
                        let attrInfos = await XIVcontent.loadAttributes();
                        for(let i=0; i < listAttr.length; i++){
                            charResponse.addAttribute(attrInfos.get(Number.parseInt(listAttr[i]).valueOf()),charInfo.Character.GearSet.Attributes[listAttr[i]]);
                        };
                        let listJobs = Object.keys(charInfo.Character.ClassJobs);
                        let jobInfos = await XIVcontent.loadJobClasses();
                        for(let i=0; i < listJobs.length; i++){
                            let curJob = charInfo.Character.ClassJobs[listJobs[i]];
                            charResponse.addJob(jobInfos.get(curJob.JobID), curJob.Level);
                        };
                        charResponse.activeJob = await XIVcontent.getJobClass(charInfo.Character.ActiveClassJob.JobID);

                        cache.put('char-'+server+'-'+name, charResponse.id);
                        cache.put('char-'+charResponse.id, charResponse);
                        return charResponse;
                    }
                }
            }
        } catch (err) {
            throw err;
        }

    }

}