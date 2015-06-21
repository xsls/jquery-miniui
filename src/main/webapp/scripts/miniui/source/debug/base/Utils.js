mini.append = function(c, a) {
    c = mini.byId(c);
    if (!a || !c) {
        return
    }
    if (typeof a == "string") {
        if (a.charAt(0) == "#") {
            a = mini.byId(a);
            if (!a) {
                return
            }
            c.appendChild(a);
            return a
        } else {
            if (a.indexOf("<tr") == 0) {
                return jQuery(c).append(a)[0].lastChild;
                return
            }
            var b = document.createElement("div");
            b.innerHTML = a;
            a = b.firstChild;
            while (b.firstChild) {
                c.appendChild(b.firstChild)
            }
            return a
        }
    } else {
        c.appendChild(a);
        return a
    }
};
mini.prepend = function(c, a) {
    if (typeof a == "string") {
        if (a.charAt(0) == "#") {
            a = mini.byId(a)
        } else {
            var b = document.createElement("div");
            b.innerHTML = a;
            a = b.firstChild
        }
    }
    return jQuery(c).prepend(a)[0].firstChild
};
mini.after = function(c, a) {
    if (typeof a == "string") {
        if (a.charAt(0) == "#") {
            a = mini.byId(a)
        } else {
            var b = document.createElement("div");
            b.innerHTML = a;
            a = b.firstChild
        }
    }
    if (!a || !c) {
        return
    }
    c.nextSibling ? c.parentNode.insertBefore(a, c.nextSibling) : c.parentNode
            .appendChild(a);
    return a
};
mini.before = function(c, a) {
    if (typeof a == "string") {
        if (a.charAt(0) == "#") {
            a = mini.byId(a)
        } else {
            var b = document.createElement("div");
            b.innerHTML = a;
            a = b.firstChild
        }
    }
    if (!a || !c) {
        return
    }
    c.parentNode.insertBefore(a, c);
    return a
};
mini.__wrap = document.createElement("div");
mini.createElements = function(b) {
    mini.removeChilds(mini.__wrap);
    var a = b.indexOf("<tr") == 0;
    if (a) {
        b = "<table>" + b + "</table>"
    }
    mini.__wrap.innerHTML = b;
    return a ? mini.__wrap.firstChild.rows : mini.__wrap.childNodes
};

/**
 * 根据 ID 查找 DOM 树的 Element 节点。别名为 {@link mini#byId}
 * @param {String/HTMLElement} id DOM 节点的 id 属性值
 * @param {HTMLElement} [parent] 父节点
 * @return 对应的 Element 节点， 如果没有找到匹配的节点，则返回 null<br>
 *      注： 如果传入的 id 值不是一个字符串，则直接返回 id
 * @member Window
 */
mini_byId = function(id, parent) {
    if (typeof id == "string") {
        if (id.charAt(0) == "#") {
            id = id.substr(1)
        }
        var f = document.getElementById(id);
        if (f) {
            return f
        }
        if (parent && !mini.isAncestor(document.body, parent)) {
            var c = parent.getElementsByTagName("*");
            for (var b = 0, a = c.length; b < a; b++) {
                var f = c[b];
                if (f.id == id) {
                    return f
                }
            }
            f = null
        }
        return f
    } else {
        return id
    }
};
mini_hasClass = function(c, b) {
    c = mini.byId(c);
    if (!c) {
        return
    }
    if (!c.className) {
        return false
    }
    var a = String(c.className).split(" ");
    return a.indexOf(b) != -1
};
mini_addClass = function(b, a) {
    if (!a) {
        return
    }
    if (mini.hasClass(b, a) == false) {
        jQuery(b).addClass(a)
    }
};
mini_removeClass = function(b, a) {
    if (!a) {
        return
    }
    jQuery(b).removeClass(a)
};
mini_getMargins = function(a) {
    a = mini.byId(a);
    var b = jQuery(a);
    return {
        top : parseInt(b.css("margin-top"), 10) || 0,
        left : parseInt(b.css("margin-left"), 10) || 0,
        bottom : parseInt(b.css("margin-bottom"), 10) || 0,
        right : parseInt(b.css("margin-right"), 10) || 0
    }
};
mini_getBorders = function(a) {
    a = mini.byId(a);
    var b = jQuery(a);
    return {
        top : parseInt(b.css("border-top-width"), 10) || 0,
        left : parseInt(b.css("border-left-width"), 10) || 0,
        bottom : parseInt(b.css("border-bottom-width"), 10) || 0,
        right : parseInt(b.css("border-right-width"), 10) || 0
    }
};
mini_getPaddings = function(a) {
    a = mini.byId(a);
    var b = jQuery(a);
    return {
        top : parseInt(b.css("padding-top"), 10) || 0,
        left : parseInt(b.css("padding-left"), 10) || 0,
        bottom : parseInt(b.css("padding-bottom"), 10) || 0,
        right : parseInt(b.css("padding-right"), 10) || 0
    }
};
mini_setWidth = function(d, c) {
    d = mini.byId(d);
    c = parseInt(c);
    if (isNaN(c) || !d) {
        return
    }
    if (jQuery.boxModel) {
        var f = mini.getPaddings(d);
        var a = mini.getBorders(d);
        c = c - f.left - f.right - a.left - a.right
    }
    if (c < 0) {
        c = 0
    }
    d.style.width = c + "px"
};
mini_setHeight = function(d, c) {
    d = mini.byId(d);
    c = parseInt(c);
    if (isNaN(c) || !d) {
        return
    }
    if (jQuery.boxModel) {
        var f = mini.getPaddings(d);
        var a = mini.getBorders(d);
        c = c - f.top - f.bottom - a.top - a.bottom
    }
    if (c < 0) {
        c = 0
    }
    d.style.height = c + "px"
};
mini_getWidth = function(a, b) {
    a = mini.byId(a);
    if (a.style.display == "none" || a.type == "text/javascript") {
        return 0
    }
    return b ? jQuery(a).width() : jQuery(a).outerWidth()
};
mini_getHeight = function(a, b) {
    a = mini.byId(a);
    if (a.style.display == "none" || a.type == "text/javascript") {
        return 0
    }
    return b ? jQuery(a).height() : jQuery(a).outerHeight()
};
mini_setBox = function(d, b, f, c, a) {
    if (f === undefined) {
        f = b.y;
        c = b.width;
        a = b.height;
        b = b.x
    }
    mini.setXY(d, b, f);
    mini.setWidth(d, c);
    mini.setHeight(d, a)
};
mini_getBox = function(a) {
    var c = mini.getXY(a);
    var b = {
        x : c[0],
        y : c[1],
        width : mini.getWidth(a),
        height : mini.getHeight(a)
    };
    b.left = b.x;
    b.top = b.y;
    b.right = b.x + b.width;
    b.bottom = b.y + b.height;
    return b
};
mini_setStyle = function(b, a) {
    b = mini.byId(b);
    if (!b || typeof a != "string") {
        return
    }
    var c = jQuery(b);
    var j = a.toLowerCase().split(";");
    for (var f = 0, d = j.length; f < d; f++) {
        var k = j[f];
        var m = k.split(":");
        if (m.length > 1) {
            if (m.length > 2) {
                var h = m[0].trim();
                m.removeAt(0);
                var g = m.join(":").trim();
                c.css(h, g)
            } else {
                c.css(m[0].trim(), m[1].trim())
            }
        }
    }
};
mini_getStyle = function() {
    var a = document.defaultView;
    return new Function(
            "el",
            "style",
            [
                    "style.indexOf('-')>-1 && (style=style.replace(/-(\\w)/g,function(m,a){return a.toUpperCase()}));",
                    "style=='float' && (style='",
                    a ? "cssFloat" : "styleFloat",
                    "');return el.style[style] || ",
                    a ? "window.getComputedStyle(el, null)[style]"
                            : "el.currentStyle[style]", " || null;" ].join(""))
}();
mini_isAncestor = function(d, f) {
    var a = false;
    d = mini.byId(d);
    f = mini.byId(f);
    if (d === f) {
        return true
    }
    if (d && f) {
        if (d.contains) {
            try {
                return d.contains(f)
            } catch (b) {
                return false
            }
        } else {
            if (d.compareDocumentPosition) {
                return !!(d.compareDocumentPosition(f) & 16)
            } else {
                while (f = f.parentNode) {
                    a = f == d || a
                }
            }
        }
    }
    return a
};
mini_findParent = function(f, c, h) {
    f = mini.byId(f);
    var a = document.body, g = 0, d;
    h = h || 50;
    if (typeof h != "number") {
        d = mini.byId(h);
        h = 10
    }
    while (f && f.nodeType == 1 && g < h && f != a && f != d) {
        if (mini.hasClass(f, c)) {
            return f
        }
        g++;
        f = f.parentNode
    }
    return null
};
mini.copyTo(mini, {
    /**
     * @method byId
     * @member mini
     * @alias Window#mini_byId
     */
    byId : mini_byId,
    hasClass : mini_hasClass,
    addClass : mini_addClass,
    removeClass : mini_removeClass,
    getMargins : mini_getMargins,
    getBorders : mini_getBorders,
    getPaddings : mini_getPaddings,
    setWidth : mini_setWidth,
    setHeight : mini_setHeight,
    getWidth : mini_getWidth,
    getHeight : mini_getHeight,
    setBox : mini_setBox,
    getBox : mini_getBox,
    setStyle : mini_setStyle,
    getStyle : mini_getStyle,
    repaint : function(a) {
        if (!a) {
            a = document.body
        }
        mini.addClass(a, "mini-repaint");
        setTimeout(function() {
            mini.removeClass(a, "mini-repaint")
        }, 1)
    },
    getSize : function(a, b) {
        return {
            width : mini.getWidth(a, b),
            height : mini.getHeight(a, b)
        }
    },
    setSize : function(c, b, a) {
        mini.setWidth(c, b);
        mini.setHeight(c, a)
    },
    setX : function(b, a) {
        a = parseInt(a);
        var c = jQuery(b).offset();
        var d = parseInt(c.top);
        if (d === undefined) {
            d = c[1]
        }
        mini.setXY(b, a, d)
    },
    setY : function(b, d) {
        d = parseInt(d);
        var c = jQuery(b).offset();
        var a = parseInt(c.left);
        if (a === undefined) {
            a = c[0]
        }
        mini.setXY(b, a, d)
    },
    setXY : function(b, a, d) {
        var c = {
            left : parseInt(a),
            top : parseInt(d)
        };
        jQuery(b).offset(c);
        jQuery(b).offset(c)
    },
    getXY : function(a) {
        var b = jQuery(a).offset();
        return [ parseInt(b.left), parseInt(b.top) ]
    },
    getViewportBox : function() {
        var b = jQuery(window).width(), c = jQuery(window)
                .height();
        var a = jQuery(document).scrollLeft(), d = jQuery(
                document.body).scrollTop();
        if (d == 0 && document.documentElement) {
            d = document.documentElement.scrollTop
        }
        return {
            x : a,
            y : d,
            top : d,
            left : a,
            width : b,
            height : c,
            right : a + b,
            bottom : d + c
        }
    },
    showAt : function(m) {
        var g = jQuery;
        m = g.extend({
            el : null,
            x : "center",
            y : "center",
            offset : [ 0, 0 ],
            fixed : false,
            zindex : mini.zindex(),
            timeout : 0,
            timeoutHandler : null,
            animation : false
        }, m);
        var c = g(m.el)[0], i = m.x, h = m.y, b = m.offset[0], a = m.offset[1], j = m.zindex, f = m.fixed, d = m.animation;
        if (!c) {
            return
        }
        if (m.timeout) {
            setTimeout(function() {
                if (m.timeoutHandler) {
                    m.timeoutHandler()
                }
            }, m.timeout)
        }
        var l = ";position:absolute;display:block;left:auto;top:auto;right:auto;bottom:auto;margin:0;z-index:"
                + j + ";";
        mini.setStyle(c, l);
        var l = "";
        if (m && mini.isNumber(m.x) && mini.isNumber(m.y)) {
            if (m.fixed && !mini.isIE6) {
                l += ";position:fixed;"
            }
            mini.setStyle(c, l);
            mini.setXY(m.el, m.x, m.y);
            return
        }
        if (i == "left") {
            l += "left:" + b + "px;"
        } else {
            if (i == "right") {
                l += "right:" + b + "px;"
            } else {
                var k = mini.getSize(c);
                l += "left:50%;margin-left:" + (-k.width * 0.5)
                        + "px;"
            }
        }
        if (h == "top") {
            l += "top:" + a + "px;"
        } else {
            if (h == "bottom") {
                l += "bottom:" + a + "px;"
            } else {
                var k = mini.getSize(c);
                l += "top:50%;margin-top:" + (-k.height * 0.5)
                        + "px;"
            }
        }
        if (f && !mini.isIE6) {
            l += "position:fixed"
        }
        mini.setStyle(c, l)
    },
    getChildNodes : function(h, g) {
        h = mini.byId(h);
        if (!h) {
            return
        }
        var b = h.childNodes;
        var f = [];
        for (var d = 0, a = b.length; d < a; d++) {
            var j = b[d];
            if (j.nodeType == 1 || g === true) {
                f.push(j)
            }
        }
        return f
    },
    removeChilds : function(g, a) {
        g = mini.byId(g);
        if (!g) {
            return
        }
        var f = mini.getChildNodes(g, true);
        for (var d = 0, b = f.length; d < b; d++) {
            var h = f[d];
            if (a && h == a) {
            } else {
                g.removeChild(f[d])
            }
        }
    },
    isAncestor : mini_isAncestor,
    findParent : mini_findParent,
    findChild : function(f, b) {
        f = mini.byId(f);
        var d = f.getElementsByTagName("*");
        for (var c = 0, a = d.length; c < a; c++) {
            var f = d[c];
            if (mini.hasClass(f, b)) {
                return f
            }
        }
    },
    isAncestor : function(d, f) {
        var a = false;
        d = mini.byId(d);
        f = mini.byId(f);
        if (d === f) {
            return true
        }
        if (d && f) {
            if (d.contains) {
                try {
                    return d.contains(f)
                } catch (b) {
                    return false
                }
            } else {
                if (d.compareDocumentPosition) {
                    return !!(d.compareDocumentPosition(f) & 16)
                } else {
                    while (f = f.parentNode) {
                        a = f == d || a
                    }
                }
            }
        }
        return a
    },
    getOffsetsTo : function(a, c) {
        var d = this.getXY(a), b = this.getXY(c);
        return [ d[0] - b[0], d[1] - b[1] ]
    },
    scrollIntoView : function(h, f, i) {
        var p = mini.byId(f) || document.body, g = this
                .getOffsetsTo(h, p), k = g[0] + p.scrollLeft, u = g[1]
                + p.scrollTop, q = u + h.offsetHeight, d = k
                + h.offsetWidth, a = p.clientHeight, m = parseInt(
                p.scrollTop, 10), s = parseInt(p.scrollLeft, 10), j = m
                + a, n = s + p.clientWidth;
        if (h.offsetHeight > a || u < m) {
            p.scrollTop = u
        } else {
            if (q > j) {
                p.scrollTop = q - a
            }
        }
        p.scrollTop = p.scrollTop;
        if (i !== false) {
            if (h.offsetWidth > p.clientWidth || k < s) {
                p.scrollLeft = k
            } else {
                if (d > n) {
                    p.scrollLeft = d - p.clientWidth
                }
            }
            p.scrollLeft = p.scrollLeft
        }
        return this
    },
    setOpacity : function(b, a) {
        jQuery(b).css({
            opacity : a
        })
    },
    selectable : function(b, a) {
        b = mini.byId(b);
        if (!!a) {
            jQuery(b).removeClass("mini-unselectable");
            if (isIE) {
                b.unselectable = "off"
            } else {
                b.style.MozUserSelect = "";
                b.style.KhtmlUserSelect = "";
                b.style.UserSelect = ""
            }
        } else {
            jQuery(b).addClass("mini-unselectable");
            if (isIE) {
                b.unselectable = "on"
            } else {
                b.style.MozUserSelect = "none";
                b.style.UserSelect = "none";
                b.style.KhtmlUserSelect = "none"
            }
        }
    },
    selectRange : function(c, b, a) {
        if (c.createTextRange) {
            var f = c.createTextRange();
            f.moveStart("character", b);
            f.moveEnd("character", a - c.value.length);
            f.select()
        } else {
            if (c.setSelectionRange) {
                c.setSelectionRange(b, a)
            }
        }
        try {
            c.focus()
        } catch (d) {
        }
    },
    getSelectRange : function(b) {
        b = mini.byId(b);
        if (!b) {
            return
        }
        try {
            b.focus()
        } catch (d) {
        }
        var f = 0, a = 0;
        if (b.createTextRange && document.selection) {
            var c = document.selection.createRange()
                    .duplicate();
            c.moveEnd("character", b.value.length);
            if (c.text === "") {
                f = b.value.length
            } else {
                f = b.value.lastIndexOf(c.text)
            }
            var c = document.selection.createRange()
                    .duplicate();
            c.moveStart("character", -b.value.length);
            a = c.text.length
        } else {
            f = b.selectionStart;
            a = b.selectionEnd
        }
        return [ f, a ]
    }
});
(function() {
    var a = {
        tabindex : "tabIndex",
        readonly : "readOnly",
        "for" : "htmlFor",
        "class" : "className",
        maxlength : "maxLength",
        cellspacing : "cellSpacing",
        cellpadding : "cellPadding",
        rowspan : "rowSpan",
        colspan : "colSpan",
        usemap : "useMap",
        frameborder : "frameBorder",
        contenteditable : "contentEditable"
    };
    var c = document.createElement("div");
    c.setAttribute("class", "t");
    var b = c.className === "t";
    mini.setAttr = function(f, d, g) {
        f.setAttribute(b ? d : (a[d] || d), g)
    };
    mini.getAttr = function(h, g) {
        if (g == "value" && (isIE6 || isIE7)) {
            var d = h.attributes[g];
            return d ? d.value : null
        }
        var f = h.getAttribute(b ? g : (a[g] || g));
        if (typeof f == "function") {
            f = h.attributes[g].value
        }
        if (!f && g == "onload") {
            var i = h.getAttributeNode ? h.getAttributeNode(g) : null;
            if (i) {
                f = i.nodeValue
            }
        }
        return f
    }
})();
mini_preventDefault = function() {
    if (window.event) {
        window.event.returnValue = false
    }
};
mini_stopPropogation = function() {
    if (window.event) {
        window.event.cancelBubble = true
    }
};
mini_onOne = function(f, d, c, b) {
    if (!f) {
        return
    }
    var a = "on" + d.toLowerCase();
    f[a] = function(h) {
        h = h || window.event;
        if (!h.target) {
            h.target = h.srcElement
        }
        if (!h.preventDefault) {
            h.preventDefault = mini_preventDefault
        }
        if (!h.stopPropogation) {
            h.stopPropogation = mini_stopPropogation
        }
        var g = c.call(b, h);
        if (g === false) {
            return false
        }
    }
};
mini_on = function(d, c, b, a) {
    d = mini.byId(d);
    a = a || d;
    if (!d || !c || !b || !a) {
        return false
    }
    var f = mini.findListener(d, c, b, a);
    if (f) {
        return false
    }
    var g = mini.createDelegate(b, a);
    mini.listeners.push([ d, c, b, a, g ]);
    if (mini.isFirefox && c == "mousewheel") {
        c = "DOMMouseScroll"
    }
    jQuery(d).bind(c, g)
};
mini_un = function(d, c, b, a) {
    d = mini.byId(d);
    a = a || d;
    if (!d || !c || !b || !a) {
        return false
    }
    var f = mini.findListener(d, c, b, a);
    if (!f) {
        return false
    }
    mini.listeners.remove(f);
    if (mini.isFirefox && c == "mousewheel") {
        c = "DOMMouseScroll"
    }
    jQuery(d).unbind(c, f[4])
};
mini.copyTo(mini, {
    listeners : [],
    on : mini_on,
    un : mini_un,
    _getListeners : function() {
        var d = mini.listeners;
        for (var c = d.length - 1; c >= 0; c--) {
            var f = d[c];
            try {
                if (f[0] == 1 && f[1] == 1 && f[2] == 1 && f[3] == 1) {
                    var a = 1
                }
            } catch (b) {
                d.removeAt(c)
            }
        }
        return d
    },
    findListener : function(h, g, f, d) {
        h = mini.byId(h);
        d = d || h;
        if (!h || !g || !f || !d) {
            return false
        }
        var c = mini._getListeners();
        for (var b = c.length - 1; b >= 0; b--) {
            var j = c[b];
            try {
                if (j[0] == h && j[1] == g && j[2] == f && j[3] == d) {
                    return j
                }
            } catch (a) {
            }
        }
    },
    clearEvent : function(d, c) {
        d = mini.byId(d);
        if (!d) {
            return false
        }
        var b = mini._getListeners();
        for (var a = b.length - 1; a >= 0; a--) {
            var f = b[a];
            if (f[0] == d) {
                if (!c || c == f[1]) {
                    mini.un(d, f[1], f[2], f[3])
                }
            }
        }
        d.onmouseover = d.onmousedown = null
    }
});
mini.__windowResizes = [];
mini.onWindowResize = function(b, a) {
    mini.__windowResizes.push([ b, a ])
};
mini.on(window, "resize", function(f) {
    var c = mini.__windowResizes;
    for (var b = 0, a = c.length; b < a; b++) {
        var d = c[b];
        d[0].call(d[1], f)
    }
});
mini.htmlEncode = function(b) {
    if (typeof b !== "string") {
        return b
    }
    var a = "";
    if (b.length == 0) {
        return ""
    }
    a = b;
    a = a.replace(/&/g, "&amp;");
    a = a.replace(/</g, "&lt;");
    a = a.replace(/>/g, "&gt;");
    a = a.replace(/ /g, "&nbsp;");
    a = a.replace(/\'/g, "&#39;");
    a = a.replace(/\"/g, "&quot;");
    return a
};
mini.htmlDecode = function(b) {
    if (typeof b !== "string") {
        return b
    }
    var a = "";
    if (b.length == 0) {
        return ""
    }
    a = b.replace(/&gt;/g, "&");
    a = a.replace(/&lt;/g, "<");
    a = a.replace(/&gt;/g, ">");
    a = a.replace(/&nbsp;/g, " ");
    a = a.replace(/&#39;/g, "'");
    a = a.replace(/&quot;/g, '"');
    return a
};
mini.copyTo(Array.prototype, {
    add : Array.prototype.enqueue = function(a) {
        this[this.length] = a;
        return this
    },
    getRange : function(f, b) {
        var a = [];
        for (var c = f; c <= b; c++) {
            var d = this[c];
            if (d) {
                a[a.length] = d
            }
        }
        return a
    },
    addRange : function(c) {
        for (var b = 0, a = c.length; b < a; b++) {
            this[this.length] = c[b]
        }
        return this
    },
    clear : function() {
        this.length = 0;
        return this
    },
    clone : function() {
        if (this.length === 1) {
            return [ this[0] ]
        } else {
            return Array.apply(null, this)
        }
    },
    contains : function(a) {
        return (this.indexOf(a) >= 0)
    },
    indexOf : function(c, d) {
        var a = this.length;
        for (var b = (d < 0) ? Math.max(0, a + d) : d || 0; b < a; b++) {
            if (this[b] === c) {
                return b
            }
        }
        return -1
    },
    dequeue : function() {
        return this.shift()
    },
    insert : function(a, b) {
        this.splice(a, 0, b);
        return this
    },
    insertRange : function(b, a) {
        for (var c = a.length - 1; c >= 0; c--) {
            var d = a[c];
            this.splice(b, 0, d)
        }
        return this
    },
    remove : function(b) {
        var a = this.indexOf(b);
        if (a >= 0) {
            this.splice(a, 1)
        }
        return (a >= 0)
    },
    removeAt : function(a) {
        var b = this[a];
        this.splice(a, 1);
        return b
    },
    removeRange : function(b) {
        b = b.clone();
        for (var c = 0, a = b.length; c < a; c++) {
            this.remove(b[c])
        }
    }
});
mini.Keyboard = {
    Left : 37,
    Top : 38,
    Right : 39,
    Bottom : 40,
    PageUp : 33,
    PageDown : 34,
    End : 35,
    Home : 36,
    Enter : 13,
    ESC : 27,
    Space : 32,
    Tab : 9,
    Del : 46,
    F1 : 112,
    F2 : 113,
    F3 : 114,
    F4 : 115,
    F5 : 116,
    F6 : 117,
    F7 : 118,
    F8 : 119,
    F9 : 120,
    F10 : 121,
    F11 : 122,
    F12 : 123
};
var ua = navigator.userAgent.toLowerCase(), check = function(a) {
    return a.test(ua)
}, DOC = document, isStrict = document.compatMode == "CSS1Compat", version = function(
        c, b) {
    var a;
    return (c && (a = b.exec(ua))) ? parseFloat(a[1]) : 0
}, docMode = document.documentMode, isOpera = check(/opera/), isOpera10_5 = isOpera
        && check(/version\/10\.5/), isChrome = check(/\bchrome\b/), isWebKit = check(/webkit/), isSafari = !isChrome
        && check(/safari/), isSafari2 = isSafari && check(/applewebkit\/4/), isSafari3 = isSafari
        && check(/version\/3/), isSafari4 = isSafari && check(/version\/4/), isSafari5_0 = isSafari
        && check(/version\/5\.0/), isSafari5 = isSafari && check(/version\/5/), isIE = !isOpera
        && check(/msie/), isIE7 = isIE
        && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7), isIE8 = isIE
        && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8), isIE9 = isIE
        && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9), isIE10 = isIE
        && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10), isIE6 = isIE
        && !isIE7 && !isIE8 && !isIE9 && !isIE10, isIE11 = (ua
        .indexOf("trident") > -1 && ua.indexOf("rv") > -1), isFirefox = navigator.userAgent
        .indexOf("Firefox") > 0, isGecko = !isWebKit && check(/gecko/), isGecko3 = isGecko
        && check(/rv:1\.9/), isGecko4 = isGecko && check(/rv:2\.0/), isGecko5 = isGecko
        && check(/rv:5\./), isGecko10 = isGecko && check(/rv:10\./), isFF3_0 = isGecko3
        && check(/rv:1\.9\.0/), isFF3_5 = isGecko3 && check(/rv:1\.9\.1/), isFF3_6 = isGecko3
        && check(/rv:1\.9\.2/), isWindows = check(/windows|win32/), isMac = check(/macintosh|mac os x/), isAir = check(/adobeair/), isLinux = check(/linux/), scrollbarSize = null, chromeVersion = version(
        true, /\bchrome\/(\d+\.\d+)/), firefoxVersion = version(true,
        /\bfirefox\/(\d+\.\d+)/), ieVersion = version(isIE, /msie (\d+\.\d+)/), operaVersion = version(
        isOpera, /version\/(\d+\.\d+)/), safariVersion = version(isSafari,
        /version\/(\d+\.\d+)/), webKitVersion = version(isWebKit,
        /webkit\/(\d+\.\d+)/), isSecure = /^https/i
        .test(window.location.protocol), isBorderBox = isIE && !isStrict;
if (isIE6) {
    try {
        DOC.execCommand("BackgroundImageCache", false, true)
    } catch (e) {
    }
}
mini.boxModel = !isBorderBox;
mini.isIE = isIE;
mini.isIE6 = isIE6;
mini.isIE7 = isIE7;
mini.isIE8 = isIE8;
mini.isIE9 = isIE9;
mini.isIE10 = isIE10;
mini.isIE11 = isIE11;
mini.isFirefox = isFirefox;
mini.isOpera = isOpera;
mini.isSafari = isSafari;
mini.isChrome = isChrome;
if (jQuery) {
    jQuery.boxModel = mini.boxModel
}
mini.noBorderBox = false;
if (jQuery.boxModel == false && isIE && isIE9 == false) {
    mini.noBorderBox = true
}
mini.MouseButton = {
    Left : 0,
    Middle : 1,
    Right : 2
};
if (isIE && !isIE9 && !isIE10) {
    mini.MouseButton = {
        Left : 1,
        Middle : 4,
        Right : 2
    }
}
mini._MaskID = 1;
mini._MaskObjects = {};
mini.mask = function(c) {
    var d = mini.byId(c);
    if (mini.isElement(d)) {
        c = {
            el : d
        }
    } else {
        if (typeof c == "string") {
            c = {
                html : c
            }
        }
    }
    c = mini.copyTo({
        html : "",
        cls : "",
        style : "",
        backStyle : "background:#ccc"
    }, c);
    c.el = mini.byId(c.el);
    if (!c.el) {
        c.el = document.body
    }
    var d = c.el;
    mini.unmask(c.el);
    d._maskid = mini._MaskID++;
    mini._MaskObjects[d._maskid] = c;
    var f = mini.append(d,
            '<div class="mini-mask"><div class="mini-mask-background" style="'
                    + c.backStyle + '"></div><div class="mini-mask-msg '
                    + c.cls + '" style="' + c.style + '">' + c.html
                    + "</div></div>");
    if (d == document.body) {
        mini.addClass(f, "mini-fixed")
    }
    c.maskEl = f;
    if (!mini.isNull(c.opacity)) {
        mini.setOpacity(f.firstChild, c.opacity)
    }
    function a() {
        b.style.display = "block";
        var g = mini.getSize(b);
        b.style.marginLeft = -g.width / 2 + "px";
        b.style.marginTop = -g.height / 2 + "px"
    }
    var b = f.lastChild;
    b.style.display = "none";
    setTimeout(function() {
        a()
    }, 0)
};
mini.unmask = function(b) {
    b = mini.byId(b);
    if (!b) {
        b = document.body
    }
    var a = mini._MaskObjects[b._maskid];
    if (!a) {
        return
    }
    delete mini._MaskObjects[b._maskid];
    var c = a.maskEl;
    a.maskEl = null;
    if (c && c.parentNode) {
        c.parentNode.removeChild(c)
    }
};
mini.Cookie = {
    get : function(f) {
        var c = document.cookie.split("; ");
        var g = null;
        for (var d = 0; d < c.length; d++) {
            var a = c[d].split("=");
            if (f == a[0]) {
                g = a
            }
        }
        if (g) {
            var b = g[1];
            if (b === undefined) {
                return b
            }
            return unescape(b)
        }
        return null
    },
    set : function(b, f, a, d) {
        var c = new Date();
        if (a != null) {
            c = new Date(c.getTime() + (a * 1000 * 3600 * 24))
        }
        document.cookie = b + "=" + escape(f)
                + ((a == null) ? "" : ("; expires=" + c.toGMTString()))
                + ";path=/" + (d ? "; domain=" + d : "")
    },
    del : function(a, b) {
        this.set(a, null, -100, b)
    }
};
mini.copyTo(mini, {
    treeToArray : function(a, n, c, k, j) {
        if (!n) {
            n = "children"
        }
        var m = [];
        for (var g = 0, f = a.length; g < f; g++) {
            var d = a[g];
            m[m.length] = d;
            if (k) {
                d[k] = j
            }
            var o = d[n];
            if (o && o.length > 0) {
                var b = d[c];
                var h = this.treeToArray(o, n, c, k, b);
                m.addRange(h)
            }
        }
        return m
    },
    arrayToTree : function(j, n, d, m) {
        if (!n) {
            n = "children"
        }
        d = d || "_id";
        m = m || "_pid";
        var a = [];
        var g = {};
        for (var k = 0, h = j.length; k < h; k++) {
            var f = j[k];
            if (!f) {
                continue
            }
            var c = f[d];
            if (c !== null && c !== undefined) {
                g[c] = f
            }
            delete f[n]
        }
        for (var k = 0, h = j.length; k < h; k++) {
            var f = j[k];
            var b = g[f[m]];
            if (!b) {
                a.push(f);
                continue
            }
            if (!b[n]) {
                b[n] = []
            }
            b[n].push(f)
        }
        return a
    }
});
mini.treeToList = mini.treeToArray;
mini.listToTree = mini.arrayToTree;
function UUID() {
    var b = [], c = "0123456789ABCDEF".split("");
    for (var a = 0; a < 36; a++) {
        b[a] = Math.floor(Math.random() * 16)
    }
    b[14] = 4;
    b[19] = (b[19] & 3) | 8;
    for (var a = 0; a < 36; a++) {
        b[a] = c[b[a]]
    }
    b[8] = b[13] = b[18] = b[23] = "-";
    return b.join("")
}
String.format = function(b) {
    var a = Array.prototype.slice.call(arguments, 1);
    b = b || "";
    return b.replace(/\{(\d+)\}/g, function(c, d) {
        return a[d]
    })
};
String.prototype.trim = function() {
    var a = /^\s+|\s+$/g;
    return function() {
        return this.replace(a, "")
    }
}();
mini
        .copyTo(
                mini,
                {
                    measureText : function(b, h, a) {
                        if (!this.measureEl) {
                            this.measureEl = mini.append(document.body,
                                    "<div></div>")
                        }
                        this.measureEl.style.cssText = "position:absolute;left:-1000px;top:-1000px;visibility:hidden;";
                        if (typeof b == "string") {
                            this.measureEl.className = b
                        } else {
                            this.measureEl.className = "";
                            var k = jQuery(b);
                            var j = jQuery(this.measureEl);
                            var c = [ "font-size", "font-style", "font-weight",
                                    "font-family", "line-height",
                                    "text-transform", "letter-spacing" ];
                            for (var f = 0, d = c.length; f < d; f++) {
                                var g = c[f];
                                j.css(g, k.css(g))
                            }
                        }
                        if (a) {
                            mini.setStyle(this.measureEl, a)
                        }
                        this.measureEl.innerHTML = h;
                        return mini.getSize(this.measureEl)
                    }
                });
if (typeof mini_layoutOnParse == "undefined") {
    mini_layoutOnParse = true
}
jQuery(function() {
    var a = new Date();
    mini.isReady = true;
    mini.parse(null, mini_layoutOnParse);
    mini._FireBindEvents();
    if ((mini.getStyle(document.body, "overflow") == "hidden" || mini.getStyle(
            document.documentElement, "overflow") == "hidden")
            && (isIE6 || isIE7)) {
        jQuery(document.body).css("overflow", "visible");
        jQuery(document.documentElement).css("overflow", "visible")
    }
    mini.__LastWindowWidth = document.documentElement.clientWidth;
    mini.__LastWindowHeight = document.documentElement.clientHeight
});
mini_onload = function(a) {
    mini.layout(null, mini_layoutOnParse ? false : true);
    mini.on(window, "resize", mini_onresize)
};
mini.on(window, "load", mini_onload);
mini.__LastWindowWidth = document.documentElement.clientWidth;
mini.__LastWindowHeight = document.documentElement.clientHeight;
mini.doWindowResizeTimer = null;
mini.allowLayout = true;
mini_onresize = function(c) {
    if (mini.doWindowResizeTimer) {
        clearTimeout(mini.doWindowResizeTimer)
    }
    mini.WindowVisible = mini.isWindowDisplay();
    if (mini.WindowVisible == false || mini.allowLayout == false) {
        return
    }
    if (typeof Ext != "undefined") {
        mini.doWindowResizeTimer = setTimeout(function() {
            var f = document.documentElement.clientWidth;
            var d = document.documentElement.clientHeight;
            if (mini.__LastWindowWidth == f && mini.__LastWindowHeight == d) {
            } else {
                mini.__LastWindowWidth = f;
                mini.__LastWindowHeight = d;
                mini.layout(null, false)
            }
            mini.doWindowResizeTimer = null
        }, 300)
    } else {
        var a = 100;
        try {
            if (parent && parent != window && parent.mini) {
                a = 0
            }
        } catch (b) {
        }
        mini.doWindowResizeTimer = setTimeout(function() {
            var f = document.documentElement.clientWidth;
            var d = document.documentElement.clientHeight;
            if (mini.__LastWindowWidth == f && mini.__LastWindowHeight == d) {
            } else {
                mini.__LastWindowWidth = f;
                mini.__LastWindowHeight = d;
                mini.layout(null, false)
            }
            mini.doWindowResizeTimer = null
        }, a)
    }
};
mini.isDisplay = function(c, a) {
    var b = a || document.body;
    while (1) {
        if (c == null || !c.style) {
            return false
        }
        if (c && c.style && c.style.display == "none") {
            return false
        }
        if (c == b) {
            return true
        }
        c = c.parentNode
    }
    return true
};
mini.isWindowDisplay = function() {
    try {
        var c = window.parent;
        var m = c != window;
        if (m) {
            var g = c.document.getElementsByTagName("iframe");
            var a = c.document.getElementsByTagName("frame");
            var j = [];
            for (var h = 0, d = g.length; h < d; h++) {
                j.push(g[h])
            }
            for (var h = 0, d = a.length; h < d; h++) {
                j.push(a[h])
            }
            var f = null;
            for (var h = 0, d = j.length; h < d; h++) {
                var b = j[h];
                if (b.contentWindow == window) {
                    f = b;
                    break
                }
            }
            if (!f) {
                return false
            }
            return mini.isDisplay(f, c.document.body)
        } else {
            return true
        }
    } catch (k) {
        return true
    }
};
mini.WindowVisible = mini.isWindowDisplay();
mini.layoutIFrames = function(a) {
    if (!document.body) {
        return
    }
    if (!a) {
        a = document.body
    }
    var b = a.getElementsByTagName("iframe");
    setTimeout(
            function() {
                for (var f = 0, c = b.length; f < c; f++) {
                    var g = b[f];
                    try {
                        if (mini.isDisplay(g) && mini.isAncestor(a, g)) {
                            if (g.contentWindow.mini) {
                                if (g.contentWindow.mini.WindowVisible == false) {
                                    g.contentWindow.mini.WindowVisible = g.contentWindow.mini
                                            .isWindowDisplay();
                                    g.contentWindow.mini.layout()
                                } else {
                                    g.contentWindow.mini.layout(null, false)
                                }
                            }
                            g.contentWindow.mini.layoutIFrames()
                        }
                    } catch (d) {
                    }
                }
            }, 30)
};

// jQuery.ajax 全局设置
$.ajaxSetup({
    cache : false
});

if (isIE) {
    setInterval(function() {
    }, 20000)
}
mini_unload = function(k) {
    try {
        var j = mini._getTopWindow();
        j[mini._WindowID] = "";
        delete j[mini._WindowID]
    } catch (m) {
    }
    var g = document.body.getElementsByTagName("iframe");
    if (g.length > 0) {
        var f = [];
        for (var d = 0, a = g.length; d < a; d++) {
            f.push(g[d])
        }
        for (var d = 0, a = f.length; d < a; d++) {
            try {
                var b = f[d];
                b._ondestroy = null;
                b.onload = function() {
                };
                jQuery(b).unbind("load");
                b.src = "";
                try {
                    b.contentWindow.document.write("");
                    b.contentWindow.document.close()
                } catch (m) {
                }
                if (b.parentNode) {
                    b.parentNode.removeChild(b)
                }
            } catch (k) {
            }
        }
    }
    var h = mini.getComponents();
    for (var d = 0, a = h.length; d < a; d++) {
        var c = h[d];
        if (c.destroyed !== true) {
            c.destroy(false)
        }
    }
    h.length = 0;
    h = null;
    mini.un(window, "unload", mini_unload);
    mini.un(window, "load", mini_onload);
    mini.un(window, "resize", mini_onresize);
    mini.components = {};
    mini.classes = {};
    mini.uiClasses = {};
    mini.uids = {};
    mini._topWindow = null;
    window.mini = null;
    window.Owner = null;
    window.CloseOwnerWindow = null;
    try {
    } catch (k) {
    }
};
mini.on(window, "unload", mini_unload);
function __OnIFrameMouseDown() {
    jQuery(document).trigger("mousedown")
}
function __BindIFrames() {
    if (mini.isIE10) {
        return
    }
    var g = document.getElementsByTagName("iframe");
    for (var b = 0, a = g.length; b < a; b++) {
        var c = g[b];
        try {
            if (c.contentWindow && c.contentWindow.document
                    && !c.contentWindow.__mousedownbinded) {
                c.contentWindow.__mousedownbinded = true;
                var f = c.contentWindow.document
            }
        } catch (d) {
        }
    }
}
setInterval(function() {
    __BindIFrames()
}, 1500);
mini.zIndex = 1000;
mini.zindex = mini.getMaxZIndex = function() {
    return mini.zIndex++
};
function js_isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true
    } catch (a) {
        return false
    }
}
function js_touchScroll(c) {
    if (js_isTouchDevice()) {
        var a = typeof c == "string" ? document.getElementById(c) : c;
        var b = 0;
        a.addEventListener("touchstart", function(d) {
            b = this.scrollTop + d.touches[0].pageY;
            d.preventDefault()
        }, false);
        a.addEventListener("touchmove", function(d) {
            this.scrollTop = b - d.touches[0].pageY;
            d.preventDefault()
        }, false)
    }
}
mini._placeholder = function(b) {
    b = mini.byId(b);
    if (!b || !isIE || isIE10) {
        return
    }
    function c() {
        var d = b._placeholder_label;
        if (!d) {
            return
        }
        var f = b.getAttribute("placeholder");
        if (!f) {
            f = b.placeholder
        }
        if (!b.value && !b.disabled) {
            d.innerHTML = f;
            d.style.display = ""
        } else {
            d.style.display = "none"
        }
    }
    if (b._placeholder) {
        c();
        return
    }
    b._placeholder = true;
    var a = document.createElement("label");
    a.className = "mini-placeholder-label";
    b.parentNode.appendChild(a);
    b._placeholder_label = a;
    a.onmousedown = function() {
        b.focus()
    };
    b.onpropertychange = function(d) {
        d = d || window.event;
        if (d.propertyName == "value") {
            c()
        }
    };
    c();
    mini.on(b, "focus", function(d) {
        if (!b.readOnly) {
            a.style.display = "none"
        }
    });
    mini.on(b, "blur", function(d) {
        c()
    })
};

/**
 * 发起一个 Ajax 请求
 * @method ajax
 * @param {Object} options ajax 请求的选项，详见 jQuery 的 Ajax 请求选项
 * @return jQuery 的 Ajax 实例
 * @member mini
 */
mini.ajax = function(a) {
    if (!a.dataType) {
        a.dataType = "text"
    }
    return window.jQuery.ajax(a)
};
mini._evalAjaxData = function(ajaxData, scope) {
    var obj = ajaxData;
    var t = typeof ajaxData;
    if (t == "string") {
        obj = eval("(" + ajaxData + ")");
        if (typeof obj == "function") {
            obj = obj.call(scope)
        }
    }
    return obj
};
if (!jQuery.fn.on) {
    jQuery.fn.on = function(c, a, d, b) {
        return this.delegate(a, c, d, b)
    }
};
