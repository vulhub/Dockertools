module.exports = function(app, db, fc) {
	var path = '/addons/ant.bmenu/';
	app.route(path + 'client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.js');
		})
	app.route(path + 'client.css')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.css');
		})
}