var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var adminSchema = new Schema({
	'username': { type: String, trim: true },
	'role': { type: String, default: 'admin', immutable: true }
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', adminSchema);
