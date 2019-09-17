const mongodb = require('../integrations/mongodb');

(() => {
  function addComment(message, callback, comment) {
    mongodb.addSilvioComment(comment)
      .then(() => {
        callback('Show');
      })
      .catch((error) => {
        console.log(error);
        callback('Não entendi nada....');
      });
  }

  module.exports = {
    pattern: /^add comment ([^]*)$/,
    handler: addComment,
    description: '*silviao add comment*: Adds a new comment',
    channels: ['#admin'],
    acceptsPreFormattedText: true
  };
})();
