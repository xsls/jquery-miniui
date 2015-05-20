mini.PopupEdit = function() {
    mini.PopupEdit.superclass.constructor.call(this);
    this._createPopup();
    this.el.className += " mini-popupedit"
};
mini.extend(mini.PopupEdit, mini.ButtonEdit, {
    uiCls : "mini-popupedit",
    popup : null,
    popupCls : "mini-buttonedit-popup",
    _hoverCls : "mini-buttonedit-hover",
    _pressedCls : "mini-buttonedit-pressed",
    _destroyPopup : true,
    destroy : function(a) {
        if (this.isShowPopup()) {
            this.hidePopup()
        }
        if (this.popup) {
            if (this._destroyPopup) {
                this.popup.destroy()
            }
            this.popup = null
        }
        if (this._popupInner) {
            this._popupInner.owner = null;
            this._popupInner = null
        }
        mini.PopupEdit.superclass.destroy.call(this, a)
    },
    _initEvents : function() {
        mini.PopupEdit.superclass._initEvents.call(this);
        mini._BindEvents(function() {
            mini_onOne(this.el, "mouseover", this.__OnMouseOver, this);
            mini_onOne(this.el, "mouseout", this.__OnMouseOut, this)
        }, this)
    },
    _initButtons : function() {
        this.buttons = [];
        var a = this.createButton({
            cls : "mini-buttonedit-popup",
            iconCls : "mini-buttonedit-icons-popup",
            name : "popup"
        });
        this.buttons.push(a)
    },
    __OnBlur : function(a) {
        this._focused = false;
        if (this._clickTarget && mini.isAncestor(this.el, this._clickTarget)) {
            return
        }
        if (this.isShowPopup()) {
            return
        }
        mini.PopupEdit.superclass.__OnBlur.call(this, a)
    },
    __OnMouseOver : function(a) {
        if (this.isReadOnly() || this.allowInput) {
            return
        }
        if (mini.findParent(a.target, "mini-buttonedit-border")) {
            this.addCls(this._hoverCls)
        }
    },
    __OnMouseOut : function(a) {
        if (this.isReadOnly() || this.allowInput) {
            return
        }
        this.removeCls(this._hoverCls)
    },
    __OnMouseDown : function(a) {
        if (this.isReadOnly()) {
            return
        }
        mini.PopupEdit.superclass.__OnMouseDown.call(this, a);
        if (this.allowInput == false
                && mini.findParent(a.target, "mini-buttonedit-border")) {
            mini.addClass(this.el, this._pressedCls);
            mini.on(document, "mouseup", this.__OnDocMouseUp, this)
        }
    },
    __OnInputKeyDown : function(a) {
        this.fire("keydown", {
            htmlEvent : a
        });
        if (a.keyCode == 8 && (this.isReadOnly() || this.allowInput == false)) {
            return false
        }
        if (a.keyCode == 9) {
            this.hidePopup();
            return
        }
        if (a.keyCode == 27) {
            this.hidePopup();
            return
        }
        if (a.keyCode == 13) {
            this.fire("enter")
        }
        if (this.isShowPopup()) {
            if (a.keyCode == 13 || a.keyCode == 27) {
                a.stopPropagation()
            }
        }
    },
    within : function(a) {
        if (mini.isAncestor(this.el, a.target)) {
            return true
        }
        if (this.popup.within(a)) {
            return true
        }
        return false
    },
    popupWidth : "100%",
    popupMinWidth : 50,
    popupMaxWidth : 2000,
    popupHeight : "",
    popupMinHeight : 30,
    popupMaxHeight : 2000,
    setPopup : function(a) {
        if (typeof a == "string") {
            mini.parse(a);
            a = mini.get(a)
        }
        var b = mini.getAndCreate(a);
        if (!b) {
            return
        }
        b.setVisible(false);
        this._popupInner = b;
        b.owner = this;
        b.on("beforebuttonclick", this.__OnPopupButtonClick, this)
    },
    getPopup : function() {
        if (!this.popup) {
            this._createPopup()
        }
        return this.popup
    },
    _createPopup : function() {
        this.popup = new mini.Popup();
        this.popup.setShowAction("none");
        this.popup.setHideAction("outerclick");
        this.popup.setPopupEl(this.el);
        this.popup.on("BeforeClose", this.__OnPopupBeforeClose, this);
        mini.on(this.popup.el, "keydown", this.__OnPopupKeyDown, this)
    },
    __OnPopupBeforeClose : function(a) {
        if (this.within(a.htmlEvent)) {
            a.cancel = true
        } else {
            this._unDocumentMousewheel()
        }
    },
    __OnPopupKeyDown : function(a) {
    },
    showPopup : function() {
        var b = {
            cancel : false
        };
        if (this._firebeforeshowpopup !== false) {
            this.fire("beforeshowpopup", b);
            if (b.cancel == true) {
                return false
            }
        }
        var a = this.getPopup();
        this._syncShowPopup();
        a.on("Close", this.__OnPopupHide, this);
        this._onDocumentMousewheel();
        this.fire("showpopup")
    },
    _unDocumentMousewheel : function() {
        mini.un(document, "mousewheel", this.__OnDocumentMousewheel, this);
        this._mousewheelXY = null
    },
    _onDocumentMousewheel : function() {
        this._unDocumentMousewheel();
        this._mousewheelXY = mini.getXY(this.el);
        mini.on(document, "mousewheel", this.__OnDocumentMousewheel, this)
    },
    __OnDocumentMousewheel : function(c) {
        var b = this;
        function a() {
            if (!b.isShowPopup()) {
                return
            }
            var d = b._mousewheelXY;
            var e = mini.getXY(b.el);
            if (d[0] != e[0] || d[1] != e[1]) {
                b.hidePopup()
            } else {
                setTimeout(a, 300)
            }
        }
        setTimeout(a, 300)
    },
    doLayout : function() {
        mini.PopupEdit.superclass.doLayout.call(this);
        if (this.isShowPopup()) {
        }
    },
    _syncShowPopup : function() {
        var b = this.getPopup();
        if (this._popupInner
                && this._popupInner.el.parentNode != this.popup._contentEl) {
            this.popup._contentEl.appendChild(this._popupInner.el);
            this._popupInner.setVisible(true)
        }
        var e = mini.getBox(this._borderEl);
        var a = this.popupWidth;
        if (this.popupWidth == "100%") {
            a = e.width
        }
        b.setWidth(a);
        var d = parseInt(this.popupHeight);
        if (!isNaN(d)) {
            b.setHeight(d)
        } else {
            b.setHeight("auto")
        }
        b.setMinWidth(this.popupMinWidth);
        b.setMinHeight(this.popupMinHeight);
        b.setMaxWidth(this.popupMaxWidth);
        b.setMaxHeight(this.popupMaxHeight);
        var c = {
            xAlign : "left",
            yAlign : "below",
            outYAlign : "above",
            outXAlign : "right",
            popupCls : this.popupCls
        };
        this._doShowAtEl(this._borderEl, c)
    },
    _doShowAtEl : function(c, b) {
        var a = this.getPopup();
        a.showAtEl(c, b)
    },
    __OnPopupHide : function(a) {
        this.__doFocusCls();
        this.fire("hidepopup")
    },
    hidePopup : function() {
        if (this.isShowPopup()) {
            var a = this.getPopup();
            a.close();
            this.blur()
        }
    },
    isShowPopup : function() {
        if (this.popup && this.popup.isDisplay()) {
            return true
        } else {
            return false
        }
    },
    setPopupWidth : function(a) {
        this.popupWidth = a
    },
    setPopupMaxWidth : function(a) {
        this.popupMaxWidth = a
    },
    setPopupMinWidth : function(a) {
        this.popupMinWidth = a
    },
    getPopupWidth : function(a) {
        return this.popupWidth
    },
    getPopupMaxWidth : function(a) {
        return this.popupMaxWidth
    },
    getPopupMinWidth : function(a) {
        return this.popupMinWidth
    },
    setPopupHeight : function(a) {
        this.popupHeight = a
    },
    setPopupMaxHeight : function(a) {
        this.popupMaxHeight = a
    },
    setPopupMinHeight : function(a) {
        this.popupMinHeight = a
    },
    getPopupHeight : function(a) {
        return this.popupHeight
    },
    getPopupMaxHeight : function(a) {
        return this.popupMaxHeight
    },
    getPopupMinHeight : function(a) {
        return this.popupMinHeight
    },
    __OnClick : function(b) {
        if (this.enabled == false) {
            return
        }
        this.fire("click", {
            htmlEvent : b
        });
        if (this.isReadOnly()) {
            return
        }
        if (mini.isAncestor(this._buttonEl, b.target)) {
            this._OnButtonClick(b)
        }
        if (mini.findParent(b.target, this._closeCls)) {
            if (this.isShowPopup()) {
                this.hidePopup()
            }
            this.fire("closeclick", {
                htmlEvent : b
            });
            return
        }
        if (this.allowInput == false
                || mini.isAncestor(this._buttonEl, b.target)) {
            if (this.isShowPopup()) {
                this.hidePopup()
            } else {
                var a = this;
                setTimeout(function() {
                    a.showPopup()
                }, 1)
            }
        }
    },
    __OnPopupButtonClick : function(a) {
        if (a.name == "close") {
            this.hidePopup()
        }
        a.cancel = true
    },
    getAttrs : function(b) {
        var a = mini.PopupEdit.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "popupWidth", "popupHeight", "popup",
                "onshowpopup", "onhidepopup", "onbeforeshowpopup" ]);
        mini._ParseInt(b, a, [ "popupMinWidth", "popupMaxWidth",
                "popupMinHeight", "popupMaxHeight" ]);
        return a
    }
});
mini.regClass(mini.PopupEdit, "popupedit");