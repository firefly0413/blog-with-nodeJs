var express = require("express");
var router = express.Router();
var User = require("../models/user");

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

	//从数据库中读取用户列表
	User.find().then(function(users){
		res.render("admin/user_manage",{
			userInfo:req.userInfo,
			users:users
		})
	})
})

module.exports = router;