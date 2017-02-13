#!/usr/bin/env node

var request = require('request');

var variables = require('./variables');

function postCountdownToSlack(countdown) {
  if (!countdown) {
    return;
  }

  var url;
  if (variables.JAMBABOT_DEBUG) {
    url = variables.JAMBABOT_DEBUG_URL;
  } else {
    url = variables.JAMBABOT_PROD_URL;
  }

  request.post({ url: url, form: `payload={"text" : "${countdown}"}` }, function(error) {
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

var jambaTime = new Date();
jambaTime.setHours(11);
jambaTime.setMinutes(30);
jambaTime.setSeconds(0);
jambaTime.setMilliseconds(0);

var now = new Date();

var deltaMinutes = Math.ceil((jambaTime - now) / (60 * 1000));

var countdown = `*${deltaMinutes}*`;
if (deltaMinutes === 0) {
    countdown += ' :gottagojamba:';
}

postCountdownToSlack(countdown);
