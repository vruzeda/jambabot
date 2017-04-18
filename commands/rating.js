const mongodb = require('../integrations/mongodb');

(() => {
  function rating(message, callback, dish) {
    mongodb.isValidDish(dish, (errorValidatingDish, isValidDish) => {
      if (errorValidatingDish) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.getDishRating(dish, (errorGettingDishRating, storedDishRating) => {
          if (errorGettingDishRating) {
            callback('Não sei de nada....\nMais é show....');
            return;
          }

          callback(`Hummm....\n:arrow_up_small: ${storedDishRating.upvotes} :arrow_down_small: ${storedDishRating.downvotes}`);
        });
      } else {
        callback('C fude. Kkkkkkkk');
      }
    });
  }

  module.exports = {
    pattern: /^rating (.+)$/,
    handler: rating,
    description: '*silviao rating [dish name]* : Gets the upvotes/downvotes ratings for the specified dish',
    channels: ['delicias-do-jamba', 'dev-delicias-do-jamba']
  };
})();
