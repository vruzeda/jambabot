#!/usr/bin/env node

const request = require('request');
const variables = require('./variables');

function postCountdownToSlack(countdown) {
  if (!countdown) {
    return;
  }

  let url;
  if (variables.JAMBABOT_DEBUG) {
    url = variables.JAMBABOT_DEBUG_URL;
  } else {
    url = variables.JAMBABOT_PROD_URL;
  }

  request.post({ url, json: { text: countdown } }, (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

const jambaTime = new Date();
jambaTime.setHours(11);
jambaTime.setMinutes(0);
jambaTime.setSeconds(0);
jambaTime.setMilliseconds(0);

const now = new Date();
const deltaMinutes = Math.ceil((jambaTime - now) / (60 * 1000));

let countdown = `*${deltaMinutes}*`;
if (deltaMinutes === 0) {
  countdown += ' :gottagojamba:';
}

postCountdownToSlack(countdown);
