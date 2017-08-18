module.exports = function(app, db, fc) {
	//@	发送客户端js
	var path = '/addons/ant.connect.browser/';
	app.route(path + 'client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.js')
		})
}