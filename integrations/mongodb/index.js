const mongoose = require('mongoose');
const Dish = require('./Dish');
const DishImage = require('./DishImage');
const DishRating = require('./DishRating');
const Jamba = require('./Jamba');
const SilvioComment = require('./SilvioComment');
const variables = require('../../variables');

(() => {
  mongoose.Promise = global.Promise;
  mongoose.connect(variables.MONGO_CONNECTION_STR, { useMongoClient: true });


  module.exports = {
    isValidDish: Dish.isValidDish,
    saveDishes: Dish.saveDishes,

    getImageForDish: DishImage.getImageForDish,
    addImageForDish: DishImage.addImageForDish,

    upvoteDish: DishRating.upvoteDish,
    downvoteDish: DishRating.downvoteDish,
    getDishRating: DishRating.getDishRating,

    findJambaForDate: Jamba.findJambaForDate,
    saveJambas: Jamba.saveJambas,

    getRandomSilvioComment: SilvioComment.getRandomSilvioComment,
    addSilvioComment: SilvioComment.addSilvioComment
  };
})();
