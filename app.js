
// 应用程序入口文件

// 加载express模块
var express = require("express");
//加载模板处理模块
var swig = require("swig");
//加载数据库模块
var mongoose = require("mongoose");
// 加载body-parser,用来处理post提交的数据
var bodyParser = require("body-parser");

// 创建app应用
var app = express();

//设置静态文件托管  当用户访问的url以/public开始，返回 __dirname + '/public'下的文件
app.use("/public",express.static( __dirname + '/public'));

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

// 首页
// req request 对象
// res response对象
//app.get("/",function(req,res,next){
	//res.send("<h1>欢迎来到我的博客!</h1>")
	//读取views下的指定文件，解析并返回给客户端
	//第一个参数：表示模板的文件,相对于views目录
	//第二个参数：传递给模板使用的数据
	//res.render("index");

//});

//body-parser设置
app.use(bodyParser.urlencoded({extended:true}));

//根据不同功能划分模块
app.use("/admin",require("./routers/admin"));
app.use("/api",require("./routers/api"));
app.use("/",require("./routers/main"));



//监听app请求
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