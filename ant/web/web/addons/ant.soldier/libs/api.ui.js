;(function($, ANT) {
    //- 兵蚁界面API
    //@ id: 显示UI的div ID
    //@ status: 当前运行状态(running,debug,background)
    ANT.SOLDIER_UI = function(aid, id, status) {
        var UI = {
            id: id,
            aid: aid,
            dom: $('#' + id),
            //= W2form UI
            form: function(opt) {
                //= 创建layout
                w2ui[id] ? w2ui[id].destroy() : null;
                $().w2layout({
                    name: id,
                    panels: [
                        //-    上层:输入界面
                        {
                            size: '100%',
                            type: 'main',
                            style: 'border: 1px solid #dfdfdf;',
                            // content: '<div id="layout_soldier_input" style="width: 100%;height: 100%;"></div>',
                            resizable: true
                        },
                        //-    下层:输出界面
                        {
                            size: '50%',
                            type: 'preview',
                            hidden: true,
                            style: 'border: 1px solid #dfdfdf;',
                            content: '<div id="output_' + id + '" style="width: 100%;height: 100%;"></div>',
                            resizable: true,
                            toolbar: {
                                items: [{
                                    id: 'up',
                                    type: 'button',
                                    caption: '拉伸',
                                    icon: 'fa fa-chevron-up',
                                    onClick: function() {
                                        this.hide('up');
                                        this.show('down');
                                        w2ui[id].set('preview', {
                                            size: '100%'
                                        })
                                    }
                                }, {
                                    id: 'down',
                                    type: 'button',
                                    caption: '退下',
                                    hidden: true,
                                    icon: 'fa fa-chevron-down',
                                    onClick: function() {
                                        this.hide('down');
                                        this.show('up');
                                        w2ui[id].set('preview', {
                                            size: '50%'
                                        })
                                    }
                                }, {
                                    type: 'break'
                                }, {
                                    type: 'button',
                                    caption: '隐藏',
                                    icon: 'fa fa-eye-slash',
                                    onClick: function() {
                                        w2ui[id].hide('preview');
                                    }
                                }, {
                                    type: 'break'
                                }, {
                                    type: 'button',
                                    caption: '清空',
                                    icon: 'fa fa-trash-o',
                                    onClick: function() {
                                        editor.session.setValue('');
                                    }
                                }, {
                                    type: 'break'
                                }, {
                                    type: 'button',
                                    caption: '导出',
                                    icon: 'fa fa-download',
                                    onClick: function() {
                                        ANT.CONNECT_API.apis.base.save('dump_' + new Date().getTime() + '.log', editor.session.getValue());
                                    }
                                }]
                            }
                        }
                    ],
                    onResize: function(e) {
                        e.onComplete = function() {
                            editor ? editor.resize() : null;
                        }
                    }
                })
                //= 显示UI
                $('#' + id).w2render(w2ui[id]);
                //= 创建form
                var form_id = id + '_form';
                w2ui[form_id] ? w2ui[form_id].destroy() : null;
                w2ui[id].content('main', $().w2form($.extend({}, {
                    name: form_id,
                    focus: -1,
                    style: 'border: 0px;background-color: transition;'
                }, opt)));
                var editor = UI.editor('output_' + id);
                return {
                    form: w2ui[form_id],
                    //- 锁定表单界面
                    lock: function(msg) {
                        w2ui[id].lock('main', msg || '执行中..', true);
                        return this;
                    },
                    //- 解锁表单界面
                    unlock: function() {
                        w2ui[id].unlock('main');
                        return this;
                    },
                    log: function(m) {
                        //- 显示输出界面
                        w2ui[id].get('preview').hidden ? w2ui[id].show('preview') : null;
                        //- 设置日志编辑器内容
                        var _log = editor.session.getValue();
                        editor.session.setValue(_log + (_log ? ('\n' + m) : m));
                        editor.gotoLine(editor.session.getLength());
                        return this;
                    },
                    clear: function() {
                        editor.session.setValue('');
                        return this;
                    }
                }
            },
            init: function(opt) {
                //    初始化输入框数组
                var fields = [];
                var record = {};
                var inputs = opt.argv || {};
                for (var i in inputs) {
                    var _id = id + '_input_' + i;
                    fields.push({
                        field: _id,
                        type: inputs[i].type || 'text',
                        required: inputs[i].require || true,
                        html: {
                            caption: inputs[i].caption || i + '参数',
                            attr: 'style="width: 90%;"' + (inputs[i].type === 'textarea' ? ' rows="5"' : '')
                        },
                        options: {
                            items: (typeof(inputs[i].items) === 'object') ? inputs[i].items : []
                        }
                    })
                    record[_id] = inputs[i].default || '';
                }
                var ui = new this.form({
                    fields: fields,
                    record: record,
                    toolbar: {
                        items: [{
                            id: 'run',
                            type: 'button',
                            icon: 'fa fa-play-circle',
                            caption: '运行',
                            onClick: function() {
                                var rec = {};
                                for (var i in ui.form.record) {
                                    rec[i.replace(id + '_input_', '')] = ui.form.record[i];
                                }
                                return (ui.form.validate().length === 0) ? opt.run(rec, ui.log) : null;
                            }
                        }, {
                            type: 'break'
                        }, {
                            id: 'about',
                            type: 'button',
                            icon: 'fa fa-heart',
                            caption: '关于',
                            hidden: !opt.info,
                            onClick: function() {
                                ui.log('# 关于信息\n- - -');
                                for (var i in opt.info) {
                                    ui.log('**' + i + '**\t' + opt.info[i]);
                                }
                            }
                        }]
                    }
                });
                return ui;
            },
            //= 更改窗口大小
            resize: function(width, height) {
                (status === 'running') ? w2popup.resize(width, height) : null;
                return this;
            },
            //= 显示|隐藏最大化按钮
            showMax: function(is_max) {
                var max_btn = $('.w2ui-msg-button.w2ui-msg-max');
                (status === 'running') ? (is_max ? max_btn.show() : max_btn.hide()) : null;
                return this;
            },
            //= 最大化窗口
            max: function() {
                (status === 'running') ? w2popup.max() : null;
                return this;
            },
            //= 最小化窗口
            min: function() {
                (status === 'running') ? w2popup.min() : null;
                return this;
            },
            //= 设置图标
            setIcon: function(icon) {
                $('#' + this.id + '_icon').attr('class', 'fa fa-' + icon);
                return this;
            },
            //= 锁定消息
            lock: function(msg) {
                (w2popup.status === 'open')
                    ? w2popup.lock(msg, true)
                    : w2ui['layout'].lock((status === 'background') ? 'preview' : 'main', msg, true);
                return this;
            },
            //= 解除锁定
            unlock: function() {
                (w2popup.status === 'open')
                    ? w2popup.unlock()
                    : w2ui['layout'].unlock((status === 'background') ? 'preview' : 'main');
                return this;
            },
            //= 加载iframe
            iframe: function(url, width, height) {
                var self = this;
                self.lock('加载中..');
                self.dom.css('overflow', 'hidden');
                var frame = $('<iframe src="' + url + '" style="width: ' + (width || '100%') + ';height: ' + (height || '100%') + '" border="0" frameborder="no" id="' + self.id + '_iframe">');
                frame.on('load', function() {
                    self.unlock();
                })
                //= 超时处理
                setTimeout(function() {
                    self.unlock();
                }, 2000);
                self.dom.html(frame);
                return self;
            },
            //= 生成编辑器
            editor: function(div) {
                var editor = ace.edit(div || id),
                    mdMode = require('ace/mode/markdown').Mode;
                editor.setTheme('ace/theme/tomorrow');
                editor.setReadOnly(true);
                editor.session.setMode(new mdMode());
                editor.session.setUseWrapMode(true);
                return editor;
            }
        }
        return UI;
    }
})(jQuery, ANT);