module.exports = function(app, db, fc) {
    var mdb = require('./modules/mdb')(db),
        udb = db.get('user'),
        mailer = require('../../modules/mail');
    //@ 当前插件路径
    var path = '/addons/ant.soldier/';
    require('./modules/libs')(app, mdb, fc, path, __dirname);
    //@ 个人仓库列表
    app.route(path + 'depot/data')
        .get(function(req, res) {
            fc.islogin(req, res,
            function(user) {
                mdb.find({
                    user: user._id
                }).sort({
                    ctime: -1
                }).exec(function(err, ret) {
                    res.send(ret);
                })
            })
        })
    //@ 添加
    app.route(path + 'depot/add')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                var cms  = (fc.safeStr(req.body.cms) || 'other'),
                    env  = fc.toStr(req.body.env ? req.body.env.text : 'none'),
                    desc = fc.toStr(req.body.desc),
                    name = fc.toStr(req.body.name);
                mdb.findOne({
                        cms: cms
                    })
                    .sort({
                        aid: -1
                    })
                    .exec(function(err, ret) {
                        var aid = ret ? ret.aid + 1 : 1;
                        // var aid = err ? 0 : (ret ? (ret.aid || 0) : 0);
                        // aid ++;
                        new mdb({
                            user: user._id,
                            // buys: 0,
                            aid: aid,
                            env: env,
                            cms: cms,
                            name: name,
                            desc: desc,
                            code: {
                                client: '',
                                server: ''
                            },
                            coin: 0,
                            ctime: new Date(),
                            utime: new Date(),
                            style: {
                                color: '',
                                bgcolor: ''
                            },
                            sell: false,
                            verify: false,
                            members: []
                        }).save(function(err1, ret1) {
                            res.json({
                                ret: ret1,
                                err: err1
                            })
                        })
                    })
            })
        })
    //@ 删除
    app.route(path + 'depot/del')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.remove({
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
    //@ 保存代码
    app.route(path + 'depot/saveCode')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id
                }, {$set: {
                    code: {
                        client: fc.toStr(req.body.client),
                        server: fc.toStr(req.body.server)
                    },
                    verify: false,
                    utime: new Date()
                }}, function(err) {
                    res.send(err)
                })
            })
        })
    //@ 保存编辑设置
    app.route(path + 'depot/save')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                var id   = fc.toStr(req.body.id),
                    cms  = (fc.safeStr(req.body.cms) || 'other'),
                    env  = fc.toStr(req.body.env ? req.body.env.text : 'none'),
                    desc = fc.toStr(req.body.desc),
                    name = fc.toStr(req.body.name);
                mdb.findOne({
                    _id: id,
                    user: user._id
                }, function(err, ret) {
                    if (ret) {
                        mdb.findOne({
                                cms: cms
                            })
                            .sort({
                                aid: -1
                            })
                            .exec(function(err1, ret1) {
                                var aid = (ret.cms === cms) ? ret.aid : (ret1 ? ret1.aid + 1 : 1);
                                mdb.update({
                                    _id: id,
                                    user: user._id
                                }, {$set: {
                                    aid: aid,
                                    cms: cms,
                                    env: env,
                                    desc: desc,
                                    name: name,
                                    utime: new Date(),
                                    verify: false
                                }}, function(err2, ret2) {
                                    if (ret2) {
                                        mdb.findOne({
                                            _id: id,
                                            user: user._id
                                        }, function(err3, ret3) {
                                            res.json({
                                                ret: ret3,
                                                err: err3
                                            })
                                        })
                                    }else{
                                        res.json({
                                            ret: ret2,
                                            err: err2
                                        })
                                    }
                                })
                            })
                    }else{
                        res.json({
                            ret: false,
                            err: '兵蚁不存在'
                        })
                    }
                })
            })
        })
    //@ 出售
    app.route(path + 'depot/sell')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id
                }, {$set: {
                    coin: parseInt(req.body.coin) || 0,
                    verify: false,
                    // verify: true,
                    sell: true
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //@ 取消出售
    app.route(path + 'depot/cancelsell')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id
                }, {$set: {
                    sell: false,
                    verify: false
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //
    //@ 市场数据
    //
    app.route(path + 'market/data')
        .get(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.find({
                    sell: true,
                    verify: true
                })
                .sort({
                    ctime: -1
                })
                .populate('user', 'nickname')
                .exec(function(err, ret) {
                    var data = [];
                    ret.forEach(function(i) {
                        i.code = '// I\'M ANT!';
                        data.push(i);
                    })
                    res.send(data || []);
                })
            })
        })
    //@ 购买兵蚁
    app.route(path + 'market/buy')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                var _id = fc.toStr(req.body.id);
                var buy = function(obj) {
                    mdb.findOne({
                            cms: obj.cms
                        })
                        .sort({
                            aid: -1
                        })
                        .exec(function(err, ret) {
                            var aid = ret ? ret.aid + 1 : 1;
                            new mdb({
                                user: user._id,
                                // buys: 0,
                                aid: aid,
                                env: obj.env,
                                cms: obj.cms,
                                name: obj.name,
                                desc: obj.desc,
                                code: obj.code,
                                coin: 0,
                                ctime: new Date(),
                                utime: new Date(),
                                style: {
                                    color: '',
                                    bgcolor: ''
                                },
                                sell: false,
                                verify: false,
                                members: []
                            }).save(function(err1, ret1) {
                                //- 添加购买记录
                                mdb.update({
                                    _id: _id
                                }, {$addToSet: {
                                    members: user._id
                                }}, function(){
                                    return res.json({
                                        ret: ret1,
                                        err: err1
                                    })
                                })
                            })
                        })
                }
                //= 获取插件数据
                mdb.findOne({
                    _id: _id,
                    sell: true,
                    verify: true
                }).populate('user', 'email nickname coin').exec(function(err, ret) {
                    if (!ret) {
                        return res.json({
                            err: '兵蚁不存在!',
                            ret: false
                        });
                    };
                    //= 判断是否是当前用户
                    if (String(ret.user) === user._id) {
                        return buy(ret);
                    };
                    //= 判断用户是否已经购买过
                    if (ret.members && ret.members.indexOf(user._id) !== -1) {
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
                                        subject: 'ANT - 兵蚁出售收入',
                                        html: 'Hi, ' + ret.user.nickname + '<br>' +
                                              '很高兴地通知您，' + user.nickname + ' 购买了您出售的兵蚁 【<span style="color:#09F">' + ret.name + '</span>】<br>' +
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