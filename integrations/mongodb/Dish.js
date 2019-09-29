const mongoose = require('mongoose');

(() => {
  const DishSchema = mongoose.Schema({
    dish: { type: String, unique: true },
  });
  const Dish = mongoose.model('Dish', DishSchema);

  function isValidDish(dish) {
    return Dish.findOne({ dish: dish.toLowerCase() })
      .then((storedDish) => !!storedDish);
  }

  function saveDishes(dishes) {
    return Promise.all(dishes.map((dish) => isValidDish(dish)
      .then((isAValidDish) => {
        if (isAValidDish) {
          return Promise.resolve(null);
        }

        return Dish.create({ dish: dish.toLowerCase() });
      })));
  }

  module.exports = {
    isValidDish,
    saveDishes,
  };
})();
