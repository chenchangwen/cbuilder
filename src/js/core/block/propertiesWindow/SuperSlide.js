(function() {
	/* 图片窗口 */
	var view = {
		/* dom缓存 */
		_domCache: function() {
			var str1 = 'cb-superslide-picker';
			commons.setObjVariable(view, str1, 'cb-superslide-');
		},
		_build: function() {
			view.$picker.bind('click', function() {
				var $picker = $('#Picker');
				if (!$picker.length) {
					$picker = $('<div class="modal fade" id="Picker"></div>');
					$(document.body).append($picker);
				}
				$picker = $picker.picker('multi_picture', {
					title: '多图片选择',
					confirm_text: '确定',
					cancel_text: '取消',
					folder_method: 'post',
					folder_url: '/service/image/getFolder',
					image_method: 'post',
					image_url: '/service/image/getImages',
					rows: 8,
					onComplete: function(selected) {
						var $slider = $.cbuilder.propertiesWindow.$selectedobj;
						var $bd = $('<div class="bd"></div>');
						var $ul = $('<ul></ul>');
						$bd.append($ul);
						for (var i = 0, l = selected.length; i < l; i++) {
							$ul.append('<li><a href="#" target="_blank"><img src="' + selected[i].src + '" /></a></li>');
						}
						$slider.html('').append($bd);
						$slider.append('<a class="prev" href="javascript:void(0)"></a>');
						$slider.append('<a class="next" href="javascript:void(0)"></a>');
						$slider.slide({
							mainCell: ".bd ul",
							effect: 'left',
							autoPlay: true,
							mouseOverStop: true
						});
						$picker.modal('hide');
					}
				});
				$picker.modal('show');
			});
		},
		_struc: function() {
			commons.objectCallFunction(view, '_domCache', '_build');
		}
	};
	view._struc();
})();