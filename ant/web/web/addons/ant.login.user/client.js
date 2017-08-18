//
//  每段路 都有即将要来的旅程
//              -- 《启程》
//

;(function($, undefined) {
    var input_style = 'style="width: 90%;"';
    var ADDON = {
        ui: {
            login_form: {
                name: 'login_form',
                header: '登录',
                fields: [{
                    type: 'email',
                    field: 'email',
                    required: true,
                    html: {
                        caption: '邮箱',
                        attr: input_style
                    }
                }, {
                    type: 'password',
                    field: 'password',
                    required: true,
                    html: {
                        caption: '密码',
                        attr: input_style
                    }
                }],
                toolbar: {
                    items: [{
                        id: 'login',
                        type: 'button',
                        icon: 'fa fa-sign-in',
                        caption: '登录',
                        onClick: function() {
                            var self = w2ui['login_form'];
                            if (self.validate().length === 0) {
                                if (self.record.password.length < 6) {
                                    $('#password').val('').focus();
                                    return ADDON.warning('密码长度不得少于6位!');
                                };
                                ADDON.lock('登录中..')
                                $.post('/addons/ant.login.user/login', self.record, function(data) {
                                    ADDON.unlock();
                                    if (data.ret) {
                                        ADDON.lock('登录成功!跳转中..');
                                        localStorage.setItem('login_user', self.record.email);
                                        setTimeout(function() {
                                            location.reload();
                                        }, 1000);
                                    }else{
                                        ADDON.error('登录失败!<br>' + data.err);
                                        // self.clear();
                                        self.record.password = '';
                                        $('#password').val('').focus();
                                    }
                                })
                            };
                        }
                    }, {
                        type: 'break'
                    }]
                },
                record: {
                    email: localStorage.getItem('login_user') || '',
                    password: ''
                },
                onRender: function(event) {
                    setTimeout(function() {
                        document.getElementById('password').onkeydown = function(e) {
                            if (e.keyCode === 13) {
                                $('#password').blur();
                                w2ui['login_form_toolbar'].click('login');
                            };
                        }
                    }, 200);
                }
            },
            register_form: {
                name: 'register_form',
                header: '注册',
                fields: [
                    {
                        type: 'email',
                        field: 'email',
                        required: true,
                        html: {
                            caption: '邮箱',
                            attr: input_style
                        }
                    }, {
                        type: 'text',
                        field: 'nickname',
                        required: true,
                        html: {
                            caption: '昵称',
                            attr: input_style
                        }
                    }, {
                        type: 'password',
                        field: 'password',
                        required: true,
                        html: {
                            caption: '密码',
                            attr: input_style
                        }
                    }, {
                        type: 'password',
                        field: 'password1',
                        required: true,
                        html: {
                            caption: '重复密码',
                            attr: input_style
                        }
                    }
                ],
                toolbar: {
                    items: [{
                        type: 'button',
                        icon: 'fa fa-user-plus',
                        caption: '注册',
                        onClick: function() {
                            var self = w2ui['register_form'];
                            if (self.validate().length === 0) {
                                if (self.record.password.length < 6) {
                                    $('#password').val('').focus();
                                    return ADDON.warning('密码长度不得少于6位!');
                                };
                                if (self.record.password !== self.record.password1) {
                                    $("#password1").val('').focus();
                                    return ADDON.warning('两次输入的密码不一致!')
                                };
                                ADDON.lock('注册中..')
                                $.post('/addons/ant.login.user/register', self.record, function(data) {
                                    ADDON.unlock();
                                    if (data.ret) {
                                        ADDON.success('注册成功!请登录邮箱验证帐号!');
                                        localStorage.setItem('login_user', self.record.email);
                                        w2ui['sidebar'].click('user_login');
                                    }else{
                                        ADDON.error('注册失败!<br>' + data.err);
                                    }
                                })
                            };
                        }
                    }, {
                        type: 'break'
                    }]
                }
            }
        },
        init: function() {
            $().w2form(this.ui.login_form);
            $().w2form(this.ui.register_form);
            ANT.addonLoaded.reg(function() {
                w2ui['sidebar'].click('user_login');
            })
        }
    };
    ANT.initAddon({
        id: 'ant_user',
        text: '加入蚁逅',
        group: true,
        expanded: true,
        nodes: [{
            id: 'user_login',
            text: '用户登录',
            icon: 'fa fa-user',
            onClick: function() {
                ADDON.content(w2ui['login_form']);
                $('#password').keydown(function(e) {
                    console.log(e.keyCode);
                })
            }
        }, {
            id: 'user_register',
            text: '用户注册',
            icon: 'fa fa-user-plus',
            onClick: function() {
                ADDON.content(w2ui['register_form']);
            }
        }]
    }, ADDON);
})(jQuery)