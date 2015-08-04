jQuery(function() {
    var margin = 5,
        li,
        li_W = (screen.width * 0.8 - 30) / 4,
        photo,
        i = 1,
        order = 0,
        scrollTop = 0,
        image = $('#large'),
        windowWidth = document.body.offsetWidth,
        windowHeight = document.body.scrollHeight;

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
        li = $('#box li');
        var h = [];
        var n = windowWidth / (li_W + 10) | 0;
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
        if (photo === undefined) return;
        for (var j = 0; j < 50 && order < photo.length; j++, order++) {
            $('#loading').show();
            var url = photo[order].url;
            var html = '<li name="' + order + '"><img class="imgLibrary" src=' + url + ' ></li>';
            $('#box').append(html);
            $('#box img').css({
                'width': li_W
            });
            $('#loading').hide();
        }
        setTimeout(function() {
            zoom();
            setTimeout(function() {
                refresh();
                i = 1;
            }, 200);
        }, 200);
    }

    function zoom() {
        for (var i = 0; i < $('.imgLibrary').length; i++) {
            $('.imgLibrary').eq(i).addClass('imgLibrary' + i);
        }
        $('.imgLibrary').css({
            'cursor': 'pointer'
        });
        var closeLabel = $('<span></span>');
        closeLabel.attr('id', 'closeLabel');
        closeLabel.append('+');
        closeLabel.css({
            'font-size': '40px',
            'position': 'absolute',
            'top': '-82px',
            'right': '10px',
            'color': 'white',
            'transform': 'rotate(45deg)',
            '-webkit-transform': 'rotate(45deg)',
            '-o-transform': 'rotate(45deg)',
            '-ms-transform': 'rotate(45deg)',
            '-moz-transform': 'rotate(45deg)'
        });
        var closeButton = $('<span></span>');
        closeButton.attr('id', 'closeButton');
        closeButton.css({
            'width': '0',
            'height': '0',
            'border-top': '80px solid gray',
            'border-left': '80px solid transparent',
            'position': 'absolute',
            'top': '50px',
            'right': '0',
            'z-index': '102'
        });
        closeButton.mouseover(function() {
            closeButton.css({
                'border-top': '80px solid black',
                'border-left': '80px solid transparent',
                'cursor': 'pointer'
            });
        });
        closeButton.mouseout(function() {
            closeButton.css({
                'border-top': '80px solid gray',
                'border-left': '80px solid transparent'
            });
        });
        closeButton.click(function() {
            $('#pictureDiv').hide('fast');
            $('#pictureViewer').hide('fast');
            $('body').css('overflow-y', 'scroll');
        });
        var pictureViewer = $('<div></div>');
        pictureViewer.attr('id', 'pictureViewer');
        pictureViewer.css({
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'background-color': 'RGB(26,26,26)',
            'opacity': '0.8'
        });
        var pictureDiv = $('<div></div>');
        pictureDiv.attr('id', 'pictureDiv');
        var img = $('<img \>');
        img.attr('id', 'imgPane');
        img.attr('disabled', 'true');
        var leftarrow = $('<span></span>');
        leftarrow.attr('id', 'leftarrow');
        var rightarrow = $('<span></sapn>');
        rightarrow.attr('id', 'rightarrow');
        leftarrow.css({
            'cursor': 'pointer',
            'width': '0',
            'height': '0',
            'border-bottom': '60px solid transparent',
            'border-top': '60px solid transparent',
            'border-right': '40px solid gray',
            'font-size': '0',
            'line-height': '0',
            'position': 'absolute',
            'top': ($(window).height() / 2 - 60) + 'px',
            'left': '20px'
        });
        leftarrow.mouseover(function() {
            $('#leftarrow').css({
                'border-right': '40px solid white'
            });
        });
        leftarrow.mouseout(function() {
            $('#leftarrow').css({
                'border-right': '40px solid gray'
            });
        });
        rightarrow.css({
            'cursor': 'pointer',
            'width': '0',
            'height': '0',
            'border-bottom': '60px solid transparent',
            'border-top': '60px solid transparent',
            'border-left': '40px solid gray',
            'font-size': '0',
            'line-height': '0',
            'position': 'absolute',
            'top': ($(window).height() / 2 - 60) + 'px',
            'right': '20px'
        });
        rightarrow.mouseover(function() {
            $('#rightarrow').css({
                'border-left': '40px solid white'
            });
        });
        rightarrow.mouseout(function() {
            $('#rightarrow').css({
                'border-left': '40px solid gray'
            });
        });
        leftarrow.click(function() {
            var i;
            for (i = 0; i < $('.imgLibrary').length; i++) {
                if ($('#imgPane').hasClass('imgLibrary' + i)) {
                    break;
                }
            }
            if (i > 0) {
                $('#imgPane').attr('src', $('.imgLibrary' + (i - 1)).attr('src'));
                $('#imgPane').attr('class', 'imgLibrary' + (i - 1));
                var image = new Image();
                image.src = $('#pictureDiv img').attr('src');
                var imageWidth = image.width;
                var imageHeight = image.height;
                var proportion = imageWidth / imageHeight;
                var imagewidthTemp = imageWidth;
                var imageHeightTemp = imageHeight;
                if (imageWidth > (0.8 * $(window).width())) {
                    imageWidthTemp = 0.8 * $(window).width();
                    imageHeightTemp = imageWidth * proportion;
                }
                if (imageHeightTemp > (0.8 * $(window).height())) {
                    imageHeight = 0.8 * $(window).height();
                    imageWidth = imageHeight * proportion;
                }
                $('#imgPane').css({
                    'width': imageWidth + 'px',
                    'height': imageHeight + 'px'
                });
                $('#pictureDiv').css({
                    'width': imageWidth + 'px',
                    'height': imageHeight + 'px',
                    'position': 'absolute',
                    'left': (($(window).width() - imageWidth) / 2) + 'px',
                    'top': (($(window).height() - imageHeight) / 2) + 'px'
                });
            } else {
                var first = $('<span></sapn>');
                first.attr('id', 'firstwarnning');
                first.append('&nbsp;这已经是第一张图片了！');
                first.css({
                    'position': 'absolute',
                    'height': '50px',
                    'top': ($(window).height() / 2 - 25) + 'px',
                    'left': ($(window).width() / 2 - 120) + 'px',
                    'line-height': '50px',
                    'text-align': 'center',
                    'font-size': '20px',
                    'background-color': 'white',
                    '-webkit-border-radius': '15px',
                    'border-radius': '15px',
                    '-o-border-radius': '15px',
                    '-ms-border-radius': '15px',
                    '-moz-border-radius': '15px',
                    'font-weight': 'bold'
                });
                first.appendTo('#pictureDiv');
                setTimeout(function() {
                    $('#firstwarnning').fadeOut(2000);
                }, 100);
                setTimeout(function() {
                    $('#firstwarnning').remove();
                }, 2000);
            }
        });
        rightarrow.click(function() {
            var i;
            for (i = 0; i < $('.imgLibrary').length; i++) {
                if ($('#imgPane').hasClass('imgLibrary' + i)) {
                    break;
                }
            }
            if (i < $('.imgLibrary').length - 1) {
                $('#imgPane').attr('src', $('.imgLibrary' + (i + 1)).attr('src'));
                $('#imgPane').attr('class', 'imgLibrary' + (i + 1));
                var image = new Image();
                image.src = $('#pictureDiv img').attr('src');
                var imageWidth = image.width;
                var imageHeight = image.height;
                var proportion = imageWidth / imageHeight;
                var imagewidthTemp = imageWidth;
                var imageHeightTemp = imageHeight;
                if (imageWidth > (0.8 * $(window).width())) {
                    imageWidthTemp = 0.8 * $(window).width();
                    imageHeightTemp = imageWidth * proportion;
                }
                if (imageHeightTemp > (0.8 * $(window).height())) {
                    imageHeight = 0.8 * $(window).height();
                    imageWidth = imageHeight * proportion;
                }
                $('#imgPane').css({
                    'width': imageWidth + 'px',
                    'height': imageHeight + 'px'
                });
                $('#pictureDiv').css({
                    'width': imageWidth + 'px',
                    'height': imageHeight + 'px',
                    'position': 'absolute',
                    'left': (($(window).width() - imageWidth) / 2) + 'px',
                    'top': (($(window).height() - imageHeight) / 2) + 'px'
                });
            } else {
                var last = $('<span></sapn>');
                last.attr('id', 'lastwarnning');
                last.append('&nbsp;这已经是最后一张图片了！');
                last.css({
                    'position': 'absolute',
                    'height': '50px',
                    'top': ($(window).height() / 2 - 25) + 'px',
                    'left': ($(window).width() / 2 - 120) + 'px',
                    'line-height': '50px',
                    'text-align': 'center',
                    'font-size': '20px',
                    'background-color': 'white',
                    '-webkit-border-radius': '15px',
                    'border-radius': '15px',
                    '-o-border-radius': '15px',
                    '-ms-border-radius': '15px',
                    '-moz-border-radius': '15px',
                    'font-weight': 'bold'
                });
                last.appendTo('#pictureDiv');
                setTimeout(function() {
                    $('#lastwarnning').fadeOut(2000);
                }, 100);
                setTimeout(function() {
                    $('#lastwarnning').remove();
                }, 2000);
            }
        });
        $('.imgLibrary').click(function() {
            $('body').css('overflow-y', 'hidden');
            pictureViewer.css({
                'width': $(window).width() + 'px',
                'height': $(window).height() + 'px'
            })
            pictureViewer.appendTo('body');
            closeButton.appendTo('#pictureViewer');
            closeLabel.appendTo('#closeButton');
            var image = new Image();
            image.src = $(this).attr('src');
            var imageWidth = image.width;
            var imageHeight = image.height;
            var proportion = imageWidth / imageHeight;
            if (imageHeight >= imageWidth) {
                if (imageHeight > $(window).height()) {
                    imageHeight = $(window).height();
                    imageWidth = proportion * imageHeight;
                }
            } else {
                if (imageWidth > 0.8 * $(window).width()) {
                    imageWidth = 0.8 * $(window).width();
                    imageHeight = imageWidth / proportion;
                }
            }
            if (imageHeight > $(window).height()) {
                imageHeight = $(window).height();
                imageWidth = proportion * imageHeight;
            }
            img.css({
                'width': imageWidth + 'px',
                'height': imageHeight + 'px',
                'z-index': '100'
            });
            pictureDiv.css({
                'width': imageWidth + 'px',
                'height': imageHeight + 'px',
                'position': 'absolute',
                'left': (($(window).width() - imageWidth) / 2) + 'px',
                'top': (($(window).height() - imageHeight) / 2+25) + 'px'
            });
            img.attr('src', image.src);
            pictureDiv.appendTo('body');
            img.appendTo('#pictureDiv');
            $('#pictureViewer').show('fast');
            $('#pictureDiv').show('fast');
            leftarrow.appendTo('#pictureViewer');
            rightarrow.appendTo('#pictureViewer');
            var selectclass;
            for (var i = 0; i < $('.imgLibrary').length; i++) {
                selectclass = 'imgLibrary' + i;
                if ($(this).hasClass(selectclass)) {
                    break;
                }
            }
            $('#imgPane').attr('class', selectclass);
        });
        $(window).resize(function() {
            $('#leftarrow').css({
                'top': ($(window).height() / 2 - 60) + 'px',
            });
            $('#rightarrow').css({
                'top': ($(window).height() / 2 - 60) + 'px',
            });
            $('#pictureViewer').css({
                'width': $(window).width() + 'px',
                'height': $(window).height() + 'px'
            })
            var image = new Image();
            image.src = $('#pictureDiv img').attr('src');
            var imageWidth = image.width;
            var imageHeight = image.height;
            var proportion = imageWidth / imageHeight;
            if (imageHeight >= imageWidth) {
                if (imageHeight > $(window).height()) {
                    imageHeight = $(window).height();
                    imageWidth = proportion * imageHeight;
                }
            } else {
                if (imageWidth > 0.8 * $(window).width()) {
                    imageWidth = 0.8 * $(window).width();
                    imageHeight = imageWidth / proportion;
                }
            }
            if (imageHeight > $(window).height()) {
                imageHeight = $(window).height();
                imageWidth = proportion * imageHeight;
            }
            $('#imgPane').css({
                'width': imageWidth + 'px',
                'height': imageHeight + 'px'
            });
            $('#pictureDiv').css({
                'width': imageWidth + 'px',
                'height': imageHeight + 'px',
                'position': 'absolute',
                'left': (($(window).width() - imageWidth) / 2) + 'px',
                'top': (($(window).height() - imageHeight) / 2+25) + 'px'
            });
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
    window.onresize = function() {
        windowWidth = document.body.offsetWidth;
        windowHeight = document.body.scrollHeight;
        $('#nav ul')[0].style.left = (document.body.offsetWidth - 270) / 2 + 'px';
        setTimeout(function() {
            refresh();
        }, 100);
    };
    window.onscroll = function() {
        scrollTop = document.body.scrollTop;
        $('#nav').css('top', scrollTop);
    };
    setTimeout(function() {
        getData('public/data/pal.js');
    }, 100);
});
/*
    把图片库的图片的类添加imgLibrary,
    并在添加PictureViewer.js前添加JQuery，
    图片库图片点击就有图片查看器效果
*/
$(function() {});