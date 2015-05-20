(function(c) {
    c.getClassByUICls = function(e) {
        e = e.toLowerCase();
        var d = this.uiClasses[e];
        if (!d) {
            e = e.replace("nui-", "mini-");
            d = this.uiClasses[e]
        }
        return d
    };
    c.DatePicker.prototype.valueFormat = "yyyy-MM-dd HH:mm:ss";
    c.ajax = function(e) {
        var d = e.url;
        if (d && d.length > 4 && d.lastIndexOf(".ext") == d.length - 4) {
            if (!e.dataType) {
                e.dataType = "json"
            }
            if (!e.contentType) {
                e.contentType = "application/json; charset=UTF-8"
            }
            if (e.data && mini.isNull(e.data.pageIndex) == false) {
                var f = e.data.page = {};
                f.begin = e.data.pageIndex * e.data.pageSize;
                f.length = e.data.pageSize
            }
            if (e.dataType == "json" && typeof (e.data) == "object") {
                e.data = mini.encode(e.data);
                if (e.data == "{}") {
                    delete e.data
                }
                e.type = "POST"
            }
        }
        return window.jQuery.ajax(e)
    };
    c.fn = {
        contains : function(d, e) {
            return ("," + d + ",").indexOf("," + e + ",") != -1
        },
        endWidth : function(d, e) {
            if (d.length < e.length) {
                return false
            }
            return d.substr(d.length - e.length) === e
        },
        startWidth : function(d, e) {
            return d.substr(0, e.length) === e
        }
    };
    var b = jQuery;
    var a = {
        map : {},
        loaded : {},
        timeSeed : true,
        path : "",
        isAbsolutePath : function(d) {
            return c.fn.startWidth(d, "http") || c.fn.startWidth(d, "/")
        },
        getJSPath : function(h) {
            var e = document.scripts;
            for (var g = 0, d = e.length; g < d; g++) {
                var j = e[g].src;
                j = j.split("?")[0];
                var f = c.fn.endWidth(j, h);
                if (f) {
                    return j.substr(0, j.lastIndexOf("/")) + "/"
                }
            }
            return ""
        },
        hasLoaded : function(d) {
            return this.loaded[d]
        },
        getLoadInfo : function(d) {
            return this.loaded[d]
        },
        loadCSS : function(e) {
            if (!b.isArray(e)) {
                e = [ e ]
            }
            for (var f = 0, d = e.length; f < d; f++) {
                this.loadCSS(e[f])
            }
        },
        loadJS : function(k, f, e) {
            if (!b.isArray(k)) {
                k = [ k ]
            }
            var d = k.length;
            var j = 0;
            if (e) {
                var h = function(m, l) {
                    a._loadJS(k[m], function() {
                        m++;
                        if (m < d) {
                            h(m, l)
                        } else {
                            l()
                        }
                    })
                };
                h(0, f)
            } else {
                for (var g = 0; g < d; g++) {
                    a._loadJS(k[g], function() {
                        j++;
                        if (j == d) {
                            f()
                        }
                    })
                }
            }
        },
        _loadCSS : function(e, f) {
            if (this.getLoadInfo(e)) {
                return
            }
            f = f || document;
            var d = f.createElement("link");
            d.type = "text/css";
            if (NUI.timeSeed) {
                d.href = e + "?" + (new Date())
            } else {
                d.href = e
            }
            d.rel = "stylesheet";
            f.getElementsByTagName("head")[0].appendChild(d);
            this.loaded[e] = true;
            return d
        },
        _loadJS : function(h, d, g) {
            d = d || function() {
            };
            if (!a.isAbsolutePath(h)) {
                h = a.path + h
            }
            var e = this.getLoadInfo(h);
            if (e) {
                switch (e.status) {
                case "loading":
                    e.handler.push(d);
                    break;
                case "loaded":
                    d();
                    break
                }
                return
            } else {
                this.loaded[h] = {
                    status : "loading",
                    handler : [ d ]
                }
            }
            g = g || document;
            var f = g.createElement("script");
            f.type = "text/javascript";
            if (this.timeSeed) {
                f.src = h + "?" + (new Date())
            } else {
                f.src = h
            }
            f.onreadystatechange = f.onload = function() {
                if (!this.readyState
                        || (this.readyState == "complete" || this.readyState == "loaded")) {
                    a.loaded[h] = a.loaded[h] || {};
                    a.loaded[h].status = "loaded";
                    var k = a.loaded[h].handler;
                    for (var l = 0, j = k.length; l < j; l++) {
                        var m = k[l];
                        if (m && typeof (m) == "function") {
                            m()
                        }
                    }
                }
            };
            g.getElementsByTagName("head")[0].appendChild(f);
            return f
        }
    };
    a.path = a.getJSPath("nui.js");
    c.res = {
        hasLoaded : function(d) {
            return a.loaded[d]
        },
        add : function(d, e) {
            e = e || {};
            e.js = e.js || [];
            e.css = e.css || [];
            e.order = e.order || false;
            a.map[d] = e
        },
        remove : function(d) {
            delete a.map[d]
        },
        get : function(d) {
            return a.map[d]
        },
        load : function(f, d) {
            var e = this.get(f);
            if (!e) {
                d();
                return
            }
            a.loadCSS(e.css);
            a.loadJS(e.js, d, e.order)
        }
    };
    c.loadRes = function(e, d) {
        c.res.load(e, d)
    };
    c.res.add("ckeditor", {
        js : [ "resource/ckeditor/ckeditor.js" ]
    });
    c.res.add("swfupload", {});
    window.nui = c
})(mini);