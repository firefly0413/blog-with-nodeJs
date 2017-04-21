var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
	username:String,
	password:String,
	userFace:{
		type:String,
		default:"../../public/images/15.jpg"
	},
	isAdmin:{
		type:Boolean,
		default:false
	}
});