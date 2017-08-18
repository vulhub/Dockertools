;(function($, undefined) {
    var editor;
    $().w2layout({
        name: 'layout_setting_config',
        panels: [{
            type: 'main',
            size: '100%',
            toolbar: {
                items: [
                    { id: 'save_local', type: 'button', caption: '本地保存', icon: 'fa fa-save', hint: '保存设置到本地【Ctrl+S】' },
                    { type: 'break' },
                    { id: 'load_local', type: 'button', caption: '加载本地', icon: 'fa fa-database', hint: '加载本地保存数据' },
                    { type: 'break' },
                    { id: 'save_remote', type: 'button', caption: '云端保存', icon: 'fa fa-cloud-upload', hint: '保存设置到服务器【Ctrl+F】' },
                    { type: 'break' },
                    { id: 'load_remote', type: 'button', caption: '加载云端', icon: 'fa fa-cloud-download', hint: '加载云端保存数据' },
                    { type: 'break' },
                    { id: 'reset', type: 'button', caption: '重置', icon: 'fa fa-refresh', hint: '重置设置为初始项' },
                ],
                onClick: function(event) {
                    switch(event.target) {
                        case 'save_local':
                            try{
                                ANT.CONNECT_API.saveLocal(editor.session.getValue()).loadLocal();
                                toastr.success('成功保存配置到本地!', 'Success');
                            }catch(e) {
                                toastr.error('保存配置到本地失败!<br>' + e.message, 'Error');
                            }
                            break;
                        case 'load_local':
                            editor.session.setValue(
                                JSON.stringify(ANT.CONNECT_API.getData(true), null, '\t')
                            );
                            break;
                        case 'save_remote':
                            w2ui['layout'].lock('main', '保存云端配置中..', true);
                            $.post('/addons/ant.setting.config/config', {
                                config: editor.session.getValue()
                            }, function(data) {
                                w2ui['layout'].unlock('main');
                                if (!data.err) {
                                    toastr.success('成功保存配置到云端!', 'Success');
                                }else{
                                    toastr.error('保存配置到云端失败!<br>' + data.err, 'Error');
                                }
                            })
                            break;
                        case 'load_remote':
                            w2ui['layout'].lock('main', '加载云端配置中..', true);
                            $.get('/addons/ant.setting.config/config', function(data) {
                                w2ui['layout'].unlock('main');
                                if (!data.err) {
                                    editor.session.setValue(data.config);
                                    toastr.success('加载云端配置成功!', 'Success');
                                }else{
                                    toastr.error('加载云端配置失败!<br>' + data.err, 'Error');
                                }
                            })
                            break;
                        case 'reset':
                            editor.session.setValue(JSON.stringify(ANT.CONNECT_API.getData(false), null, '\t'));
                            break;
                    }
                }
            },
            content: '<div id="setting_config_editor" style="width:100%;height:100%;"></div>'
        }],
        onRender: function(event) {
            event.onComplete = function() {
                //= 初始化编辑器
                var mode = require('ace/mode/javascript').Mode;
                editor = ace.edit('setting_config_editor');
                editor.setTheme('ace/theme/tomorrow');
                editor.session.setMode(new mode());
                editor.session.setUseWrapMode(true);
                //= 编辑器快捷键
                [{
                    name: 'saveLocal',
                    bindKey: {
                        win: 'Ctrl-S',
                        mac: 'Command-S'
                    },
                    exec: function(editor) {
                        w2ui['layout_setting_config_main_toolbar'].click('save_local');
                    }
                }, {
                    name: 'saveRemote',
                    bindKey: {
                        win: 'Ctrl-F',
                        mac: 'Command-F'
                    },
                    exec: function() {
                        w2ui['layout_setting_config_main_toolbar'].click('save_remote');
                    }
                }].forEach(function(key) {
                    editor.commands.addCommand(key);
                })
                //= 获取连接API列表
                editor.session.setValue(JSON.stringify(ANT.CONNECT_API.getData(true), null, '\t'));
            }
        }
    });
    w2ui['sidebar'].add('ant_setting', {
        id: 'setting_config',
        text: '环境配置',
        icon: 'fa fa-file-o',
        onClick: function() {
            w2ui['layout'].content('main', w2ui['layout_setting_config']);
        }
    })
})(jQuery)