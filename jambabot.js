(function() {

  var bodyParser = require('body-parser');
  var express = require('express');

  var Botkit = require('botkit');

  var variables = require('./variables');
  var parseCommand = require('./commands/parseCommand');
  var commands = require('./commands/commands');

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function(slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.JAMBABOT_DEBUG_TOKEN || slackRequest.body.token === variables.JAMBABOT_PROD_TOKEN) {
      var message = {
        userName: slackRequest.body.user_name,
        userText: slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim()
      };

      parseCommand(message, function(response) {
        if (!response) {
          slackResponse.status(404).send();
          return;
        }

        slackResponse.send(`{"text": ${JSON.stringify(response)}}`);
      });
    } else {
      slackResponse.status(403).send();
    }
  });

  app.listen(6001, function () {
    console.log('jambabot app listening on port 6001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

  var controller = Botkit.slackbot({
    debug: false
  });

  var bot = controller.spawn({
    token: variables.JAMBABOT_USER_TOKEN,
    retry: Infinity
  });

  bot.startRTM(function(error, bot, payload) {
    if (error) {
      console.warn('Failed to start RTM');
      return setTimeout(startRTM, 60 * 1000);
    }
    console.log('RTM started!');
  });

  controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], function(bot, botMessage) {
    bot.api.users.info({user: botMessage.user}, function(error, usersInfoResponse) {
      var userName = usersInfoResponse.user.name;

      bot.api.channels.info({channel: botMessage.channel}, function(error, channelsInfoResponse) {
        bot.api.groups.info({channel: botMessage.channel}, function(error, groupsInfoResponse) {
          var channel;
          if (channelsInfoResponse.ok) {
            channel = channelsInfoResponse.channel.name;
          } else if (groupsInfoResponse.ok) {
            channel = groupsInfoResponse.group.name;
          } else if (botMessage.event == 'direct_message') {
            channel = 'allow';
          } else {
            channel = 'unknown';
          }

          var message = {
            channel: channel,
            userName: userName,
            userText: botMessage.text.replace(/\s+/g, ' ').trim(),
            preFormattedText: botMessage.text
          };

          console.log(message);

          parseCommand(message, function(response) {
            if (response) {
              bot.reply(botMessage, response);
            }
          });
        });
      });
    });
  });

})();
