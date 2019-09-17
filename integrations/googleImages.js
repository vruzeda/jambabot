const variables = require('../variables');
const GoogleImages = require('google-images');

(() => {
  let googleImagesClient;

  function getRandomImage(query) {
    if (!googleImagesClient) {
      if (!variables.GOOGLE_CSE_ID) {
        return Promise.reject(new Error('GOOGLE_CSE_ID is not defined in variables.js'));
      }

      if (!variables.GOOGLE_API_KEY) {
        return Promise.reject(new Error('GOOGLE_API_KEY is not defined in variables.js'));
      }

      googleImagesClient = new GoogleImages(variables.GOOGLE_CSE_ID, variables.GOOGLE_API_KEY);
    }

    return googleImagesClient.search(query)
      .then((images) => {
        const resultsLength = images.length;
        if (resultsLength === 0) {
          return undefined;
        }

        const randomResult = images[Math.floor((Math.random() * resultsLength))];
        let imageUrl = randomResult.url;

        if (randomResult.width > randomResult.height && randomResult.width > 640) {
          imageUrl = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${encodeURIComponent(imageUrl)}&container=focus&resize_w=640&refresh=2592000`;
        } else if (randomResult.height > randomResult.width && randomResult.height > 640) {
          imageUrl = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${encodeURIComponent(imageUrl)}&container=focus&resize_h=640&refresh=2592000`;
        }

        return imageUrl;
      });
  }

  module.exports = {
    getRandomImage
  };
})();
