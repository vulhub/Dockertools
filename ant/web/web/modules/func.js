//
//	函数封装
//
var fs = require('fs')

var FC = {
	//@	判断是否登录
	islogin: function(req, res, success, error) {
		if (req.session.login === true) {
			success(req.session.userinfo)
		}else{
			error ? error() : res.send('// not login!')
		}
	},
	//@	判断是否是管理员
	isadmin: function(req, res, s, e) {
		this.islogin(req, res, function(user) {
			user.isadmin ? s(user) : res.end('// not admin!');
		}, e);
	},
	//@	判断是否购买蚁弹超人
	buyBomb: function(req, res, s, e) {
		this.islogin(req, res, function(user) {
			// user.buy_bomb ? s(user) : e();
			s(user);
		}, e);
	},
	//@	获取IP
	getIP: function(req, str) {
		var _ip = str ? str : req._remoteAddress,
			sip = this.toStr(_ip),
			aip = sip.match(/([0-9]{1,3}\.{1}){3}[0-9]{1,3}/);
		if (aip && aip.length > 0) {
			return aip[0];
		}else{
			return '127.0.0.1';
		}
		// 清除ipv6
		// if (_ip.indexOf(':') >= 0) {
		// 	_ip = _ip[1];
		// }
		// _ip = this.toStr(_ip);
		// //	正则匹配
		// if (_ip.match(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/)) {
		// 	return _ip;
		// }else{
		// 	return '127.0.0.1';
		// }
	},
	//@	转换为字符串
	toStr: function(obj) {
		return typeof(obj) === 'string' ? obj : String(obj || '')
	},
	toInt: function(i) {
		return typeof(i) === 'number' ? i : parseInt(i || 0);
	},
	//@	转换为中文
	toChinese: function(str) {
		var tmp = this.toStr(str).match(/([\u4e00-\u9fa5\w]+)/);
		return tmp ? (tmp[0] || '').substr(0, 10) : '';
	},
	//@	转换为数组
	toArr: function(obj) {
		return typeof(obj) === 'object' ? obj : [String(obj || '')];
	},
	//@	当前时间
	now: function() {
		return new Date().getTime();
	},
	//@	MD5加密
	md5: function(str) {
		var _m = require("crypto").createHash('md5');
		_m.update(str.toString() || '');
		return _m.digest('hex');
	},
	//@	base64
	b64: {
		en: function(str) {
			return new Buffer('base64').toString('base64');
		},
		de: function(str) {
			return new Buffer(str, 'base64').toString();
		}
	},
	//@	安全字符串(字母数字下划线)
	safeStr: function(obj) {
		return (this.toStr(obj).match(/([\w]+)/) || [])[0]
	},
	//	文件缓存
	fileCache: {},
	//	发送文件
	sendFile: function(req, res, path, login) {
		var _file = this.fileCache[path] ? this.fileCache[path] : String(fs.readFileSync(path));
		this.fileCache[path] = _file;
		(path.indexOf('.js') !== -1) ? res.header('Content-Type', 'application/javascript') : null;
		(path.indexOf('.css') !== -1) ? res.header('Content-Type', 'text/css') : null;
		res.send(_file);
		// if (login) {
		// 	this.islogin(req, res, function() {
		// 		res.send(_file);
		// 	}, function() {
		// 		res.send('/* not login! */');
		// 	})
		// }else{
		// 	res.send(_file);
		// }
	}
}

module.exports = FC
