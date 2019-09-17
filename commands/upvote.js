const mongodb = require('../integrations/mongodb');

(() => {
  function upvote(message, dish) {
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
      .then(() => 'Show')
      .catch(error => error.message);
  }

  module.exports = {
    pattern: /^upvote (.+)$/,
    handler: upvote,
    description: '*silviao upvote [dish name]* : Adds an upvote for the specified dish',
    channels: { silviao: ['#delicias-do-jamba', '#dev-delicias-do-jamba', '@direct_message'] }
  };
})();
