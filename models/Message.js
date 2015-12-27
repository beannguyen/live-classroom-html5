var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var MessageSchema   = new Schema({
	from: String, // author id
	to: String, // target
	content: String // message content
});
 
module.exports = mongoose.model('Message', MessageSchema);