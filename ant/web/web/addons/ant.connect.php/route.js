module.exports = function(app, db, fc) {
	//@	发送客户端js
	var path = '/addons/ant.connect.php/';
	app.route(path + 'client.js')
		.get(function(req, res) {
			fc.islogin(req, res, function() {
				res.sendFile(__dirname + '/client.js')
			})
		})
}