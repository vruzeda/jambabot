(function() {

  var bodyParser = require('body-parser');
  var express = require('express');

  var variables = require('./variables');
  var parseCommand = require('./commands/parseCommand');

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

})();
