(function() {

  function comenta(callback) {
    // Do nothing!
    callback(null);
  }

  module.exports = {
    pattern: /^(?:comenta)|(?:comentar)|(?:vai dizer)|(?:diria).*$/,
    handler: comenta,
    description: '*silviao comenta*: Just ignores this command, since it\'s handled by Slackbot'
  };

})();
