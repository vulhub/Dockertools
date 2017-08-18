;(function($, undefined) {
    var ADDON = {
        init: function() {},
        register: function() {
            w2popup.open({
                title: '<i class="fa fa-user-plus"></i> 注册开关',
                style: 'padding: 0',
                width: 500,
                height: 300,
                modal: true,
                body: '<div id="admin_register_div" style="width:100%;height:100%;"></div>',
                onOpen: function(event) {
                    event.onComplete = function() {
                        w2ui['admin_register_form'] ? w2ui['admin_register_form'].destroy() : null;
                        $.get('/addons/ant.admin/register/data', function(data) {
                            if (data.err) {
                                return ADDON.error('获取失败!<br>' + data.err);
                            }
                            $('#admin_register_div').w2form({
                                name: 'admin_register_form',
                                fields: [{
                                    field: 'status',
                                    type: 'checkbox',
                                    html: {
                                        caption: '开放注册'
                                    }
                                }, {
                                    field: 'msg',
                                    type: 'textarea',
                                    html: {
                                        caption: '关闭信息',
                                        attr: 'rows="5" style="width:80%"'
                                    }
                                }],
                                record: {
                                    status: data.ret.register_on,
                                    msg: data.ret.register_msg
                                },
                                actions: {
                                    '保存' : function() {
                                        $.post('/addons/ant.admin/register/save', this.record, function(data) {
                                            if (data.ret) {
                                                ADDON.success('保存成功!');
                                                w2popup.close();
                                            }else{
                                                ADDON.error('保存失败!<br>' + data.err);
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    }
                }
            })
        }
    };
    ANT.initAddon({
        id: 'ant_admin',
        text: '后台管理',
        group: true,
        expanded: true,
        nodes: [{
            id: 'admin_register',
            icon: 'fa fa-user-plus',
            caption: '注册开关',
            onClick: ADDON.register
        }]
    }, ADDON)
})(jQuery)