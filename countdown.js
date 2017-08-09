#!/usr/bin/env node

const postToSlack = require('./integrations/incomingWebhook').postToSlack;

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

postToSlack(countdown);
