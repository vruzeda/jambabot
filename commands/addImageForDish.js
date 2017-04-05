const mongodb = require('../integrations/mongodb');
const request = require('request');

(() => {
  function checkIfImageExists(image, callback) {
    console.log(`Checking if ${image} exists...`);

    request({ url: image }, (error, response) => {
      const exists = (response.statusCode === 200);
      console.log(`... ${exists ? 'it does.' : 'it doesn\'t.'}`);
      callback(exists, image);
    });
  }

  function getThumbnailUrlFromImageUrl(image, callback) {
    if (image.match(/i\.imgur\.com/)) {
      checkIfImageExists(image.replace(/^(.*)(\.[^.]*)$/, '$1l$2'), (exists, thumbnail) => {
        if (exists) {
          callback(thumbnail);
        } else {
          checkIfImageExists(image.replace(/^(.*).(\.[^.]*)$/, '$1l$2'), (exists2, thumbnail2) => {
            if (exists2) {
              callback(thumbnail2);
            } else {
              callback(image);
            }
          });
        }
      });
    } else {
      callback(image);
    }
  }

  function addImageForDish(message, callback, dishName, dishImageUrl) {
    mongodb.isValidDish(dishName, (error, isValidDish) => {
      if (error) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        getThumbnailUrlFromImageUrl(dishImageUrl.replace(/^<(.*)>$/, '$1'), (thumbnail) => {
          mongodb.addImageForDish(dishName, thumbnail, (errorAddImage) => {
            if (errorAddImage) {
              callback('Vixxxxxxi c lascou kkkkk');
              return;
            }

            callback('Acho q ficou bom');
          });
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
