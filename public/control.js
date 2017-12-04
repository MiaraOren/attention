var socket = io.connect('http://localhost:4000');

$(document).ready(function() {
    
    $(".pointerleft").parent().mousedown(mouseDown('understand')).on('mouseup', function(e) {
        socket.emit('understand', $(this).children().html());
        $(this).unbind('mousemove');
    }).on('mouseleave', function(e) {
        $(this).unbind('mousemove');
    });

    $(".pointerright").parent().mousedown(mouseDown('intresting')).on('mouseup', function(e) {
        socket.emit('intresting', $(this).children().html());
        $(this).unbind('mousemove');
    }).on('mouseleave', function(e) {
        $(this).unbind('mousemove');
    });
});



var mouseDown = function(context) {

    return function() {

        $(this).mousemove(function(e) {
            $(this).children().css("width", e.clientX - $(this)[0].offsetLeft);
            var str = Math.ceil((e.clientX - $(this)[0].offsetLeft)/(parseInt($(this).css('width'))-1)*100);
            $(this).children().html(str + "%");
            $(this).animate({
                fontSize: "1.2em",
                background: "linear-gradient(316, #50b606, #b60606)"
                
            }, 0, function() {
                $(this).animate({
                    fontSize: "1em"
                }, 0);
            });
    
            socket.emit(context, $(this).children().html());
        });
    }

}
