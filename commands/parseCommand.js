(function() {

  var isValidCommand = require('./utils/isValidCommand');

  function parseCommand(message, callback) {
    var parsed = false;

    var commands = require('./commands');

    for (var i = 0; !parsed && i < commands.length; ++i) {
      var command = commands[i];

      var match;

      if (command.acceptsPreFormattedText) {
        match = message.preFormattedText.match(command.pattern);
      }

      if (!match) {
        match = message.userText.match(command.pattern);
      }

      if (match) {
        if (isValidCommand(command, message)) {
          command.handler.apply(this, [message, callback].concat(match.slice(1)));
        } else {
          callback('C fude kkkkk');
        }
        parsed = true;
      }
    }
  }

  module.exports = parseCommand;

})();
