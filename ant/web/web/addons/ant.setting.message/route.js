module.exports = function(app, db, fc) {
	app.route('/addons/ant.setting.message/client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.js', true);
		})
}