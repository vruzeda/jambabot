const Botkit = require('botkit');
const variables = require('../variables');


(() => {
  exports.controller = Botkit.slackbot({
    debug: false
  });

  exports.bot = (userToken) => exports.controller.spawn({
    token: userToken,
    retry: Infinity
  });
})();
