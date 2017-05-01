$(function(){

	addEvent();//绑定点赞事件
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
						//清空书写框
						_this.closest(".writeBox").css("display","none");
						_this.prev("textarea").val("");

						if(res.data && res.data.length>0){
							_this.closest(".writeBox").next(".comments_box").html("");
							var arr = res.data.reverse();

							//刷新评论
							for(var i=0;i<arr.length;i++){
								var html = getHtml(arr[i]);
								_this.closest(".writeBox").next(".comments_box").append(html);
								addEvent();
							}
						}
					});
				}else{
					showToast(res.message);
				}
			}
		})
	});

	//获取评论模板
	function getHtml(item){
		//处理时间格式
		var addTime = getTime(item.addTime);
		var html = '<div class="comment_item" data-id="'+ item._id.toString() +'">\
					<div class="comment_left">\
						<div class="user_face">\
							<img src='+item.user.userFace+' />\
						</div>\
					</div>\
					<div class="comment_cont">\
						<p>'+item.user.username+'</p>\
						<p>'+item.value+'</p>\
						<p>'+addTime+'</p>\
					</div>\
					<div class="com_approve j_doApprove">\
						<b class="glyphicon glyphicon-thumbs-up"></b>\
						<span>'+item.approve+'</span>\
					</div>\
				</div>';

		return html;
	}

	//绑定点赞功能
	function addEvent(){
		$(".j_doApprove").off().on("click",function(){
			var id = $(this).closest(".comment_item").data("id");
			var bool = $(this).hasClass("active");
			var num = $(this).find("span").text();
			if(!bool){
				$(this).addClass("active");
				num++;
			}else{
				$(this).removeClass("active");
				num--;
			}
			$(this).find("span").text(num);
			//发起点赞请求
			doApprove(id,bool);
		});
	}

	//发起点赞请求
	function doApprove(id,bool){
		var type = bool?"plus":"add";
		$.ajax({
			url:"/comment/approve",
			type:"post",
			data:{
				id:id,
				type:type
			},
			dataType:"json",
			success:function(res){
				console.log(res);
			}
		})
	}
})

function getTime(str){
	var date = new Date(str);
	var y = date.getFullYear(),m = date.getMonth()+1,d = date.getDate(),h = date.getHours(),M = date.getMinutes();
	var time = y+"-"+ (m<10?"0"+m:m) +"-"+ (d<10?"0"+d:d) +" "+ (h<10?"0"+h:h) +":"+ (M<10?"0"+M:M);
	return time;
}