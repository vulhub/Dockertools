;(function($, undefined) {
	w2ui['sidebar'].add('ant_setting', {
		id: 'setting_logout',
		text: '注销登录',
		icon: 'fa fa-sign-out',
		onClick: function() {
			var old_sidebar = w2ui['sidebar'].selected;
			w2confirm('确定注销当前用户？', '<i class="fa fa-sign-out"></i> 注销登录', function(btn) {
				if (btn === 'Yes') {
					w2ui['layout'].lock('main', '注销登录中..', true);
					$.post('/addons/ant.setting.logout/logout', {}, function(data) {
						location.reload();
					})
				}else{
					w2ui['sidebar'].click(old_sidebar);
				}
			})
		}
	})
})(jQuery)