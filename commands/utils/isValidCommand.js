(() => {
  function isValidCommand(command, message) {
    return !message.channel || (message.channel === 'allow') || !command.channels || (command.channels.indexOf(message.channel) >= 0);
  }

  module.exports = isValidCommand;
})();
