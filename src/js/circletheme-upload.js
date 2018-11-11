/**
 * 基于WebUploader封装的圈子图片上传方法
 * @param {Object} picker
 * @param {Object} apiUrl
 */
	function myUpload(picker, apiUrl) {
		apiUrl = apiUrl || 'http://apidev.cattlepie.com/';
		var $ = jQuery, // just in case. Make sure it's not an other libaray.

			$wrap = $('#uploader'),

			// 图片容器
			$queue = $wrap.find('.filelist'),

			// 状态栏，包括进度和控制按钮
			$statusBar = $wrap.find('.statusBar'),

			// 文件总体选择信息。
			$info = $statusBar.find('.info'),

			// 上传按钮
			$uploadBtn = $(document).find('.uploadBtn'),

			// 没选择文件之前的内容。
			$placeHolder = $wrap.find('.placeholder'),

			// 总体进度条
			$progress = $statusBar.find('.progress').hide(),

			// 添加的文件数量
			fileCount = 0,

			// 添加的文件总大小
			fileSize = 0,

			// 优化retina, 在retina下这个值是2
			ratio = window.devicePixelRatio || 1,

			// 缩略图大小
			thumbnailWidth = 60 * ratio,
			thumbnailHeight = 60 * ratio,

			// 可能有pedding, ready, uploading, confirm, done.
			state = 'pedding',

			// 所有文件的进度信息，key为file id
			percentages = {},

			supportTransition = (function() {
				var s = document.createElement('p').style,
					r = 'transition' in s ||
					'WebkitTransition' in s ||
					'MozTransition' in s ||
					'msTransition' in s ||
					'OTransition' in s;
				s = null;
				return r;
			})(),

			// WebUploader实例
			uploader;


		if(!WebUploader.Uploader.support()) {
			alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
			throw new Error('WebUploader does not support the browser you are using.');
		}

		// 实例化
		var uploader = WebUploader.create({
			server: apiUrl + 'api/user/resource/image/upload',
			pick: {
				id: picker,
				innerHTML: '',
				multiple: true,
			},
//			dnd: '#uploader .queueList',
			paste: document.body,

			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/*'
			},

			// swf文件路径
			swf: '../../dist/Uploader.swf',

			disableGlobalDnd: true,

//			chunked: true,

			fileNumLimit: 300,
			fileSizeLimit: 40 * 1024 * 1024, // 200 M
			fileSingleSizeLimit: 10 * 1024 * 1024, // 50 M
			duplicate: false,
		});

		// 添加“添加文件”的按钮，
//		uploader.addButton({
//			id: '#filePicker2',
//			label: '添加'
//		});

		// 当有文件添加进来时执行，负责view的创建
		function addFile(file) {
			var $li = $('<li class="dynamic-li" id="' + file.id + '">' +
					'<p class="imgWrap"></p>' +
					'<p class="progress"><span></span></p>' +
					'<p class="move"><i class="icon f7-icons left">arrow_left</i><i class="icon f7-icons right">arrow_right</i></p>' +
					'</li>'),

				$btns = $('<div class="file-panel">' +
					'<span class="cancel"><i class="icon f7-icons" style="color: rgba(255, 59, 48, 0.6);">close_round_fill</i></span>' +
					'</div>').appendTo($li),
				$prgress = $li.find('p.progress span'),
				$wrap = $li.find('p.imgWrap'),
				$info = $('<p class="error"></p>'),

				showError = function(code) {
					switch(code) {
						case 'exceed_size':
							text = '文件大小超出';
							break;

						case 'interrupt':
							text = '上传暂停';
							break;

						default:
							text = '上传失败';
							break;
					}

					$info.text(text).appendTo($li);
				};

			$li.find('.left').click(function(){
				var pLi=$(this).parents('li.dynamic-li');
				var prevLi = pLi.prev('li.dynamic-li');
				pLi.hide(0);
				prevLi.hide(0);
				
				prevLi.before(pLi);
				pLi.show(150);
				prevLi.show(150);
			});
			$li.find('.right').click(function(){
				var pLi=$(this).parents('li.dynamic-li');
				var nextLi = pLi.next('li.dynamic-li');
				pLi.hide(0);
				nextLi.hide(0);
				nextLi.after(pLi);
				pLi.show(150);
				nextLi.show(150);
			});
				
			if(file.getStatus() === 'invalid') {
				showError(file.statusText);
			} else {
				// @todo lazyload
				$wrap.text('预览中');
				uploader.makeThumb(file, function(error, src) {
					if(error) {
						$wrap.text('不能预览');
						return;
					}

					var img = $('<img src="' + src + '">');
					$wrap.empty().append(img);
				}, thumbnailWidth, thumbnailHeight);

				percentages[file.id] = [file.size, 0];
				file.rotation = 0;
			}

			file.on('statuschange', function(cur, prev) {
//				debugger;
				if(prev === 'progress') {
					$prgress.hide().width(0);
					if (cur === 'complete') {
						$btns.remove();
					}
					
				} else if(prev === 'queued') {
					$li.off('mouseenter mouseleave');
				}

				// 成功
				if(cur === 'error' || cur === 'invalid') {
					console.log(file.statusText);
					showError(file.statusText);
					percentages[file.id][1] = 1;
				} else if(cur === 'interrupt') {
					showError('interrupt');
				} else if(cur === 'queued') {
					percentages[file.id][1] = 0;
				} else if(cur === 'progress') {
					$info.remove();
					$prgress.css('display', 'block');
				} else if(cur === 'complete') {
					$li.append('<span class="success"></span>');
				}

				$li.removeClass('state-' + prev).addClass('state-' + cur);
			});

			$btns.stop().animate({
					height: 25
				});

			$btns.on('click', 'span', function() {
				var index = $(this).index(),
					deg;

				switch(index) {
					case 0:
						uploader.removeFile(file);
						return;

					case 1:
						file.rotation += 90;
						break;

					case 2:
						file.rotation -= 90;
						break;
				}

				if(supportTransition) {
					deg = 'rotate(' + file.rotation + 'deg)';
					$wrap.css({
						'-webkit-transform': deg,
						'-mos-transform': deg,
						'-o-transform': deg,
						'transform': deg
					});
				} else {
					$wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
				}

			});

			$li.appendTo($queue);
		}

		// 负责view的销毁
		function removeFile(file) {
			var $li = $('#' + file.id);

			delete percentages[file.id];
			updateTotalProgress();
			$li.off().find('.file-panel').off().end().remove();
		}

		function updateTotalProgress() {
			var loaded = 0,
				total = 0,
				spans = $progress.children(),
				percent;

			$.each(percentages, function(k, v) {
				total += v[0];
				loaded += v[0] * v[1];
			});

			percent = total ? loaded / total : 0;

			spans.eq(0).text(Math.round(percent * 100) + '%');
			spans.eq(1).css('width', Math.round(percent * 100) + '%');
			updateStatus();
		}

		function updateStatus() {
			var text = '',
				stats;

			if(state === 'ready') {
				text = '选中' + fileCount + '张图片，共' +
					WebUploader.formatSize(fileSize) + '。';
			} else if(state === 'confirm') {
				stats = uploader.getStats();
				if(stats.uploadFailNum) {
					text = '已成功上传' + stats.successNum + '张照片至XX相册，' +
						stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
				}

			} else {
				stats = uploader.getStats();
				text = '共' + fileCount + '张（' +
					WebUploader.formatSize(fileSize) +
					'），已上传' + stats.successNum + '张';

				if(stats.uploadFailNum) {
					text += '，失败' + stats.uploadFailNum + '张';
				}
			}

			$info.html(text);
		}

		function setState(val) {
			var file, stats;

			if(val === state) {
				return;
			}

			$uploadBtn.removeClass('state-' + state);
			$uploadBtn.addClass('state-' + val);
			state = val;

			switch(state) {
				case 'pedding':
					$placeHolder.removeClass('element-invisible');
					$queue.parent().removeClass('filled');
					$queue.hide();
					$statusBar.addClass('element-invisible');
					uploader.refresh();
					break;

				case 'ready':
					$placeHolder.addClass('element-invisible');
					$('#filePicker2').removeClass('element-invisible');
					$queue.parent().addClass('filled');
					$queue.show();
					$statusBar.removeClass('element-invisible');
					uploader.refresh();
					break;

				case 'uploading':
					$('#filePicker2').addClass('element-invisible');
					$progress.show();
					$uploadBtn.text('暂停上传');
					break;

				case 'paused':
					$progress.show();
					$uploadBtn.text('继续上传');
					break;

				case 'confirm':
					$progress.hide();
					$uploadBtn.text('开始上传').addClass('disabled');

					stats = uploader.getStats();
					if(stats.successNum && !stats.uploadFailNum) {
						setState('finish');
						return;
					}
					break;
				case 'finish':
					stats = uploader.getStats();
					if(stats.successNum) {
						alert('上传成功');
					} else {
						// 没有成功的图片，重设
						state = 'done';
						location.reload();
					}
					break;
			}

			updateStatus();
		}

		uploader.onUploadProgress = function(file, percentage) {
			var $li = $('#' + file.id),
				$percent = $li.find('.progress span');

			$percent.css('width', percentage * 100 + '%');
			percentages[file.id][1] = percentage;
			updateTotalProgress();
		};

		uploader.onFileQueued = function(file) {
			fileCount++;
			fileSize += file.size;

			if(fileCount === 1) {
				$placeHolder.addClass('element-invisible');
//				$statusBar.show();
			}

			addFile(file);
//			setState('ready');
			updateTotalProgress();
		};

		uploader.onFileDequeued = function(file) {
			fileCount--;
			fileSize -= file.size;

			if(!fileCount) {
//				setState('pedding');
			}

			removeFile(file);
			updateTotalProgress();

		};

		uploader.on( 'all', function( type ) {
	        if ( type === 'startUpload' ) {
	            state = 'uploading';
	        } else if ( type === 'stopUpload' ) {
	            state = 'paused';
	        } else if ( type === 'uploadFinished' ) {
	            state = 'done';
	        }
	
	        if ( state === 'uploading' ) {
//	            $btn.text('暂停上传');
	        } else {
//	            $btn.text('开始上传');
	        }
	    });
	    
	    
	    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
//		uploader.on('uploadSuccess', function(file) {
//			$('#' + file.id).addClass('upload-state-done');
//		});
	
		uploader.onError = function(code) {
			if ('F_DUPLICATE' == code) {
				alert("请勿上传重复图片");
				return;
			}
			alert('Eroor: ' + code);
		};

//		$uploadBtn.on('click', function() {
//			if($(this).hasClass('disabled')) {
//				return false;
//			}
//
//			if ( state === 'uploading' ) {
//	            uploader.stop();
//	        } else {
//	            uploader.upload();
//	        }
//		});

		$info.on('click', '.retry', function() {
			uploader.retry();
		});

		$info.on('click', '.ignore', function() {
			alert('todo');
		});

		$uploadBtn.addClass('state-' + state);
		updateTotalProgress();
		
		return uploader;
	}

export  default myUpload;