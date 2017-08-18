//
//    ANT:WEB:route.js
//

var db = require("./db")
var fs = require("fs")
var fc = require("./func")
var qn = require("qiniu")

module.exports = function(app, handler) {
    //-    加载插件列表
    var addons = {
        system: [
            'ant.soldier',
            'ant.blog',
            'ant.bomb',
            //=    系统设置
            'ant.setting',
            'ant.setting.config',
            'ant.setting.about',
            'ant.setting.message',
            'ant.setting.payment',
            'ant.setting.user',
            'ant.setting.logout',
            //=    运行环境
            'ant.connect.browser',
            'ant.connect.php',
            'ant.connect.python-ajax',
//            'ant.connect.nodejs-linux',
            //=    其他资源
            'ant.comment',
            'ant.bmenu',
            'ant.notice'
        ],
        admin: [
            //=    后台管理
            'ant.admin',
            'ant.admin.user',
            'ant.admin.soldier',
            'ant.admin.blog',
            'ant.admin.bomb',
        ],
        login: [
            'ant.cache',
            'ant.login.user',
            'ant.login.other'
        ]
    }
    addons.login.forEach(function(i) {
        require('../addons/' + i + '/route.js')(app, db, fc);
    });


    addons.system.forEach(function(i) {
        require('../addons/' + i + '/route.js')(app, db, fc, handler);
    });

    addons.admin.forEach(function(i) {
        require('../addons/' + i + '/route.js')(app, db, fc);
    });
    //-    插件列表
    app.route('/addons')
        .get(function(req, res) {
            fc.islogin(req, res,
            function(user) {
                res.send(user.isadmin ? addons.system.concat(addons.admin) : addons.system)
            },
            function() {
                res.send(addons.login)
            })
        })
    app.route('/')
        .get(function(req, res) {
            res.render('index');
        });
    app.route('/cache')
        .get(function(req, res) {
            res.render('cache');
        });

    app.route('/*')
        .get(function(req, res) {
            res.header('Content-Type', 'text/ant');
            res.status(250).end(
                '// 404'
            )
        })
        .post(function(req, res) {
            res.header('Content-Type', 'text/ant');
            res.status(250).end('// 这不是你的POST');
        })
}
