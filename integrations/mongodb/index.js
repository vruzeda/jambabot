(function() {

  var mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/jambadb');

  var Dish = require('./Dish');
  var DishImage = require('./DishImage');
  var DishRating = require('./DishRating');
  var Jamba = require('./Jamba');

  module.exports = {
    isValidDish: Dish.isValidDish,
    saveDishes: Dish.saveDishes,

    getImageForDish: DishImage.getImageForDish,
    addImageForDish: DishImage.addImageForDish,

    upvoteDish: DishRating.upvoteDish,
    downvoteDish: DishRating.downvoteDish,
    getDishRating: DishRating.getDishRating,

    findJambaForDate: Jamba.findJambaForDate,
    saveJambas: Jamba.saveJambas
  };

})();
