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

  function findUserDishRating(userName, dish, callback) {
    const filter = { userName: userName.toLowerCase(), dish: dish.toLowerCase() };

    DishRating.findOne(filter)
    .then((dishRating) => {
      if (!dishRating) {
        callback(new Error(`Couldn't find ${userName}'s rating for ${dish}`), undefined);
        return;
      }

      callback(null, dishRating);
    }, (error) => {
      callback(error, undefined);
    });
  }

  function upvoteDish(userName, dish, callback) {
    findUserDishRating(userName, dish, (errorFindindDishRating, storedDishRating) => {
      let validDishRating = storedDishRating;

      if (!validDishRating) {
        validDishRating = new DishRating({
          dish: dish.toLowerCase(),
          userName: userName.toLowerCase()
        });
      }

      validDishRating.upvotes = 1;
      validDishRating.downvotes = 0;

      validDishRating.save()
      .then(() => {
        callback(null);
      }, (errorSavingDishRating) => {
        callback(errorSavingDishRating);
      });
    });
  }

  function downvoteDish(userName, dish, callback) {
    findUserDishRating(userName, dish, (errorFindingUserDishRating, storedDishRating) => {
      let validDishRating = storedDishRating;

      if (!validDishRating) {
        validDishRating = new DishRating({
          dish: dish.toLowerCase(),
          userName: userName.toLowerCase()
        });
      }

      validDishRating.upvotes = 0;
      validDishRating.downvotes = 1;

      validDishRating.save()
      .then(() => {
        callback(null);
      }, (errorSavingDishRating) => {
        callback(errorSavingDishRating);
      });
    });
  }

  function getDishRating(dish, callback) {
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

    DishRating.aggregate([query, { $group: grouping }]).exec()
    .then((aggregatedDishRatings) => {
      if (aggregatedDishRatings.length === 0) {
        callback(new Error(`Couldn't find ratings for ${dish}`), undefined);
        return;
      }

      callback(null, {
        upvotes: aggregatedDishRatings[0].upvotes,
        downvotes: aggregatedDishRatings[0].downvotes
      });
    }, (error) => {
      callback(error, undefined);
    });
  }

  module.exports = {
    upvoteDish,
    downvoteDish,
    getDishRating
  };
})();
