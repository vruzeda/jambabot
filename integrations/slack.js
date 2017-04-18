const Botkit = require('botkit');
const variables = require('../variables');


(() => {
  exports.controller = Botkit.slackbot({
    debug: false
  });

  exports.bot = exports.controller.spawn({
    token: variables.JAMBABOT_USER_TOKEN,
    retry: Infinity
  });

  exports.api = exports.bot.api;
})();
