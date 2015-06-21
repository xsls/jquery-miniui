/**
 * 能批量对多个控件进行赋值、取值、重置、验证、获取错误信息等。<br>
 * 节省大量针对单独控件的操作代码。
 * <ul>
 * <li>加载表单：<br>
 * 1）使用ajax获取数据；<br>
 * 2）将数据一次性设置给多个控件：`form.setData(obj);`</li>
 * <li>保存表单：<br>
 * 1）获取多个控件数据：`var obj = form.getData()；`<br>
 * 2）使用ajax提交到服务端保存。</li>
 * </ul>
 * 
 *     @example
 *     // ********** 提交表单数据： **********
 *     var form = new mini.Form("#form1");            
 *     var data = form.getData();      //获取表单多个控件的数据
 *     var json = mini.encode(data);   //序列化成JSON
 *     $.ajax({
 *         url: "../data/FormService.aspx?method=SaveData",
 *         type: "post",
 *         data: { submitData: json },
 *         success: function (text) {
 *             alert("提交成功，返回结果:" + text);    
 *         }
 *     });
 *     
 *     // ********** 加载表单数据： **********
 *     var form = new mini.Form("#form1");            
 *     $.ajax({
 *         url: "../data/FormService.aspx?method=LoadData",
 *         type: "post",
 *         success: function (text) {
 *             var data = mini.decode(text);   //反序列化成对象
 *             form.setData(data);             //设置多个控件数据
 *         }
 *     });
 *     
 * @class
 * @extends mini.Component
 * @constructor
 */
mini.Form = function(a) {
    this.el = mini.byId(a);
    if (!this.el) {
        throw new Error("form element not null")
    }
    mini.Form.superclass.constructor.call(this)
};
mini.extend(mini.Form, mini.Component, {
    el : null,
    /**
     * 获取表单组件数组
     * @member mini.Form
     * @returns {mini.Control[]} 表单中所有字段的控件
     */
    getFields : function() {
        if (!this.el) {
            return []
        }
        var a = mini.findControls(function(b) {
            if (!b.el || b.formField != true) {
                return false
            }
            if (mini.isAncestor(this.el, b.el)) {
                return true
            }
            return false
        }, this);
        return a
    },
    getFieldsMap : function() {
        var a = this.getFields();
        var e = {};
        for (var c = 0, b = a.length; c < b; c++) {
            var d = a[c];
            if (d.name) {
                e[d.name] = d
            }
        }
        return e
    },
    getField : function(a) {
        if (!this.el) {
            return null
        }
        return mini.getbyName(a, this.el)
    },
    /**
     * 获取表单数据<br/>
     * function getData(formatter, deep)
     * @member mini.Form
     * @param {Boolean} [formatter=false] 为 true 时，获取的日期为 "2010-11-12" 格式的字符串。实际上是该参数值为 true 时，返回结果中的字段值是 `getFormValue()` 方法的返回值，而该参数值为 false 时返回结果中的字段值是 `getValue()` 方法的返回值
     * @param {Boolean} [deep=true] 为 true 时，返回数据的格式为 `{user:{name:"111"}}`；为 false 时，返回数据格式为 `{"user.name": "111"}`
     * @returns {Object} 包含表单中所有字段名称和字段值的 JSON 对象
     */
    getData : function(formatter, deep) {
        if (mini.isNull(deep)) {
            deep = true
        }
        var g = formatter ? "getFormValue" : "getValue";
        var h = this.getFields();
        var d = {};
        for (var e = 0, a = h.length; e < a; e++) {
            var b = h[e];
            var f = b[g];
            if (!f) {
                continue
            }
            if (b.name) {
                if (deep == true) {
                    mini._setMap(b.name, f.call(b), d)
                } else {
                    d[b.name] = f.call(b)
                }
            }
            if (b.textName && b.getText) {
                if (deep == true) {
                    mini._setMap(b.textName, b.getText(), d)
                } else {
                    d[b.textName] = b.getText()
                }
            }
        }
        return d
    },
    /**
     * 设置表单数据
     * @member mini.Form
     * @param {Object} data 数据对象
     * @param {Boolean} [all=true] 设置 true 后对表单中所有控件设置值，没有数据则清空处理。
     * @param {Boolean} [deep=true] 同 {@link #getData} 方法中的 deep 参数
     */
    setData : function(data, all, deep) {
        if (mini.isNull(deep)) {
            deep = true
        }
        if (typeof data != "object") {
            data = {}
        }
        var g = this.getFieldsMap();
        for ( var c in g) {
            var f = g[c];
            if (!f) {
                continue
            }
            if (f.setValue) {
                var b = data[c];
                if (deep == true) {
                    b = mini._getMap(c, data)
                }
                if (b === undefined && all === false) {
                    continue
                }
                if (b === null) {
                    b = ""
                }
                f.setValue(b)
            }
            if (f.setText && f.textName) {
                var h = data[f.textName];
                if (deep == true) {
                    h = mini._getMap(f.textName, data)
                }
                if (mini.isNull(h)) {
                    h = ""
                }
                f.setText(h)
            }
        }
    },
    /**
     * 重置表单
     * @member mini.Form
     */
    reset : function() {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.setValue) {
                continue
            }
            if (d.setText && d._clearText !== false) {
                var e = d.defaultText;
                if (mini.isNull(e)) {
                    e = ""
                }
                d.setText(e)
            }
            d.setValue(d.defaultValue)
        }
        this.setIsValid(true)
    },
    /**
     * 清空表单
     * @member mini.Form
     *
     */
    clear : function() {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.setValue) {
                continue
            }
            if (d.setText && d._clearText !== false) {
                d.setText("")
            }
            d.setValue("")
        }
        this.setIsValid(true)
    },
    getValidateFields : function() {
        function c(g) {
            return g.isDisplay(function(h) {
                if (mini.hasClass(h, "mini-tabs-body")) {
                    return true
                }
            })
        }
        var a = [];
        var d = this.getFields();
        for (var e = 0, b = d.length; e < b; e++) {
            var f = d[e];
            if (!f.validate || !f.isDisplay) {
                continue
            }
            if (c(f)) {
                a.push(f)
            }
        }
        return a
    },
    /**
     * 验证表单
     * @member mini.Form
     * @return {Boolean} 校验通过返回 true，反之返回 false
     */
    validate : function(e) {
        var c = this.getValidateFields();
        for (var d = 0, b = c.length; d < b; d++) {
            var f = c[d];
            var a = f.validate();
            if (a == false && e === false) {
                break
            }
        }
        return this.isValid()
    },
    /**
     * 表单是否验证通过
     * @member mini.Form
     * @returns {Boolean} 校验通过返回 true，反之返回 false
     */
    isValid : function() {
        var b = this.getValidateFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (d.isValid() == false) {
                return false
            }
        }
        return true
    },
    /**
     * 设置数据验证结果
     * @member mini.Form
     * @param {Boolean} isValid 要设置的验证结果
     */
    setIsValid : function(isValid) {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.setIsValid) {
                continue
            }
            d.setIsValid(isValid)
        }
    },
    /**
     * 获取错误文本数组
     * @member mini.Form
     * @returns {String[]} 错误文本数组
     */
    getErrorTexts : function() {
        var a = [];
        var e = this.getErrors();
        for (var c = 0, b = e.length; c < b; c++) {
            var d = e[c];
            a.push(d.errorText)
        }
        return a
    },
    /**
     * 获取验证错误的控件数组
     * @member mini.Form
     * @returns {Array} 错误的控件数组
     */
    getErrors : function() {
        var e = [];
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            if (!d.isValid) {
                continue
            }
            if (d.isValid() == false) {
                e.push(d)
            }
        }
        return e
    },
    mask : function(a) {
        if (typeof a == "string") {
            a = {
                html : a
            }
        }
        a = a || {};
        a.el = this.el;
        if (!a.cls) {
            a.cls = this._maskCls
        }
        mini.mask(a)
    },
    /**
     * 取消遮罩
     * @member mini.Form
     */
    unmask : function() {
        mini.unmask(this.el)
    },
    _maskCls : "mini-mask-loading",
    /**
     * @property {String} [loadingMsg="数据加载中，请稍后..."] 显示加载遮罩层时的提示消息
     */
    loadingMsg : "数据加载中，请稍后...",
    /**
     * 加载遮罩表单区域
     * @member mini.Form
     * @param {String} [loadingMsg=this.loadingMsg] 加载提示消息
     */
    loading : function(loadingMsg) {
        this.mask(loadingMsg || this.loadingMsg)
    },
    __OnValueChanged : function(a) {
        this._changed = true
    },
    _changed : false,
    /**
     * 设置是否变动
     * @member mini.Form
     * @param {Boolean} changed 表单是否被修改过
     */
    setChanged : function(changed) {
        this._changed = changed;
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var e = b[c];
            e.on("valuechanged", this.__OnValueChanged, this)
        }
    },
    /**
     * 判断是否变动
     * @member mini.Form
     * @returns {Boolean} 如果表单被修改过，则返回 true，反之返回 false
     */
    isChanged : function() {
        return this._changed
    },
    /**
     * 设置表单中的控件是否可用
     * @member mini.Form
     * @param {Boolean} enabled 为 true 时表单中的控件可以被编辑，为 false 时，表单中的控件为只读（被禁用）
     */
    setEnabled : function(enabled) {
        var b = this.getFields();
        for (var c = 0, a = b.length; c < a; c++) {
            var e = b[c];
            e.setEnabled(enabled)
        }
    }
});