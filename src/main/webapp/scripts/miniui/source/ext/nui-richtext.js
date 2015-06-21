/**
 * 富文本编辑器
 * @class
 * @extends mini.Control
 * @requires mini.TextArea
 * @requires CKEDITOR
 * 
 *     @example
 *     var dictCheckboxGroup = new mini.DictCheckboxGroup();
 *     dictCheckboxGroup({
 *      dictTypeId : ".gender."
 *     });
 * 
 * @cfg {Number/String} [width="100%"] 宽度
 * @cfg {Number} [height=300] 高度
 * @cfg {String} [uiCls="mini-richtext"] 样式类名称
 * 
 * @property editor CKEDITOR 对象
 * 
 * @event initeditor 在富文本编辑器初始化完成后触发
 * 
 * @constructor 创建一个数据字典多选框组
 */
mini.Richtext = function() {
    mini.Richtext.superclass.constructor.call(this)
};
mini.extend(mini.Richtext, mini.Control, {
    width : "100%",
    height : 300,
    uiCls : "mini-richtext",
    /**
     * 创建实例
     * @private
     * @member mini.Richtext
     */
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
    /**
     * @inheritdoc
     * @member mini.Richtext
     */
    render : function(a) {
        mini.Richtext.superclass.constructor.call(this, a)
    },
    /**
     * 初始化富文本编辑器
     * @private
     * @member mini.Richtext
     */
    _initEditor : function() {
        var a = this;
        setTimeout(function() {
            a._doInitEditor()
        }, 1)
    },
    /**
     * 执行真正的初始化操作
     * @private
     * @member mini.Richtext
     * @fires initeditor
     */
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
    
    /**
     * 设置富文本编辑器的值
     * @param {String} value 要设置的值
     * @member mini.Richtext
     */
    setValue : function(value) {
        if (this.editor && this.editor.isReady) {
            this.editor.setData(value);
            this._editor.setValue(value)
        } else {
            this.value = value
        }
    },
    
    /**
     * 获取富文本编辑器的值
     * @return {String} 富文本编辑器的值
     * @member mini.Richtext
     */
    getValue : function() {
        if (this.editor) {
            return this.editor.getData()
        }
        return this.value
    },
    
    /**
     * 设置富文本编辑器实际提交的数据
     * @member mini.Richtext
     */
    setSubmitData : function() {
        if (this._editor) {
            this._editor.setValue(this.getValue())
        }
    },
    
    /**
     * 获取富文本编辑器实际提交的数据
     * @return {String} 富文本编辑器实际提交的数据
     * @member mini.Richtext
     */
    getSubmitData : function() {
        if (this._editor) {
            return this._editor.getValue()
        }
        return this.getValue()
    },
    /**
     * 设置富文本编辑器的宽度
     * @param {Number/String} width 要设置的宽度：<br>
     * `Number`  必须是一个大于 0 的正整数，单位为 px<br>
     * `String`  必须是一个百分比
     * @member mini.Richtext
     */
    setWidth : function(width) {
        mini.Richtext.superclass.setWidth.call(this, width);
        if (this.editor) {
            this.editor.resize(width, this.getHeight())
        }
    },
    
    /**
     * 设置富文本编辑器的高高
     * @param {Number} height 要设置的高度，必须是一个大于 0 的正整数，单位为 px
     * @member mini.Richtext
     */
    setHeight : function(height) {
        mini.Richtext.superclass.setHeight.call(this, height);
        if (this.editor) {
            this.editor.resize(this.getWidth(), height)
        }
    },

    /**
     * 设置富文本编辑器的只读属性
     * @param {Boolean} readonly `true` 表示只读， `false` 表示非只读
     * @member mini.Richtext
     */
    setReadOnly : function(readonly) {
        if (this.editor) {
            this.editor.setReadOnly(readonly);
            this.readOnly = readonly
        } else {
            this.readOnly = readonly
        }
    },
    
    /**
     * 获取富文本编辑器的只读属性
     * @return {Boolean} 如果当前为只读状态，则返回 `true`，否则返回 `false`
     * @member mini.Richtext
     */
    getReadOnly : function() {
        if (this.editor) {
            return this.editor.readOnly
        }
        return this.readOnly
    }
});
mini.regClass(mini.Richtext, "richtext");
