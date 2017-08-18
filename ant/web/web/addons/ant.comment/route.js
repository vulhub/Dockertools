module.exports = function(app, db, fc) {
	var path = '/addons/ant.comment/';
	app.route(path + 'client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.js');
		})
	app.route(path + 'client.css')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.css');
		})
	app.route(path + 'duoshuo.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/duoshuo.js');
		})
}