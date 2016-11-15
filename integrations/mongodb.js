(function() {

  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/jambadb');

  var DishImage = mongoose.model('DishImage', mongoose.Schema({
    dish: { type: String, unique: true },
    image: String
  }));

  var DishRating = mongoose.model('DishRating', mongoose.Schema({
    userName: String,
    dish: String,
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  }));

  function findDishImage(dish, callback) {
    DishImage.findOne({dish: dish.toLowerCase()}, function(error, dishImage) {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (!dishImage) {
        callback(new Error(`Couldn't find an image for ${dish}`), undefined);
        return;
      }

      callback(null, dishImage);
    });
  }

  function getImageForDish(dish, callback) {
    findDishImage(dish, function(error, dishImage) {
      if (error) {
        callback(error, undefined);
        return;
      }

      callback(null, dishImage.image);
    });
  }

  function addImageForDish(dish, image, callback) {
    findDishImage(dish, function(error, dishImage) {
      if (dishImage) {
        dishImage.image = image;
      } else {
        dishImage = new DishImage({dish: dish.toLowerCase(), image: image});
      }

      dishImage.save(function(error) {
        callback(error);
      });
    });
  }

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
  }

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
  }

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
  }

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
  }

  module.exports = {
    getImageForDish: getImageForDish,
    addImageForDish: addImageForDish,
    upvoteDish: upvoteDish,
    downvoteDish: downvoteDish,
    getDishRating: getDishRating
  };

})();
