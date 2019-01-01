const fetch = require('node-fetch');
const xivapi_key = 'xxx';

module.exports = {
    ffwhois: async function(msg) {
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
            var response = await fetch("https://xivapi.com/character/search?name=" + playerName + "&server=" + serverName +"&key=" + xivapi_key);
            var charsList = await response.json();
            if (charsList.Pagination.Results >= 0){
                var response2 = await fetch("https://xivapi.com/character/" + charsList.Results[0].ID + "?key=" + xivapi_key);
                var charInfo = await response2.json();
                if (charInfo.Info.Character.State === 1){
                    msg.channel.send('Attends 2 minutes que je recherche un peu dans ma mémoire.')
                } else {
                    msg.channel.send(charInfo.Character.Portrait);
                    msg.channel.send(charInfo.Character.Name + " possède " + charInfo.Character.Minions.length + " mascottes et " + charInfo.Character.Mounts.length + " montures :)");
                }
            }
        }
    },

    fftest:function(msg){
        msg.reply('Ca fonctionne !');
    }
  };