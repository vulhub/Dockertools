module.exports = function(app, db, fc) {
    var path = '/addons/ant.admin.bomb/',
        udb = db.get('bomb_plugin'),
        mailer = require('../../modules/mail');
    app.route(path + 'client.js')
        .get(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                res.sendFile(__dirname + '/client.min.js');
            })
        })
    //  数据
    app.route(path + 'data')
        .get(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                udb.find({
                    public: true
                }).sort({
                    utime: -1
                }).populate('user', 'nickname').exec(function(err, ret) {
                    res.send(ret);
                })
            })
        })
    //  删除
    app.route(path + 'del')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                udb.remove({
                    _id: {
                        $in: fc.toArr(req.body.ids)
                    }
                }, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //  审核
    app.route(path + 'verify')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                var verify = (req.body.verify === 'true') ? true : false,
                    ids = fc.toArr(req.body.ids);
                udb.update({
                    _id: {
                        $in: ids
                    }
                }, {$set: {
                    verify: verify
                }}, {
                    multi: true
                }, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    });
                    if (ret && verify) {
                        //  发送邮件通知
                        udb.find({
                            _id: {
                                $in: ids
                            }
                        }).populate('user', 'nickname email').exec(function(err1, ret1) {
                            ret1.forEach(function(u) {
                                mailer.send({
                                    to: u.user.email,
                                    subject: 'ANT - 蚁弹超人插件审核',
                                    html: 'Hi, ' + u.user.nickname + '<br>' +
                                    '很高兴地通知您，您在蚁弹超人中发布的插件【' + u.name + '】已通过审核并以' + u.coin + '蚁币进行出售!'
                                })
                            })
                        })
                    };
                })
            })
        })
    //	保存
    app.route(path + 'save')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                udb.update({
                    _id: fc.toStr(req.body.id)
                }, {$set: {
                    code: {
                        client: fc.toStr(req.body.client),
                        server: fc.toStr(req.body.server)
                    }
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //  更新
    app.route(path + 'setting')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                udb.update({
                    _id: fc.toStr(req.body.id)
                }, {$set: {
                    name: fc.toStr(req.body.name),
                    coin: fc.toInt(req.body.coin),
                    desc: fc.toStr(req.body.desc)
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
}