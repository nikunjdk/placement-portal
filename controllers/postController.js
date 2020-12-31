var postModel = require('../models/postModel.js');
var studentModel = require('../models/studentModel');

/**
 * postController.js
 *
 * @description :: Server-side logic for managing posts.
 */
module.exports = {

    apply: function (req, res) {
        var usn = req.user.usn;
        var id = req.params.id;
        studentModel.findOne({ usn: usn }, function (err, student) {
            student.applied_posts.push(id);
            student.save();
        });
        postModel.findOne({ _id: id }, function (err, post) {
            post.applied_students.push(req.user._id);
            post.save();
        });
        res.redirect('/student/' + usn.toUpperCase());
    },

    /**
     * postController.list()
     */
    list: function (req, res) {
        postModel.find(function (err, posts) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting post.',
                    error: err
                });
            }
            return res.json(posts);
        });
    },

    query: function (req, res) {
        var query_type = req.params.type;
        var mongo_queries = {};
        if (query_type == 'showAll') {
            postModel.find(function (err, posts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting post.',
                        error: err
                    });
                }
                res.render('post/post_list', { posts: posts });
            });
        }
        else if (query_type == 'filter') {
            if (req.body.allowed_branches != null) {
                mongo_queries['allowed_branches'] = { $in: req.body.allowed_branches }
            }
            if (req.body.job_type != null) {
                mongo_queries['job_type'] = req.body.job_type
            }
            if (req.body.status != null) {
                mongo_queries['status'] = req.body.status
            }
            if (req.body.min_cgpa != '') {
                mongo_queries['min_cgpa'] = { $gte: req.body.min_cgpa }
            }
            if (req.body.Salary != '') {
                mongo_queries['Salary'] = { $gte: req.body.Salary }
            }
            postModel.find(mongo_queries, function (err, posts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting post.',
                        error: err
                    });
                }
                res.render('post/post_list', { posts: posts });
            })
        }
    },

    /**
     * postController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        postModel.findOne({ _id: id }).populate('applied_students').exec(function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting post.',
                    error: err
                });
            }
            if (!post) {
                return res.status(404).json({
                    message: 'No such post'
                });
            }
            return res.render('post/view_post', { post: post });
        });
    },

    /**
     * postController.create()
     */
    create: function (req, res) {
        var post = new postModel({
            job_title: req.body.job_title,
            job_description: req.body.job_description,
            job_type: req.body.job_type,
            company_name: req.body.company_name,
            min_cgpa: req.body.min_cgpa,
            location: req.body.location,
            allowed_branches: req.body.allowed_branches,
            Salary: req.body.Salary,
            deadline: req.body.deadline,
        });

        post.save(function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating post',
                    error: err
                });
            }
            return res.redirect('/post/' + post._id);
        });
    },

    /**
     * postController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        postModel.findOne({ _id: id }, function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting post',
                    error: err
                });
            }
            if (!post) {
                return res.status(404).json({
                    message: 'No such post'
                });
            }

            post.job_title = req.body.job_title ? req.body.job_title : post.job_title;
            post.job_description = req.body.job_description ? req.body.job_description : post.job_description;
            post.job_type = req.body.job_type ? req.body.job_type : post.job_type;
            post.company_name = req.body.company_name ? req.body.company_name : post.company_name;
            post.min_cgpa = req.body.min_cgpa ? req.body.min_cgpa : post.min_cgpa;
            post.location = req.body.location ? req.body.location : post.location;
            post.allowed_branches = req.body.allowed_branches ? req.body.allowed_branches : post.allowed_branches;
            post.Salary = req.body.Salary ? req.body.Salary : post.Salary;
            post.deadline = req.body.deadline ? req.body.deadline : post.deadline;
            post.timestamp = req.body.timestamp ? req.body.timestamp : post.timestamp;
            post.applied_students = req.body.applied_students ? req.body.applied_students : post.applied_students;
            post.status = req.body.status ? req.body.status : post.status;

            post.save(function (err, post) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating post.',
                        error: err
                    });
                }

                return res.json(post);
            });
        });
    },

    /**
     * postController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        postModel.findByIdAndRemove(id, function (err, post) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the post.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
