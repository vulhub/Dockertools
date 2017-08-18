//
//	邮件发送模块
//
var fc = require('./func'),
	nodemailer = require('nodemailer'),
	transport  = require('nodemailer-smtp-transport');

var config = {
	host: process.env.EMAIL_HOST,
	port: parseInt(process.env.EMAIL_PORT),
	name: process.env.EMAIL_NAME,
	email: process.env.EMAIL_SENDER,
	password: process.env.EMAIL_PASSWORD
}

module.exports = {
	_transport: nodemailer.createTransport(transport({
		host: config['host'],
		port: config['port'],
		secure: true,
		auth: {
			user: config['email'],
			pass: config['password']
		}
	})),
	send: function(opt, fn) {
		var _opt = {
			from: config['name'] + '<' + config['email'] + '>',
			to: opt.to,
			subject: opt.subject,
			html: opt.html
		};
		this._transport.sendMail(_opt, fn);
	}
}