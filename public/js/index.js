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
					setTimeout(function(){
						oLogBox.hide();
						$(".j_userName").html(res.userInfo.username);
						oUserPanel.show();
					},1000)
				}
			}
		})
	})

});