;(function($, BAR, LAYOUT) {
    var ADDON = {
        ui: {
            grid_admin_bomb: {
                name: 'grid_admin_bomb',
                show: {
                    lineNumbers: true,
                    selectColumn: true,
                    footer: true,
                    toolbar: true,
                    expandColumn: true
                },
                multiSearch: false,
                columns: [
                    { field: '_id', hidden: true, caption: 'ID' },
                    { field: 'name', caption: '插件名称', size: '30%', sortable: true },
                    { field: 'user', caption: '插件作者', size: '10%', sortable: true },
                    { field: 'coin', caption: '出售蚁币', size: '10%', sortable: true },
                    { field: 'verify', caption: '是否审核', size: '10%', sortable: true },
                    { field: 'ctime', caption: '创建时间', size: '15%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                records: [],
                searches: [
                    { field: 'name', caption: '插件名称', type: 'text' },
                    { field: 'user', caption: '插件作者', type: 'text' },
                    { field: 'coin', caption: '出售蚁币', type: 'text' },
                    { field: 'verify', caption: '是否审核', type: 'text' },
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
                        text: '编辑插件',
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
                        text: '审核插件',
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
                        text: '删除插件',
                        icon: 'fa fa-trash-o',
                        count: ids.length,
                        disabled: ids.length === 0,
                        action: function() {
                            ADDON.del(ids);
                        }
                    }
                    ], event.originalEvent);
                }
            },
            layout_admin_bomb_edit: {
                name: 'layout_admin_bomb_edit',
                panels: [{
                    size: '100%',
                    type: 'main',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '' +
                    '<div id="layout_admin_bomb_edit_client" class="bomb_editor" style="width: 100%;height:100%;font-size: 14px;"></div>' +
                    '<div id="layout_admin_bomb_edit_server" class="bomb_editor" style="width: 100%;height:100%;font-size: 14px;"></div>',
                    resizable: true,
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
                            $('.bomb_editor').hide();
                            $('#layout_admin_bomb_edit_' + event.target).show();
                            ADDON.editor[event.target].resize();
                        }
                    }
                }]
            },
            form_admin_bomb_setting: {
                name: 'form_admin_bomb_setting',
                style: 'height: 100%;border: 0px;background-color: transparent;',
                fields: [
                    {
                        field: 'name',
                        type: 'text',
                        required: true,
                        html: {
                            caption: '插件名称',
                            attr: 'style="width: 250px"'
                        }
                    }, {
                        field: 'coin',
                        type: 'int',
                        required: true,
                        html: {
                            caption: '出售蚁币',
                            attr: 'style="width: 250px;"'
                        }
                    }, {
                        field: 'desc',
                        type: 'textarea',
                        html: {
                            caption: '插件简介',
                            attr: 'rows="8" style="width: 250px;"'
                        }
                    }
                ]
            },
        },
        cache: null,
        editor: {},
        refresh: function() {
            var self = this;
            !BAR.get('ant_admin').expanded ? BAR.expand('ant_admin') : null;
            LAYOUT.content('main', w2ui['grid_admin_bomb']);
            if (!self.cache) {
                LAYOUT.lock('main', '获取插件数据中..', true);
                self.cache = {};
                $.get('/addons/ant.admin.bomb/data', function(ret) {
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
                var bomb = self.cache[i];
                if (bomb) {
                    records.push({
                        recid: records.length + 1,
                        _id: bomb._id,
                        name: w2utils.encodeTags(bomb.name),
                        user: w2utils.encodeTags(bomb.user ? bomb.user.nickname : '<已删除>'),
                        coin: bomb.coin,
                        verify: bomb.verify ? '是' : '否',
                        ctime: ANT.ftime(bomb.ctime),
                        utime: ANT.ftime(bomb.utime),
                        style: bomb.verify ? '' : 'color:rgb(195, 45, 9);background-color:#FBFEC0;'
                    });
                };
            }
            w2ui['grid_admin_bomb'].records = records;
            w2ui['grid_admin_bomb'].sort('_id', 'desc');
            w2ui['grid_admin_bomb'].refresh();
            setTimeout(function() {
                BAR.set('admin_bomb', {
                    count: records.length
                });
                LAYOUT.unlock('main');
            }, 100);
        },
        del: function(ids) {
            var self = this;
            w2confirm('确定删除所选插件?', function(btn) {
                if (btn !== 'Yes') { return false };
                LAYOUT.lock('main', '删除插件中..', true);
                $.post('/addons/ant.admin.bomb/del', {
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
                w2confirm('确定审核所选插件吗?', function(btn) {
                    if (btn !== 'Yes') { return false };
                    LAYOUT.lock('main', '审核插件中..', true);
                    $.post('/addons/ant.admin.bomb/verify', {
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
                w2confirm('确定取消审核所选插件吗?', function(btn) {
                    if (btn !== 'Yes') { return false };
                    LAYOUT.lock('main', '取消审核插件中..', true);
                    $.post('/addons/ant.admin.bomb/verify', {
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
        edit: function(id) {
            var self = this,
                plugin = self.cache[id];
            w2popup.open({
                title: '<i class="fa fa-edit"></i> 编辑插件:<strong class="text-danger">' + w2utils.encodeTags(plugin.name) + '</strong>',
                body: '<div id="layout_admin_bomb_edit_div" style="width: 100%;height: 100%;"></div>',
                style: 'padding: 0;',
                showMax: true,
                modal: true,
                width: 900,
                height: 600,
                onOpen: function(event) {
                    event.onComplete = function() {
                        $("#layout_admin_bomb_edit_div").w2render(w2ui['layout_admin_bomb_edit']);
                        var jsMode = require('ace/mode/javascript').Mode;
                        //- 初始化编辑器:客户端
                        self.editor.client = ace.edit('layout_admin_bomb_edit_client');
                        self.editor.client.setTheme('ace/theme/tomorrow');
                        self.editor.client.session.setMode(new jsMode());
                        self.editor.client.session.setUseWrapMode(true);
                        self.editor.client.session.setValue(plugin.code.client);
                        //- 初始化编辑器:服务端
                        self.editor.server = ace.edit('layout_admin_bomb_edit_server');
                        self.editor.server.setTheme('ace/theme/tomorrow');
                        self.editor.server.session.setMode(new jsMode());
                        self.editor.server.session.setUseWrapMode(true);
                        self.editor.server.session.setValue(plugin.code.server);
                        //- 编辑器快捷键
                        [{
                            name: 'saveCmd',
                            bindKey: {
                                win: 'Ctrl-S',
                                mac: 'Command-S'
                            },
                            exec: function(editor) {
                                w2ui['layout_admin_bomb_edit_main_toolbar'].click('save');
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
                        w2ui['layout_admin_bomb_edit_main_toolbar'].onClick = function(event) {
                            if (event.target !== 'save') { return false };
                            var c_c = self.editor.client.getValue();
                            var s_c = self.editor.server.getValue();
                            //- 保存代码
                            w2popup.lock('保存代码中..', true);
                            $.post('/addons/ant.admin.bomb/save', {
                                id: id,
                                client: c_c,
                                server: s_c
                            }, function(data) {
                                w2popup.unlock();
                                if (data.err) {
                                    toastr.error('代码保存失败!<br>' + data.err, 'Error');
                                }else{
                                    plugin.code = {
                                        client: c_c,
                                        server: s_c
                                    }
                                    self.reload();
                                    toastr.success('代码保存成功!', 'Success');
                                }
                            })
                        }
                        w2ui['layout_admin_bomb_edit_main_tabs'].click('client');
                        w2popup.toggle();
                    }
                },
                onToggle: function(event) {
                    event.onComplete = function() {
                        w2ui['layout_admin_bomb_edit'].resize();
                        self.editor.client.resize();
                        self.editor.server.resize();
                    }
                }
            })
        },
        setting: function(id) {
            var self = this,
                plugin = self.cache[id];
            w2popup.open({
                title: '<i class="fa fa-cog"></i> 更改设置',
                body: '<div id="form_admin_bomb_setting_div"></div>',
                style : 'padding: 15px 0 0 0',
                modal: true,
                width: 500,
                height: 350,
                onOpen: function(event) {
                    event.onComplete = function() {
                        var form = $.extend({}, ADDON.ui['form_admin_bomb_setting'], {
                            record: {
                                name: plugin.name,
                                coin: plugin.coin,
                                desc: plugin.desc
                            },
                            actions: {
                                '更新': function() {
                                    var _record = this.record;
                                    if (this.validate().length === 0) {
                                        w2popup.lock('更新插件中..', true);
                                        $.post('/addons/ant.admin.bomb/setting', {
                                            id: id,
                                            name: _record.name,
                                            coin: _record.coin,
                                            desc: _record.desc
                                        }, function(data) {
                                            if (data.ret) {
                                                w2popup.close();
                                                toastr.success('更新插件成功!', 'Success');
                                                plugin = $.extend({}, plugin, _record);
                                                self.cache[id] = plugin;
                                                self.reload();
                                            }else{
                                                toastr.error('更新插件失败!<br>' + data.err, 'Error');
                                            }
                                        })
                                    };
                                }
                            }
                        })
                        $('#form_admin_bomb_setting_div').w2form(form);
                    }
                },
                onClose: function(event) {
                    w2ui['form_admin_bomb_setting'].destroy();
                }
            })
        }
    }

    $().w2grid(ADDON.ui.grid_admin_bomb);
    $().w2layout(ADDON.ui.layout_admin_bomb_edit);

    BAR.add('ant_admin', {
        id: 'admin_bomb',
        icon: 'fa fa-puzzle-piece',
        text: '蚁弹插件',
        onClick: function() {
            ADDON.refresh();
        },
        onDblClick: function() {
            delete ADDON.cache;
            ADDON.refresh();
        }
    })
})(jQuery, w2ui['sidebar'], w2ui['layout'])