// reset transforms to this
var zeros = {
    x: 0,
    y: 0,
    z: 0
};

// Implement animation methods on the element prototype
Element.implement({

    // Scatter elements all over the place
    scatter: function() {
        return $(this).trans({
            x: Number.random(-1000, 1000),
            y: Number.random(-1000, 1000),
            z: Number.random(-500, 500)
        }).rotate({
            x: Number.random(-720, 720),
            y: Number.random(-720, 720),
            z: Number.random(-720, 720)
        });
    },

    // Return them to their original state
    unscatter: function() {
        return $(this).trans(zeros).rotate(zeros);
    },

    //  Frighten the image!  AHHHHHHHH!
    frighten: function(d) {
        this.setTransition('timing-function', 'ease-out').scatter();
        setTimeout(function() {
            //this.setTransition('timing-function', 'ease-in-out').unscatter();
        }.bind(this), 500);
        return this;
    },

    // Zoooooom into me
    zoom: function(delay) {
        var self = this;
        this.scale(0.01);
        setTimeout(function() {
            self.setTransition({
                property: 'transform',
                duration: '250ms',
                'timing-function': 'ease-out'
            }).scale(1.2);
            setTimeout(function() {
                self.setTransition('duration', '100ms').scale(1);
            }, 250)
        }, delay);
    },

    // Create a slider
    makeSlider: function() {
        var open = false,
            next = this.getNext(),
            height = next.getScrollSize().y,
            transition = {
                property: 'height',
                duration: '500ms',
                transition: 'ease-out'
            };
        next.setTransition(transition);
        this.addEvent('click', function() {
            next.setStyle('height', open ? 0 : height);
            open = !open;
        });
    },

    // Scatter, come back
    fromChaos: (function(x) {
        var delay = 0;
        return function() {
            var element = this;
            //element.scatter();
            setTimeout(function() {
                element.setTransition({
                    property: 'transform',
                    duration: '500ms',
                    'timing-function': 'ease-out'
                });
                setTimeout(function() {
                    //element.unscatter();
                    element.addEvents({
                        mouseenter: element.frighten.bind(element),
                        touchstart: element.frighten.bind(element)
                    });
                }, delay += x);
            }, x);
        }
    }())

});


// When the DOM is ready
window.addEvent("domready", function() {

    // Get the proper CSS prefix from the page
    var cssPrefix = false;
    switch (Browser.name) { // Implement only for Chrome, Firefox, and Safari
        case "safari":
        case "chrome":
            cssPrefix = "webkit";
            break;
        case "firefox":
            cssPrefix = "moz";
            break;
    }

    // If we support this browser....
    if (cssPrefix) {
        // 300 x 233
        var cols = 36; // Desired columns
        var rows = 20; // Desired rows
        var totalWidth = width; // Logo width
        var totalHeight = height; // Logo height
        var singleWidth = totalWidth / cols; // Shard width
        var singleHeight = totalHeight / rows; // Shard height
        var shards = []; // Array of SPANs

        // Remove the text and background image from the logo
        var logo = document.id("homeLogo").set("html", "").setStyles({
            backgroundImage: "none"
        });

        // For every desired row
        rows.times(function(rowIndex) {
            // For every desired column
            cols.times(function(colIndex) {
                // Create a SPAN element with the proper CSS settings
                // Width, height, browser-specific CSS
                var element = new Element("span", {
                    style: "width:" + (singleWidth) + "px;height:" + (singleHeight) +
                    "px;background-position:-" + (singleWidth * colIndex) + "px -" +
                    (singleHeight * rowIndex) + "px;-" + cssPrefix + "-transition-property: -" +
                    cssPrefix + "-transform; -" + cssPrefix + "-transition-duration: 200ms; -" +
                    cssPrefix + "-transition-timing-function: ease-out; -" + cssPrefix +
                    "-transform: translateX(0%) translateY(0%) translateZ(0px) rotateX(0deg) rotateY(0deg) rotate(0deg);" +
                    ' background-size:' + width + 'px ' + height + 'px;' + "z-index: 3000;"+
                    " left: " + Math.abs(singleWidth * colIndex) + "px; top: " + Math.abs(singleHeight * rowIndex) + "px;"
                }).inject(logo);
                // Save it
                shards.push(element);
            });
            // Create a DIV clear for next row
            new Element("div", {
                clear: "clear"
            }).inject(logo);
        });

        // Chaos!
        $$(shards).fromChaos(1000);
    }

});
