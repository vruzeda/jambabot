#!/usr/bin/env node

const { handler: cardapio } = require('./commands/cardapio');
const { handler: spoiler } = require('./commands/spoiler');
const { postToSlack } = require('./integrations/incomingWebhook');

const today = new Date();
if (today.getHours() < 11) {
  cardapio(undefined).then(postToSlack);
} else {
  spoiler(undefined).then(postToSlack);
}
