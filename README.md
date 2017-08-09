# Jambabot [![Build Status](https://travis-ci.org/vruzeda/jambabot.svg?branch=master)](https://travis-ci.org/vruzeda/jambabot)

This repository contains 3 different Slack's bot applications, all relating to Refeições Jambalaya's daily menu.
Basically, it parses the menu provided in http://www.refeicoesjambalaya.com.br/cardapio.asp and post it to a Slack's channel.

## cardapio.js

This script gets the menu and send it to a Slack's channel.
It has the following behavior:

- If it is executed between 00AM and 10AM, it will simply post today's menu;
- If it is executed between 10AM and 11AM, it will post today's menu, but with a mocking tone, since it's getting late;
- If it is executed between 11AM and 24PM, it will post the spoiler for tomorrow's menu.

This script was written for run in NodeJS using JavaScript.
To run it, you must define a file named "variables.js" with three variables defined:

- JAMBABOT_DEBUG: Enables debug logs, and makes the script post to the debug channel (it should be either 'True' or 'False');
- JAMBABOT_DEBUG_URL: The URL provided by Slack - this one is used for debug purposes (only used if JAMBABOT_DEBUG is true);
- JAMBABOT_PROD_URL: The URL provided by Slack - this is one is used for production.

After defining the necessary variables, the script is run using:

    $ ./cardapio.js

## countdown.js

This script is used to print a countdown before the correct lunch time (11:30AM).
It was designed to run only in the hour before that, calculating the minutes to the correct time and posting it to Slack.
When the counter reaches 0, a GIF is also posted.

This script was written for run in NodeJS using JavaScript.
To run it, you should have 3 environment variables defined:

- JAMBABOT_DEBUG: Enables debug logs, and makes the script post to the debug channel (it should be either 'True' or 'False');
- JAMBABOT_DEBUG_URL: The URL provided by Slack - this one is used for debug purposes (only used if JAMBABOT_DEBUG is true);
- JAMBABOT_PROD_URL: The URL provided by Slack - this is one is used for production.

After defining the necessary variables, the script is run using:

    $ ./countdown.js

## jambabot.js

This script implements a reactive bot, answering to simple requests from users.
There are currently many commands, you can check them out with the command `@silviao ajuda`.

This script was written for run in NodeJS using JavaScript.
To run it, you must define a file named "variables.js" with these variables defined:

- JAMBABOT_USER_TOKEN: Token for Slacks's userbot integration;
- GOOGLE_API_KEY: You custom Google's API key (used for image obtention, requires "Google Custom Search Engine API" to be enabled);
- GOOGLE_CSE_ID: You custom Google's search engine ID (used for image obtention, requires "Image search" to be enabled);
- MONGO_CONNECTION_STR: An URL for your Mongo database, something like `'mongodb://localhost/jambadb'`.

There's a stub file that you can use to guide you, "variables.js.stub".

After implementing this file, you can test your script by running:

    $ node jambabot.js

And making a post to it in the format, for example, using curl:

    $ curl --data "token=<The value of DEBUG or PROD token>&user_name=<Your user name>&text=jambabot <Your command>&trigger_word=jambabot" http://localhost:6001/trigger
