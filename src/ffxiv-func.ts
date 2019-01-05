import * as Discord from 'discord.js';
import * as whois from './whois';
import * as stats from './stats';
import { XIVapi } from './classes/XIVapi';
const props = require(process.cwd() + "/" + process.argv[2]);
const xivapi_key = props.xivApi.secretKey;

export class ffxiv_func {
    static async ffrecipe(msg : Discord.Message) {
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

    static async ffstats(msg : Discord.Message) {
       stats.execute(msg, xivapi_key);
    }

    static async ffwhois(msg : Discord.Message) {
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
      //whois.execute(msg, xivapi_key);
    }
  };