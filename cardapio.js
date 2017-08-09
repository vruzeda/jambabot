#!/usr/bin/env node

const cardapio = require('./commands/cardapio').handler;
const spoiler = require('./commands/spoiler').handler;
const postToSlack = require('./integrations/incomingWebhook').postToSlack;

const today = new Date();
if (today.getHours() < 11) {
  cardapio(undefined, postToSlack);
} else {
  spoiler(undefined, postToSlack);
}
