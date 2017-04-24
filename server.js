var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('client'));

var tasksCounter = 0;
var tasks = [
  {text: 'Some task', done: true, uid: tasksCounter++},
  {text: 'Another task', done: false, uid: tasksCounter++}
];

app.get('/api', function(req, res) {
  res.json(tasks);
});

app.post('/api', function(req, res) {
  var task = {};
  var text = req.body.text;

  if(!text || typeof text !== 'string' || text.length < 1) {
    res.status(400).send('O texto da tarefa deve ser preenchido.');
    return;
  }

  task.uid = tasksCounter++;
  task.text = text;
  task.done = false;
  tasks.push(task);

  res.json(tasks);
});

app.post('/api/:uid', function(req, res) {
  if(!tasks[req.params.uid]) {
    res.status(404).send('Task #' + req.params.uid + 'não encontrada.');
    return;
  }

  tasks[req.params.uid] = req.body;
  res.json(tasks);
});

app.delete('/api/:uid', function(req, res) {
  if(!req.params.uid) {
    res.status(400).send('O UID da tarefa precisa ser enviado.');
  }

  if(!tasks[req.params.uid]) {
    res.status(404).send('Task #' + req.params.uid + 'não encontrada.');
    return;
  }

  tasks.splice(req.params.uid, 1);
  res.json(tasks);
});

app.listen(8080);
