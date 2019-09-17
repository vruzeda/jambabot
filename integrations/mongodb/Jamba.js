const mongoose = require('mongoose');

(() => {
  const JambaSchema = mongoose.Schema({
    formattedDate: { type: String, unique: true },
    mainDishes: [String],
    garnishes: [String],
    salads: [String]
  });
  const Jamba = mongoose.model('Jamba', JambaSchema);

  function findJambaForDate(date) {
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    return Jamba.findOne({ formattedDate })
      .then((jamba) => {
        if (!jamba) {
          return undefined;
        }

        return {
          mainDishes: jamba.mainDishes,
          garnishes: jamba.garnishes,
          salads: jamba.salads
        };
      });
  }

  function saveJambas(jambas) {
    return Promise.all(jambas.map(saveJamba));
  }

  function saveJamba(jamba) {
    const formattedDate = `${jamba.date.getFullYear()}-${jamba.date.getMonth() + 1}-${jamba.date.getDate()}`;
    const jambaComponents = {
      $set: {
        mainDishes: jamba.mainDishes,
        garnishes: jamba.garnishes,
        salads: jamba.salads
      }
    };

    return new Promise((resolve, reject) => {
      Jamba.updateMany({ formattedDate }, jambaComponents, { upsert: true }, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(true);
      });
    });
  }

  module.exports = {
    findJambaForDate,
    saveJambas
  };
})();
