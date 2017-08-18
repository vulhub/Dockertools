//
//  Python代理连接脚本Ajax版
//  地址: https://coding.net/u/medicean/p/ant.runtime.py/git
//  作者: Medici.Yan@gmail.com
//

;(function($, ANT){
    var API = $.extend({}, ANT.CONNECT_API.apis, {
        config: {
            desc: 'Python运行环境脚本ajax版，具体部署请参考项目地址。',
            author: 'Medici.Yan <Medici.Yan@gmail.com>',
            project: 'https://coding.net/u/medicean/p/ant.runtime.py/git',
            server_url: 'http://localhost:8080/',
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
    ANT.CONNECT_API.reg('python-ajax', API);
})(jQuery, ANT)