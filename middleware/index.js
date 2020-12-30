var Student = require('../models/studentModel');
var Posts = require('../models/postModel')

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to access this');
    res.redirect('/');
}

function isAdmin(req, res, next) {
    if (!req.isAuthenticated() || req.user.role === 'student') {
        req.flash('error', 'You need to be logged in as an admin to access this');
        res.redirect('/admin/login');
    } else {
        if (req.user.role === 'admin') {
            return next();
        }
    }
}

function isEligible(req, res, next) {
    var student = req.user;
    var post_id = req.params.id;
    Posts.findById(post_id, function (err, post) {
        console.log('post', post, 'student.cgpa', student.cgpa, 'post.min_cgpa', post.min_cgpa, '(parseFloat(parseFloat(student.cgpa).toFixed(2)) < parseFloat(parseFloat(post.min_cgpa).toFixed(2))', (parseFloat(parseFloat(student.cgpa).toFixed(2)) > parseFloat(parseFloat(post.min_cgpa).toFixed(2)), 'post.deadlinie > Date.now()', post.deadlinie > Date.now(), 'student.branch', student.branch, '!post.allowed_branches.includes(student.branch)', '!post.status', !post.status, !post.allowed_branches.includes(student.branch), 'student.branch', student.branch, 'student.applied_posts', student.applied_posts, 'student.applied_posts.includes(post_id)', student.applied_posts.includes(post_id)))
        if ((parseFloat(parseFloat(student.cgpa).toFixed(2)) > parseFloat(parseFloat(post.min_cgpa).toFixed(2))) || post.deadlinie > Date.now() || !post.allowed_branches.includes(student.branch) || !post.status || student.applied_posts.includes(post_id)) {
            req.flash('error', 'You are not eligible for this post');
            res.redirect('/post/' + post_id);
        }
        else
            return next();
    })
}

function checkProfileOwner(req, res, next) {
    var usn = req.params.usn;
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to be logged in to access this');
        res.redirect('/');
    }
    else {
        Student.findOne({ usn: usn }, function (err, student) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting student.',
                    error: err
                });
            }
            if (!student) {
                return res.status(404).json({
                    message: 'No such student'
                });
            }
            if (usn != student.usn) {
                req.flash('error', 'You need to be logged in as an admin or the owner of the profile to access this');
                res.redirect('/');
            }
            else {
                return next();
            }
        });
    }
}

module.exports = {
    isLoggedIn,
    isAdmin,
    checkProfileOwner,
    isEligible
}