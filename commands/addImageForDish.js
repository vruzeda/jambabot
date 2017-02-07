(function() {

  var mongodb = require('../integrations/mongodb');

  function addImageForDish(message, callback, dishName, dishImageUrl) {
    mongodb.isValidDish(dishName, function(error, isValidDish) {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        mongodb.addImageForDish(dishName, dishImageUrl.replace(/^<(.*)>$/, '$1'), function(error) {
          if (error) {
            callback('Vixxxxxxi c lascou kkkkk');
            return;
          }

          callback('Acho q ficou bom');
        });
      } else {
        callback('C fude. Kkkkkkkk');
      }
    });
  }

  module.exports = {
    pattern: /^add image (.*) (.*)$/,
    handler: addImageForDish,
    description: '*silviao add image [dish name] [dish image URL]* : Persists an image for the specified dish',
    channels: ['delicias-do-jamba', 'dev-delicias-do-jamba']
  };

})();
