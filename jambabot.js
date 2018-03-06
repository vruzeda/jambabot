const parseCommand = require('./commands/parseCommand');
const slack = require('./integrations/slack');
const variables = require('./variables');


(() => {
  let jambabotUserTokens = variables.JAMBABOT_USER_TOKEN;
  if (!(jambabotUserTokens instanceof Array)) {
    jambabotUserTokens = [jambabotUserTokens];
  }
  jambabotUserTokens.forEach((userToken) => {
    slack.bot(userToken).startRTM((error) => {
      if (error) {
        console.warn(`Failed to start RTM: ${error}`);
        return;
      }

      console.info('RTM started!');
    });
  });

  slack.controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], (botInstance, botMessage) => {
    const { api } = botInstance;

    api.users.info({ user: botMessage.user }, (error, usersInfoResponse) => {
      const userName = usersInfoResponse.user.name;

      api.channels.info({ channel: botMessage.channel }, (errorChannels, channelsInfoResponse) => {
        api.groups.info({ channel: botMessage.channel }, (errorGroups, groupsInfoResponse) => {
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
            userName,
            team: botInstance.team_info.domain,
            userText: botMessage.text.replace(/\s+/g, ' ').trim(),
            preFormattedText: botMessage.text
          };

          console.info(message);

          parseCommand(message, (response) => {
            if (response) {
              botInstance.reply(botMessage, response);
            }
          });
        });
      });
    });
  });
})();
