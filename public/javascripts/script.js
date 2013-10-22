$(function() {
    var socket = io.connect(window.location.hostname);

    var keywords = {'#javascript': { color: '#49c59f' },
        '#html': { color: '#ec000e' },
        '#css': { color: '#f36a06' },
        '#node': { color: '#ea007f' },
        '#python': { color: '#39be48' },
        '#ruby': { color: '#857158'},
        '#php': { color: '#4b5a63' },
        '#perl': { color: '#f57b43'}
    };

    _.each($('.circle'), function (circle) {
        var count = $(circle).data('count');
        var keyword = $(circle).data('keyword');
        average = "Most Popular";
        $(circle).css({
            'background-color': keywords[keyword].color
        });
    });

    $('li').on('mouseenter', function () {
        var count = $(this).find('.circle').data('count');
        $(this).find('p').text(count);
    });
    $('li').on('mouseleave', function () {
        var keyword = $(this).find('.circle').data('keyword');
        $(this).find('p').text(keyword);
    });

    // this section is going to handle the real time tweets
    socket.on('tweet', function(tweet){
        console.log(tweet);

        $('li').on('mouseenter', function () {
//            var count = $(this).find('.circle').data('count');
            $('.tweet p').text(tweet);
        });
        $('li').on('mouseleave', function () {
            var keyword = $(this).find('.circle').data('keyword');
            $(this).find('p').text(keyword);
        });

    });

    //This section is going to handle the hastags in tweet and display of number of tweets
    socket.on('data', function(data) {
        var total = data.total;
        for (var key in data.symbols) {
            var circle = $('.circle[data-keyword="' + key + '"]');
            var old_total = circle.data('count');
            var new_total = data.symbols[key];

            if (old_total < new_total) {
                flashCircle(circle);
            }

            $(circle).data('count', new_total);
        }
        $('#total').text('Total Tweets: ' + total);
        $('#last_update').text('Last Update: ' + new Date().toTimeString());
    });

    function flashCircle(circle) {
        circle.removeClass('glow');
        circle.addClass('glow');

        setTimeout(function () {
            circle.removeClass('glow');
        }, 500);
    }
});