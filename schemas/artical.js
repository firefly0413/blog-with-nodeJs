var mongoose = require("mongoose");

var artical = new mongoose.Schema({
	//关联字段-文章分类Id
	rel_cat:{
		//类型
		type:mongoose.Schema.Types.ObjectId,
		//引用一个表
		ref:'Category'
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	},
	addTime:{
		type:Date,
		default:new Date
	},
	views:{
		type:Number,
		default:0
	},
	title:String,
	desc:String,
	content:String
});

module.exports = artical;