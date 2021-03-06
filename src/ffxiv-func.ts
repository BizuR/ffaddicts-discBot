import * as Discord from 'discord.js';
import * as stats from './stats';
import { XIVapi } from './classes/apis/XIVdata';
const props = require(process.cwd() + "/" + process.argv[2]);
const xivapi_key = props.xivApi.secretKey;
import { HACache } from './classes/misc/cache';
import { Character } from './classes/beans/character';
const cache_player = new HACache(process.cwd() + "/exec/",'bot-ffplayers.db');

export class ffxiv_func {
    static async ffrecipe(msg : Discord.Message) : Promise<void> {
      let cmdargs = msg.content.split(" ");
      let recipeName = "";
      if (cmdargs.length > 1){
          cmdargs.shift();
          recipeName = cmdargs.join(' ');
      }
      if (recipeName === ''){
          msg.reply('Utilisation !ffrecipe <recipeName>');
      } else {
          try{
            let rec = await XIVapi.getRecipe(recipeName);
            msg.channel.send(rec.formatRecipe("discord"));
          } catch (err) {
              msg.reply(err);
          }
      }
   }

    static async ffstats(msg : Discord.Message) : Promise<void> {
       stats.execute(msg, xivapi_key);
    }

    static async ffwhois(msg : Discord.Message) : Promise<void> {
        let cmdargs = msg.content.split(" ");
        let playerName = "";
        let serverName = "";
        if (cmdargs.length > 2){
            cmdargs.shift();
            serverName = cmdargs[0];
            cmdargs.shift();
            playerName = cmdargs.join(' ');
        }
        if (playerName === '' || serverName === ''){
            msg.reply('Utilisation !ffwhois <server> <character>');
        } else {
            try{
              let char = await XIVapi.getCharacter(serverName,playerName);
              msg.channel.send(char.formatInfos("discord"));
            } catch (err) {
                msg.reply(err);
            }
        }
    }

    static async ffiam(msg : Discord.Message) : Promise<void> {
        let cmdargs = msg.content.split(" ");
        let playerName = "";
        let serverName = "";
        if (cmdargs.length > 2){
            cmdargs.shift();
            serverName = cmdargs[0];
            cmdargs.shift();
            playerName = cmdargs.join(' ');
        }
        if (playerName === '' || serverName === ''){
            msg.reply('Utilisation !ffiam <server> <character>');
        } else {
            try{
              let char = await XIVapi.getCharacter(serverName,playerName);
              cache_player.put(msg.author.tag,Character.cache(char));
              msg.channel.send(playerName + " on " + serverName + " affecté(e) à " + msg.author.toString());
              msg.channel.send(char.formatInfos("discord"));
            } catch (err) {
                msg.reply(err);
            }
        }
    }

    static async ffwhoami(msg : Discord.Message) : Promise<void> {
        try{
          let char : Character = Character.uncache(cache_player.get(msg.author.tag));
          msg.channel.send(msg.author.toString() + " associé(e) à " + char.name);
          msg.channel.send(char.formatInfos("discord"));
            } catch (err) {
                msg.reply(err);
            }
        }
    };