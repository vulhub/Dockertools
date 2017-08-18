//
//  虽然不是处女座，但还是有代码洁癖！
//        ___  _ _  ___ 
//       | . || \ ||_ _|
//       |   ||   | | | 
//       |_|_||_\_| |_| 
//

;(function($, ANT){
    var API = $.extend({}, ANT.CONNECT_API.apis, {
        config: {
            desc: '浏览器客户端API脚本，无须进行任何设置(推荐使用Chrome)'
        },
        connect: function(yes, no, faild) {
            yes();
        },
    })
    ANT.CONNECT_API.reg('browser', API)
})(jQuery, ANT)