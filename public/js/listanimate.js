jQuery(function() {
    var width = $('#nav li')[0].width;
    $.ajax({
        type: 'GET',
        url: 'public/data/list.js',
        dataType: 'json',
        cache: false,
        success: function(data) {
            $('#nav li').eq(data.order[0]).css({
                'left': 0
            });
            $('#nav li').eq(data.order[1]).css({
                'left': width
            });
            $('#nav li').eq(data.order[2]).css({
                'left': width * 2
            });
        }
    });
});