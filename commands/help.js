(function() {

  function help(message, callback, invalidCommand) {
    var help;

    if (invalidCommand) {
      help = 'Vixxxxxxxi... não entendi nada ..... "' + invalidCommand + '". Veja aii :\n>>>';
    } else {
      help = 'Então o que me diz disso aiiii :\n>>>';
    }

    var commands = require('./commands');
    for (var i = 0; i < commands.length; ++i) {
      help += commands[i].description + '\n';
    }

    callback(help);
  }

  module.exports = {
    pattern: /^ajuda$/,
    handler: help,
    description: '*silviao ajuda* : shows a list of valid commands'
  };

})();
