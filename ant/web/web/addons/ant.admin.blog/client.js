;(function($, BAR, LAYOUT) {
    var ADDON = {
        ui: {
            grid_admin_blog: {
                name: 'grid_admin_blog',
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
                    { field: 'category', caption: '蚁记目录', size: '10%', sortable: true },
                    { field: 'title', caption: '蚁记标题', size: '30%', sortable: true },
                    { field: 'user', caption: '蚁记作者', size: '10%', sortable: true },
                    { field: 'verify', caption: '是否审核', size: '10%', sortable: true },
                    { field: 'ctime', caption: '创建时间', size: '15%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                records: [],
                searches: [
                    { field: 'category', caption: '蚁记目录', type: 'text' },
                    { field: 'title', caption: '蚁记标题', type: 'text' },
                    { field: 'user', caption: '蚁记作者', type: 'text' },
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
                        text: '编辑蚁记',
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
                        text: '审核蚁记',
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
                        text: '删除蚁记',
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
            form_admin_blog: {
                name: 'form_admin_blog',
                style: 'height: 100%;border: 0px;background-color: transparent;',
                fields: [
                    {
                        field: 'category',
                        type: 'text',
                        required: true,
                        html: {
                            caption: '蚁记目录',
                            attr: 'style="width: 250px"'
                        }
                    }, {
                        field: 'title',
                        type: 'text',
                        required: true,
                        html: {
                            caption: '蚁记标题',
                            attr: 'style="width: 250px"'
                        }
                    }, {
                        field: 'desc',
                        type: 'textarea',
                        html: {
                            caption: '蚁记简介',
                            attr: 'rows="8" style="width: 250px;"'
                        }
                    }
                ]
            },
            layout_admin_blog: {
                name: 'layout_admin_blog',
                panels: [{
                    size: '100%',
                    type: 'left',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '<div id="layout_admin_blog_edit" style="width:100%;height:100%;"></div>',
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
                        }, {
                            id: 'preview',
                            type: 'check',
                            icon: 'fa fa-eye',
                            hint: '[Ctrl || Command] + E',
                            caption: '预览'
                        }],
                    }
                }, {
                    size: '100%',
                    type: 'main',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '<div id="blog_view_content"></div>',
                    resizable: true,
                }]
            },
        },
        cache: null,
        refresh: function() {
            var self = ADDON;
            !BAR.get('ant_admin').expanded ? BAR.expand('ant_admin') : null;
            LAYOUT.content('main', w2ui['grid_admin_blog']);
            if (!self.cache) {
                LAYOUT.lock('main', '获取蚁记数据中..', true);
                self.cache = {};
                $.get('/addons/ant.admin.blog/data', function(ret) {
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
                var blog = self.cache[i];
                if (blog) {
                    records.push({
                        recid: records.length + 1,
                        _id: blog._id,
                        category: w2utils.encodeTags(blog.category),
                        title: w2utils.encodeTags(blog.title),
                        user: w2utils.encodeTags(blog.user ? blog.user.nickname : '<已删除>'),
                        verify: blog.verify ? '是' : '否',
                        ctime: ANT.ftime(blog.ctime),
                        utime: ANT.ftime(blog.utime),
                        style: blog.verify ? '' : 'color:rgb(195, 45, 9);background-color:#FBFEC0;'
                    });
                };
            }
            w2ui['grid_admin_blog'].records = records;
            w2ui['grid_admin_blog'].sort('_id', 'desc');
            w2ui['grid_admin_blog'].refresh();
            setTimeout(function() {
                BAR.set('admin_blog', {
                    count: records.length
                });
                LAYOUT.unlock('main');
            }, 100);
        },
        del: function(ids) {
            var self = this;
            w2confirm('确定删除所选蚁记?', function(btn) {
                if (btn !== 'Yes') { return false };
                LAYOUT.lock('main', '删除蚁记中..', true);
                $.post('/addons/ant.admin.blog/del', {
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
        edit: function(id) {
            var self = this,
                blog = self.cache[id],
                editor = null;
            w2popup.open({
                title: '<i class="fa fa-edit"></i> 编辑蚁记:<strong class="text-success">' + w2utils.encodeTags(blog.title) + '</strong>',
                body: '<div id="layout_admin_blog_div" style="width: 100%;height: 100%;"></div>',
                style: 'padding: 0;',
                showMax: true,
                modal: true,
                width: 900,
                height: 600,
                onOpen: function(event) {
                    event.onComplete = function() {
                        $('#layout_admin_blog_div').w2render(w2ui['layout_admin_blog']);
                        //- 创建编辑器
                        var mode = require('ace/mode/markdown').Mode;
                        editor = ace.edit('layout_admin_blog_edit');
                        editor.setTheme('ace/theme/tomorrow');
                        editor.session.setMode(new mode());
                        editor.session.setUseWrapMode(true);
                        editor.session.setValue(blog.content || '');
                        //- 编辑器快捷键
                        [{
                            name: 'saveCmd',
                            bindKey: {
                                win: 'Ctrl-S',
                                mac: 'Command-S'
                            },
                            exec: function(editor) {
                                w2ui['layout_admin_blog_left_toolbar'].click('save');
                            }
                        }, {
                            name: 'previewCmd',
                            bindKey: {
                                win: 'Ctrl-E',
                                mac: 'Command-E'
                            },
                            exec: function(editor) {
                                w2ui['layout_admin_blog_left_toolbar'].click('preview');
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
                            editor.commands.addCommand(key);
                        })

                        //- 工具栏点击事件
                        w2ui['layout_admin_blog_left_toolbar'].onClick = function(event) {
                            switch(event.target) {
                                case 'save':
                                    w2popup.lock('保存蚁记中..', true);
                                    $.post('/addons/ant.admin.blog/save', {
                                        id: id,
                                        content: editor.getValue()
                                    }, function(data) {
                                        w2popup.unlock();
                                        if (data.err) {
                                            toastr.error('保存蚁记失败!<br>' + data.err, 'Error');
                                        }else{
                                            toastr.success('保存蚁记成功!', 'Success');
                                            blog.content = editor.getValue();
                                            self.reload();
                                        }
                                    })
                                    break;
                                case 'preview':
                                    w2ui['layout_admin_blog'].set('left', {
                                        size: !event.object.checked ? '50%' : '100%'
                                    });
                                    this.set('preview', {
                                        icon: !event.object.checked ? 'fa fa-eye fa-spin' : 'fa fa-eye'
                                    });
                                    !event.object.checked
                                        ? ANT.addons.ant_blog.blog.parse('blog_view_content', blog, editor.getValue())
                                        : null;
                                    break;
                            }
                        }
                        w2popup.toggle();
                    }
                },
                onToggle: function(event) {
                    event.onComplete = function() {
                        w2ui['layout_admin_blog'].set('left', {
                            size: w2ui['layout_admin_blog_left_toolbar'].get('preview').checked
                                ? '50%'
                                : '100%'
                        })
                        w2ui['layout_admin_blog'].resize();
                        editor.resize();
                    }
                },
                onClose: function(event) {
                    this.onMin(event);
                },
                onMin: function(event) {
                    event.onComplete = function() {
                        w2ui['layout_admin_blog_left_toolbar'].get('preview').checked
                            ? w2ui['layout_admin_blog_left_toolbar'].click('preview')
                            : null;
                    }
                }
            });
        },
        setting: function(id) {
                var self = this,
                    blog = self.cache[id];
                w2popup.open({
                    title: '<i class="fa fa-pencil"></i> 更改设置',
                    body: '<div id="form_admin_blog_div"></div>',
                    style : 'padding: 15px 0 0 0',
                    modal: true,
                    width: 500,
                    height: 350,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            var form = $.extend(
                                {}, ADDON.ui['form_admin_blog'], {
                                record: {
                                    category: blog.category,
                                    title: blog.title,
                                    desc: blog.desc
                                },
                                actions: {
                                    '保存': function() {
                                        if (this.validate().length === 0) {
                                            w2popup.lock('保存设置中..', true);
                                            var record = this.record;
                                            $.post('/addons/ant.admin.blog/setting', $.extend(record, {
                                                id: id
                                            }), function(data) {
                                                w2popup.unlock();
                                                if (!data.err) {
                                                    w2popup.close();
                                                    toastr.success('保存设置成功!', 'Success');
                                                    blog.category = record.category;
                                                    blog.title = record.title;
                                                    blog.desc = record.desc;
                                                    self.reload();
                                                }else{
                                                    toastr.error('保存设置失败!<br>' + data.err, 'Error')
                                                }
                                            })
                                        };
                                    }
                                }
                            })
                            $('#form_admin_blog_div').w2form(form);
                        }
                    },
                    onClose: function(event) {
                        w2ui['form_admin_blog'].destroy();
                    }
                })
        },
        verify: function(ids, verify) {
            var self = this;
            if (verify) {
                w2confirm('确定审核所选蚁记吗?', function(btn) {
                    if (btn !== 'Yes') { return false };
                    LAYOUT.lock('main', '审核蚁记中..', true);
                    $.post('/addons/ant.admin.blog/verify', {
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
                w2confirm('确定取消审核所选蚁记吗?', function(btn) {
                    if (btn !== 'Yes') { return false };
                    LAYOUT.lock('main', '取消审核蚁记中..', true);
                    $.post('/addons/ant.admin.blog/verify', {
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
        }
    }

    $().w2grid(ADDON.ui.grid_admin_blog);
    $().w2layout(ADDON.ui.layout_admin_blog);

    BAR.add('ant_admin', {
        id: 'admin_blog',
        icon: 'fa fa-book',
        text: '蚁记审核',
        onClick: function() {
            ADDON.refresh();
        },
        onDblClick: function() {
            delete ADDON.cache;
            ADDON.refresh();
        }
    })
})(jQuery, w2ui['sidebar'], w2ui['layout'])