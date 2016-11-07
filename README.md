This repository contains 3 different Slack's bot applications, all relating to Refeições Jambalaya's daily menu.
Basically, it parses the menu provided in http://www.refeicoesjambalaya.com.br/cardapio.asp and post it to a Slack's channel.

*cardapio.js*

This script gets the menu and send it to a Slack's channel.
It has the following behavior:

- If it is executed between 00AM and 10AM, it will simply post today's menu;
- If it is executed between 10AM and 11AM, it will post today's menu, but with a mocking tone, since it's getting late;
- If it is executed between 11AM and 24PM, it will post the spoiler for tomorrow's menu.

This script was written for run in NodeJS using JavaScript.
To run it, you must define a file named "variables.js" with three variables defined:

- JAMBABOT_DEBUG: Enables debug logs, and makes the script post to the debug channel (it should be either 'True' or 'False');
- JAMBABOT_ZUA: Enables zua, a word mapping algorithm to make the menus more fun (it should be either 'True' or 'False');
- JAMBABOT_DEBUG_URL: The URL provided by Slack - this one is used for debug purposes (only used if JAMBABOT_DEBUG is true);
- JAMBABOT_PROD_URL: The URL provided by Slack - this is one is used for production.

After defining the necessary variables, the script is run using:

    $ ./cardapio.js

*countdown.py*

This script is used to print a countdown before the correct lunch time (11:15AM).
It was designed to run only in the hour before that, calculating the minutes to the correct time and posting it to Slack.
When the counter reaches 0, a GIF is also posted.

This script was written using python3.
To run it, you should have 3 environment variables defined:

- JAMBABOT_DEBUG: Enables debug logs, and makes the script post to the debug channel (it should be either 'True' or 'False');
- JAMBABOT_ZUA: Enables zua, a word mapping algorithm to make the menus more fun (it should be either 'True' or 'False');
- JAMBABOT_DEBUG_URL: The URL provided by Slack - this one is used for debug purposes (only used if JAMBABOT_DEBUG is true);
- JAMBABOT_PROD_URL: The URL provided by Slack - this is one is used for production.

After defining the necessary variables, the script is run using:

    $ ./countdown.py

*jambabot.js*

This script implements a reactive bot, answering to simple requests from users.
There are currently to commands:

- jambabot cardapio [date/month]: Replies with today's menu (with some mockery depending on the time it's executed); if a date and month where supplied, it will search for that day's menu;
- jambabot spoiler: Replies with tomorrow's menu.

In development, any other command will result in a "Hello, world"-like reply, followed by an echo of the given command.

This script was written for run in NodeJS using JavaScript.
To run it, you must define a file named "variables.js" with three variables defined:

- JAMBABOT_ZUA: Enables zua, a word mapping algorithm to make the menus more fun (boolean);
- JAMBABOT_DEBUG_TOKEN: The token provided by Slack to validate that the post was originated from Slack - this one is used for debug purposes, printing additional logs;
- JAMBABOT_PROD_TOKEN: The token provided by Slack to validate that the post was originated from Slack - this one is used for production;
- GOOGLE_API_KEY: You custom Google's API key (used for image obtention, requires "Google Custom Search Engine API" to be enabled);
- GOOGLE_CSE_ID: You custom Google's search engine ID (used for image obtention, requires "Image search" to be enabled);
- PRE_DEFINED_IMAGES: Map of food name vs. image URLs to be used when looking for an image for a given food.

There's a stub file that you can use to guide you, "variables.js.stub".

After implementing this file, you can test your script by running:

    $ node jambabot.js

And making a post to it in the format, for example, using curl:

    $ curl --data "token=<The value of DEBUG or PROD token>&user_name=<Your user name>&text=jambabot <Your command>&trigger_word=jambabot" http://localhost:6001/trigger
