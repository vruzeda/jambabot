(function() {

  var mongodb = require('../integrations/mongodb.js');

  function upvote(callback, dish) {
    mongodb.upvoteDish(dish, function(error) {
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
