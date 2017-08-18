//
//  6.1儿童节快乐 :)
//  虽然早已长大
//

;(function($, undefined) {
    var layout = {
        name: 'setting_payment_layout',
        panels: [{
            type: 'main',
            content: '<div id="setting_payment_tabs" style="width:100%;"></div><div id="setting_payment_selected" style="padding:10px;">test</div>',
            tabs: {
                tabs: [
                    { id: 'weixin', caption: '<i class="fa fa-wechat"></i> 微信支付' },
                    { id: 'wooyun', caption: '<i class="fa fa-cloud"></i> 乌云币支付' },
                    { id: 'about', caption: '<i class="fa fa-info-circle"></i> 充值说明' }
                ],
                onClick: function(event) {
                    var html = '';
                    switch(event.target) {
                        case 'weixin':
                            html = '<h3>直接二维码支付</h3>' + 
                                '<div align="center"><img src="/ant/img/wechat_paycode.jpg" style="width: 414px;height: 442px;border: 1px solid #000;box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);"/></div>' +
                                '<h3>或者通过转账方式</h3>' +
                                '<h4>1、添加蚁逅为好友</h4>' +
                                '<div align="center"><img src="/ant/img/wechat.jpg" style="width: 300px;height: 300px;border: 1px solid #000;box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);"/><p style="color: #999;padding: 15px;font-size: 16px;">扫码或搜索微信号：<code>root_cool</code></p></div>' +
                                '<h4>2、添加成功后转账并附上你注册的邮箱地址</h4>' +
                                '<div align="center"><img src="/ant/img/wechat_pay.png" style="width:300px;border: 1px solid #000;box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);"/></div>' +
                                '<h4>3、注意事项</h4>' +
                                '<blockquote class="text-warning">转账数额为你充值的蚁币数额，零头不计。<small>因蚁逅不一定在线，所以请确认添加好友成功后再进行转账，充值成功会自动回复 :)</small></blockquote>';
                            break;
                        case 'wooyun':
                            html = '<blockquote>蚁逅在乌云：<a href="http://www.wooyun.org/whitehats/%E8%9A%81%E9%80%85" target="_blank">http://www.wooyun.org/whitehats/蚁逅</a></blockquote>' +
                                '<h3>充值方式</h3>' +
                                '<p>登录你的乌云帐号->进入控制面板->乌云币->我要转账</p>' +
                                '<div align="center"><img src="/ant/img/wooyun_pay.jpg"/></div>' +
                                '<h3>充值说明</h3>' +
                                '<blockquote>10乌云币=100蚁币。<br>转载完毕请联系本人告知你的乌云帐号以及在蚁逅中注册的邮箱地址。</blockquote>'
                            break;
                        case 'about':
                        default:
                            html = '<h4>1、充值方式</h4>' +
                                   '<p>用户可以在蚁逅这个平台里出售自己的兵蚁、插件等赚取蚁币。<br>也可以通过现在暂时支持的支付方式进行充值，未来还有可能支持其他各种币之间的兑换等。</p>' +
                                   '<p>时间紧迫，随手写了个简单的"支付页面"，用户可通过标签栏选择自己喜欢的方式来进行蚁币充值。<br>每个充值方式都有详细说明，如果有不懂的或者其他问题欢迎联系我！</p>' +
                                   '<h4>2、蚁币换算</h4>' +
                                   '<p class="text-danger">1蚁币=1RMB</p>' +
                                   '<p>用户需要充多少就转多少(零头去掉)</p>' +
                                   '<h4>3、蚁币作用</h4>' +
                                   '<p>蚁币可以用来购买用户在交易市场中出售的兵蚁，也可以用来购买蚁弹超人的使用权以及蚁弹超人插件，未来还可以进行购买各种有趣好玩的实物。</p>' +
                                   '<h4>*、联系本人</h4>' +
                                   '<p>充值成功或者其他关于蚁币充值的事情咨询请联系本人：<br>QQ：1422212280<br>微信：root_cool<br>微博：<a href="http://weibo.com/antoor" target="_blank">http://weibo.com/antoor</a></p>';
                    }
                    $('#setting_payment_selected').html(html);
                }
            }
        }],
        onRender: function(event) {
            event.onComplete = function() {
                w2ui['setting_payment_layout_main_tabs'].click('about');
            }
        }
    }
    $().w2layout(layout);

    w2ui['sidebar'].add('ant_setting', {
        id: 'setting_payment',
        text: '蚁币充值',
        icon: 'fa fa-money',
        onClick: function() {
            w2ui['layout'].content('main', w2ui['setting_payment_layout']);
        }
    })
})(jQuery)