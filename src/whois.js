const fetch = require('node-fetch');
const Discord = require('discord.js');

 module.exports = async function whois (msg, xivapi_key) {

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
            let responseSearch = await fetch("https://xivapi.com/character/search?name=" + playerName + "&server=" + serverName +"&key=" + xivapi_key);
            let charsList = await responseSearch.json();
            if (charsList.Pagination.Results >= 0){
                let responseChar = await fetch("https://xivapi.com/character/" + charsList.Results[0].ID + "?key=" + xivapi_key);
                let charInfo = await responseChar.json();
                if (charInfo.Info.Character.State === 1){
                    msg.channel.send('Attends 2 minutes que je recherche un peu dans ma mémoire.')
                } else {
                    if (charInfo.Character.Title !== null){
                        let responseTitle = await fetch ("https://xivapi.com/Title/" + charInfo.Character.Title + "?language=fr" +"&key=" + xivapi_key);
                        let titleInfo = await responseTitle.json();
                        var titleLabel = charInfo.Character.Gender === 1 ? titleInfo.Name : titleInfo.NameFemale;
                    }
                    let responseJobs = await fetch ("https://xivapi.com/ClassJob/" + charInfo.Character.ActiveClassJob.JobID + "?language=fr" +"&key=" + xivapi_key);
                    let jobInfo = await responseJobs.json();
                    const jobLabel = jobInfo.Abbreviation;           
                    const embedResponse = new Discord.RichEmbed();
                    embedResponse.setAuthor(charInfo.Character.Name + ", " + jobLabel + " " + charInfo.Character.ActiveClassJob.Level,"https://xivapi.com" + jobInfo.Icon);
                    embedResponse.setDescription(titleLabel);
                    embedResponse.setImage(charInfo.Character.Portrait);
                    embedResponse.setThumbnail(charInfo.Character.Avatar);
                    embedResponse.setFooter("sources from xivapi.com");
                    msg.channel.send(embedResponse);
                 }
            }
        }
    };


