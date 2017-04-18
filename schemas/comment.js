var mongoose = require("mongoose");

var comment = new mongoose.Schema({
	//关联字段-文章分类Id
	art_id:{
		//类型
		type:mongoose.Schema.Types.ObjectId,
		//引用一个表
		ref:'Artical'
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	addTime:{
		type:Date,
		default:new Date
	},
	value:String,
	authorReply:String,
	approve:{
		type:Number,
		default:0
	}
});

module.exports = comment;