import fetch from 'node-fetch';
import { Recipe, IngredientForRecipe } from './recipeBean';
import { JobClass } from './jobClassBean';
import { Item } from './itemBean';
const props = require('../'+process.argv[2]);
const xivapi_key = props.xivApi.secretKey;
const xivapi_baseurl = props.xivApi.baseUrl;


export class XIVapi {
    
    public static async getRecipe(name : string) {
        let responseSearch = await fetch(xivapi_baseurl + "/search?language=fr&indexes=recipe&key=" + xivapi_key + "&string=" + encodeURIComponent(name));
        let searchList = await responseSearch.json();
        if (searchList.Pagination.Results === 0){
            //renvoyer la liste des recettes.
            //msg.reply("Aucun nom ne correspond de près ou de loin.");
            //retourner une erreur
            console.log("Pas assez !");
        } else if (searchList.Pagination.Results > 1) {
            let response = "Demande trop vague, quelques pistes :";
            for(let i= 0; (i < searchList.Pagination.Results) && (i < 5); i++){
                response += "\n- " + searchList.Results[i].Name;
            }
            //retourner une réponse avec les possibilités
            //msg.reply(response);
            console.log("Oups, de trop");
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
            for(let i= 0; i < 9; i++){
                if(recipeInfo["AmountIngredient"+i] > 0){
                    let item = new Item(recipeInfo["ItemIngredient"+i].Name, recipeInfo["ItemIngredient"+i].ItemUICategory.Name, recipeInfo["ItemIngredient"+i].Description);
                    let ingredient = new IngredientForRecipe(recipeInfo.ID,recipeInfo["AmountIngredient"+i], item);
                    rec.addIngredient(ingredient);
                }
            }
            return rec;
        }

    }
}