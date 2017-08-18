module.exports = function(app, db, fc) {
    var path = '/addons/ant.admin/',
        adb = db.init('admin', {
            register_on: Boolean,        //    注册开关
            register_msg: String,        //    关闭注册信息
        })

    adb.findOne({}, function(err, ret) {
        if (!ret) {
            new adb({
                register_on: true,
                register_msg: '已关闭注册!'
            }).save(function(){});
        }
    })
    app.route(path + 'client.js')
        .get(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                res.sendFile(__dirname + '/client.min.js');
            })
        })
    app.route(path + 'register/data')
        .get(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                adb.findOne({}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    app.route(path + 'register/save')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                console.log(req.body);
                adb.update({}, {
                    $set: {
                        register_on: fc.toStr(req.body.status) === 'true' ? true : false,
                        register_msg: fc.toStr(req.body.msg)
                    }
                }, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
}