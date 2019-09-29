const getJambaPostForDate = require('./utils/getJambaPostForDate');

(() => {
  function cardapio(_message, dateString) {
    const date = new Date();

    if (dateString) {
      const dateComponents = dateString.split('/');
      date.setMonth(parseInt(dateComponents[1], 10) - 1);
      date.setDate(parseInt(dateComponents[0], 10));
    }

    return getJambaPostForDate(date)
      .catch((error) => error.message);
  }

  module.exports = {
    pattern: /^cardapio(?: ([0-9]{1,2}\/[0-9]{1,2}))?$/,
    handler: cardapio,
    description: '*silviao cardapio [date/month]* : Replies with today\'s menu (with some mockery depending on the time it\'s executed); if a date and month where supplied, it will search for that day\'s menu',
    channels: { silviao: ['#delicias-do-jamba', '#dev-delicias-do-jamba', '@direct_message'] },
  };
})();
