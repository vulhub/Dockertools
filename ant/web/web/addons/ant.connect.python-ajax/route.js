module.exports = function(app, db, fc) {
	//@	发送客户端js
	var path = '/addons/ant.connect.python-ajax/';
	app.route(path + 'client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.js', true);
		})
}