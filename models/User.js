var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var UserSchema   = new Schema({
	fullname: String,
    email: String,
    password: String,
    easyRtcId: {type: String, default: ''},
    token: String,
    type: {type: String, default: 'student'}
});
 
module.exports = mongoose.model('User', UserSchema);