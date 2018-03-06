const variables = require('../variables');
const GoogleImages = require('google-images');

(() => {
  var googleImagesClient = undefined;

  function getRandomImage(query, callback) {
    if (!googleImagesClient) {
      if (!variables.GOOGLE_CSE_ID) {
        callback(new Error('GOOGLE_CSE_ID is not defined in variables.js'), undefined);
        return;
      }

      if (!variables.GOOGLE_API_KEY) {
        callback(new Error('GOOGLE_API_KEY is not defined in variables.js'), undefined);
        return;
      }

      googleImagesClient = new GoogleImages(variables.GOOGLE_CSE_ID, variables.GOOGLE_API_KEY);
    }

    googleImagesClient.search(query).then((images) => {
      const resultsLength = images.length;

      if (resultsLength > 0) {
        const randomResult = images[Math.floor((Math.random() * resultsLength))];
        let imageUrl = randomResult.url;

        if (randomResult.width > randomResult.height && randomResult.width > 640) {
          imageUrl = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${encodeURIComponent(imageUrl)}&container=focus&resize_w=640&refresh=2592000`;
        } else if (randomResult.height > randomResult.width && randomResult.height > 640) {
          imageUrl = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${encodeURIComponent(imageUrl)}&container=focus&resize_h=640&refresh=2592000`;
        }

        callback(null, imageUrl);
      } else {
        callback(null, undefined);
      }
    }).catch((error) => {
      callback(error, undefined);
    });
  }

  module.exports = {
    getRandomImage
  };
})();
