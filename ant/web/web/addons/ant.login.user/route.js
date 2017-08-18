var mailer = require('../../modules/mail.js');

module.exports = function(app, db, fc) {
	//@	数据结构
	var mdb = db.init('user', {
		email: String,		//	邮箱
		coin: Number,		//	金币
		isadmin: Boolean,	//	是否管理员
		verify: Boolean,	//	是否验证
		nickname: String,	//	昵称
		password: String,	//	密码
		config: String,		//	运行环境
		regip: String,		//@	注册IP
		regtime: Date,		//@	注册时间
		loginip: String,	//@	登录IP
		logintime: Date,	//@	登录时间
		buy_bomb: Boolean,	//@	是否已经购买蚁弹超人
		// bomb_sendmail: Boolean,		//@	蚁弹超人上线提示
	}),
	path = '/addons/ant.login.user';
	//@	客户端脚本
	app.route(path + '/client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.js');
		})
	//@	登录
	app.route(path + '/login')
		.post(function(req, res) {
			var _email = fc.toStr(req.body.email),
				_passwd = fc.toStr(req.body.password);
			//-	判断邮箱是否存在
			mdb.findOne({
				email: _email
			}, function(err, ret) {
				if (!ret) {
					return res.json({
						err: '邮箱不存在!',
						ret: false
					})
				}else{
					//-	判断用户是否验证
					if (!ret.verify) {
						return res.json({
							err: '帐号未验证!',
							ret: false
						})
					}else{
					//-	判断密码是否正确
						if (ret.password === fc.md5(_passwd)) {
							mdb.update({
								_id: ret._id
							}, {$set: {
								logintime: new Date(),
								loginip: fc.getIP(req)
							}}, function() {
								req.session.login = true;
								req.session.userinfo = ret;
								return res.json({
									ret: true,
									err: false
								})
							});
						}else{
							return res.json({
								ret: false,
								err: '密码错误!'
							})
						}
					}
				}
			})
		})
	//@	注册
	app.route(path + '/register')
		.post(function(req, res) {
			var email = fc.toStr(req.body.email);
			var nickname = fc.toStr(req.body.nickname);
			var password = fc.md5(fc.toStr(req.body.password));
			//-	判断是否允许注册
			var adb = db.get('admin');
			adb.findOne({}, function(err, ret) {
				if (!ret.register_on) {
					return res.json({
						err: ret.register_msg,
						ret: false
					});
				}else{
					//-	判断邮箱是否已经注册
					mdb.findOne({
						email: email
					}, function(err, ret) {
						if (!ret) {
							mdb.findOne({
								nickname: nickname
							}, function(err1, ret1) {
								if (!ret1) {
									//-	开始注册
									new mdb({
										email: email,
										coin: 0,
										isadmin: false,
										verify: false,
										nickname: nickname,
										password: password,
										config: '',
										regip: fc.getIP(req),
										loginip: fc.getIP(req),
										regtime: new Date(),
										logintime: new Date(),
										buy_bomb: false
									}).save(function(err2, ret2) {
										//=	发送验证邮件
										if (ret2) {
											var active_link = 'http://' + req.headers.host + '/addons/ant.login.user/active/' + ret2._id + '/' + fc.md5(ret2._id + ':ant:' + ret2.password);
											mailer.send({
												to: email,
												subject: 'ANT - 蚁逅注册验证',
												html: 'Hi, ' + nickname + '<br>' +
												'欢迎您注册蚁逅，请点击下边链接验证您的帐号，谢谢支持 :)<br>' +
												'<a href="' + active_link + '">' + active_link + '</a>'
											}, function(err, ret) {
												if (err) {
													//	删除帐号= =
													mdb.remove({
														_id: ret2._id
													}, function(e, r) {});
													res.json({
														ret: false,
														err: '邮件发送失败!请尝试更换QQ邮箱或联系蚁逅!'
													});
												}else{
													res.json({
														ret: true
													})
												}
											})
										}else{
											res.json({
												ret: false,
												err: err2
											})
										}
									})
								}else{
									res.json({
										ret: false,
										err: '昵称已经存在!'
									})
								}
							})
						}else{
							res.json({
								ret: false,
								err: '邮箱已经存在!'
							})
						}
					})
				}
			})
		})
	//@	激活
	app.route(path + '/active/:uid/:aid')
		.get(function(req, res) {
			var aid = fc.toStr(req.params.aid),
				uid = fc.toStr(req.params.uid),
				error = function(msg) {
					res.end('<script>alert("' + msg + '");setTimeout(function() {location.href="/"}, 3000);</script>');
				}
			res.header('Content-Type', 'text/html;charset=utf-8');
			mdb.findOne({
				_id: uid
			}, function(err, ret) {
				if (ret) {
					//	判断是否已经激活
					if (ret.verify) {
						return error('用户已激活!');
					};
					if (fc.md5(ret._id + ':ant:' + ret.password) === aid) {
						mdb.update({
							_id: ret._id
						}, {$set: {
							verify: true
						}}, function(err, ret) {
							return error(err ? '激活失败!' : '激活成功!');
						});
					}else{
						error('激活失败!');
					}
				}else{
					error('激活失败!');
				}
			})
		})
}