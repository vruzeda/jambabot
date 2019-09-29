const mongodb = require('../integrations/mongodb');

(() => {
  function comenta() {
    return mongodb.getRandomSilvioComment()
      .catch(() => 'Vixxxxxxxi...');
  }

  module.exports = {
    pattern: /^.*(?:comenta)|(?:comentar)|(?:vai dizer)|(?:diria).*$/,
    handler: comenta,
    description: '*silviao comenta*: I have reached sentience, try it out',
    channels: undefined,
  };
})();
