const mongoose = require('mongoose');

(() => {
  const DishRatingSchema = mongoose.Schema({
    userName: { type: String, required: true },
    dish: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  });
  DishRatingSchema.index({ userName: 1, dish: 1 }, { unique: true });

  const DishRating = mongoose.model('DishRating', DishRatingSchema);

  function findUserDishRating(userName, dish) {
    const filter = { userName: userName.toLowerCase(), dish: dish.toLowerCase() };

    return DishRating.findOne(filter)
      .then((dishRating) => {
        if (!dishRating) {
          throw new Error(`Couldn't find ${userName}'s rating for ${dish}`);
        }

        return dishRating;
      });
  }

  function upvoteDish(userName, dish) {
    return findUserDishRating(userName, dish)
      .then((storedDishRating) => {
        storedDishRating.upvotes = 1;
        storedDishRating.downvotes = 0;
        return storedDishRating;
      })
      .catch(() => new DishRating({
        dish: dish.toLowerCase(),
        userName: userName.toLowerCase()
      }))
      .then(dishRating => dishRating.save());
  }

  function downvoteDish(userName, dish) {
    return findUserDishRating(userName, dish)
      .then((storedDishRating) => {
        storedDishRating.upvotes = 0;
        storedDishRating.downvotes = 1;
        return storedDishRating;
      })
      .catch(() => new DishRating({
        dish: dish.toLowerCase(),
        userName: userName.toLowerCase()
      }))
      .then(dishRating => dishRating.save());
  }

  function getDishRating(dish) {
    const query = {
      $match: {
        dish: dish.toLowerCase()
      }
    };

    const grouping = {
      _id: '$dish',
      upvotes: { $sum: '$upvotes' },
      downvotes: { $sum: '$downvotes' }
    };

    return DishRating.aggregate([query, { $group: grouping }]).exec()
      .then((aggregatedDishRatings) => {
        if (aggregatedDishRatings.length === 0) {
          throw new Error(`Couldn't find ratings for ${dish}`);
        }

        return {
          upvotes: aggregatedDishRatings[0].upvotes,
          downvotes: aggregatedDishRatings[0].downvotes
        };
      });
  }

  module.exports = {
    upvoteDish,
    downvoteDish,
    getDishRating
  };
})();
