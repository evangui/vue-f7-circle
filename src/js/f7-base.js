/**
 * 注册vue的framework7基础全局变量与全局方法
 * 
 * @param {Object} Vue
 * @param {Object} Framework7
 * @param {Object} options
 */
exports.install = function(Vue, Framework7, options) {
	Vue.prototype.$f7 = {};
	Vue.prototype.$$ = {};
	
	/**
	 * 实例化f7对象，模仿f7做一些基本的初始化动作
	 */
	Vue.prototype.setF7 = function() {
		var self = this;
		var app = new Framework7({
			theme: 'ios', // Automatic theme detection
			lazy: {
				threshold: 0,
				sequential: false,
				//laceholder: 'http://m.cattlepie.com/img/login/login_icon.png',
				placeholder: 'static/img/preload.png',
			},
			dialog: {
				// set default title for all dialog shortcuts
				title: '杏运树',
				// change default "OK" button text
				buttonOk: '确定',
				buttonCancel: '取消',
			},
		});
//		app.router.off('touchstart');
		
		this.$f7 = app;
		this.$$ = app.$;
//		console.log(app)
		
		//自动初始化
		if (this.$$('.infinite-scroll-content').length > 0) {
			app.infiniteScroll.create('.infinite-scroll-content');
		}
		if (this.$$('.ptr-content').length > 0) {
			this.$f7.ptr = app.ptr.create('.ptr-content');
		}
		if (this.$$('.link.back').length > 0) {
			this.$$('.link.back').each(function() {
				self.$$(this).on('click', function(e) {
					self.$router.goBack()
//					self.$router.go(-1);
				});
			});
		}
		
		return app;
	};
	
	//创建gotop按钮并初始化滚动事件
	Vue.prototype.$initGotop = function() {
		var self = this;
		if (this.$$('#tbox').length<1) {
			var $li = this.$$('<div id="tbox"><a id="gotop" href="javascript:void(0)"></a></div>');
			$li.appendTo($(document.body)),
			$('#gotop').click(function(){
				self.$scrollTop(0, 300);	
			})
		}
		
		self.$rightb();	
		this.$$('.page-content').scroll(function(e){
			self.$rightb();		
		})
	},
	
	Vue.prototype.$rightb = function() {
		h = 200;
		t = this.$scrollTop();	
//		console.log(t)
		if(t > h){
			//alert("111");
			this.$$('#gotop').show();
		}else{
			this.$$('#gotop').hide();
		}
	},
	
	/**
	 * 基于f7的滚动到顶部
	 * @param {Object} position
	 * @param {Object} duration
	 * @param {Object} callback
	 */
	Vue.prototype.$scrollTop = function(position, duration, callback) {
		return this.$$('.page-content').scrollTop(position, duration, callback);
	},
	
	/**
	 * 基于f7的滚动到固定选择器
	 * @param {Object} selector
	 * @param {Object} speed
	 */
	Vue.prototype.$goAnchor = function(selector, speed) {
		speed = speed || 300;
		let offsetY = this.$$(selector).offset().top + this.$$('.page-content').scrollTop();
		this.$scrollTop(offsetY, speed);
    },
	
	/**
	 * toast方法
	 * 
	 * @param {Object} text
	 * @param {Object} timeout
	 * @param {Object} positon
	 * @param {Object} closeButton
	 * @param {Object} icon
	 */
	Vue.prototype.$toast = function(text, timeout, positon, closeButton, icon=null) {
		timeout = arguments[1] ? arguments[1] : 3000;
		positon = arguments[2] ? arguments[2] : 'bottom';
		closeButton = arguments[3] ? arguments[3] : false;
		closeButtonText = arguments[4] ? arguments[4] : '关闭';

		var params = {
			text: text,
			closeTimeout: timeout,
			position: positon,
			closeButton: closeButton,
			closeButtonText: closeButtonText,
			closeButtonColor: 'yellow',
		};
		if(arguments[4] != null && arguments[4] != undefined) {
			//self.$theme.ios ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
			if (icon) {
				params.icon = '<i class="f7-icons text-color-green" >check</i>';
			} else {
				params.icon = '<i class="f7-icons text-color-yellow" style="font-size:36px;">info</i>';
			}
		}
		
		this.$f7.toast.create(params).open();
	}
	
	Vue.prototype.$toastWithCallback = function() {
		var self = this;
		// Create toast
		if(!self.toastWithCallback) {
			self.toastWithCallback = self.$f7.toast.create({
				text: 'Callback on close',
				closeButton: true,
				on: {
					close: function() {
						self.$f7.dialog.alert('Toast closed');
					},
				}
			});
		}
		// Open it
		self.toastWithCallback.open();
	}

	//打开单张图片浏览器
	Vue.prototype.$openOnePhoto = function(url) {
		var pb = this.$f7.photoBrowser.create({
			photos: [url],
			theme: 'dark',
			type: 'popup', //popup, page, standalone

			navbarOfText: '/',
			backLinkText: '',
			toolbar: false,
			routableModals: false,
		});
		pb.on('click', function() {
			this.close();
		});
		
		pb.open();
		return pb;
	};

	//创建相册浏览器，不直接打开
	Vue.prototype.$createPhotoBrowser = function(_photos) {
		var pb = this.$f7.photoBrowser.create({
			photos: _photos,
			theme: 'dark',
			type: 'popup', //popup, page, standalone

			navbarOfText: '/',
			backLinkText: '关闭',
			routableModals: false,
		});
		pb.on('click', function() {
			this.close();
		});

		return pb;
	};

	//遮罩层开关
	Vue.prototype.$toggleBackdrop = function() {
		if('none' == this.$$('.backdrop-in').css('display')) {
			this.$$('.backdrop-in').show(500);
		} else {
			this.$$('.backdrop-in').hide(500);
		}
	};
};