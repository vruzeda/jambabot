const request = require('request');
const mongodb = require('../integrations/mongodb');

(() => {
  function checkIfImageExists(image) {
    return new Promise((resolve, reject) => {
      request({ url: image }, (error, response) => {
        const exists = (response.statusCode === 200);
        if (exists) {
          resolve(image);
        } else {
          reject(response.statusCode);
        }
      });
    });
  }

  function getThumbnailUrlFromImageUrl(image) {
    return new Promise((resolve) => {
      if (!image.match(/i\.imgur\.com/)) {
        resolve(image);
        return;
      }

      checkIfImageExists(image.replace(/^(.*)(\.[^.]*)$/, '$1l$2'))
        .then(resolve)
        .catch(() => {
          checkIfImageExists(image.replace(/^(.*).(\.[^.]*)$/, '$1l$2'))
            .then(resolve)
            .catch(() => resolve(image));
        });
    });
  }

  function addImageForDish(_message, dishName, dishImageUrl) {
    return mongodb.isValidDish(dishName)
      .catch(() => {
        throw new Error('Não entendi nada....');
      })
      .then((isValidDish) => {
        if (!isValidDish) {
          throw new Error('C fude. Kkkkkkkk');
        }

        return getThumbnailUrlFromImageUrl(dishImageUrl.replace(/^<(.*)>$/, '$1'));
      }).then((thumbnail) => {
        mongodb.addImageForDish(dishName, thumbnail)
          .catch(() => {
            throw new Error('Vixxxxxxi c lascou kkkkk');
          });
      })
      .then(() => 'Acho q ficou bom')
      .catch((error) => error.message);
  }

  module.exports = {
    pattern: /^add image (.*) (.*)$/,
    handler: addImageForDish,
    description: '*silviao add image [dish name] [dish image URL]* : Persists an image for the specified dish',
    channels: { silviao: ['#delicias-do-jamba', '#dev-delicias-do-jamba', '@direct_message'] },
  };
})();
