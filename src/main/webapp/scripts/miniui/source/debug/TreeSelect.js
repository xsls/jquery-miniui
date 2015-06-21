/**
 * 树形下拉选择框。
 * 
 *     @example
 *     &lt;input class="mini-treeselect" url="../data/tree.txt" valueField="id" textField="text"/&lt;
 * 
 * @class
 * @extends mini.PopupEdit
 * @constructor
 */
mini.TreeSelect = function() {
    this.data = [];
    mini.TreeSelect.superclass.constructor.call(this)
};
mini.extend(mini.TreeSelect, mini.PopupEdit, {
    valueFromSelect : false,
    text : "",
    value : "",
    autoCheckParent : false,
    expandOnLoad : false,
    valueField : "id",
    textField : "text",
    nodesField : "children",
    dataField : "",
    delimiter : ",",
    multiSelect : false,
    data : [],
    url : "",
    allowInput : false,
    showTreeIcon : false,
    showTreeLines : true,
    resultAsTree : false,
    parentField : "pid",
    checkRecursive : false,
    showFolderCheckBox : false,
    showRadioButton : false,
    popupHeight : 200,
    popupWidth : "100%",
    popupMaxHeight : 250,
    popupMinWidth : 100,
    set : function(d) {
        if (typeof d == "string") {
            return this
        }
        var c = d.value;
        delete d.value;
        var e = d.text;
        delete d.text;
        var a = d.url;
        delete d.url;
        var b = d.data;
        delete d.data;
        mini.TreeSelect.superclass.set.call(this, d);
        if (!mini.isNull(b)) {
            this.setData(b)
        }
        if (!mini.isNull(a)) {
            this.setUrl(a)
        }
        if (!mini.isNull(c)) {
            this.setValue(c)
        }
        if (!mini.isNull(e)) {
            this.setText(e)
        }
        return this
    },
    uiCls : "mini-treeselect",
    _createPopup : function() {
        mini.TreeSelect.superclass._createPopup.call(this);
        this.tree = new mini.Tree();
        this.tree.setShowTreeIcon(true);
        this.tree.setStyle("border:0;width:100%;height:100%;overflow:hidden;");
        this.tree.setResultAsTree(this.resultAsTree);
        this.tree.render(this.popup._contentEl);
        this.tree.setCheckRecursive(this.checkRecursive);
        this.tree.setShowFolderCheckBox(this.showFolderCheckBox);
        this.tree.setShowRadioButton(this.showRadioButton);
        this.tree.setExpandOnNodeClick(this.expandOnNodeClick);
        this.tree.on("nodeclick", this.__OnNodeClick, this);
        this.tree.on("nodecheck", this.__OnCheckedChanged, this);
        this.tree.on("expand", this.__OnTreeExpand, this);
        this.tree.on("collapse", this.__OnTreeCollapse, this);
        this.tree.on("beforenodecheck", this.__OnTreeBeforeNodeCheck, this);
        this.tree.on("beforenodeselect", this.__OnTreeBeforeNodeSelect, this);
        this.tree.on("drawnode", this.__OnDrawNode, this);
        this.tree.useAnimation = false;
        var a = this;
        this.tree.on("beforeload", function(b) {
            a.fire("beforeload", b)
        }, this);
        this.tree.on("load", function(b) {
            a.fire("load", b)
        }, this);
        this.tree.on("loaderror", function(b) {
            a.fire("loaderror", b)
        }, this)
    },
    __OnDrawNode : function(a) {
        this.fire("drawnode", a)
    },
    __OnTreeBeforeNodeCheck : function(a) {
        a.tree = a.sender;
        this.fire("beforenodecheck", a)
    },
    __OnTreeBeforeNodeSelect : function(a) {
        a.tree = a.sender;
        this.fire("beforenodeselect", a);
        if (a.cancel) {
            this._nohide = true
        }
    },
    __OnTreeExpand : function(a) {
    },
    __OnTreeCollapse : function(a) {
    },
    findItems : function(a) {
        return this.tree.findNodes(this.tree.getIdField(), a)
    },
    findNodes : function(a) {
        return this.tree.getNodesByValue(a)
    },
    getSelectedNode : function() {
        return this.getSelectedNodes()[0]
    },
    getCheckedNodes : function(a) {
        return this.tree.getNodesByValue(this.value)
    },
    getSelectedNodes : function() {
        return this.tree.getNodesByValue(this.value)
    },
    getParentNode : function(a) {
        return this.tree.getParentNode(a)
    },
    getChildNodes : function(a) {
        return this.tree.getChildNodes(a)
    },
    showPopup : function() {
        var a = {
            cancel : false
        };
        this.fire("beforeshowpopup", a);
        this._firebeforeshowpopup = false;
        if (a.cancel == true) {
            return
        }
        var b = this.popup.el.style.height;
        mini.TreeSelect.superclass.showPopup.call(this);
        this.tree.setValue(this.value);
        this._nohide = false
    },
    __OnPopupHide : function(a) {
        this.__doFocusCls();
        this.tree.clearFilter();
        this.fire("hidepopup")
    },
    getItem : function(a) {
        return typeof a == "object" ? a : this.data[a]
    },
    indexOf : function(a) {
        return this.data.indexOf(a)
    },
    getAt : function(a) {
        return this.data[a]
    },
    loadList : function(b, a, c) {
        this.tree.loadList(b, a, c);
        this.data = this.tree.getData();
        this._getCheckedValue()
    },
    getList : function() {
        return this.tree.getList()
    },
    /**
     * 加载数据<br/>
     * function load(url)
     * @member mini.TreeSelect
     * @param  url
     *
     */
    load : function(a) {
        this.tree.load(a);
        this.data = this.tree.data;
        this._getCheckedValue()
    },
    _eval : function(_) {
        return eval("(" + _ + ")")
    },
    /**
     * 
     * function setData(data)
     * @member mini.TreeSelect
     * @param {Array} data
     *
     */
    setData : function(a) {
        if (typeof a == "string") {
            a = this._eval(a)
        }
        if (!mini.isArray(a)) {
            a = []
        }
        this.tree.setData(a);
        this.data = this.tree.data;
        this._getCheckedValue()
    },
    /**
     * 
     * function getData()
     * @member mini.TreeSelect
     * @returns {Array}
     *
     */
    getData : function() {
        return this.data
    },
    _getCheckedValue : function() {
        var a = this.tree.getValue();
        this.setValue(a)
    },
    /**
     * 
     * function setUrl(url)
     * @member mini.TreeSelect
     * @param {String} url
     *
     */
    setUrl : function(a) {
        this.getPopup();
        this.tree.setUrl(a);
        this.url = this.tree.url;
        this.data = this.tree.data;
        this._getCheckedValue()
    },
    /**
     * 
     * function getUrl()
     * @member mini.TreeSelect
     * @returns {String}
     *
     */
    getUrl : function() {
        return this.url
    },
    virtualScroll : false,
    setVirtualScroll : function(a) {
        if (this.tree) {
            this.tree.setVirtualScroll(a)
        }
        this.virtualScroll = a
    },
    getVirtualScroll : function() {
        return this.virtualScroll
    },
    pinyinField : "tag",
    setPinyinField : function(a) {
        this.pinyinField = a
    },
    getPinyinField : function() {
        return this.pinyinField
    },
    /**
     * 
     * function setTextField(textField)
     * @member mini.TreeSelect
     * @param {String} textField
     *
     */
    setTextField : function(a) {
        if (this.tree) {
            this.tree.setTextField(a)
        }
        this.textField = a
    },
    /**
     * 
     * function getTextField()
     * @member mini.TreeSelect
     * @returns {String}
     *
     */
    getTextField : function() {
        return this.textField
    },
    setNodesField : function(a) {
        if (this.tree) {
            this.tree.setNodesField(a)
        }
        this.nodesField = a
    },
    getNodesField : function() {
        return this.nodesField
    },
    setDataField : function(a) {
        if (this.tree) {
            this.tree.setDataField(a)
        }
        this.dataField = a
    },
    getDataField : function() {
        return this.dataField
    },
    /**
     * 获取值<br/>
     * function getValue()
     * @member mini.TreeSelect
     *
     */
    getValue : function() {
        var a = mini.TreeSelect.superclass.getValue.call(this);
        if (this.valueFromSelect && a && this.findItems(a).length == 0) {
            return ""
        }
        return a
    },
    /**
     * 设置值<br/>
     * function setValue(value)
     * @member mini.TreeSelect
     * @param  value
     *
     */
    setValue : function(b) {
        var a = this.tree.getValueAndText(b);
        if (a[1] == "" && !this.valueFromSelect) {
            a[0] = b;
            a[1] = b
        }
        this.value = b;
        this._valueEl.value = b;
        this.text = this._textEl.value = a[1];
        this._doEmpty()
    },
    /**
     * 
     * function setMultiSelect(multiSelect)
     * @member mini.TreeSelect
     * @param {Boolean} multiSelect
     *
     */
    setMultiSelect : function(a) {
        if (this.multiSelect != a) {
            this.multiSelect = a;
            this.tree.setShowCheckBox(a);
            this.tree.setAllowSelect(!a);
            this.tree.setEnableHotTrack(!a)
        }
    },
    /**
     * 
     * function getMultiSelect()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getMultiSelect : function() {
        return this.multiSelect
    },
    __OnNodeClick : function(f) {
        if (this.multiSelect) {
            return
        }
        var b = this.tree.getSelectedNode();
        var d = this.tree.getValueAndText(b);
        var a = d[0];
        var c = this.getValue();
        this.setValue(a);
        if (c != this.getValue()) {
            this._OnValueChanged()
        }
        if (this._nohide !== true) {
            this.hidePopup();
            this.focus()
        }
        this._nohide = false;
        this.fire("nodeclick", {
            node : f.node
        })
    },
    __OnCheckedChanged : function(c) {
        if (!this.multiSelect) {
            return
        }
        var a = this.tree.getValue();
        var b = this.getValue();
        this.setValue(a);
        if (b != this.getValue()) {
            this._OnValueChanged()
        }
        this.focus()
    },
    __OnInputKeyDown : function(c) {
        var a = {
            htmlEvent : c
        };
        this.fire("keydown", a);
        if (c.keyCode == 8 && (this.isReadOnly() || this.allowInput == false)) {
            return false
        }
        if (c.keyCode == 9) {
            if (this.isShowPopup()) {
                this.hidePopup()
            }
            return
        }
        if (this.isReadOnly()) {
            return
        }
        switch (c.keyCode) {
        case 27:
            if (this.isShowPopup()) {
                c.stopPropagation()
            }
            this.hidePopup();
            break;
        case 13:
            var b = this;
            setTimeout(function() {
                b.fire("enter", a)
            }, 10);
            break;
        case 37:
            break;
        case 38:
            c.preventDefault();
            break;
        case 39:
            break;
        case 40:
            c.preventDefault();
            this.showPopup();
            break;
        default:
            if (this.allowInput == false) {
            } else {
                var b = this;
                setTimeout(function() {
                    b._doQuery()
                }, 10)
            }
            break
        }
    },
    _doQuery : function() {
        if (this.multiSelect) {
            return
        }
        var c = this.textField, a = this.pinyinField;
        var b = this._textEl.value.toLowerCase();
        this.tree.filter(function(e) {
            var f = String(e[c] ? e[c] : "").toLowerCase();
            var d = String(e[a] ? e[a] : "").toLowerCase();
            if (f.indexOf(b) != -1 || d.indexOf(b) != -1) {
                return true
            } else {
                return false
            }
        });
        this.tree.expandAll();
        this.showPopup()
    },
    /**
     * 
     * function setCheckRecursive(checkRecursive)
     * @member mini.TreeSelect
     * @param {Boolean} checkRecursive
     *
     */
    setCheckRecursive : function(a) {
        this.checkRecursive = a;
        if (this.tree) {
            this.tree.setCheckRecursive(a)
        }
    },
    /**
     * 
     * function getCheckRecursive()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getCheckRecursive : function() {
        return this.checkRecursive
    },
    /**
     * 
     * function setResultAsTree(resultAsTree)
     * @member mini.TreeSelect
     * @param {Boolean} resultAsTree
     *
     */
    setResultAsTree : function(a) {
        this.resultAsTree = a;
        if (this.tree) {
            this.tree.setResultAsTree(a)
        }
    },
    /**
     * 
     * function getResultAsTree()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getResultAsTree : function() {
        return this.resultAsTree
    },
    /**
     * 
     * function setParentField(parentField)
     * @member mini.TreeSelect
     * @param {String} parentField
     *
     */
    setParentField : function(a) {
        this.parentField = a;
        if (this.tree) {
            this.tree.setParentField(a)
        }
    },
    /**
     * 
     * function getParentField()
     * @member mini.TreeSelect
     * @returns {String}
     *
     */
    getParentField : function() {
        return this.parentField
    },
    /**
     * 
     * function setValueField(valueField)
     * @member mini.TreeSelect
     * @param {String} valueField
     *
     */
    setValueField : function(a) {
        if (this.tree) {
            this.tree.setIdField(a)
        }
        this.valueField = a
    },
    /**
     * 
     * function getValueField()
     * @member mini.TreeSelect
     * @returns {String}
     *
     */
    getValueField : function() {
        return this.valueField
    },
    /**
     * 
     * function setShowTreeIcon(showTreeIcon)
     * @member mini.TreeSelect
     * @param {Boolean} showTreeIcon
     *
     */
    setShowTreeIcon : function(a) {
        this.showTreeIcon = a;
        if (this.tree) {
            this.tree.setShowTreeIcon(a)
        }
    },
    /**
     * 
     * function getShowTreeIcon()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getShowTreeIcon : function() {
        return this.showTreeIcon
    },
    /**
     * 
     * function setShowTreeLines(showTreeLines)
     * @member mini.TreeSelect
     * @param {Boolean} showTreeLines
     *
     */
    setShowTreeLines : function(a) {
        this.showTreeLines = a;
        if (this.tree) {
            this.tree.setShowTreeLines(a)
        }
    },
    /**
     * 
     * function getShowTreeLines()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getShowTreeLines : function() {
        return this.showTreeLines
    },
    setShowFolderCheckBox : function(a) {
        this.showFolderCheckBox = a;
        if (this.tree) {
            this.tree.setShowFolderCheckBox(a)
        }
    },
    getShowFolderCheckBox : function() {
        return this.showFolderCheckBox
    },
    setShowRadioButton : function(a) {
        this.showRadioButton = a;
        if (this.tree) {
            this.tree.setShowRadioButton(a)
        }
    },
    getShowRadioButton : function() {
        return this.showRadioButton
    },
    /**
     * 
     * function setAutoCheckParent(autoCheckParent)
     * @member mini.TreeSelect
     * @param {Boolean} autoCheckParent
     *
     */
    setAutoCheckParent : function(a) {
        this.autoCheckParent = a;
        if (this.tree) {
            this.tree.setAutoCheckParent(a)
        }
    },
    /**
     * 
     * function getAutoCheckParent()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getAutoCheckParent : function() {
        return this.autoCheckParent
    },
    /**
     * 
     * function setExpandOnLoad(expandOnLoad)
     * @member mini.TreeSelect
     * @param {Boolean} expandOnLoad
     *
     */
    setExpandOnLoad : function(a) {
        this.expandOnLoad = a;
        if (this.tree) {
            this.tree.setExpandOnLoad(a)
        }
    },
    /**
     * 
     * function getExpandOnLoad()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getExpandOnLoad : function() {
        return this.expandOnLoad
    },
    /**
     * 
     * function setValueFromSelect(valueFromSelect)
     * @member mini.TreeSelect
     * @param {Boolean} valueFromSelect
     *
     */
    setValueFromSelect : function(a) {
        this.valueFromSelect = a
    },
    /**
     * 
     * function getValueFromSelect()
     * @member mini.TreeSelect
     * @returns {Boolean}
     *
     */
    getValueFromSelect : function() {
        return this.valueFromSelect
    },
    setAjaxData : function(a) {
        this.ajaxData = a;
        this.tree.setAjaxData(a)
    },
    setAjaxType : function(a) {
        this.ajaxType = a;
        this.tree.setAjaxType(a)
    },
    expandOnNodeClick : false,
    setExpandOnNodeClick : function(a) {
        this.expandOnNodeClick = a;
        if (this.tree) {
            this.tree.setExpandOnNodeClick(a)
        }
    },
    getExpandOnNodeClick : function() {
        return this.expandOnNodeClick
    },
    getAttrs : function(b) {
        var a = mini.ComboBox.superclass.getAttrs.call(this, b);
        mini._ParseString(b, a, [ "url", "data", "textField", "pinyinField",
                "valueField", "nodesField", "parentField", "onbeforenodecheck",
                "onbeforenodeselect", "expandOnLoad", "onnodeclick",
                "onbeforeload", "onload", "onloaderror", "ondrawnode" ]);
        mini._ParseBool(b, a, [ "expandOnNodeClick", "multiSelect",
                "resultAsTree", "checkRecursive", "showTreeIcon",
                "showTreeLines", "showFolderCheckBox", "showRadioButton",
                "autoCheckParent", "valueFromSelect", "virtualScroll" ]);
        if (a.expandOnLoad) {
            var c = parseInt(a.expandOnLoad);
            if (mini.isNumber(c)) {
                a.expandOnLoad = c
            } else {
                a.expandOnLoad = a.expandOnLoad == "true" ? true : false
            }
        }
        return a
    }
});
mini.regClass(mini.TreeSelect, "TreeSelect");