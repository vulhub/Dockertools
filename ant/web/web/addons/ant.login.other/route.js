var mailer = require('../../modules/mail.js');

module.exports = function(app, db, fc) {
	var path = '/addons/ant.login.other',
		mdb = db.get('user');
	//@	客户端脚本
	app.route(path + '/client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.min.js');
		})
	app.route(path + '/findpwd')
		.post(function(req, res) {
			//=	判断用户
			var _nickname = fc.toStr(req.body.nickname),
				_email = fc.toStr(req.body.email);
			mdb.findOne({
				email: _email
			}, function(err, ret) {
				if (ret) {
					if (ret.nickname === _nickname) {
						//=	发送更改密码邮件
						var _link = 'http://' + req.headers.host + '/addons/ant.login.other/findpwd/' + ret._id + '/' + fc.md5(ret._id + ':findpwd:' + ret.password);
						mailer.send({
							to: ret.email,
							subject: 'ANT-蚁逅密码找回',
							html: 'Hi, ' + ret.nickname + '<br>' +
							'找回密码，请点击下边的链接确认。<br>' +
							'如果不是您本人操作的，请忽略 :)<br>' +
							'<a href="' + _link + '">' + _link + '</a>'
						}, function(err1, ret1) {
							res.json({
								err: '找回失败!请联系管理员!',
								ret: err1 ? false : true
							})
						})
					}else{
						res.json({
							err: '昵称不正确!',
							ret: false
						})
					}
				}else{
					res.json({
						err: '用户不存在!',
						ret: false
					})
				}
			})
		})
	//	重置密码
	app.route(path + '/findpwd/:uid/:fid')
		.get(function(req, res) {
			var uid = fc.toStr(req.params.uid),
				fid = fc.toStr(req.params.fid),
				error = function(msg) {
					res.end('<script>alert("' + msg + '");location.href="/";</script>');
				}
			res.header('Content-Type', 'text/html;charset=utf-8');
			mdb.findOne({
				_id: uid
			}, function(err, ret) {
				if (ret) {
					//	是否激活
					if (!ret.verify) {
						return error('用户未激活!');
					};
					//	是否验证
					if (fc.md5(ret._id + ':findpwd:' + ret.password) === fid) {
						//	重置密码
						var _pwd = fc.md5(String(new Date().getTime()) + ret.password).substr(0, 8);
						mdb.update({
							_id: ret._id
						}, {$set: {
							password: fc.md5(_pwd)
						}}, function(err1, ret1) {
							if (err1) {
								error('重置密码失败!');
							}else{
								res.header('Content-Type', 'text/pwd;charset=utf-8');
								res.status(520).end('// 重置密码成功!\n// 您的新密码为：' + _pwd + '\n// 请登录后尽快修改您的密码!')
							}
						})
					}else{
						return error('密码已重置过!');
					}
				}else{
					error('用户不存在!');
				}
			})
		})
}