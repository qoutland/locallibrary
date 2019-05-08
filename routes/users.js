var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('The users page');
});

router.get('/cool', (req, res, next) => {
  res.send('You\'re so cool');
});

module.exports = router;
