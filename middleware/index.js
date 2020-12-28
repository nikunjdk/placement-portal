var Student = require('../models/studentModel');

function isLoggedIn (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to access this');
    res.redirect('/');
}

function isAdmin (req, res, next) {
    if(!req.isAuthenticated() || req.user.role === 'student') {
        req.flash('error', 'You need to be logged in as an admin to access this');
        res.redirect('/admin/login');
    } else {
        if(req.user.role === 'admin') {
            return next();
        }
    }
}

function checkProfileOwner(req, res, next) {
    var usn = req.params.usn;
    if(!req.isAuthenticated()) {
        req.flash('error', 'You need to be logged in to access this');
        res.redirect('/');
    }
    else {
        Student.findOne({usn: usn}, function (err, student) {
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
            if(usn != student.usn) {
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
    checkProfileOwner
}