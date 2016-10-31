(function() {

  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/jambadb');

  var DishImage = mongoose.model('DishImage', mongoose.Schema({
      dish: {type: String, unique: true},
      image: String
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

  module.exports = {
    getImageForDish: getImageForDish,
    addImageForDish: addImageForDish
  };

})();
