var studentModel = require('../models/studentModel.js');

/**
 * studentController.js
 *
 * @description :: Server-side logic for managing students.
 */
module.exports = {

    query: function (req, res) {
        var query_type = req.params.type;
        var mongo_queries = {};
        if (query_type == 'showAll') {
            studentModel.find(function (err, students) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting student.',
                        error: err
                    });
                }
                return res.render('student/student_list', { students: students });
            });
        }
        else if (query_type == 'showUsn') {
            res.redirect('/student/' + req.body.usn.toUpperCase());
        }
        else if (query_type == 'filter') {
            console.log(req.body)
            if (req.body.passout_year != null) {
                mongo_queries['passout_year'] = { $in: req.body.passout_year }
            }
            if (req.body.branch != null) {
                mongo_queries['branch'] = { $in: req.body.branch }
            }
            if (req.body.gender != null) {
                mongo_queries['gender'] = req.body.gender;
            }
            if (req.body.minCgpa != '' || req.body.maxCgpa != '') {
                var minCgpa = req.body.minCgpa;
                var maxCgpa = req.body.maxCgpa;
                if (minCgpa != '' && maxCgpa != '') {
                    mongo_queries['cgpa'] = { $gte: minCgpa, $lte: maxCgpa }
                }
                else if (minCgpa == '') {
                    mongo_queries['cgpa'] = { $lte: maxCgpa }
                }
                else {
                    mongo_queries['cgpa'] = { $gte: minCgpa }
                }
            }
            if (req.body.status != null) {
                mongo_queries['status'] = req.body.status
            }
            studentModel.find(mongo_queries, function (err, students) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting student.',
                        error: err
                    });
                }
                return res.render('student/student_list', { students: students });
            })
        }
    },

    /**
     * studentController.show()
     */
    show: function (req, res) {
        var usn = req.params.usn.toUpperCase();
        studentModel.findOne({ usn: usn }).populate('applied_posts').exec(function (err, student) {
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
            return res.render('student/view_profile', { student: student });
        });
    },

    /**
     * studentController.create()
     */
    create: function (req, res) {
        var student = new studentModel({
            usn: req.body.usn.toUpperCase(),
            name: req.body.name,
            passout_year: req.body.passout_year,
            branch: req.body.branch,
            gender: req.body.gender,
            contact_number: req.body.contact_number,
            email_id: req.body.email_id,
            cgpa: req.body.cgpa,
            resume_url: req.body.resume_url,
        });
        studentModel.register(student, req.body.password, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating student',
                    error: err
                });
            }
            return res.redirect('/student/' + student.usn);
        });
    },

    /**
     * studentController.update()
     */
    update: function (req, res) {
        console.log('inside update function');
        var usn = req.params.usn;
        studentModel.findOne({ usn: usn }, function (err, student) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting student',
                    error: err
                });
            }
            if (!student) {
                return res.status(404).json({
                    message: 'No such student'
                });
            }

            student.usn = req.body.usn ? req.body.usn : student.usn;
            student.name = req.body.name ? req.body.name : student.name;
            student.passout_year = req.body.passout_year ? req.body.passout_year : student.passout_year;
            student.branch = req.body.branch ? req.body.branch : student.branch;
            student.gender = req.body.gender ? req.body.gender : student.gender;
            student.contact_number = req.body.contact_number ? req.body.contact_number : student.contact_number;
            student.email_id = req.body.email_id ? req.body.email_id : student.email_id;
            student.cgpa = req.body.cgpa ? req.body.cgpa : student.cgpa;
            student.resume_url = req.body.resume_url ? req.body.resume_url : student.resume_url;
            student.role = req.body.role ? req.body.role : student.role;
            student.status = req.body.status ? req.body.status : student.status;
            student.applied_posts = req.body.applied_posts ? req.body.applied_posts : student.applied_posts;

            student.save(function (err, student) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating student.',
                        error: err
                    });
                }

                return res.redirect('/student/' + student.usn);
            });
        });
    },

    /**
     * studentController.remove()
     */
    remove: function (req, res) {
        var usn = req.params.usn;
        studentModel.findOneAndRemove({ usn: usn }, function (err, student) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the student.',
                    error: err
                });
            }
            req.flash('success', 'Student successfully deleted')
            return res.redirect('/');
        });
    },

    goToEdit: function (req, res) {
        var usn = req.params.usn;
        studentModel.findOne({ usn: usn }, function (err, student) {
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
            return res.render('student/edit_profile', { student: student });
        });
    }
};
