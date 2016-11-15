(function() {

  var mongodb = require('../integrations/mongodb');

  function downvote(message, callback, dish) {
    mongodb.isValidDish(dish, function(error, isValidDish) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.downvoteDish(message.userName, dish, function(error) {
          if (error) {
            callback('Não entendi nada....');
            return;
          }

          callback('Vixxxxxxi c lascou kkkkk');
        });
      } else {
        callback('C fude. Kkkkkkkk');
      }
    });
  }

  module.exports = {
    pattern: /^downvote (.+)$/,
    handler: downvote,
    description: '*silviao downvote [dish name]* : Adds an downvote for the specified dish'
  };

})();
