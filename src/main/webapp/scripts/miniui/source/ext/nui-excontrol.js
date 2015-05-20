
mini.MenuBarX = function() {
    mini.MenuBarX.superclass.constructor.call(this)
};
mini.extend(mini.MenuBarX, mini.MenuBar, {
    uiCls : "mini-menubarx",
    _itemType : "menuitemx"
});
mini.regClass(mini.MenuBarX, "menubarx");
mini.MenuItemX = function() {
    mini.MenuItemX.superclass.constructor.call(this)
};
mini.extend(mini.MenuItemX, mini.MenuItem, {
    setMenu : function(b) {
        if (mini.isArray(b)) {
            b = {
                type : "menu",
                items : b
            }
        }
        if (this.menu !== b) {
            var a = mini._getTopMINI();
            this.menu = a.getAndCreate(b);
            this.menu.hide();
            this.menu.ownerItem = this;
            this.doUpdate();
            this.menu.on("itemschanged", this.__OnItemsChanged, this);
            this.menu.window = a.window
        }
    },
    showMenu : function() {
        if (this.menu && this.menu.isDisplay() == false) {
            this.menu.setHideAction("outerclick");
            var a = {
                xAlign : "outright",
                yAlign : "top",
                outXAlign : "outleft",
                popupCls : "mini-menu-popup"
            };
            if (this.ownerMenu && this.ownerMenu.vertical == false) {
                a.xAlign = "left";
                a.yAlign = "below";
                a.outXAlign = null
            }
            a.window = window;
            a.topWindow = this.menu.window;
            this.menu.showAtEl(this.el, a)
        }
    }
});
mini.regClass(mini.MenuItemX, "menuitemx");
mini.Menu.prototype._getWindowOffset = function(b) {
    var c = b.window, a = b.topWindow;
    if (c && a && c != a) {
        return mini._getWindowOffset(c, a)
    } else {
        return [ 0, 0 ]
    }
};
mini._getTopMINI = function() {
    var b = [];
    function a(d) {
        try {
            d.___try = 1;
            if (!d.mini) {
                return
            }
            b.push(d)
        } catch (c) {
        }
        if (d.parent && d.parent != d) {
            a(d.parent)
        }
    }
    a(window);
    return b[b.length - 1].mini
};
mini._getWindowOffset = function(h, d) {
    var g = [];
    function b(u) {
        var t = u.parent;
        var r = t.document.getElementsByTagName("iframe");
        for (var q = 0, o = r.length; q < o; q++) {
            var s = r[q];
            if (s.contentWindow == u) {
                g.add(s);
                break
            }
        }
        if (t != d) {
            b(t)
        }
    }
    b(h);
    g.reverse();
    var n = 0, m = 0;
    var j = d.mini;
    for (var e = 0, c = g.length; e < c; e++) {
        var a = g[e];
        var f = j.getBox(a);
        n += f.x;
        m += f.y;
        var k = j.getBorders(a);
        n += k.left;
        m += k.top;
        j = a.contentWindow.mini
    }
    return [ n, m ]
};
var __TopMINI = mini._getTopMINI();
mini.DatePickerX = function() {
    mini.DatePickerX.superclass.constructor.call(this)
};
mini.extend(mini.DatePickerX, mini.DatePicker, {
    uiCls : "mini-datepickerx",
    destroy : function(b) {
        if (this._calendar) {
            this._calendar.destroy();
            this._calendar = null
        }
        var a = __TopMINI;
        a.DatePicker._Calendar = null;
        mini.DatePickerX.superclass.destroy.call(this, b)
    },
    _createPopup : function() {
        var a = __TopMINI;
        this.popup = new a.Popup();
        this.popup.setShowAction("none");
        this.popup.setHideAction("outerclick");
        this.popup.setPopupEl(this.el);
        this.popup.on("BeforeClose", this.__OnPopupBeforeClose, this);
        a.on(this.popup.el, "keydown", this.__OnPopupKeyDown, this);
        this._calendar = this._getCalendar()
    },
    _getCalendar : function() {
        var a = __TopMINI;
        if (!a.DatePicker._Calendar) {
            var b = a.DatePicker._Calendar = new a.Calendar();
            b.setStyle("border:0;")
        }
        return a.DatePicker._Calendar
    },
    _doShowAtEl : function(c, b) {
        var a = this.getPopup();
        a._getWindowOffset = mini.Menu.prototype._getWindowOffset;
        b.window = window;
        b.topWindow = __TopMINI.window;
        a.showAtEl(c, b)
    }
});
mini.regClass(mini.DatePickerX, "DatePickerX");

nui.Tabs.prototype._doUpdateBottom = function() {
    var p = this.tabPosition == "bottom";
    var v = "";
    if (p) {
        v += '<div class="mini-tabs-scrollCt">';
        v += '<div class="mini-tabs-nav"><a class="mini-tabs-leftButton" href="javascript:void(0)" hideFocus onclick="return false"></a><a class="mini-tabs-rightButton" href="javascript:void(0)" hideFocus onclick="return false"></a></div>';
        v += '<div class="mini-tabs-buttons"></div>'
    }
    v += '<div class="mini-tabs-headers">';
    var u = this.getTabRows();
    for (var h = 0, f = u.length; h < f; h++) {
        var q = u[h];
        var t = "";
        v += '<table class="mini-tabs-header" cellspacing="0" cellpadding="0"><tr><td class="mini-tabs-space mini-tabs-firstSpace"><div></div></td>';
        for (var n = 0, e = q.length; n < e; n++) {
            var c = q[n];
            var b = this._createTabId(c);
            if (!c.visible) {
                continue
            }
            var o = this.tabs.indexOf(c);
            var t = c.headerCls || "";
            if (c.enabled == false) {
                t += " mini-disabled"
            }
            v += '<td id="' + b + '" index="' + o + '"  class="mini-tab ' + t
                    + '" style="' + c.headerStyle + '">';
            if (c.iconCls || c.iconStyle) {
                v += '<span class="mini-tab-icon ' + c.iconCls + '" style="'
                        + c.iconStyle + '"></span>'
            }
            v += '<span class="mini-tab-text">' + c.title + "</span>";
            if (c.showCloseButton) {
                var a = "";
                if (c.enabled) {
                    a = "onmouseover=\"mini.addClass(this, 'mini-tab-close-hover')\" onmouseout=\"mini.removeClass(this, 'mini-tab-close-hover')\""
                }
                v += '<span class="mini-tab-close" ' + a + "></span>"
            }
            v += "</td>";
            if (n != e - 1) {
                v += '<td class="mini-tabs-space2"><div></div></td>'
            }
        }
        v += '<td class="mini-tabs-space mini-tabs-lastSpace" ><div></div></td></tr></table>'
    }
    if (p) {
        v += "</div>"
    }
    v += "</div>";
    this._doClearElement();
    mini.append(this._td2El, v);
    var d = this._td2El;
    this._headerEl = d.lastChild.lastChild;
    if (p) {
        this._navEl = this._headerEl.parentNode.firstChild;
        this._leftButtonEl = this._navEl.firstChild;
        this._rightButtonEl = this._navEl.childNodes[1]
    }
    switch (this.tabAlign) {
    case "center":
        var r = this._headerEl.childNodes;
        for (var n = 0, e = r.length; n < e; n++) {
            var g = r[n];
            var m = g.getElementsByTagName("td");
            m[0].style.width = "50%";
            m[m.length - 1].style.width = "50%"
        }
        break;
    case "right":
        var r = this._headerEl.childNodes;
        for (var n = 0, e = r.length; n < e; n++) {
            var g = r[n];
            var m = g.getElementsByTagName("td");
            m[0].style.width = "100%"
        }
        break;
    case "fit":
        break;
    default:
        var r = this._headerEl.childNodes;
        for (var n = 0, e = r.length; n < e; n++) {
            var g = r[n];
            var m = g.getElementsByTagName("td");
            m[m.length - 1].style.width = "100%"
        }
        break
    }
};
nui.Tabs.prototype.doLayout = function() {
    if (!this.canLayout()) {
        return
    }
    this._handleIFrameOverflow();
    var A = this.isAutoHeight();
    E = this.getHeight(true);
    n = this.getWidth();
    var o = E;
    var u = n;
    if (this.showBody) {
        this._bodyEl.style.display = ""
    } else {
        this._bodyEl.style.display = "none"
    }
    if (this.plain) {
        mini.addClass(this.el, "mini-tabs-plain")
    } else {
        mini.removeClass(this.el, "mini-tabs-plain")
    }
    if (!A && this.showBody) {
        var z = jQuery(this._headerEl).outerHeight();
        var e = jQuery(this._headerEl).outerWidth();
        if (this.tabPosition == "top" || this.tabPosition == "bottom") {
            z = jQuery(this._headerEl.parentNode).outerHeight()
        }
        if (this.tabPosition == "left" || this.tabPosition == "right") {
            n = n - e
        } else {
            E = E - z
        }
        if (jQuery.boxModel) {
            var q = mini.getPaddings(this._bodyEl);
            var x = mini.getBorders(this._bodyEl);
            E = E - q.top - q.bottom - x.top - x.bottom;
            n = n - q.left - q.right - x.left - x.right
        }
        margin = mini.getMargins(this._bodyEl);
        E = E - margin.top - margin.bottom;
        n = n - margin.left - margin.right;
        if (E < 0) {
            E = 0
        }
        if (n < 0) {
            n = 0
        }
        this._bodyEl.style.width = n + "px";
        this._bodyEl.style.height = E + "px";
        if (this.tabPosition == "left" || this.tabPosition == "right") {
            var a = this._headerEl.getElementsByTagName("tr")[0];
            var B = a.childNodes;
            var p = B[0].getElementsByTagName("tr");
            var f = last = all = 0;
            for (var C = 0, y = p.length; C < y; C++) {
                var a = p[C];
                var m = jQuery(a).outerHeight();
                all += m;
                if (C == 0) {
                    f = m
                }
                if (C == y - 1) {
                    last = m
                }
            }
            switch (this.tabAlign) {
            case "center":
                var r = parseInt((o - (all - f - last)) / 2);
                for (var C = 0, y = B.length; C < y; C++) {
                    B[C].firstChild.style.height = o + "px";
                    var j = B[C].firstChild;
                    var p = j.getElementsByTagName("tr");
                    var H = p[0], G = p[p.length - 1];
                    H.style.height = r + "px";
                    G.style.height = r + "px"
                }
                break;
            case "right":
                for (var C = 0, y = B.length; C < y; C++) {
                    var j = B[C].firstChild;
                    var p = j.getElementsByTagName("tr");
                    var a = p[0];
                    var s = o - (all - f);
                    if (s >= 0) {
                        a.style.height = s + "px"
                    }
                }
                break;
            case "fit":
                for (var C = 0, y = B.length; C < y; C++) {
                    B[C].firstChild.style.height = o + "px"
                }
                break;
            default:
                for (var C = 0, y = B.length; C < y; C++) {
                    var j = B[C].firstChild;
                    var p = j.getElementsByTagName("tr");
                    var a = p[p.length - 1];
                    var s = o - (all - last);
                    if (s >= 0) {
                        a.style.height = s + "px"
                    }
                }
                break
            }
        }
    } else {
        this._bodyEl.style.width = "auto";
        this._bodyEl.style.height = "auto"
    }
    var d = this.getTabBodyEl(this.activeIndex);
    if (d) {
        if (!A && this.showBody) {
            var E = mini.getHeight(this._bodyEl, true);
            if (jQuery.boxModel) {
                var q = mini.getPaddings(d);
                var x = mini.getBorders(d);
                E = E - q.top - q.bottom - x.top - x.bottom
            }
            d.style.height = E + "px"
        } else {
            d.style.height = "auto"
        }
    }
    switch (this.tabPosition) {
    case "bottom":
        var b = this._headerEl.childNodes;
        for (var C = 0, y = b.length; C < y; C++) {
            var j = b[C];
            mini.removeClass(j, "mini-tabs-header2");
            if (y > 1 && C != 0) {
                mini.addClass(j, "mini-tabs-header2")
            }
        }
        break;
    case "left":
        var B = this._headerEl.firstChild.rows[0].cells;
        for (var C = 0, y = B.length; C < y; C++) {
            var g = B[C];
            mini.removeClass(g, "mini-tabs-header2");
            if (y > 1 && C == 0) {
                mini.addClass(g, "mini-tabs-header2")
            }
        }
        break;
    case "right":
        var B = this._headerEl.firstChild.rows[0].cells;
        for (var C = 0, y = B.length; C < y; C++) {
            var g = B[C];
            mini.removeClass(g, "mini-tabs-header2");
            if (y > 1 && C != 0) {
                mini.addClass(g, "mini-tabs-header2")
            }
        }
        break;
    default:
        var b = this._headerEl.childNodes;
        for (var C = 0, y = b.length; C < y; C++) {
            var j = b[C];
            mini.removeClass(j, "mini-tabs-header2");
            if (y > 1 && C == 0) {
                mini.addClass(j, "mini-tabs-header2")
            }
        }
        break
    }
    mini.removeClass(this.el, "mini-tabs-scroll");
    var g = mini.byClass("mini-tabs-lastSpace", this.el);
    var D = mini.byClass("mini-tabs-buttons", this.el);
    var c = this._headerEl.parentNode;
    c.style.paddingRight = "0px";
    if (this._navEl) {
        this._navEl.style.display = "none"
    }
    if (D) {
        D.style.display = "none"
    }
    mini.setWidth(c, u);
    if ((this.tabPosition == "top" || this.tabPosition == "bottom")
            && this.tabAlign == "left") {
        this._headerEl.style.width = "auto";
        D.style.display = "block";
        var v = u;
        var k = this._headerEl.firstChild.offsetWidth - g.offsetWidth;
        var F = D.firstChild ? D.offsetWidth : 0;
        if (k + F > v) {
            this._navEl.style.display = "block";
            this._navEl.style.right = F + "px";
            var t = this._navEl.offsetWidth;
            var n = v - F - t;
            mini.setWidth(this._headerEl, n)
        }
    }
    this._scrollToTab(this.activeIndex);
    this._doScrollButton();
    mini.layout(this._bodyEl);
    this.fire("layout")
};
nui.Tabs.prototype._doScrollButton = function() {
    if (this.tabPosition == "top" || this.tabPosition == "bottom") {
        mini.removeClass(this._leftButtonEl, "mini-disabled");
        mini.removeClass(this._rightButtonEl, "mini-disabled");
        if (this._headerEl.scrollLeft == 0) {
            mini.addClass(this._leftButtonEl, "mini-disabled")
        }
        var c = this.getTabEl(this.tabs.length - 1);
        if (c) {
            var a = mini.getBox(c);
            var b = mini.getBox(this._headerEl);
            if (a.right <= b.right) {
                mini.addClass(this._rightButtonEl, "mini-disabled")
            }
        }
    }
};
nui.Tabs.prototype._scrollToTab = function(b) {
    var f = this._headerEl.scrollLeft;
    if (this.tabPosition == "top" || this.tabPosition == "bottom") {
        this._headerEl.scrollLeft = f;
        var e = this.getTabEl(b);
        if (e) {
            var d = this;
            var a = mini.getBox(e);
            var c = mini.getBox(d._headerEl);
            if (a.x < c.x) {
                d._headerEl.scrollLeft -= (c.x - a.x)
            } else {
                if (a.right > c.right) {
                    d._headerEl.scrollLeft += (a.right - c.right)
                }
            }
        }
    }
};
nui.Tabs.prototype.__OnMouseDown = function(d) {
    clearInterval(this._scrollTimer);
    if (this.tabPosition == "top" || this.tabPosition == "bottom") {
        var c = this;
        var b = 0, a = 10;
        if (d.target == this._leftButtonEl) {
            this._scrollTimer = setInterval(function() {
                c._headerEl.scrollLeft -= a;
                b++;
                if (b > 5) {
                    a = 18
                }
                if (b > 10) {
                    a = 25
                }
                c._doScrollButton()
            }, 25)
        } else {
            if (d.target == this._rightButtonEl) {
                this._scrollTimer = setInterval(function() {
                    c._headerEl.scrollLeft += a;
                    b++;
                    if (b > 5) {
                        a = 18
                    }
                    if (b > 10) {
                        a = 25
                    }
                    c._doScrollButton()
                }, 25)
            }
        }
        mini.on(document, "mouseup", this.__OnDocMouseUp, this)
    }
};