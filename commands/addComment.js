const mongodb = require('../integrations/mongodb');

(() => {
  function addComment(_message, comment) {
    return mongodb.addSilvioComment(comment)
      .then(() => 'Show')
      .catch(() => 'Não entendi nada....');
  }

  module.exports = {
    pattern: /^add comment ([^]*)$/,
    handler: addComment,
    description: '*silviao add comment*: Adds a new comment',
    channels: ['#admin'],
    acceptsPreFormattedText: true,
  };
})();
