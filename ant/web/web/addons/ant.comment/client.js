//
//  蚁逅:评论插件
//
var duoshuoQuery = {
    short_name: 'antoor'
}
;(function($) {
    $('head').append('<link href="/addons/ant.comment/client.css" rel="stylesheet">');
    $('head').append('<script src="/addons/ant.comment/duoshuo.js"></script>');
    $.fn.comment = function(opt) {
        var el = document.getElementById(this[0].id);
        el.setAttribute('data-thread-key', opt.key);
        el.setAttribute('data-url', 'http://root.cool/' + opt.url);
        el.setAttribute('data-title', 'ANT | ' + opt.title);
        DUOSHUO.EmbedThread(el);
    }
})(jQuery);