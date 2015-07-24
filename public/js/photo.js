var margin = 10;
var li;
var li_W = (screen.width * 0.8 - 118) / 4 + 32;
var photo;
var i = 1;
var order = 0;

window.onload = function() {
    getdata();
};
window.onresize = function() {
    refresh();
};

function getdata() {
    var xhr = new XMLHttpRequest();
    var url = 'public/data/img.js';
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            photo = data.photo;
            $(window).bind("scroll", function() {
                if ($(document).scrollTop() + $(window).height() > $(document).height() - 10 && i == 1) {
                    i = 0;
                    getMore();
                }
            });
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function refresh() {
    li = $("li");
    var h = [];
    var n = document.documentElement.offsetWidth / li_W | 0;
    for (var i = 0; i < li.length; i++) {
        li_H = li[i].offsetHeight;
        if (i < n) {
            h[i] = li_H;
            li.eq(i).css("top", 0);
            li.eq(i).css("left", i * li_W);
        } else {
            min_H = Math.min.apply(null, h);
            minKey = getarraykey(h, min_H);
            h[minKey] += li_H + margin;
            li.eq(i).css("top", min_H + margin);
            li.eq(i).css("left", minKey * li_W);
        }
        $("h3").eq(i).text("编号：" + i + "，高度：" + li_H);
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
    for (var j = 0; j < 50, order < photo.length; j++, order++) {
        $("#loading").show();
        var url = photo[order].url;
        var html = "<li style='opacity:1'><a href='#'><img src=" + url + " ></a><h3>图片标题</h3></li>";
        $("#box").append(html);
        $('img').css({
            width: (screen.width * 0.8 - 118) / 4 + 'px'
        });
        $("#loading").hide();
    }
    refresh();
    i = 1;
}