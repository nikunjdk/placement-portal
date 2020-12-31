var express = require('express');
var router = express.Router();
var passport = require('passport');
// var adminController = require('../controllers/adminController.js');
var middleware = require('../middleware/index');

/* GET admin login page. */
router.get('/login', function (req, res, next) {
  res.render('admin/login');
});

router.post('/login', passport.authenticate('admin-local', { failureRedirect: 'login', failureFlash: true }), function (req, res, next) {
  res.redirect('/admin');
});


/*
 * GET
 */
router.get('/', middleware.isAdmin, function (req, res) {
  res.render('admin/home');
});

/*
 * GET
 */
// router.get('/:id', adminController.show);

/*
 * POST
 */
// router.post('/signup', adminController.create);

/*
 * PUT
 */
// router.put('/:id', adminController.update);

/*
 * DELETE
 */
// router.delete('/:id', adminController.remove);

module.exports = router;
