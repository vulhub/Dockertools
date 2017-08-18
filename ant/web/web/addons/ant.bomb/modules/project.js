//
//  蚁弹超人:项目
//
var fs = require('fs');

module.exports = function(app, db, udb, fc, path) {
    //= 项目代码
    // app.route(path + 'project/:uid/:pid')
    app.route('/b/:pid')
        .get(function(req, res) {
            db.project.findOne({
                pid: fc.toInt(req.params.pid)
            }, function(err, ret) {
                res.set('Content-Type', 'application/javascript');
                if (ret) {
                    //= 判断用户是否已经购买bomb
                    udb.findOne({
                        _id: ret.user
                    }, function(err2, ret2) {
                        if (ret2) {
                            // if (ret2.buy_bomb) {
                            if (true) {
                                var _code = fs.readFileSync(__dirname + '/../libs/bomb.core.min.js').toString(),
                                    _reps = {
                                        'PID': ret.pid,
                                        'HOST': req.headers.host
                                    };
                                db.plugin.find({
                                    user: ret.user
                                }, function(err1, ret1) {
                                    //= 循环替换插件代码
                                    ret1.forEach(function(r) {
                                        var _reg = new RegExp('{PLUGIN_' + r._id + '}', 'g'),
                                            _plugin = (r.code.server || '// ').replace(/\n/g, '\n    ');
                                        ret.code = ret.code.replace(_reg, _plugin);
                                    });
                                    _reps['PROJECT'] = ret.code;
                                    //= 循环替换标签
                                    for (var _r in _reps) {
                                        var _reg = new RegExp('#{' + _r + '}', 'g');
                                        _code = _code.replace(_reg, _reps[_r]);
                                    }
                                    res.end(_code);
                                })
                            }else{
                                res.end('// User not authorized!');
                            }
                        }else{
                            res.end('// User not exists');
                        }
                    })
                }else{
                    res.end('// No this project');
                }
            })
        })
    //= 项目数据
    app.route(path + 'project/data')
        .get(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.project.find({
                    user: user._id
                })
                .sort({
                    utime: -1
                })
                .exec(function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //= 添加项目
    app.route(path + 'project/add')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                //= 获取最后的pid
                db.project.findOne({}).sort({
                    ctime: -1
                }).exec(function(err, ret) {
                    var _pid = ret ? (ret.pid || 0) + 1 : 1,
                        _time = fc.now();
                    new db.project({
                        pid: _pid,
                        user: user._id,
                        name: fc.toStr(req.body.name),
                        desc: fc.toStr(req.body.desc),
                        code: '(function(api) {\n})',
                        ctime: _time,
                        utime: _time
                    }).save(function(err, ret) {
                        return res.json({
                            err: err,
                            ret: ret
                        })
                    })
                })
            })
        })
    //= 删除项目
    app.route(path + 'project/del')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.project.remove({
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
    //= 更改设置
    app.route(path + 'project/update')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.project.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id
                }, {$set: {
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
    app.route(path + 'project/save')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.project.update({
                    _id: fc.toStr(req.body.id),
                    user: user._id
                }, {$set: {
                    utime: fc.now(),
                    code: fc.toStr(req.body.code)
                }}, function(err, ret) {
                    return res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
}