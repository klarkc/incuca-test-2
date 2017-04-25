var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('client'));

var url = 'mongodb://localhost:27017/incuca-test-2';
var Todos = require('./model.js')(url, 'incuca-test-2');

var sendError = function(res) {
  return function(err) {
    res.status(500).statusText(err.message);
  }
}

var sendAll = function(res) {
  return function() {
    // We should bind because promise changes json context
    Todos.findAll().then(res.json.bind(res));
  }
}

app.get('/api', function(req, res) {
  sendAll(res)();
});

app.post('/api', function(req, res) {
  var text = req.body.text;

  if(!text || typeof text !== 'string' || text.length < 1) {
    res.status(400).send('O texto da tarefa deve ser preenchido.');
    return;
  }

  Todos.insert(text).then(sendAll(res));
});

app.put('/api/:uid', function(req, res) {
  if(!req.params.uid) {
    res.status(400).send('O UID da tarefa precisa ser enviado.');
    return;
  }

  Todos.update(req.params.uid, res.body).then(sendAll(res));
});

app.delete('/api/:uid', function(req, res) {
  if(!req.params.uid) {
    res.status(400).send('O UID da tarefa precisa ser enviado.');
  }

  Todos.delete(req.params.uid).then(sendAll(res));
});

app.listen(8080);
