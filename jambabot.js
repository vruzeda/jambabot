const parseCommand = require('./commands/parseCommand');
const slack = require('./integrations/slack');

(() => {
  slack.setupBotIntegrations(parseCommand);
})();
