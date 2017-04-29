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
					showToast("操作成功",function(){
						window.location = "/admin/category";
					});
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

	//保存文章
	var saveBtn = $("#i_saveArtical");
	var myForm = $("#i_myForm");

	//添加段落
	function addPg(name){
		this.addBtn = $(name).find(".j_plus");
		this.removeBtn = $(name).find(".j_minus");
		this.addCode = $(name).find(".j_code");
		this.addTitle = $(name).find(".j_title");
		this.addImg = $(name).find(".j_img");

		this.addBtn.off().on("click",this.fnAdd);
		this.removeBtn.off().on("click",this.fnRemove);
		this.addCode.off().on("click",this.fnAddCode);
		this.addTitle.off().on("click",this.fnAddTile);
		this.addImg.off().on("click",this.fnAddImg);
	}

	//添加段落
	addPg.prototype.fnAdd = function(){
		var parent = $(this).closest(".form-group");
		var newPg = parent.clone();
		newPg.attr("class","form-group clearfix j_paragraph");
		newPg.find("label").text("段落：");
		newPg.find(".col-sm-6").html("<textarea type='text' class='form-control' rows='5' ></textarea>");
		newPg.insertAfter(parent);
		new addPg(".j_paragraph");
	};

	//删除段落
	addPg.prototype.fnRemove = function(){
		$(this).closest(".form-group").remove();
	};

	//添加代码
	addPg.prototype.fnAddCode = function(){
		var parent = $(this).closest(".form-group");
		var newPg = parent.clone();
		newPg.attr("class","form-group clearfix j_paragraph j_code");
		newPg.find("label").text("代码：");
		newPg.find(".col-sm-6").html("<textarea type='text' class='form-control' rows='5' ></textarea>");
		newPg.insertAfter(parent);
		new addPg(".j_paragraph");
	};

	//添加小标题
	addPg.prototype.fnAddTile = function(){
		var parent = $(this).closest(".form-group");
		var newPg = parent.clone();
		newPg.attr("class","form-group clearfix j_paragraph j_vtitle");
		newPg.find("label").text("小标题：");
		newPg.find(".col-sm-6").html("<input type='text' class='form-control' />");
		newPg.insertAfter(parent);
		new addPg(".j_paragraph");
	};

	//添加图片
	addPg.prototype.fnAddImg = function(){
		var parent = $(this).closest(".form-group");
		var newPg = parent.clone();
		newPg.attr("class","form-group clearfix j_paragraph j_vimg");
		newPg.find("label").text("图片：");
		newPg.find(".col-sm-6").html("<input type='text' class='form-control' />");
		newPg.insertAfter(parent);
		new addPg(".j_paragraph");
	};

	new addPg(".j_paragraph");


	//保存
	saveBtn.on("click",function(){
		var str = decodeURI(myForm.serialize().toString());
		var param = getJson(str);
		var id = getQueryParameter("id");
		var url = "/admin/artical/add";
		if(!!id){
			param.id = id;
			url = "/admin/artical/edit";
		}

		//文章段落
		var arr=[];
		$(".j_content").find(".j_paragraph").each(function(index,item){
			var value = $(item).find("[type='text']").val();
			var obj={};
			if($(item).hasClass("j_code")){
				obj.type = "code";
			}else if($(item).hasClass("j_vtitle")){
				obj.type = "title";
			}else if($(item).hasClass("j_vimg")){
				obj.type = "img";
			}else{
				obj.type = "text";
			}
			obj.value = value;
			arr.push(obj);
		});
		param.content = arr;
		console.log(param);
		$.ajax({
			url:url,
			type:"post",
			data:param,
			dataType:"json",
			success:function(res){
				console.log(res);
				if(res.code == "0"){
					showToast("操作成功",function(){
						window.location = "/admin/artical";
					});
				}else{
					showToast(res.message);
				}
			}
		})
	});

	//编辑文章
	$(".j_art_edit").on("click",function(){
		var id = $(this).closest("tr").data("id");
		window.location = "/admin/artical/edit?id="+id;
	});

	//删除文章
	var artRemove = $(".j_art_remove");
	artRemove.on("click",function(){
		var id = $(this).closest("tr").data("id");
		$("#i_removeArtModal").data("id",id).modal("show");
	});

	$("#i_romoveArt").on("click",function(){
		var id = $(this).closest(".modal").data("id");
		$.ajax({
			url:"/admin/artical/delete",
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
	})

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

function getJson(str){
	var arr = str.split("&");
	var json = {};
	for(var i=0;i<arr.length;i++){
		var tempArr = arr[i].split("=");
		json[tempArr[0]] = tempArr[1];
	}
	return json;
}

function getQueryParameter(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return decodeURIComponent(r[2]);
	return "";
}