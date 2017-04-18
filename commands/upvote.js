const mongodb = require('../integrations/mongodb');

(() => {
  function upvote(message, callback, dish) {
    mongodb.isValidDish(dish, (errorValidatingDish, isValidDish) => {
      if (errorValidatingDish) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.upvoteDish(message.userName, dish, (errorUpvotingDish) => {
          if (errorUpvotingDish) {
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
