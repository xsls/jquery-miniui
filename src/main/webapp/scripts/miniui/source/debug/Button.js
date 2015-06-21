/**
 * 按钮。能设置文本、图标、下拉菜单等。
 * 
 *     @example
 *     &lt;a class="mini-button" iconCls="icon-edit" onclick="onClick"&gt;Edit&lt;/a&gt;
 * 
 * @class
 * @extends mini.Control
 */

/**
 * 创建一个新的普通按钮实例
 * @constructor
 */
mini.Button = function() {
    mini.Button.superclass.constructor.call(this)
};
mini.extend(mini.Button, mini.Control, {
    /**
     * @cfg {String} [text=""] 按钮文本
     * @accessor
     * @member mini.Button
     */
    text : "",
    /**
     * @cfg {String} [iconCls=""] 按钮图标类
     * @accessor
     * @member mini.Button
     */
    iconCls : "",
    /**
     * @cfg {String} [iconStyle=""] 按钮图标样式
     * @accessor
     * @member mini.Button
     */
    iconStyle : "",
    /**
     * @cfg {Boolean} [plain=false] 背景透明
     * @accessor
     * @member mini.Button
     */
    plain : false,
    /**
     * @cfg {Boolean} [checkOnClick=false] 点击时是否自动选中
     * @accessor
     * @member mini.Button
     */
    checkOnClick : false,
    /**
     * @cfg {Boolean} [checked=false] 是否选中
     * @accessor
     * @member mini.Button
     */
    checked : false,
    /**
     * @cfg {String} [groupName=""] 菜单项组名称。设置后，会单选菜单项组。
     * @accessor
     * @member mini.Button
     */
    groupName : "",
    _plainCls : "mini-button-plain",
    _hoverCls : "mini-button-hover",
    _pressedCls : "mini-button-pressed",
    _checkedCls : "mini-button-checked",
    _disabledCls : "mini-button-disabled",
    /**
     * @cfg {String} [allowCls=""] 箭头样式类
     * @accessor
     * @member mini.Button
     */
    allowCls : "",
    _clearBorder : false,
    set : function(a) {
        if (typeof a == "string") {
            return this
        }
        this._allowUpdate = a.text || a.iconStyle || a.iconCls
                || a.iconPosition;
        mini.Button.superclass.set.call(this, a);
        if (this._allowUpdate === false) {
            this._allowUpdate = true;
            this.doUpdate()
        }
        return this
    },
    /**
     * @property {String} [uiCls="mini-button"] 控件样式类
     * @member mini.Button
     */
    uiCls : "mini-button",
    _create : function() {
        this.el = document.createElement("a");
        this.el.className = "mini-button";
        this.el.hideFocus = true;
        this.el.href = "javascript:void(0)";
        this.doUpdate()
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini_onOne(this.el, "mousedown", this.__OnMouseDown, this);
            mini_onOne(this.el, "click", this.__OnClick, this)
        }, this)
    },
    destroy : function(a) {
        if (this.el) {
            this.el.onclick = null;
            this.el.onmousedown = null
        }
        if (this.menu) {
            this.menu.owner = null
        }
        this.menu = null;
        mini.Button.superclass.destroy.call(this, a)
    },
    doUpdate : function() {
        if (this._allowUpdate === false) {
            return
        }
        var b = "", e = this.text;
        var a = this.iconStyle || this.iconCls || this.img;
        if (a && e) {
            b = " mini-button-icon " + this.iconCls
        } else {
            if (a && e === "") {
                b = " mini-button-iconOnly " + this.iconCls;
                e = "&nbsp;"
            } else {
                if (e == "") {
                    e = "&nbsp;"
                }
            }
        }
        var d = this.iconStyle || "";
        if (!d && this.img) {
            d = "background-image:url(" + this.img + ")"
        }
        var c = '<span class="mini-button-text ' + b + '" style="' + d + '">'
                + e + "</span>";
        if (this.allowCls) {
            c = c + '<span class="mini-button-allow ' + this.allowCls
                    + '"></span>'
        }
        this.el.innerHTML = c
    },
    /**
     * @cfg {String} [href=""] 超链接地址
     * @accessor
     * @member mini.Button
     */
    href : "",
    setHref : function(b) {
        this.href = b;
        this.el.href = b;
        var a = this.el;
        setTimeout(function() {
            a.onclick = null
        }, 100)
    },
    getHref : function() {
        return this.href
    },
    /**
     * @cfg {String} [target=""] 超链接弹出方式
     * @accessor
     * @member mini.Button
     */
    target : "",
    setTarget : function(a) {
        this.target = a;
        this.el.target = a
    },
    getTarget : function() {
        return this.target
    },
    setText : function(a) {
        if (this.text != a) {
            this.text = a;
            this.doUpdate()
        }
    },
    getText : function() {
        return this.text
    },
    setIconCls : function(a) {
        this.iconCls = a;
        this.doUpdate()
    },
    getIconCls : function() {
        return this.iconCls
    },
    setIconStyle : function(a) {
        this.iconStyle = a;
        this.doUpdate()
    },
    getIconStyle : function() {
        return this.iconStyle
    },
    /**
     * @cfg {String} [img=""] 按钮图片
     * @accessor
     * @member mini.Button
     */
    img : "",
    setImg : function(a) {
        this.img = a;
        this.doUpdate()
    },
    getImg : function() {
        return this.img
    },
    /**
     * @cfg {String} [iconPosition="left"] 图标显示的位置
     * @accessor
     * @member mini.Button
     */
    setIconPosition : function(a) {
        this.iconPosition = "left";
        this.doUpdate()
    },
    getIconPosition : function() {
        return this.iconPosition
    },
    setPlain : function(a) {
        this.plain = a;
        if (a) {
            this.addCls(this._plainCls)
        } else {
            this.removeCls(this._plainCls)
        }
    },
    getPlain : function() {
        return this.plain
    },
    setGroupName : function(a) {
        this.groupName = a
    },
    getGroupName : function() {
        return this.groupName
    },
    setCheckOnClick : function(a) {
        this.checkOnClick = a
    },
    getCheckOnClick : function() {
        return this.checkOnClick
    },
    
    /**
     * @event checkedchanged 当按钮选中状态发生变化时触发的事件
     * @member mini.Button
     */
    
    /**
     * 设置按钮是否选中
     * @param {Boolean} checked 是否选中
     * @member mini.Button
     * @fires checkedchanged
     */
    setChecked : function(checked) {
        var a = this.checked != checked;
        this.checked = checked;
        if (checked) {
            this.addCls(this._checkedCls)
        } else {
            this.removeCls(this._checkedCls)
        }
        if (a) {
            this.fire("CheckedChanged")
        }
    },
    getChecked : function() {
        return this.checked
    },
    /**
     * 触发单击事件
     * @method doClick
     * @member mini.Button
     * @fires click
     */
    doClick : function() {
        this.__OnClick(null)
    },
    /**
     * @event click 单击事件
     * @param {Object} event 当前事件对象
     * @param {Object} event.htmlEvent 原生的 HTML 事件对象
     * @member mini.Button
     */
    __OnClick : function(event) {
        if (!this.href && event) {
            event.preventDefault()
        }
        if (this.readOnly || this.enabled == false) {
            return
        }
        this.focus();
        if (this.checkOnClick) {
            if (this.groupName) {
                var g = this.groupName;
                var d = mini.findControls(function(e) {
                    if (e.type == "button" && e.groupName == g) {
                        return true
                    }
                });
                if (d.length > 0) {
                    for (var c = 0, a = d.length; c < a; c++) {
                        var b = d[c];
                        if (b != this) {
                            b.setChecked(false)
                        }
                    }
                    this.setChecked(true)
                } else {
                    this.setChecked(!this.checked)
                }
            } else {
                this.setChecked(!this.checked)
            }
        }
        this.fire("click", {
            htmlEvent : event
        })
    },
    __OnMouseDown : function(a) {
        if (this.isReadOnly()) {
            return
        }
        this.addCls(this._pressedCls);
        mini.on(document, "mouseup", this.__OnDocMouseUp, this)
    },
    __OnDocMouseUp : function(a) {
        this.removeCls(this._pressedCls);
        mini.un(document, "mouseup", this.__OnDocMouseUp, this)
    },
    /**
     * 绑定单击事件
     * @method onClick
     * @param {Function} handler 事件处理方法
     * @param {Object} handler.event {@link #click} 事件对象
     * @param {Object} scope 事件处理方法的上下文
     * @member mini.Button
     */
    onClick : function(handler, scope) {
        this.on("click", handler, scope)
    },
    getAttrs : function(b) {
        var a = mini.Button.superclass.getAttrs.call(this, b);
        a.text = b.innerHTML;
        mini._ParseString(b, a, [ "text", "href", "iconCls", "iconStyle",
                "iconPosition", "groupName", "menu", "onclick",
                "oncheckedchanged", "target", "img" ]);
        mini._ParseBool(b, a, [ "plain", "checkOnClick", "checked" ]);
        return a
    }
});
mini.regClass(mini.Button, "button");

/**
 * 菜单按钮
 * @class mini.MenuButton
 * @extends mini.Button
 * 
 * @constructor 创建一个新的菜单按钮实例
 */
mini.MenuButton = function() {
    mini.MenuButton.superclass.constructor.call(this)
};
mini.extend(mini.MenuButton, mini.Button, {
    /**
     * @property {String} [uiCls="mini-menubutton"] 控件样式类
     * @member mini.MenuButton
     */
    uiCls : "mini-menubutton",
    /**
     * @cfg {String} [allowCls="mini-button-menu"] 箭头样式类
     * @accessor
     * @member mini.MenuButton
     */
    allowCls : "mini-button-menu",

    /**
     * 设置菜单对象
     * @param {Array/String/mini.Control} menu 菜单对象
     * @member mini.MenuButton
     */
    setMenu : function(menu) {
        if (mini.isArray(menu)) {
            menu = {
                type : "menu",
                items : menu
            }
        }
        if (typeof menu == "string") {
            var a = mini.byId(menu);
            if (!a) {
                return
            }
            mini.parse(menu);
            menu = mini.get(menu)
        }
        if (this.menu !== menu) {
            this.menu = mini.getAndCreate(menu);
            this.menu.setPopupEl(this.el);
            this.menu.setPopupCls("mini-button-popup");
            this.menu.setShowAction("leftclick");
            this.menu.setHideAction("outerclick");
            this.menu.setXAlign("left");
            this.menu.setYAlign("below");
            this.menu.hide();
            this.menu.owner = this
        }
    },
    setEnabled : function(a) {
        this.enabled = a;
        if (a) {
            this.removeCls(this._disabledCls)
        } else {
            this.addCls(this._disabledCls)
        }
        jQuery(this.el).attr("allowPopup", !!a)
    }
});
mini.regClass(mini.MenuButton, "menubutton");


/**
 * 右侧带有一个小的下拉箭头的按钮
 *
 *     @example
 *     var btn = new mini.SplitButton();
 *     btn.set({
 *         text : "按钮",
 *         tooltip : "按钮"
 *     });
 *     
 * @class mini.SplitButton
 * @extends mini.MenuButton
 * @experimental 3.2.1 新增功能，还在试验阶段，可能存在兼容性问题
 * @method constructor 创建一个新的右侧带有一个小的下拉箭头的按钮实例
 */
mini.SplitButton = function() {
    mini.SplitButton.superclass.constructor.call(this)
};
mini.extend(mini.SplitButton, mini.MenuButton, {
    /**
     * @property {String} [uiCls="mini-splitbutton"] 控件样式类
     * @member mini.SplitButton
     */
    uiCls : "mini-splitbutton",
    allowCls : "mini-button-split"
});
mini.regClass(mini.SplitButton, "splitbutton");