var adminModel = require('../models/adminModel.js');

/**
 * adminController.js
 *
 * @description :: Server-side logic for managing admins.
 */
module.exports = {

    /**
     * adminController.list()
     */
    list: function (req, res) {
        adminModel.find(function (err, admins) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting admin.',
                    error: err
                });
            }
            return res.json(admins);
        });
    },

    /**
     * adminController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        adminModel.findOne({ _id: id }, function (err, admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting admin.',
                    error: err
                });
            }
            if (!admin) {
                return res.status(404).json({
                    message: 'No such admin'
                });
            }
            return res.json(admin);
        });
    },

    /**
     * adminController.create()
     */
    create: function (req, res) {
        var admin = new adminModel({
            username: req.body.username,
        });

        adminModel.register(admin, req.body.password, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating admin',
                    error: err
                });
            }
            return res.status(201).json(admin);
        });
    },

    /**
     * adminController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        adminModel.findOne({ _id: id }, function (err, admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting admin',
                    error: err
                });
            }
            if (!admin) {
                return res.status(404).json({
                    message: 'No such admin'
                });
            }

            admin.username = req.body.username ? req.body.username : admin.username;
            admin.role = req.body.role ? req.body.role : admin.role;

            admin.save(function (err, admin) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating admin.',
                        error: err
                    });
                }

                return res.json(admin);
            });
        });
    },

    /**
     * adminController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        adminModel.findByIdAndRemove(id, function (err, admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the admin.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
