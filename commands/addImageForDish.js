(function() {

  var mongodb = require('../integrations/mongodb.js');

  function addImageForDish(callback, dishName, dishImageUrl) {
    mongodb.addImageForDish(dishName, dishImageUrl, function(error) {
      if (error) {
        callback('Vixxxxxxi c lascou kkkkk');
        return;
      }

      callback('Acho q ficou bom');
    });
  }

  module.exports = {
    pattern: /^add image (.*) (.*)$/,
    handler: addImageForDish,
    description: '*silviao add image [dish name] [dish image URL]* : Persists an image for the specified dish'
  };

})();
