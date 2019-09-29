const isValidCommand = require('./utils/isValidCommand');

(() => {
  function matchCommand(command, message) {
    let match;

    if (command.acceptsPreFormattedText) {
      match = message.preFormattedText.match(command.pattern);
    }

    if (!match) {
      match = message.userText.match(command.pattern);
    }

    return match;
  }

  function parseCommand(message) {
    /* eslint-disable global-require */
    const commands = require('./commands');
    /* eslint-enable global-require */

    const matchingCommand = commands.find((command) => matchCommand(command, message));
    if (!matchingCommand) {
      return Promise.resolve(undefined);
    }

    if (!isValidCommand(matchingCommand, message)) {
      return Promise.resolve('C fude kkkkk');
    }

    const match = matchCommand(matchingCommand, message);
    return matchingCommand.handler(message, ...match.slice(1));
  }

  module.exports = parseCommand;
})();
