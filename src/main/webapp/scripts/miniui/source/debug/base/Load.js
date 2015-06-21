/**
 * @property {String} [rootpath="/"]  应用系统的上下文路径
 * @member Window
 */
if (typeof window.rootpath == "undefined") {
    rootpath = "/"
}

mini.loadJS = function(a, b) {
    if (!a) {
        return
    }
    if (typeof b == "function") {
        return loadJS._async(a, b)
    } else {
        return loadJS._sync(a)
    }
};
mini.loadJS._js = {};
mini.loadJS._async = function(e, f) {
    var c = mini.loadJS._js[e];
    if (!c) {
        c = mini.loadJS._js[e] = {
            create : false,
            loaded : false,
            callbacks : []
        }
    }
    if (c.loaded) {
        setTimeout(function() {
            f()
        }, 1);
        return
    } else {
        c.callbacks.push(f);
        if (c.create) {
            return
        }
    }
    c.create = true;
    var a = document.getElementsByTagName("head")[0];
    var d = document.createElement("script");
    d.src = e;
    d.type = "text/javascript";
    function b() {
        for (var g = 0; g < c.callbacks.length; g++) {
            var h = c.callbacks[g];
            if (h) {
                h()
            }
        }
        c.callbacks.length = 0
    }
    setTimeout(function() {
        if (document.all) {
            d.onreadystatechange = function() {
                if (d.readyState == "loaded" || d.readyState == "complete") {
                    b();
                    c.loaded = true
                }
            }
        } else {
            d.onload = function() {
                b();
                c.loaded = true
            }
        }
        a.appendChild(d)
    }, 1);
    return d
};
mini.loadJS._sync = function(c) {
    if (loadJS._js[c]) {
        return
    }
    loadJS._js[c] = {
        create : true,
        loaded : true,
        callbacks : []
    };
    var a = document.getElementsByTagName("head")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";
    b.text = loadText(c);
    a.appendChild(b);
    return b
};


mini.loadText = function(a) {
    var g = "";
    var c = document.all && location.protocol == "file:";
    var b = null;
    if (c) {
        b = new ActiveXObject("Microsoft.XMLHTTP")
    } else {
        if (window.XMLHttpRequest) {
            b = new XMLHttpRequest()
        } else {
            if (window.ActiveXObject) {
                b = new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
    }
    b.onreadystatechange = e;
    var f = "_t=" + new Date().getTime();
    if (a.indexOf("?") == -1) {
        f = "?" + f
    } else {
        f = "&" + f
    }
    a += f;
    b.open("GET", a, false);
    b.send(null);
    function e() {
        if (b.readyState == 4) {
            var d = c ? 0 : 200;
            if (b.status == d) {
                g = b.responseText
            } else {
            }
        }
    }
    return g
};


mini.loadJSON = function(url) {
    var text = loadText(url);
    var o = eval("(" + text + ")");
    return o
};


mini.loadCSS = function(c, d) {
    if (!c) {
        return
    }
    if (loadCSS._css[c]) {
        return
    }
    var a = document.getElementsByTagName("head")[0];
    var b = document.createElement("link");
    if (d) {
        b.id = d
    }
    b.href = c;
    b.rel = "stylesheet";
    b.type = "text/css";
    a.appendChild(b);
    return b
};
mini.loadCSS._css = {};


mini.innerHTML = function(b, a) {
    if (typeof b == "string") {
        b = document.getElementById(b)
    }
    if (!b) {
        return
    }
    a = '<div style="display:none">&nbsp;</div>' + a;
    b.innerHTML = a;
    mini.__executeScripts(b);
    var c = b.firstChild
};


mini.__executeScripts = function(h) {
    var a = h.getElementsByTagName("script");
    for (var c = 0, b = a.length; c < b; c++) {
        var g = a[c];
        var f = g.src;
        if (f) {
            mini.loadJS(f)
        } else {
            var e = document.createElement("script");
            e.type = "text/javascript";
            e.text = g.text;
            h.appendChild(e)
        }
    }
    for (var c = a.length - 1; c >= 0; c--) {
        var g = a[c];
        g.parentNode.removeChild(g)
    }
};
