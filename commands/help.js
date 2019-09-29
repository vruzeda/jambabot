const isValidCommand = require('./utils/isValidCommand');

(() => {
  function help(message, invalidCommand) {
    let helpText;

    /* eslint-disable global-require */
    const commands = require('./commands');
    /* eslint-enable global-require */

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

    return Promise.resolve(helpText);
  }

  module.exports = {
    pattern: /^ajuda$/,
    handler: help,
    description: '*silviao ajuda* : shows a list of valid commands',
    channels: undefined,
  };
})();
