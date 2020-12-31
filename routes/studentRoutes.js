var express = require('express');
var router = express.Router();
var passport = require('passport');
var studentController = require('../controllers/studentController.js');
var middleware = require('../middleware/index')

/* GET student sign up page. */
router.get('/signup', function (req, res, next) {
    res.render('student/signup');
});
/* POST student sign up page. */
router.post('/signup', studentController.create);

/* GET student login page. */
router.get('/login', function (req, res, next) {
    res.render('student/login');
});

router.post('/login', passport.authenticate('student-local', { failureRedirect: '/student/login', failureFlash: true, successFlash: true }), function (req, res) {
    res.redirect('/student/' + req.body.usn.toUpperCase());
});
/*
 * GET
 */
router.get('/', middleware.isAdmin, function (req, res) {
    res.render('student/filter');
});

router.post('/:type', middleware.isAdmin, studentController.query);

/*
 * GET
 */
router.get('/:usn', middleware.checkProfileOwner, studentController.show);

/*
 * POST
 */
// router.post('/', studentController.create);

router.get('/:usn/edit', middleware.checkProfileOwner, studentController.goToEdit)

/*
 * PUT
 */
router.put('/:usn', middleware.checkProfileOwner, studentController.update);

/*
 * DELETE
 */
router.delete('/:usn', middleware.checkProfileOwner, studentController.remove);

module.exports = router;
