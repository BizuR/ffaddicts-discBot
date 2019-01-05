# ffaddicts-discBot

To be able to run this bot, you will need : 
- nodeJS (6.0.0 or newer)
- typescript (npm install -g typescript)
- discord.js module (npm install --save Discord.js)
- node-fetch module (npm install node-fetch)
- types for node-fetch (npm install @types/node-fetch)

To run the bot : 
- build your ts classes with "tsc" command.
- run the bot with "node target/bot-main.js <init-file>" (take care, init-file must be relative to target dir and not launching dir).

Example of json property file : 

*******************************************
{
    "discordBot": {
        "secretKey": "foo"
    },
    "xivApi": {
        "secretKey": "bar",
        "baseUrl" : "api_baseurl"
    }
}
*******************************************