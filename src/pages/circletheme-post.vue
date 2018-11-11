<template>
	<div class="page">
		<div class="navbar color-theme-gray no-hairline">
			<div class="navbar-inner">
				<div class="left">
					<a href="#" class="link back">
						取消
					</a>
				</div>
				<div v-if="!themeID" class="title">发帖</div>
				<div v-else class="title">修改生活贴</div>

				<div @click="postTheme()" class="right">
					<a href="#" class="text-color-orange uploadBtn">发送</a>
				</div>
			</div>
		</div>

		<div class="page-content bg-color-white-smoke">
			<div class="edit-content" style="margin: 2rem 1rem;background-color: #ffffff;border-radius: 15px;">
				<div class="head" style="margin:0 1rem;padding: 1rem 0;">
					<img v-lazy="$resizeImg(memberInfo.member_avatar,40,40)" class="avatar" style="width: 40px;height: 40px;border-radius: 50%;display: inline-block;">
					<div class="head-right" style="display: inline-block;position: relative;bottom:10px;margin-left: 10px;">
						<div class="hnp-title" style="width: 100%;">{{memberInfo.member_name}}</div>
					</div>
				</div>
				<div class="pic-upload">
					<div id="uploader" class="wu-example">
						<div class="queueList">
							<ul class="filelist">
								<li>
									<div id="filePicker2" class="bg-color-white-smoke" style="margin: 10px 10px;width: 50px;height: 50px;border-radius: 10px;">
										<i class="icon material-icons font-gray-extra" style="width: 40px;height: 40px;margin:5px;font-size: 40px;">image</i>
									</div>
								</li>
								<li :id="'EDIT_FILE_' + index" v-for="(item, index) in theme.main_imgs" 
									class="dynamic-li upload-state-done">
									<p class="imgWrap">
										<img :src="$resizeImg(item,80)" class="">
									</p>
									<p class="progress"><span></span></p>
									<p class="move">
										<i @click="moveLeft($event)" class="icon f7-icons left">arrow_left</i>
										<i @click="moveRight($event)" class="icon f7-icons right">arrow_right</i>
									</p>
									<div class="file-panel" style="height: 25px;">
										<span @click="removeFile(index)" class="cancel">
											<i class="icon f7-icons" style="color: rgba(255, 59, 48, 0.6);">close_round_fill</i>
										</span>
									</div>
									<input type="hidden" class="img-input" :value="item" >
								</li>

							</ul>
						</div>
						<div class="statusBar" style="display: none;">
							<div class="progress">
								<span class="text">0%</span>
								<span class="percentage"></span>
							</div>
							<div class="info"></div>
						</div>
					</div>
				</div>

				<div>
					<div class="list" style="padding: 5px 16px;">
						<div class="item-input-wrap">
							<textarea v-html="theme.theme_content" id="themeContent" placeholder="说说你的看法" style="height: 90vw;" ></textarea>
						</div>
					</div>

				</div>
			</div>
		</div>

		<remote-js @load="initUploader()" src="static/js/webuploader/webuploader.min.js"></remote-js>
	</div>
</template>
<style>
	.webuploader-container {
		position: relative;
	}
	
	.webuploader-element-invisible {
		position: absolute !important;
		clip: rect(1px 1px 1px 1px);
		/* IE6, IE7 */
		clip: rect(1px, 1px, 1px, 1px);
	}
	
	.webuploader-pick {
		text-align: center;
		border-radius: 5px;
	}
	
	.webuploader-pick-hover {
		background: rgba(255, 235, 59, 0.6);
	}
	
	.webuploader-pick-disable {
		opacity: 0.6;
		pointer-events: none;
	}
	
	#container {
		color: #838383;
		font-size: 12px
	}
	
	#uploader .queueList {
		margin: 0 15px;
		/*border: 2px dashed #e6e6e6*/
	}
	
	#uploader .queueList.filled {
		padding: 17px;
		margin: 0;
		border: 3px dashed transparent
	}
	
	#uploader .queueList.webuploader-dnd-over {
		border: 3px dashed #999
	}
	
	#uploader p {
		margin: 0
	}
	
	.element-invisible {
		position: absolute !important;
		clip: rect(1px 1px 1px 1px);
		clip: rect(1px, 1px, 1px, 1px)
	}
	
	#uploader .placeholder {
		min-height: 100px;
		padding-top: 40px;
		text-align: center;
		color: #ccc;
		font-size: 18px;
		position: relative
	}
	
	#uploader .placeholder .webuploader-pick {
		font-size: 18px;
		background: #00b7ee;
		border-radius: 3px;
		line-height: 44px;
		padding: 0 30px;
		*width: 120px;
		color: #fff;
		display: inline-block;
		margin: 0 auto 20px;
		cursor: pointer;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .1)
	}
	
	#uploader .placeholder .webuploader-pick-hover {
		background: #69B076
	}
	
	#uploader .placeholder .flashTip {
		color: #666;
		font-size: 12px;
		position: absolute;
		width: 100%;
		text-align: center;
		bottom: 20px
	}
	
	#uploader .placeholder .flashTip a {
		color: #0785d1;
		text-decoration: none
	}
	
	#uploader .placeholder .flashTip a:hover {
		text-decoration: underline
	}
	
	#uploader .filelist {
		list-style: none;
		margin: 0;
		padding: 0
	}
	
	#uploader .filelist:after {
		content: '';
		display: block;
		width: 0;
		height: 0;
		overflow: hidden;
		clear: both
	}
	
	#uploader .filelist li {
		width: 70px;
		height: 87px;
		text-align: center;
		margin: 5px 5px 10px 0;
		position: relative;
		display: inline;
		float: left;
		overflow: hidden;
		font-size: 12px
	}
	
	#uploader .filelist li p.log {
		position: relative;
		top: -45px
	}
	
	#uploader .filelist li p.title {
		position: absolute;
		left: 0;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		top: 5px;
		text-indent: 5px;
		text-align: left
	}
	
	#uploader .filelist li p.progress {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		height: 8px;
		overflow: hidden;
		z-index: 50;
		margin: 0;
		border-radius: 0;
		background: 0 0;
		-webkit-box-shadow: 0 0 0
	}
	
	#uploader .filelist li p.progress span {
		display: none;
		overflow: hidden;
		width: 0;
		height: 100%;
		-webit-transition: width 200ms linear;
		-moz-transition: width 200ms linear;
		-o-transition: width 200ms linear;
		-ms-transition: width 200ms linear;
		transition: width 200ms linear;
		-webkit-animation: progressmove 2s linear infinite;
		-moz-animation: progressmove 2s linear infinite;
		-o-animation: progressmove 2s linear infinite;
		-ms-animation: progressmove 2s linear infinite;
		animation: progressmove 2s linear infinite;
		-webkit-transform: translateZ(0)
	}
	
	#uploader .filelist li p.move {
		position: absolute;
		width: 60px;
		bottom: 0;
		/*right: 0px;*/
		/* height: 18px; */
		/* overflow: hidden; */
		z-index: 600;
		margin: 0 auto;
		border-radius: 0;
		background: 0 0;
		-webkit-box-shadow: 0 0 0;
		color: #ff98008a;
	}
	
	#uploader .filelist li p.move span {
		display: none;
		overflow: hidden;
		width: 0;
		height: 100%;
		-webit-transition: width 200ms linear;
		-moz-transition: width 200ms linear;
		-o-transition: width 200ms linear;
		-ms-transition: width 200ms linear;
		transition: width 200ms linear;
		-webkit-animation: progressmove 2s linear infinite;
		-moz-animation: progressmove 2s linear infinite;
		-o-animation: progressmove 2s linear infinite;
		-ms-animation: progressmove 2s linear infinite;
		animation: progressmove 2s linear infinite;
		-webkit-transform: translateZ(0)
	}
	
	#uploader .filelist li p.move i {
		font-size: 20px;
	}
	
	#uploader .filelist li p.move .left {
		margin-right: 20px;
	}
	
	#uploader .filelist li p.move .left {
		/*margin-left:0px;*/
	}
	
	@-webkit-keyframes progressmove {
		0% {
			background-position: 0 0
		}
		100% {
			background-position: 17px 0
		}
	}
	
	@-moz-keyframes progressmove {
		0% {
			background-position: 0 0
		}
		100% {
			background-position: 17px 0
		}
	}
	
	@keyframes progressmove {
		0% {
			background-position: 0 0
		}
		100% {
			background-position: 17px 0
		}
	}
	
	#uploader .filelist li p.imgWrap {
		margin-top: 5px;
		z-index: 2;
		line-height: 60px;
		vertical-align: middle;
		overflow: hidden;
		width: 60px;
		height: 60px;
		-webkit-transform-origin: 50% 50%;
		-moz-transform-origin: 50% 50%;
		-o-transform-origin: 50% 50%;
		-ms-transform-origin: 50% 50%;
		transform-origin: 50% 50%;
		-webit-transition: 200ms ease-out;
		-moz-transition: 200ms ease-out;
		-o-transition: 200ms ease-out;
		-ms-transition: 200ms ease-out;
		transition: 200ms ease-out
	}
	
	#uploader .filelist li img {
		width: 100%
	}
	
	#uploader .filelist li p.error {
		background: #f43838;
		color: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 28px;
		line-height: 28px;
		width: 100%;
		z-index: 100
	}
	
	#uploader .filelist li .success {
		display: block;
		position: absolute;
		left: 0;
		bottom: 20px;
		height: 40px;
		width: 100%;
		z-index: 200;
		background: url(../../static/img/success.png) no-repeat right bottom;
	}
	
	#uploader .filelist div.file-panel {
		width: 25px;
		height: 25px;
		position: absolute;
		top: 0;
		right: 0px;
		/*filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#80000000', endColorstr='#80000000') \0;*/
		/*background: rgba(0, 0, 0, .5);*/
		overflow: hidden;
		z-index: 300
	}
	
	#uploader .filelist div.file-panel span {
		width: 24px;
		height: 24px;
		display: inline;
		overflow: hidden;
		margin: 5px 1px 1px;
		cursor: pointer
	}
	
	#uploader .filelist div.file-panel span.cancel {
		/*background-position: -48px -24px;*/
		margin: 0 -20px 0;
	}
	
	#uploader .filelist div.file-panel span.cancel:hover {
		/*background-position: -48px 0*/
	}
	
	#uploader .statusBar {
		height: 63px;
		padding: 0 20px;
		line-height: 63px;
		vertical-align: middle;
		position: relative
	}
	
	#uploader .statusBar .progress {
		border: 1px solid #1483d8;
		width: 198px;
		background: #fff;
		height: 18px;
		display: inline-block;
		text-align: center;
		line-height: 20px;
		color: #6dbfff;
		position: relative;
		margin: 0 10px 0 0
	}
	
	#uploader .statusBar .progress span.percentage {
		width: 0;
		height: 100%;
		left: 0;
		top: 0;
		background: #1483d8;
		position: absolute
	}
	
	#uploader .statusBar .progress span.text {
		position: relative;
		z-index: 10
	}
	
	#uploader .statusBar .info {
		display: inline-block;
		font-size: 14px;
		color: #666
	}
	
	#uploader .statusBar .btns {
		position: absolute;
		top: 10px;
		right: 20px;
		line-height: 40px
	}
	
	#filePicker2 {
		display: inline-block;
		float: left
	}
	
	#uploader .statusBar .btns .uploadBtn,
	#uploader .statusBar .btns .uploadBtn.state-paused,
	#uploader .statusBar .btns .uploadBtn.state-uploading,
	#uploader .statusBar .btns .webuploader-pick {
		background: #fff;
		border: 1px solid #cfcfcf;
		color: #565656;
		padding: 0 18px;
		display: inline-block;
		border-radius: 3px;
		margin-left: 10px;
		cursor: pointer;
		font-size: 14px;
		float: left
	}
	
	#uploader .statusBar .btns .uploadBtn.state-paused:hover,
	#uploader .statusBar .btns .uploadBtn.state-uploading:hover,
	#uploader .statusBar .btns .uploadBtn:hover,
	#uploader .statusBar .btns .webuploader-pick-hover {
		background: #f0f0f0
	}
	
	#uploader .statusBar .btns .uploadBtn {
		background: #00b7ee;
		color: #fff;
		border-color: transparent
	}
	
	#uploader .statusBar .btns .uploadBtn:hover {
		background: #69B076
	}
	
	#uploader .statusBar .btns .uploadBtn.disabled {
		pointer-events: none;
		opacity: .6
	}
</style>
<style scoped>
	/*@import url("../css/font-awesome.min.css");*/
</style>
<script>
	import wap from '../js/wap.js'
	import '../js/jquery-2.2.4.min.js'
	import myUpload from '../js/circletheme-upload.js'

	export default {
		data() {
			return {
				uploader: {},
				circleID: 0,
				circleName: '',
				themeID: '',
				theme: {},
				memberInfo: {},
			}
		},

		created() {
			document.title = '派友圈-发帖';
			var self = this;

			//验证用户登录状态
			if(!wap.checkLogin(false)) {
				self.$f7.dialog.alert('请先登录', '登录提示', function() {
					self.$gotoShop('login.html');
				});
				return;
			}

			//编辑文章
			if('undefined' !== typeof(this.$route.query.theme_id)) {
				self.themeID = self.$route.query.theme_id;

				//获取主题帖内容，以便进行编辑
				wap.getajax('api/user/circletheme/detail?theme_id=' + self.themeID, {}, function(res) {
					if(res.status == 'success') {
						self.theme = res.data;
						self.circleID = self.theme.circle_id;
						self.circleName = self.theme.circle_name;
					}
				}, 'v1', false, 0);
			} else {
				self.circleID = this.$route.query.circle_id;
				self.circleName = decodeURI(this.$route.query.circle_name);
			}

			if('undefined' == self.circleID || 'undefined' == self.circleName) {
				setTimeout(function() {
					self.$toast('圈子信息丢失，请返回重新进入', 2000, 'center', true, false);
					self.$router.back();
				}, 1500);
				return;
			}

			self.memberInfo = wap.getLocalLoginData();
		},

		mounted() {
			var app = this.setF7();
			var self = this;
			this.$initGotop();
		},

		updated() {
			console.log('updated');
		},

		methods: {
			//初始化webUploader控件
			initUploader() {
				var self = this;
				var uploader = myUpload('#filePicker2', wap.apiUrl);
				console.log(uploader);
				uploader.option('headers', {
					Token: wap.getLocalToken(),
					Accept: 'application/vnd.cattlepie.v1+json'
				});

				// 修改后图片上传前，尝试将图片压缩到 800 * 600
				uploader.option('compress', {
					width: 1000,
					height: 1000,
					// 图片质量，只有type为`image/jpeg`的时候才有效。
					quality: 100,
					// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
					allowMagnify: false,
					// 是否允许裁剪。
					crop: false,
					// 是否保留头部meta信息。
					preserveHeaders: true,
					// 如果发现压缩后文件大小比原来还大，则使用原来图片
					// 此属性可能会影响图片自动纠正功能
					noCompressIfLarger: false,

					// 单位字节，如果图片大小小于此值，不会采用压缩。
					compressSize: 0
				});

				uploader.on('uploadSuccess', function(file, response) {
					if('success' != response.status) {
						//上传图片服务端出错
						return;
					}
					var oLi = $('#' + file.id);
					oLi.addClass('upload-state-done');
					oLi.append(`<input type="hidden" class="img-input" value="${response.data[0]}" \>`);

					//验证所有图片都已成功上传
					if($('li.dynamic-li').length == $('input.img-input').length) {
						self.$f7.dialog.close();
						self.doPostTheme();
					}

				});

				self.uploader = uploader;
			},
			//图像左移
			moveLeft($event) {
				var _this = $event.currentTarget;
				var pLi=$(_this).parents('li.dynamic-li');
				var prevLi = pLi.prev('li.dynamic-li');
				pLi.hide(0);
				prevLi.hide(0);
				
				prevLi.before(pLi);
				pLi.show(150);
				prevLi.show(150);
			},
			//图像右移
			moveRight($event) {
				var _this = $event.currentTarget;
				var pLi=$(_this).parents('li.dynamic-li');
				var nextLi = pLi.next('li.dynamic-li');
				pLi.hide(0);
				nextLi.hide(0);
				nextLi.after(pLi);
				pLi.show(150);
				nextLi.show(150);
			},
			
			removeFile(index) {
				var $li = $('#EDIT_FILE_' + index);
				$li.off().find('.file-panel').off().end().remove();
			},
			
			//发布帖子前处理：上传图片到服务器
			postTheme() {
				var self = this;
				//验证是否有图片上传
				if(!self.$$('#themeContent').val()) {
					self.$toast('请输入帖子文字内容', 2000, 'center', true, false);
					return;
				}

				if(!$('li.dynamic-li').length || $('li.dynamic-li').length == $('input.img-input').length) {
					self.doPostTheme();
					return;
				}

				self.$f7.dialog.progress('正在上传图片，图片较大，请耐心等候...');

				setTimeout(function() {
					self.$f7.dialog.close();
				}, 30000);

				$('.progress').show();
				self.uploader.upload();

				return;
			},
			
			//发布帖子
			doPostTheme() {
				var self = this;
				self.$f7.dialog.progress('正在发表生活贴...');
				setTimeout(function() {
					self.$f7.dialog.close();
					self.$toast('网络错误，请稍后再试', 3000, 'center', true, false);
				}, 15000);

				var main_imgs = '';
				$('input.img-input').each(function() {
					main_imgs += '|' + $(this).val();
				});

				setTimeout(function() {
					
					if (self.themeID) {
						var data = {
							theme_id: self.themeID,
							theme_images: main_imgs,
							theme_content: self.$$('#themeContent').val(),
						};
						
						wap.doajax('api/user/circletheme/update', data, function(res) {
							if(res.status == 'success') {
								self.$itemCacheFlag('theme-post', self.themeID, false);
								
								self.$toast('恭喜，修改生活贴成功', 2000, 'center', true, true);
								setTimeout(function() {
									self.$router.go('-1');
									return;
								}, 2000);
							} else {
								self.$toast('网络错误，请稍后再试', 3000, 'center', true, false);
								return;
							}
							self.$f7.dialog.close();
	
						}, 'v1', false);
						
					} else {
						var data = {
							circle_id: self.circleID,
							circle_name: self.circleName,
							theme_images: main_imgs,
							theme_content: self.$$('#themeContent').val(),
						};
						
						wap.doajax('api/user/circletheme/create', data, function(res) {
							if(res.status == 'success') {
								self.$itemCacheFlag('circletheme', self.circleID, false);
								self.$toast('恭喜，发帖成功', 2000, 'center', true, true);
								setTimeout(function() {
									self.$redirect('/circle-detail/id/' + self.circleID + '/');
									return;
								}, 2000);
							} else {
								self.$toast('网络错误，请稍后再试', 3000, 'center', true, false);
								return;
							}
							self.$f7.dialog.close();
	
						}, 'v1', false);
						
					}
					
 
					
					
				}, 1);
			},
		},
		components: {}

	}
</script>