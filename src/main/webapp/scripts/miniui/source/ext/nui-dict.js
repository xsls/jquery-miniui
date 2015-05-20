(function() {
    mini.DictCheckboxGroup = function() {
        mini.DictCheckboxGroup.superclass.constructor.call(this)
    };
    mini.DictRadioGroup = function() {
        mini.DictRadioGroup.superclass.constructor.call(this)
    };
    mini.DictComboBox = function() {
        mini.DictComboBox.superclass.constructor.call(this)
    };
    var a = {
        map : {},
        loadingMap : {},
        removeEmpty : function(e) {
            for (var d = 0, c = e.length; d < c; d++) {
                if (e[d] && e[d].__NullItem) {
                    e.splice(d, 1)
                }
            }
        },
        getDictName : function(f, d) {
            var e = [];
            for (var g = 0, c = f.length; g < c; g++) {
                var h = f[g];
                if (nui.fn.contains(d, h.dictID)) {
                    e.push(h.dictName)
                }
            }
            return e.join(",")
        },
        ajaxLoad : function(d) {
            var c = {
                dictTypeId : d.dictTypeId
            };
            mini
                    .ajax({
                        url : "com.primeton.components.nui.DictLoader.getDictData.biz.ext",
                        data : c,
                        type : "POST",
                        async : false,
                        success : function(f) {
                            var e = f.dictList;
                            a.map[dictTypeId] = e;
                            d._setDictData(e)
                        }
                    })
        },
        getDictText : function(c, e) {
            var d = a.map[c];
            if (d) {
                return a.getDictName(d, e)
            }
            var f = "";
            mini
                    .ajax({
                        url : "com.primeton.components.nui.DictLoader.getDictData.biz.ext",
                        data : {
                            dictTypeId : c
                        },
                        type : "POST",
                        async : false,
                        success : function(h) {
                            var g = h.dictList;
                            a.map[c] = g;
                            f = a.getDictName(g, e)
                        }
                    });
            return f
        },
        loadData : function() {
            var c = this.dictTypeId;
            if (!c) {
                return
            }
            var d = a.map[c];
            if (!d) {
                mini
                        .ajax({
                            url : "com.primeton.components.nui.DictLoader.getDictData.biz.ext",
                            data : {
                                dictTypeId : c
                            },
                            type : "POST",
                            async : false,
                            success : function(f) {
                                var e = f.dictList;
                                a.map[c] = e
                            }
                        });
                d = a.map[c]
            }
            a.removeEmpty(d);
            this._setDictData(d)
        }
    };
    mini.getDictText = a.getDictText;
    var b = {
        dictTypeId : "",
        textField : "dictName",
        valueField : "dictID",
        _initData : function() {
            a.loadData.call(this)
        },
        _setDictData : function(c) {
            this.loadData(c);
            if (this.value) {
                this.setValue(this.value)
            }
        }
    };
    b.uiCls = "mini-dictcheckboxgroup";
    jQuery.extend(b, {
        uiCls : "mini-dictcheckboxgroup",
        set : function(c) {
            mini.DictCheckboxGroup.superclass.set.call(this, c);
            this._initData()
        },
        getAttrs : function(d) {
            var c = mini.DictCheckboxGroup.superclass.getAttrs.call(this, d);
            var e = jQuery(d);
            mini._ParseString(d, c, [ "dictTypeId" ]);
            return c
        }
    });
    mini.extend(mini.DictCheckboxGroup, mini.CheckBoxList, b);
    jQuery.extend(b, {
        uiCls : "mini-dictradiogroup",
        set : function(c) {
            mini.DictRadioGroup.superclass.set.call(this, c);
            this._initData()
        },
        getAttrs : function(d) {
            var c = mini.DictRadioGroup.superclass.getAttrs.call(this, d);
            var e = jQuery(d);
            mini._ParseString(d, c, [ "dictTypeId" ]);
            return c
        }
    });
    mini.extend(mini.DictRadioGroup, mini.RadioButtonList, b);
    jQuery.extend(b, {
        uiCls : "mini-dictcombobox",
        _afterApply : function(c) {
            mini.DictComboBox.superclass._afterApply.call(this, c);
            this._initData()
        },
        getAttrs : function(d) {
            var c = mini.DictComboBox.superclass.getAttrs.call(this, d);
            var e = jQuery(d);
            mini._ParseString(d, c, [ "dictTypeId" ]);
            return c
        },
        _setDictData : function(d) {
            this.setValueField(this.valueField);
            this.setTextField(this.textField);
            this.setData(d);
            if (this.value) {
                var c = this.value;
                this.value = "";
                this.setValue(c)
            }
        }
    });
    mini.extend(mini.DictComboBox, mini.ComboBox, b);
    mini.regClass(mini.DictCheckboxGroup, "dictcheckboxgroup");
    mini.regClass(mini.DictRadioGroup, "dictradiogroup");
    mini.regClass(mini.DictComboBox, "dictcombobox")
})(mini);