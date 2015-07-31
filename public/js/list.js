jQuery(function() {
    var li = $('#nav li'),
        width = [li[0].clientWidth, li[1].clientWidth, li[2].clientWidth],
        ulWidth = li[0].clientWidth + li[1].clientWidth + li[2].clientWidth,
        ul = $('#nav ul')[0];
    //ul.style.width = ulWidth + 'px';
    ul.style.left = (document.body.offsetWidth - ulWidth) / 2 + 'px';
    setTimeout(function() {
        $.ajax({
            type: 'GET',
            url: 'public/data/list.js',
            dataType: 'json',
            cache: false,
            success: function(data) {
                var order = data.order;
                li[order[0]].style.left = 0;
                li[order[1]].style.left = width[order[0]]+'px';
                li[order[2]].style.left = ulWidth - width[order[2]]+'px';
            }
        });
    }, 100);
});