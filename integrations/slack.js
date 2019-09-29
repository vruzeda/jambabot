const bodyParser = require('body-parser');
const { Botkit } = require('botkit');
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack');
const { MongoDbStorage } = require('botbuilder-storage-mongodb');
const express = require('express');
const variables = require('../variables');

(() => {
  function setupBotIntegration(botConfiguration, storage, webserver, onMessage) {
    const adapter = new SlackAdapter({
      clientId: botConfiguration.APP_CLIENT_ID,
      clientSecret: botConfiguration.APP_CLIENT_SECRET,
      clientSigningSecret: botConfiguration.APP_SIGNING_SECRET,
      getBotUserByTeam: async (teamId) => {
        const items = await storage.read([`botForTeam${teamId}`]);
        return items && items[`botForTeam${teamId}`] && items[`botForTeam${teamId}`].userId;
      },
      getTokenForTeam: async (teamId) => {
        const items = await storage.read([`botForTeam${teamId}`]);
        return items && items[`botForTeam${teamId}`] && items[`botForTeam${teamId}`].accessToken;
      },
      redirectUri: botConfiguration.APP_OAUTH_REDIRECT_URI,
      scopes: ['bot'],
    });

    adapter.use(new SlackEventMiddleware());
    adapter.use(new SlackMessageTypeMiddleware());

    const controller = new Botkit({
      adapter,
      storage,
      webserver,
      webhook_uri: `/${botConfiguration.TEAM_NAME}/api/messages`,
    });

    controller.webserver.get(`/${botConfiguration.TEAM_NAME}/`, (req, res) => {
      res.send(`This app is running Botkit ${controller.version}.`);
    });

    controller.webserver.get(`/${botConfiguration.TEAM_NAME}/install`, (req, res) => {
      res.redirect(controller.adapter.getInstallLink());
    });

    controller.webserver.get(`/${botConfiguration.TEAM_NAME}/install/auth`, async (req, res) => {
      try {
        const results = await controller.adapter.validateOauthCode(req.query.code);
        /* eslint-disable no-console */
        console.log(`FULL OAUTH DETAILS: ${JSON.stringify(results)}`);
        /* eslint-enable no-console */

        await controller.storage.write({
          [`botForTeam${results.team_id}`]: {
            accessToken: results.bot.bot_access_token,
            userId: results.bot.bot_user_id,
          },
        });

        res.json('Success! Bot installed.');
      } catch (err) {
        /* eslint-disable no-console */
        console.error(`OAUTH ERROR: ${err}`);
        /* eslint-enable no-console */
        res.status(401);
        res.send(err.message);
      }
    });

    controller.ready(() => {
      controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], async (botInstance, botMessage) => {
        const { api } = botInstance;

        const teamInfoResponse = await api.team.info({ team: botMessage.team });
        const usersInfoResponse = await api.users.info({ user: botMessage.user });
        const channelsInfoResponse = await api.channels.info({ channel: botMessage.channel })
          .catch(() => ({ ok: false }));
        const groupsInfoResponse = await api.groups.info({ channel: botMessage.channel })
          .catch(() => ({ ok: false }));

        let channel;
        if (channelsInfoResponse.ok) {
          channel = `#${channelsInfoResponse.channel.name}`;
        } else if (groupsInfoResponse.ok) {
          channel = `#${groupsInfoResponse.group.name}`;
        } else if (botMessage.type === 'direct_message') {
          channel = '@direct_message';
        } else {
          channel = undefined;
        }

        const message = {
          channel,
          userName: usersInfoResponse.user.name,
          team: teamInfoResponse.team.domain,
          userText: botMessage.text.replace(/\s+/g, ' ').trim(),
          preFormattedText: botMessage.text,
        };

        const response = await onMessage(message);
        if (response) {
          await botInstance.reply(botMessage, response);
        }
      });
    });
  }

  function setupBotIntegrations(onMessage) {
    const storage = new MongoDbStorage({
      url: variables.MONGO_CONNECTION_STR,
    });

    const webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    webserver.listen(variables.PORT, null, () => {
      /* eslint-disable no-console */
      console.log(`Express webserver configured and listening at port ${variables.PORT}`);
      /* eslint-enable no-console */
    });

    variables.BOT_CONFIGURATIONS.forEach((botConfiguration) => {
      setupBotIntegration(botConfiguration, storage, webserver, onMessage);
    });
  }

  module.exports = {
    setupBotIntegrations,
  };
})();
