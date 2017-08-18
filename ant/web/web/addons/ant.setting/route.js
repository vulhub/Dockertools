module.exports = function(app, db, fc) {
	//@	发送客户端js
	app.route('/addons/ant.setting/client.js')
		.get(function(req, res) {
			res.sendFile(__dirname + '/client.js')
		})
}