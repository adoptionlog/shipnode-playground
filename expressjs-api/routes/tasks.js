var express = require('express');
var router = express.Router();

var tasks = [];
var nextId = 1;

router.get('/', function (req, res) {
  res.json(tasks);
});

router.post('/', function (req, res) {
  var task = { id: nextId++, title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

router.get('/:id', function (req, res) {
  var task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

router.patch('/:id', function (req, res) {
  var task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  Object.assign(task, req.body);
  res.json(task);
});

router.delete('/:id', function (req, res) {
  var index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).end();
});

module.exports = router;
