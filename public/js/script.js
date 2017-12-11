$(function () {
    // Apply a CSS filter with our blur class
    var blurredElements = $('.homebanner, div.reveal').addClass('blur');
    // Initialize the Reveal.js library with the default config options
    Reveal.initialize({
        history: true //Every slide changes the url
    });
    
    //This connects you to the socket
    
    var socket = io();

    //This initiates the variable

    var form = $('form.login');
    var secretTextBox = form.find('input[type=number]');
    var presentation = $('.reveal');
    
    var key = "", animationTimeout;

    //When you enter the page you will have to enter a password

    form.submit(function (e) {

        e.preventDefault();

        key = secretTextBox.val().trim();

        /*If a password exists, send it to the sever-side 
        through the socket.io channel with a 'load' event */
        if (key.length) {
            socket.emit('load', {
                key: key
            });
        }

    });

    //The server will either grant or deny access, depending on
    // the password you entered

    socket.on('access', function (data) {
        //This will check if we have "granted" access.
        //If we do, we can proceed to the presentation

        if (data.access === "granted") {
            presentation.removeClass('blurred');
            form.hide();
            var ignore = false;

            $(window).on('hashchange', function () {
                //We need to tell other clients that we have changed to a new slide
                // by sending the "slide-changed" message to socket.io

                if (ignore) {
                    //Temporary, learning ignore
                    return;
                }
                var hash = window.location.hash;

                socket.emit('slide-changed', {
                    hash: hash,
                    key: key
                });
            });
            socket.on('navigate', function (data) {
                //A different device has changed the slide, change it in this browser too

                window.location.hash = data.hash;

                // The "ignore" variable stops the hash change from
                // triggering our hashchange handler above and sending
                // us into a never-ending cycle.

                ignore = true;

                setInterval(function () {
                    ignore = false;
                }, 100);
            });
        } else {
            //This happens when you enter wrong password
            clearTimeout(animationTimeout);

            //When adding the "animation" class it triggers the keyframe 
            //animation that shakes the text input

            secretTextBox.addClass('denied animation');

            animationTimeout = setTimeout(function () {
                secretTextBox.removeClass('animation');
            }, 1000);
            form.show();
        }

    });
});
