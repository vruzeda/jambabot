#!/usr/bin/env node

var request = require('request');

var variables = require('./variables');
var cardapio = require('./commands/cardapio').handler;
var spoiler = require('./commands/spoiler').handler;

function postJambaToSlack(cardapio) {
  if (!cardapio) {
    return;
  }

  var url;
  if (variables.JAMBABOT_DEBUG) {
    url = variables.JAMBABOT_DEBUG_URL;
  } else {
    url = variables.JAMBABOT_PROD_URL;
  }

  request.post({ url: url, json: {"text" : cardapio} }, function(error) {
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

var today = new Date();
if (today.getHours() < 11) {
  cardapio(undefined, postJambaToSlack);
} else {
  spoiler(undefined, postJambaToSlack);
}
