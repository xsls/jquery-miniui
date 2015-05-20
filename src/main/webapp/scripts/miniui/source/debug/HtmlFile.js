mini.HtmlFile = function() {
    mini.HtmlFile.superclass.constructor.call(this);
    this.on("validation", this.__OnValidation, this)
};
mini.extend(mini.HtmlFile, mini.ButtonEdit, {
    buttonText : "浏览...",
    _buttonWidth : 56,
    limitType : "",
    limitTypeErrorText : "上传文件格式为：",
    allowInput : false,
    readOnly : true,
    _cellSpacing : 0,
    uiCls : "mini-htmlfile",
    _create : function() {
        mini.HtmlFile.superclass._create.call(this);
        this._fileEl = mini.append(this.el,
                '<input type="file" hideFocus class="mini-htmlfile-file" name="'
                        + this.name + '" ContentEditable=false/>');
        mini.on(this._borderEl, "mousemove", this.__OnMouseMove, this);
        mini.on(this._fileEl, "change", this.__OnFileChange, this)
    },
    _getButtonHtml : function() {
        var a = "onmouseover=\"mini.addClass(this, '" + this._buttonHoverCls
                + "');\" onmouseout=\"mini.removeClass(this, '"
                + this._buttonHoverCls + "');\"";
        return '<span class="mini-buttonedit-button" ' + a + ">"
                + this.buttonText + "</span>"
    },
    __OnFileChange : function(a) {
        this.value = this._textEl.value = this._fileEl.value;
        this._OnValueChanged();
        a = {
            htmlEvent : a
        };
        this.fire("fileselect", a)
    },
    __OnMouseMove : function(c) {
        var a = c.pageX, d = c.pageY;
        var b = mini.getBox(this.el);
        a = (a - b.x - 5);
        d = (d - b.y - 5);
        if (this.enabled == false) {
            a = -20;
            d = -20
        }
        this._fileEl.style.display = "";
        this._fileEl.style.left = a + "px";
        this._fileEl.style.top = d + "px"
    },
    __OnValidation : function(c) {
        if (!this.limitType) {
            return
        }
        if (c.isValid == false) {
            return
        }
        if (this.required == false && c.value == "") {
            return
        }
        var d = c.value.split(".");
        var a = ("*." + d[d.length - 1]).toLowerCase();
        var b = this.limitType.split(";");
        if (b.length > 0 && b.indexOf(a) == -1) {
            c.errorText = this.limitTypeErrorText + this.limitType;
            c.isValid = false
        }
    },
    setName : function(a) {
        this.name = a;
        mini.setAttr(this._fileEl, "name", this.name)
    },
    getValue : function() {
        return this._textEl.value
    },
    setButtonText : function(b) {
        this.buttonText = b;
        var a = mini.byClass("mini-buttonedit-button", this.el);
        if (a) {
            a.innerHTML = b
        }
    },
    getButtonText : function() {
        return this.buttonText
    },
    setLimitType : function(a) {
        this.limitType = a
    },
    getLimitType : function() {
        return this.limitType
    },
    getAttrs : function(b) {
        var a = mini.HtmlFile.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "limitType", "buttonText",
                "limitTypeErrorText", "onfileselect" ]);
        return a
    }
});
mini.regClass(mini.HtmlFile, "htmlfile");