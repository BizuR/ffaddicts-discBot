const Discord = require('discord.js');
const client = new Discord.Client();
const ffapi = require('./ffxiv-func');


client.on('ready', () => {
  console.log('Logged in as ${client.user.tag}!');
  });

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  } else {
    if (msg.content.startsWith('!ff')){
      let fullcmd = msg.content.split(" ")[0];
      let result = ffapi[fullcmd.substring(1,fullcmd.length)](msg);
    }
  }
});

client.login('xxx');

