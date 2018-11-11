/**
 * 注册vue的基础全局变量与全局方法
 * 
 * @param {Object} Vue
 * @param {Object} options
 * @param {Object} wap
 */

exports.install = function(Vue, options, wap) {
	Vue.prototype.$wap = wap;
	Vue.prototype.$siteConfig = options;
	Vue.prototype.$isWx = window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger';
	Vue.prototype.$defaultArticleImg = 'http://pic36.photophoto.cn/20150712/0037037006667073_b.jpg';
	Vue.prototype.$grayLogoUrl = 'http://m.cattlepie.com/img/index/unknow.png';
	Vue.prototype.$getMemberID = function() {
		return this.$wap.getMember().member_id || 0;
	};
	Vue.prototype.$getMember = function() {
		return this.$wap.getMember();
	}
	Vue.prototype.$openShare = function() {
		this.$wap.openShare();
	};

	Vue.prototype.loadScript = function(scriptSrc) {
		const s = document.createElement('script');
	    s.type = 'text/javascript';
	    s.src = scriptSrc;
	    document.body.appendChild(s);
	};
	
	/**
     * 将原始图片缩放成指定比例大小的新图片并返回图片链接
     * @return mixed
     */
    Vue.prototype.$resizeImg = function(imageUrl, width, height = 0) {
//        $imageUrl = 'http://apidev2.cattlepie.com/storage/uploads/20170804/598430fc61713.png';
		if (!imageUrl) {
			return '';
		}

        let pos = imageUrl.indexOf('/storage');
        if (-1 === pos) {
            return imageUrl;
        }
        if (!imageUrl){
            return `http://img0.cattlepie.com/s/${width}x${height}/storage/uploads/default/banner.jpg`;
        }
        
        let imageUrl1;
        let pos2 = imageUrl.indexOf('/s/');
        if (-1 === pos2) {
        	//未被所放过
        	imageUrl1 = this.$siteConfig.imgServer;
        } else {
        	imageUrl1 = imageUrl.substring(0, pos2 + 1);
        }
        let imageUrl2 = imageUrl.substring(pos);
        
        if (height) {
            return imageUrl1 + `s/${width}x${height}${imageUrl2}`;
        } else {
            return imageUrl1 + `s/${width}${imageUrl2}`;
        }
    };

	//获取用户头像地址
	Vue.prototype.$avatar = function(memberId) {
		return this.$siteConfig.apiUrl + 'avatar.php?__=' + memberId;
	};

	/**
	 * 根据广告后端资源id和跳转资源类型，获取wap端的跳转链接地址
	 * @param {String} $resouceId
	 * @param {String} $resourceType
	 */
	Vue.prototype.$getRedirectUrl = function($resouceId, $resourceType) {
		$resourceType = parseInt($resourceType);

		// 资源类型：0链接，1商城商品详情,2商城店铺列表,3帮助文章详情,4 文章详情,5 通用店铺列表 6店铺详情,7合集详情 8圈子详情 9帖子详情 10频道页 11 首页 12 商城首页 
		switch($resourceType) {
			case 0:
				if(!$resouceId) {
					return '#';
				} else {
					return $resouceId;
				}

			case 1:
				//@todo: 验证详情资源id是否有效
				return this.$siteConfig.shopSiteUrl + 'goods.html?id=' + $resouceId;
			case 2:
				return this.$siteConfig.shopSiteUrl + 'store_list.html?cid=' + $resouceId;
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
			default:
				return '#';
		}

	};

	Vue.prototype.$backSpec = function(url) {
		if (history.length == 2) {
			this.$redirect(url);
		} else {
			this.$router.goBack()
		}
	};

	Vue.prototype.$redirect = function(url, bReplace) {
		console.log(url);
		//如果是外部链接，则直接用跳转
		if(url.substr(0, 1) != '/') {
			//非本站域名链接
			if(url.indexOf(this.$siteConfig.siteUrl) == -1) {
				location.href = url;
				return;
			}
			//本站商城链接
			if(url.indexOf(this.$siteConfig.domainSuffix + "/shop/") != -1) {
				location.href = url;
				return;
			}
		}

		//链接中含有#!，为f7最终链接格式，过滤
		if(url.indexOf('#/') != -1) {
			url = url.substring(url.indexOf('#/') + 1);
		}

		console.log(url);
		//		return;

		//是否替换当前页面，不留history返回记录
		bReplace = arguments[1] ? arguments[1] : false;
		if (bReplace) {
			this.$router.replace(url);
		} else {
			this.$router.push(url);
		}
	};

	Vue.prototype.$gotoShop = function(url) {
		url = typeof(url) == 'undefined' ? '' : url;
		window.location.href = this.$siteConfig.shopSiteUrl + url;
	};

	//计算两个经纬度坐标间的距离
	Vue.prototype.$getDistance = function(lat1, lng1, lat2, lng2) {
		var radLat1 = lat1 * Math.PI / 180.0;
		var radLat2 = lat2 * Math.PI / 180.0;
		var a = radLat1 - radLat2;
		var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		//	    s = s * 6378.137;	//单位：公里
		s = s * 6378137.0; //单位：米
		s = Math.round(s * 10000) / 10000;
		console.log('距离：' + s);
		s = s || '';
		return s
	};
	
	//顶 ，取消顶
	Vue.prototype.$upItem = function(objType, objId, upType='up') {
		var self = this;
		//验证用户登录状态
		if(!self.$wap.checkLogin(false)) {
			  self.$f7.dialog.alert('请先登录后再顶', '登录提示', function () {
	          self.$gotoShop('login.html');
	        });
			return;
		}
		
		let dispatchAction = 'upItem';
		
		var successMsg = upType == 'up' ? '顶成功' : '取消顶成功';
		this.$store.dispatch(dispatchAction, {
			objType: objType,
	        objId: objId,
	        type: upType,
	        callback: (res) => {
	        	if(res.code == '200' || res.code == '202') {
//			        		self.$toast(successMsg, 1500, 'center');
				} else {
					self.$toast("网络错误，请重试", 1500, 'center');
				}
	        }
	     });
	};
	
	//顶 ，取消 收藏
	Vue.prototype.$likeItem = function(objType, objId, upType='up') {
		var self = this;
		//验证用户登录状态
		if(!self.$wap.checkLogin(false)) {
			  self.$f7.dialog.alert('请先登录', '登录提示', function () {
	          self.$gotoShop('login.html');
	        });
			return;
		}
		
		let dispatchAction = 'likeItem';
		
		var successMsg = upType == 'like' ? '成功' : '取消成功';
		this.$store.dispatch(dispatchAction, {
			objType: objType,
	        objId: objId,
	        type: upType,
	        callback: (res) => {
	        	if(res.code == '200' || res.code == '202') {
//			        		self.$toast(successMsg, 1500, 'center');
				} else {
					self.$toast("网络错误，请重试", 1500, 'center');
				}
	        }
	     });
	};
		    
	//资源缓存重置标志
	Vue.prototype.$itemCacheFlag = function(objType, objId, getMode=1) {
		$k = objType + '-reset' + objId;
		if (getMode) {
			return this.$wap.getCache($k);
		} else {
			//1个小时内，全部相关监听资源从服务端取
			return this.$wap.setCache($k, 1, 3600);
		}
	};

	// 注册全局组件
	Vue.component('my-nolist', {
		props: ['msg'],
		template: '<div class="v-no-list"><span class="icon mui-icon iconfont icon-xiaolian15"></span><h5>{{msg}}</h5></div>'
	});

	Vue.component('my-success', {
		props: ['msg'],
		template: '<div class="v-op-success"><span class="icon mui-icon iconfont icon-chenggong"></span><h5>{{msg}}</h5></div>'
	});

	Vue.component('remote-js', {
		render(createElement) {
			var self = this
			return createElement('script', {
				attrs: {
					type: 'text/javascript',
					src: this.src
				},
				on: {
					load: function(event) {
						self.$emit('load', event);
					},
					error: function(event) {
						console.log('aa');
						self.$emit('error', event);
					},
					readystatechange: function(event) {
						console.log(this.readyState);
						if(this.readyState == 'complete') {
							self.$emit('load', event);
						}
					}
				}
			})
		},
		props: {
			src: {
				type: String,
				required: true
			}
		}
	});

	// 注册全局过滤器
	//格式化时间
	Vue.filter('timeFormat', function(value) {
		// 时间戳转 2017-03-03 12:00 格式
		var date = new Date(value * 1000);
		Y = date.getFullYear();
		m = date.getMonth() + 1;
		d = date.getDate();
		H = date.getHours();
		i = date.getMinutes();
		if(m < 10) {
			m = '0' + m;
		}
		if(d < 10) {
			d = '0' + d;
		}
		if(H < 10) {
			H = '0' + H;
		}
		if(i < 10) {
			i = '0' + i;
		}
		var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i;
		return t;
	});
	//格式化时间
	Vue.filter('dateFormat', function(value) {
		// 时间戳转 2017-03-03 12:00 格式
		var date = new Date(value * 1000);
		Y = date.getFullYear();
		m = date.getMonth() + 1;
		d = date.getDate();
		H = date.getHours();
		i = date.getMinutes();
		if(m < 10) {
			m = '0' + m;
		}
		if(d < 10) {
			d = '0' + d;
		}
		if(H < 10) {
			H = '0' + H;
		}
		if(i < 10) {
			i = '0' + i;
		}
		var t = Y + '-' + m + '-' + d;
		return t;
	});
	//友好时间
	Vue.filter('friendlytime', function(date) {
		//获取js 时间戳
		var time = new Date().getTime();
		//去掉 js 时间戳后三位，与php 时间戳保持一致
		time = parseInt((time - date * 1000) / 1000);

		//存储转换值 
		var s;
		if(time < 60) { //十分钟内
			return '刚刚';
		} else if((time < 60 * 60) && (time >= 60)) {
			//超过十分钟少于1小时
			s = Math.floor(time / 60);
			return s + "分钟前";
		} else if((time < 60 * 60 * 24) && (time >= 60 * 60)) {
			//超过1小时少于24小时
			s = Math.floor(time / 60 / 60);
			return s + "小时前";
		} else if((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
			//超过1天少于3天内
			s = Math.floor(time / 60 / 60 / 24);
			return s + "天前";
		} else {
			//超过3天
			var date = new Date(parseInt(date) * 1000);
			return(date.getMonth() + 1) + "月" + date.getDate() + "日";
		}
	});
	
	//订单状态文字说明
	Vue.filter('substr', function(_s, len, moreStr='...') {
		if (_s) {
			return _s.substr(0, len) + moreStr;
		}
	});

	//订单状态文字说明
	Vue.filter('orderStateStr', function(value) {
		switch(value.toString()) {
			case '0':
				return '已取消';
				break;
			case '10':
				return '待付款';
				break;
			case '20':
				return '待使用';
				break;
			case '25':
				return '部分待使用';
				break;
			case '30':
				return '已使用';
				break;
			case '40':
				return '已完成';
				break;
			default:
				return '订单异常';
		}
	});

	//订单券码状态文字说明
	Vue.filter('codeStateStr', function(value) {
		switch(value.toString()) {
			case '0':
				return '待使用';
				break;
			case '1':
				return '已使用';
				break;
			case '2':
				return '已过期';
				break;
			default:
				return '状态异常';
		}
	});
	//折扣格式过滤
	Vue.filter('discount', function(value) {
		value = parseFloat(value).toFixed(1);

		if('0' == value.substr(-1, 1)) {
			return value.substr(0, value.length - 2);
		} else {
			return parseFloat(value).toFixed(1);
		}
	});
	//距离格式过滤
	Vue.filter('distance', function(value) {
		var _distance = (value / 1000).toFixed(1);
		if('0.0' == _distance) {
			_distance = '< 0.1';
		}

		return _distance;
	});
	
	
};