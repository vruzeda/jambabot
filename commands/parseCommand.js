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
          command.handler(message, ...match.slice(1))
            .then(callback)
            .catch(callback);
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
