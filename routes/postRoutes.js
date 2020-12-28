var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController.js');
var middleware = require('../middleware/index');

/*
 * GET
 */
router.get('/', middleware.isLoggedIn, postController.list);

router.get('/create', middleware.isAdmin, function(req, res) {
    res.render('post/create_post');
});

router.post('/:id/apply', postController.apply)

/*
 * GET
 */
router.get('/:id', middleware.isLoggedIn, postController.show);

/*
 * POST
 */
router.post('/', middleware.isAdmin, postController.create);

/*
 * PUT
 */
router.put('/:id', middleware.isAdmin, postController.update);

/*
 * DELETE
 */
router.delete('/:id', middleware.isAdmin, postController.remove);

module.exports = router;
