(function() {

  var jamba = require('../../integrations/jamba.js');
  var mongodb = require('../../integrations/mongodb.js');
  var googleImages = require('../../integrations/googleImages.js');

  function getJambaPostForDate(callback, date) {
    // Check if the date is in the current month (and year, just for safety)
    var today = new Date();
    if (date.getMonth() != today.getMonth() || date.getYear() != today.getYear()) {
      callback('O cardápio para ' + date.getDate() + '/' + (date.getMonth() + 1) + ' não está disponível!');
      return;
    }

    // Check if the date is a sunday
    if (date.getDay() == 0) {
      callback('O Jambalaya não abre de domingos!');
      return;
    }

    jamba.getJambas(function(error, jambas) {
      if (error) {
        callback('O site do Jamba está fora do ar :cry:\nDá uma checada no <https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|iFood>...\nOu liga lá: <tel:1932513928|(19) 3251-3928> | <tel:1932537573|(19) 3253-7573>\n\n(Ou <#C0HNHSCP9>, fazer o quê :stuck_out_tongue_winking_eye:)');
        return;
      }

      var header = '';
      var body = '';
      var footer = '';

      var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      var tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.getTime() < today.getTime()) {
        header = '*TOO LATE!* :marco:\n\n';
      } else if (date.getTime() >= tomorrow.getTime()) {
        header = '*SPOILER* :junim:\n\n';
      } else {
        if (10 <= today.getHours() && today.getHours() < 11) {
          header = '*AINDA NÃO PEDIU?*\n\n';
        } else if (today.getHours() >= 11) {
          header = '*TOO LATE!* :marco:\n\n';
        }

        footer = '\n\n<https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|Pedir>';
      }

      var jamba = jambas[date.getDate()];
      if (!jamba) {
        callback('O cardápio para ' + date.getDate() + '/' + (date.getMonth() + 1) + ' não está disponível!');
        return;
      }

      getImageForMainDishes(jamba.mainDishes, function(images) {
        if (jamba.mainDishes.length > 0) {
          body += 'Pratos principais: ';
          for (var i = 0; i < jamba.mainDishes.length; ++i) {
            var mainDish = jamba.mainDishes[i];
            var image = images[i];

            if (i > 0) {
              body += ' - ';
            }

            if (image) {
              body += '<' + image + '|' + mainDish + '>';
            } else {
              body += mainDish;
            }
          }
        }

        if (jamba.garnishes.length > 0) {
          if (body.length > 0) {
            body += '\n';
          }

          body += 'Guarnições: ' + jamba.garnishes.join(' - ');
        }

        if (jamba.salads.length > 0) {
          if (body.length > 0) {
            body += '\n';
          }

          body += 'Saladas: ' + jamba.salads.join(' - ');
        }

        if (require('../../variables.js').JAMBABOT_ZUA) {
          body = body.replace(/sexta-feira/g, ':pizza:-feira');
          body = body.replace(/Frango supremo/g, ':sparkles:FRANGO SUPREMO:sparkles: :heart:');
          body = body.replace(/Penne/g, 'Pênis');
          body = body.replace(/Picadinho/g, 'Pecadinho');
          body = body.replace(/à milanesa/g, 'ali na mesa');
          body = body.replace(/à dorê/g, 'adorei');
          body = body.replace(/Feijoada/g, 'Feijuca :heartmucholoko:');
          body = body.replace(/Nhoque/g, 'Guinóxi');
        }

        callback(header + body + footer);
      });
    });
  }

  function getImageForMainDishes(mainDishes, callback) {
    recursivelyGetImageForMainDishes(mainDishes, 0, [], callback);
  }

  function recursivelyGetImageForMainDishes(mainDishes, index, images, callback) {
    console.log('Getting image for ' + mainDishes[index] + ' (' + (index + 1) + ' of ' + mainDishes.length + ')');

    if (index < mainDishes.length) {
      getImage(mainDishes[index], function(error, image) {
        if (error) {
          console.log(error);
        }

        images.push(image);
        recursivelyGetImageForMainDishes(mainDishes, index + 1, images, callback);
      });
    } else {
      callback(images);
    }
  }

  function getImage(query, callback) {
    mongodb.getImageForDish(query, function(error, preDefinedImage) {
      if (preDefinedImage) {
        callback(null, preDefinedImage);
        return;
      }

      googleImages.getRandomImage(query, callback);
    });
  }

  module.exports = getJambaPostForDate;

})();
