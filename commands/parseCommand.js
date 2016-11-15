(function() {

  var help = require('./help');

  function parseCommand(message, callback) {
    var parsed = false;

    var commands = require('./commands');

    for (var i = 0; !parsed && i < commands.length; ++i) {
      var command = commands[i];

      var match = message.userText.match(command.pattern);
      if (match) {
        command.handler.apply(this, [message, callback].concat(match.slice(1)));
        parsed = true;
      }
    }

    if (!parsed) {
      help.handler(message, callback, message.userText);
    }
  }

  module.exports = parseCommand;

})();
