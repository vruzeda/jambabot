(() => {
  function isValidChannel(commandChannels, message) {
    return Array.isArray(commandChannels) && (commandChannels.indexOf(message.channel) >= 0);
  }

  function isValidGlobalChannel(command, message) {
    return isValidChannel(command.channels, message);
  }

  function isValidChannelInTeam(command, message) {
    return isValidChannel(command.channels[message.team], message);
  }

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

  module.exports = isValidCommand;
})();
