(function() {

  var help = require('./help.js');

  function parseCommand(callback, userCommand) {
    var parsed = false;

    var commands = require('./commands.js');

    for (var i = 0; !parsed && i < commands.length; ++i) {
      var command = commands[i];

      var match = userCommand.match(command.pattern);
      if (match) {
        command.handler.apply(this, [callback].concat(match.slice(1)));
        parsed = true;
      }
    }

    if (!parsed) {
      help.handler(callback, userCommand);
    }
  }

  module.exports = parseCommand;

})();
