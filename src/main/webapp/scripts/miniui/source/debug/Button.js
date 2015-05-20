mini.Button = function() {
    mini.Button.superclass.constructor.call(this)
};
mini.extend(mini.Button, mini.Control, {
    text : "",
    iconCls : "",
    iconStyle : "",
    plain : false,
    checkOnClick : false,
    checked : false,
    groupName : "",
    _plainCls : "mini-button-plain",
    _hoverCls : "mini-button-hover",
    _pressedCls : "mini-button-pressed",
    _checkedCls : "mini-button-checked",
    _disabledCls : "mini-button-disabled",
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
    img : "",
    setImg : function(a) {
        this.img = a;
        this.doUpdate()
    },
    getImg : function() {
        return this.img
    },
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
    setChecked : function(b) {
        var a = this.checked != b;
        this.checked = b;
        if (b) {
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
    doClick : function() {
        this.__OnClick(null)
    },
    __OnClick : function(f) {
        if (!this.href && f) {
            f.preventDefault()
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
            htmlEvent : f
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
    onClick : function(b, a) {
        this.on("click", b, a)
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
mini.MenuButton = function() {
    mini.MenuButton.superclass.constructor.call(this)
};
mini.extend(mini.MenuButton, mini.Button, {
    uiCls : "mini-menubutton",
    allowCls : "mini-button-menu",
    setMenu : function(b) {
        if (mini.isArray(b)) {
            b = {
                type : "menu",
                items : b
            }
        }
        if (typeof b == "string") {
            var a = mini.byId(b);
            if (!a) {
                return
            }
            mini.parse(b);
            b = mini.get(b)
        }
        if (this.menu !== b) {
            this.menu = mini.getAndCreate(b);
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
mini.SplitButton = function() {
    mini.SplitButton.superclass.constructor.call(this)
};
mini.extend(mini.SplitButton, mini.MenuButton, {
    uiCls : "mini-splitbutton",
    allowCls : "mini-button-split"
});
mini.regClass(mini.SplitButton, "splitbutton");