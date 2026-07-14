var express = require('express');
var router = express.Router();

/* GET API info. */
router.get('/', function (req, res) {
  res.json({ name: 'expressjs-api', status: 'running' });
});

module.exports = router;
