mini.RadioButtonList = function() {
    mini.RadioButtonList.superclass.constructor.call(this)
};
mini.extend(mini.RadioButtonList, mini.CheckBoxList, {
    multiSelect : false,
    _itemCls : "mini-radiobuttonlist-item",
    _itemHoverCls : "mini-radiobuttonlist-item-hover",
    _itemSelectedCls : "mini-radiobuttonlist-item-selected",
    _tableCls : "mini-radiobuttonlist-table",
    _tdCls : "mini-radiobuttonlist-td",
    _checkType : "radio",
    uiCls : "mini-radiobuttonlist"
});
mini.regClass(mini.RadioButtonList, "radiobuttonlist");