var mongoose   = require('mongoose');
var bcrypt     = require('bcryptjs');
var config     = require('../config/config')['development'];
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	username: {type: String, require: true, index: {unique: true }},
	password: {type: String, require: true, select: false }
});

UserSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
		bcrypt.hash(user.password, config.secretKey.length, function(err, hash) {
			user.password = hash;
			next();
		});
});

UserSchema.methods.comparePassword = function(password){
	var user = this;
	// console.log("res2: ", bcrypt.compareSync(pass, hash));
	return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('User', UserSchema);