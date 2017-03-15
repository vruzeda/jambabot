(function() {

  var mongodb = require('../integrations/mongodb');

  function addComment(message, callback, comment) {
    mongodb.addSilvioComment(comment, function(error) {
      if (error) {
        console.log(error);
        callback('Não entendi nada....');
        return;
      }

      callback('Show');
    })
  }

  module.exports = {
    pattern: /^add comment (.*)?$/,
    handler: addComment,
    description: '*silviao add comment*: Adds a new comment',
    channels: ['admin']
  };

})();
