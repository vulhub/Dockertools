//
//  代理连接API
//
;(function($, ANT) {
    //- 连接代理API
    ANT.CONNECT_API = {
        apis: {
            //- 基本操作对象
            //: 用于提供一些基本的函数的封装，比如加密解密函数
            base: {
                //= MD5加密函数
                //: 返回32位MD5
                //@ 参数1     String{str}         要加密的字符串
                md5: function(str) {
                    // var sparkmd5 = new SparkMD5();
                    // sparkmd5.appendBinary(str);
                    // return sparkmd5.end();
                    return hex_md5(String(str || ''));
                },
                //= BASE64加解密
                base64: {
                    //: 解密
                    //@ 参数1     String{str}     要解密的BASE64字符串
                    de: function(str) {
                        return w2utils.base64decode(str);
                    },
                    //: 加密
                    //@ 参数1     String{str}     要加密的字符串
                    en: function(str) {
                        return w2utils.base64encode(str);
                    }
                },
                //= 保存文件到本地
                save: function(fileName, saveData) {
                    var data = new Blob([saveData]),
                        fake = document.createEvent('MouseEvents'),
                        link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                    link.href = (window.URL || window.webkitURL || window).createObjectURL(data);
                    link.download = fileName;
                    fake.initMouseEvent(
                        'click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
                    )
                    link.dispatchEvent(fake);
                }
            },
            //- 桌面提醒
            //: 参数opt = {title:'',body:'',icon:'',click:function(){}}
            notify: function(opt) {
                //= 获取权限
                if (Notification.permission !== 'granted') {
                    Notification.requestPermission();
                };
                //= 生成通知
                var _notify = new Notification(opt.title || '蚁逅提醒', {
                    icon: opt.icon || '/ant/img/logo.png',
                    body: opt.body || '我是一个桌面提醒 :)'
                });
                //= 通知点击事件
                _notify.onclick = function() {
                    _notify.close();
                    opt.click ? opt.click() : null;
                };
                //= 通知播放声音
                var _audio = document.createElement('audio');
                _audio.src = opt.audio || '/ant/res/aaao.mp3';
                _audio.play();
                _audio.remove();
            },
            //- 提示框
            toastr: {
                //= warning 警告框
                //: m = 信息, t = 标题
                w: function(m, t) {
                    toastr.warning(m, t || 'Warning');
                },
                //= info    信息框
                i: function(m, t) {
                    toastr.info(m, t || 'Info');
                },
                //= success 成功信息
                s: function(m, t) {
                    toastr.success(m, t || 'Success');
                },
                //= error   失败信息
                e: function(m, t) {
                    toastr.error(m, t || 'Error');
                }
            },
            //- 调用兵蚁
            loadSoldier: function(id, argv, fn) {
                var soldier = ANT.addons['ant_soldier'].depot.cache[id],
                    UI = function() {
                        return {
                            init: function(opt) {
                                opt.run(argv, fn);
                            }
                        }
                    },
                    plugin = eval(soldier.code.client);
                plugin(new UI, ANT.CONNECT_API.cache[soldier.env], soldier.code.server);
            }
        },
        cache: {},
        temp: {},
        //= 保存到本地
        saveLocal: function(code) {
            localStorage.setItem('setting_config', code);
            return this;
        },
        //= 加载本地配置
        loadLocal: function() {
            var tmp = localStorage.getItem('setting_config'),
                self = this;
            if (tmp) {
                var obj = JSON.parse(tmp);
                for (var o in obj) {
                    if (self.cache[o]) {
                        self.cache[o].config = obj[o];
                    };
                }
            };
            return this;
        },
        //= 删除本地配置
        removeLocal: function() {
            localStorage.removeItem('setting_config');
            return this;
        },
        //= 原始数据
        getData: function(changed) {
            var apis = {},
                temp = changed ? this.cache : this.temp;
            for (var c in temp) {
                apis[c] = temp[c].config;
            }
            return apis;
        },
        //= 加载缓存
        reg: function(name, api) {
            this.temp[name] = $.extend({}, api);
            this.cache[name] = api;
            this.loadLocal();
        }
    };
})(jQuery, window.ANT);