const mongodb = require('../integrations/mongodb');

(() => {
  function downvote(message, dish) {
    return mongodb.isValidDish(dish)
      .catch(() => {
        throw new Error('Não entendi nada....');
      })
      .then((isValidDish) => {
        if (!isValidDish) {
          throw new Error('C fude. Kkkkkkkk');
        }

        return mongodb.downvoteDish(message.userName, dish)
          .catch(() => {
            throw new Error('Não entendi nada....');
          });
      })
      .then(() => 'Vixxxxxxi c lascou kkkkk')
      .catch((error) => error.message);
  }

  module.exports = {
    pattern: /^downvote (.+)$/,
    handler: downvote,
    description: '*silviao downvote [dish name]* : Adds an downvote for the specified dish',
    channels: { silviao: ['#delicias-do-jamba', '#dev-delicias-do-jamba', '@direct_message'] },
  };
})();
