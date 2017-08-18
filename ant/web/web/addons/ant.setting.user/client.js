//
//  爱是不是 不开口才珍贵
//      -- 《最长的电影》
//

;(function($, undefined) {
    var _style = 'style="width: 80%;"';
    var ADDON = {
        //- 用户信息缓存
        cache: null,
        reload: function() {
            w2ui['setting_user_form'].record = {
                nickname: this.cache.nickname,
                email: this.cache.email,
                coin: this.cache.coin,
                loginip: this.cache.loginip,
                logintime: new Date(this.cache.logintime).toLocaleString()
            }
            w2ui['setting_user_form'].refresh();
        },
        //- 表单
        form: {
            name: 'setting_user_form',
                fields: [{
                    type: 'text',
                    field: 'nickname',
                    required: true,
                    html: {
                        caption: '昵称',
                        attr: _style
                    }
                }, {
                    type: 'email',
                    field: 'email',
                    required: true,
                    html: {
                        caption: '邮箱',
                        attr: _style + ' disabled'
                    }
                }, {
                    type: 'text',
                    field: 'coin',
                    html: {
                        caption: '蚁币',
                        attr: _style + ' disabled'
                    }
                }, {
                    type: 'text',
                    field: 'loginip',
                    html: {
                        caption: '上次登录IP',
                        attr: _style + ' disabled'
                    }
                }, {
                    type: 'text',
                    field: 'logintime',
                    html: {
                        caption: '上次登录时间',
                        attr: _style + ' disabled'
                    }
                }, {
                    type: 'password',
                    field: 'password',
                    html: {
                        caption: '更改密码',
                        attr: _style
                    }
                }, {
                    type: 'password',
                    field: 'password1',
                    required: true,
                    html: {
                        caption: '旧密码',
                        attr: _style
                    }
                }],
                toolbar: {
                    items: [{
                        type: 'button',
                        icon: 'fa fa-save',
                        caption: '保存',
                        onClick: function() {
                            if (w2ui['setting_user_form'].validate().length === 0) {
                                var pwd = w2ui['setting_user_form'].record.password,
                                    pwd1 = w2ui['setting_user_form'].record.password1;
                                if (pwd.length > 0 && pwd.length < 6) {
                                    return toastr.warning('密码长度太短啦!至少6位嘛!', 'Warning');
                                }else{
                                    w2popup.lock('保存用户信息中..', true);
                                    $.post('/addons/ant.setting.user/data', w2ui['setting_user_form'].record, function(data) {
                                        w2popup.unlock();
                                        if (!data.err) {
                                            w2popup.close();
                                            toastr.success('保存成功!', 'Success');
                                            ADDON.cache = data.ret;
                                        }else{
                                            toastr.error('保存失败!<br/>' + data.err, 'Error');
                                        }
                                    })
                                }
                            }else{
                                toastr.warning('请填写必选项!', 'Warning');
                            }
                        }
                    }, {
                        type: 'break'
                    }]
                }
        }
    }
    w2ui['sidebar'].add('ant_setting', {
        id: 'setting_user',
        text: '用户设置',
        icon: 'fa fa-user',
        onClick: function() {
            var old_sidebar = w2ui['sidebar'].selected;
            w2popup.open({
                title: '<i class="fa fa-user"></i> 用户设置',
                style: 'padding: 0px;',
                modal: true,
                showMax: false,
                width: 600,
                height: 450,
                body: '<div id="setting_user_div" style="width:100%;height:100%;"></div>',
                onOpen: function(event) {
                    event.onComplete = function() {
                        w2ui['setting_user_form'] ? w2ui['setting_user_form'].destroy() : null;
                        $('#setting_user_div').w2form(ADDON.form);
                        // if (!ADDON.cache) {
                            w2popup.lock('加载用户信息中..', true);
                            $.get('/addons/ant.setting.user/data', function(data) {
                                w2popup.unlock();
                                if (!data.err) {
                                    ADDON.cache = data.ret;
                                    toastr.success('获取用户信息成功!', 'Success');
                                    ADDON.reload();
                                }else{
                                    toastr.error('获取用户信息失败!<br>' + data.err, 'Error');
                                    w2popup.close();
                                }
                            })
                        // }else{
                        //     ADDON.reload();
                        // }
                    }
                },
                onClose: function(event) {
                    w2ui['sidebar'].click(old_sidebar);
                }
            })
        }
    })
})(jQuery)