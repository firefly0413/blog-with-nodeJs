var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Category = require("../models/Category");
var Artical = require("../models/articals")

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

		//从数据库中读取分类列表
		Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
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

// 文章管理
router.get("/artical",function(req,res){

	var limit = 10;
	var page = Number(req.query.page||1);
	var total_page = 0;

	Artical.count().then(function(count){
		total_page = Math.ceil(count/limit);
		//限制page大小
		page = Math.min(page,total_page);
		page = Math.max(page,1);

		var skip = (page-1)*limit;

		//从数据库中读取文章列表
		Artical.find().sort({_id:-1}).limit(limit).skip(skip).populate(["rel_cat","user"]).then(function(articals){
			res.render("admin/content_manage",{
				userInfo:req.userInfo,
				articals:articals,
				page:page,
				total_page:total_page,
				limit:limit,
				count:count,
				url:"/admin/artical"
			})
		})
	})
});

//添加文章
router.get("/artical/add",function(req,res){

	Category.find().sort({_id:-1}).then(function(cats){
		res.render("admin/content_add",{
			userInfo:req.userInfo,
			categories:cats
		})
	});
});

router.post("/artical/add",function(req,res){

	var rel_cat = req.body.category;
	var title = req.body.title;
	var desc = req.body.description;
	var content = req.body.content;

	if(!rel_cat){
		responseData.code = "1";
		responseData.message = "失败，所属分类不能为空!";
		res.json(responseData);
		return;
	}

	if(!content){
		responseData.code = "3";
		responseData.message = "失败，内容不能为空!";
		res.json(responseData);
		return;
	}

	if(!title){
		responseData.code = "2";
		responseData.message = "失败，标题不能为空!";
		res.json(responseData);
		return;
	}else{
		Artical.findOne({
			title:title
		}).then(function(artical){
			if(artical){
				responseData.code = "4";
				responseData.message = "失败，标题名重复!";
				res.json(responseData);
				return Promise.reject();
			}else{
				var art = new Artical({
					rel_cat:rel_cat,
					title:title,
					desc:desc,
					user:req.userInfo.id.toString(),
					content:content
				});

				return art.save();
			}
		}).then(function(newArtical){
			responseData.message = "添加成功!";
			res.json(responseData);
		})
	}

});

//文章编辑
router.get("/artical/edit",function(req,res){
	var id = req.query.id;
	Artical.findOne({
		_id:id
	}).populate("rel_cat").then(function(artical){
		Category.find().sort({_id:-1}).then(function(cats){
			res.render("admin/content_edit",{
				userInfo:req.userInfo,
				artical:artical,
				cats:cats
			})
		});
	});
});

router.post("/artical/edit",function(req,res){
	var id = req.body.id;
	var rel_cat = req.body.category;
	var title = req.body.title;
	var desc = req.body.description;
	var content = req.body.content;
	if(!rel_cat){
		responseData.code = "1";
		responseData.message = "失败，所属分类不能为空!";
		res.json(responseData);
		return;
	}

	if(!content){
		responseData.code = "2";
		responseData.message = "失败，内容不能为空!";
		res.json(responseData);
		return;
	}

	if(!title){
		responseData.code = "3";
		responseData.message = "失败，标题不能为空!";
		res.json(responseData);
		return;
	}

	Artical.findOne({
		_id:{$ne:id},
		title:title
	}).then(function(artical){
		if(artical){
			responseData.code = "5";
			responseData.message = "失败，数据库中已存在同名文章!";
			res.json(responseData);
			return Promise.reject();
		}else{
			return Artical.update({
				_id:id
			},{
				rel_cat:rel_cat,
				title:title,
				desc:desc,
				content:content
			});
		}
	}).then(function(updatedArt){
		responseData.message = "编辑成功!";
		res.json(responseData);
	});

});

//删除文章
router.post("/artical/delete",function(req,res){
	var id = req.body.id;

	Artical.remove({
		_id:id
	}).then(function(){
		responseData.message = "删除成功!";
		res.json(responseData);
	})
});


module.exports = router;