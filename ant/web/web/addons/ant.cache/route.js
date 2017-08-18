module.exports = function(app, db, fc) {
	app.route('/application.manifest')
		.get(function(req, res) {
			res.header('Content-Type', 'text/plain');
			fc.sendFile(req, res, __dirname + '/application.manifest');
		})
	app.route('/addons/ant.cache/client.js')
		.get(function(req, res) {
			res.end('// :)')
		})
}