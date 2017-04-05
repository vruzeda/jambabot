const isValidCommand = require('./utils/isValidCommand');
const commands = require('./commands');

(() => {
  function help(message, callback, invalidCommand) {
    let helpText;

    if (invalidCommand) {
      helpText = `Vixxxxxxxi... não entendi nada ..... "${invalidCommand}". Veja aii :\n>>>`;
    } else {
      helpText = 'Então o que me diz disso aiiii :\n>>>';
    }

    commands.forEach((command) => {
      if (isValidCommand(command, message)) {
        helpText += `${command.description}\n`;
      }
    });


    callback(helpText);
  }

  module.exports = {
    pattern: /^ajuda$/,
    handler: help,
    description: '*silviao ajuda* : shows a list of valid commands',
    channels: undefined
  };
})();
