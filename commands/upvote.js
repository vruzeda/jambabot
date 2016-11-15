(function() {

  var mongodb = require('../integrations/mongodb');

  function upvote(message, callback, dish) {
    mongodb.upvoteDish(message.userName, dish, function(error) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      callback('Show');
    });
  }

  module.exports = {
    pattern: /^upvote (.+)$/,
    handler: upvote,
    description: '*silviao upvote [dish name]* : Adds an upvote for the specified dish'
  };

})();
