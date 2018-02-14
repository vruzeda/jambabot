const mongoose = require('mongoose');

(() => {
  const DishSchema = mongoose.Schema({
    dish: { type: String, unique: true }
  });
  const Dish = mongoose.model('Dish', DishSchema);

  function isValidDish(dish, callback) {
    Dish.findOne({ dish: dish.toLowerCase() })
    .then((storedDish) => {
      callback(null, !!storedDish);
    }, (error) => {
      callback(error, undefined);
    });
  }

  function saveDishes(dishes, callback) {
    recursivelySaveDishes(dishes, 0, [], callback);
  }

  function recursivelySaveDishes(dishes, index, errors, callback) {
    if (index < dishes.length) {
      const dish = dishes[index];
      isValidDish(dish, (error, isAValidDish) => {
        if (error) {
          errors.push(error);
          recursivelySaveDishes(dishes, index + 1, errors, callback);
          return;
        }

        if (!isAValidDish) {
          Dish.create({ dish: dish.toLowerCase() })
          .then(() => {
            errors.push(null);
            recursivelySaveDishes(dishes, index + 1, errors, callback);
          }, (errorCreatingDish) => {
            errors.push(errorCreatingDish);
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
    isValidDish,
    saveDishes
  };
})();
