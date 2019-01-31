import * as Discord from 'discord.js';
import { HACache } from './classes/misc/cache';
import { Character } from './classes/beans/character';
import { FFEvent } from './classes/beans/ffevent';
import { Role } from './classes/beans/role';
const cache_player = new HACache(process.cwd() + "/exec/",'bot-ffplayers.db');
const cache_event = new HACache(process.cwd() + "/exec/",'bot-ffevents.db');

export class ffevent_func {
    static async create(msg : Discord.Message) : Promise<void> {
      let cmdargs = msg.content.split(" ");
      cmdargs.shift();
      cmdargs.shift();
      if (cmdargs.length < 4){
        msg.reply('Utilisation !ffevent create <name> <date DD/MM/YYYY> <heure hh:mm> <dureeInMin>');
      } else {
        console.log("name : " + cmdargs[0]);
        let name : string = cmdargs[0];
        console.log("date : " + cmdargs[1] + " " + cmdargs[2]);
        let date : string = cmdargs[1] + " " + cmdargs[2];
        console.log("duree : " + cmdargs[3]);
        let duree : number = Number.parseInt(cmdargs[3]);
        let event : FFEvent = new FFEvent(name, date, duree);
        cache_event.put(name, FFEvent.cache(event));
        let msgsent = await msg.channel.send("L'événement " + name + " a été créé par " + msg.author.toString());
        if (msgsent instanceof Array){
            let curMsg : Discord.Message = msgsent[0] as Discord.Message;
            curMsg.pin();
        } else {
            let curMsg : Discord.Message = msgsent as Discord.Message;
            curMsg.pin();
        }
      }
    }

   static async suscribe(msg : Discord.Message) : Promise<void> {
        let cmdargs = msg.content.split(" ");
        cmdargs.shift();
        cmdargs.shift();
        if (cmdargs.length < 2){
            msg.reply('Utilisation !ffevent suscribe <name> <role>');
        } else {
            let name : string = cmdargs[0];
            let role : Role = new Role(cmdargs[1], cmdargs[1]);
            let char : Character = Character.uncache(cache_player.get(msg.author.tag));
            if (!cache_event.exists(name)){
                msg.reply("Event " + name + " inexistant.");
            } else{
                let event : FFEvent = FFEvent.uncache(cache_event.get(name));
                event.addParticipant(msg.author.tag, role.name);
                cache_event.put(name, FFEvent.cache(event));
                msg.channel.send(msg.author.toString() + " participe désormais à l'événement " + name + " en qualité de " + role.name + " avec " + char.name);
                msg.channel.send("Pour ne pas l'oublier, tu peux l'ajouter via cette url : "+event.getGCalendarLink());
            }
        }
    } 
    
    static async delete(msg : Discord.Message) : Promise<void> {
        let cmdargs = msg.content.split(" ");
        cmdargs.shift();
        cmdargs.shift();
        if (cmdargs.length < 1){
            msg.reply('Utilisation !ffevent suscribe <name>');
        } else {
            let name : string = cmdargs[0];
            if (!cache_event.exists(name)){
                msg.reply("Event " + name + " inexistant.");
            } else{
                msg.channel.send("Nan, j'ai pas vraiment envie en fait ;-)");
            }

        }
    }

    static async list(msg : Discord.Message) : Promise<void> {
        let cmdargs = msg.content.split(" ");
        cmdargs.shift();
        cmdargs.shift();
        let listEvt : FFEvent[] = [];
        cache_event.keys().forEach(element => {
            let curEvt : FFEvent = FFEvent.uncache(cache_event.get(element));
            listEvt.push(curEvt);
        });
        listEvt.sort((a, b) => {
            if (a.date > b.date) return 1;
            else if (a.date < b.date) return -1;
            else return 0; 
        });
        let valid : number = 0;
        listEvt.forEach(element => {
            if (element.date.valueOf() > Date.now()) {
                if (valid === 0){
                    msg.channel.send("Voici les events en cours : ");
                }
                msg.channel.send(element.date.format('LLLL') + " - " + element.name + ", " + element.participants.size + " inscrit(s).");
                valid++;
            }
        });
        msg.channel.send("Event(s) trouvé(s) : " +listEvt.length+ ". En cours : " + valid + ". Terminé(s) : " + (listEvt.length - valid));
    }
};
