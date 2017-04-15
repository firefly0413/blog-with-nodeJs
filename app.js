
// 应用程序入口文件

// 加载express模块
var express = require("express");
//加载模板处理模块
var swig = require("swig");
//加载数据库模块
var mongoose = require("mongoose");
// 加载body-parser,用来处理post提交的数据
var bodyParser = require("body-parser");
//加载cookies模块
var Cookies = require("cookies");

var User = require("./models/user");

// 创建app应用
var app = express();

//设置静态文件托管  当用户访问的url以/public开始，返回 __dirname + '/public'下的文件
app.use("/public",express.static( __dirname + '/public'));
//设置cookies
app.use(function(req,res,next){
	req.cookies = new Cookies(req,res);

	//解析用户的cookie信息
	req.userInfo = {};
	if(req.cookies.get("userInfo")){
		try{
			req.userInfo = JSON.parse(req.cookies.get("userInfo"));
			//获取当前登录用户类型
			User.findById(req.userInfo.id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			});
		}catch(e){
			next();
		}
	}else{
		next();
	}
});

//配置应用模板
//定义当前应用所使用的的模板引擎
//第一个参数：模板引擎名称，同时也是模板文件后缀；第二个参数表示用于解析处理模板内容的方法
app.engine("html",swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set("views","./views");
//注册所使用的模板引擎,第一个参数是固定的
app.set("view engine","html");
//开发模式中，需要取消模板缓存
swig.setDefaults({cache:false});


//body-parser设置
app.use(bodyParser.urlencoded({extended:true}));

//根据不同功能划分模块
app.use("/admin",require("./routers/admin"));
app.use("/api",require("./routers/api"));
app.use("/",require("./routers/main"));



//监听app请求
//线上
// mongoose.connect("mongodb://luckyzf:erik0413@ds161190.mlab.com:61190/luckyzf",function(err){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("数据库连接成功");
// 		app.listen(80);
// 	}
// });

//本地
mongoose.connect("mongodb://localhost:27017/blog",function(err){
	if(err){
		console.log(err);
	}else{
		console.log("数据库连接成功");
		app.listen(8081);
	}
});

//过程分析
//用户发送http请求 -> url -> 解析路由 -> 找到匹配规则 -> 执行指定的绑定函数，返回对应内容给用户
// if /public -> 静态 -> 直接读取指定目录下文件，返回给用户
// else -> 动态 -> 处理业务逻辑，加载模板，解析模板 -> 返回数据给用户