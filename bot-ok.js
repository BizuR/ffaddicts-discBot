const Discord = require('discord.js');
const request = require('request');
const client = new Discord.Client();



client.on('ready', () => {
  console.log('Logged in as ${client.user.tag}!');
  });

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    } else {
        if (msg.content.startsWith('!ff-whois')){
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
                msg.reply('Utilisation ff-whois <server> <character>');
            } else {
                request('https://xivapi.com/character/search?name=' + playerName + '&server=' + serverName + '&key=xxx',{ json: true }, (err, res, body) => {
                    if (err) {
                        return console.log(err)
                    }
                    console.log(body)
                    let listPlayers = body.Pagination.Results
                    if(listPlayers >= 0){
                        request('https://xivapi.com/character/' + body.Results[0].ID + '?key=xxx',{ json: true }, (err, res, body) => {
                            if (err) {
                                return console.log(err)
                            }
                            console.log(body)
                            let infoPlayer = body.Info.Character.State
                            if (infoPlayer === 1){
                                msg.channel.send('Attends 2 minutes que je recherche un peu dans ma mémoire.')
                            } else {
                                msg.channel.send(body.Character.Portrait)
                                msg.channel.send(body.Character.Name + " possède " + body.Character.Minions.length + " mascottes et " + body.Character.Mounts.length + " montures :)")
                            }
                        })
                    }
                });      
            }
        }
    }
});

client.login('xxx');
