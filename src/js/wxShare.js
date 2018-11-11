//微信分享事件监听，常用功能封装
(function() {
	var wxShare = function(opts) {
		var defaults = {
			title: '杏运树趣玩-一个好玩、好吃、好实惠的平台', //分享标题,不能为空
			desc: '让美食与运动成为一种健康习惯，让吃货用更佳的方式享悦生活！', //分享描述，可以为空，（分享到朋友圈，不支持描述）
			link: '', //分享页面地址,不能为空
			imgUrl: '', //分享是封面图片，不能为空
			success: function() {}, //分享成功触发
			cancel: function() {} //分享取消触发，需要时可以调用
		}
		this.opts = $.extend({}, defaults, opts);
	}
	wxShare.prototype = {
		//绑定微信朋友圈，发送朋友
		bindWX: function() {
			var _opts = this.opts;
			//监听，分享到朋友圈
			wx.onMenuShareTimeline({
				title: _opts.title,
				link: _opts.link,
				imgUrl: _opts.imgUrl,
				success: function() {
					if(_opts.success)
						_opts.success();
				},
				calcel: function() {
					if(_opts.cancel)
						_opts.cancel();
				}
			});
			//监听，分享给朋友 （type，dataurl基本可以放弃不使用）
			wx.onMenuShareAppMessage({
				title: _opts.title, // 分享标题
				desc: _opts.desc, // 分享描述
				link: _opts.link, // 分享链接
				imgUrl: _opts.imgUrl, // 分享图标
				success: function() {
					if(_opts.success)
						_opts.success();
				},
				cancel: function() {
					if(_opts.cancel)
						_opts.cancel();
				}
			});
		},
		//绑定QQ空间，QQ好友
		bindQQ: function() {
			var _opts = this.opts;
			//监听，分享到QQ空间
			wx.onMenuShareQZone({
				title: _opts.title, // 分享标题
				desc: _opts.desc, // 分享描述
				link: _opts.link, // 分享链接
				imgUrl: _opts.imgUrl, // 分享图标
				success: function() {
					if(_opts.success)
						_opts.success();
				},
				cancel: function() {
					if(_opts.cancel)
						_opts.cancel();
				}
			});
			//监听，分享到QQ
			wx.onMenuShareQQ({
				title: _opts.title, // 分享标题
				desc: _opts.desc, // 分享描述
				link: _opts.link, // 分享链接
				imgUrl: _opts.imgUrl, // 分享图标
				success: function() {
					if(_opts.success)
						_opts.success();
				},
				cancel: function() {
					if(_opts.cancel)
						_opts.cancel();
				}
			});
		},
		//绑定默认，不使用腾讯微博
		bind: function() {
			this.bindWX();
			this.bindQQ();
		},
		//绑定所有,包括腾讯微博
		bindAll: function() {
			this.bind();
			var _opts = this.opts;
			//监听，分享到腾讯微博 (基本可以放弃不使用)
			wx.onMenuShareWeibo({
				title: _opts.title, // 分享标题
				desc: _opts.desc, // 分享描述
				link: _opts.link, // 分享链接
				imgUrl: _opts.imgUrl, // 分享图标
				success: function() {
					if(_opts.success)
						_opts.success();
				},
				cancel: function() {
					if(_opts.cancel)
						_opts.cancel();
				}
			});
		}
	}
	window.wxShare = wxShare;
})();