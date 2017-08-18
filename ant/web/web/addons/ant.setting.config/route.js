module.exports = function(app, db, fc) {
	var path = '/addons/ant.setting.config';
	var udb = db.get('user');
	//@	客户端脚本
	app.route(path + '/client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.js', true);
		})

	app.route(path + '/config')
		.get(function(req, res) {
			fc.islogin(req, res, function(user) {
				udb.findOne({
					_id: user._id
				}, function(err, ret) {
					res.json({
						err: err,
						config: ret.config
					})
				})
			})
		})
		.post(function(req, res) {
			fc.islogin(req, res, function(user) {
				udb.update({
					_id: user._id
				}, {$set: {
					config: fc.toStr(req.body.config)
				}}, function(err, ret) {
					res.json({
						err: err,
						ret: ret
					})
				})
			})
		})
}