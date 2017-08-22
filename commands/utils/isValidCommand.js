(() => {
  function isValidCommand(command, message) {
    let isValid;
    if (command.channels) {
      isValid = isValidGlobalChannel(command, message) || isValidChannelInTeam(command, message);
    } else {
      // Commands that don't specify channels are always available
      isValid = true;
    }
    return isValid;
  }

  function isValidGlobalChannel(command, message) {
    isValidChannel(command.channels, message);
  }

  function isValidChannelInTeam(command, message) {
    isValidChannel(command.channels[message.team], message);
  }

  function isValidChannel(commandChannels, message) {
    return Array.isArray(commandChannels) && (commandChannels.indexOf(message.channel) >= 0);
  }

  module.exports = isValidCommand;
})();
