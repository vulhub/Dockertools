var qiniu = require("qiniu")

module.exports = function(app, db, fc) {
    var mdb = require('./db')(db),
        path = '/addons/ant.blog/';

    //- 静态资源列表
    app.route(path + 'client.js')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/client.min.js', true);
        })
    app.route(path + 'libs/highlight.js')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/highlight.js');
        })
    app.route(path + 'libs/highlight.css')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/highlight.css');
        })
    app.route(path + 'libs/marked.js')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/marked.min.js');
        })
    app.route(path + 'client.css')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/client.css');
        })
    app.route(path + 'libs/upload.js')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/upload.min.js');
        })
    app.route(path + 'libs/audioplayer.js')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/audioplayer.min.js');
        })
    app.route(path + 'libs/clappr.min.js')
        .get(function(req, res) {
            fc.sendFile(req, res, __dirname + '/libs/clappr.min.js');
        })
    //
    //- 上传
    //
    qiniu.conf.ACCESS_KEY = "SofHVN0BqfeYPQehyKLaf4ssrFpggt-BXHK6u7FG";
    qiniu.conf.SECRET_KEY = "CnXBLygTnuNK7gFkPm8B4p5wYoeCt7SqWeqFul_v";
    var uptoken = new qiniu.rs.PutPolicy("antoor");
    app.route(path + 'uptoken')
        .get(function(req, res) {
            fc.islogin(req, res, function(user) {
                var token = uptoken.token();
                res.header('Cache-Control', 'max-age=0, private, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', 0);
                res.json({
                    uptoken: token
                })
            })
        })
    //
    //- 私人蚁记
    //
    //@ 蚁记数据
    app.route(path + 'private/data')
        .get(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.find({
                    user: user._id
                })
                .sort({
                    ctime: -1
                })
                .exec(function(err, ret) {
                    res.json(ret)
                })
            })
        })
    //@ 添加蚁记
    app.route(path + 'private/add')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                new mdb({
                    user: user._id,
                    title: fc.toStr(req.body.title),
                    category: fc.toChinese(req.body.category),
                    content: '',
                    desc: fc.toStr(req.body.desc),
                    ctime: new Date(),
                    utime: new Date(),
                    public: false,
                    verify: false,
                    view: 0
                }).save(function(err, ret) {
                    res.send({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //@ 删除蚁记
    app.route(path + 'private/del')
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
    //@ 保存蚁记
    app.route(path + 'private/save')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.update({
                    user: user._id,
                    _id: fc.toStr(req.body.id)
                }, {$set: {
                    content: fc.toStr(req.body.content),
                    verify: false,
                    utime: new Date()
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //@ 更改设置
    app.route(path + 'private/set')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.update({
                    user: user._id,
                    _id: fc.toStr(req.body.id)
                }, {$set: {
                    title: fc.toStr(req.body.title),
                    category: fc.toStr(req.body.category) || '默认分类',
                    desc: fc.toStr(req.body.desc),
                    verify: false,
                    utime: new Date()
                }}, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //@ 分享蚁记
    app.route(path + 'private/share')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.update({
                    user: user._id,
                    _id: fc.toStr(req.body.id)
                }, {$set: {
                    public: !!(req.body.share === '1'),
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
    //- 蚁记分享
    //
    //@ 蚁记数据
    app.route(path + 'public/data')
        .get(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.find({
                    public: true,
                    verify: true
                })
                .sort({
                    ctime: -1
                })
                .populate('user', 'nickname')
                .exec(function(err, ret) {
                    var data = [];
                    ret.forEach(function(i) {
                        i.content = null;
                        data.push(i);
                    })
                    res.json(data || []);
                })
            })
        })
    app.route(path + 'public/view')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.findOne({
                    public: true,
                    verify: true,
                    _id: fc.toStr(req.body.id)
                }, function(err, ret) {
                    if (ret) {
                        mdb.update({
                            _id: ret._id
                        }, {$inc: {
                            view: 1
                        }}, function(){})
                    };
                    res.json({
                        err: err,
                        ret: ret
                    })
                })
            })
        })
    //- 收藏蚁记
    app.route(path + 'public/love')
        .post(function(req, res) {
            fc.islogin(req, res, function(user) {
                mdb.findOne({
                    public: true,
                    verify: true,
                    _id: fc.toStr(req.body.id)
                }, function(err, ret) {
                    if (ret) {
                        new mdb({
                            user: user._id,
                            title: ret.title,
                            category: ret.category,
                            content: ret.content,
                            desc: ret.desc,
                            ctime: new Date(),
                            utime: new Date(),
                            public: false,
                            verify: false,
                            view: 0
                        }).save(function(err1, ret1) {
                            res.json({
                                err: err1,
                                ret: ret1
                            })
                        })
                    }else{
                        res.json({
                            err: err,
                            ret: false
                        })
                    }
                })
            })
        })
}