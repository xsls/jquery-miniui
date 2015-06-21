/**
 * 弹出面板。
 * @class
 * @extends mini.Panel
 * @constructor
 */
mini.Window = function() {
    mini.Window.superclass.constructor.call(this);
    this.addCls("mini-window");
    this.setVisible(false);
    this.setAllowDrag(this.allowDrag);
    this.setAllowResize(this.allowResize)
};
mini.extend(mini.Window, mini.Panel, {
    x : 0,
    y : 0,
    state : "restore",
    _dragCls : "mini-window-drag",
    _resizeCls : "mini-window-resize",
    allowDrag : true,
    showCloseButton : true,
    showMaxButton : false,
    showMinButton : false,
    showCollapseButton : false,
    showModal : true,
    minWidth : 150,
    minHeight : 80,
    maxWidth : 2000,
    maxHeight : 2000,
    uiCls : "mini-window",
    _create : function() {
        mini.Window.superclass._create.call(this);
        if (mini.isIE && mini_useShims) {
            var a = "<iframe frameborder='0' style='position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;scrolling:no;'></iframe>";
            mini.append(this.el, a)
        }
    },
    _initButtons : function() {
        this.buttons = [];
        var d = this.createButton({
            name : "collapse",
            cls : "mini-tools-collapse",
            visible : this.showCollapseButton
        });
        this.buttons.push(d);
        var b = this.createButton({
            name : "min",
            cls : "mini-tools-min",
            visible : this.showMinButton
        });
        this.buttons.push(b);
        var a = this.createButton({
            name : "max",
            cls : "mini-tools-max",
            visible : this.showMaxButton
        });
        this.buttons.push(a);
        var c = this.createButton({
            name : "close",
            cls : "mini-tools-close",
            visible : this.showCloseButton
        });
        this.buttons.push(c)
    },
    _initEvents : function() {
        mini.Window.superclass._initEvents.call(this);
        mini._BindEvents(function() {
            mini.on(this.el, "mouseover", this.__OnMouseOver,
                    this);
            mini.on(window, "resize", this.__OnWindowResize,
                    this);
            mini.on(this.el, "mousedown",
                    this.__OnWindowMouseDown, this)
        }, this)
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        if (this.state == "max") {
            var a = this.getParentBox();
            this.el.style.left = "0px";
            this.el.style.top = "0px";
            mini.setSize(this.el, a.width, a.height)
        }
        mini.Window.superclass.doLayout.call(this);
        if (this.allowDrag) {
            mini.addClass(this.el, this._dragCls)
        }
        if (this.state == "max") {
            this._resizeGridEl.style.display = "none";
            mini.removeClass(this.el, this._dragCls)
        }
        this._doModal()
    },
    _doModal : function() {
        if (!this.el) {
            if (this._modalEl) {
                mini.removeNode(this._modalEl)
            }
            return
        }
        var a = this.showModal && this.isDisplay()
                && this.visible;
        if (!this._modalEl && this.showModal == false) {
            if (this._modalEl) {
                mini.removeNode(this._modalEl)
            }
            return
        }
        if (!this._modalEl) {
            var c = "__modal" + this._id;
            var b = "<iframe frameborder='0' style='position: absolute; z-index: -1; width: 100%; height: 100%; top: 0;left:0;scrolling:no;'></iframe>";
            this._modalEl = mini
                    .append(
                            document.body,
                            '<div id="'
                                    + c
                                    + '" class="mini-modal" style="display:none">'
                                    + b + "</div>")
        }
        if (a) {
            this._modalEl.style.display = "block";
            this._modalEl.style.zIndex = mini.getStyle(this.el,
                    "zIndex") - 1
        } else {
            this._modalEl.style.display = "none"
        }
    },
    getParentBox : function() {
        var a = mini.getViewportBox();
        var b = this._containerEl || document.body;
        if (b != document.body) {
            a = mini.getBox(b)
        }
        return a
    },
    /**
     * 
     * function setShowModal(showModal)
     * @member mini.Window
     * @param {Boolean} showModal
     *
     */
    setShowModal : function(a) {
        this.showModal = a
    },
    /**
     * 
     * function getShowModal()
     * @member mini.Window
     * @returns {Boolean}
     *
     */
    getShowModal : function() {
        return this.showModal
    },
    setMinWidth : function(a) {
        if (isNaN(a)) {
            return
        }
        this.minWidth = a
    },
    getMinWidth : function() {
        return this.minWidth
    },
    setMinHeight : function(a) {
        if (isNaN(a)) {
            return
        }
        this.minHeight = a
    },
    getMinHeight : function() {
        return this.minHeight
    },
    setMaxWidth : function(a) {
        if (isNaN(a)) {
            return
        }
        this.maxWidth = a
    },
    getMaxWidth : function() {
        return this.maxWidth
    },
    setMaxHeight : function(a) {
        if (isNaN(a)) {
            return
        }
        this.maxHeight = a
    },
    getMaxHeight : function() {
        return this.maxHeight
    },
    /**
     * 
     * function setAllowDrag(allowDrag)
     * @member mini.Window
     * @param {Boolean} allowDrag
     *
     */
    setAllowDrag : function(a) {
        this.allowDrag = a;
        mini.removeClass(this.el, this._dragCls);
        if (a) {
            mini.addClass(this.el, this._dragCls)
        }
    },
    /**
     * 
     * function getAllowDrag()
     * @member mini.Window
     * @returns {Boolean}
     *
     */
    getAllowDrag : function() {
        return this.allowDrag
    },
    /**
     * 
     * function setShowMaxButton(showMaxButton)
     * @member mini.Window
     * @param {Boolean} showMaxButton
     *
     */
    setShowMaxButton : function(b) {
        this.showMaxButton = b;
        var a = this.getButton("max");
        if (!a) {
            return
        }
        a.visible = b;
        this._doTools()
    },
    /**
     * 
     * function getShowMaxButton()
     * @member mini.Window
     * @returns {Boolean}
     *
     */
    getShowMaxButton : function() {
        return this.showMaxButton
    },
    setShowMinButton : function(b) {
        this.showMinButton = b;
        var a = this.getButton("min");
        if (!a) {
            return
        }
        a.visible = b;
        this._doTools()
    },
    getShowMinButton : function() {
        return this.showMinButton
    },
    /**
     * 最大化<br/>
     * function max()
     * @member mini.Window
     *
     */
    max : function() {
        this.state = "max";
        this.show();
        var a = this.getButton("max");
        if (a) {
            a.cls = "mini-tools-restore";
            this._doTools()
        }
    },
    /**
     * 还原<br/>
     * function restore()
     * @member mini.Window
     *
     */
    restore : function() {
        this.state = "restore";
        this.show(this.x, this.y);
        var a = this.getButton("max");
        if (a) {
            a.cls = "mini-tools-max";
            this._doTools()
        }
    },
    showInBody : true,
    setShowInBody : function(a) {
        this.showInBody = a
    },
    getShowInBody : function() {
        return this.showInBody
    },
    containerEl : null,
    /**
     * 弹出显示面板<br/>
     * function showAtPos(left, top)
     * @member mini.Window
     * @param  left
     * @param  top
     *
     */
    showAtPos : function(a, c, b) {
        this.show(a, c, b)
    },

    /**
     * 弹出显示面板<br/>
     * function show(left, top)
     * @member mini.Window
     * @param  left
     * @param  top
     *
     */
    show : function(a, g, b) {
        this._allowLayout = false;
        var d = this._containerEl || document.body;
        if (!this.isRender()
                || (this.el.parentNode != d && this.showInBody)) {
            this.render(d)
        }
        this.el.style.zIndex = mini.getMaxZIndex();
        this._doShow(a, g);
        this._allowLayout = true;
        this.setVisible(true);
        if (this.state != "max") {
            var c = this.getBox();
            this.x = c.x;
            this.y = c.y
        }
        try {
            this.el.focus()
        } catch (f) {
        }
    },
    /**
     * 隐藏面板<br/>
     * function hide()
     * @member mini.Window
     *
     */
    hide : function() {
        this.setVisible(false);
        this._doModal()
    },
    getWidth : function() {
        this._headerEl.style.width = "50px";
        var a = mini.getWidth(this.el);
        this._headerEl.style.width = "auto";
        return a
    },
    getBox : function() {
        this._headerEl.style.width = "50px";
        this.el.style.display = "";
        var a = mini.getWidth(this.el);
        this._headerEl.style.width = "auto";
        var b = mini.getBox(this.el);
        b.width = a;
        b.right = b.x + a;
        return b
    },
    _measureSize : function() {
        this.el.style.display = "";
        var a = this.getBox();
        if (a.width > this.maxWidth) {
            mini.setWidth(this.el, this.maxWidth);
            a = this.getBox()
        }
        if (a.height > this.maxHeight) {
            mini.setHeight(this.el, this.maxHeight);
            a = this.getBox()
        }
        if (a.width < this.minWidth) {
            mini.setWidth(this.el, this.minWidth);
            a = this.getBox()
        }
        if (a.height < this.minHeight) {
            mini.setHeight(this.el, this.minHeight);
            a = this.getBox()
        }
    },
    _doShow : function(a, d) {
        var b = this.getParentBox();
        if (this.state == "max") {
            if (!this._width) {
                var c = this.getBox();
                this._width = c.width;
                if (this.expanded) {
                    this._height = c.height
                }
                this.x = c.x;
                this.y = c.y
            }
        } else {
            if (mini.isNull(a)) {
                a = "center"
            }
            if (mini.isNull(d)) {
                d = "middle"
            }
            this.el.style.position = "absolute";
            this.el.style.left = "-2000px";
            this.el.style.top = "-2000px";
            this.el.style.display = "";
            if (this._width) {
                this.setWidth(this._width);
                this.setHeight(this._height);
                delete this._width;
                delete this._height
            } else {
            }
            this._measureSize();
            var c = this.getBox();
            if (a == "left") {
                a = 0
            }
            if (a == "center") {
                a = b.width / 2 - c.width / 2
            }
            if (a == "right") {
                a = b.width - c.width
            }
            if (d == "top") {
                d = 0
            }
            if (d == "middle") {
                d = b.y + b.height / 2 - c.height / 2
            }
            if (d == "bottom") {
                d = b.height - c.height
            }
            if (a + c.width > b.right) {
                a = b.right - c.width
            }
            if (d + c.height > b.bottom) {
                d = b.bottom - c.height
            }
            if (a < 0) {
                a = 0
            }
            if (d < 0) {
                d = 0
            }
            this.el.style.display = "";
            mini.setX(this.el, a);
            mini.setY(this.el, d)
        }
        this.doLayout()
    },
    _OnButtonClick : function(b, a) {
        var c = mini.Window.superclass._OnButtonClick.call(
                this, b, a);
        if (c.cancel == true) {
            return c
        }
        if (c.name == "max") {
            if (this.state == "max") {
                this.restore()
            } else {
                this.max()
            }
        }
        return c
    },
    __OnWindowResize : function(a) {
        if (this.state == "max") {
            this.doLayout()
        }
        if (!mini.isIE6) {
            this._doModal()
        }
    },
    enableDragProxy : true,
    setEnableDragProxy : function(a) {
        this.enableDragProxy = a
    },
    getEnableDragProxy : function(a) {
        return this.enableDragProxy
    },
    __OnWindowMouseDown : function(f) {
        var d = this;
        if (f.button != mini.MouseButton.Left) {
            return
        }
        if (this.state != "max" && this.allowDrag
                && mini.isAncestor(this._headerEl, f.target)
                && !mini.findParent(f.target, "mini-tools")) {
            var d = this;
            if (this.el) {
                this.el.style.zIndex = mini.getMaxZIndex()
            }
            var c = this.getBox();
            var b = new mini.Drag(
                    {
                        capture : false,
                        onStart : function() {
                            d._maskProxy = mini
                                    .append(document.body,
                                            '<div class="mini-resizer-mask" style=""></div>');
                            if (d.enableDragProxy) {
                                d._dragProxy = mini
                                        .append(document.body,
                                                '<div class="mini-drag-proxy"></div>');
                                d.el.style.display = "none"
                            } else {
                                d._dragProxy = d.el
                            }
                        },
                        onMove : function(k) {
                            var e = k.now[0] - k.init[0], l = k.now[1]
                                    - k.init[1];
                            e = c.x + e;
                            l = c.y + l;
                            var j = d.getParentBox();
                            var i = e + c.width;
                            var g = l + c.height;
                            if (i > j.width) {
                                e = j.width - c.width
                            }
                            if (e < 0) {
                                e = 0
                            }
                            if (l < 0) {
                                l = 0
                            }
                            d.x = e;
                            d.y = l;
                            var h = {
                                x : e,
                                y : l,
                                width : c.width,
                                height : c.height
                            };
                            mini.setBox(d._dragProxy, h);
                            this.moved = true
                        },
                        onStop : function() {
                            if (d.el) {
                                d.el.style.display = "block";
                                if (this.moved) {
                                    var e = mini
                                            .getBox(d._dragProxy);
                                    mini.setBox(d.el, e)
                                }
                            }
                            jQuery(d._maskProxy).remove();
                            d._maskProxy = null;
                            if (d.enableDragProxy) {
                                jQuery(d._dragProxy).remove()
                            }
                            d._dragProxy = null
                        }
                    });
            b.start(f);
            var a = mini.append(document.body,
                    '<div class="mini-resizer-mask"></div>');
            setTimeout(function() {
                mini.removeNode(a)
            }, 300)
        }
    },
    destroy : function(a) {
        mini.un(window, "resize", this.__OnWindowResize, this);
        if (this._modalEl) {
            jQuery(this._modalEl).remove();
            this._modalEl = null
        }
        if (this.shadowEl) {
            jQuery(this.shadowEl).remove();
            this.shadowEl = null
        }
        var b = "__modal" + this._id;
        jQuery("[id='" + b + "']").remove();
        mini.Window.superclass.destroy.call(this, a)
    },
    getAttrs : function(b) {
        var a = mini.Window.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "modalStyle" ]);
        mini._ParseBool(b, a, [ "showModal", "showShadow",
                "allowDrag", "allowResize", "showMaxButton",
                "showMinButton", "showInBody",
                "enableDragProxy" ]);
        mini._ParseInt(b, a, [ "minWidth", "minHeight",
                "maxWidth", "maxHeight" ]);
        return a
    },
    /**
     * 定位元素弹出显示<br/>
     * function showAtEl(el, options)
     * @member mini.Window
     * @param  el
     * @param  options
     *
     */
    showAtEl : function(b, q) {
        b = mini.byId(b);
        if (!b) {
            return
        }
        if (!this.isRender()
                || this.el.parentNode != document.body) {
            this.render(document.body)
        }
        var i = {
            xAlign : this.xAlign,
            yAlign : this.yAlign,
            xOffset : 0,
            yOffset : 0,
            popupCls : this.popupCls
        };
        mini.copyTo(i, q);
        this._popupEl = b;
        this.el.style.position = "absolute";
        this.el.style.left = "-2000px";
        this.el.style.top = "-2000px";
        this.el.style.display = "";
        this.doLayout();
        this._measureSize();
        var j = mini.getViewportBox();
        var f = this.getBox();
        var e = mini.getBox(b);
        var p = i.xy;
        var g = i.xAlign, o = i.yAlign;
        var m = j.width / 2 - f.width / 2, l = 0;
        if (p) {
            m = p[0];
            l = p[1]
        }
        switch (i.xAlign) {
        case "outleft":
            m = e.x - f.width;
            break;
        case "left":
            m = e.x;
            break;
        case "center":
            m = e.x + e.width / 2 - f.width / 2;
            break;
        case "right":
            m = e.right - f.width;
            break;
        case "outright":
            m = e.right;
            break;
        default:
            break
        }
        switch (i.yAlign) {
        case "above":
            l = e.y - f.height;
            break;
        case "top":
            l = e.y;
            break;
        case "middle":
            l = e.y + e.height / 2 - f.height / 2;
            break;
        case "bottom":
            l = e.bottom - f.height;
            break;
        case "below":
            l = e.bottom;
            break;
        default:
            break
        }
        m = parseInt(m);
        l = parseInt(l);
        if (i.outYAlign || i.outXAlign) {
            if (i.outYAlign == "above") {
                if (l + f.height > j.bottom) {
                    var k = e.y - j.y;
                    var a = j.bottom - e.bottom;
                    if (k > a) {
                        l = e.y - f.height
                    }
                }
            }
            if (i.outXAlign == "outleft") {
                if (m + f.width > j.right) {
                    var d = e.x - j.x;
                    var n = j.right - e.right;
                    if (d > n) {
                        m = e.x - f.width
                    }
                }
            }
            if (i.outXAlign == "right") {
                if (m + f.width > j.right) {
                    m = e.right - f.width
                }
            }
            this._Show(m, l)
        } else {
            this.showAtPos(m + i.xOffset, l + i.yOffset)
        }
    }
});
mini.regClass(mini.Window, "window");

/**
 * 消息框。
 * @class
 * @singleton
 */
mini.MessageBox = {
        /**
         * 提示框的默认标题
         * @property {String} [alertTitle="提醒"] 
         */
        alertTitle : "提醒",
        /**
         * 选择提示框的默认标题
         * @property {String} [confirmTitle="确认"] 
         */
        confirmTitle : "确认",
        /**
         * 文本输入提示框的默认标题
         * @property {String} [prompTitle="输入"] 
         */
        prompTitle : "输入",
        /**
         * 文本输入提示框的默认消息内容
         * @property {String} [prompMessage="请输入内容："] 
         */
        prompMessage : "请输入内容：",
        
        /** @enum mini.MessageBox.buttonText */
        buttonText : {
            /** @property {string} [ok="确定"] */
            ok : "确定",
            /** @property {string} [cancel="取消"] */
            cancel : "取消",
            /** @property {string} [yes="是"] */
            yes : "是",
            /** @property {string} [no="否"] */
            no : "否"
        },
        
        /**
         * 显示提示框。别名为 {@link mini#showMessageBox}
         * 
         *     @example
         *     mini.showMessageBox({
         *         title: "消息提示框",
         *         message: "你好， 这是一个消息提示框中的内容描述。",
         *         buttons: ["ok", "no", "cancel"],
         *         iconCls: "mini-messagebox-question",
         *         callback: function(action){
         *         }
         *     });
         *     
         * @param {Object} options 提示框的设置选项
         * @param {Number/String} [options.width="auto"] 宽度。可以是一个数值或百分比，值为数值时，单位为像素
         * @param {Number/String} [options.height="auto"] 高度。可以是一个数值或百分比，值为数值时，单位为像素
         * @param {Boolean} [options.showModal = true] 是否显示为模态消息框 
         * @param {Number} [options.timeout = 0] 值大于 0 时，消息框将在 `timeout` 毫秒后自动关闭
         * @param {Number} [options.minWidth = 150] 最小宽度，单位为像素
         * @param {Number} [options.maxWidth = 800] 最大宽度，单位为像素
         * @param {Number} [options.minHeight = 50] 最小高度，单位为像素
         * @param {Number} [options.maxHeight = 350] 最大高度，单位为像素
         * @param {Boolean} [options.showHeader = true] 是否显示标题栏
         * @param {String} [options.title = ""] 标题
         * @param {String} [options.titleIcon = ""] 标题栏图标样式类
         * @param {String} [options.iconCls = ""] 消息内容左侧图标的样式类，如：
         *          `"mini-messagebox-info"`、`"mini-messagebox-warning"`、`"mini-messagebox-question"`、`"mini-messagebox-error"`、`"mini-messagebox-download"`、
         * @param {String} [options.iconStyle = ""] 标题栏样式
         * @param {String} [options.message = ""] 消息内容
         * @param {String/HTMLElement} [options.html = ""] HTML 源码形式的消息内容
         * @param {String} [options.spaceStyle = "margin-right:15px"] 
         * @param {Boolean} [options.showCloseButton = true] 是不显示关闭按钮
         * @param {Array} [options.buttons = null] 按钮数组，可以是 DOM 节点或 `mini.MessageBox.buttonText.*` 即：`"ok"`、`"cancel"`、`"yes"`、`"no"` 等
         * @param {Number} [options.buttonWidth =] 
         * @param {Function} [options.callback =] 
         * @return {String} 消息框的唯一标识符
         * @member mini.MessageBox
         */
        show : function(options) {
            options = mini.copyTo({
                width : "auto",
                height : "auto",
                showModal : true,
                timeout : 0,
                minWidth : 150,
                maxWidth : 800,
                minHeight : 50,
                maxHeight : 350,
                showHeader : true,
                title : "",
                titleIcon : "",
                iconCls : "",
                iconStyle : "",
                message : "",
                html : "",
                spaceStyle : "margin-right:15px",
                showCloseButton : true,
                buttons : null,
                buttonWidth : 58,
                callback : null
            }, options);
            options.message = String(options.message);
            var f = options.callback;
            var m = new mini.Window();
            m.setBodyStyle("overflow:hidden");
            m.setShowModal(options.showModal);
            m.setTitle(options.title || "");
            m.setIconCls(options.titleIcon);
            m.setShowHeader(options.showHeader);
            m.setShowCloseButton(options.showCloseButton);
            var d = m.uid + "$table", b = m.uid + "$content";
            var v = '<div class="' + options.iconCls + '" style="' + options.iconStyle
                    + '"></div>';
            var o = '<table class="mini-messagebox-table" id="' + d
                    + '" style="" cellspacing="0" cellpadding="0"><tr><td>' + v
                    + '</td><td id="' + b
                    + '" class="mini-messagebox-content-text">' + (options.message || "")
                    + "</td></tr></table>";
            var c = '<div class="mini-messagebox-content"></div><div class="mini-messagebox-buttons"></div>';
            m._bodyEl.innerHTML = c;
            var g = m._bodyEl.firstChild;
            if (options.html) {
                if (typeof options.html == "string") {
                    g.innerHTML = options.html
                } else {
                    if (mini.isElement(options.html)) {
                        g.appendChild(options.html)
                    }
                }
            } else {
                g.innerHTML = o
            }
            m._Buttons = [];
            var w = m._bodyEl.lastChild;
            if (options.buttons && options.buttons.length > 0) {
                for (var t = 0, r = options.buttons.length; t < r; t++) {
                    var a = options.buttons[t];
                    var n = mini.MessageBox.buttonText[a];
                    if (!n) {
                        n = a
                    }
                    var j = new mini.Button();
                    j.setText(n);
                    j.setWidth(options.buttonWidth);
                    j.render(w);
                    j.action = a;
                    j.on("click", function(l) {
                        var i = l.sender;
                        if (f) {
                            if (f(i.action) === false) {
                                return
                            }
                        }
                        mini.MessageBox.hide(m)
                    });
                    if (t != r - 1) {
                        j.setStyle(options.spaceStyle)
                    }
                    m._Buttons.push(j)
                }
            } else {
                w.style.display = "none"
            }
            m.setMinWidth(options.minWidth);
            m.setMinHeight(options.minHeight);
            m.setMaxWidth(options.maxWidth);
            m.setMaxHeight(options.maxHeight);
            m.setWidth(options.width);
            m.setHeight(options.height);
            m.show(options.x, options.y, {
                animType : options.animType
            });
            var q = m.getWidth();
            m.setWidth(q);
            var p = m.getHeight();
            m.setHeight(p);
            var k = document.getElementById(d);
            if (k) {
                k.style.width = "100%"
            }
            var h = document.getElementById(b);
            if (h) {
                h.style.width = "100%"
            }
            var u = m._Buttons[0];
            if (u) {
                u.focus()
            } else {
                m.focus()
            }
            m.on("beforebuttonclick", function(i) {
                if (f) {
                    f("close")
                }
                i.cancel = true;
                mini.MessageBox.hide(m)
            });
            mini.on(m.el, "keydown", function(i) {
            });
            if (options.timeout) {
                setTimeout(function() {
                    mini.MessageBox.hide(m.uid)
                }, options.timeout)
            }
            return m.uid
        },
        
        /**
         * 隐藏提示框。别名为 {@link mini#hideMessageBox}
         * @param {String} messageId 消息框的唯一标识符
         * @member mini.MessageBox
         */
        hide : function(messageId) {
            if (!messageId) {
                return
            }
            var d = typeof messageId == "object" ? messageId : mini.getbyUID(messageId);
            if (!d) {
                return
            }
            for (var c = 0, a = d._Buttons.length; c < a; c++) {
                var b = d._Buttons[c];
                b.destroy()
            }
            d._Buttons = null;
            d.destroy()
        },
        /**
         * 提示框。别名为 {@link mini#alert}
         * @param {String} message 消息内容
         * @param {String} [title=mini.MessageBox.alertTitle] 标题
         * @param {Function} [callback] 回调函数
         * @return {String} 消息框的唯一标识符
         * @member mini.MessageBox
         */
        alert : function(message, title, callback) {
            return mini.MessageBox.show({
                minWidth : 250,
                title : title || mini.MessageBox.alertTitle,
                buttons : [ "ok" ],
                message : message,
                iconCls : "mini-messagebox-warning",
                callback : callback
            })
        },
        
        /**
         * 选择提示框。别名为 {@link mini#confirm}
         * @param {String} message 消息内容
         * @param {String} [title=mini.MessageBox.confirmTitle] 标题
         * @param {Function} [callback] 回调函数。该回调函数接受一个 String 类型的参数，传入的值可能是 `"ok"` 或 `"cancel"`
         * @return {String} 消息框的唯一标识符
         * @member mini.MessageBox
         */
        confirm : function(message, title, callback) {
            return mini.MessageBox.show({
                minWidth : 250,
                title : title || mini.MessageBox.confirmTitle,
                buttons : [ "ok", "cancel" ],
                message : message,
                iconCls : "mini-messagebox-question",
                callback : callback
            })
        },
        
        /**
         * 文本输入提示框。别名为 {@link mini#prompt}
         * @param {String} [message=mini.MessageBox.promptMessage] 消息内容
         * @param {String} [title=mini.MessageBox.promptTitle] 标题
         * @param {Function} [callback] 回调函数。该回调函数允许接受两个参数，分别为：<br>
         *      action &#45; String，值可能是 `"ok"` 或 `"cancel"`<br>
         *      value &#45; String，用户在文本框中输入的内容
         * @param {Boolean} [multi=false] 是否允许输入多行（使用 textarea 作为输入框）
         * @return {String} 消息框的唯一标识符
         * @member mini.MessageBox
         */
        prompt : function(message, title, callback, multi) {
            var g = "prompt$" + new Date().getTime();
            var c = message || mini.MessageBox.promptMessage;
            if (multi) {
                c = c
                        + '<br/><textarea id="'
                        + g
                        + '" style="width:200px;height:60px;margin-top:3px;"></textarea>'
            } else {
                c = c + '<br/><input id="' + g
                        + '" type="text" style="width:200px;margin-top:3px;"/>'
            }
            var b = mini.MessageBox.show({
                title : title || mini.MessageBox.promptTitle,
                buttons : [ "ok", "cancel" ],
                width : 250,
                html : '<div style="padding:5px;padding-left:10px;">' + c
                        + "</div>",
                callback : function(j) {
                    var i = document.getElementById(g);
                    if (callback) {
                        return callback(j, i.value)
                    }
                }
            });
            var a = document.getElementById(g);
            a.focus();
            return b
        },
        
        /**
         * 加载提示框。别名为 {@link mini#loading}
         * @param {String} message 消息内容
         * @param {String} title 标题
         * @return {String} 消息框的唯一标识符
         * @member mini.MessageBox
         */
        loading : function(message, title) {
            return mini.MessageBox.show({
                minHeight : 50,
                title : title,
                showCloseButton : false,
                message : message,
                iconCls : "mini-messagebox-waiting"
            })
        },
        
        /**
         * 显示悬浮提示消息。别名为 {@link mini#showTips}
         * @param {Object} options 设置选项
         * @param {String} options.content 提示消息的内容
         * @param {String} [options.state = ""] 状态，如："success"、"info"、"warning"、"danger" 等
         * @param {String/Number} [options.x = "center"] 横向坐标。值为数字时，单位为 px；值为 String 类型时，可选值有 "left"、"center"、"right"
         * @param {String/Number} [options.y = "top"] 纵向坐标。值为数字时，单位为 px；值为 String 类型时，可选值有 "top"、"middle"、"bottom"
         * @param {Number[]} [options.offset = [10, 10]] 长度为 2 的数组，第一个元素为横向偏移量，第二个元素为纵向偏移量，单位均为 px。
         * @param {Boolean} [options.fixed = true] 悬浮消息的 position 是否为 fixed
         * @param {Number} [options.timeout = 2000] 显示多久后自动隐藏，单位为毫秒。值为 0 时，永不隐藏。
         * @return {String} 消息框的唯一标识符
         * @member mini.MessageBox
         */
        showTips : function(options) {
            var d = jQuery;
            options = d.extend({
                content : "",
                state : "",
                x : "center",
                y : "top",
                offset : [ 10, 10 ],
                fixed : true,
                timeout : 2000
            }, options);
            var a = "mini-tips-" + options.state;
            var c = '<div class="mini-tips ' + a + '">' + options.content + "</div>";
            var e = d(c).appendTo(document.body);
            options.el = e[0];
            options.timeoutHandler = function() {
                e.slideUp();
                setTimeout(function() {
                    e.remove()
                }, 2000)
            };
            mini.showAt(options);
            e.hide().slideDown()
        }
    };

    /**
     * @method alert
     * @member mini
     * @alias mini.MessageBox#alert
     */
    mini.alert = mini.MessageBox.alert;

    /**
     * @method confirm
     * @member mini
     * @alias mini.MessageBox#confirm
     */
    mini.confirm = mini.MessageBox.confirm;

    /**
     * @method prompt
     * @member mini
     * @alias mini.MessageBox#prompt
     */
    mini.prompt = mini.MessageBox.prompt;

    /**
     * @method loading
     * @member mini
     * @alias mini.MessageBox#loading
     */
    mini.loading = mini.MessageBox.loading;
    
    /**
     * @method showMessageBox
     * @member mini
     * @alias mini.MessageBox#show
     */
    mini.showMessageBox = mini.MessageBox.show;
    

    /**
     * @method hideMessageBox
     * @member mini
     * @alias mini.MessageBox#hide
     */
    mini.hideMessageBox = mini.MessageBox.hide;

    /**
     * @method showTips
     * @member mini
     * @alias mini.MessageBox#showTips
     */
    mini.showTips = mini.MessageBox.showTips;