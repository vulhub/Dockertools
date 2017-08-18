module.exports = function(app, db, fc, handler) {
	var mdb = require('./modules/db')(db),
		udb = db.get('user'),
		path = '/addons/ant.bomb/';
	require('./modules/plugin.js')(app, mdb.plugin, db.get('user'), fc, path);
	require('./modules/project.js')(app, mdb, db.get('user'), fc, path);
	require('./modules/hosts.js')(app, mdb, db.get('user'), fc, path, handler);

	app.route(path + 'client.js')
		.get(function(req, res) {
			fc.buyBomb(req, res, function(user) {
				fc.sendFile(req, res, __dirname + '/client.min.js', true);
			}, function() {
				fc.sendFile(req, res, __dirname + '/buybomb.min.js', true);
			})
		})
	//	购买
	app.route(path + 'buy')
		.post(function(req, res) {
			fc.islogin(req, res, function(user) {
				//	判断用户余额
				udb.findOne({
					_id: user._id
				}, function(err, ret) {
					if (ret) {
						if (ret.coin < 99) {
							//	余额不足
							res.json({
								err: '用户余额不足!',
								ret: false
							});
						}else{
							udb.update({
								_id: ret._id
							}, {$set: {
								coin: ret.coin - 99,
								buy_bomb: true
							}}, function(err1, ret1) {
								if (ret1) {
									req.session.userinfo.buy_bomb = true;
									res.json({
										ret: true,
										err: ''
									});
								}else{
									res.json({
										err: err1,
										ret: false
									})
								}
							})
						}
					}else{
						res.json({
							err: err,
							ret: false
						})
					}
				})
			})
		})
}