mini.Richtext = function() {
    mini.Richtext.superclass.constructor.call(this)
};
mini.extend(mini.Richtext, mini.Control, {
    width : "100%",
    height : 300,
    uiCls : "mini-richtext",
    _create : function() {
        this.el = document.createElement("div");
        this.el.innerHTML = '<textarea style="display:none"></textarea>';
        this._fromEditor = this.el.firstChild;
        this._editor = new mini.TextArea();
        this._editor.setVisible(false);
        this._editor.render(this.el);
        var a = this;
        mini.loadRes("ckeditor", function() {
            a._initEditor()
        })
    },
    render : function(a) {
        mini.Richtext.superclass.constructor.call(this, a)
    },
    _initEditor : function() {
        var a = this;
        setTimeout(function() {
            a._doInitEditor()
        }, 1)
    },
    _doInitEditor : function() {
        if (this.isRender() == false) {
            return
        }
        if (this.editor) {
            return
        }
        var a = this;
        this._editor.set({
            name : a.name,
            id : a.id + "_editor"
        });
        this._fromEditor.id = this.id + "_fromEditor";
        this.editor = CKEDITOR.replace(a._fromEditor.id, {
            width : a.width.replace("px", ""),
            height : a.height.replace("px", "") - 100,
            readOnly : a.readOnly
        });
        this.editor.isReady = false;
        this.editor.on("instanceReady", function(b) {
            b.editor.resize(b.editor.config.width, a.height.replace("px", ""));
            b.editor.isReady = true;
            a.setValue(a.value);
            a.fire("initeditor")
        });
        this.editor.on("resize", function(c) {
            var b = c.editor.container.$.clientHeight;
            mini.Richtext.superclass.setHeight.call(a, b)
        })
    },
    setValue : function(a) {
        if (this.editor && this.editor.isReady) {
            this.editor.setData(a);
            this._editor.setValue(a)
        } else {
            this.value = a
        }
    },
    getValue : function() {
        if (this.editor) {
            return this.editor.getData()
        }
        return this.value
    },
    setSubmitData : function() {
        if (this._editor) {
            this._editor.setValue(this.getValue())
        }
    },
    getSubmitData : function() {
        if (this._editor) {
            return this._editor.getValue()
        }
        return this.getValue()
    },
    setWidth : function(a) {
        mini.Richtext.superclass.setWidth.call(this, a);
        if (this.editor) {
            this.editor.resize(a, this.getHeight())
        }
    },
    setHeight : function(a) {
        mini.Richtext.superclass.setHeight.call(this, a);
        if (this.editor) {
            this.editor.resize(this.getWidth(), a)
        }
    },
    setReadOnly : function(a) {
        if (this.editor) {
            this.editor.setReadOnly(a);
            this.readOnly = a
        } else {
            this.readOnly = a
        }
    },
    getReadOnly : function() {
        if (this.editor) {
            return this.editor.readOnly
        }
        return this.readOnly
    }
});
mini.regClass(mini.Richtext, "richtext");
