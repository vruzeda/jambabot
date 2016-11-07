(function() {

  var bodyParser = require('body-parser');
  var express = require('express');

  var variables = require('./variables.js');
  var parseCommand = require('./commands/parseCommand.js');

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function(slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.JAMBABOT_DEBUG_TOKEN || slackRequest.body.token === variables.JAMBABOT_PROD_TOKEN) {
      var userCommand = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();
      parseCommand(function(response) {
        if (!response) {
          slackResponse.status(404).send();
          return;
        }

        slackResponse.send(`{"text": ${JSON.stringify(response)}}`);
      }, userCommand);
    } else {
      slackResponse.status(403).send();
    }
  });

  app.listen(6001, function () {
    console.log('jambabot app listening on port 6001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

})();
