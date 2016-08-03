(function() {

  var bodyParser = require('body-parser');
  var express = require('express');

  var variables = require('./variables.js');
  var getJambaPostForDate = require('./scripts/getJambaPostForDate.js');

  function debug(debugEnabled) {
    if (debugEnabled) {
      console.log.apply(console, Array.prototype.slice.call(arguments, 1));
    }
  }

  function postToSlack(debugEnabled, slackResponse, text) {
    debug(debugEnabled, text);
    slackResponse.send('{"text": ' + JSON.stringify(text) + '}');
  }

  function postJambaToSlack(debugEnabled, slackResponse, date) {
    getJambaPostForDate(date, function(jambaPost) {
      postToSlack(debugEnabled, slackResponse, jambaPost);
    });
  }

  function postJambaMenuToSlack(debugEnabled, slackResponse, date) {
    if (!date) {
      date = new Date();
    }

    postJambaToSlack(debugEnabled, slackResponse, date);
  }

  function postJambaSpoilerToSlack(debugEnabled, slackResponse, nextDay) {
    if (!nextDay) {
      nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);

      if (nextDay.getDay() == 0) {
        // Sunday -> Monday
        nextDay.setDate(nextDay.getDate() + 1);
      } else if (nextDay.getDay() == 6) {
        // Saturday -> Monday
        nextDay.setDate(nextDay.getDate() + 2);
      }
    }

    postJambaToSlack(debugEnabled, slackResponse, nextDay);
  }

  function postHelloWorldToSlack(debugEnabled, slackResponse, username, command) {
    postToSlack(debugEnabled, slackResponse, 'Hello, ' + username + '! You said [' + command + ']');
  }

  function processCommand(debugEnabled, slackRequest, slackResponse) {
    debug(debugEnabled, JSON.stringify(slackRequest.body));

    var command = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();

    if (/^cardapio$/.test(command)) {
      postJambaMenuToSlack(debugEnabled, slackResponse);
    } else if (/^spoiler$/.test(command)) {
      postJambaSpoilerToSlack(debugEnabled, slackResponse);
    } else if (/^cardapio [0-9]{1,2}\/[0-9]{1,2}$/.test(command) || /^spoiler [0-9]{1,2}\/[0-9]{1,2}$/.test(command)) {
      var parameters = command.split(' ');
      var dateComponents = parameters[1].split('/');

      var date = new Date();
      date.setMonth(parseInt(dateComponents[1]) - 1);
      date.setDate(parseInt(dateComponents[0]));

      postJambaMenuToSlack(debugEnabled, slackResponse, date);
    } else if (debugEnabled) {
      postHelloWorldToSlack(debugEnabled, slackResponse, slackRequest.body.user_name, command);
    }
  }

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function (slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.JAMBABOT_PROD_TOKEN) {
      processCommand(false, slackRequest, slackResponse);
    } else if (slackRequest.body.token === variables.JAMBABOT_DEBUG_TOKEN) {
      processCommand(true, slackRequest, slackResponse);
    } else {
      slackResponse.sendStatus(403);
    }
  });

  app.listen(6001, function () {
    console.log('jambabot app listening on port 6001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}())
