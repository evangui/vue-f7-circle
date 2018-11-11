//微信分享事件监听，常用功能封装
	var myAmap = function(opts) {
		var defaults = {
			title: '分享标题', //分享标题,不能为空
			desc: '', //分享描述，可以为空，（分享到朋友圈，不支持描述）
			link: '', //分享页面地址,不能为空
			imgUrl: '', //分享是封面图片，不能为空
			success: function() {}, //分享成功触发
			cancel: function() {} //分享取消触发，需要时可以调用
		}
		this.opts = arguments[0] ? opts : defaults;
	}

	myAmap.prototype = {
		plugnToolBar: function() {
			map.plugin(["AMap.ToolBar"], function() {
				map.addControl(new AMap.ToolBar());
			});
			if(location.href.indexOf('&guide=1') !== -1) {
				map.setStatus({
					scrollWheel: false
				})
			}
		},
		
		//逆地理编码
		//逆向地理编码
//		var x = localStorage.getItem('user_lng');
//		var y = localStorage.getItem('user_lat');
//		regeocoder([x, y]);
		regeocoder: function(lnglatXY) {
			AMap.plugin('AMap.Geocoder', function() {
				map.addControl(geocoder);
			})
			var geocoder = new AMap.Geocoder({
				radius: 1000,
				extensions: "all"
			});

			geocoder.getAddress(lnglatXY, function(status, result) {
				if(status === 'complete' && result.info === 'OK') {
					geocoder_CallBack(result);
				}
			});

			function geocoder_CallBack(data) {
				var address = data.regeocode.formattedAddress; //返回地址描述
//				alert(address);
				localStorage.setItem('locations', address);
			}
		},
		
		//请求地理位置定位
		reqLocation: function(onComplete, onError) {
			var onComplete = arguments[0] ? arguments[0] : onCompleteFunc;
			var onError = arguments[1] ? arguments[1] : onErrorFunc;

			var map, geolocation;
			//加载地图，调用浏览器定位服务
			map = new AMap.Map('container', {
				resizeEnable: true,
			});

			map.plugin('AMap.Geolocation', function() {
				geolocation = new AMap.Geolocation({
					enableHighAccuracy: true, //是否使用高精度定位，默认:true
					timeout: 1000, //超过10秒后停止定位，默认：无穷大
					zoom: 16,
				});
				map.addControl(geolocation);
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
				AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
			});

			//解析定位结果
			function onCompleteFunc(data) {
				alert(data);
				console.log(data);
				var user_lng = data.position.getLng();
				var user_lat = data.position.getLat();
				
				var str = ['定位成功'];
				str.push('经度：' + user_lng);
				str.push('纬度：' + user_lat);
				localStorage.setItem('user_lng', user_lng);
				localStorage.setItem('user_lat', user_lat);
			}

			function onErrorFunc(data) {
				/*alert('定位失败');*/
				console.log(data)
			}
		},
	}
	
	export  default myAmap;
