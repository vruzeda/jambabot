(function() {

  var mongodb = require('../integrations/mongodb');

  function upvote(message, callback, dish) {
    mongodb.isValidDish(dish, function(error, isValidDish) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.upvoteDish(message.userName, dish, function(error) {
          if (error) {
            callback('Não entendi nada....');
            return;
          }

          callback('Show');
        });
      } else {
        callback('C fude. Kkkkkkkk');
      }
    });
  }

  module.exports = {
    pattern: /^upvote (.+)$/,
    handler: upvote,
    description: '*silviao upvote [dish name]* : Adds an upvote for the specified dish',
    channels: ['delicias-do-jamba', 'dev-delicias-do-jamba']
  };

})();
