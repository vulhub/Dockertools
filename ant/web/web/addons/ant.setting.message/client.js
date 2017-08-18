;(function($) {
    w2ui['sidebar'].add('ant_setting', {
        id: 'setting_message',
        text: '留言交流',
        icon: 'fa fa-comment-o',
        onClick: function() {
            w2ui['layout'].content('main', '<div id="setting_message_div" align="center" style="padding: 10px;"></div>');
            $('#setting_message_div').comment({
                key: 'comment',
                url: '#!/setting/message',
                title: '留言交流'
            })
        }
    })
})(jQuery)