(() => {
  function isValidCommand(command, message) {
    return !message.channel || !command.channels || (command.channels.indexOf(message.channel) >= 0);
  }

  module.exports = isValidCommand;
})();
