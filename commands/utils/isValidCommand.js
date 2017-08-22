(() => {
  function isValidCommand(command, message) {
    if (!!command.channels) {
      return isValidGlobalChannel(command, message) || isValidChannelInTeam(command, message);
    } else {
      // Commands that don't specify channels are always available
      return true;
    }
  }

  function isValidGlobalChannel(command, message) {
    return Array.isArray(command.channels) && (command.channels.indexOf(message.channel) >= 0);
  }

  function isValidChannelInTeam(command, message) {
    return Array.isArray(command.channels[message.team]) && (command.channels[message.team].indexOf(message.channel) >= 0);
  }

  module.exports = isValidCommand;
})();
