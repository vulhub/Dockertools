;(function($) {
    var input_style = 'style="width: 90%;"',
    _html = '<div id="setting_about" style="font-size: 16px;">' +
            '    <div>' +
            '       <h3 style="padding: 9px 0;" class="text-success">蚁逅介绍</h3>' +
            '        <p style="line-height:24px;">如果，你厌烦了一个个看着实用却零零散散的小工具堆满了硬盘各个角落；<br>如果，你想一站式方便快速地调用以及简单有趣地编写属于你自己的工具；<br>如果，你有更好的想法并努力地去寻找如何实现，<br>那么，这里也许能成为你的驿站，助你找到灵感、快乐与方向。</p>' +
            '        <p style="line-height:24px;">这里就是ANT，我们一直在努力！</p>' +
            '       <h3 style="padding: 5px 0;" class="text-info">联系我们</h3>' +
            '        <p style="line-height:24px;">交流群: <a target="_blank" href="http://shang.qq.com/wpa/qunwpa?idkey=9012d6bc8d334ca0afa9a1154d50c8499b823dc768b81940ff7f7e7028d34ba4">130611633</a><br>微博: <a href="http://weibo.com/antoor" target="_blank">http://weibo.com/antoor</a></p>' +
            '       <h3 style="padding: 5px 0;" class="text-danger">免责声明</h3>' +
            '        <p style="line-height:24px;">本站仅提供一个学习与交流的平台，请勿用于其他非法用途，否则删除帐号并自行承担由此带来的风险！</p>' +
            '    </div>' +
            '</div>';
    var ADDON = {
        ui: {
            findpwd_form: {
                name: 'findpwd_form',
                header: '找回密码',
                fields: [{
                    type: 'text',
                    field: 'nickname',
                    required: true,
                    html: {
                        caption: '注册昵称',
                        attr: input_style
                    }
                }, {
                    type: 'email',
                    field: 'email',
                    required: true,
                    html: {
                        caption: '邮箱地址',
                        attr: input_style
                    }
                }],
                record: {
                    email: localStorage.getItem('login_user')
                },
                toolbar: {
                    items: [{
                        type: 'button',
                        caption: '找回',
                        icon: 'fa fa-send-o',
                        onClick: function() {
                            var self = w2ui['findpwd_form'];
                            if (self.validate().length === 0) {
                                ADDON.lock('找回中..')
                                $.post('/addons/ant.login.other/findpwd', self.record, function(data) {
                                    ADDON.unlock();
                                    if (data.ret) {
                                        ADDON.success('找回成功!<br>请登录邮箱验证重置!');
                                        w2ui.sidebar.click('user_login')
                                    }else{
                                        ADDON.error('找回失败!<br>' + data.err);
                                    }
                                })
                            };
                        }
                    }, {
                        type: 'break'
                    }]
                }
            },
            about_form: {
                name: 'about_form',
                header: '关于蚁逅',
                formHTML: _html,
                toolbar: {
                    items: [{
                        type: 'button',
                        caption: '微博',
                        icon: 'fa fa-weibo',
                        onClick: function() {
                            window.open('http://weibo.com/antoor', '_blank');
                        }
                    }]
                }
            }
        },
        init: function() {
            $().w2form(this.ui.findpwd_form);
            $().w2form(this.ui.about_form);
        }
    };

    ANT.initAddon({
        id: 'ant_other',
        text: '其他操作',
        group: true,
        expanded: true,
        nodes: [{
            id: 'other_findpwd',
            text: '找回密码',
            icon: 'fa fa-eye',
            onClick: function() {
                ADDON.content(w2ui['findpwd_form']);
            }
        }, {
            id: 'other_about',
            text: '关于蚁逅',
            icon: 'fa fa-heart',
            onClick: function() {
                ADDON.content(w2ui['about_form']);
            }
        }]
    }, ADDON);

    ANT.addonLoaded.reg(function() {
        ANT.ROUTE.run();
    })
})(jQuery);