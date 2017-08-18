module.exports = function(app, db, fc) {
    var path = '/addons/ant.admin.blog/',
        udb = db.get('blog'),
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
                                    subject: 'ANT - 蚁记审核',
                                    html: 'Hi, ' + u.user.nickname + '<br>' +
                                    '很高兴地通知您，您分享的蚁记 《<span style="color:#09F;">' + u.title + '</span>》 已通过审核!<br>感谢您对蚁逅的支持 :)'
                                })
                            })
                        })
                    };
                })
            })
        })
    //  设置
    app.route(path + 'setting')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                udb.update({
                    _id: fc.toStr(req.body.id)
                }, {$set: {
                    title: fc.toStr(req.body.title),
                    category: fc.toStr(req.body.category),
                    desc: fc.toStr(req.body.desc)
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //  保存
    app.route(path + 'save')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                udb.update({
                    _id: fc.toStr(req.body.id)
                }, {$set: {
                    content: fc.toStr(req.body.content)
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
}