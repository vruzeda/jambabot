(function() {

  var mongoose = require('mongoose');

  var DishRatingSchema = mongoose.Schema({
    dish: { type: String, unique: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  });
  var DishRating = mongoose.model('DishRating', DishRatingSchema);

  function findDishRating(dish, callback) {
    DishRating.findOne({dish: dish.toLowerCase()}, function(error, dishRating) {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (!dishRating) {
        callback(new Error(`Couldn't find a rating for ${dish}`), undefined);
        return;
      }

      callback(null, dishRating);
    });
  };

  function upvoteDish(dish, callback) {
    findDishRating(dish, function(error, dishRating) {
      if (dishRating) {
        dishRating.upvotes++;
      } else {
        dishRating = new DishRating({dish: dish.toLowerCase(), upvotes: 1});
      }

      dishRating.save(function(error) {
        callback(error);
      });
    });
  };

  function downvoteDish(dish, callback) {
    findDishRating(dish, function(error, dishRating) {
      if (dishRating) {
        dishRating.downvotes++;
      } else {
        dishRating = new DishRating({dish: dish.toLowerCase(), downvotes: 1});
      }

      dishRating.save(function(error) {
        callback(error);
      });
    });
  };

  function getDishRating(dish, callback) {
    findDishRating(dish, function(error, dishRating) {
      if (error) {
        callback(error, undefined);
        return;
      }

      callback(null, {
        upvotes: dishRating.upvotes,
        downvotes: dishRating.downvotes
      });
    });
  };

  module.exports = {
    upvoteDish: upvoteDish,
    downvoteDish: downvoteDish,
    getDishRating: getDishRating
  };

})();
