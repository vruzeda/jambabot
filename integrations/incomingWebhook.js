const request = require('request');
const variables = require('../variables');


(() => {
  function postToSlack(text) {
    if (!text) {
      return;
    }

    let urls;
    if (variables.JAMBABOT_DEBUG) {
      urls = variables.JAMBABOT_DEBUG_URL;
    } else {
      urls = variables.JAMBABOT_PROD_URL;
    }

    if (!(urls instanceof Array)) {
      urls = [urls];
    }

    recursivePostToSlack(text, urls, 0, []);
  }

  function recursivePostToSlack(text, urls, index, errors) {
    if (index < urls.length) {
      let url = urls[index];
      request.post({ url, json: { text } }, (error) => {
        recursivePostToSlack(text, urls, index + 1, errors.concat([error]));
      });
    } else {
      if (errors.length > 0) {
        errors.forEach(error => console.log(error));
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
  }

  exports.postToSlack = postToSlack;
})();
