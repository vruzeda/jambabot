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

        var dateString = 'Dia: ' + date.getDate();

        var allJamba = jambaSite.split('<p>');
        for (var jambaIndex in allJamba) {
          var jamba = allJamba[jambaIndex];
          debug(debugEnabled, jamba);

          if (jamba.includes(dateString)) {
            var today = new Date();

            if (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getYear() == date.getYear()) {
              // Today's menu
              if (10 <= today.getHours() && today.getHours() < 11) {
                jamba = '*AINDA NÃO PEDIU?*\n\n' + jamba;
              } else if (today.getHours() >= 11) {
                jamba = '*TOO LATE!* :marco:\n\n' + jamba;
              }

              jamba = jamba + '\n\n<https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|Pedir>';
            } else {
              // Spoiler's menu
              jamba = '*SPOILER* :junim:\n\n' + jamba;
            }


            jamba = jamba.replace(/<b>/g, '');
            jamba = jamba.replace(/<\/b>/g, '');
            jamba = jamba.replace(/<br>/g, '\n');

            if (process.env.JAMBABOT_ZUA === 'True') {
              jamba = jamba.replace(/sexta-feira/g, ':pizza:-feira');
              jamba = jamba.replace(/Frango supremo/g, ':sparkles:FRANGO SUPREMO:sparkles: :heart:');
              jamba = jamba.replace(/Penne/g, 'Pênis');
              jamba = jamba.replace(/Fricassê/g, 'Freakazoid');
              jamba = jamba.replace(/Picadinho/g, 'Pecadinho');
              jamba = jamba.replace(/à milanesa/g, 'ali na mesa');
              jamba = jamba.replace(/Fígado/g, 'Fícado');
              jamba = jamba.replace(/à dorê/g, 'adorei');
              jamba = jamba.replace(/Feijoada/g, 'Feijuca :heartmucholoko:');
              jamba = jamba.replace(/Saladas/g, 'Saladas (WHO CARES?)');
            }

            postToSlack(debugEnabled, slackResponse, jamba);
            return;
          }
        }

        postToSlack(debugEnabled, slackResponse, 'O cardápio para ' + date.getDate() + '/' + (date.getMonth() + 1) + ' ainda não está disponível!');
      });

      jambaResponse.on('error', function() {
        postToSlack(debugEnabled, slackResponse, DEFAULT_ERROR_MESSAGE);
      });
    });

    jambaRequest.end();
  }

  function postJambaMenuToSlack(debugEnabled, slackResponse) {
      var today = new Date();
      postJambaToSlack(debugEnabled, slackResponse, today);
  }

  function postJambaSpoilerToSlack(debugEnabled, slackResponse) {
    var nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);

    if (nextDay.getDay() == 0) {
      // Sunday -> Monday
      nextDay.setDate(nextDay.getDate() + 1);
    } else if (nextDay.getDay() == 6) {
      // Saturday -> Monday
      nextDay.setDate(nextDay.getDate() + 2);
    }

    postJambaToSlack(debugEnabled, slackResponse, nextDay);
  }

  function postHelloWorldToSlack(debugEnabled, slackResponse, username, command) {
    postToSlack(debugEnabled, slackResponse, 'Hello, ' + username + '! You said [' + command + ']');
  }

  function processCommand(debugEnabled, slackRequest, slackResponse) {
    debug(debugEnabled, JSON.stringify(slackRequest.body));

    var command = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, " ").trim();

    if (command === "cardapio") {
      postJambaMenuToSlack(debugEnabled, slackResponse);
    } else if (command === "spoiler") {
      postJambaSpoilerToSlack(debugEnabled, slackResponse);
    } else {
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
