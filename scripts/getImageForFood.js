(function() {

  var variables = require('../variables.js');
  var googleImages = require('google-images');

  function getImageForFood(food, callback) {
    googleImages(variables.GOOGLE_CSE_ID, variables.GOOGLE_API_KEY).search(food).then(function(images) {
      var resultsLength = images.length;
      if (resultsLength > 0) {
        var randomResult = images[Math.floor((Math.random() * resultsLength))];
        callback(null, randomResult.url);
      } else {
        callback(null, undefined);
      }
    }).catch(function(error) {
      callback(error, undefined)
    });
  }

  module.exports = getImageForFood;

})();
