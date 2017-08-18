module.exports = function(app, db, fc) {
	app.route('/addons/ant.setting.logout/client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.js', true);
		})
	app.route('/addons/ant.setting.logout/logout')
		.post(function(req, res) {
			fc.islogin(req, res, function(user) {
				req.session.login = false;
				delete req.session.userinfo;
				res.end('');
			})
		})
}