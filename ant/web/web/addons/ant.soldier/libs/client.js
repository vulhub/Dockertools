//
//  
//  终于要告别 终于没有更多的明天要追
//    你有什么遗憾依然残缺 还没有完美
//           -- 《五月天·诺亚方舟》
//
//  如果说，一首歌，就是一首诗，不管押韵与否，都曾有用心
//  如果说，一行代码，也是一首诗，那么，你会不会，也用心地去雕刻
//

;(function($, undefined) {
    var ADDON = {
        ui: {
            //@ 右侧:个人仓库
            grid_soldier_depot: {
                name: 'grid_soldier_depot',
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
                    { field: 'aid', caption: '兵蚁编号', size: '15%', sortable: true },
                    { field: 'name', caption: '兵蚁大名', size: '25%', sortable: true },
                    { field: 'env', caption: '运行环境', size: '10%', sortable: true },
                    { field: 'sell', caption: '是否出售', size: '10%', sortable: true },
                    { field: 'verify', caption: '是否审核', size: '10%', sortable: true },
                    { field: 'ctime', caption: '创建时间', size: '15%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                records: [],
                searches: [
                    { field: 'name', caption: '兵蚁大名', type: 'text' },
                    { field: 'aid', caption: '兵蚁编号', type: 'text' },
                    { field: 'env', caption: '运行环境', type: 'text' },
                    { field: 'sell', caption: '是否出售', type: 'text' },
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
                        caption: '添加兵蚁',
                        icon: 'fa fa-plus-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'del',
                        type: 'button',
                        disabled: true,
                        caption: '删除兵蚁',
                        icon: 'fa fa-trash-o'
                    }, {
                        type: 'break'
                    }, {
                        id: 'run',
                        type: 'button',
                        disabled: true,
                        caption: '加载兵蚁',
                        icon: 'fa fa-spinner',
                    }, {
                        type: 'break'
                    }, {
                        id: 'bg',
                        type: 'button',
                        disabled: true,
                        caption: '后台执行',
                        icon: 'fa fa-circle-o-notch'
                    }, {
                        type: 'break'
                    }, {
                        id: 'edit',
                        type: 'button',
                        disabled: true,
                        caption: '强化兵蚁',
                        icon: 'fa fa-edit'
                    }],
                    onClick: function(event) {
                        var ids = [],
                            self = w2ui['grid_soldier_depot'];
                        self.getSelection().forEach(function(i) {
                            ids.push(self.get(i)._id);
                        })
                        switch(event.target) {
                            case 'add':
                                ADDON.depot.add();
                                break;
                            case 'run':
                                ADDON.depot.load(ids[0]);
                                break;
                            case 'bg':
                                ADDON.task.init(ids);
                                break;
                            case 'edit':
                                ADDON.depot.edit(ids[0]);
                                break;
                            case 'del':
                                ADDON.depot.del(ids);
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
                        })
                        self.toolbar.disable('run', 'bg', 'edit', 'del');
                        ids.length === 1
                        ? self.toolbar.enable('run', 'bg', 'edit', 'del')
                        : ids.length > 1
                            ? self.toolbar.enable('del', 'bg')
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
                            text: '加载兵蚁',
                            icon: 'fa fa-spinner',
                            disabled: ids.length !== 1,
                            action: function() {
                                ADDON.depot.load(ids[0]);
                            }
                        }, {
                            text: '后台执行',
                            count: ids.length,
                            icon: 'fa fa-circle-o-notch',
                            disabled: ids.length === 0,
                            action: function() {
                                ADDON.task.init(ids);
                            }
                        }, {
                            divider: true
                        }, {
                            text: '强化兵蚁',
                            icon: 'fa fa-edit',
                            disabled: ids.length !== 1,
                            action: function() {
                                ADDON.depot.edit(ids[0]);
                            }
                        }, {
                            text: '更改设置',
                            icon: 'fa fa-pencil',
                            disabled: ids.length !== 1,
                            action: function() {
                                ADDON.depot.reset(ids[0]);
                            }
                        }, {
                            divider: true
                        }, {
                            text: '出售兵蚁',
                            icon: 'fa fa-money',
                            disabled: (ids.length !== 1) || (cur.sell === '是'),
                            action: function() {
                                ADDON.depot.sell(ids[0]);
                            }
                        }, {
                            text: '取消出售',
                            icon: 'fa fa-remove',
                            disabled: (ids.length !== 1) || (cur.sell === '否'),
                            action: function() {
                                ADDON.depot.cancelSell(ids[0]);
                            }
                        }, {
                            divider: true
                        }, {
                            text: '删除兵蚁',
                            count: ids.length,
                            icon: 'fa fa-trash-o',
                            disabled: ids.length === 0,
                            action: function() {
                                ADDON.depot.del(ids);
                            }
                        }
                    ], event.originalEvent);
                },
                onExpand: function(event) {
                    var soldier = ADDON.depot.cache[this.get(event.recid)._id];
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' + (w2utils.encodeTags(soldier.desc || '<暂无简介>')).replace(/\n/g, '<br>') + '</div>'
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
            //@ 右侧:交易市场
            grid_soldier_market: {
                name: 'grid_soldier_market',
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
                    { field: 'aid', caption: '兵蚁编号', size: '15%', sortable: true },
                    { field: 'name', caption: '兵蚁大名', size: '25%', sortable: true },
                    { field: 'env', caption: '运行环境', size: '10%', sortable: true },
                    { field: 'user', caption: '兵蚁作者', size: '15%', sortable: true },
                    { field: 'coin', caption: '出售蚁币', size: '10%', sortable: true },
                    { field: 'buys', caption: '购买次数', size: '10%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                records: [],
                searches: [
                    { field: 'name', caption: '兵蚁大名', type: 'text' },
                    { field: 'aid', caption: '兵蚁编号', type: 'text' },
                    { field: 'env', caption: '运行环境', type: 'text' },
                    { field: 'user', caption: '兵蚁作者', type: 'text' },
                    { field: 'coin', caption: '出售蚁币', type: 'text' },
                    { field: 'buys', caption: '购买次数', type: 'text' },
                    { field: 'utime', caption: '更新时间', type: 'text' }
                ],
                toolbar: {
                    items: [{
                        type: 'break'
                    }, {
                        id: 'buy',
                        type: 'button',
                        caption: '购买',
                        disabled: true,
                        icon: 'fa fa-cart-plus'
                    }, {
                        type: 'break'
                    }, {
                        id: 'desc',
                        type: 'button',
                        caption: '简介',
                        disabled: true,
                        icon: 'fa fa-info-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'comment',
                        type: 'button',
                        caption: '讨论',
                        disabled: true,
                        icon: 'fa fa-comments'
                    }],
                    onClick: function(event) {
                        var ids = [],
                            self = w2ui['grid_soldier_market'];
                        var selected = self.getSelection();
                        selected.forEach(function(i) {
                            ids.push(self.get(i)._id);
                        })
                        switch(event.target) {
                            case 'buy':
                                ADDON.market.buy(ids[0]);
                                break;
                            case 'desc':
                                ADDON.market.desc(selected[0]);
                                break;
                            case 'comment':
                                ADDON.market.comment(ids[0]);
                                break;
                            default:
                                break;
                        }
                    }
                },
                onContextMenu: function(event) {
                    var self = this;
                    $().bmenu([
                        {
                            text: '购买兵蚁',
                            icon: 'fa fa-cart-plus',
                            action: function() {
                                self.toolbar.click('buy');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '简介说明',
                            icon: 'fa fa-info-circle',
                            action: function() {
                                self.toolbar.click('desc');
                            }
                        }, {
                            text: '讨论交流',
                            icon: 'fa fa-comments',
                            action: function() {
                                self.toolbar.click('comment');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '举报兵蚁',
                            icon: 'fa fa-warning',
                            disabled: true
                        }
                    ], event.originalEvent);
                },
                onSelect: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        var ids = [];
                        self.getSelection().forEach(function(i) {
                            ids.push(self.get(i)._id);
                        })
                        ids.length === 1
                            ? self.toolbar.enable('buy', 'desc', 'comment')
                            : self.toolbar.disable('buy', 'desc', 'comment');
                    }
                },
                onUnselect: function(event) {
                    this.onSelect(event);
                },
                onExpand: function(event) {
                    var soldier = ADDON.market.cache[this.get(event.recid)._id];
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' + (w2utils.encodeTags(soldier.desc || '<暂无简介>')).replace(/\n/g, '<br>') + '</div>'
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
            //@ 强化兵蚁框架
            layout_soldier_edit: {
                name: 'layout_soldier_edit',
                panels: [{
                    size: '100%',
                    type: 'left',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '' +
                    '<div id="layout_soldier_edit_client" class="soldier_editor" style="width: 100%;height:100%;font-size: 14px;"></div>' +
                    '<div id="layout_soldier_edit_server" class="soldier_editor" style="width: 100%;height:100%;font-size: 14px;"></div>',
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
                            id: 'call',
                            icon: 'fa fa-folder-open-o',
                            type: 'menu',
                            caption: '调用兵蚁',
                            items: []
                        }, {
                            type: 'spacer'
                        }, {
                            id: 'bug',
                            type: 'check',
                            icon: 'fa fa-bug',
                            hint: '[Ctrl || Command] + E',
                            caption: '预览'
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
                            $('#layout_soldier_edit_' + event.target).show();
                            ADDON.depot.editor[event.target].resize();
                        }
                    }
                }, {
                    size: '100%',
                    type: 'main',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '<div id="layout_soldier_edit_preview" style="width: 100%;height: 100%;"></div>',
                    resizable: true,
                }]
            },
            //@ 添加/修改兵蚁信息表单
            form_soldier: {
                name: 'form_soldier',
                style: 'height: 100%;border: 0px;background-color: transparent;',
                fields: [
                    {
                        field: 'env',
                        type: 'list',
                        required: true,
                            html: {
                            caption: '运行环境',
                            attr: 'style="width: 200px;"'
                        },
                        options: {
                            items: []
                        }
                    }, {
                        field: 'cms',
                        type: 'combo',
                        required: true,
                        html: {
                            caption: '兵蚁归类',
                            attr: 'style="width: 200px"'
                        },
                        options: {
                            items: []
                        }
                    }, {
                        field: 'name',
                        type: 'text',
                        required: true,
                        html: {
                            caption: '兵蚁大名',
                            attr: 'style="width: 200px"'
                        }
                    }, {
                        field: 'desc',
                        type: 'textarea',
                        html: {
                            caption: '简单说明',
                            attr: 'rows="4" style="width: 200px;"'
                        }
                    }
                ]
            },
            //@ 出售兵蚁表单
            form_soldier_sell: {
                name: 'form_soldier_sell',
                style: 'height: 100%;border: 0px;background-color: transparent;',
                fields: [{
                    field: 'coin',
                    type: 'int',
                    required: true,
                    html: {
                        caption: '出售蚁币',
                        attr: 'style="width: 180px;"'
                    }
                }],
                // record: {
                //     coin: 0
                // },
                actions: {
                    'Submit': function() {}
                }
            }
        },
        //- 加载UI
        init: function() {
            var self = this;
            $().w2grid(self.ui.grid_soldier_depot);
            $().w2grid(self.ui.grid_soldier_market);
            $().w2layout(self.ui.layout_soldier_edit);
            $().w2form(self.ui.form_soldier_sell);
        },
        //- 后台任务
        task: {
            init: function(ids) {
                var self = this;
                //= 创建侧边栏
                if (!w2ui['sidebar'].get('soldier_task')) {
                    w2ui['sidebar'].add('ant_soldier', {
                        id: 'soldier_task',
                        icon: 'fa fa-tasks',
                        text: '后台列表'
                    });
                };
                ids.forEach(function(i) {
                    self.add(i);
                })
            },
            //- 添加任务
            add: function(id) {
                var self = this;
                var soldier = ADDON.depot.cache[id];
                //= 判断任务是否存在 ? 激活 : 创建
                if (!w2ui['layout_preview_tabs'].get('tab_' + id)) {
                    // self.setTask(id);
                    //= 添加任务标签
                    w2ui['layout_preview_tabs'].add({
                        id: 'tab_' + id,
                        closable: true,
                        caption: '<i class="soldier_task_icon fa fa-circle-o-notch" id="task_' + id + '_icon"></i> ' + soldier.name,
                        onClose: function(event) {
                            //- 标签关闭事件
                            event.preventDefault();
                            w2ui['layout_preview_tabs'].remove('tab_' + id);
                            $('#task_' + id).remove();
                            if (event.target === w2ui['layout_preview_tabs'].active) {
                                //- 选择最后一个标签
                                var tabs = w2ui['layout_preview_tabs'].tabs;
                                var last_tab = tabs[tabs.length - 1];
                                last_tab ? w2ui['layout_preview_tabs'].click(last_tab.id) : null;
                            };
                            //- 刷新侧边栏UI
                            self.refresh();
                            //- 清除本地数据
                            self.delTask(id);
                        },
                        //- 标签激活事件
                        onClick: function(event) {
                            var _id = '#task_' + id;
                            //= 隐藏其他任务DIV
                            $('.soldier_task').hide();
                            //= 显示当前任务DIV
                            $(_id).show();
                            //= 刷新UI(防止DIV错乱)
                            w2ui.layout.resize('preview');
                            //= 更新图标
                            setTimeout(function() {
                                $('.soldier_task_icon').attr('class', 'soldier_task_icon fa fa-circle-o-notch');
                                $(_id + '_icon').attr('class', 'soldier_task_icon fa fa-circle-o-notch fa-spin');
                                w2ui['task_' + id] ? w2ui['task_' + id].resize('main') && w2ui['task_' + id].resize('main') : null;
                            }, 100)
                        }
                    })
                    //= 创建任务DIV
                    var dom = $('<div id="task_' + id + '" class="soldier_task">');
                    $('#soldier_task_div').append(dom);
                    //= 运行任务
                    ADDON.depot.run({
                        client_code: soldier.code.client,
                        server_code: soldier.code.server,
                        div_id: 'task_' + id,
                        id: id,
                        status: 'background'
                    })
                }
                w2ui['layout_preview_tabs'].click('tab_' + id);
                self.refresh();
            },
            refresh: function() {
               //= 设置侧边栏
               var len = w2ui['layout_preview_tabs'].tabs.length;
               if (len < 1) {
                   w2ui['sidebar'].remove('soldier_task');
                   w2ui['sidebar'].click('soldier_depot');
               }else{
                   w2ui['sidebar'].set('soldier_task', {
                       count: len
                   });
               }
                w2ui['sidebar'].click('soldier_task');
            },
            //- 获取本地保存任务
            getTask: function() {
                var task = localStorage.getItem('task');
                var item = task ? task.split(',') : [],
                    temp = [];
                item.forEach(function(i) {
                    if (i && ADDON.depot.cache[i]) {
                        temp.push(i)
                    };
                })
                return temp;
            },
            //- 保存本地任务
            setTask: function(id) {
                var _task = this.getTask();
                _task.push(id);
                localStorage.setItem('task', _task);
            },
            //- 删除本地任务
            delTask: function(id) {
                var self = this;
                self.clearTask();
                self.getTask().forEach(function(i) {
                    self.setTask(i);
                });
            },
            //- 清空本地任务
            clearTask: function() {
                localStorage.removeItem('task');
            }
        },
        //- 仓库事件
        depot: {
            //@ 编辑器
            editor: {},
            //@ 缓存
            cache: null,
            temp: {},
            //@ 加载UI
            reload: function() {
                var self = this;
                var records = [];
                for (var i in self.cache) {
                    var soldier = self.cache[i];
                    if (soldier) {
                        records.push({
                            recid: records.length + 1,
                            _id: soldier._id,
                            aid: 'ant-' + w2utils.encodeTags(soldier.cms) + '-' + (soldier.aid < 10 ? '0' + soldier.aid : soldier.aid),
                            env: w2utils.encodeTags(soldier.env || '-'),
                            name: w2utils.encodeTags(soldier.name),
                            sell: soldier.sell ? '是' : '否',
                            verify: soldier.sell ? (soldier.verify ? '是' : '否') : '-',
                            ctime: ANT.ftime(soldier.ctime),
                            _ctime: soldier.ctime,
                            utime: ANT.ftime(soldier.utime),
                            style: 'color: ' + (soldier.style.color || (soldier.sell ? (soldier.verify ? 'rgb(22, 144, 61)': 'rgb(195, 45, 9)'): '')) + ';background-color: ' + (soldier.style.bgcolor || '')
                        })
                    };
                }
                w2ui['grid_soldier_depot'].records = records;
                w2ui['grid_soldier_depot'].sort('_ctime', 'desc');
                w2ui['grid_soldier_depot'].refresh();
                setTimeout(function() {
                    w2ui.sidebar.set('soldier_depot', {count: records.length});
                    ADDON.unlock();
                }, 100);
            },
            //@ 加载数据
            refresh: function() {
                var self = this;
                ADDON.content(w2ui['grid_soldier_depot']);
                if (!self.cache) {
                    self.cache = {};
                    ADDON.lock('加载仓库数据中..')
                    $.get('/addons/ant.soldier/depot/data', function(data) {
                        var env = {},
                            cms = {};
                        self.temp.env = [];
                        self.temp.cms = [];
                        data.forEach(function(i) {
                            self.cache[i._id] = i;
                            // env[i.env] = 0;
                            cms[i.cms] = 0;
                        })
                        for (var i in ANT.CONNECT_API.cache) {
                            env[i] = 0;
                        }
                        for (var i in env) {
                            self.temp.env.push(i);
                        }
                        for (var i in cms) {
                            self.temp.cms.push(i);
                        }
                        self.reload();
                        //= 启动上次未关闭的后台应用
                        // ADDON.task.init(ADDON.task.getTask());
                    })
                }
            },
            //@ 添加数据
            add: function() {
                var self = this;
                w2popup.open({
                    title: '<i class="fa fa-plus-circle"></i> 添加兵蚁',
                    body: '<div id="ant_soldier_add_div"></div>',
                    style : 'padding: 15px 0 0 0',
                    modal: true,
                    width: 450,
                    height: 300,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            //- 获取运行环境
                            ADDON.ui.form_soldier.fields[0].options.items = self.temp.env;
                            ADDON.ui.form_soldier.fields[1].options.items = self.temp.cms;
                            //- 显示表单
                            var form = $.extend({}, ADDON.ui.form_soldier, {
                                actions: {
                                    '添加': function() {
                                        var self = this;
                                        if (self.validate().length === 0) {
                                            w2popup.lock('添加兵蚁中..', true);
                                            $.post('/addons/ant.soldier/depot/add', self.record, function(data) {
                                                w2popup.unlock();
                                                if (data.ret) {
                                                    w2popup.close();
                                                    ADDON.success('添加兵蚁成功!');
                                                    ADDON.depot.cache[data.ret._id] = data.ret;
                                                    ADDON.depot.reload();
                                                    ADDON.depot.edit(data.ret._id);
                                                }else{
                                                    ADDON.error('添加兵蚁失败!<br>' + data.err)
                                                }
                                            })
                                        };
                                    }
                                }
                            })
                            $('#ant_soldier_add_div').w2form(form);
                        }
                    },
                    onClose: function(event) {
                        w2ui['form_soldier'].destroy();
                    }
                })
            },
            //@ 删除数据
            del: function(ids) {
                var self = this;
                w2confirm('确定删除所选的(' + ids.length + ')条数据吗?', '<i class="fa fa-trash-o"></i> 删除兵蚁', function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock('删除数据中..');
                        $.post('/addons/ant.soldier/depot/del', {
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
            //@ 强化兵蚁
            edit: function(id) {
                var self = this;
                var soldier = self.cache[id];
                //- 创建窗口
                w2popup.open({
                    title: '<i class="fa fa-edit"></i> 强化兵蚁:<strong class="text-danger">' + w2utils.encodeTags(soldier.name) + '</strong>',
                    body: '<div id="layout_soldier_edit_div" style="width: 100%;height: 100%;"></div>',
                    style: 'padding: 0;',
                    showMax: true,
                    modal: true,
                    width: 900,
                    height: 600,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            // 加载兵蚁调用
                            var _menu = [];
                            for (var c in ADDON.depot.cache) {
                                if (c !== id) {
                                    _menu.push({
                                        id: c,
                                        text: ADDON.depot.cache[c].name,
                                        icon: 'fa fa-puzzle-piece'
                                    });
                                };
                            }
                            w2ui['layout_soldier_edit_left_toolbar'].set('call', {
                                items: _menu,
                                count: _menu.length,
                                disabled: _menu.length === 0
                            });
                            // 
                            $("#layout_soldier_edit_div").w2render(w2ui['layout_soldier_edit']);
                            var jsMode = require('ace/mode/javascript').Mode;
                            // var pyMode = require('ace/mode/python').Mode;
                            // var lgTool = require('ace/ext/language_tools');
                            //- 初始化编辑器:客户端
                            self.editor.client = ace.edit('layout_soldier_edit_client');
                            self.editor.client.setTheme('ace/theme/tomorrow');
                            self.editor.client.session.setMode(new jsMode());
                            self.editor.client.session.setUseWrapMode(true);
                            self.editor.client.session.setValue(soldier.code.client);
                            //- 初始化编辑器:服务端
                            self.editor.server = ace.edit('layout_soldier_edit_server');
                            self.editor.server.setTheme('ace/theme/tomorrow');
                            // self.editor.server.session.setMode((soldier.env === 'python') ?  new pyMode() : new jsMode());
                            self.editor.server.session.setUseWrapMode(true);
                            self.editor.server.session.setValue(soldier.code.server);
                            //- 编辑器自动补全
                            // self.editor.client.setOptions({
                            //     enableBasicAutocompletion: true
                            // })
                            //- 编辑器快捷键
                            [{
                                name: 'saveCmd',
                                bindKey: {
                                    win: 'Ctrl-S',
                                    mac: 'Command-S'
                                },
                                exec: function(editor) {
                                    w2ui['layout_soldier_edit_left_toolbar'].click('save');
                                }
                            }, {
                                name: 'bugCmd',
                                bindKey: {
                                    win: 'Ctrl-E',
                                    mac: 'Command-E'
                                },
                                exec: function(editor) {
                                    w2ui['layout_soldier_edit_left_toolbar'].click('bug');
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
                            //- 编辑器事件
                            self.editor.client.session.on('change', function(e) {
                                //@ 如果编辑器处于最大化，则进行插件的预览
                                w2ui['layout_soldier_edit_left_toolbar'].get('bug').checked
                                ? w2ui['layout_soldier_edit_left_toolbar'].click('bug')
                                // ? self.run({
                                //     client_code: self.editor.client.getValue(),
                                //     server_code: self.editor.server.getValue(),
                                //     div_id: 'layout_soldier_edit_preview',
                                //     id: id,
                                //     status: 'debug'
                                // })
                                : null;
                            })
                            //- 工具栏点击事件
                            w2ui.layout_soldier_edit_left_toolbar.onClick = function(event) {
                                var c_c = self.editor.client.getValue();
                                var s_c = self.editor.server.getValue();
                                switch(event.target) {
                                    case 'save':
                                        //- 保存代码
                                        w2popup.lock('保存代码中..', true);
                                        $.post('/addons/ant.soldier/depot/saveCode', {
                                            id: soldier._id,
                                            client: c_c,
                                            server: s_c
                                        }, function(err) {
                                            w2popup.unlock();
                                            if (err) {
                                                ADDON.error('代码保存失败!<br>' + err);
                                            }else{
                                                soldier.code = {
                                                    client: c_c,
                                                    server: s_c
                                                }
                                                ADDON.success('代码保存成功!');
                                            }
                                        })
                                        break;
                                    case 'bug':
                                        //- 预览代码
                                        var ck = !w2ui['layout_soldier_edit_left_toolbar'].get('bug').checked;
                                        w2ui['layout_soldier_edit'].set('left', {
                                            size: ck ? '60%' : '100%'
                                        });
                                        w2ui['layout_soldier_edit_left_toolbar'].set('bug', {
                                            icon: ck ? 'fa fa-bug fa-spin' : 'fa fa-bug'
                                        })
                                        ck ? self.run({
                                            client_code: c_c,
                                            server_code: s_c,
                                            div_id: 'layout_soldier_edit_preview',
                                            id: id,
                                            status: 'debug'
                                        }) : $('#layout_soldier_edit_preview').html('');
                                        break;
                                    default:
                                        if (event.target.substr(0, 5) === 'call:') {
                                            var _id = event.target.substr(5),
                                                _call = ADDON.depot.cache[_id];
                                            if (_call) {
                                                w2ui['layout_soldier_edit'].lock('left', '解析兵蚁中..', true);
                                                var UI = function() {
                                                    return {
                                                        init: function(opt) {
                                                            var _code = '\nAPI.loadSoldier("' + _id + '", {\n';
                                                            for (var a in opt.argv) {
                                                                _code += '\t// 所需参数:' + (opt.argv[a].caption || a) + '\n';
                                                                _code += '\t' + a + ': "' + (opt.argv[a].default || '') + '",\n';
                                                            };
                                                            _code += '}, function(data) {\n\t\n})\n';
                                                            self.editor.client.insert(_code);
                                                        }
                                                    }
                                                },
                                                    plugin = eval(_call.code.client);
                                                plugin(new UI, {});
                                                w2ui['layout_soldier_edit'].unlock('left');
                                            }else{
                                                ADDON.error('调用的兵蚁不存在!');
                                            }
                                        };
                                }
                            }
                            w2ui['layout_soldier_edit_left_tabs'].click('client');
                            w2popup.toggle();
                        }
                    },
                    onToggle: function(event) {
                        event.onComplete = function() {
                            w2ui['layout_soldier_edit'].set('left', {
                                size: w2ui['layout_soldier_edit_left_toolbar'].get('bug').checked
                                    ? '60%'
                                    : '100%'
                            })
                            w2ui['layout_soldier_edit'].resize();
                            self.editor.client.resize();
                            self.editor.server.resize();
                        }
                    },
                    onClose: function(event) {
                        this.onMin(event);
                    },
                    onMin: function(event) {
                        event.onComplete = function() {
                            w2ui['layout_soldier_edit_left_toolbar'].get('bug').checked
                                ? w2ui['layout_soldier_edit_left_toolbar'].click('bug')
                                : null;
                        }
                    }
                })
            },
            //@ 更改设置
            reset: function(id) {
                var self = this;
                var soldier = self.cache[id];
                w2popup.open({
                    title: '<i class="fa fa-pencil"></i> 更改设置',
                    body: '<div id="ant_soldier_set_form"></div>',
                    style : 'padding: 15px 0 0 0',
                    modal: true,
                    width: 450,
                    height: 300,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            //- 获取运行环境
                            ADDON.ui.form_soldier.fields[0].options.items = self.temp.env;
                            ADDON.ui.form_soldier.fields[1].options.items = self.temp.cms;
                            //- 显示表单
                            var form = $.extend({}, ADDON.ui.form_soldier, {
                                record: {
                                    env: {
                                        id: soldier.env,
                                        text: soldier.env
                                    },
                                    cms: soldier.cms,
                                    name: soldier.name,
                                    desc: soldier.desc
                                },
                                actions: {
                                    '保存': function() {
                                        var self = this;
                                        if (self.validate().length === 0) {
                                            w2popup.lock('保存兵蚁中..', true);
                                            $.post('/addons/ant.soldier/depot/save', $.extend(self.record, {
                                                id: id
                                            }), function(data) {
                                                console.log(data);
                                                w2popup.unlock();
                                                if (data.ret) {
                                                    w2popup.close();
                                                    ADDON.success('保存兵蚁成功!');
                                                    ADDON.depot.cache[data.ret._id] = data.ret;
                                                    ADDON.depot.reload();
                                                    // ADDON.depot.edit(data.ret._id);
                                                }else{
                                                    ADDON.error('保存兵蚁失败!<br>' + data.err)
                                                }
                                            })
                                        };
                                    }
                                }
                            })
                            $('#ant_soldier_set_form').w2form(form);
                        }
                    },
                    onClose: function(event) {
                        w2ui['form_soldier'].destroy();
                    }
                })
            },
            //@ 加载兵蚁
            load: function(id) {
                var self = this;
                var soldier = self.cache[id];
                //- 加载窗口
                w2popup.open({
                    title: '<strong class="text-info"><i id="layout_soldier_load_div_icon" class="fa fa-spinner fa-spin"></i> ' + w2utils.encodeTags(soldier.name) + '</strong>',
                    body: '<div id="layout_soldier_load_div" style="width: 100%;height: 100%;"></div>',
                    style: 'padding: 0;',
                    showMax: true,
                    modal: true,
                    width: 600,
                    height: 450,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            self.run({
                                client_code: soldier.code.client,
                                server_code: soldier.code.server,
                                div_id: 'layout_soldier_load_div',
                                id: id,
                                status: 'running'
                            })
                        }
                    },
                    onToggle: function(event) {
                        event.onComplete = function() {
                            w2ui['layout_soldier_load_div'] ? w2ui['layout_soldier_load_div'].resize() : null;
                        }
                    },
                    onMin: function(event) {
                        this.onToggle(event);
                    },
                    onMax: function(event) {
                        this.onToggle(event);
                    }
                })
            },
            //@ 执行兵蚁
            run: function(opt) {
                function msg(obj) {
                    $('#' + opt.div_id).html(
                        '<div align="center" id="soldier_error">' +
                        //- 图标
                        '   <i class="' + obj.icon + '"></i>' +
                        '   <hr/>' +
                        //- 错误提示
                        '   <strong>' + (obj.title || '加载兵蚁失败!') + '</strong>' +
                        //- 错误信息
                        '   <p>' + (obj.msg || '') + '</p>' + 
                        '</div>'
                    )
                }
                try{
                    msg({
                        icon: 'fa fa-spinner fa-pulse',
                        title: '加载兵蚁中'
                    })
                    var soldier = this.cache[opt.id];
                    var client = eval(opt.client_code);
                    if (!ANT.CONNECT_API.cache[soldier.env]) {
                        throw('无法加载运行环境:' + soldier.env);
                    }else{
                        var API = new function() {
                            return ANT.CONNECT_API.cache[soldier.env];
                        }
                        API.connect(
                            //- 连接成功
                            function() {
                                client(new ANT.SOLDIER_UI(opt.id, opt.div_id, opt.status), API, opt.server_code);
                            },
                            //- 连接失败
                            function() {
                                msg({
                                    icon: 'fa fa-frown-o',
                                    msg: '无法连接运行环境:' + soldier.env
                                })
                            },
                            //- 没有配置
                            function() {
                                msg($.extend({}, {
                                    icon: 'fa fa-coffee',
                                    msg: '请先配置好运行环境'
                                }))
                            }
                        )
                    }
                }catch(e) {
                    var m = typeof(e) === 'string' ? e : e.message;
                    msg({
                        icon: 'fa fa-frown-o text-danger',
                        msg: m
                    })
                    return false;
                }
            },
            //@ 出售兵蚁
            sell: function(id) {
                var self = this;
                var soldier = self.cache[id];
                w2popup.open({
                    title: '<i class="fa fa-money"></i> 出售兵蚁',
                    width: 400,
                    height: 250,
                    modal: true,
                    body: '<div id="form_soldier_sell" style="width:100%;height:100%;"></div>',
                    style: 'padding:50px 0 0 0;',
                    onOpen: function(event) {
                        event.onComplete = function() {
                            w2ui['form_soldier_sell'].actions['Submit'] = function() {
                                if (this.validate().length === 0) {
                                    w2popup.lock('提交出售中..', true);
                                    $.post('/addons/ant.soldier/depot/sell', {
                                        id: id,
                                        coin: this.record.coin
                                    }, function(data) {
                                        w2popup.close();
                                        if (data.ret) {
                                            ADDON.success('发布出售成功!请耐心等待审核!');
                                            soldier.sell = true;
                                            soldier.verify = false;
                                            ADDON.depot.reload();
                                        }else{
                                            ADDON.error('发布出售失败!<br>' + data.err);
                                        }
                                    })
                                };
                            }
                            $('#form_soldier_sell').w2render(w2ui['form_soldier_sell']);
                        }
                    }
                })
            },
            //@ 取消出售
            cancelSell: function(id) {
                var soldier = this.cache[id];
                w2confirm('确定取消出售所选兵蚁?', function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock('取消出售中..');
                        $.post('/addons/ant.soldier/depot/cancelsell', {
                            id: id
                        }, function(data) {
                            ADDON.unlock();
                            if (data.ret) {
                                ADDON.success('取消出售成功!');
                                soldier.sell = false;
                                soldier.verify = false;
                                ADDON.depot.reload();
                            }else{
                                ADDON.error('取消出售失败!<br>' + data.err);
                            }
                        })
                    };
                })
            }
        },
        //- 市场事件
        market: {
            cache: null,
            reload: function() {
                var self = this;
                var records = [];
                for (var i in self.cache) {
                    var soldier = self.cache[i];
                    if (soldier) {
                        records.push({
                            recid: records.length + 1,
                            _id: soldier._id,
                            aid: 'ant-' + soldier.cms + '-' + (soldier.aid < 10 ? '0' + soldier.aid : soldier.aid),
                            env: w2utils.encodeTags(soldier.env || '-'),
                            name: w2utils.encodeTags(soldier.name),
                            user: soldier.user ? w2utils.encodeTags(soldier.user.nickname) : '<已删除>',
                            coin: soldier.coin,
                            buys: (soldier.members || []).length,
                            utime: ANT.ftime(soldier.utime),
                            _utime: soldier.utime,
                            style: 'color: ' + (soldier.style.color || '') + ';background-color: ' + (soldier.style.bgcolor || '')
                        })
                    };
                }
                w2ui['grid_soldier_market'].records = records;
                w2ui['grid_soldier_market'].sort('_utime', 'desc');
                w2ui['grid_soldier_market'].refresh();
                setTimeout(function() {
                    w2ui.sidebar.set('soldier_market', {count: records.length});
                    ADDON.unlock();
                }, 100);
            },
            refresh: function() {
                var self = this;
                ADDON.content(w2ui['grid_soldier_market']);
                if (!self.cache) {
                    self.cache = {};
                    ADDON.lock('加载市场数据中..')
                    $.get('/addons/ant.soldier/market/data', function(data) {
                        data.forEach(function(i) {
                            self.cache[i._id] = i;
                        })
                        self.reload();
                    })
                }
            },
            //@ 简介说明
            desc: function(recid) {
                w2ui['grid_soldier_market'].toggle(recid);
            },
            //@ 购买兵蚁
            buy: function(id) {
                var self = this;
                var soldier = self.cache[id];
                w2confirm('确定使用(<strong class="text-danger">' + soldier.coin + '</strong>)蚁币购买此兵蚁?', '<i class="fa fa-cart-plus"></i> 购买兵蚁', function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock('购买兵蚁中..');
                        $.post('/addons/ant.soldier/market/buy', {
                            id: id
                        }, function(data) {
                            ADDON.unlock();
                            if (data.ret) {
                                ADDON.success('购买成功!');
                                w2ui['sidebar'].dblClick('soldier_market');
                                setTimeout(function() {
                                    w2ui['sidebar'].dblClick('soldier_depot');
                                    w2ui['sidebar'].select('soldier_depot');
                                }, 200);
                            }else{
                                ADDON.error('购买失败!<br>' + data.err);
                            }
                        })
                    };
                })
            },
            //@ 兵蚁交流
            comment: function(id) {
                var self = this,
                    soldier = self.cache[id];
                w2popup.open({
                    title: '<i class="fa fa-comments"></i> 讨论交流:<strong class="text-danger">' + w2utils.encodeTags(soldier.name) + '</strong>',
                    style: 'padding: 0',
                    width: 800,
                    height: 600,
                    modal: true,
                    showMax: true,
                    body: '<div class="comment" id="comment_' + id + '">' +
                    '<blockquote>' + w2utils.encodeTags(soldier.desc || '<暂无简介>').replace(/\n/g, '<br>') +
                    '<small>' + w2utils.encodeTags(soldier.user.nickname || '<用户已删除>') +
                    '</small></blockquote>' +
                    '</div>',
                    onOpen: function(event) {
                        event.onComplete = function() {
                            $('#comment_' + id).comment({
                                key: id,
                                url: '#!/market/comment/' + id,
                                title: '交易市场 - ' + soldier.name
                            })
                        }
                    }
                })
            }
        }
    };
    ANT.initAddon({
        id: 'ant_soldier',
        libs: {
            js: ['/addons/ant.soldier/api.ui.js', '/addons/ant.soldier/api.connect.js', '/addons/ant.soldier/md5.js'],
            css: ['/addons/ant.soldier/client.css']
        },
        text: '兵蚁工厂',
        group: true,
        expanded: true,
        nodes: [
            {
                id: 'soldier_market',
                text: '交易市场',
                icon: 'fa fa-folder-o',
                onClick: function() {
                    ADDON.market.refresh();
                },
                onDblClick: function() {
                    delete ADDON.market.cache;
                    ADDON.market.refresh();
                }
            }, {
                id: 'soldier_depot',
                text: '个人仓库',
                icon: 'fa fa-folder-o',
                onClick: function() {
                    ADDON.depot.refresh();
                },
                onDblClick: function() {
                    delete ADDON.depot.cache;
                    ADDON.depot.refresh();
                }
            }
        ]
    }, ADDON)
})(jQuery)