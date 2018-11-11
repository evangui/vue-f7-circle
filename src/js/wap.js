/**
 * 常用通用功能封装
 */
import config from './config.js';

var wap = {
	apiUrl: config.apiUrl,
	siteUrl: config.siteUrl,
	userSiteUrl: config.userSiteUrl,
	shopSiteUrl: config.shopSiteUrl,
	cachePrefix: '',
	
	//打开微信分享提示层
	openShare: function() {
		let winHeight = $(window).height();
		$(".weixin-tip").css("height",winHeight);
        $(".weixin-tip").show();
		$('body').on('touchend',function(){
			$(".weixin-tip").hide(300);
		});
	},
				
	setAppf7: function(appf7) {
		
	},
	
	setCache: function(key, value, exp) {
		var curTime = new Date().getTime();
		var expTime = curTime + exp*1000;
        localStorage.setItem(this.cachePrefix + key, JSON.stringify({data:value, expTime:expTime}));
	},
	
	getCache: function(key) {
		var data = localStorage.getItem(this.cachePrefix + key);
		if (!data || 'undefined' === typeof(data)) {
			return false;
		}
        var dataObj = JSON.parse(data);
        if (new Date().getTime()> dataObj.expTime) {
            console.log(`信息${key}已过期`);
            localStorage.removeItem(this.cachePrefix + key);
            return null;
        }else{
            //console.log("data="+dataObj.data);
            //console.log(JSON.parse(dataObj.data));
            var dataObjDatatoJson = dataObj.data;
            if ('undefined' == typeof(dataObjDatatoJson)) {
            	dataObjDatatoJson = false;
            }
            
            return dataObjDatatoJson;
        }
	},
	
	setLocation: function(lng, lat, cacheTime) {
		this.setCache('user-location', {
			lng: lng, 
			lat: lat
		}, cacheTime);
	},
	getLocation: function() {
		return this.getCache('user-location');
	},
	
	//获取本地token数据
	getLocalToken: function() {
		var _token = localStorage.getItem('token');
		if (!_token) {
			return false;
		}
		return _token;
	},
	

	//设置本地token数据
	setLocalToken: function(token) {
		if ('undefined' === typeof(token)) {
			return false;
		}
		localStorage.setItem('token', token);
	},
	//获取本地token数据
	getLocalToken: function() {
//		return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqb2luaW5fc3RhdGUiOjAsIm1lbWJlcl9tb2JpbGVfYmluZCI6MSwic3ViIjoyMTcsImlzcyI6Imh0dHA6Ly9hcGlkZXYuY2F0dGxlcGllLm1lL2FwaS91c2VyL2F1dGgvcmVmcmVzaCIsImlhdCI6MTUyMTYyNTY0MiwiZXhwIjoyMTQ3NDgzNjQ3LCJuYmYiOjE1MjE2MjU2NDIsImp0aSI6InJQd3hla2Z6d29TdXdaangifQ.hwtlyZ6kCvtYiqMFgb9Oz-Mxt-LUoHyQgEXn4dC_V5k';
		
		var _token = localStorage.getItem('token');
		if (!_token) {
			return false;
		}
		return _token;
	},
	//清除本地token数据
	clearLocalToken: function() {
		localStorage.removeItem('token');
		localStorage.removeItem('logindata');
//		wap.checkLogin();
		return ;
	},
	
	//设置本地用户登录后的用户信息logindata
	setLocalLoginData: function(_data) {
		if ('undefined' === typeof(_data)) {
			return false;
		}
		var _dd = 'string' == typeof(_data) ? _data : JSON.stringify(_data);
		localStorage.setItem('logindata', _dd);
	},
	//获取本地用户登录后的用户信息
	getLocalLoginData: function() {
//		var _s = '{"member_id":217,"member_mobile":"18571593115","member_name":"桂亚军","member_avatar":"http://apidev.cattlepie.com/storage/201711/17/xQyQzTLCW0g7QAShSCmLaTyjE8D6ssJWSinDGJxT.jpeg","member_sex":1,"member_type":0,"weixin_unionid":"oHJC800UkXc7IXPU5fcVU_TInDWw","member_nb":"0.00","joinin_state":0,"member_mobile_bind":1}';
//		return JSON.parse(_s);
		return JSON.parse(localStorage.getItem('logindata'));
	},
	//获取已登录会员信息
	getMember: function() {
		if (!this.getLocalToken()) {
			return {};
		}
		return this.getLocalLoginData();
	},
	
	//从app过来的webview请求，需要隐藏头部信息，设置localstorge缓存
	setSimpleMode: function(_data) {
		if ('undefined' === typeof(_data)) {
			return false;
		}
		localStorage.setItem('simpleMode', _data);
	},
	//判断是否是从app过来的webview请求，需要隐藏头部信息
	isSimpleMode: function() {
		var _simpleMode = localStorage.getItem('simpleMode');
		if (!_simpleMode) {
			return false;
		}
		return parseInt(_simpleMode);
	},

	//post请求
	doajax: function(url, params, onSuccess,version, isAsync, onError) {
		var url = this.apiUrl + url;
		var onSuccess = arguments[2] ? arguments[2] : function() {};
		var version = arguments[3] ? this.getversion(version) : 'application/vnd.cattlepie.v1+json';
		var isAsync = arguments[4] ? arguments[4] : true;
		var onError = arguments[5] ? arguments[5] : function(){};
		var authstr = this.getLocalToken() != null ? this.getLocalToken() : '';
		var ajaxObj = {
			type: "post",
			url: url,
			async: isAsync,
			cache: false,
			dataType: 'text', //服务器返回json格式数据
			data: params,
			timeout: 6000,
			headers: {
				'Accept': version,
				'Token': authstr,
			},
			success: function(data) {
				var data = JSON.parse(data);
				if ('405' === data.code.toString()) {
					wap.clearLocalToken();
					return false;
				} 
				onSuccess(data);
			},
			error: function(xhr, type, errorThrown) {
				//console.log('error:' + errorThrown);
				//console.log(xhr.responseText);
				onError();
			}
		};
		$.ajax(ajaxObj);
	},
	//版本方法 根据数字传getajax不同的版本号	 
	getversion:function(num){		
		return 'application/vnd.cattlepie.'+num+'+json';					
	},	
	//get请求
	getajax: function(url, params, onSuccess, version, isAsync, cacheTime, onError) {
		var url = this.apiUrl + url;
		var onSuccess = arguments[2] ? arguments[2] : function() {};
		var version = arguments[3] ? this.getversion(version) : 'application/vnd.cattlepie.v1+json';
		var isAsync = arguments[4] !== null ? arguments[4] : true;
		var cacheTime = arguments[5] ? arguments[5] : 0;
		var onError = arguments[6] ? arguments[6] : function() {};
		
		var cacheKey = encodeURI(url + JSON.stringify(params));
//		console.log(params)
		var sRet;
		if (cacheTime) {
			var data = this.getCache(cacheKey);
			if (data) {
				onSuccess(data, true);
				return;
			}
		}
		
		/*var AcceptInfo = 'application/vnd.cattlepie.v1+json';*/
		var authstr = this.getLocalToken() != null ? this.getLocalToken() : '';
		var ajaxObj = {
			type: "get",
			url: url,
//			cache: false,
			async: isAsync,
			dataType: 'text', //服务器返回json格式数据
			data: params,
			type: 'get',
			timeout: 6000,
			headers: {
				'Accept': version,
				'Token': authstr,
			},
			success: function(data) {
				var data = JSON.parse(data);
				if ('405' === data.code.toString()) {
					wap.clearLocalToken();
					return false;
				}
				
				if (cacheTime) {
					wap.setCache(cacheKey, data, cacheTime);
				}
				
				onSuccess(data);
			},
			error: function(xhr, type, errorThrown) {
				//console.log('error:' + errorThrown);
				//console.log(xhr.responseText);
				onError();
			}
		};
		$.ajax(ajaxObj);

//		this.appf7.request.setup(ajaxObj);
//		this.appf7.request.get(url, onSuccess);
	},
	//图片ajax
	//图片ajax
	picajax: function(url, params, onSuccess, isAsync, onError) {
		var url = wap.apiUrl + url;
		var onSuccess = arguments[2] ? arguments[2] : function() {};
		var isAsync = arguments[4] != null ? arguments[4] : true;
		var onError = arguments[5] ? arguments[5] : function() {};
		var AcceptInfo = 'application/vnd.cattlepie.v1+json';
		var authstr = this.getLocalToken() != null ? this.getLocalToken() : '';
		var ajaxObj = {
			type: "post",
			url: url,
			async: isAsync,
			//dataType: 'text', //服务器返回json格式数据
			data: params,
			type: 'post',
			processData: false,
			contentType: false,
			timeout: 6000,
			headers: {
				'Accept': AcceptInfo,
				'Token': authstr
			},
			success: function(data) {
				onSuccess(data);
			},
			error: function(xhr, type, errorThrown) {
				//console.log('error:' + errorThrown);
				//console.log(xhr.responseText);
				onError();
			},

		};
		$.ajax(ajaxObj);
//		this.appf7.request(ajaxObj);
	},
	
	/*
	 刷新token,取到所需要的信息
	 */
	refreshToken: function() {
		var token = this.getLocalToken();
		var postdata = {
			Token: token
		};
		wap.getajax("api/user/auth/refresh", postdata, function(data) {
			if(data.status == 'success') {
				console.log(data.data.token);
//				localStorage.removeItem(token);
//				localStorage.removeItem('logindata');
				wap.setLocalToken(data.data.token);
				wap.setLocalLoginData(data.data.member_info);
			} else if (403 == data.code && data.msg == 'Token 错误') {
				wap.clearLocalToken();
			}
		}, 'v1', false);
	},
	
	sleep: function(d) {
		for(var t = Date.now(); Date.now() - t <= d;);
	},

	/**
	 * 获取url中的GET参数值
	 * @param {Object} param
	 */
	getQueryString: function(param, url) {
		if (!arguments[1]) {
			var url = window.location.href;
		}
		var searchIndex = url.indexOf('?');
		var searchParams = url.slice(searchIndex + 1).split('&');
		for(var i = 0; i < searchParams.length; i++) {
			var items = searchParams[i].split('=');
			if(items[0].trim() == param) {
				return items[1].trim();
			}
		}
	},
	/**		
	 * window.location.href = './login.html';
			} else {}
		if(!authstr) {
				setTimeout(function(){
			if('undefined' === typeof(redirectToLogin) || redirectToLogin) {
	 * 根据分类id获取分类
	 * 
	 * @param {int} cid
	 */
	getCategoryInfo: function(cid) {
		var goodsclass = [];
		if(null !== localStorage.getItem('goodsclass')) {
			goodsclass = JSON.parse(localStorage.getItem('goodsclass'));
		} else {
			//从服务端取一次数据
			this.getajax('api/goods/goodsclass', {}, function(res) {
				if(res.status == 'success') {
					goodsclass = res.data;
				} else {
					goodsclass = [];
				}
				localStorage.setItem('goodsclass', JSON.stringify(goodsclass));
			},
			'v1', false);
		}

		if(null !== localStorage.getItem('goodsclass')) {
			goodsclass = JSON.parse(localStorage.getItem('goodsclass'));
		}

		if('undefined' === typeof(cid)) {
			return goodsclass;
		}
		for(var i = 0; i < goodsclass.length; i++) {
			if(cid == goodsclass[i].gc_id) {
				return goodsclass[i];
			}
		}
		return [];
	},
	
	//获取频道数据
	getChannelInfo: function(cid) {
		var channels = [];
		wap.getajax('api/user/channel/searchList', {}, function(res) {
			if(res.status == 'success') {
				channels = res.data.datalist;
			}
		}, 'v1', false, 3600);
		
		if('undefined' === typeof(cid)) {
			return channels;
		}
		
		for(var i = 0; i < channels.length; i++) {
			if(cid == channels[i].c_id) {
				return channels[i];
			}
		}
		return [];
	},
	
	//登出方法
	dologout: function() {
		localStorage.clear();
		window.location.href = "login.html";
	},
	//获取登录跳转前的来源页
	getLoginRedirectUrl: function() {
		return localStorage.getItem('loginRedirectUrl') || '/';
	},
	//记录登录跳转前的来源页
	setLoginRedirectUrl: function(_url) {
		if('undefined' === typeof(_url)) {
			_url = window.location.href;
		}
		console.log(_url);
		localStorage.setItem('loginRedirectUrl', _url);
	},
	//随机生成字符串
	randomString: function(len) {
		len = len || 32;
		var $chars = 'abcdefhijkmnprstwxyz2345678';
		var maxPos = $chars.length;
		var pwd = '';
		for(i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	},
	
	//验证用户手机号是否绑定，如果未绑定手机号，则自动转到绑定手机号页面
	checkMobileBind: function() {
		var userinfo = wap.getLocalLoginData();
		if (!userinfo.member_mobile_bind || !userinfo.member_mobile) {
			//去服务端取最新的身份信息
			wap.refreshToken();
			userinfo = wap.getLocalLoginData();
			if (!userinfo.member_mobile_bind || !userinfo.member_mobile) {
				if(window.location.href.indexOf('new_bind_mobile') < 1) {
					mui.toast("为了您的账号安全，请您先绑定手机号！");
					setTimeout(function() {
						window.location.href = "./new_bind_mobile.html?v=" + Math.random();
					}, 2000);
					return false;
				}
			}
		}
		return true;
	},
	
	/**
	 * 对所有需要用户登录后操作的页面，进行统一的登录检测
	 * 
	 * @param {Object} param
	 */
	checkLogin: function(redirectToLogin, recordRef) {
		recordRef = undefined !== recordRef ? recordRef : true;
		if(this.isWeiXin()){
			if (!this.checkWeixinLogin()) {
				//记录登录跳转前的来源页
				if (recordRef) {
					this.setLoginRedirectUrl();
				}
				return false;
			}
		}else{
			if (!this.checkWapLogin()) {
				//记录登录跳转前的来源页
				if (recordRef) {
					this.setLoginRedirectUrl();
				}
				
				//识别redirectToLogin 参数进行自动跳转到登录页
				if('undefined' === typeof(redirectToLogin) || redirectToLogin) {
					mui.toast("您还未登录，请登录后再进行操作");
					setTimeout(function() {
						window.location.href = './login.html';
					}, 1500);
				}
				return false;
			}
		}
		
		//验证用户手机号是否绑定，如果未绑定手机号，则自动转到绑定手机号页面
		if (!wap.checkMobileBind()) {
			return false;
		}
		return true;
	},
	
	//身份判断 
	checkWapLogin : function(){
		return this.getLocalToken() && this.getLocalLoginData();
	},
	
	/**
	 * 微信浏览器环境下，检测用户的登录状态
	 * 1. 如果本地不存在token则取服务端取token，取到后写token，即认为已登录。并将返回的用户信息写入localStorge
	 * 2. 如果服务端也没有取到token，则转到服务端微信授权处理api url。
	 */
	checkWeixinLogin: function() {
//		debugger
		var loginToken = localStorage.getItem("token");
		var userinfo = wap.getLocalLoginData();
		var unionid = (!userinfo || 'undefined' === typeof(userinfo.weixin_unionid))
			? '' : userinfo.weixin_unionid;
		if (!unionid || !userinfo) {
//			wap.clearLocalToken();
			loginToken = userinfo = '';
		}
		
		if (loginToken && userinfo ) {
			return true;
		}
		//记录登录跳转前的来源页
		this.setLoginRedirectUrl();
		
		//本地生成与服务端会话的会话id
		var sessTag = localStorage.getItem('sessTag');
		if(!sessTag) {
			var sessTag = wap.randomString(8);
			localStorage.setItem('sessTag', sessTag);
		}
		//服务端取token,采用ajax同步模式
		wap.getajax('api/user/auth/wechattoken?tag=' + sessTag, {}, function(res) {
			console.log(res);
			
			if('success' === res.status && res.data) {
				//取到token和用户信息，保存本地
				wap.setLocalToken(res.data.data.token);
				wap.setLocalLoginData(res.data.data.member_info);
				
				var userinfo = wap.getLocalLoginData();
				if (!userinfo || 'undefined' === typeof(userinfo)) {
					//为了防止循环跳转，再次验证token信息是否已存入，如未写入（有bug，赶紧修复），则提示系统问题，跳转到不需要验证登录的页面
					window.location.href = './';
				}
				
				//验证用户手机号是否绑定，如果未绑定手机号，则自动转到绑定手机号页面
				if (!wap.checkMobileBind()) {
					return false;
				}
				
				//跳回到登录跳转前的来源页
				window.location.href = wap.getLoginRedirectUrl();
			} else {
				//本地生成与服务端会话的会话id
				var sessTag = localStorage.getItem('sessTag');
				if(!sessTag) {
					sessTag = wap.randomString(8);
					localStorage.setItem('sessTag', sessTag);
				}
				console.log(wap.apiUrl + "wechat/authup/20/user/" + sessTag);
				window.location.href = wap.apiUrl + "wechat/authup/20/user/" + sessTag
			}
		}, 'v1', true, false);	//ajax同步等待模式
		
		return false;
	},
	
	randomString: function(len) {
		len = len || 32;
		var $chars = 'abcdefhijkmnprstwxyz2345678';
		var maxPos = $chars.length;
		var pwd = '';
		for(var i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	},

	//通过config接口注入权限验证配置
	setWxConfig: function() {
		var _data = {
			url:window.location.href,
			api_list: [
	            // 所有要调用的 API 都要加到这个列表中
	            'checkJsApi',
	            'onMenuShareTimeline',
	            'onMenuShareAppMessage',
	            'onMenuShareQQ',
	            'onMenuShareWeibo',
	            'onMenuShareQZone'
	        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2;
		};
		wap.doajax('api/user/wechatjssdk/getconfig', _data, function(res) {
			if(res.status == 'success') {
				wx.config(res.data);						
			} else {
				//创建订单失败
				mui.toast(res.msg);
				return;
			}
		});
							
	},

	/**
	 * 检测当前ua，是否是微信浏览器
	 */
	isWeiXin: function(){
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	
	loadJS: function(url, callback) {
	    var head = document.getElementsByTagName("head")[0];
	    var script = document.createElement("script");
	    script.src = url;
	    var done = false;
	    script.onload = script.onreadystatechange = function() {
	        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
//	        if (!done && (this.readyState == "loaded" || this.readyState == "complete")) {	
	            done = true;
	            callback();
	            script.onload = script.onreadystatechange = null;
	            head.removeChild(script);
	        }
	    };
	    head.appendChild(script);
	}
}


export  default wap;