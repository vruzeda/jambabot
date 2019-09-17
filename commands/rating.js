const mongodb = require('../integrations/mongodb');

(() => {
  function rating(message, callback, dish) {
    mongodb.isValidDish(dish)
      .catch(() => {
        throw new Error('Não entendi nada....');
      })
      .then((isValidDish) => {
        if (!isValidDish) {
          throw new Error('C fude. Kkkkkkkk');
        }

        return mongodb.getDishRating(dish)
          .catch(() => {
            throw new Error('Não sei de nada....\nMais é show....');
          });
      })
      .then((storedDishRating) => {
        callback(`Hummm....\n:arrow_up_small: ${storedDishRating.upvotes} :arrow_down_small: ${storedDishRating.downvotes}`);
      })
      .catch((error) => {
        callback(error.message);
      });
  }

  module.exports = {
    pattern: /^rating (.+)$/,
    handler: rating,
    description: '*silviao rating [dish name]* : Gets the upvotes/downvotes ratings for the specified dish',
    channels: { silviao: ['#delicias-do-jamba', '#dev-delicias-do-jamba', '@direct_message'] }
  };
})();
