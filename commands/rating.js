(function() {

  var mongodb = require('../integrations/mongodb');

  function rating(message, callback, dish) {
    mongodb.isValidDish(dish, function(error, isValidDish) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.getDishRating(dish, function(error, dishRating) {
          if (error) {
            callback('Não sei de nada....\nMais é show....');
            return;
          }

          callback(`Hummm....\n:arrow_up_small: ${dishRating.upvotes} :arrow_down_small: ${dishRating.downvotes}`);
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
