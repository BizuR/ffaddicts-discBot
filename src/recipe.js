const fetch = require('node-fetch');
const Discord = require('discord.js');

 module.exports = async function whois (msg, xivapi_key) {

        let cmdargs = msg.content.split(" ");
        let recipeName = "";
        if (cmdargs.length > 1){
            cmdargs.shift();
            recipeName = cmdargs.join(' ');
        }
        if (recipeName === ''){
            msg.reply('Utilisation !ffrecipe <recipeName>');
        } else {
            let responseSearch = await fetch("https://xivapi.com/search?language=fr&indexes=recipe&key=" + xivapi_key + "&string=" + encodeURIComponent(recipeName));
            let searchList = await responseSearch.json();
            if (searchList.Pagination.Results === 0){
                //renvoyer la liste des recettes.
                msg.reply("Aucun nom ne correspond de près ou de loin.");
            } else if (searchList.Pagination.Results > 1) {
                let response = "Demande trop vague, quelques pistes :";
                for(let i= 0; (i < searchList.Pagination.Results) && (i < 5); i++){
                    response += "\n- " + searchList.Results[i].Name;
                }
                msg.reply(response);
            } else {
                //chercher plus d'info sur la recette
                let responseRecipe = await fetch("https://xivapi.com/recipe/" + searchList.Results[0].ID + "?language=fr&key=" + xivapi_key);
                let recipeInfo = await responseRecipe.json();
                const embedResponse = new Discord.RichEmbed();
                console.log(recipeInfo.ID);
                embedResponse.setAuthor(recipeInfo.Name,"https://xivapi.com" + recipeInfo.ClassJob.Icon);
                embedResponse.setDescription(recipeInfo.CraftType.Name + ", lvl : " + recipeInfo.RecipeLevelTable.ClassJobLevel + ", durabilité : "+ recipeInfo.RecipeLevelTable.Durability);
                embedResponse.setThumbnail("https://xivapi.com" + recipeInfo.Icon);
                embedResponse.addField("Difficulté", recipeInfo.RecipeLevelTable.Difficulty, true);
                embedResponse.addField("Qualité", recipeInfo.RecipeLevelTable.Quality, true);
                for(let i= 0; i < 9; i++){
                    if(recipeInfo["AmountIngredient"+i] > 0){
                        embedResponse.addField(recipeInfo["AmountIngredient"+i] + "x " + recipeInfo["ItemIngredient"+i].Name, 
                                               "(" + recipeInfo["ItemIngredient"+i].ItemUICategory.Name + ") " + recipeInfo["ItemIngredient"+i].Description);
                    }
                }
                embedResponse.setFooter("sources from xivapi.com");
                msg.channel.send(embedResponse);
            }
        }
    };


