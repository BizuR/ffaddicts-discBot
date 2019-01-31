# ffaddicts-discBot

To be able to run this bot, you will need : 
- nodeJS (6.0.0 or newer)
- typescript (npm install -g typescript)
- discord.js module (npm install --save discord.js)
- node-fetch module (npm install node-fetch)
- types for node-fetch (npm install @types/node-fetch)
- momentJS (npm install moment)
- lru-cache (npm install lru-cache)
- types for lru-cache (npm install @types/lru-cache)
- persistent-cache (npm install persistent-cache)

To run the bot : 
- build your ts classes with "tsc" command.
- run the bot with "node target/bot-main.js <init-file>"

Example of json property file : 

*******************************************
{
    "discordBot": {
        "secretKey": "foo"
    },
    "xivApi": {
        "secretKey": "bar",
        "baseUrl" : "https://url",
        "language" : "fr"
    }
}
*******************************************
