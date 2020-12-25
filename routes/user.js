var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/user', function(req, res, next) {
  res.send('user info');
});



module.exports = router;
