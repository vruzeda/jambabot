(function() {

  var http = require('http');
  var iconvlite = require('iconv-lite');

  var CACHED_JAMBAS = {};

  function getJambas(callback) {
    var today = new Date();
    var hash = today.getMonth() + '/' + today.getYear();

    // If we have this month's Jamba cached, use it!
    var cachedJamba = CACHED_JAMBAS[hash];
    if (cachedJamba) {
      callback(null, cachedJamba);
      return;
    }

    // Otherwise, discard any cache
    CACHED_JAMBAS = {};

    var jambaRequest = http.request({ host: 'www.refeicoesjambalaya.com.br', port: 80, path: '/cardapio.asp' }, function(jambaResponse) {
      var jambaSite = '';

      jambaResponse.on('data', function(chunk) {
        jambaSite += iconvlite.decode(chunk, 'iso-8859-1');
      });

      jambaResponse.on('end', function() {
        var jambas = {};

        var paragraphs = jambaSite.split('<p>');
        for (var day = 0; day < 31; ++day) {
          var date = new Date();
          date.setDate(day);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);

          // Checks if date is still in the current month
          if (date.getMonth() == today.getMonth()) {
            for (var i = 0; i < paragraphs.length; ++i) {
              var paragraph = paragraphs[i];
              if (paragraph.includes('Dia: ' + day + ' ')) {
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
                    jamba.mainDishes = line.substring('Pratos principais: '.length).split(' - ');
                  } else if (line.includes('Guarnições: ')) {
                    jamba.garnishes = line.substring('Guarnições: '.length).split(' - ');
                  } else if (line.includes('Saladas: ')) {
                    jamba.salads = line.substring('Saladas: '.length).split(' - ');
                  }
                }

                jambas[date.getDate()] = jamba;
                break;
              }
          }
          }
        }

        // Cache this Jamba for future use!
        CACHED_JAMBAS[hash] = jambas;

        callback(null, jambas);
      });

      jambaResponse.on('error', function(error) {
        callback(error, undefined);
      });
    });

    jambaRequest.end();
  }

  module.exports = getJambas;

})();
