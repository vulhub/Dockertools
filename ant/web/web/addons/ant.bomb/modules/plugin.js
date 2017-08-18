//
//  蚁弹超人:插件
//
var mailer = require('../../../modules/mail.js');
module.exports = function(app, db, udb, fc, path) {
    //
    //@ 私有插件
    //
    //= 添加插件
    app.route(path + 'plugin/private/add')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                new db({
                    user: user._id,
                    name: fc.toStr(req.body.name),
                    desc: fc.toStr(req.body.desc),
                    coin: 0,
                    public: false,
                    verify: false,
                    buys: [],
                    ctime: fc.now(),
                    utime: fc.now(),
                    code: {
                        client: '',
                        server: ''
                    }
                }).save(function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //= 删除插件
    app.route(path + 'plugin/private/del')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.remove({
                    _id: {
                        $in: fc.toArr(req.body.ids)
                    },
                    user: user._id
                }, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //= 插件数据
    app.route(path + 'plugin/private/data')
        .get(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.find({
                    user: user._id
                }, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //= 取消出售
    app.route(path + 'plugin/private/cancel')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id,
                    public: true
                }, {$set: {
                    public: false,
                    verify: false
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //= 出售兵蚁
    app.route(path + 'plugin/private/sell')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id,
                    public: false
                }, {$set: {
                    public: true,
                    verify: false,
                    coin: fc.toInt(req.body.coin)
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //= 更改设置
    app.route(path + 'plugin/private/update')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id
                }, {$set: {
                    verify: false,
                    utime: fc.now(),
                    name: fc.toStr(req.body.name),
                    desc: fc.toStr(req.body.desc)
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //= 保存代码
    app.route(path + 'plugin/private/save')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id
                }, {$set: {
                    verify: false,
                    utime: fc.now(),
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
    //
    //@ 共有插件
    //
    //= 插件数据
    app.route(path + 'plugin/public/data')
        .get(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.find({
                    public: true,
                    verify: true
                })
                .sort({
                    utime: -1
                })
                .populate('user', 'nickname')
                .exec(function(err, ret) {
                    var data = [];
                    ret.forEach(function(i) {
                        i.code = '// I\'M ANT!';
                        data.push(i);
                    });
                    res.json({
                        err: err,
                        ret: data
                    })
                })
            })
        })
    //= 购买插件
    app.route(path + 'plugin/public/buy')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                var _id = fc.toStr(req.body.id);
                var buy = function(obj) {
                    new db({
                        user: user._id,
                        name: obj.name,
                        desc: obj.desc,
                        coin: 0,
                        code: obj.code,
                        public: false,
                        verify: false,
                        buys: [],
                        ctime: fc.now(),
                        utime: fc.now()
                    }).save(function(err1, ret1) {
                        //= 添加购买记录
                        db.update({
                            _id: _id
                        }, {$addToSet: {
                            buys: user._id
                        }}, function() {
                            return res.json({
                                err: err1,
                                ret: ret1
                            })
                        })
                    })
                }
                //= 获取插件数据
                db.findOne({
                    _id: _id,
                    public: true,
                    verify: true
                }).populate('user', 'email nickname coin').exec(function(err, ret) {
                    if (!ret) {
                        return res.json({
                            err: '插件不存在!',
                            ret: false
                        });
                    };
                    //= 判断是否是当前用户
                    if (String(ret.user) === user._id) {
                        return buy(ret);
                    };
                    //= 判断用户是否已经购买过
                    if (ret.buys.indexOf(user._id) !== -1) {
                        return buy(ret);
                    };
                    //= 判断用户金币是否足够购买
                    udb.findOne({
                        _id: user._id
                    }, function(err4, ret4) {
                        if (ret4.coin < ret.coin) {
                            return res.json({
                                ret: false,
                                err: '用户余额不足!'
                            })
                        }else{
                            // user.coin -= ret.coin;
                            udb.update({
                                _id: user._id
                            }, {$inc: {
                                coin: (ret.coin * -1)
                            }}, function(err2, ret2) {
                                buy(ret);
                                //  作者加钱
                                udb.update({
                                    _id: ret.user._id
                                }, {$inc: {
                                    coin: ret.coin
                                }}, function(err3, ret3) {
                                    if (ret.coin <= 0) {
                                        return false;
                                    }
                                    //  通知作者
                                    mailer.send({
                                        to: ret.user.email,
                                        subject: 'ANT - 蚁弹超人插件收入',
                                        html: 'Hi, ' + ret.user.nickname + '<br>' +
                                              '很高兴地通知您，' + user.nickname + ' 购买了您的蚁弹超人插件 (' + ret.name + ') <br>' +
                                              '您为此赚取了 ' + ret.coin + ' 个蚁币!<br>' +
                                              '您当前帐号余额: ' + (ret.user.coin + ret.coin) + ' 蚁币'
                                    });
                                })
                            })
                        }
                    })
                })
            })
        })
}