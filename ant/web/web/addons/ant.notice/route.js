var mailer = require('../../modules/mail');

module.exports = function(app, db, fc) {
	var ndb = db.init('notice', {
		ctime: Number,		//	公告时间
		title: String,		//	公告标题
		content: String,	//	公告内容
	}),
		udb = db.get('user'),
		path = '/addons/ant.notice/';
	app.route(path + 'client.js')
		.get(function(req, res) {
			fc.sendFile(req, res, __dirname + '/client.js', true);
		})
	app.route(path + 'last')
		.get(function(req, res) {
			fc.islogin(req, res, function(user) {
				ndb.findOne({}).sort({
					ctime: -1
				}).exec(function(err, ret) {
					res.json(ret);
				})
			})
		})
	app.route(path + 'add')
		.post(function(req, res) {
			fc.isadmin(req, res, function(admin) {
				var _title = fc.toStr(req.body.title),
					_content = fc.toStr(req.body.content),
					_sendmail = (fc.toStr(req.body.sendmail) === 'true') ? true : false;
				new ndb({
					ctime: new Date().getTime(),
					title: _title,
					content: _content
				}).save(function(err, ret) {
					res.json({
						err: err,
						ret: ret
					});
					if (!_sendmail) { return false };
					//	通知所有邮箱
					udb.find({
						verify: true
					}, function(err1, ret1) {
						ret1.forEach(function(user) {
							mailer.send({
								to: user.email,
								subject: 'ANT - ' + (_title || '最新通知'),
								html: _content
							})
						})
					})
				})
			})
		})
}