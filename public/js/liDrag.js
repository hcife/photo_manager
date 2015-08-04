$(function() {
    var dragLeft = 0;
    var setLeft = 0;
    var putli = null;
    var dropli = null;
    var arr = [];
    var pani = 1;
    var dragnum = 1;
    var pan1 = 0;
    var pan2 = 0;
    $("#nav").find("li").each(function() {
        this.index = pani;
        //console.log( this.index);
        pani++;
        arr.push(this);
        // console.log(arr);
        $(this).attr("draggable", true);
        $(this)[0].ondragstart = function() {
            putli = this;
            dragLeft = $(this)[0].offsetLeft;
            if (this.index == 1) {
                pan1 = 1;
                //console.log("pan1" + pan1);
            }
            // //console.log("dragLeft"+dragLeft);
        }
        $(this)[0].ondragend = function() {
            return false;
        }
        $(this)[0].ondragenter = function() {
            setLeft = $(this)[0].offsetLeft;
            // //console.log("setLeft"+setLeft);
        }
        $(this)[0].ondragover = function(ev) {
            ev = ev || window.event;
            ev.preventDefault();
        }
        var top1 = 106;
        var top2 = 0;
        $(this)[0].ondrop = function() {
            // console.log(1111);
            if (pan1 == 1) {
                pan2 = 1;
                pan1 = 0;
            }
            //console.log("pan2" + pan2);
            dropli = this;
            if (setLeft - dragLeft == 212) {
                $("#nav ul").append(putli);
                arr.shift();
                arr.push(putli);
                //console.log(arr);
            } else if (setLeft - dragLeft == -212) {
                $("#nav ul").prepend(putli);
                arr.pop();
                arr.unshift(putli);
                //console.log(arr);
            } else if ((setLeft - dragLeft == 106) || (setLeft - dragLeft == -106)) {
                var a = arr[1];
                arr.splice(1, 1);
                if (this.index == 1 || pan2 == 1) {
                    arr.unshift(a); //12
                    pan2 = 0;
                } else {
                    arr.push(a); //23
                }
                for (var i = 0; i < 3; i++) {
                    $("#nav ul").append(arr[i]);
                }
            }
            //重新给li编号
            pani = 1;
            var liname = [];
            $("#nav").find("li").each(function() {
                this.index = pani;
                pani++;
                liname.push($(this).attr("name"));
            })
            console.log(liname);
            //拖拽完成发送请求
            $.ajax({
                type: "POST",
                sync: "true",
                data: {
                    "order": liname
                },
                url: "drag.php", //发送请求的地址
                dataType: "json", //预期服务器返回的数据类型
                jsonp: "jsoncallback", //在一个 jsonp 请求中重写回调函数的名字
                success: function(data) {
                    var option = $(putli).attr("id");
                    var baseUrl = 'public/data/';
                    $('#box').empty();
                    $('#nav li').removeClass('active');
                    $(putli).addClass('active');
                },
                error: function() {
                    console.log("数据获取失败");
                }
            });
            //请求end
        }
    });
})