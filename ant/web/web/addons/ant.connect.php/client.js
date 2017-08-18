;(function($, ANT){
    var API = $.extend({}, ANT.CONNECT_API.apis, {
        config: {
            desc: 'PHP运行环境配置，请通过project地址查看部署以及配置说明！',
            project: 'https://coding.net/u/sec/p/ant.runtime.php/git',
            server_url: 'http://localhost/test/ant.php',
            server_pwd: 'ant'
        },
        connect: function(ok, no, not) {
            var self = this;
            if (self.config.server_url && self.config.server_pwd) {
                $.ajax({
                    url: self.config.server_url,
                    type: 'POST',
                    data: 'pwd=' + self.config.server_pwd + '&act=init',
                    dataType: 'json',
                    success: function(data) {
                        if (data.init && data.init === true) {
                            ok();
                        }else{
                            no(data.data || '未知返回数据!')
                        }
                    },
                    error: function() {
                        no('连接错误!')
                    }
                })
            }else{
                not();
            }
        },
        http: {
            get: function(url, callback) {
                $.post(API.config.server_url, {
                    act: 'http.get',
                    pwd: API.config.server_pwd,
                    url: url
                }, callback)
            },
            post: function(url, data, callback) {
                $.post(API.config.server_url, {
                    act: 'http.post',
                    pwd: API.config.server_pwd,
                    url: url,
                    data: data
                }, callback)
            },
            head: function(url, callback) {
                $.post(API.config.server_url, {
                    act: 'http.head',
                    pwd: API.config.server_pwd,
                    url: url
                }, callback);
            }
        },
        server: {
            exec: function(code, data, callback) {
                $.post(API.config.server_url, {
                    act: 'server.exec',
                    pwd: API.config.server_pwd,
                    code: code,
                    data: data
                }, callback);
            }
        }
    })
    ANT.CONNECT_API.reg(
        'php',
        API
    )
})(jQuery, ANT)