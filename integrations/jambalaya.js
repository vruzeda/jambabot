(function() {

  var request = require('request');
  var iconvlite = require('iconv-lite');

  var mongodb = require('./mongodb');

  function getJambaForDate(date, callback) {
    mongodb.findJambaForDate(date, function(error, jamba) {
      if (error) {
        callback(error, undefined);
        return;
      }

      if (jamba) {
        callback(null, jamba);
      } else {
        var today = new Date();
        if (date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
          parseJambasFromSite(function(error) {
            if (error) {
              callback(error, undefined);
              return;
            }

            mongodb.findJambaForDate(date, function(error, jamba) {
              if (error) {
                callback(error, undefined);
                return;
              }

              if (!jamba) {
                callback(new Error(`The jamba for ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} is unavailable!`), undefined);
              }

              callback(null, jamba);
            });
          });
        } else {
          callback(new Error(`The jamba for ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} is unavailable!`), undefined);
        }
      }
    });
  }

  function parseJambasFromSite(callback) {
    request({ url: 'http://www.refeicoesjambalaya.com.br/cardapio.asp', encoding: null }, function(error, response, data) {
      var jambaSite = iconvlite.decode(response.body, 'iso-8859-1');
      var paragraphs = jambaSite.split('<p>');
      var today = new Date();

      var jambas = [];
      var requestedJamba = undefined;

      for (var day = 1; day <= 31; ++day) {
        for (var i = 0; i < paragraphs.length; ++i) {
          var paragraph = paragraphs[i];
          if (paragraph.includes(`Dia: ${day} `)) {
            var jamba = parseJambaForDateFromParagraph(new Date(today.getFullYear(), today.getMonth(), day), paragraph);
            jambas.push(jamba);
          }
        }
      }

      mongodb.saveJambas(jambas, function(errors) {
        if (errors.filter((error) => error).length > 0) {
          callback(new Error('Couldn\'t save all jambas from site.'));
          return;
        }

        callback(null);
      });
    });
  }

  function parseJambaForDateFromParagraph(date, paragraph) {
    paragraph = paragraph.replace(/<b>/g, '');
    paragraph = paragraph.replace(/<\/b>/g, '');
    paragraph = paragraph.replace(/<font[^>]*>/g, '');
    paragraph = paragraph.replace(/<\/font>/g, '');
    paragraph = paragraph.replace(/<br>/g, '\n');

    var jamba = {};
    jamba.date = date;
    jamba.mainDishes = [];
    jamba.garnishes = [];
    jamba.salads = [];

    var lines = paragraph.split('\n');
    for (var j = 0; j < lines.length; ++j) {
      var line = lines[j];
      if (line.includes('Pratos principais: ')) {
        jamba.mainDishes = parseJambaLine(line, 'Pratos principais: ');
      } else if (line.includes('Guarnições: ')) {
        jamba.garnishes = parseJambaLine(line, 'Guarnições: ');
      } else if (line.includes('Saladas: ')) {
        jamba.salads = parseJambaLine(line, 'Saladas: ');
      }
    }

    return jamba;
  }

  function parseJambaLine(jambaLine, header) {
    return jambaLine.substring(jambaLine.indexOf(header) + header.length).split(' - ').reduce(function(foods, lineComponent) {
      if (lineComponent.length > 0) {
        foods.push(lineComponent.trim());
      }

      return foods;
    }, []);
  }

  module.exports = {
    getJambaForDate: getJambaForDate
  };

})();
