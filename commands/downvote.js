const mongodb = require('../integrations/mongodb');

(() => {
  function downvote(message, callback, dish) {
    mongodb.isValidDish(dish, (errorValidatingDish, isValidDish) => {
      if (errorValidatingDish) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.downvoteDish(message.userName, dish, (errorDownvoting) => {
          if (errorDownvoting) {
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
    description: '*silviao downvote [dish name]* : Adds an downvote for the specified dish',
    channels: {'silviao': ['#delicias-do-jamba', '#dev-delicias-do-jamba', '@direct_message']}
  };
})();
