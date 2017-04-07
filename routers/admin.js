var express = require("express");
var router = express.Router();
var User = require("../models/user");

//统一返回格式
var responseData;
router.use(function(req,res,next){
	responseData={
		code:0,
		message:""
	};
	next();
});

router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		res.send("对不起，只有管理员才有权限进入管理页面！");
		return;
	}
	next();
});

//首页

router.get("/",function(req,res,next){
	res.render("admin/index",{
		userInfo:req.userInfo
	});
});

//用户管理页

router.get("/users",function(req,res,next){

	var limit = 10;
	var page = Number(req.query.page||1);
	var total_page = 0;

	User.count().then(function(count){
		total_page = Math.ceil(count/limit);
		//限制page大小
		page = Math.min(page,total_page);
		page = Math.max(page,1);

		var skip = (page-1)*limit;

		//从数据库中读取用户列表
		User.find().limit(limit).skip(skip).then(function(users){
			res.render("admin/user_manage",{
				userInfo:req.userInfo,
				users:users,
				page:page,
				total_page:total_page,
				limit:limit,
				count:count
			})
		})
	})

})

module.exports = router;