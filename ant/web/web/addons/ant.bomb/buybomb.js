;(function($, undefined) {
    var ADDON = {
        html: '<div style="padding:30px;">' +
        '    <div align="center">' +
        '        <embed src="http://player.youku.com/player.php/sid/XMTI0OTYzNzMyMA==/v.swf" allowFullScreen="true" quality="high" width="640" height="400" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed>' +
        '        <hr/>' +
        '        <button class="btn btn-green" id="bomb_buy_btn"><i class="fa fa-money"></i> 点击购买</button>' +
        '    </div>' +
        '    <div>' +
        '        <blockquote>蚁弹超人，一切皆有可能！<small>2015/06/06</small></blockquote>' +
        '        <p><strong>蚁弹超人是一款超前、有趣、实用的XSS学习平台。</strong></p>' +
        '        <p>如果你从未听说过，那么上边的视频会带你去了解；如果你想购买这个平台的使用权，请点击上边的购买按钮。</p>' +
        '        <p class="text-info">付费使用，一是为了维持服务器域名等其他消费，二是为了防止伸手党用于非法用途，三呢，是为了作者辛苦的付出。</p>' +
        '        <p class="text-danger"><strong>温馨提示：蚁弹超人仅提供给爱好者学习交流以及合法的渗透测试使用，切勿用于其他非法用途，否则一经发现立即删除帐号，且由此带来的风险由用户自行承担！</p>' +
        '    </div>' +
        '</div>',
        init: function() {},
        load: function() {
            var self = this;
            ADDON.content(self.html);
            setTimeout(function() {
                $('#bomb_buy_btn').click(function() {
                    self.buy();
                });
            }, 200);
        },
        buy: function() {
            w2confirm('确定消费<code>99</code>蚁币购买蚁弹超人?', '<i class="fa fa-money"></i> 购买', function(btn) {
                if (btn !== 'Yes') { return false };
                ADDON.lock('购买中..');
                $.post('/addons/ant.bomb/buy', {}, function(data) {
                    ADDON.unlock();
                    if (data.ret) {
                        ADDON.success('恭喜购买成功!');
                        ADDON.lock('刷新页面中..');
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    }else{
                        ADDON.error('购买失败!<br>' + data.err);
                    }
                })
            })
        }
    };
    ANT.initAddon({
        id: 'ant_bomb',
        text: '蚁弹超人',
        group: true,
        expanded: true,
        nodes: [{
            id: 'bomb_buy',
            text: '购买授权',
            icon: 'fa fa-bomb',
            onClick: function() {
                ADDON.load();
            }
        }]
    }, ADDON)
})(jQuery)