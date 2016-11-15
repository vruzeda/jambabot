(function() {

  var mongoose = require('mongoose');

  var DishSchema = mongoose.Schema({
    dish: { type: String, unique: true }
  });
  var Dish = mongoose.model('Dish', DishSchema);

  function isValidDish(dish, callback) {
    Dish.findOne({dish: dish.toLowerCase()}, function(error, dish) {
      if (error) {
        callback(error, undefined);
        return;
      }

      callback(null, !!dish);
    });
  }

  function saveDishes(dishes, callback) {
    recursivelySaveDishes(dishes, 0, [], callback);
  }

  function recursivelySaveDishes(dishes, index, errors, callback) {
    if (index < dishes.length) {
      var dish = dishes[index];
      isValidDish(dish, function(error, isValidDish) {
        if (error) {
          errors.push(error);
          recursivelySaveDishes(dishes, index + 1, errors, callback);
          return;
        }

        if (!isValidDish) {
          Dish.create({dish: dish.toLowerCase()}, function(error) {
            errors.push(error);
            recursivelySaveDishes(dishes, index + 1, errors, callback);
          });
        } else {
          errors.push(null);
          recursivelySaveDishes(dishes, index + 1, errors, callback);
        }
      });
    } else {
      callback(errors);
    }
  }

  module.exports = {
    isValidDish: isValidDish,
    saveDishes: saveDishes
  };

})();
