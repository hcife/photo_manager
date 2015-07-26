jQuery(function() {
    var margin = 5,
        li,
        li_W = (screen.width * 0.8 - 30) / 4,
        photo,
        i = 1,
        order = 0;

    function getData(imgUrl) {
        $.ajax({
            type: 'GET',
            url: imgUrl,
            dataType: 'json',
            cache: false,
            success: function(data) {
                photo = data.photo;
                $(window).bind('scroll', function() {
                    if ($(document).scrollTop() + $(window).height() > $(document).height() - 10 && i == 1) {
                        i = 0;
                    }
                });
                getMore();
            }
        });
    }

    function refresh() {
        $('#other').css('height', (screen.availHeight - 50 > 0) ? screen.availHeight - 50 : 0);
        li = $('#box li');
        var h = [];
        var n = document.documentElement.offsetWidth / (li_W + 10) | 0;
        for (var i = 0; i < li.length; i++) {
            var li_H = li[i].offsetHeight;
            if (i < n) {
                h[i] = li_H;
                li.eq(i).css('top', 0);
                li.eq(i).css('left', i * (li_W + 10));
            } else {
                min_H = Math.min.apply(null, h);
                minKey = getarraykey(h, min_H);
                h[minKey] += li_H + margin;
                li.eq(i).css('top', min_H + margin);
                li.eq(i).css('left', minKey * (li_W + 10));
            }
            li.eq(i).css('opacity', 1);
        }
    }

    function getarraykey(s, v) {
        for (var k in s) {
            if (s[k] == v) {
                return k;
            }
        }
    }

    function getMore() {
        for (var j = 0; j < 50 && order < photo.length; j++, order++) {
            $('#loading').show();
            var url = photo[order].url;
            var html = '<li><a href="#"><img src=' + url + ' ></a></li>';
            $('#box').append(html);
            $('#box img').css({
                width: li_W
            });
            $('#loading').hide();
        }
        $('#box img').click(function() {
            var image = $(this),
                other = $('#other'),
                parent = image.parent().parent();
            var left = parent.css('left'),
                top = parent.css('top');
            image.css({
                'width': screen.availWidth * 0.8,
            });
            parent.css({
                'left': 0,
                'top': 0,
                'margin': 'auto',
                'z-index': 2
            });
            other.css({
                'z-index': 1,
                'opacity': 0.5
            });
            other.click(function() {
                image.css({
                    'width': li_W,
                });
                parent.css({
                    'left': left,
                    'top': top,
                    'margin': 0,
                    'z-index': 0
                });
                $(this).css({
                    'z-index': -1,
                    'opacity': 0
                });
            });
        });
        refresh();
        i = 1;
    }
    $('#nav li').click(function() {
        order = 0;
        var option = this.id;
        var baseUrl = 'public/data/';
        $('#box').empty();
        $('#nav li').removeClass('active');
        $(this).addClass('active');
        getData(baseUrl + option + '.js');
    });
    getData('public/data/pal.js');
    window.onresize = function() {
        refresh();
    };
});