$(function(){
	var oForm = $("#i_regForm");
	var regBtn = $("#i_regist");
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
				console.log(res);
			}
		})
	})
});