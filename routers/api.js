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

//用户登录

router.post("/user/login",function(req,res,next){
	var username = req.body.username;
	var password = req.body.password;
	//用户名和密码不能为空
	if(!username || !password){
		responseData.code=5;
		responseData.message = "用户名或密码不能为空";
		res.json(responseData);
		return;
	}

	//找不到用户名
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(!userInfo){
			//表示数据库中找不到该条数据
			responseData.code=6;
			responseData.message = "用户未注册";
			res.json(responseData);
			return;
		}else{
			if(password!=userInfo.password){
				//表示密码不正确
				responseData.code=7;
				responseData.message = "密码错误";
				res.json(responseData);
				return;
			}
			responseData.message = "登陆成功";
			responseData.userInfo={
				username:userInfo.username,
				id:userInfo.id
			};
			var str = JSON.stringify({
				username:userInfo.username,
				id:userInfo.id
			});
			//解决中文乱码问题，使用base64转码
			req.cookies.set("userInfo",new Buffer(str).toString('base64'));
			res.json(responseData);
		}
	})
});

//退出登录

router.post("/user/logOut",function(req,res,next){
	req.cookies.set("userInfo",null);
	res.json(responseData);
});

module.exports = router;