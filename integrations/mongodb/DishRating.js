(function() {

  var mongoose = require('mongoose');

  var DishRatingSchema = mongoose.Schema({
    userName: { type: String, required: true },
    dish: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  });
  DishRatingSchema.index({ userName: 1, dish: 1 }, { unique: true });

  var DishRating = mongoose.model('DishRating', DishRatingSchema);

  function findUserDishRating(userName, dish, callback) {
    DishRating.findOne({userName: userName.toLowerCase(), dish: dish.toLowerCase()}, function(error, dishRating) {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (!dishRating) {
        callback(new Error(`Couldn't find ${userName}'s rating for ${dish}`), undefined);
        return;
      }

      callback(null, dishRating);
    });
  };

  function upvoteDish(userName, dish, callback) {
    findUserDishRating(userName, dish, function(error, dishRating) {
      if (!dishRating) {
        dishRating = new DishRating({dish: dish.toLowerCase(), userName: userName.toLowerCase()});
      }

      dishRating.upvotes = 1;
      dishRating.downvotes = 0;

      dishRating.save(function(error) {
        callback(error);
      });
    });
  };

  function downvoteDish(userName, dish, callback) {
    findUserDishRating(userName, dish, function(error, dishRating) {
      if (!dishRating) {
        dishRating = new DishRating({dish: dish.toLowerCase(), userName: userName.toLowerCase()});
      }

      dishRating.upvotes = 0;
      dishRating.downvotes = 1;

      dishRating.save(function(error) {
        callback(error);
      });
    });
  };

  function getDishRating(dish, callback) {
    var query = {
      $match: {
        dish: dish.toLowerCase()
      }
    };

    var grouping = {
      _id: "$dish",
      upvotes: { $sum: "$upvotes" },
      downvotes: { $sum: "$downvotes" }
    };

    DishRating.aggregate([query, { $group: grouping }]).exec(function(error, aggregatedDishRatings) {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (aggregatedDishRatings.length == 0) {
        callback(new Error(`Couldn't find ratings for ${dish}`), undefined);
        return;
      }

      callback(null, {
        upvotes: aggregatedDishRatings[0].upvotes,
        downvotes: aggregatedDishRatings[0].downvotes
      });
    });
  };

  module.exports = {
    upvoteDish: upvoteDish,
    downvoteDish: downvoteDish,
    getDishRating: getDishRating
  };

})();
