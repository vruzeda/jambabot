(function() {

  var mongodb = require('../integrations/mongodb');

  function comenta(message, callback) {
    mongodb.getRandomSilvioComment(function(error, comment) {
      if (error) {
        callback('Vixxxxxxxi...');
        return;
      }

      callback(comment);
    });
  }

  module.exports = {
    pattern: /^.*(?:comenta)|(?:comentar)|(?:vai dizer)|(?:diria).*$/,
    handler: comenta,
    description: '*silviao comenta*: I have reached sentience, try it out',
    channels: undefined
  };

})();
