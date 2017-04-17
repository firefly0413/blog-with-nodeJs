$(function(){
	var oForm = $("#i_regForm");
	var regBtn = $("#i_regist");
	var oRegBox = $(".registBox");
	var oLogBox = $(".loginBox");
	var logBtn = $("#i_login");
	var oUserPanel = $("#i_userPanel");

	//登录注册切换
	$(".j_toReg").off("click",{}).on("click",function(){
		oRegBox.show();
		oLogBox.hide();
	});

	$(".j_toLogin").off("click",{}).on("click",function(){
		oRegBox.hide();
		oLogBox.show();
	});


	regBtn.on("click",function(){
		$.ajax({
			type:"post",
			url:"/api/user/register",
			data:{
				username:oForm.find("[name='username']").val(),
				password:oForm.find("[name='password']").val(),
				confirmword:oForm.find("[name='confirmword']").val()
			},
			dataType:"json",
			success:function(res){
				oRegBox.find(".j_promptInfo").html(res.message);
				if(res.code == "0"){
					setTimeout(function(){
						oRegBox.hide();
						oLogBox.show();
					},1000)
				}
			}
		})
	})

	logBtn.on("click",function(){
		$.ajax({
			type:"post",
			url:"/api/user/login",
			data:{
				username:oLogBox.find("[name='username']").val(),
				password:oLogBox.find("[name='password']").val()
			},
			dataType:"json",
			success:function(res){
				oLogBox.find(".j_promptInfo").html(res.message);
				if(res.code == "0"){
					window.location.reload();
				}
			}
		})
	});

	$("#i_logOut").on("click",function(){
		$.ajax({
			type:"post",
			url:"api/user/logOut",
			data:{},
			dataType:"json",
			success:function(res){
				if(res.code == "0"){
					window.location.reload();
				}
			}
		})
	})

	//文章展示模块
	$(".j_showCont").on("click",function(){
		$(this).hide();
		$(this).next(".art_cont").fadeIn();
		$(this).siblings(".j_hideCont").fadeIn();

		var id = $(this).closest(".articalBlock").data("id");

		$.ajax({
			url:"/artical/read",
			type:"post",
			data:{id:id},
			dataType:"json",
			success:function(res){
				console.log(res);
			}
		})
	})

	$(".j_hideCont").on("click",function(){
		$(this).hide();
		$(this).prev(".art_cont").fadeOut();
		$(this).siblings(".j_showCont").fadeIn();
	})

});