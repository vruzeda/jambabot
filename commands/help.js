(function() {

  var isValidCommand = require('./utils/isValidCommand');

  function help(message, callback, invalidCommand) {
    var help;

    if (invalidCommand) {
      help = 'Vixxxxxxxi... não entendi nada ..... "' + invalidCommand + '". Veja aii :\n>>>';
    } else {
      help = 'Então o que me diz disso aiiii :\n>>>';
    }

    var commands = require('./commands');
    for (var command of commands) {
      if (isValidCommand(command, message)) {
        help += command.description + '\n';
      }
    }

    callback(help);
  }

  module.exports = {
    pattern: /^ajuda$/,
    handler: help,
    description: '*silviao ajuda* : shows a list of valid commands',
    channels: undefined
  };

})();
