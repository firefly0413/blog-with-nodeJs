var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Category = require("../models/Category");

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
				count:count,
				url:"/admin/users"
			})
		})
	})

});

//分类管理
router.get("/category",function(req,res){

	var limit = 10;
	var page = Number(req.query.page||1);
	var total_page = 0;

	Category.count().then(function(count){
		total_page = Math.ceil(count/limit);
		//限制page大小
		page = Math.min(page,total_page);
		page = Math.max(page,1);

		var skip = (page-1)*limit;

		//从数据库中读取用户列表
		Category.find().limit(limit).skip(skip).then(function(categories){
			res.render("admin/category_manage",{
				userInfo:req.userInfo,
				categories:categories,
				page:page,
				total_page:total_page,
				limit:limit,
				count:count,
				url:"/admin/category"
			})
		})
	})
});

//新增分类
router.get("/category/add",function(req,res){
	res.render("admin/category_add",{
		userInfo:req.userInfo
	})
});

router.post("/category/add",function(req,res,next){
	var catName = req.body.cat_name;
	//分类名称不能为空
	if(!catName){
		responseData.code = "1";
		responseData.message = "分类名不能为空";
		res.json(responseData);
		return;
	}

	//分类不能重名
	Category.findOne({
		name:catName
	}).then(function(cat){
		if(cat){
			responseData.code = "2";
			responseData.message = "失败，分类名已存在!";
			res.json(responseData);
			return;
		}
		var category = new Category({
			name:catName
		});
		return category.save();
	}).then(function(newCatgory){
		responseData.message = "添加分类成功!";
		res.json(responseData);
	})

});

//修改分类
router.post("/category/edit",function(req,res,next){
	var id = req.body.id;
	var name = req.body.name;

	Category.findOne({
		_id:id
	}).then(function(category){
		//id没找到
		if(!category){
			responseData.code = "3";
			responseData.message = "失败，分类不存在!";
			res.json(responseData);
			return Promise.reject();
		}else{
			//修改后不能重名
			return Category.findOne({
				_id:{$ne:id},
				name:name
			})
		}
	}).then(function(newCat){
		if(newCat){
			responseData.code = "4";
			responseData.message = "失败，数据库中已经存在同名分类!";
			res.json(responseData);
			return Promise.reject();
		}else{
			return Category.update({
				_id:id
			},{
				name:name
			});
		}
	}).then(function(){
		responseData.message = "修改成功!";
		res.json(responseData);
	})
});

//删除分类
router.post("/category/delete",function(req,res,next){
	var id = req.body.id;

	Category.remove({
		_id:id
	}).then(function(cat){
		responseData.message = "删除成功!";
		res.json(responseData);
	})
});

module.exports = router;