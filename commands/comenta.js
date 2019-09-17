const mongodb = require('../integrations/mongodb');

(() => {
  function comenta(message, callback) {
    mongodb.getRandomSilvioComment()
      .then(callback)
      .catch(() => {
        callback('Vixxxxxxxi...');
      });
  }

  module.exports = {
    pattern: /^.*(?:comenta)|(?:comentar)|(?:vai dizer)|(?:diria).*$/,
    handler: comenta,
    description: '*silviao comenta*: I have reached sentience, try it out',
    channels: undefined
  };
})();
