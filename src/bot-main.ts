import * as Discord from 'discord.js';
import {ffxiv_func} from './ffxiv-func';
import {ffevent_func} from './ffevent-func';
const client = new Discord.Client();
const props = require(process.cwd() + "/" + process.argv[2]);


client.on('ready', () => {
  console.log('Logged in as ' + client.user.tag + ' !');
  });

client.on('message', msg => {
  if (msg.content.startsWith('!ffevent')){
    let fullcmd = msg.content.split(" ")[1];
    ffevent_func[fullcmd](msg);
  }
  else if (msg.content.startsWith('!ff')){
    let fullcmd = msg.content.split(" ")[0];
    ffxiv_func[fullcmd.substring(1,fullcmd.length)](msg);
  }
});
client.login(props.discordBot.secretKey);