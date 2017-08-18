;(function($) {
	var GET_NOTICE = function() {
		$.get('/addons/ant.notice/last', function(data) {
			if (!data) { return false };
			var _log = localStorage.getItem('ant_notice');
			if (_log !== String(data.ctime)) {
				w2alert(data.content, '<i class="fa fa-bell-o"></i> ' + data.title, null);
				localStorage.setItem('ant_notice', data.ctime);
			}
		});
	}
	GET_NOTICE();
	setInterval(GET_NOTICE, 1000 * 60 * 30);
})(jQuery)