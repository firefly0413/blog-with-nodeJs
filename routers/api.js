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

// 用户注册
/*
	注册逻辑
	1、用户名不能为空
	2、密码不能为空
	3、两次输入密码必须一致
	4、用户名是否已被注册（数据库查询）
 */
router.post("/user/register",function(req,res,next){

	var username = req.body.username;
	var password = req.body.password;
	var confirmword = req.body.confirmword;

	//用户名不能为空
	if(!username){
		responseData.code=1;
		responseData.message = "用户名不能为空";
		res.json(responseData);
		return;
	}

	//密码不能为空
	if(!password){
		responseData.code=2;
		responseData.message = "密码不能为空";
		res.json(responseData);
		return;
	}

	//两次输入密码必须一致
	if(password!=confirmword){
		responseData.code=3;
		responseData.message = "两次输入密码必须一致";
		res.json(responseData);
		return;
	}

	//用户名是否已被注册
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(userInfo){
			//表示数据库中有该记录
			responseData.code = 4;
			responseData.message = "用户名已经被注册";
			res.json(responseData);
			return;
		}
		//没有该记录则保存至数据库中
		var user = new User({
			username:username,
			password:password
		});
		return user.save();
	}).then(function(newUserInfo){
		responseData.message = "注册成功";
		res.json(responseData);
	});

});

module.exports = router;