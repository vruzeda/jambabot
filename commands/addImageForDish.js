const mongodb = require('../integrations/mongodb');
const request = require('request');

(() => {
  function checkIfImageExists(image) {
    console.log(`Checking if ${image} exists...`);

    return new Promise((resolve, reject) => {
      request({ url: image }, (error, response) => {
        const exists = (response.statusCode === 200);
        console.log(`... ${exists ? 'it does.' : 'it doesn\'t.'}`);
        if (exists) {
          resolve(image);
        } else {
          reject(response.statusCode);
        }
      });
    });
  }

  function getThumbnailUrlFromImageUrl(image, callback) {
    if (image.match(/i\.imgur\.com/)) {
      checkIfImageExists(image.replace(/^(.*)(\.[^.]*)$/, '$1l$2'))
        .then(callback)
        .catch(() => {
          checkIfImageExists(image.replace(/^(.*).(\.[^.]*)$/, '$1l$2'))
            .then(callback)
            .catch(() => callback(image));
        });
    } else {
      callback(image);
    }
  }

  function addImageForDish(message, callback, dishName, dishImageUrl) {
    mongodb.isValidDish(dishName, (errorValidatingDish, isValidDish) => {
      if (errorValidatingDish) {
        callback('Não entendi nada....');
        return;
      }

      if (isValidDish) {
        getThumbnailUrlFromImageUrl(dishImageUrl.replace(/^<(.*)>$/, '$1'), (thumbnail) => {
          mongodb.addImageForDish(dishName, thumbnail, (errorAddingImage) => {
            if (errorAddingImage) {
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
    channels: {'silviao': ['#delicias-do-jamba', '#dev-delicias-do-jamba', '@direct_message']}
  };
})();
