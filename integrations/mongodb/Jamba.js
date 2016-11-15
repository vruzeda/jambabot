(function() {

  var mongoose = require('mongoose');

  var JambaSchema = mongoose.Schema({
    formattedDate: { type: String, unique: true },
    mainDishes: [String],
    garnishes: [String],
    salads: [String]
  });
  var Jamba = mongoose.model('Jamba', JambaSchema);

  function findJambaForDate(date, callback) {
    var formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    Jamba.findOne({formattedDate: formattedDate}, function(error, jamba) {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (!jamba) {
        callback(null, undefined);
      } else {
        callback(null, {
          mainDishes: jamba.mainDishes,
          garnishes: jamba.garnishes,
          salads: jamba.salads
        });
      }
    });
  }

  function saveJambas(jambas, callback) {
    recursivelySaveJambas(jambas, 0, [], callback);
  }

  function recursivelySaveJambas(jambas, index, errors, callback) {
    if (index < jambas.length) {
      var jamba = jambas[index];
      var formattedDate = `${jamba.date.getFullYear()}-${jamba.date.getMonth() + 1}-${jamba.date.getDate()}`;

      Jamba.update({formattedDate: formattedDate}, {$set: {mainDishes: jamba.mainDishes, garnishes: jamba.garnishes, salads: jamba.salads}}, {upsert: true}, function(error) {
        errors.push(error);
        recursivelySaveJambas(jambas, index + 1, errors, callback);
      });
    } else {
      callback(errors);
    }
  }

  module.exports = {
    findJambaForDate: findJambaForDate,
    saveJambas: saveJambas
  };


})();
