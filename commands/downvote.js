const mongodb = require('../integrations/mongodb');

(() => {
  function downvote(message, callback, dish) {
    mongodb.isValidDish(dish, (error, isValidDish) => {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.downvoteDish(message.userName, dish, (errorDownVote) => {
          if (errorDownVote) {
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
    channels: ['delicias-do-jamba', 'dev-delicias-do-jamba']
  };
})();
