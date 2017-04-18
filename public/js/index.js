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
	});

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
	});

	//文章展示模块
	$(".j_showCont").on("click",function(){
		var _this = $(this);
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
				if(res.data && res.data.length>0){
					var arr = res.data.reverse();
					for(var i=0;i<arr.length;i++){
						var html = '<div class="comment_item">\
					<div class="comment_left">\
							<div class="user_face">\
							<img src="../../public/images/face.jpg" />\
							</div>\
							</div>\
							<div class="comment_cont">\
							<p>'+arr[i].user.username+'</p>\
							<p>'+arr[i].value+'</p>\
						<p>'+arr[i].addTime+'</p>\
						</div>\
						<div class="com_approve">\
							<b class="glyphicon glyphicon-thumbs-up"></b>\
							<span>'+arr[i].approve+'</span>\
							</div>\
							</div>';
						$(".j_doApprove").off().on("click",function(){
							var id = $(this).closest(".comment_item").data("id");
							console.log(id);
						})

						_this.next(".art_cont").find(".comments_box").append(html);
					}
				}
			}
		})
	});

	$(".j_hideCont").on("click",function(){
		$(this).hide();
		$(this).prev(".art_cont").fadeOut();
		$(this).siblings(".j_showCont").fadeIn();
	});

	//写评论
	var subBtn = $(".j_subComment");
	$(".j_writeSth").on("click",function(){
		$(this).parent().next(".writeBox").css("display","block");
	});

	subBtn.on("click",function(){
		var _this = $(this);
		var value = $(this).closest(".writeBox").find("textArea").val();
		var art_id = $(this).closest(".articalBlock").data("id");

		$.ajax({
			url:"comment/add",
			type:"post",
			data:{
				art_id:art_id,
				value:value
			},
			dataType:"json",
			success:function(res){
				if(res.code == "0"){
					showToast("评论成功",function(){
						_this.closest(".writeBox").css("display","none");
						_this.prev("textarea").val("");
						if(res.data && res.data.length>0){
							_this.closest(".writeBox").next(".comments_box").html("");
							var arr = res.data.reverse();
							for(var i=0;i<arr.length;i++){
								var html = '<div class="comment_item" data-id="'+arr[i]._id.toString()+'">\
					<div class="comment_left">\
							<div class="user_face">\
							<img src="../../public/images/face.jpg" />\
							</div>\
							</div>\
							<div class="comment_cont">\
							<p>'+arr[i].user.username+'</p>\
							<p>'+arr[i].value+'</p>\
						<p>'+arr[i].addTime+'</p>\
						</div>\
						<div class="com_approve j_doApprove">\
							<b class="glyphicon glyphicon-thumbs-up"></b>\
							<span>'+arr[i].approve+'</span>\
							</div>\
							</div>';

								$(".j_doApprove").off().on("click",function(){
									var id = $(this).closest(".comment_item").data("id");
									console.log(id);
								})
								_this.closest(".writeBox").next(".comments_box").append(html);
							}
						}
					});
				}else{
					showToast(res.message);
				}
			}
		})
	});

	//点赞
	function doApprove(className){
		$(className).off().on("click",function(){
			var id = $(this).closest(".comment_item").data("id");
			console.log(id);
		})
	}

});

function showToast(msg,callback){
	$("#i_toast_mask").css("display", "block");
	$("#i_toast_content").css("display", "block").text(msg);
	setTimeout(function() {
		$("#i_toast_mask").css("display", "none");
		$("#i_toast_content").css("display", "none");
		if (callback && Object.prototype.toString.call(callback) === '[object Function]')
			callback.apply();
	}, 1500);
}