const mongoose = require('mongoose');

(() => {
  const DishImageSchema = mongoose.Schema({
    dish: { type: String, unique: true },
    image: String,
  });
  const DishImage = mongoose.model('DishImage', DishImageSchema);

  function findDishImage(dish) {
    return DishImage.findOne({ dish: dish.toLowerCase() })
      .then((storedDishImage) => {
        if (!storedDishImage) {
          throw new Error(`Couldn't find an image for ${dish}`);
        }

        return storedDishImage;
      });
  }

  function getImageForDish(dish) {
    return findDishImage(dish)
      .then((dishImage) => dishImage.image);
  }

  function addImageForDish(dish, image) {
    return findDishImage(dish)
      .then((storedDishImage) => {
        /* eslint-disable no-param-reassign */
        storedDishImage.image = image;
        /* eslint-enable no-param-reassign */
        return storedDishImage;
      })
      .catch(() => new DishImage({ dish: dish.toLowerCase(), image }))
      .then((dishImage) => dishImage.save());
  }

  module.exports = {
    getImageForDish,
    addImageForDish,
  };
})();
