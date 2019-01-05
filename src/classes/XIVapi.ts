import fetch from 'node-fetch';
import { Item } from './itemBean';
import { JobClass } from './jobClassBean';
import { IngredientForRecipe, Recipe } from './recipeBean';
import * as LRU from 'lru-cache';

const props = require(process.cwd() + "/" + process.argv[2]);
const xivapi_key = props.xivApi.secretKey;
const xivapi_baseurl = props.xivApi.baseUrl;
const cacheOptions: any = {};
cacheOptions.max = 100;
cacheOptions.maxAge = 60 * 60 * 1000;
const cache: any = new LRU(cacheOptions);


export class XIVapi {

    public static async getRecipe(name: string) {
        try {
            //if in cache
            if (cache.has('recipe-'+name)) {
                let recipe_id = cache.get('recipe-'+name);
                console.log('cache used ! ' + name + " => " + recipe_id);
                return cache.get('recipe-'+recipe_id);
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
                    const rec = new Recipe();
                    rec.id = recipeInfo.ID;
                    rec.name = recipeInfo.Name;
                    rec.difficulty = recipeInfo.RecipeLevelTable.Difficulty;
                    rec.quality = recipeInfo.RecipeLevelTable.Quality;
                    rec.durability = recipeInfo.RecipeLevelTable.Durability;
                    rec.craftType = recipeInfo.CraftType.Name;
                    rec.levelRequired = recipeInfo.RecipeLevelTable.ClassJobLevel;
                    rec.job = new JobClass(recipeInfo.ClassJob.Abbreviation, recipeInfo.ClassJob.ClassJobCategoryTargetID, new URL(xivapi_baseurl + recipeInfo.ClassJob.Icon));
                    rec.iconUrl = new URL(xivapi_baseurl + recipeInfo.Icon);
                    for (let i = 0; i < 9; i++) {
                        if (recipeInfo["AmountIngredient" + i] > 0) {
                            let item = new Item(recipeInfo["ItemIngredient" + i].Name, recipeInfo["ItemIngredient" + i].ItemUICategory.Name, recipeInfo["ItemIngredient" + i].Description);
                            let ingredient = new IngredientForRecipe(recipeInfo.ID, recipeInfo["AmountIngredient" + i], item);
                            rec.addIngredient(ingredient);
                        }
                    }
                    cache.set('recipe-'+name, rec.id);
                    cache.set('recipe-'+rec.id, rec);
                    return rec;
                }
            }
        } catch (err) {
            throw err;
        }

    }

    //public static async getCharacter(name: string) {

    //}
}