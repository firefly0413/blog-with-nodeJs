var Utility = {
	showToast: function(msg, callback) {
		$("#i_toast_mask").css("display", "block");
		$("#i_toast_content").css("display", "block");
		$("#i_toast_content").text(msg);
		setTimeout(function() {
			$("#i_toast_mask").css("display", "none");
			$("#i_toast_content").css("display", "none");
			if (callback && Object.prototype.toString.call(callback) === '[object Function]')
				callback.apply();
		}, 1500);
	},
	getQueryParameter: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURIComponent(r[2]);
		return "";
	}
};

module.exports = Utility;