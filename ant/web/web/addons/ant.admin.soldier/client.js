;(function($, BAR, LAYOUT) {
    var ADDON = {
        ui: {
            grid_admin_soldier: {
                name: 'grid_admin_soldier',
                show: {
                    lineNumbers: true,
                    selectColumn: true,
                    footer: true,
                    toolbar: true
                },
                multiSearch: false,
                columns: [
                    { field: '_id', hidden: true, caption: 'ID' },
                    { field: 'aid', caption: '兵蚁编号', size: '14%', sortable: true },
                    { field: 'name', caption: '兵蚁大名', size: '10%', sortable: true },
                    { field: 'env', caption: '运行环境', size: '10%', sortable: true },
                    { field: 'user', caption: '兵蚁作者', size: '10%', sortable: true },
                    { field: 'coin', caption: '出售蚁币', size: '10%', sortable: true },
                    { field: 'buy', caption: '购买次数', size: '10%', sortable: true },
                    { field: 'ctime', caption: '创建时间', size: '10%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '13%', sortable: true },
                ],
                searches: [
                    { field: 'aid', caption: '兵蚁编号', type: 'text' },
                    { field: 'name', caption: '兵蚁大名', type: 'text' },
                    { field: 'env', caption: '运行环境', type: 'text' },
                    { field: 'user', caption: '兵蚁作者', type: 'text' },
                    { field: 'coin', caption: '出售蚁币', type: 'text' },
                    { field: 'buy', caption: '购买次数', type: 'text' },
                    { field: 'ctime', caption: '创建时间', type: 'text' },
                    { field: 'utime', caption: '更新时间', type: 'text' }
                ],
                onContextMenu: function(event) {
                    var self = this,
                        selected = self.getSelection(),
                        current = self.get(selected[0]),
                        ids = [];
                    selected.forEach(function(i) {
                        ids.push(self.get(i)._id);
                    });
                    $().bmenu([
                    {
                        text: '编辑兵蚁',
                        icon: 'fa fa-edit',
                        disabled: ids.length !== 1,
                        action: function() {
                            ADDON.edit(ids[0]);
                        }
                    }, {
                        text: '更改设置',
                        icon: 'fa fa-cog',
                        disabled: ids.length !== 1,
                        action: function() {
                            ADDON.setting(ids[0]);
                        }
                    }, {
                        divider: true
                    }, {
                        text: '审核兵蚁',
                        icon: 'fa fa-check-square-o',
                        action: function() {
                            ADDON.verify(ids, true);
                        }
                    }, {
                        text: '取消审核',
                        icon: 'fa fa-remove',
                        action: function() {
                            ADDON.verify(ids, false);
                        }
                    }, {
                        divider: true
                    }, {
                        text: '删除兵蚁',
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
            form_admin_soldier: {
                name: 'form_admin_soldier',
                style: 'height: 100%;border: 0px;background-color: transparent;',
                fields: [
                    {
                        field: 'name',
                        type: 'text',
                        required: true,
                        html: {
                            caption: '兵蚁大名',
                            attr: 'style="width: 90%"'
                        }
                    }, {
                        field: 'coin',
                        type: 'int',
                        required: true,
                        html: {
                            caption: '出售蚁币',
                            attr: 'style="width:90%"'
                        }
                    }, {
                        field: 'desc',
                        type: 'textarea',
                        html: {
                            caption: '简单说明',
                            attr: 'rows="10" style="width: 90%"'
                        }
                    }
                ],
                toolbar: {
                    items: [{
                        id: 'save',
                        type: 'button',
                        caption: '保存',
                        icon: 'fa fa-save'
                    }, {
                        type: 'break'
                    }]
                }
            },
            layout_admin_soldier: {
                name: 'layout_admin_soldier',
                panels: [{
                    size: '100%',
                    type: 'main',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '' +
                    '<div id="layout_admin_soldier_client" class="soldier_editor" style="width: 100%;height:100%;font-size: 14px;"></div>' +
                    '<div id="layout_admin_soldier_server" class="soldier_editor" style="width: 100%;height:100%;font-size: 14px;"></div>',
                    toolbar: {
                        items: [{
                            id: 'save',
                            icon: 'fa fa-save',
                            hint: '[Ctrl || Command] + S',
                            type: 'button',
                            caption: '保存'
                        }, {
                            type: 'break'
                        }],
                    },
                    tabs: {
                        tabs: [{
                            id: 'client',
                            caption: '<i class="fa fa-code"></i> 客户端'
                        }, {
                            id: 'server',
                            caption: '<i class="fa fa-skyatlas"></i> 服务端'
                        }],
                        onClick: function(event) {
                            $('.soldier_editor').hide();
                            $('#layout_admin_soldier_' + event.target).show();
                            ADDON.editor[event.target].resize();
                        }
                    }
                }]
            }
        },
        cache: null,
        editor: {},
        refresh: function() {
            var self = ADDON;
            !BAR.get('ant_admin').expanded ? BAR.expand('ant_admin') : null;
            LAYOUT.content('main', w2ui['grid_admin_soldier']);
            if (!self.cache) {
                LAYOUT.lock('main', '获取兵蚁数据中..', true);
                self.cache = {};
                $.get('/addons/ant.admin.soldier/data', function(ret) {
                    ret.forEach(function(u) {
                        self.cache[u._id] = u;
                    });
                    self.reload();
                })
            }else{
                self.reload();
            }
        },
        reload: function() {
            var self = this,
                records = [];
            for (var i in self.cache) {
                var soldier = self.cache[i];
                if (soldier) {
                    records.push({
                        recid: records.length + 1,
                        _id: soldier._id,
                        aid: 'ant-' + soldier.cms + '-' + soldier.aid,
                        name: w2utils.encodeTags(soldier.name),
                        env: w2utils.encodeTags(soldier.env),
                        user: w2utils.encodeTags(soldier.user ? soldier.user.nickname : '<已删除>'),
                        coin: soldier.coin,
                        buy: soldier.members.length,
                        ctime: ANT.ftime(soldier.ctime),
                        utime: ANT.ftime(soldier.utime),
                        style: soldier.verify ? 'color:green;' : 'color:rgb(195, 45, 9);background-color:#FBFEC0;'
                    });
                };
            }
            w2ui['grid_admin_soldier'].records = records;
            w2ui['grid_admin_soldier'].sort('_id', 'desc');
            w2ui['grid_admin_soldier'].refresh();
            setTimeout(function() {
                BAR.set('admin_soldier', {
                    count: records.length
                });
                LAYOUT.unlock('main');
            }, 100);
        },
        del: function(ids) {
            var self = this;
            w2confirm('确定删除所选兵蚁?', function(btn) {
                if (btn !== 'Yes') { return false };
                LAYOUT.lock('main', '删除兵蚁中..', true);
                $.post('/addons/ant.admin.soldier/del', {
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
        verify: function(ids, verify) {
            var self = this;
            if (verify) {
                w2confirm('确定审核所选兵蚁吗?', function(btn) {
                    if (btn !== 'Yes') { return false };
                    LAYOUT.lock('main', '审核兵蚁中..', true);
                    $.post('/addons/ant.admin.soldier/verify', {
                        ids: ids,
                        verify: true
                    }, function(ret) {
                        LAYOUT.unlock('main');
                        if (!ret.err) {
                            toastr.success('审核成功!', 'Success');
                            ids.forEach(function(i) {
                                self.cache[i].verify = true;
                            });
                            self.reload();
                        }else{
                            toastr.error('审核失败!<br>' + ret.err, 'Error');
                        }
                    })
                })
            }else{
                w2confirm('确定取消审核所选兵蚁吗?', function(btn) {
                    if (btn !== 'Yes') { return false };
                    LAYOUT.lock('main', '取消审核兵蚁中..', true);
                    $.post('/addons/ant.admin.soldier/verify', {
                        ids: ids,
                        verify: false
                    }, function(ret) {
                        LAYOUT.unlock('main');
                        if (!ret.err) {
                            toastr.success('取消审核成功!', 'Success');
                            ids.forEach(function(i) {
                                self.cache[i].verify = false;
                            });
                            self.reload();
                        }else{
                            toastr.error('取消审核失败!<br>' + ret.err, 'Error');
                        }
                    })
                })
            }
        },
        setting: function(id) {
            var self = this,
                soldier = self.cache[id];
            w2popup.open({
                title: '<i class="fa fa-pencil"></i> 更改设置',
                body: '<div id="form_admin_soldier_div" style="width: 100%;height:100%"></div>',
                style : 'padding: 0',
                modal: true,
                width: 550,
                height: 350,
                onOpen: function(event) {
                    event.onComplete = function() {
                        w2ui['form_admin_soldier'] ? w2ui['form_admin_soldier'].destroy() : null;
                        $('#form_admin_soldier_div').w2form(self.ui.form_admin_soldier);
                        w2ui['form_admin_soldier'].record = {
                            name: soldier.name,
                            coin: soldier.coin,
                            desc: soldier.desc
                        }
                        w2ui['form_admin_soldier_toolbar'].onClick = function(e) {
                            if (e.target === 'save') {
                                w2popup.lock('保存兵蚁信息中..', true);
                                var record = w2ui['form_admin_soldier'].record;
                                $.post('/addons/ant.admin.soldier/setting', $.extend({}, record, {
                                    id: id
                                }), function(data) {
                                    w2popup.unlock();
                                    if (data.err) {
                                        toastr.error('保存失败!<br>' + data.err, 'Error');
                                    }else{
                                        toastr.success('保存成功!', 'Success');
                                        self.cache[id] = $.extend({}, soldier, record);
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
        edit: function(id) {
            var self = this,
                soldier = self.cache[id];
            //- 创建窗口
            w2popup.open({
                title: '<i class="fa fa-edit"></i> 编辑兵蚁:<strong class="text-danger">' + w2utils.encodeTags(soldier.name) + '</strong>',
                body: '<div id="layout_admin_soldier_div" style="width: 100%;height: 100%;"></div>',
                style: 'padding: 0;',
                showMax: true,
                modal: true,
                width: 900,
                height: 600,
                onOpen: function(event) {
                    event.onComplete = function() {
                        $("#layout_admin_soldier_div").w2render(w2ui['layout_admin_soldier']);
                        var jsMode = require('ace/mode/javascript').Mode;
                        //- 初始化编辑器:客户端
                        self.editor.client = ace.edit('layout_admin_soldier_client');
                        self.editor.client.setTheme('ace/theme/tomorrow');
                        self.editor.client.session.setMode(new jsMode());
                        self.editor.client.session.setUseWrapMode(true);
                        self.editor.client.session.setValue(soldier.code.client);
                        //- 初始化编辑器:服务端
                        self.editor.server = ace.edit('layout_admin_soldier_server');
                        self.editor.server.setTheme('ace/theme/tomorrow');
                        self.editor.server.session.setUseWrapMode(true);
                        self.editor.server.session.setValue(soldier.code.server);
                        //- 编辑器快捷键
                        [{
                            name: 'saveCmd',
                            bindKey: {
                                win: 'Ctrl-S',
                                mac: 'Command-S'
                            },
                            exec: function(editor) {
                                w2ui['layout_admin_soldier_main_toolbar'].click('save');
                            }
                        }, {
                            name: 'toggleCmd',
                            bindKey: {
                                win: 'Ctrl-M',
                                mac: 'Command-M'
                            },
                            exec: function() {
                                w2popup.toggle();
                            }
                        }].forEach(function(key) {
                            self.editor.client.commands.addCommand(key);
                            self.editor.server.commands.addCommand(key);
                        })
                        //- 工具栏点击事件
                        w2ui['layout_admin_soldier_main_toolbar'].onClick = function(event) {
                            if (event.target === 'save') {
                                var c_c = self.editor.client.getValue();
                                var s_c = self.editor.server.getValue();
                                //- 保存代码
                                w2popup.lock('保存代码中..', true);
                                $.post('/addons/ant.admin.soldier/save', {
                                    id: soldier._id,
                                    client: c_c,
                                    server: s_c
                                }, function(data) {
                                    w2popup.unlock();
                                    if (data.err) {
                                        toastr.error('代码保存失败!<br>' + data.err, 'Error');
                                    }else{
                                        soldier.code = {
                                            client: c_c,
                                            server: s_c
                                        }
                                        toastr.success('代码保存成功!', 'Success');
                                    }
                                })
                            };
                        }
                        w2ui['layout_admin_soldier_main_tabs'].click('client');
                        w2popup.toggle();
                    }
                },
                onToggle: function(event) {
                    event.onComplete = function() {
                        w2ui['layout_admin_soldier'].resize();
                        self.editor.client.resize();
                        self.editor.server.resize();
                    }
                }
            })
        }
    }

    $().w2grid(ADDON.ui.grid_admin_soldier);
    $().w2layout(ADDON.ui.layout_admin_soldier);

    BAR.add('ant_admin', {
        id: 'admin_soldier',
        icon: 'fa fa-coffee',
        text: '兵蚁审核',
        onClick: function() {
            ADDON.refresh();
        },
        onDblClick: function() {
            delete ADDON.cache;
            ADDON.refresh();
        }
    })
})(jQuery, w2ui['sidebar'], w2ui['layout'])