//
//  坚持下去，蚁逅会怎样
//

;(function($, undefined) {
    var ADDON = {
        ui: {
            //@ 右侧:私人蚁记
            grid_blog_private: {
                name: 'grid_blog_private',
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
                    { field: '_ctime', hidden: true, caption: 'CTIME' },
                    { field: 'category', caption: '蚁记目录', size: '15%', sortable: true },
                    { field: 'title', caption: '蚁记标题', size: '35%', sortable: true },
                    { field: 'public', caption: '是否分享', size: '10%', sortable: true },
                    { field: 'verify', caption: '是否审核', size: '10%', sortable: true },
                    { field: 'ctime', caption: '创建时间', size: '15%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                records: [],
                searches: [
                    { field: 'category', caption: '蚁记目录', type: 'text' },
                    { field: 'title', caption: '蚁记标题', type: 'text' },
                    { field: 'public', caption: '是否分享', type: 'text' },
                    { field: 'verify', caption: '是否审核', type: 'text' },
                    { field: 'ctime', caption: '创建时间', type: 'text' },
                    { field: 'utime', caption: '更新时间', type: 'text' }
                ],
                toolbar: {
                    items: [{
                        type: 'break'
                    }, {
                        id: 'add',
                        type: 'button',
                        caption: '添加蚁记',
                        icon: 'fa fa-plus-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'view',
                        type: 'button',
                        disabled: true,
                        caption: '浏览蚁记',
                        icon: 'fa fa-eye'
                    }, {
                        type: 'break'
                    }, {
                        id: 'desc',
                        type: 'button',
                        disabled: true,
                        caption: '蚁记简介',
                        icon: 'fa fa-info-circle',
                    }, {
                        type: 'break'
                    }, {
                        id: 'edit',
                        type: 'button',
                        disabled: true,
                        caption: '编辑蚁记',
                        icon: 'fa fa-edit'
                    }, {
                        type: 'break'
                    }, {
                        id: 'set',
                        type: 'button',
                        disabled: true,
                        caption: '更改设置',
                        icon: 'fa fa-cog'
                    }, {
                        type: 'break'
                    }, {
                        id: 'del',
                        type: 'button',
                        disabled: true,
                        caption: '删除蚁记',
                        icon: 'fa fa-trash-o'
                    }],
                    onClick: function(event) {
                        var ids = [],
                            self = w2ui['grid_blog_private'];
                        self.getSelection().forEach(function(i) {
                            ids.push(self.get(i)._id);
                        })
                        var cur = self.get(self.getSelection()[0]);
                        switch(event.target) {
                            case 'add':
                                ADDON.private.add();
                                break;
                            case 'del':
                                ADDON.private.del(ids);
                                break;
                            case 'desc':
                                ADDON.private.desc(cur.recid);
                                break;
                            case 'view':
                                ADDON.private.view(ids[0]);
                                break;
                            case 'edit':
                                ADDON.private.edit(ids[0]);
                                break;
                            case 'set':
                                ADDON.private.set(ids[0]);
                                break;
                        }
                    }
                },
                onSelect: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        var ids = [];
                        self.getSelection().forEach(function(i) {
                            ids.push(self.get(i)._id);
                        });
                        self.toolbar.disable('edit', 'desc', 'view', 'del', 'set');
                        ids.length === 1
                        ? self.toolbar.enable('edit', 'desc', 'view', 'del', 'set')
                        : ids.length > 1
                            ? self.toolbar.enable('del')
                            : null;
                    }
                },
                onUnselect: function(event) {
                    this.onSelect(event);
                },
                onContextMenu: function(event) {
                    var ids = [],
                        self = this;
                    self.getSelection().forEach(function(i) {
                        ids.push(self.get(i)._id);
                    })
                    var cur = self.get(self.getSelection()[0]);
                    $().bmenu([
                        {
                            text: '浏览蚁记',
                            icon: 'fa fa-eye',
                            disabled: ids.length !== 1,
                            action: function() {
                                ADDON.private.view(ids[0]);
                            }
                        }, {
                            divider: true
                        }, {
                            text: '蚁记简介',
                            icon: 'fa fa-info-circle',
                            disabled: ids.length !== 1,
                            action: function() {
                                ADDON.private.desc(cur.recid);
                            }
                        }, {
                            divider: true
                        }, {
                            text: '编辑蚁记',
                            icon: 'fa fa-edit',
                            disabled: ids.length !== 1,
                            action: function() {
                                ADDON.private.edit(ids[0]);
                            }
                        }, {
                            text: '更改设置',
                            icon: 'fa fa-cog',
                            disabled: ids.length !== 1,
                            action: function() {
                                ADDON.private.set(ids[0]);
                            }
                        }, {
                            divider: true
                        }, {
                            text: '分享蚁记',
                            icon: 'fa fa-share-alt',
                            disabled: (ids.length !== 1) || (cur.public === '是'),
                            action: function() {
                                ADDON.private.share(ids[0], true);
                            }
                        }, {
                            text: '取消分享',
                            icon: 'fa fa-remove',
                            disabled: (ids.length !== 1) || (cur.public === '否'),
                            action: function() {
                                ADDON.private.share(ids[0], false);
                            }
                        }, {
                            divider: true
                        }, {
                            text: '删除蚁记',
                            icon: 'fa fa-trash-o',
                            count: ids.length,
                            disabled: ids.length === 0,
                            action: function() {
                                ADDON.private.del(ids);
                            }
                        }
                    ], event.originalEvent);
                },
                onExpand: function(event) {
                    var blog = ADDON.private.cache[this.get(event.recid)._id];
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' + (w2utils.encodeTags(blog.desc || '<暂无简介>')).replace(/\n/g, '<br>') + '</div>'
                    ).animate({
                        'height': 100
                    }, 100);
                },
                onDblClick: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        self.toggle(self.getSelection());
                    }
                }
            },
            //@ 蚁记分享
            grid_blog_public: {
                name: 'grid_blog_public',
                show: {
                    lineNumbers: true,
                    footer: true,
                    toolbar: true,
                    expandColumn: true
                },
                multiSearch: false,
                multiSelect: false,
                columns: [
                    { field: '_id', hidden: true, caption: 'ID' },
                    { field: '_utime', hidden: true, caption: 'UTIME' },
                    { field: 'category', caption: '蚁记目录', size: '15%', sortable: true },
                    { field: 'title', caption: '蚁记标题', size: '40%', sortable: true },
                    { field: 'user', caption: '蚁记作者', size: '15%', sortable: true },
                    { field: 'view', caption: '浏览次数', size: '10%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '20%', sortable: true }
                ],
                records: [],
                searches: [
                    { field: 'category', caption: '蚁记目录', type: 'text' },
                    { field: 'title', caption: '蚁记标题', type: 'text' },
                    { field: 'public', caption: '蚁记作者', type: 'text' },
                    { field: 'verify', caption: '浏览次数', type: 'text' },
                    { field: 'utime', caption: '更新时间', type: 'text' }
                ],
                toolbar: {
                    items: [{
                        type: 'break'
                    }, {
                        id: 'view',
                        type: 'button',
                        disabled: true,
                        caption: '浏览蚁记',
                        icon: 'fa fa-eye'
                    }, {
                        type: 'break'
                    }, {
                        id: 'desc',
                        type: 'button',
                        disabled: true,
                        caption: '蚁记简介',
                        icon: 'fa fa-info-circle',
                    }, {
                        type: 'break'
                    }, {
                        id: 'love',
                        type: 'button',
                        disabled: true,
                        caption: '收藏蚁记',
                        icon: 'fa fa-cloud-download'
                    }],
                    onClick: function(event) {
                        var self = w2ui['grid_blog_public'];
                        var cur = self.get(self.getSelection()[0]);
                        switch(event.target) {
                            case 'desc':
                                ADDON.public.desc(cur.recid);
                                break;
                            case 'view':
                                ADDON.public.view(cur._id);
                                break;
                            case 'love':
                                ADDON.public.love(cur._id);
                                break;
                        }
                    }
                },
                onSelect: function(event) {
                    event.onComplete = function() {
                        var ids = this.getSelection();
                        ids.length === 0
                        ? this.toolbar.disable('view', 'desc', 'love')
                        : this.toolbar.enable('view', 'desc', 'love');
                    }
                },
                onUnselect: function(event) {
                    this.onSelect(event);
                },
                onContextMenu: function(event) {
                    var self = this;
                    $().bmenu([
                        {
                            text: '浏览蚁记',
                            icon: 'fa fa-eye',
                            action: function() {
                                self.toolbar.click('view');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '蚁记简介',
                            icon: 'fa fa-info-circle',
                            action: function() {
                                self.toolbar.click('desc');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '收藏蚁记',
                            icon: 'fa fa-cloud-download',
                            action: function() {
                                self.toolbar.click('love');
                            }
                        }
                    ], event.originalEvent);
                },
                onExpand: function(event) {
                    var blog = ADDON.public.cache[this.get(event.recid)._id];
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' + (w2utils.encodeTags(blog.desc || '<暂无简介>')).replace(/\n/g, '<br>') + '</div>'
                    ).animate({
                        'height': 100
                    }, 100);
                },
                onDblClick: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        self.toggle(self.getSelection());
                    }
                }
            },
            //@ 编辑蚁记框架
            layout_blog_edit: {
                name: 'layout_blog_edit',
                panels: [{
                    size: '100%',
                    type: 'left',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '<div id="layout_blog_edit_editor"></div>',
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
                            id: 'link',
                            icon: 'fa fa-link',
                            type: 'button',
                            caption: '链接'
                        }, {
                            type: 'break'
                        }, {
                            id: 'img',
                            icon: 'fa fa-file-image-o',
                            type: 'button',
                            caption: '图片'
                        }, {
                            type: 'break'
                        }, {
                            id: 'music',
                            icon: 'fa fa-file-audio-o',
                            type: 'button',
                            caption: '音乐'
                        }, {
                            type: 'break'
                        }, {
                            id: 'movie',
                            icon: 'fa fa-file-movie-o',
                            type: 'button',
                            caption: '视频'
                        }, {
                            type: 'break'
                        }, {
                            id: 'file',
                            icon: 'fa fa-file-zip-o',
                            type: 'button',
                            caption: '文件',
                        }, {
                            type: 'break'
                        }, {
                            type: 'spacer'
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
            //@ 添加/修改蚁记信息表单
            form_blog: {
                name: 'form_blog',
                style: 'height: 100%;border: 0px;background-color: transparent;',
                fields: [
                    {
                        field: 'category',
                        type: 'combo',
                        required: true,
                        html: {
                            caption: '蚁记目录',
                            attr: 'style="width: 250px"'
                        },
                        options: {
                            items: []
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
        },
        init: function() {
            $().w2grid(this.ui.grid_blog_private);
            $().w2grid(this.ui.grid_blog_public);
            $().w2layout(this.ui.layout_blog_edit);
        },
        blog: {
            //- markdown解析
            parse: function(div, blog, md) {
                //- 解析html
                $('#' + div).html(marked(md || blog.content));
                //- 代码高亮
                $('#' + div + ' pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                    //= 添加行号
                    var lines = $(this).text().split('\n').length - 1;
                    var $numbering = $('<ul/>').addClass('pre-numbering');
                    $(this)
                        .addClass('has-numbering')
                        .parent()
                        .append($numbering);
                    for(i=1;i<=lines;i++){
                        $numbering.append($('<li/>').text(i));
                    }
                });
                //- 解析音乐播放器
                $('#' + div + ' audio').audioPlayer({
                    classPrefix: 'audioplayer',
                    strPlay: '播放',
                    strPause: '暂停',
                    strVolume: '音量'
                });
                //- 解析视频播放器
                var movies = $('#' + div + ' #movie-player-');
                for (var i = 0; i < movies.length; i++) {
                    var _id = $(movies[i]).attr('id');
                    $(movies[i]).attr('id', _id + i);
                    var obj = {
                        source: $(movies[i]).attr('src'),
                        parentId: '#' + div + ' #' + $(movies[i]).attr('id'),
                        autoPlay: $(movies[i]).attr('play') === 'true' ? true : false
                    };
                    new Clappr.Player(obj);
                };
                if (!md) {
                    //- 生成评论
                    $('#' + div).append('<hr><div id="blog_comment_' + blog._id + '"></div>');
                    $('#blog_comment_' + blog._id).comment({
                        key: blog._id,
                        url: '#!/blog/' + (blog.verify ? 'public' : 'private') + '/' + blog._id,
                        title: (blog.verify ? '蚁记分享 - ' : '私人蚁记 - ') + blog.title
                    })
                };
            }
        },
        //- 私人蚁记
        private: {
            //= 数据缓存
            cache: null,
            //= 目录缓存
            category: [],
            //= 刷新数据
            refresh: function() {
                var self = this;
                ADDON.content(w2ui['grid_blog_private']);
                if (!self.cache) {
                    self.cache = {};
                    ADDON.lock('加载蚁记数据中..')
                    $.get('/addons/ant.blog/private/data', function(data) {
                        var _category = {};
                        self.category = [];
                        data.forEach(function(i) {
                            self.cache[i._id] = i;
                            _category[i.category] = 0;
                        })
                        for (var i in _category) {
                            self.category.push(i);
                        }
                        self.reload();
                    })
                }
            },
            //= 刷新UI
            reload: function() {
                var self = this;
                var records = [];
                for (var i in self.cache) {
                    var blog = self.cache[i];
                    if (blog) {
                        records.push({
                            recid: records.length + 1,
                            _id: blog._id,
                            category: w2utils.encodeTags(blog.category),
                            title: w2utils.encodeTags(blog.title),
                            public: blog.public ? '是' : '否',
                            verify: blog.public ? (blog.verify ? '是' : '否') : '-',
                            ctime: ANT.ftime(blog.ctime),
                            _ctime: blog.ctime,
                            utime: ANT.ftime(blog.utime),
                            style: 'color: ' + (blog.public ? (blog.verify ? 'rgb(22, 144, 61)': 'rgb(195, 45, 9)'): '')
                        })
                    };
                }
                w2ui['grid_blog_private'].records = records;
                w2ui['grid_blog_private'].sort('_ctime', 'desc');
                w2ui['grid_blog_private'].refresh();
                setTimeout(function() {
                    w2ui.sidebar.set('blog_private', {count: records.length});
                    ADDON.unlock();
                }, 100);
            },
            //= 添加蚁记
            add: function() {
                var self = this;
                w2popup.open({
                    title: '<i class="fa fa-plus-circle"></i> 添加蚁记',
                    body: '<div id="ant_blog_add_div"></div>',
                    style : 'padding: 15px 0 0 0',
                    modal: true,
                    width: 500,
                    height: 320,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            //- 获取分类
                            ADDON.ui['form_blog'].fields[0].options.items = self.category;
                            //- 显示表单
                            var form = $.extend({}, ADDON.ui['form_blog'], {
                                actions: {
                                    '添加': function() {
                                        if (this.validate().length === 0) {
                                            w2popup.lock('添加蚁记中..', true);
                                            $.post('/addons/ant.blog/private/add', this.record, function(data) {
                                                w2popup.unlock();
                                                if (data.ret) {
                                                    w2popup.close();
                                                    ADDON.success('添加兵蚁成功!');
                                                    self.cache[data.ret._id] = data.ret;
                                                    self.reload();
                                                    ADDON.private.edit(data.ret._id);
                                                }else{
                                                    ADDON.error('添加兵蚁失败!<br>' + data.err)
                                                }
                                            })
                                        };
                                    }
                                }
                            })
                            $('#ant_blog_add_div').w2form(form);
                        }
                    },
                    onClose: function(event) {
                        w2ui['form_blog'].destroy();
                    }
                })
            },
            //= 删除蚁记
            del: function(ids) {
                var self = this;
                w2confirm('确定删除所选的(' + ids.length + ')条数据吗?', '<i class="fa fa-trash-o"></i> 删除蚁记', function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock('删除数据中..');
                        $.post('/addons/ant.blog/private/del', {
                            ids: ids
                        }, function(data) {
                            ADDON.unlock();
                            if (!data.err) {
                                ADDON.success('删除数据成功!');
                                ids.forEach(function(id) {
                                    delete self.cache[id];
                                })
                                self.reload();
                            }else{
                                ADDON.error('删除数据失败!');
                            }
                        })
                    };
                })
            },
            //= 蚁记简介
            desc: function(id) {
                w2ui['grid_blog_private'].toggle(id);
            },
            //= 分享蚁记
            share: function(id, share) {
                var self = this,
                    blog = this.cache[id];
                w2confirm('确定' + (share ? '分享' : '取消分享') + '所选蚁记?', '<i class="fa fa-' + (share ? 'share-alt' : 'remove') + '"></i> ' + (share ? '分享蚁记' : '取消分享'), function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock((share ? '分享蚁记中..' : '取消分享中..'));
                        $.post('/addons/ant.blog/private/share', {
                            id: id,
                            share: share ? 1 : 0
                        }, function(data) {
                            ADDON.unlock();
                            if (!data.err) {
                                ADDON.success(share ? '分享蚁记成功!' : '取消分享成功!');
                            }else{
                                ADDON.error((share ? '分享蚁记' : '取消分享') + '失败!<br>' + data.err);
                            }
                            blog.public = data.err ? false : share;
                            self.reload();
                        })
                    };
                })
            },
            //= 编辑蚁记
            edit: function(id) {
                var self = this,
                    blog = self.cache[id],
                    editor = null;
                w2popup.open({
                    title: '<i class="fa fa-edit"></i> 编辑蚁记:<strong class="text-success">' + w2utils.encodeTags(blog.title) + '</strong>',
                    body: '<div id="layout_blog_edit_div" style="width: 100%;height: 100%;"></div>',
                    style: 'padding: 0;',
                    showMax: true,
                    modal: true,
                    width: 900,
                    height: 600,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            $('#layout_blog_edit_div').w2render(w2ui['layout_blog_edit']);
                            //- 创建编辑器
                            var mode = require('ace/mode/markdown').Mode;
                            editor = ace.edit('layout_blog_edit_editor');
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
                                    w2ui['layout_blog_edit_left_toolbar'].click('save');
                                }
                            }, {
                                name: 'previewCmd',
                                bindKey: {
                                    win: 'Ctrl-E',
                                    mac: 'Command-E'
                                },
                                exec: function(editor) {
                                    w2ui['layout_blog_edit_left_toolbar'].click('preview');
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
                            }, {
                                name: 'insertLink',
                                bindKey: {
                                    win: 'Ctrl-I',
                                    mac: 'Command-I'
                                },
                                exec: function() {
                                    w2ui['layout_blog_edit_left_toolbar'].click('link');
                                }
                            }].forEach(function(key) {
                                editor.commands.addCommand(key);
                            })
                            //- 编辑器事件
                            editor.session.on('change', function(e) {
                                w2ui['layout_blog_edit_left_toolbar'].get('preview').checked
                                ? ADDON.blog.parse('blog_view_content', blog, editor.getValue())
                                : null;
                            })
                            //- 工具栏点击事件
                            w2ui['layout_blog_edit_left_toolbar'].onClick = function(event) {
                                switch(event.target) {
                                    case 'save':
                                        w2popup.lock('保存蚁记中..', true);
                                        $.post('/addons/ant.blog/private/save', {
                                            id: id,
                                            content: editor.getValue()
                                        }, function(data) {
                                            w2popup.unlock();
                                            if (data.err) {
                                                ADDON.error('保存蚁记失败!<br>' + data.err);
                                            }else{
                                                ADDON.success('保存蚁记成功!');
                                                blog.utime = new Date();
                                                blog.content = editor.getValue();
                                                blog.verify = false;
                                                self.reload();
                                            }
                                        })
                                        break;
                                    case 'preview':
                                        w2ui['layout_blog_edit'].set('left', {
                                            size: !event.object.checked ? '50%' : '100%'
                                        });
                                        this.set('preview', {
                                            icon: !event.object.checked ? 'fa fa-eye fa-spin' : 'fa fa-eye'
                                        });
                                        !event.object.checked
                                            ? ADDON.blog.parse('blog_view_content', blog, editor.getValue())
                                            : null;
                                        break;
                                    case 'link':
                                        var link = prompt("请输入链接地址");
                                        editor.insert('[' + (link || '链接标题') + '](' + (link || '链接地址') + ')');
                                        break;
                                }
                            }
                            //- 上传初始化
                            $('#tb_layout_blog_edit_left_toolbar_item_img').bindUpload(
                                function(fileName, fileSrc) {
                                    editor.insert('![' + fileName + '](' + fileSrc + ')\n');
                                });
                            $('#tb_layout_blog_edit_left_toolbar_item_file').bindUpload(
                                function(name, link) {
                                    editor.insert('~[' + name + '](' + link + ')\n');
                                })
                            $('#tb_layout_blog_edit_left_toolbar_item_music').bindUpload(
                                function(name, link) {
                                    editor.insert('m[' + name + '](' + link + ')\n');
                                })
                            $('#tb_layout_blog_edit_left_toolbar_item_movie').bindUpload(
                                function(name, link) {
                                    editor.insert('M[' + name + '](' + link + ')\n');
                                })
                            w2popup.toggle();
                        }
                    },
                    onToggle: function(event) {
                        event.onComplete = function() {
                            w2ui['layout_blog_edit'].set('left', {
                                size: w2ui['layout_blog_edit_left_toolbar'].get('preview').checked
                                    ? '50%'
                                    : '100%'
                            })
                            w2ui['layout_blog_edit'].resize();
                            editor.resize();
                        }
                    },
                    onClose: function(event) {
                        this.onMin(event);
                    },
                    onMin: function(event) {
                        event.onComplete = function() {
                            w2ui['layout_blog_edit_left_toolbar'].get('preview').checked
                                ? w2ui['layout_blog_edit_left_toolbar'].click('preview')
                                : null;
                        }
                    }
                });
            },
            //= 浏览蚁记
            view: function(id) {
                var self = this;
                var blog = self.cache[id];
                w2popup.open({
                    title: '<span class="text-info"><i class="fa fa-book"></i> ' + w2utils.encodeTags(blog.title) + '</span>',
                    style: 'padding: 0;background-color: #f5f6f7;',
                    modal: true,
                    showMax: true,
                    width: 1000,
                    height: 650,
                    body: '<div id="blog_view_content" style="width: 100%;height: 100%"></div>',
                    onOpen: function(event) {
                        event.onComplete = function() {
                            ADDON.blog.parse('blog_view_content', blog);
                        }
                    }
                })
            },
            //= 更改设置
            set: function(id) {
                var self = this,
                    blog = self.cache[id];
                w2popup.open({
                    title: '<i class="fa fa-pencil"></i> 更改设置',
                    body: '<div id="ant_blog_set_div"></div>',
                    style : 'padding: 15px 0 0 0',
                    modal: true,
                    width: 500,
                    height: 350,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            //- 获取分类
                            ADDON.ui['form_blog'].fields[0].options.items = self.category;
                            //- 显示表单
                            var form = $.extend({}, ADDON.ui['form_blog'], {
                                record: {
                                    category: {
                                        id: blog.category,
                                        text: blog.category
                                    },
                                    title: blog.title,
                                    desc: blog.desc
                                },
                                actions: {
                                    '保存': function() {
                                        if (this.validate().length === 0) {
                                            w2popup.lock('保存设置中..', true);
                                            var record = this.record;
                                            record.category = (typeof(record.category) === 'object') ? record.category.text : record.category;
                                            $.post('/addons/ant.blog/private/set', $.extend(record, {
                                                id: id
                                            }), function(data) {
                                                w2popup.unlock();
                                                if (!data.err) {
                                                    w2popup.close();
                                                    ADDON.success('保存设置成功!');
                                                    blog.category = record.category;
                                                    blog.title = record.title;
                                                    blog.desc = record.desc;
                                                    blog.verify = false;
                                                    blog.utime = new Date();
                                                    self.reload();
                                                }else{
                                                    ADDON.error('保存设置失败!<br>' + data.err)
                                                }
                                            })
                                        };
                                    }
                                }
                            })
                            $('#ant_blog_set_div').w2form(form);
                        }
                    },
                    onClose: function(event) {
                        w2ui['form_blog'].destroy();
                    }
                })
            }
        },
        //- 蚁记分享
        public: {
            //= 数据缓存
            cache: null,
            //= 刷新数据
            refresh: function() {
                var self = this;
                ADDON.content(w2ui['grid_blog_public']);
                if (!self.cache) {
                    self.cache = {};
                    ADDON.lock('加载蚁记数据中..')
                    $.get('/addons/ant.blog/public/data', function(data) {
                        data.forEach(function(i) {
                            self.cache[i._id] = i;
                        })
                        self.reload();
                    })
                }
            },
            //= 刷新UI
            reload: function() {
                var self = this;
                var records = [];
                for (var i in self.cache) {
                    var blog = self.cache[i];
                    if (blog) {
                        records.push({
                            recid: records.length + 1,
                            _id: blog._id,
                            category: w2utils.encodeTags(blog.category),
                            title: w2utils.encodeTags(blog.title),
                            user: w2utils.encodeTags(blog.user ? (blog.user.nickname || '<已删除>') : '<已删除>'),
                            utime: ANT.ftime(blog.utime),
                            _utime: blog.utime,
                            view: blog.view || 0,
                            // style: 'color: ' + (blog.public ? (blog.verify ? 'rgb(22, 144, 61)': 'rgb(195, 45, 9)'): '')
                        })
                    };
                }
                w2ui['grid_blog_public'].records = records;
                w2ui['grid_blog_public'].sort('_utime', 'desc');
                w2ui['grid_blog_public'].refresh();
                setTimeout(function() {
                    w2ui.sidebar.set('blog_public', {count: records.length});
                    ADDON.unlock();
                }, 100);
            },
            //= 浏览蚁记
            view: function(id) {
                var self = this;
                var blog = self.cache[id];
                w2popup.open({
                    title: '<span class="text-info"><i class="fa fa-book"></i> ' + w2utils.encodeTags(blog.title) + '</span>',
                    style: 'padding: 0;background-color: #f5f6f7;',
                    modal: true,
                    showMax: true,
                    width: 1000,
                    height: 650,
                    body: '<div id="blog_view_content" style="width: 100%;height: 100%"></div>',
                    onOpen: function(event) {
                        event.onComplete = function() {
                            if (!blog.content) {
                                w2popup.lock('加载蚁记中..', true);
                                $.post('/addons/ant.blog/public/view', {
                                    id: id
                                }, function(data) {
                                    w2popup.unlock();
                                    if (data.ret) {
                                        blog.content = data.ret.content;
                                        ADDON.blog.parse('blog_view_content', blog);
                                    }else{
                                        w2popup.close();
                                        ADDON.error('加载蚁记失败!')
                                    }
                                })
                            }else{
                                ADDON.blog.parse('blog_view_content', blog);
                            }
                        }
                    }
                })
            },
            //= 蚁记简介
            desc: function(id) {
                w2ui['grid_blog_public'].toggle(id);
            },
            //= 收藏蚁记
            love: function(id) {
                w2confirm('确定收藏此蚁记到私人目录吗？', '<i class="fa fa-cloud-download"></i> 收藏蚁记', function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock('收藏蚁记中..');
                        $.post('/addons/ant.blog/public/love', {
                            id: id
                        }, function(data) {
                            ADDON.unlock();
                            if (data.ret) {
                                ADDON.success('收藏蚁记成功!');
                                if (ADDON.private.cache) {
                                    ADDON.private.cache[data.ret._id] = data.ret;
                                    ADDON.private.reload();
                                    w2ui['sidebar'].click('blog_private');
                                }else{
                                    w2ui['sidebar'].dblClick('blog_private');
                                    w2ui['sidebar'].select('blog_private');
                                }
                            }else{
                                ADDON.error('收藏蚁记失败!<br>' + data.err);
                            }
                        })
                    };
                })
            }
        }
    };
    ANT.initAddon({
        id: 'ant_blog',
        libs: {
            js: ['/addons/ant.blog/libs/highlight.js', '/addons/ant.blog/libs/marked.js', '/addons/ant.blog/libs/upload.js', '/addons/ant.blog/libs/audioplayer.js', '/addons/ant.blog/libs/clappr.min.js'],
            css: ['/addons/ant.blog/libs/highlight.css', '/addons/ant.blog/client.css']
        },
        text: '蚁记一技',
        group: true,
        expanded: true,
        nodes: [{
            id: 'blog_public',
            text: '蚁记分享',
            icon: 'fa fa-book',
            onClick: function() {
                ADDON.public.refresh();
            },
            onDblClick: function() {
                delete ADDON.public.cache;
                ADDON.public.refresh();
            }
        }, {
            id: 'blog_private',
            text: '私人蚁记',
            icon: 'fa fa-book',
            onClick: function() {
                ADDON.private.refresh();
            },
            onDblClick: function() {
                delete ADDON.private.cache;
                ADDON.private.refresh();
            }
        }]
    }, ADDON)
})(jQuery)