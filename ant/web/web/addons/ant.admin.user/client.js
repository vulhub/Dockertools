;(function($, BAR, LAYOUT) {
    var _style = 'style="width: 80%;"',
        ADDON = {
        ui: {
            //=  用户列表
            grid_admin_user: {
                name: 'grid_admin_user',
                show: {
                    lineNumbers: true,
                    selectColumn: true,
                    footer: true,
                    toolbar: true
                },
                multiSearch: false,
                columns: [
                    { field: '_id', hidden: true, caption: 'ID' },
                    { field: 'email', caption: '邮箱', size: '14%', sortable: true },
                    { field: 'nickname', caption: '昵称', size: '10%', sortable: true },
                    { field: 'verify', caption: '是否验证', size: '10%', sortable: true },
                    { field: 'isadmin', caption: '是否管理', size: '10%', sortable: true, hidden: true },
                    { field: 'buy_bomb', caption: '购买蚁弹超人', size: '10%', sortable: true },
                    { field: 'coin', caption: '蚁币', size: '10%', sortable: true },
                    { field: 'regip', caption: '注册IP', size: '10%', sortable: true },
                    { field: 'regtime', caption: '注册时间', size: '13%', sortable: true },
                    { field: 'loginip', caption: '登录IP', size: '10%', sortable: true },
                    { field: 'logintime', caption: '登录时间', size: '13%', sortable: true }
                ],
                searches: [
                    { field: 'email', caption: '邮箱', type: 'text' },
                    { field: 'nickname', caption: '昵称', type: 'text' },
                    { field: 'verify', caption: '是否验证', type: 'text' },
                    { field: 'isadmin', caption: '是否管理', type: 'text' },
                    { field: 'buy_bomb', caption: '购买蚁弹超人', type: 'text' },
                    { field: 'coin', caption: '蚁币', type: 'text' },
                    { field: 'regip', caption: '注册IP', type: 'text' },
                    { field: 'regtime', caption: '注册时间', type: 'text' },
                    { field: 'loginip', caption: '登录IP', type: 'text' },
                    { field: 'logintime', caption: '登录时间', type: 'text' }
                ],
                onContextMenu: function(event) {
                    var self = this,
                        selected = self.getSelection(),
                        current = self.get(selected[0]),
                        ids = [];
                    selected.forEach(function(i) {
                        ids.push(self.get(i)._id);
                    });
                    $().bmenu([{
                        text: '充值蚁币',
                        icon: 'fa fa-money',
                        disabled: ids.length !== 1,
                        action: function() {
                            ADDON.pay(ids[0]);
                        }
                    }, {
                        divider: true
                    }, {
                        text: '编辑用户',
                        icon: 'fa fa-edit',
                        disabled: ids.length !== 1,
                        action: function() {
                            ADDON.edit(ids[0]);
                        }
                    }, {
                        divider: true
                    }, {
                        text: '删除用户',
                        icon: 'fa fa-trash-o',
                        count: ids.length,
                        disabled: ids.length === 0,
                        action: function() {
                            ADDON.del(ids);
                        }
                    }
                    ], event.originalEvent);
                },
            },
            //- 表单
            form_admin_user: {
                name: 'form_admin_user',
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
                        attr: _style
                    }
                }, {
                    type: 'int',
                    field: 'coin',
                    required: true,
                    html: {
                        caption: '蚁币',
                        attr: _style
                    }
                }, {
                    type: 'password',
                    field: 'password',
                    html: {
                        caption: '更改密码',
                        attr: _style
                    }
                }, {
                    type: 'checkbox',
                    field: 'verify',
                    html: {
                        caption: '是否验证'
                    }
                }, {
                    type: 'checkbox',
                    field: 'isadmin',
                    html: {
                        caption: '是否管理'
                    }
                }, {
                    type: 'checkbox',
                    field: 'buy_bomb',
                    html: {
                        caption: '蚁弹超人'
                    }
                }],
                toolbar: {
                    items: [{
                        id: 'save',
                        type: 'button',
                        icon: 'fa fa-save',
                        caption: '保存'
                    }, {
                        type: 'break'
                    }]
                }
            }
        },
        //= 用户缓存
        cache: null,
        //= 刷新数据
        refresh: function() {
            var self = ADDON;
            !BAR.get('ant_admin').expanded ? BAR.expand('ant_admin') : null;
            LAYOUT.content('main', w2ui['grid_admin_user']);
            if (!self.cache) {
                LAYOUT.lock('main', '获取用户数据中..', true);
                self.cache = {};
                $.get('/addons/ant.admin.user/data', function(ret) {
                    ret.forEach(function(u) {
                        self.cache[u._id] = u;
                    });
                    self.reload();
                })
            }else{
                self.reload();
            }
        },
        //= 刷新UI
        reload: function() {
            var self = this,
                records = [];
            for (var i in self.cache) {
                var user = self.cache[i];
                if (user) {
                    records.push({
                        recid: records.length + 1,
                        _id: user._id,
                        email: w2utils.encodeTags(user.email),
                        nickname: w2utils.encodeTags(user.nickname),
                        verify: user.verify ? '是' : '否',
                        isadmin: user.isadmin ? '是' : '否',
                        buy_bomb: user.buy_bomb ? '是' : '否',
                        coin: user.coin,
                        regip: w2utils.encodeTags(user.regip),
                        regtime: ANT.ftime(user.regtime),
                        loginip: w2utils.encodeTags(user.loginip),
                        logintime: ANT.ftime(user.logintime),
                        style: user.verify ? (user.isadmin ? 'color:rgb(195, 45, 9);background-color:#FBFEC0;' : '') : 'color:rgb(195, 45, 9);'
                    });
                };
            }
            w2ui['grid_admin_user'].records = records;
            w2ui['grid_admin_user'].sort('_id', 'desc');
            w2ui['grid_admin_user'].refresh();
            setTimeout(function() {
                BAR.set('admin_user', {
                    count: records.length
                });
                LAYOUT.unlock('main');
            }, 100);
        },
        //= 编辑用户
        edit: function(id) {
            var self = this,
                user = self.cache[id];
            w2popup.open({
                title: '<i class="fa fa-user"></i> 编辑用户',
                style: 'padding: 0px;',
                modal: true,
                showMax: false,
                width: 600,
                height: 450,
                body: '<div id="admin_user_div" style="width:100%;height:100%;"></div>',
                onOpen: function(event) {
                    event.onComplete = function() {
                        w2ui['form_admin_user'] ? w2ui['form_admin_user'].destroy() : null;
                        $('#admin_user_div').w2form(self.ui.form_admin_user);
                        w2ui['form_admin_user'].record = {
                            email: user.email,
                            nickname: user.nickname,
                            coin: user.coin,
                            verify: user.verify,
                            isadmin: user.isadmin,
                            buy_bomb: user.buy_bomb
                        }
                        w2ui['form_admin_user_toolbar'].onClick = function(e) {
                            if (e.target === 'save') {
                                w2popup.lock('保存用户信息中..', true);
                                var record = w2ui['form_admin_user'].record;
                                $.post('/addons/ant.admin.user/save', $.extend({}, record, {
                                    id: id
                                }), function(data) {
                                    w2popup.unlock();
                                    if (data.err) {
                                        toastr.error('保存失败!<br>' + data.err, 'Error');
                                    }else{
                                        toastr.success('保存成功!', 'Success');
                                        self.cache[id] = $.extend({}, user, record);
                                        self.reload();
                                        w2popup.close();
                                    }
                                })
                            }
                        }
                    }
                }
            })
        },
        //= 删除用户
        del: function(ids) {
            var self = this;
            w2confirm('确定删除所选用户?', function(btn) {
                if (btn !== 'Yes') { return false };
                LAYOUT.lock('main', '删除用户中..', true);
                $.post('/addons/ant.admin.user/del', {
                    ids: ids
                }, function(ret) {
                    LAYOUT.unlock('main');
                    if (!ret.err) {
                        toastr.success('删除成功!', 'Success');
                        ids.forEach(function(i) {
                            delete self.cache[i];
                        });
                        self.reload();
                    }else{
                        toastr.error('删除失败!<br>' + ret.err, 'Error');
                    }
                })
            })
        },
        //= 蚁币充值
        pay: function(id) {
            var self = this;
            w2popup.open({
                title: '<i class="fa fa-money"></i> 充值蚁币',
                modal: true,
                width: 550,
                height: 350,
                style: 'padding: 0',
                body: '<div id="admin_user_pay_div" style="width:100%;height:100;"></div>',
                onOpen: function(event) {
                    event.onComplete = function() {
                        w2ui['admin_user_pay_div'] ? w2ui['admin_user_pay_div'].destroy() : null;
                        $('#admin_user_pay_div').w2form({
                            name: 'admin_user_pay_div',
                            style: 'height:100%;',
                            fields: [{
                                field: 'coin',
                                type: 'int',
                                required: true,
                                html: {
                                    caption: '蚁币',
                                    attr: 'style="width:80%"'
                                }
                            }, {
                                type: 'checkbox',
                                field: 'mail',
                                html: {
                                    caption: '邮件提醒'
                                }
                            }, {
                                type: 'textarea',
                                field: 'why',
                                html: {
                                    caption: '操作原因',
                                    attr: 'rows="10" style="width:80%"'
                                }
                            }],
                            actions: {
                                '充值': function() {
                                    var that = this;
                                    if (that.validate().length === 0) {
                                        w2popup.lock('充值蚁币中..', true);
                                        $.post('/addons/ant.admin.user/pay', $.extend(that.record, {
                                            id: id
                                        }), function(data) {
                                            w2popup.unlock();
                                            if (data.ret) {
                                                toastr.success('充值成功!', 'Success');
                                                w2popup.close();
                                                self.cache[id].coin += parseInt(that.record.coin);
                                                self.reload();
                                            }else{
                                                toastr.error('充值失败!<br>' + data.err, 'Error');
                                            }
                                        })
                                    };
                                }
                            }
                        })
                    }
                }
            })
        }
    }
    //= 初始化
    $().w2grid(ADDON.ui.grid_admin_user);

    BAR.add('ant_admin', {
        id: 'admin_user',
        icon: 'fa fa-user',
        text: '用户管理',
        onClick: function() {
            ADDON.refresh();
        },
        onDblClick: function() {
            delete ADDON.cache;
            ADDON.refresh();
        }
    })
})(jQuery, w2ui['sidebar'], w2ui['layout'])