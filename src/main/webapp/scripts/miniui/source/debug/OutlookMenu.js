/**
 * Outlook风格菜单导航控件。
 * @class
 * @extends mini.OutlookBar
 * @constructor
 */
mini.OutlookMenu = function() {
    mini.OutlookMenu.superclass.constructor.call(this);
    this.data = []
};
mini.extend(mini.OutlookMenu, mini.OutlookBar, {
    url : "",
    textField : "text",
    iconField : "iconCls",
    urlField : "url",
    resultAsTree : false,
    itemsField : "children",
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
        if (mini.isNumber(a)) {
            this.activeIndex = a
        }
        mini.OutlookMenu.superclass.set.call(this, c);
        if (b) {
            this.setUrl(b)
        }
        if (mini.isNumber(a)) {
            this.setActiveIndex(a)
        }
        return this
    },
    uiCls : "mini-outlookmenu",
    destroy : function(a) {
        this._destroyTrees();
        mini.OutlookMenu.superclass.destroy.call(this, a)
    },
    _destroyTrees : function() {
        if (this._menus) {
            var c = this._menus.clone();
            for (var b = 0, a = c.length; b < a; b++) {
                var d = c[b];
                d.destroy()
            }
            this._menus.length = 0
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
            a = mini.arrayToTree(a, this.itemsField, this.idField,
                    this.parentField)
        }
        var c = mini.treeToArray(a, this.itemsField, this.idField,
                this.parentField);
        this._doParseFields(c);
        this.createNavBarMenu(a);
        this.fire("load")
    },
    /**
     * 加载列表数据。比如：tree.loadList(list, "id", "pid")<br/>
     * function loadList(Array, idField, parentField)
     * @member mini.OutlookMenu
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
     * @member mini.OutlookMenu
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
            this.createNavBarMenu(b)
        }
    },
    setData : function(a) {
        this.load(a)
    },
    /**
     * 
     * function setUrl(url)
     * @member mini.OutlookMenu
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
     * @member mini.OutlookMenu
     * @returns {String}
     *
     */
    getUrl : function() {
        return this.url
    },
    /**
     * 
     * function setTextField(textField)
     * @member mini.OutlookMenu
     * @param {String} textField
     *
     */
    setTextField : function(a) {
        this.textField = a
    },
    /**
     * 
     * function getTextField()
     * @member mini.OutlookMenu
     * @returns {String}
     *
     */
    getTextField : function() {
        return this.textField
    },
    /**
     * 
     * function setIconField(iconField)
     * @member mini.OutlookMenu
     * @param {String} iconField
     *
     */
    setIconField : function(a) {
        this.iconField = a
    },
    /**
     * 
     * function getIconField()
     * @member mini.OutlookMenu
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
     * @member mini.OutlookMenu
     * @param {Boolean} resultAsTree
     *
     */
    setResultAsTree : function(a) {
        this.resultAsTree = a
    },
    /**
     * 
     * function getResultAsTree()
     * @member mini.OutlookMenu
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
     * @member mini.OutlookMenu
     * @param {String} idField
     *
     */
    setIdField : function(a) {
        this.idField = a
    },
    /**
     * 
     * function getIdField()
     * @member mini.OutlookMenu
     * @returns {String}
     *
     */
    getIdField : function() {
        return this.idField
    },
    /**
     * 
     * function setParentField(parentField)
     * @member mini.OutlookMenu
     * @param {String} parentField
     *
     */
    setParentField : function(a) {
        this.parentField = a
    },
    /**
     * 
     * function getParentField()
     * @member mini.OutlookMenu
     * @returns {String}
     *
     */
    getParentField : function() {
        return this.parentField
    },
    _selected : null,
    /**
     * 获取选中项。<br/>
     * function getSelected()
     * @member mini.OutlookMenu
     *
     */
    getSelected : function() {
        return this._selected
    },
    /**
     * 选中节点<br/>
     * function selectNode(node)
     * @member mini.OutlookMenu
     * @param  node
     *
     */
    selectNode : function(a) {
        a = this.getNode(a);
        if (!a) {
            if (this._selected) {
                var b = this._getOwnerMenu(this._selected);
                if (b) {
                    b.setSelectedItem(null)
                }
            }
            return
        }
        var b = this._getOwnerMenu(a);
        if (!b) {
            return
        }
        this.expandGroup(b._ownerGroup);
        setTimeout(function() {
            try {
                b.setSelectedItem(a)
            } catch (c) {
            }
        }, 100)
    },
    findNodes : function(h, n) {
        var a = [];
        n = n || this;
        for (var f = 0, c = this._menus.length; f < c; f++) {
            var g = this._menus[f].getItems();
            var b = [];
            for (var e = 0, d = g.length; e < d; e++) {
                var m = g[e];
                if (h && h.call(n, m) === true) {
                    b.push(m)
                }
            }
            a.addRange(b)
        }
        return a
    },
    getNode : function(c) {
        for (var b = 0, a = this._menus.length; b < a; b++) {
            var d = this._menus[b];
            var e = d.getItem(c);
            if (e) {
                return e
            }
        }
        return null
    },
    getList : function() {
        var d = [];
        for (var c = 0, a = this._menus.length; c < a; c++) {
            var e = this._menus[c];
            var b = e.getItems();
            d.addRange(b)
        }
        return d
    },
    _getOwnerMenu : function(c) {
        if (!c) {
            return
        }
        for (var b = 0, a = this._menus.length; b < a; b++) {
            var d = this._menus[b];
            var e = d.getItem(c);
            if (e) {
                return d
            }
        }
    },
    getAttrs : function(b) {
        var a = mini.OutlookMenu.superclass.getAttrs.call(this, b);
        a.text = b.innerHTML;
        mini._ParseString(b, a, [ "url", "textField", "urlField", "idField",
                "parentField", "itemsField", "iconField", "onitemclick",
                "onitemselect", "ondrawnode", "imgPath" ]);
        mini._ParseBool(b, a, [ "resultAsTree" ]);
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
    createNavBarMenu : function(b) {
        this._destroyTrees();
        if (!mini.isArray(b)) {
            b = []
        }
        this.data = b;
        var a = [];
        for (var d = 0, c = this.data.length; d < c; d++) {
            var h = this.data[d];
            var f = {};
            f.title = h.text;
            f.iconCls = h.iconCls;
            a.push(f);
            f._children = h[this.itemsField]
        }
        this.setGroups(a);
        this.setActiveIndex(this.activeIndex);
        this._menus = [];
        for (var d = 0, c = this.groups.length; d < c; d++) {
            var f = this.groups[d];
            var e = this.getGroupBodyEl(f);
            var g = new mini.Menu();
            g._ownerGroup = f;
            g.set({
                expanded : false,
                imgPath : this.imgPath,
                showNavArrow : false,
                style : "width:100%;height:100%;border:0;background:none",
                borderStyle : "border:0",
                allowSelectItem : true,
                items : f._children
            });
            g.render(e);
            g.on("itemclick", this.__OnItemClick, this);
            g.on("itemselect", this.__OnItemSelect, this);
            this._onDrawNodes(g.getItems());
            this._menus.push(g);
            delete f._children
        }
    },
    _onDrawNodes : function(b) {
        if (!b) {
            return
        }
        for (var c = 0, a = b.length; c < a; c++) {
            var d = b[c];
            var f = {
                node : d,
                img : d.img,
                nodeHtml : ""
            };
            this.fire("drawnode", f);
            if (f.img != d.img && d.setImg) {
                d.setImg(f.img)
            }
            if (f.nodeHtml != "") {
                d.setText(f.nodeHtml)
            }
        }
    },
    __OnItemClick : function(b) {
        var a = {
            item : b.item,
            htmlEvent : b.htmlEvent
        };
        this.fire("itemclick", a)
    },
    __OnItemSelect : function(d) {
        if (!d.item) {
            return
        }
        for (var b = 0, a = this._menus.length; b < a; b++) {
            var f = this._menus[b];
            if (f != d.sender) {
                f.setSelectedItem(null)
            }
        }
        var c = {
            item : d.item,
            htmlEvent : d.htmlEvent
        };
        this._selected = d.item;
        this.fire("itemselect", c)
    }
});
mini.regClass(mini.OutlookMenu, "outlookmenu");


mini.NavBarMenu = function() {
    mini.NavBarMenu.superclass.constructor.call(this)
};
mini.extend(mini.NavBarMenu, mini.OutlookMenu, {
    uiCls : "mini-navbarmenu"
});
mini.regClass(mini.NavBarMenu, "navbarmenu");