import { RichEmbed } from 'discord.js';
import {Recipe} from './recipe';
import {Character} from './character';
import { Item } from './item';

export class DiscordFormatter {
    formatJobs(character: Character) {
        const embedResponse = new RichEmbed();
    }
    formatStats(character: Character) {
        const embedResponse = new RichEmbed();
    }
    formatCharInfos(character: Character) {
        const embedResponse = new RichEmbed();
        embedResponse.setAuthor(character.name + ", " + character.activeJob.abbreviation + " " + character.getLevel(character.activeJob),character.activeJob.iconUrl.toString());
        embedResponse.setDescription(character.title);
        embedResponse.setImage(character.portrait.toString());
        embedResponse.setThumbnail(character.avatar.toString());
        embedResponse.setFooter("sources from xivapi.com");
        return embedResponse;
    }
   
    formatRecipe(recipe : Recipe){
        const embedResponse = new RichEmbed();
        embedResponse.setAuthor(recipe.name,recipe.job.iconUrl.toString());
        embedResponse.setDescription(recipe.craftType + ", lvl : " + recipe.levelRequired + ", durabilité : "+ recipe.durability);
        embedResponse.setThumbnail(recipe.iconUrl.toString());
        embedResponse.addField("Difficulté", recipe.difficulty, true);
        embedResponse.addField("Qualité", recipe.quality, true);
        recipe.ingredients.forEach((value: number, key: Item) => {
            embedResponse.addField(value + "x " + key.name, "(" + key.name + ") " + key.description);
        });
        embedResponse.setFooter("sources from xivapi.com");
        return embedResponse;
    }
  }