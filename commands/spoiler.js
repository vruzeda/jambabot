const getJambaPostForDate = require('./utils/getJambaPostForDate');

(() => {
  function spoiler(message, callback) {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    if (date.getDay() === 0) {
      // Sunday -> Monday
      date.setDate(date.getDate() + 1);
    } else if (date.getDay() === 6) {
      // Saturday -> Monday
      date.setDate(date.getDate() + 2);
    }

    getJambaPostForDate(callback, date);
  }

  module.exports = {
    pattern: /^spoiler$/,
    handler: spoiler,
    description: '*silviao spoiler* : Replies with tomorrow\'s menu',
    channels: ['delicias-do-jamba', 'dev-delicias-do-jamba']
  };
})();
