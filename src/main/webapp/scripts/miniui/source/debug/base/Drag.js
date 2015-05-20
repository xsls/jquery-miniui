mini.Drag = function(a) {
    mini.copyTo(this, a)
};
mini.Drag.prototype = {
    onStart : mini.emptyFn,
    onMove : mini.emptyFn,
    onStop : mini.emptyFn,
    capture : false,
    fps : 20,
    event : null,
    delay : 80,
    start : function(b) {
        b.preventDefault();
        if (b) {
            this.event = b
        }
        this.now = this.init = [ this.event.pageX, this.event.pageY ];
        var a = document;
        mini.on(a, "mousemove", this.move, this);
        mini.on(a, "mouseup", this.stop, this);
        mini.on(a, "contextmenu", this.contextmenu, this);
        if (this.context) {
            mini.on(this.context, "contextmenu", this.contextmenu, this)
        }
        this.trigger = b.target;
        mini.selectable(this.trigger, false);
        mini.selectable(a.body, false);
        if (this.capture) {
            if (isIE) {
                this.trigger.setCapture(true)
            } else {
                if (document.captureEvents) {
                    document.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP
                            | Event.MOUSEDOWN)
                }
            }
        }
        this.started = false;
        this.startTime = new Date()
    },
    contextmenu : function(a) {
        if (this.context) {
            mini.un(this.context, "contextmenu", this.contextmenu, this)
        }
        mini.un(document, "contextmenu", this.contextmenu, this);
        a.preventDefault();
        a.stopPropagation()
    },
    move : function(b) {
        if (this.delay) {
            if (new Date() - this.startTime < this.delay) {
                return
            }
        }
        if (!this.started) {
            this.started = true;
            this.onStart(this)
        }
        var a = this;
        if (!this.timer) {
            this.timer = setTimeout(function() {
                a.now = [ b.pageX, b.pageY ];
                a.event = b;
                a.onMove(a);
                a.timer = null
            }, 5)
        }
    },
    stop : function(c) {
        this.now = [ c.pageX, c.pageY ];
        this.event = c;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null
        }
        var b = document;
        mini.selectable(this.trigger, true);
        mini.selectable(b.body, true);
        if (isIE) {
            this.trigger.setCapture(false);
            this.trigger.releaseCapture()
        }
        var d = mini.MouseButton.Right != c.button;
        if (d == false) {
            c.preventDefault()
        }
        mini.un(b, "mousemove", this.move, this);
        mini.un(b, "mouseup", this.stop, this);
        var a = this;
        setTimeout(function() {
            mini.un(document, "contextmenu", a.contextmenu, a);
            if (a.context) {
                mini.un(a.context, "contextmenu", a.contextmenu, a)
            }
        }, 1);
        if (this.started) {
            this.onStop(this, d)
        }
    }
};
