var express = require("express");
var router = express.Router();
var Category = require("../models/Category");
var Artical = require("../models/articals");

router.get("/",function(req,res){

	var limit = 2;
	var page = Number(req.query.page||1);
	var total_page = 0;

	Category.find().then(function(cats){

		Artical.count().then(function(count){
			total_page = Math.ceil(count/limit);
			//限制page大小
			page = Math.min(page,total_page);
			page = Math.max(page,1);

			var skip = (page-1)*limit;

			//从数据库中读取文章列表
			Artical.find().limit(limit).skip(skip).populate("user").then(function(articals){
				res.render("main/index",{
					"userInfo":req.userInfo,
					"categories":cats,
					"articals":articals,
					"page":page,
					"total_page":total_page,
					"limit":limit,
					"count":count,
					"url":"/admin/users"
				});
			});
		});
	});
});

module.exports = router;