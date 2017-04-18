const isValidCommand = require('./utils/isValidCommand');

(() => {
  /* eslint global-require: 0 */
  function parseCommand(message, callback) {
    const commands = require('./commands');

    commands.some((command) => {
      let match;

      if (command.acceptsPreFormattedText) {
        match = message.preFormattedText.match(command.pattern);
      }

      if (!match) {
        match = message.userText.match(command.pattern);
      }

      if (match) {
        if (isValidCommand(command, message)) {
          const params = [message, callback];
          params.push(...match.slice(1));

          command.handler(...params);
        } else {
          callback('C fude kkkkk');
        }

        return true;
      }

      return false;
    });
  }

  module.exports = parseCommand;
})();
