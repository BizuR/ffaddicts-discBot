import * as Discord from 'discord.js';
import * as whois from './whois';
import * as stats from './stats';
import { XIVapi } from './classes/XIVapi';
const propsXivapi = require(process.argv[2]);
const xivapi_key = propsXivapi.xivApi.secretKey;

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
         let rec = await XIVapi.getRecipe(recipeName);
         msg.channel.send(rec.formatRecipe("discord"));
    }
   }

    static ffstats(msg : Discord.Message) {
       stats.execute(msg, xivapi_key);
    }

    static ffwhois(msg : Discord.Message) {
      whois.execute(msg, xivapi_key);
    }
  };