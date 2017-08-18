module.exports = function(app, db, fc) {
	var udb = db.get('user');

	app.route('/addons/ant.setting.user/client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.js', true);
		})
	app.route('/addons/ant.setting.user/data')
		.get(function(req, res) {
			fc.islogin(req, res, function(user) {
				udb.findOne({
					_id: user._id
				}, function(err, ret) {
					res.json({
						err: err,
						ret: ret
					})
				})
			})
		})
		.post(function(req, res) {
			fc.islogin(req, res, function(user) {
				var nickname = fc.toStr(req.body.nickname),
					password = fc.toStr(req.body.password).length >= 6 ? fc.md5(fc.toStr(req.body.password)) : user.password,
					password1 = fc.md5(fc.toStr(req.body.password1));
				// 判断原密码是否正确
				if (password1 !== user.password) {
					return res.json({
						err: '原密码不正确!',
						ret: false
					});
				}else if (nickname === user.nickname) {
					//	只更改密码
					udb.update({
						_id: user._id
					}, {$set: {
						password: password
					}}, function(err, ret) {
						res.json({
							err: err,
							ret: user
						})
					});
				}else{
					//	判断昵称是否存在
					udb.findOne({
						nickname: nickname
					}, function(err, ret) {
						if (ret) {
							res.json({
								err: '昵称已存在!',
								ret: false
							})
						}else{
							udb.update({
								_id: user._id
							}, {$set: {
								nickname: nickname,
								password: password
							}}, function(err, ret) {
								user.nickname = nickname;
								user.password = password;
								res.json({
									err: err,
									ret: user
								})
							})
						}
					})
				}
			})
		})
}