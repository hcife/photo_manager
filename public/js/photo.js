jQuery(function() {
    var margin = 5,
        li,
        li_W = (screen.width * 0.8 - 30) / 4,
        photo,
        i = 1,
        order = 0,
        scrollTop = 0,
        image = $('#large'),
        other = $('#other');

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
        other.css('height', (screen.availHeight - 50 > 0) ? screen.availHeight - 50 : 0);
        li = $('#box li');
        var h = [];
        var n = screen.availWidth / (li_W + 10) | 0;
        for (var i = 0; i < li.length; i++) {
            var li_H = li.eq(i).find('img')[0].height;
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
            var html = '<li><a href="javascript:void(0)"><img src=' + url + ' ></a></li>';
            $('#box').append(html);
            $('#box img').css({
                'width': li_W
            });
            $('#loading').hide();
        }
        zoom();
        refresh();
        i = 1;
    }

    function zoom() {
        $('#box img').click(function() {
            image[0].src = $(this)[0].src;
            if(image[0].width<image[0].height)
            {
                image.css({'height':screen.availHeight,'width':'auto'});
            }
            image.css({
                'top': scrollTop + 50,
                'z-index': 2
            }).
            css('opacity', 1);
            other.css({
                'top': scrollTop + 50,
                'z-index': 1
            }).css('opacity', 0.5);
        });
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
    
    other.click(function() {
        image.css('opacity', 0).css('z-index', -1);
        $(this).css({
            'opacity': 0
        }).css({
            'z-index': -1
        });
    });
    window.onresize = function() {
        refresh();
    };
    window.onscroll = function() {
        scrollTop = document.body.scrollTop;
        $('#nav').css('top', scrollTop);
    };
    getData('public/data/pal.js');
});