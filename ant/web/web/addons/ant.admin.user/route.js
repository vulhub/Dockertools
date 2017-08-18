var mailer = require('../../modules/mail.js');

module.exports = function(app, db, fc) {
    var path = '/addons/ant.admin.user/',
        udb = db.get('user');

    app.route(path + 'client.js')
        .get(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                res.sendFile(__dirname + '/client.min.js');
            })
        })
    //  用户数据
    app.route(path + 'data')
        .get(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                udb.find({}, function(err, ret) {
                    res.json(ret);
                })
            })
        })
    //  充值蚁币
    app.route(path + 'pay')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                var coin = fc.toInt(req.body.coin),
                    mail = fc.toInt(req.body.mail),
                    why = fc.toStr(req.body.why),
                    _id = fc.toStr(req.body.id);
                udb.update({
                    _id: _id
                }, {$inc: {
                    coin: coin
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                    if (ret && mail === 1) {
                        udb.findOne({
                            _id: _id
                        }, function(err1, ret1) {
                            var msg = '';
                            //  扣除金币？
                            if (coin < 0) {
                                msg = '扣除了 ' + (coin * -1) + ' 个蚁币!';
                            }else{
                                msg = '充值了 ' + coin + ' 个蚁币!';
                            }
                            //  操作原因
                            msg += why ? ('<br>操作说明: ' + why) : '';
                            msg += '<br>当前余额: ' + ret1.coin + ' 蚁币';
                            //  发送邮件
                            mailer.send({
                                to: ret1.email,
                                subject: 'ANT - 蚁币提醒',
                                html: 'Hi, ' + ret1.nickname + '<br>蚁逅为您' + msg
                            });
                        })
                    };
                })
            })
        })
    //  删除用户
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
    //  保存用户信息
    app.route(path + 'save')
        .post(function(req, res) {
            fc.isadmin(req, res, function(admin) {
                var obj = {
                    email: fc.toStr(req.body.email),
                    nickname: fc.toStr(req.body.nickname),
                    coin: fc.toInt(req.body.coin),
                    verify: (req.body.verify === 'true') ? true : false,
                    isadmin: (req.body.isadmin === 'true') ? true : false,
                    buy_bomb: (req.body.buy_bomb === 'true') ? true : false
                }
                req.body.password ? obj['password'] = fc.md5(fc.toStr(req.body.password)) : null;
                udb.update({
                    _id: fc.toStr(req.body.id)
                }, {
                    $set: obj
                }, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
}