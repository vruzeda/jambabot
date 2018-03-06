const mongoose = require('mongoose');

(() => {
  const JambaSchema = mongoose.Schema({
    formattedDate: { type: String, unique: true },
    mainDishes: [String],
    garnishes: [String],
    salads: [String]
  });
  const Jamba = mongoose.model('Jamba', JambaSchema);

  function findJambaForDate(date, callback) {
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    Jamba.findOne({ formattedDate })
      .then((jamba) => {
        if (!jamba) {
          callback(null, undefined);
        } else {
          callback(null, {
            mainDishes: jamba.mainDishes,
            garnishes: jamba.garnishes,
            salads: jamba.salads
          });
        }
      }, (error) => {
        callback(error, undefined);
      });
  }

  function saveJambas(jambas, callback) {
    recursivelySaveJambas(jambas, 0, [], callback);
  }

  function recursivelySaveJambas(jambas, index, errors, callback) {
    if (index < jambas.length) {
      const jamba = jambas[index];
      const formattedDate = `${jamba.date.getFullYear()}-${jamba.date.getMonth() + 1}-${jamba.date.getDate()}`;
      const jambaComponents = {
        $set: {
          mainDishes: jamba.mainDishes,
          garnishes: jamba.garnishes,
          salads: jamba.salads
        }
      };

      Jamba.update({ formattedDate }, jambaComponents, { upsert: true })
        .then(() => {
          errors.push(null);
          recursivelySaveJambas(jambas, index + 1, errors, callback);
        }, (error) => {
          errors.push(error);
          recursivelySaveJambas(jambas, index + 1, errors, callback);
        });
    } else {
      callback(errors);
    }
  }

  module.exports = {
    findJambaForDate,
    saveJambas
  };
})();
