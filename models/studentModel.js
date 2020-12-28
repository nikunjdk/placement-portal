var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var studentSchema = new Schema({
	'usn' : {type: String, trim: true, unique:true, uppercase: true},
	'name' : {type: String, trim: true},
	'passout_year' : Number,
	'branch' : {type: String, trim: true, enum: ['CSE', 'ISE', 'Mech', 'Civil']},
	'gender' : {type: String, trim: true, enum: ['male', 'female']},
	'contact_number' : {type: String, trim: true},
	'email_id' : {type: String, trim: true},
	'cgpa' : {type: mongoose.Decimal128, min: 0.0, max: 10.0},
	'resume_url' : {type: String, trim: true},
	'role' : {type: String, trim: true, default: 'student', immutable: true},
	'status' : {type: Boolean, default: false},
	'applied_posts' : [{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
	}]
});

studentSchema.plugin(passportLocalMongoose, { usernameField: 'usn'});

module.exports = mongoose.model('Student', studentSchema);
