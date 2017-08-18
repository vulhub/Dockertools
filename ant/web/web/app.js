//
//	ANT - 蚁逅
//

var route   = require("./modules/route"),
	logger  = require("morgan"),
	mailer  = require("./modules/mail"),
	express = require("express"),
	bparser = require("body-parser"),
	session = require("express-session");

//	初始化express
var app = express()
//	静态资源路径
app.use(express.static(__dirname + '/bower_components'))
//	web日志
app.use(logger('default'))
//	设置模版路径
app.set('views', __dirname + '/views')
//	设置模版引擎
app.set('view engine', 'jade')
//	设置session
app.use(session({
	secret: process.env.SECRET_KEY,
	key: 'ANT',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 10,
		httpOnly: true,
		path: '/'
	},
	saveUninitialized: false,
	resave: false
}))
//	解析数据包
app.use(bparser.json())
app.use(bparser.urlencoded({
	extended: true
}))

//	监听端口
var port = process.env.PORT || 3000

//	设置web路由
route(app, app.listen(port));
//app.listen(port);
console.log('[*] ANT listen on port -> ' + port)
// mailer.send({
// 	to: 'i@root.cool',
// 	subject: 'ANT - 服务启动通知',
// 	html: '通知主人，ANT服务已启动!'
// })
