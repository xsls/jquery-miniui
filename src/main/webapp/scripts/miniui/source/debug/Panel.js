mini.Panel = function() {
    this._initButtons();
    mini.Panel.superclass.constructor.call(this);
    if (this.url) {
        this.setUrl(this.url)
    }
    this._contentEl = this._bodyEl;
    this._doVisibleEls();
    this._Resizer = new mini._Resizer(this);
    this._doTools()
};
mini
        .extend(
                mini.Panel,
                mini.Container,
                {
                    width : 250,
                    title : "",
                    iconCls : "",
                    iconStyle : "",
                    allowResize : false,
                    url : "",
                    refreshOnExpand : false,
                    maskOnLoad : true,
                    collapseOnTitleClick : false,
                    showCollapseButton : false,
                    showCloseButton : false,
                    closeAction : "display",
                    showHeader : true,
                    showToolbar : false,
                    showFooter : false,
                    headerCls : "",
                    headerStyle : "",
                    bodyCls : "",
                    bodyStyle : "",
                    footerCls : "",
                    footerStyle : "",
                    toolbarCls : "",
                    toolbarStyle : "",
                    minWidth : 180,
                    minHeight : 100,
                    maxWidth : 5000,
                    maxHeight : 3000,
                    set : function(e) {
                        if (typeof e == "string") {
                            return this
                        }
                        var b = this._allowLayout;
                        this._allowLayout = false;
                        var d = e.toolbar;
                        delete e.toolbar;
                        var f = e.footer;
                        delete e.footer;
                        var a = e.url;
                        delete e.url;
                        var c = e.buttons;
                        delete e.buttons;
                        mini.Panel.superclass.set.call(this, e);
                        if (c) {
                            this.setButtons(c)
                        }
                        if (d) {
                            this.setToolbar(d)
                        }
                        if (f) {
                            this.setFooter(f)
                        }
                        if (a) {
                            this.setUrl(a)
                        }
                        this._allowLayout = b;
                        this.doLayout();
                        return this
                    },
                    uiCls : "mini-panel",
                    _create : function() {
                        this.el = document.createElement("div");
                        this.el.className = "mini-panel";
                        this.el.tabIndex = 0;
                        var b = '<div class="mini-panel-border"><div class="mini-panel-header" ><div class="mini-panel-header-inner" ><span class="mini-panel-icon"></span><div class="mini-panel-title" ></div><div class="mini-tools" ></div></div></div><div class="mini-panel-viewport"><div class="mini-panel-toolbar"></div><div class="mini-panel-body" ></div><div class="mini-panel-footer"></div><div class="mini-resizer-trigger"></div></div></div>';
                        this.el.innerHTML = b;
                        this._borderEl = this.el.firstChild;
                        this._headerEl = this._borderEl.firstChild;
                        this._viewportEl = this._borderEl.lastChild;
                        this._toolbarEl = mini.byClass("mini-panel-toolbar",
                                this.el);
                        this._bodyEl = mini.byClass("mini-panel-body", this.el);
                        this._footerEl = mini.byClass("mini-panel-footer",
                                this.el);
                        this._resizeGridEl = mini.byClass(
                                "mini-resizer-trigger", this.el);
                        var a = mini
                                .byClass("mini-panel-header-inner", this.el);
                        this._iconEl = mini.byClass("mini-panel-icon", this.el);
                        this._titleEl = mini.byClass("mini-panel-title",
                                this.el);
                        this._toolsEl = mini.byClass("mini-tools", this.el);
                        mini.setStyle(this._bodyEl, this.bodyStyle);
                        this._doTitle()
                    },
                    destroy : function(a) {
                        this._doRemoveIFrame();
                        this._iframeEl = null;
                        this._viewportEl = this._borderEl = this._bodyEl = this._footerEl = this._toolbarEl = null;
                        this._toolsEl = this._titleEl = this._iconEl = this._resizeGridEl = null;
                        mini.Panel.superclass.destroy.call(this, a)
                    },
                    _initEvents : function() {
                        mini._BindEvents(function() {
                            mini.on(this.el, "click", this.__OnClick, this)
                        }, this)
                    },
                    _doVisibleEls : function() {
                        this._headerEl.style.display = this.showHeader ? ""
                                : "none";
                        this._toolbarEl.style.display = this.showToolbar ? ""
                                : "none";
                        this._footerEl.style.display = this.showFooter ? ""
                                : "none"
                    },
                    _setBodyWidth : true,
                    doLayout : function() {
                        if (!this.canLayout()) {
                            return
                        }
                        this._resizeGridEl.style.display = this.allowResize ? ""
                                : "none";
                        var c = this.isAutoHeight();
                        var e = this.isAutoWidth();
                        var a = this.getWidth(true);
                        var d = a;
                        if (mini.isIE6) {
                            mini.setWidth(this._bodyEl, a)
                        }
                        if (!c) {
                            var f = this.getViewportHeight();
                            mini.setHeight(this._viewportEl, f);
                            var b = this.getBodyHeight();
                            mini.setHeight(this._bodyEl, b)
                        } else {
                            this._viewportEl.style.height = "auto";
                            this._bodyEl.style.height = "auto"
                        }
                        mini.layout(this._borderEl);
                        this.fire("layout")
                    },
                    deferLayout : function(b) {
                        if (!b) {
                            b = 10
                        }
                        if (this._layoutTimer) {
                            return
                        }
                        var a = this;
                        this._layoutTimer = setTimeout(function() {
                            a._layoutTimer = null;
                            a.doLayout()
                        }, b)
                    },
                    _stopLayout : function() {
                        clearTimeout(this._layoutTimer);
                        this._layoutTimer = null
                    },
                    getViewportWidth : function(a) {
                        return this.getWidth(true)
                    },
                    getViewportHeight : function(c) {
                        var b = this.getHeight(true) - this.getHeaderHeight();
                        if (c) {
                            var a = mini.getPaddings(this._viewportEl);
                            var e = mini.getBorders(this._viewportEl);
                            var d = mini.getMargins(this._viewportEl);
                            if (jQuery.boxModel) {
                                b = b - a.top - a.bottom - e.top - e.bottom
                            }
                            b = b - d.top - d.bottom
                        }
                        return b
                    },
                    getBodyHeight : function(c) {
                        var b = this.getViewportHeight();
                        var b = b - this.getToolbarHeight()
                                - this.getFooterHeight();
                        if (c) {
                            var e = mini.getPaddings(this._bodyEl);
                            var a = mini.getBorders(this._bodyEl);
                            var d = mini.getMargins(this._bodyEl);
                            if (jQuery.boxModel) {
                                b = b - e.top - e.bottom - a.top - a.bottom
                            }
                            b = b - d.top - d.bottom
                        }
                        if (b < 0) {
                            b = 0
                        }
                        return b
                    },
                    getHeaderHeight : function() {
                        var a = this.showHeader ? jQuery(this._headerEl)
                                .outerHeight() : 0;
                        return a
                    },
                    getToolbarHeight : function() {
                        var a = this.showToolbar ? jQuery(this._toolbarEl)
                                .outerHeight() : 0;
                        return a
                    },
                    getFooterHeight : function() {
                        var a = this.showFooter ? jQuery(this._footerEl)
                                .outerHeight() : 0;
                        return a
                    },
                    setHeaderStyle : function(a) {
                        this.headerStyle = a;
                        mini.setStyle(this._headerEl, a);
                        this.doLayout()
                    },
                    getHeaderStyle : function() {
                        return this.headerStyle
                    },
                    setBodyStyle : function(a) {
                        this.bodyStyle = a;
                        mini.setStyle(this._bodyEl, a);
                        this.doLayout()
                    },
                    getBodyStyle : function() {
                        return this.bodyStyle
                    },
                    setToolbarStyle : function(a) {
                        this.toolbarStyle = a;
                        mini.setStyle(this._toolbarEl, a);
                        this.doLayout()
                    },
                    getToolbarStyle : function() {
                        return this.toolbarStyle
                    },
                    setFooterStyle : function(a) {
                        this.footerStyle = a;
                        mini.setStyle(this._footerEl, a);
                        this.doLayout()
                    },
                    getFooterStyle : function() {
                        return this.footerStyle
                    },
                    setHeaderCls : function(a) {
                        jQuery(this._headerEl).removeClass(this.headerCls);
                        jQuery(this._headerEl).addClass(a);
                        this.headerCls = a;
                        this.doLayout()
                    },
                    getHeaderCls : function() {
                        return this.headerCls
                    },
                    setBodyCls : function(a) {
                        jQuery(this._bodyEl).removeClass(this.bodyCls);
                        jQuery(this._bodyEl).addClass(a);
                        this.bodyCls = a;
                        this.doLayout()
                    },
                    getBodyCls : function() {
                        return this.bodyCls
                    },
                    setToolbarCls : function(a) {
                        jQuery(this._toolbarEl).removeClass(this.toolbarCls);
                        jQuery(this._toolbarEl).addClass(a);
                        this.toolbarCls = a;
                        this.doLayout()
                    },
                    getToolbarCls : function() {
                        return this.toolbarCls
                    },
                    setFooterCls : function(a) {
                        jQuery(this._footerEl).removeClass(this.footerCls);
                        jQuery(this._footerEl).addClass(a);
                        this.footerCls = a;
                        this.doLayout()
                    },
                    getFooterCls : function() {
                        return this.footerCls
                    },
                    _doTitle : function() {
                        this._titleEl.innerHTML = this.title;
                        this._iconEl.style.display = (this.iconCls || this.iconStyle) ? "inline"
                                : "none";
                        this._iconEl.className = "mini-panel-icon "
                                + this.iconCls;
                        mini.setStyle(this._iconEl, this.iconStyle)
                    },
                    setTitle : function(a) {
                        this.title = a;
                        this._doTitle()
                    },
                    getTitle : function() {
                        return this.title
                    },
                    setIconCls : function(a) {
                        this.iconCls = a;
                        this._doTitle()
                    },
                    getIconCls : function() {
                        return this.iconCls
                    },
                    setIconStyle : function(a) {
                        this.iconStyle = a;
                        this._doTitle()
                    },
                    getIconStyle : function() {
                        return this.iconStyle
                    },
                    _doTools : function() {
                        var d = "";
                        for (var c = 0, a = this.buttons.length; c < a; c++) {
                            var b = this.buttons[c];
                            if (b.html) {
                                d += b.html
                            } else {
                                d += '<span id="' + c + '" class="' + b.cls
                                        + " "
                                        + (b.enabled ? "" : "mini-disabled")
                                        + '" style="' + b.style + ";"
                                        + (b.visible ? "" : "display:none;")
                                        + '"></span>'
                            }
                        }
                        this._toolsEl.innerHTML = d
                    },
                    setShowCloseButton : function(b) {
                        this.showCloseButton = b;
                        var a = this.getButton("close");
                        if (!a) {
                            return
                        }
                        a.visible = b;
                        this._doTools()
                    },
                    getShowCloseButton : function() {
                        return this.showCloseButton
                    },
                    setCloseAction : function(a) {
                        this.closeAction = a
                    },
                    getCloseAction : function() {
                        return this.closeAction
                    },
                    setShowCollapseButton : function(b) {
                        this.showCollapseButton = b;
                        var a = this.getButton("collapse");
                        if (!a) {
                            return
                        }
                        a.visible = b;
                        this._doTools()
                    },
                    getShowCollapseButton : function() {
                        return this.showCollapseButton
                    },
                    setShowHeader : function(a) {
                        this.showHeader = a;
                        this._doVisibleEls();
                        this.deferLayout()
                    },
                    getShowHeader : function() {
                        return this.showHeader
                    },
                    setShowToolbar : function(a) {
                        this.showToolbar = a;
                        this._doVisibleEls();
                        this.deferLayout()
                    },
                    getShowToolbar : function() {
                        return this.showToolbar
                    },
                    setShowFooter : function(a) {
                        this.showFooter = a;
                        this._doVisibleEls();
                        this.deferLayout()
                    },
                    getShowFooter : function() {
                        return this.showFooter
                    },
                    __OnClick : function(b) {
                        if (mini.isAncestor(this._headerEl, b.target)) {
                            var c = mini.findParent(b.target, "mini-tools");
                            if (c) {
                                var a = this.getButton(parseInt(b.target.id));
                                if (a) {
                                    this._OnButtonClick(a, b)
                                }
                            } else {
                                if (this.collapseOnTitleClick) {
                                    this.toggle()
                                }
                            }
                        }
                    },
                    _OnButtonClick : function(d, a) {
                        var f = {
                            button : d,
                            index : this.buttons.indexOf(d),
                            name : d.name.toLowerCase(),
                            htmlEvent : a,
                            cancel : false
                        };
                        this.fire("beforebuttonclick", f);
                        try {
                            if (f.name == "close"
                                    && this.closeAction == "destroy"
                                    && this._iframeEl
                                    && this._iframeEl.contentWindow) {
                                var b = true;
                                if (this._iframeEl.contentWindow.CloseWindow) {
                                    b = this._iframeEl.contentWindow
                                            .CloseWindow("close")
                                } else {
                                    if (this._iframeEl.contentWindow.CloseOwnerWindow) {
                                        b = this._iframeEl.contentWindow
                                                .CloseOwnerWindow("close")
                                    }
                                }
                                if (b === false) {
                                    f.cancel = true
                                }
                            }
                        } catch (c) {
                        }
                        if (f.cancel == true) {
                            return f
                        }
                        this.fire("buttonclick", f);
                        if (f.name == "close") {
                            if (this.closeAction == "destroy") {
                                this.__HideAction = "close";
                                this.destroy()
                            } else {
                                this.hide()
                            }
                        }
                        if (f.name == "collapse") {
                            this.toggle();
                            if (this.refreshOnExpand && this.expanded
                                    && this.url) {
                                this.reload()
                            }
                        }
                        return f
                    },
                    onButtonClick : function(b, a) {
                        this.on("buttonclick", b, a)
                    },
                    _initButtons : function() {
                        this.buttons = [];
                        var b = this.createButton({
                            name : "collapse",
                            cls : "mini-tools-collapse",
                            visible : this.showCollapseButton
                        });
                        this.buttons.push(b);
                        var a = this.createButton({
                            name : "close",
                            cls : "mini-tools-close",
                            visible : this.showCloseButton
                        });
                        this.buttons.push(a)
                    },
                    createButton : function(a) {
                        var b = mini.copyTo({
                            name : "",
                            cls : "",
                            style : "",
                            visible : true,
                            enabled : true,
                            html : ""
                        }, a);
                        return b
                    },
                    setButtons : function(e) {
                        if (typeof e == "string") {
                            e = e.split(" ")
                        }
                        if (!mini.isArray(e)) {
                            e = []
                        }
                        var d = [];
                        for (var c = 0, a = e.length; c < a; c++) {
                            var b = e[c];
                            if (typeof b == "string") {
                                b = b.trim();
                                if (!b) {
                                    continue
                                }
                                b = {
                                    name : b,
                                    cls : "mini-tools-" + b,
                                    html : ""
                                }
                            }
                            b = this.createButton(b);
                            d.push(b)
                        }
                        this.buttons = d;
                        this._doTools()
                    },
                    getButtons : function() {
                        return this.buttons
                    },
                    addButton : function(b, a) {
                        if (typeof b == "string") {
                            b = {
                                iconCls : b
                            }
                        }
                        b = this.createButton(b);
                        if (typeof a != "number") {
                            a = this.buttons.length
                        }
                        this.buttons.insert(a, b);
                        this._doTools()
                    },
                    updateButton : function(b, a) {
                        var c = this.getButton(b);
                        if (!c) {
                            return
                        }
                        mini.copyTo(c, a);
                        this._doTools()
                    },
                    removeButton : function(a) {
                        var b = this.getButton(a);
                        if (!b) {
                            return
                        }
                        this.buttons.remove(b);
                        this._doTools()
                    },
                    getButton : function(b) {
                        if (typeof b == "number") {
                            return this.buttons[b]
                        } else {
                            for (var d = 0, a = this.buttons.length; d < a; d++) {
                                var c = this.buttons[d];
                                if (c.name == b) {
                                    return c
                                }
                            }
                        }
                    },
                    setBody : function(a) {
                        __mini_setControls(a, this._bodyEl, this)
                    },
                    set_bodyParent : function(a) {
                    },
                    setToolbar : function(a) {
                        __mini_setControls(a, this._toolbarEl, this)
                    },
                    setFooter : function(a) {
                        __mini_setControls(a, this._footerEl, this)
                    },
                    getHeaderEl : function() {
                        return this._headerEl
                    },
                    getToolbarEl : function() {
                        return this._toolbarEl
                    },
                    getBodyEl : function() {
                        return this._bodyEl
                    },
                    getFooterEl : function() {
                        return this._footerEl
                    },
                    getIFrameEl : function(a) {
                        return this._iframeEl
                    },
                    _getMaskWrapEl : function() {
                        return this._bodyEl
                    },
                    _doRemoveIFrame : function(c) {
                        if (this._iframeEl) {
                            var b = this._iframeEl;
                            b.onload = function() {
                            };
                            jQuery(b).unbind("load");
                            b.src = "";
                            try {
                                b.contentWindow.document.write("");
                                b.contentWindow.document.close()
                            } catch (a) {
                            }
                            if (b._ondestroy) {
                                b._ondestroy()
                            }
                            try {
                                this._iframeEl.parentNode
                                        .removeChild(this._iframeEl);
                                this._iframeEl.removeNode(true)
                            } catch (a) {
                            }
                        }
                        this._iframeEl = null;
                        if (c === true) {
                            mini.removeChilds(this._bodyEl)
                        }
                    },
                    _deferLoadingTime : 80,
                    _doLoad : function() {
                        if (!this.url) {
                            return
                        }
                        this._doRemoveIFrame(true);
                        var a = new Date();
                        var c = this;
                        this.loadedUrl = this.url;
                        if (this.maskOnLoad) {
                            this.loading()
                        }
                        jQuery(this._bodyEl).css("overflow", "hidden");
                        var b = mini
                                .createIFrame(
                                        this.url,
                                        function(h, g) {
                                            var d = (a - new Date())
                                                    + c._deferLoadingTime;
                                            if (d < 0) {
                                                d = 0
                                            }
                                            setTimeout(function() {
                                                c.unmask()
                                            }, d);
                                            try {
                                                c._iframeEl.contentWindow.Owner = c.Owner;
                                                c._iframeEl.contentWindow.CloseOwnerWindow = function(
                                                        j) {
                                                    c.__HideAction = j;
                                                    var i = true;
                                                    if (c.__onDestroy) {
                                                        i = c.__onDestroy(j)
                                                    }
                                                    if (i === false) {
                                                        return false
                                                    }
                                                    var k = {
                                                        iframe : c._iframeEl,
                                                        action : j
                                                    };
                                                    c.fire("unload", k);
                                                    setTimeout(function() {
                                                        c.destroy()
                                                    }, 10)
                                                }
                                            } catch (f) {
                                            }
                                            if (g) {
                                                if (c.__onLoad) {
                                                    c.__onLoad()
                                                }
                                                var f = {
                                                    iframe : c._iframeEl
                                                };
                                                c.fire("load", f)
                                            }
                                        });
                        this._bodyEl.appendChild(b);
                        this._iframeEl = b
                    },
                    load : function(a, c, b) {
                        this.setUrl(a, c, b)
                    },
                    reload : function() {
                        this.setUrl(this.url)
                    },
                    setUrl : function(a, c, b) {
                        this.url = a;
                        this.__onLoad = c;
                        this.__onDestroy = b;
                        if (this.expanded && a) {
                            this._doLoad()
                        }
                    },
                    getUrl : function() {
                        return this.url
                    },
                    setRefreshOnExpand : function(a) {
                        this.refreshOnExpand = a
                    },
                    getRefreshOnExpand : function() {
                        return this.refreshOnExpand
                    },
                    setMaskOnLoad : function(a) {
                        this.maskOnLoad = a
                    },
                    getMaskOnLoad : function(a) {
                        return this.maskOnLoad
                    },
                    setAllowResize : function(a) {
                        if (this.allowResize != a) {
                            this.allowResize = a;
                            this.doLayout()
                        }
                    },
                    getAllowResize : function() {
                        return this.allowResize
                    },
                    expanded : true,
                    setExpanded : function(a) {
                        if (this.expanded != a) {
                            this.expanded = a;
                            if (this.expanded) {
                                this.expand()
                            } else {
                                this.collapse()
                            }
                        }
                    },
                    getExpanded : function() {
                        return this.expanded
                    },
                    toggle : function() {
                        if (this.expanded) {
                            this.collapse()
                        } else {
                            this.expand()
                        }
                    },
                    collapse : function() {
                        this.expanded = false;
                        if (this.state != "max") {
                            this._height = this.el.style.height
                        }
                        this.el.style.height = "auto";
                        this._viewportEl.style.display = "none";
                        mini.addClass(this.el, "mini-panel-collapse");
                        this.doLayout()
                    },
                    expand : function() {
                        this.expanded = true;
                        if (this._height) {
                            this.el.style.height = this._height
                        }
                        this._viewportEl.style.display = "block";
                        if (this.state != "max") {
                            delete this._height
                        }
                        mini.removeClass(this.el, "mini-panel-collapse");
                        if (this.url && this.url != this.loadedUrl) {
                            this._doLoad()
                        }
                        this.doLayout()
                    },
                    setCollapseOnTitleClick : function(a) {
                        this.collapseOnTitleClick = a;
                        mini.removeClass(this.el, "mini-panel-titleclick");
                        if (a) {
                            mini.addClass(this.el, "mini-panel-titleclick")
                        }
                    },
                    getCollapseOnTitleClick : function() {
                        return this.collapseOnTitleClick
                    },
                    getAttrs : function(d) {
                        var a = mini.Panel.superclass.getAttrs.call(this, d);
                        mini._ParseString(d, a, [ "title", "iconCls",
                                "iconStyle", "headerCls", "headerStyle",
                                "bodyCls", "bodyStyle", "footerCls",
                                "footerStyle", "toolbarCls", "toolbarStyle",
                                "footer", "toolbar", "url", "closeAction",
                                "loadingMsg", "onbeforebuttonclick",
                                "onbuttonclick", "onload", "buttons" ]);
                        mini._ParseBool(d, a, [ "allowResize",
                                "showCloseButton", "showHeader", "showToolbar",
                                "showFooter", "showCollapseButton",
                                "refreshOnExpand", "maskOnLoad", "expanded",
                                "collapseOnTitleClick" ]);
                        var c = mini.getChildNodes(d, true);
                        for (var b = c.length - 1; b >= 0; b--) {
                            var e = c[b];
                            var f = jQuery(e).attr("property");
                            if (!f) {
                                continue
                            }
                            f = f.toLowerCase();
                            if (f == "toolbar") {
                                a.toolbar = e
                            } else {
                                if (f == "footer") {
                                    a.footer = e
                                }
                            }
                        }
                        a.body = c;
                        return a
                    }
                });
mini.regClass(mini.Panel, "panel");