import { RichEmbed } from 'discord.js';
import {Recipe} from './recipeBean';

export class DiscordFormatter {
   
    formatRecipe(recipe : Recipe){
        const embedResponse = new RichEmbed();
        embedResponse.setAuthor(recipe.name,recipe.job.iconUrl.toString());
        embedResponse.setDescription(recipe.craftType + ", lvl : " + recipe.levelRequired + ", durabilité : "+ recipe.durability);
        embedResponse.setThumbnail(recipe.iconUrl.toString());
        embedResponse.addField("Difficulté", recipe.difficulty, true);
        embedResponse.addField("Qualité", recipe.quality, true);
        for(let i= 0; i < recipe.ingredients.length; i++){
            embedResponse.addField(recipe.ingredients[i].quantity + "x " + recipe.ingredients[i].item.name, 
                                       "(" + recipe.ingredients[i].item.name + ") " + recipe.ingredients[i].item.description);
        }
        embedResponse.setFooter("sources from xivapi.com");
        return embedResponse;
    }
  }