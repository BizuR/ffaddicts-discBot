import { RichEmbed } from 'discord.js';
import {Recipe} from '../beans/recipe';
import {Character} from '../beans/character';
import { Item } from '../beans/item';

export class DiscordFormatter {
    formatJobs(character: Character) : RichEmbed {
        const embedResponse = new RichEmbed();
        return embedResponse;
    }
    formatStats(character: Character) : RichEmbed {
        const embedResponse = new RichEmbed();
        return embedResponse;
    }
    formatCharInfos(character: Character) : RichEmbed {
        const embedResponse = new RichEmbed();
        embedResponse.setAuthor(character.name + ", " + character.activeJob.abbreviation + " " + character.getLevel(character.activeJob),character.activeJob.iconUrl.toString());
        embedResponse.setDescription(character.title);
        embedResponse.setImage(character.portrait.toString());
        embedResponse.setThumbnail(character.avatar.toString());
        embedResponse.setFooter("sources from xivapi.com");
        return embedResponse;
    }
   
    formatRecipe(recipe : Recipe) : RichEmbed {
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