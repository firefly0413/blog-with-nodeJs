var express = require("express");
var router = express.Router();
var Category = require("../models/Category");
var Artical = require("../models/articals");
var User = require("../models/user");
var Comment = require("../models/comment");

var responseData={};
router.use(function(req,res,next){
	responseData.code = "0";
	responseData.message = "";
	next();
});

router.get("/",function(req,res){

	var limit = 5;
	var page = Number(req.query.page||1);
	var total_page = 0;

	//分类筛选
	var catId = req.query.id || "";
	var condition = {};
	if(catId){
		condition.rel_cat = catId
	}

	Category.find().then(function(cats){

		Artical.where(condition).count().then(function(count){
			total_page = Math.ceil(count/limit);
			//限制page大小
			page = Math.min(page,total_page);
			page = Math.max(page,1);

			var skip = (page-1)*limit;

			//从数据库中读取文章列表
			Artical.where(condition).find().limit(limit).skip(skip).populate("user").sort({"addTime":-1}).then(function(articals){
				res.render("main/index",{
					"userInfo":req.userInfo,
					"categories":cats,
					"rel_cat":catId,
					"articals":articals,
					"page":page,
					"total_page":total_page,
					"limit":limit,
					"count":count
				});
			});
		});
	});
});

//文章阅读数

router.post("/artical/read",function(req,res){
	var id = req.body.id;

	Artical.findOne({_id:id}).then(function(art){
		if(!art){
			responseData.code = "1";
			responseData.message = "数据库中未找到该文章！";
			res.json(responseData);
			return Promise.reject();
		}else{
			var num = Number(art.views)+1;
			return Artical.update({
				_id:id
			},{
				views:num
			})
		}
	}).then(function(newArt){
		//显示评论
		Comment.where({art_id:id}).find().populate("user").then(function(comments){
			responseData.data = comments;
			responseData.message = "阅读数加1！";
			res.json(responseData);
		})

	});

});

//写评论
router.post("/comment/add",function(req,res){
	var artId = req.body.art_id;
	var value = req.body.value;

	if(!req.userInfo){
		responseData.code="1";
		responseData.message = "只有先登陆才可以评论！";
		res.json(responseData);
	}else{
		var userId = req.userInfo.id;
		User.findOne({
			_id:userId
		}).then(function(user){
			if(!user){
				responseData.code="2";
				responseData.message = "您还没有登录，请先登录！";
				res.json(responseData);
				return Promise.reject();
			}else{
				var comment = new Comment({
					art_id:artId,
					user:userId,
					value:value
				});
				return comment.save();
			}
		}).then(function(newComment){
			Comment.where({art_id:artId}).find().populate("user").then(function(comments){
				responseData.data = comments;
				responseData.message = "添加评论成功！";
				res.json(responseData);
			})
		})
	}
});

//点赞操作
router.post("/comment/approve",function(req,res){
	var id = req.body.id;
	var type = req.body.type;

	Comment.findOne({_id:id}).then(function(comment){
		if(type == "add") {
			count = Number(comment.approve) + 1;
		}else if(type=="plus"){
			count = Number(comment.approve)-1;
		}
		return count;
	}).then(function(count){
		return Comment.update({_id:id},{approve:count});
	}).then(function(newComment){
		responseData.message = "操作成功";
		res.json(responseData);
	})
});

module.exports = router;