var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
	'job_title': { type: String, trim: true },
	'job_description': { type: String, trim: true },
	'job_type': { type: String, trim: true, enum: ['Permanent', 'Internship'] },
	'company_name': { type: String, trim: true },
	'min_cgpa': { type: mongoose.Decimal128, min: 0.0, max: 10.0 },
	'location': { type: String, trim: true },
	'allowed_branches': [
		{ type: String, trim: true, enum: ['CSE', 'ISE', 'Mech', 'Civil'] }
	],
	'Salary': { type: String, trim: true },
	'deadline': Date,
	'timestamp': { type: Date, default: Date.now() },
	'applied_students': [{
		type: Schema.Types.ObjectId,
		ref: 'Student'
	}],
	'status': { type: Boolean, default: true }
});

module.exports = mongoose.model('Post', postSchema);
