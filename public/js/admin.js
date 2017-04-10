$(function(){
	var oBtn = $("#subBtn");
	//新增分类
	oBtn.on("click",function(e){
		e.preventDefault();
		var name = $("#catName").val();

		$.ajax({
			type:"post",
			url:"/admin/category/add",
			data:{
				cat_name:name
			},
			dataType:"json",
			success:function(res){
				console.log(res);
				if(res.code == "0"){
					showToast("操作成功");
				}else{
					showToast(res.message);
				}
			}
		})
	});

	//修改分类
	var catEdit = $(".j_cat_edit");
	var catRemove = $(".j_cat_remove");
	var oConfirm = $("#i_confirm");
	catEdit.on("click",function(){
		var id = $(this).closest("tr").data("id");
		var name = $(this).closest("tr").data("name");
		$("#cat_nameIpt").val(name);
		$("#i_editModal").data("id",id).modal("show");
	});

	oConfirm.on("click",function(){
		var id = $(this).closest(".modal").data("id");
		var name = $("#cat_nameIpt").val();

		$.ajax({
			url:"/admin/category/edit",
			type:"post",
			data:{
				id:id,
				name:name
			},
			dataType:"json",
			success:function(res){
				console.log(res);
				if(res.code == "0"){
					showToast("操作成功",function(){
						window.location.reload();
					});
				}else{
					showToast(res.message);
				}
			}
		})
	});

	//删除分类
	catRemove.on("click",function(){
		var id = $(this).closest("tr").data("id");
		$("#i_removeModal").data("id",id).modal("show");
	});

	$("#i_confirmRomove").on("click",function(){
		var id = $(this).closest(".modal").data("id");
		$.ajax({
			url:"/admin/category/delete",
			type:"post",
			data:{
				id:id
			},
			dataType:"json",
			success:function(res){
				if(res.code == "0"){
					showToast("操作成功",function(){
						window.location.reload();
					});
				}else{
					showToast(res.message);
				}
			}
		})

	});

	function showToast(msg,callback){
		$("#i_toast_mask").css("display", "block");
		$("#i_toast_content").css("display", "block");
		$("#i_toast_content").text(msg);
		setTimeout(function() {
			$("#i_toast_mask").css("display", "none");
			$("#i_toast_content").css("display", "none");
			if (callback && Object.prototype.toString.call(callback) === '[object Function]')
				callback.apply();
		}, 1500);
	}
});