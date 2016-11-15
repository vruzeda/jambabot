(function() {

  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/jambadb');

  var DishImage = require('./DishImage');
  var DishRating = require('./DishRating');

  module.exports = {
    getImageForDish: DishImage.getImageForDish,
    addImageForDish: DishImage.addImageForDish,

    upvoteDish: DishRating.upvoteDish,
    downvoteDish: DishRating.downvoteDish,
    getDishRating: DishRating.getDishRating
  };

})();
