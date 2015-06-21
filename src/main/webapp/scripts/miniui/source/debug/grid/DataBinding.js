/**
 * 数据绑定。用于表格与表单的选择、数据变更同步。
 * 
 *     @example
 *     //绑定表单
 *     var db = new mini.DataBinding();
 *     db.bindForm("editForm1", grid);
 *     
 *     //绑定控件
 *     db.bindField(textbox, grid, "username");
 * 
 * @class
 * @extends mini.Component
 * @constructor
 */
mini.DataBinding = function() {
    this._bindFields = [];
    this._bindForms = [];
    mini.DataBinding.superclass.constructor.call(this)
};
mini.extend(mini.DataBinding, mini.Component, {
    /**
     * 绑定表格与单个控件<br/>
     * function bindField(control, grid, field)
     * @member mini.DataBinding
     * @param {mini.Control} control Form 中的字段
     * @param  grid 表格控件
     * @param  fieldName 字段名称，即 name 属性的值
     */
    bindField : function(control, grid, fieldName, mode, convert) {
        control = mini.get(control);
        grid = mini.get(grid);
        if (!control || !grid || !fieldName) {
            return
        }
        var f = {
            control : control,
            source : grid,
            field : fieldName,
            convert : convert,
            mode : mode
        };
        this._bindFields.push(f);
        grid.on("currentchanged", this.__OnCurrentChanged, this);
        control.on("valuechanged", this.__OnValueChanged, this)
    },
    /**
     * 绑定表格与表单
     * @member mini.DataBinding
     * @param {String} formId 表单控件的 id
     * @param {String/mini.Control/HTMLElement} grid 表格控件， 或是表格控件的 id 或其对应的 DOM 节点
     * @returns {Object}
     *
     */
    bindForm : function(formId, grid, convert, mode) {
        formId = mini.byId(formId);
        grid = mini.get(grid);
        if (!formId || !grid) {
            return
        }
        var form = new mini.Form(formId);
        var fields = form.getFields();
        for (var i = 0, len = fields.length; i < len; i++) {
            var field = fields[i];
            this.bindField(field, grid, field.getName(), convert, mode)
        }
    },
    __OnCurrentChanged : function(g) {
        if (this._doSetting) {
            return
        }
        this._doSetting = true;
        this._currentRecord = g.record;
        var a = g.sender;
        var f = g.record;
        for (var d = 0, b = this._bindFields.length; d < b; d++) {
            var h = this._bindFields[d];
            if (h.source != a) {
                continue
            }
            var c = h.control;
            var k = h.field;
            if (c.setValue) {
                if (f) {
                    var m = f[k];
                    c.setValue(m)
                } else {
                    c.setValue("")
                }
            }
            if (c.setText && c.textName) {
                if (f) {
                    c.setText(f[c.textName])
                } else {
                    c.setText("")
                }
            }
        }
        var j = this;
        setTimeout(function() {
            j._doSetting = false
        }, 10)
    },
    __OnValueChanged : function(g) {
        if (this._doSetting) {
            return
        }
        this._doSetting = true;
        var d = g.sender;
        var m = d.getValue();
        for (var f = 0, b = this._bindFields.length; f < b; f++) {
            var j = this._bindFields[f];
            if (j.control != d || j.mode === false) {
                continue
            }
            var a = j.source;
            var h = this._currentRecord;
            if (!h) {
                continue
            }
            var c = {};
            c[j.field] = m;
            if (d.getText && d.textName) {
                c[d.textName] = d.getText()
            }
            a.updateRow(h, c)
        }
        var k = this;
        setTimeout(function() {
            k._doSetting = false
        }, 10)
    }
});
mini.regClass(mini.DataBinding, "databinding");