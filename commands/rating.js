(function() {

  var mongodb = require('../integrations/mongodb.js');

  function rating(callback, dish) {
    mongodb.getDishRating(dish, function(error, dishRating) {
      if (error) {
        callback('Não sei de nada....\nMais é show....');
        return;
      }

      callback(`Hummm....\n :arrow_up_small: ${dishRating.upvotes} :arrow_down_small: ${dishRating.downvotes}`);
    });
  }

  module.exports = {
    pattern: /^rating (.+)$/,
    handler: rating,
    description: '*silviao rating [dish name]* : Gets the upvotes/downvotes ratings for the specified dish'
  };

})();
