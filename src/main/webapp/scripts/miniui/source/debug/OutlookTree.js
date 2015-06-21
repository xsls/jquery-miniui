/**
 * Outlook风格树形导航控件。
 * @class
 * @extends mini.OutlookBar
 * @constructor
 */
mini.OutlookTree = function() {
    mini.OutlookTree.superclass.constructor.call(this);
    this.data = []
};
mini.extend(mini.OutlookTree, mini.OutlookBar, {
    url : "",
    textField : "text",
    iconField : "iconCls",
    urlField : "url",
    resultAsTree : false,
    nodesField : "children",
    idField : "id",
    parentField : "pid",
    style : "width:100%;height:100%;",
    set : function(c) {
        if (typeof c == "string") {
            return this
        }
        var b = c.url;
        delete c.url;
        var a = c.activeIndex;
        delete c.activeIndex;
        mini.OutlookTree.superclass.set.call(this, c);
        if (b) {
            this.setUrl(b)
        }
        if (mini.isNumber(a)) {
            this.setActiveIndex(a)
        }
        return this
    },
    uiCls : "mini-outlooktree",
    destroy : function(a) {
        this._destroyTrees(a);
        mini.OutlookTree.superclass.destroy.call(this, a)
    },
    _destroyTrees : function(d) {
        if (this._trees) {
            var c = this._trees.clone();
            for (var b = 0, a = c.length; b < a; b++) {
                var e = c[b];
                e.destroy(d)
            }
            this._trees.length = 0
        }
    },
    _doParseFields : function(c) {
        for (var b = 0, a = c.length; b < a; b++) {
            var d = c[b];
            d.text = d[this.textField];
            d.url = d[this.urlField];
            d.iconCls = d[this.iconField]
        }
    },
    _doLoad : function() {
        var a = [];
        try {
            a = mini._getResult(this.url, null, null, null, null,
                    this.dataField)
        } catch (b) {
            if (mini_debugger == true) {
                alert("outlooktree json is error.")
            }
        }
        if (this.dataField && !mini.isArray(a)) {
            a = mini._getMap(this.dataField, a)
        }
        if (!a) {
            a = []
        }
        if (this.resultAsTree == false) {
            a = mini.arrayToTree(a, this.nodesField, this.idField,
                    this.parentField)
        }
        var c = mini.treeToArray(a, this.nodesField, this.idField,
                this.parentField);
        this._doParseFields(c);
        this.createNavBarTree(a);
        this.fire("load")
    },
    /**
     * 加载列表数据。比如：tree.loadList(list, "id", "pid")<br/>
     * function loadList(Array, idField, parentField)
     * @member mini.OutlookTree
     * @param  Array
     * @param  idField
     * @param  parentField
     *
     */
    loadList : function(c, b, d) {
        b = b || this.idField;
        d = d || this.parentField;
        this._doParseFields(c);
        var a = mini.arrayToTree(c, this.nodesField, b, d);
        this.load(a)
    },
    /**
     * 加载树形数据。<br/>
     * function load(Array)
     * @member mini.OutlookTree
     * @param  Array
     *
     */
    load : function(b) {
        if (typeof b == "string") {
            this.setUrl(b)
        } else {
            var a = mini.treeToArray(b, this.itemsField, this.idField,
                    this.parentField);
            this._doParseFields(a);
            this.createNavBarTree(b)
        }
    },
    setData : function(a) {
        this.load(a)
    },
    getData : function() {
        return this.data
    },
    /**
     * 
     * function setUrl(url)
     * @member mini.OutlookTree
     * @param {String} url
     *
     */
    setUrl : function(a) {
        this.url = a;
        this._doLoad()
    },
    /**
     * 
     * function getUrl()
     * @member mini.OutlookTree
     * @returns {String}
     *
     */
    getUrl : function() {
        return this.url
    },
    /**
     * 
     * function setTextField(textField)
     * @member mini.OutlookTree
     * @param {String} textField
     *
     */
    setTextField : function(a) {
        this.textField = a
    },
    /**
     * 
     * function getTextField()
     * @member mini.OutlookTree
     * @returns {String}
     *
     */
    getTextField : function() {
        return this.textField
    },
    /**
     * 
     * function setIconField(iconField)
     * @member mini.OutlookTree
     * @param {String} iconField
     *
     */
    setIconField : function(a) {
        this.iconField = a
    },
    /**
     * 
     * function getIconField()
     * @member mini.OutlookTree
     * @returns {String}
     *
     */
    getIconField : function() {
        return this.iconField
    },
    setUrlField : function(a) {
        this.urlField = a
    },
    getUrlField : function() {
        return this.urlField
    },
    /**
     * 
     * function setResultAsTree(resultAsTree)
     * @member mini.OutlookTree
     * @param {Boolean} resultAsTree
     *
     */
    setResultAsTree : function(a) {
        this.resultAsTree = a
    },
    /**
     * 
     * function getResultAsTree()
     * @member mini.OutlookTree
     * @returns {Boolean}
     *
     */
    getResultAsTree : function() {
        return this.resultAsTree
    },
    setNodesField : function(a) {
        this.nodesField = a
    },
    getNodesField : function() {
        return this.nodesField
    },
    /**
     * 
     * function setIdField(idField)
     * @member mini.OutlookTree
     * @param {String} idField
     *
     */
    setIdField : function(a) {
        this.idField = a
    },
    /**
     * 
     * function getIdField()
     * @member mini.OutlookTree
     * @returns {String}
     *
     */
    getIdField : function() {
        return this.idField
    },
    /**
     * 
     * function setParentField(parentField)
     * @member mini.OutlookTree
     * @param {String} parentField
     *
     */
    setParentField : function(a) {
        this.parentField = a
    },
    /**
     * 
     * function getParentField()
     * @member mini.OutlookTree
     * @returns {String}
     *
     */
    getParentField : function() {
        return this.parentField
    },
    _selected : null,
    /**
     * 获取选中节点。<br/>
     * function getSelected()
     * @member mini.OutlookTree
     *
     */
    getSelected : function() {
        return this._selected
    },
    isSelectedNode : function(b) {
        b = this.getNode(b);
        if (!b) {
            return false
        }
        var a = this._getOwnerTree(b);
        if (!a) {
            return false
        }
        return a.isSelectedNode(b)
    },
    /**
     * 选中节点<br/>
     * function selectNode(node)
     * @member mini.OutlookTree
     * @param  node
     *
     */
    selectNode : function(b) {
        b = this.getNode(b);
        if (!b) {
            return
        }
        var a = this._getOwnerTree(b);
        a.selectNode(b)
    },
    /**
     * 展开节点路径<br/>
     * function expandPath(node)
     * @member mini.OutlookTree
     * @param  node
     *
     */
    expandPath : function(b) {
        b = this.getNode(b);
        if (!b) {
            return
        }
        var a = this._getOwnerTree(b);
        a.expandPath(b);
        this.expandGroup(a._ownerGroup)
    },
    findNodes : function(f, e) {
        var c = [];
        e = e || this;
        for (var d = 0, b = this._trees.length; d < b; d++) {
            var a = this._trees[d];
            var g = a.findNodes(f, e);
            c.addRange(g)
        }
        return c
    },
    /**
     * 根据值获取节点对象<br/>
     * function getNode(value)
     * @member mini.OutlookTree
     * @param  value
     *
     */
    getNode : function(d) {
        for (var c = 0, b = this._trees.length; c < b; c++) {
            var a = this._trees[c];
            var e = a.getNode(d);
            if (e) {
                return e
            }
        }
        return null
    },
    getList : function() {
        var e = [];
        for (var d = 0, b = this._trees.length; d < b; d++) {
            var a = this._trees[d];
            var c = a.getList();
            e.addRange(c)
        }
        return e
    },
    _getOwnerTree : function(d) {
        if (!d) {
            return
        }
        for (var c = 0, b = this._trees.length; c < b; c++) {
            var a = this._trees[c];
            if (a.getby_id(d._id)) {
                return a
            }
        }
    },
    expandOnLoad : false,
    /**
     * 
     * function setExpandOnLoad(expandOnLoad)
     * @member mini.OutlookTree
     * @param {Boolean} expandOnLoad
     *
     */
    setExpandOnLoad : function(a) {
        this.expandOnLoad = a
    },
    /**
     * 
     * function getExpandOnLoad()
     * @member mini.OutlookTree
     * @returns {Boolean}
     *
     */
    getExpandOnLoad : function() {
        return this.expandOnLoad
    },
    showArrow : false,
    setShowArrow : function(a) {
        this.showArrow = a
    },
    getShowArrow : function() {
        return this.showArrow
    },
    _handlerTree : function(b) {
        b.tree = b.sender;
        b.sender = this;
        var a = "node" + b.type;
        if (b.type.indexOf("before") == 0) {
            a = "beforenode" + b.type.replace("before", "")
        }
        this.fire(a, b)
    },
    getAttrs : function(b) {
        var a = mini.OutlookTree.superclass.getAttrs.call(this, b);
        a.text = b.innerHTML;
        mini._ParseString(b, a, [ "url", "textField", "urlField", "idField",
                "parentField", "nodesField", "iconField", "onnodeclick",
                "onnodeselect", "onnodemousedown", "ondrawnode",
                "expandOnLoad", "imgPath", "onbeforenodeexpand",
                "onnodeexpand", "onbeforenodecollapse", "onnodecollapse" ]);
        mini._ParseBool(b, a, [ "resultAsTree", "showArrow" ]);
        if (a.expandOnLoad) {
            var c = parseInt(a.expandOnLoad);
            if (mini.isNumber(c)) {
                a.expandOnLoad = c
            } else {
                a.expandOnLoad = a.expandOnLoad == "true" ? true : false
            }
        }
        return a
    },
    imgPath : "",
    setImgPath : function(a) {
        this.imgPath = a
    },
    getImgPath : function() {
        return this.imgPath
    },
    autoCollapse : true,
    activeIndex : 0,
    createNavBarTree : function(b) {
        this._destroyTrees();
        var f = this;
        if (!mini.isArray(b)) {
            b = []
        }
        this.data = b;
        var a = [];
        for (var d = 0, c = this.data.length; d < c; d++) {
            var h = this.data[d];
            var g = {};
            g.title = h.text;
            g.iconCls = h.iconCls;
            a.push(g);
            g._children = h[this.nodesField]
        }
        this.setGroups(a);
        this.setActiveIndex(this.activeIndex);
        this._trees = [];
        for (var d = 0, c = this.groups.length; d < c; d++) {
            var g = this.groups[d];
            var e = this.getGroupBodyEl(g);
            var b = new mini.Tree();
            b.set({
                showArrow : this.showArrow,
                imgPath : this.imgPath,
                idField : this.idField,
                parentField : this.parentField,
                textField : this.textField,
                expandOnLoad : this.expandOnLoad,
                showTreeIcon : true,
                style : "width:100%;height:100%;border:0;background:none",
                data : g._children,
                onbeforeload : function(i) {
                    i.url = f.url
                }
            });
            b.render(e);
            b.on("nodeclick", this.__OnNodeClick, this);
            b.on("nodeselect", this.__OnNodeSelect, this);
            b.on("nodemousedown", this.__OnNodeMouseDown, this);
            b.on("drawnode", this.__OnDrawNode, this);
            b.on("beforeexpand", this._handlerTree, this);
            b.on("beforecollapse", this._handlerTree, this);
            b.on("expand", this._handlerTree, this);
            b.on("collapse", this._handlerTree, this);
            this._trees.push(b);
            delete g._children;
            b._ownerGroup = g
        }
    },
    __OnNodeMouseDown : function(b) {
        var a = {
            node : b.node,
            isLeaf : b.sender.isLeaf(b.node),
            htmlEvent : b.htmlEvent
        };
        this.fire("nodemousedown", a)
    },
    __OnNodeClick : function(b) {
        var a = {
            node : b.node,
            isLeaf : b.sender.isLeaf(b.node),
            htmlEvent : b.htmlEvent
        };
        this.fire("nodeclick", a)
    },
    __OnNodeSelect : function(f) {
        if (!f.node) {
            return
        }
        for (var c = 0, b = this._trees.length; c < b; c++) {
            var a = this._trees[c];
            if (a != f.sender) {
                a.selectNode(null)
            }
        }
        var d = {
            node : f.node,
            isLeaf : f.sender.isLeaf(f.node),
            htmlEvent : f.htmlEvent
        };
        this._selected = f.node;
        this.fire("nodeselect", d)
    },
    __OnDrawNode : function(a) {
        this.fire("drawnode", a)
    }
});
mini.regClass(mini.OutlookTree, "outlooktree");


mini.NavBarTree = function() {
    mini.NavBarTree.superclass.constructor.call(this)
};
mini.extend(mini.NavBarTree, mini.OutlookTree, {
    uiCls : "mini-navbartree"
});
mini.regClass(mini.NavBarTree, "navbartree");