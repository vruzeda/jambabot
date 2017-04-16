#!/usr/bin/env node

const request = require('request');

const variables = require('./variables');
const cardapio = require('./commands/cardapio').handler;
const spoiler = require('./commands/spoiler').handler;

function postJambaToSlack(cardapioText) {
  if (!cardapioText) {
    return;
  }

  let url;
  if (variables.JAMBABOT_DEBUG) {
    url = variables.JAMBABOT_DEBUG_URL;
  } else {
    url = variables.JAMBABOT_PROD_URL;
  }

  request.post({ url, json: { text: cardapioText } }, (error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

const today = new Date();
if (today.getHours() < 11) {
  cardapio(undefined, postJambaToSlack);
} else {
  spoiler(undefined, postJambaToSlack);
}
