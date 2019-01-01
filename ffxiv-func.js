const whois = require('./whois');

module.exports = {
    ffwhois: function(msg) {
       whois(msg)
    },

    fftest:function(msg){
        msg.reply('Ca fonctionne !');
    }
  };