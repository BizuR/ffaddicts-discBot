const PropertiesReader = require('properties-reader');
const properties = PropertiesReader(process.argv[2]);
const xivapi_key = properties.get("xivapi.secret.key");
const whois = require('./whois');
const recipe = require('./recipe');

module.exports = {
    ffwhois: function(msg) {
       whois(msg, xivapi_key);
    },

    ffrecipe: function(msg) {
        recipe(msg, xivapi_key);
     }
  };