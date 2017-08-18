/* 
 * Context.js
 * Copyright Jacob Kelley
 * MIT License
 * 根据bootstrap-contextmenu.js修改
 */
;(function($) {
    $('head').append('<link href="/addons/ant.bmenu/client.css" rel="stylesheet">');
    var context = context || (function () {
        
        var options = {
            fadeSpeed: 100,
            filter: function ($obj) {
                // Modify $obj, Do not return
            },
            above: 'auto',
            preventDoubleContext: false,//true,
            compress: true,//false
        };

        function initialize(opts) {
            
            options = $.extend({}, options, opts);
            
            $(document).on('click', 'html', function () {
                $('._dropdown-context').fadeOut(options.fadeSpeed, function(){
                    $('._dropdown-context').css({display:''}).find('.drop-left').removeClass('drop-left');
                });
            });
            if(options.preventDoubleContext){
                $(document).on('contextmenu', '._dropdown-context', function (e) {
                    e.preventDefault();
                });
            }
            $(document).on('mouseenter', '._dropdown-submenu', function(){
                var $sub = $(this).find('._dropdown-context-sub:first'),
                    subWidth = $sub.width(),
                    subLeft = $sub.offset().left,
                    collision = (subWidth+subLeft) > window.innerWidth;
                if(collision){
                    $sub.addClass('drop-left');
                }
            });
            
        }

        function updateOptions(opts){
            options = $.extend({}, options, opts);
        }

        function buildMenu(data, id, subMenu) {
            var subClass = (subMenu) ? ' _dropdown-context-sub' : '',
                compressed = options.compress ? ' compressed-context' : '',
                $menu = $('<ul class="_dropdown-menu _dropdown-context' + subClass + compressed+'" id="dropdown-' + id + '"></ul>');
            var i = 0, linkTarget = '';
            for(i; i<data.length; i++) {
                if (typeof data[i].divider !== 'undefined') {
                    $menu.append('<li class="_divider"></li>');
                } else if (typeof data[i].header !== 'undefined') {
                    $menu.append('<li class="_nav-header">' + data[i].header + '</li>');
                } else {
                    //= 链接
                    if (typeof data[i].href == 'undefined') {
                        data[i].href = 'javascript:;';
                    }
                    //= 链接打开方式
                    if (typeof data[i].target !== 'undefined') {
                        linkTarget = ' target="'+data[i].target+'"';
                    }
                    //= 子菜单
                    if (typeof data[i].subMenu !== 'undefined') {
                        var temp = '<li class="' + (data[i].disabled ? ' disabled' : '_dropdown-submenu') + '"><a tabindex="-1" href="' + data[i].href + '">';
                        temp += data[i].icon ? ('<i class="_left ' + data[i].icon + '"></i> ') : '';
                        // temp += data[i].count ? (' <span class="_right pull-right badge">' + (data[i].count || '') + '</span>') : '';
                        temp += data[i].text;
                        temp += '</a></li>';
                        $sub = (temp);
                    } else {
                        var temp = '<li' + (data[i].disabled ? ' class="disabled"' : '') + '>';
                        temp += '<a tabindex="-1" href="' + data[i].href + '"'+linkTarget+'>';
                        //- 左边图标
                        temp += data[i].icon ? ('<i class="pull-left _left ' + data[i].icon + '"></i> ') : '';
                        //- 右边数量
                        temp += data[i].count ? (' <span class="_right pull-right badge">' + data[i].count + '</span>') : '';
                        //- 标题
                        temp += data[i].text;
                        temp += '</a></li>'
                        $sub = $(temp);
                    }
                    if (typeof data[i].action !== 'undefined' && !data[i].disabled) {
                        var actiond = new Date(),
                            actionID = (data[i].id || 'event') + '-' + actiond.getTime() * Math.floor(Math.random()*100000),
                            eventAction = data[i].action;
                        $sub.find('a').attr('id', actionID);
                        $('#' + actionID).addClass('context-event');
                        $(document).on('click', '#' + actionID, eventAction);
                    }
                    $menu.append($sub);
                    if (typeof data[i].subMenu != 'undefined') {
                        var subMenuData = buildMenu(data[i].subMenu, id, true);
                        $menu.find('li:last').append(subMenuData);
                    }
                }
                if (typeof options.filter == 'function') {
                    options.filter($menu.find('li:last'));
                }
            }
            return $menu;
        }

        function addContext(selector, data, event) {
            
            var d = new Date(),
                id = selector ? d.getTime() : 'none',
                $menu = buildMenu(data, id);
            $('#dropdown-none').remove();
            $('body').append($menu);
            
            function show(e) {
                $('._dropdown-context:not(._dropdown-context-sub)').hide();
                
                $dd = $('#dropdown-' + id);
                if (typeof options.above == 'boolean' && options.above) {
                    $dd.addClass('_dropdown-context-up').css({
                        top: e.pageY - 20 - $('#dropdown-' + id).height(),
                        left: e.pageX - 13
                    }).fadeIn(options.fadeSpeed);
                } else if (typeof options.above == 'string' && options.above == 'auto') {
                    $dd.removeClass('_dropdown-context-up');
                    var autoH = $dd.height() + 12;
                    if ((e.pageY + autoH) > $('html').height()) {
                        $dd.addClass('_dropdown-context-up').css({
                            top: e.pageY - 20 - autoH,
                            left: e.pageX - 13
                        }).fadeIn(options.fadeSpeed);
                    } else {
                        $dd.css({
                            top: e.pageY + 10,
                            left: e.pageX - 13
                        }).fadeIn(options.fadeSpeed);
                    }
                }
            }
            if (selector) {
                $(document).on('contextmenu', selector, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    show(e);
                });
            }else{
                show(event);
            }
        }
        
        function destroyContext(selector) {
            $(document).off('contextmenu', selector).off('click', '.context-event');
        }
        
        return {
            init: initialize,
            settings: updateOptions,
            attach: addContext,
            destroy: destroyContext
        };
    })();
    context.init({
        preventDoubleContext: false,
        compress: true
    });
    $.fn.bmenu = function(menus, event) {
        context.attach($(this).selector, menus, event);
    }
})(jQuery);