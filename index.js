(function() {

  var bodyParser = require('body-parser');
  var express = require('express');
  var http = require('http');
  var iconvlite = require('iconv-lite');

  var variables = require('./variables.js');

  var DEFAULT_ERROR_MESSAGE = 'O site do Jamba está fora do ar :cry:\n\
    Dá uma checada no <https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|iFood>...\n\
    Ou liga lá: <tel:1932513928|(19) 3251-3928> | <tel:1932537573|(19) 3253-7573>\n\
    \n\
    (Ou <#C0HNHSCP9>, fazer o quê :stuck_out_tongue_winking_eye:)';

  function debug(debugEnabled) {
    if (debugEnabled) {
      console.log.apply(console, Array.prototype.slice.call(arguments, 1));
    }
  }

  function postToSlack(debugEnabled, slackResponse, text) {
    debug(debugEnabled, text);
    slackResponse.send('{"text": ' + JSON.stringify(text) + '}');
  }

  function postJambaToSlack(debugEnabled, slackResponse, date) {
    var jambaRequest = http.request({ host: 'www.refeicoesjambalaya.com.br', port: 80, path: '/cardapio.asp' }, function(jambaResponse) {
      var jambaSite = '';

      jambaResponse.on('data', function(chunk) {
        jambaSite += iconvlite.decode(chunk, 'iso-8859-1');
      });

      jambaResponse.on('end', function() {
        debug(debugEnabled, jambaSite);

        var months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
        if (!jambaSite.includes(months[date.getMonth()])) {
          postToSlack(debugEnabled, slackResponse, 'O cardápio para ' + date.getDate() + '/' + (date.getMonth() + 1) + ' ainda não está disponível!');
          return;
        }

        if (date.getDay() == 0) {
          // Sunday
          postToSlack(debugEnabled, slackResponse, 'O Jambalaya não abre de domingos!');
          return;
        }

        var dateString = 'Dia: ' + date.getDate();

        var allJamba = jambaSite.split('<p>');
        for (var jambaIndex in allJamba) {
          var jamba = allJamba[jambaIndex];
          debug(debugEnabled, jamba);

          if (jamba.includes(dateString)) {
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            var tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (date.getTime() < today.getTime()) {
              jamba = '*TOO LATE!* :marco:\n\n' + jamba;
            } else if (date.getTime() >= tomorrow.getTime()) {
              jamba = '*SPOILER* :junim:\n\n' + jamba;
            } else {
              if (10 <= today.getHours() && today.getHours() < 11) {
                jamba = '*AINDA NÃO PEDIU?*\n\n' + jamba;
              } else if (today.getHours() >= 11) {
                jamba = '*TOO LATE!* :marco:\n\n' + jamba;
              }

              jamba = jamba + '\n\n<https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|Pedir>';
            }

            jamba = jamba.replace(/<b>/g, '');
            jamba = jamba.replace(/<\/b>/g, '');
            jamba = jamba.replace(/<br>/g, '\n');

            if (variables.JAMBABOT_ZUA) {
              jamba = jamba.replace(/sexta-feira/g, ':pizza:-feira');
              jamba = jamba.replace(/Frango supremo/g, ':sparkles:FRANGO SUPREMO:sparkles: :heart:');
              jamba = jamba.replace(/Penne/g, 'Pênis');
              jamba = jamba.replace(/Picadinho/g, 'Pecadinho');
              jamba = jamba.replace(/à milanesa/g, 'ali na mesa');
              jamba = jamba.replace(/à dorê/g, 'adorei');
              jamba = jamba.replace(/Feijoada/g, 'Feijuca :heartmucholoko:');
            }

            postToSlack(debugEnabled, slackResponse, jamba);
            return;
          }
        }

        debug(debugEnabled, 'Something went wrong...');
        postToSlack(debugEnabled, slackResponse, 'O cardápio para ' + date.getDate() + '/' + (date.getMonth() + 1) + ' ainda não está disponível!');
      });

      jambaResponse.on('error', function() {
        postToSlack(debugEnabled, slackResponse, DEFAULT_ERROR_MESSAGE);
      });
    });

    jambaRequest.end();
  }

  function postJambaMenuToSlack(debugEnabled, slackResponse, date) {
    if (!date) {
      date = new Date();
    }

    postJambaToSlack(debugEnabled, slackResponse, date);
  }

  function postJambaSpoilerToSlack(debugEnabled, slackResponse, nextDay) {
    if (!nextDay) {
      nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);

      if (nextDay.getDay() == 0) {
        // Sunday -> Monday
        nextDay.setDate(nextDay.getDate() + 1);
      } else if (nextDay.getDay() == 6) {
        // Saturday -> Monday
        nextDay.setDate(nextDay.getDate() + 2);
      }
    }

    postJambaToSlack(debugEnabled, slackResponse, nextDay);
  }

  function postHelloWorldToSlack(debugEnabled, slackResponse, username, command) {
    postToSlack(debugEnabled, slackResponse, 'Hello, ' + username + '! You said [' + command + ']');
  }

  function processCommand(debugEnabled, slackRequest, slackResponse) {
    debug(debugEnabled, JSON.stringify(slackRequest.body));

    var command = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();

    if (/^cardapio$/.test(command)) {
      postJambaMenuToSlack(debugEnabled, slackResponse);
    } else if (/^spoiler$/.test(command)) {
      postJambaSpoilerToSlack(debugEnabled, slackResponse);
    } else if (/^cardapio [0-9]{1,2}\/[0-9]{1,2}$/.test(command) || /^spoiler [0-9]{1,2}\/[0-9]{1,2}$/.test(command)) {
      var parameters = command.split(' ');
      var dateComponents = parameters[1].split('/');

      var date = new Date();
      date.setMonth(parseInt(dateComponents[1]) - 1);
      date.setDate(parseInt(dateComponents[0]));

      postJambaMenuToSlack(debugEnabled, slackResponse, date);
    } else if (debugEnabled) {
      postHelloWorldToSlack(debugEnabled, slackResponse, slackRequest.body.user_name, command);
    }
  }

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function (slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.JAMBABOT_PROD_TOKEN) {
      processCommand(false, slackRequest, slackResponse);
    } else if (slackRequest.body.token === variables.JAMBABOT_DEBUG_TOKEN) {
      processCommand(true, slackRequest, slackResponse);
    } else {
      slackResponse.sendStatus(403);
    }
  });

  app.listen(6001, function () {
    console.log('jambabot app listening on port 6001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}())
