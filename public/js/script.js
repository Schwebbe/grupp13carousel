$(function() {
    $("#test").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
            $(this).text("You swiped " + direction );  
        }
    });

    //Set some options later
    $("#test").swipe( {fingers:2} );
});