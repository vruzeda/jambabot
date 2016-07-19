var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.get('/', function(req, res) {
    res.send('{"text": "Hello world!"}');
});

app.post('/trigger', function (req, res) {
  if (req.body.token === process.env.JAMBABOT_TOKEN) {
    var command = req.body.text.substr(req.body.trigger_word.length).replace(/\s+/g, " ").trim();

    res.send('{"text": "Hello, ' + req.body.user_name + '! You said [' + command + ']"}');
  }
});

app.listen(6001, function () {
  console.log('jambabot app listening on port 6001!');
});
