const Discord = require('discord.js');
const client = new Discord.Client();
const ffapi = require('./ffxiv-func');
const {botapi_key} = require('./constantes');

client.on('ready', () => {
  console.log('Logged in as ${client.user.tag}!');
  });

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  } else {
    if (msg.content.startsWith('!ff')){
      let fullcmd = msg.content.split(" ")[0];
      ffapi[fullcmd.substring(1,fullcmd.length)](msg);
    }
  }
});

client.login(botapi_key);

