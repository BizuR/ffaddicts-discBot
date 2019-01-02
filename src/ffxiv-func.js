const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(process.argv[2]);
const xivapi_key = properties.get("xivapi.secret.key");
const whois = require('./whois');
const stats = require('./stats');

module.exports = {
    ffwhois: function(msg) {
       whois(msg, xivapi_key);
    },

    ffstats: function(msg) {
        stats(msg, xivapi_key);
    },
    fftest: function(msg){
        msg.reply('Ca fonctionne !');
    }

  };