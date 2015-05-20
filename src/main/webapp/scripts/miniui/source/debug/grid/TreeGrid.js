mini.TreeGrid = function() {
    mini.TreeGrid.superclass.constructor.call(this);
    mini.addClass(this.el, "mini-tree");
    this.setAjaxAsync(false);
    this.setAutoLoad(true);
    if (this.showTreeLines == true) {
        mini.addClass(this.el, "mini-tree-treeLine")
    }
    this._AsyncLoader = new mini._Tree_AsyncLoader(this);
    this._Expander = new mini._Tree_Expander(this)
};
mini.copyTo(mini.TreeGrid.prototype, mini._DataTreeApplys);
mini
        .extend(
                mini.TreeGrid,
                mini.DataGrid,
                {
                    isTree : true,
                    uiCls : "mini-treegrid",
                    showPager : false,
                    showNewRow : false,
                    showCheckBox : false,
                    showRadioButton : false,
                    showTreeIcon : true,
                    showExpandButtons : true,
                    showTreeLines : false,
                    showArrow : false,
                    expandOnDblClick : true,
                    expandOnNodeClick : false,
                    loadOnExpand : true,
                    _checkBoxType : "checkbox",
                    iconField : "iconCls",
                    _treeColumn : null,
                    leafIconCls : "mini-tree-leaf",
                    folderIconCls : "mini-tree-folder",
                    fixedRowHeight : false,
                    _checkBoxCls : "mini-tree-checkbox",
                    _expandNodeCls : "mini-tree-expand",
                    _collapseNodeCls : "mini-tree-collapse",
                    _eciconCls : "mini-tree-node-ecicon",
                    _inNodeCls : "mini-tree-nodeshow",
                    indexOf : function(a) {
                        return this._dataSource.indexOfList(a)
                    },
                    _getDragText : function(a) {
                        return "Nodes " + a.length
                    },
                    _initEvents : function() {
                        mini.TreeGrid.superclass._initEvents.call(this);
                        this.on("nodedblclick", this.__OnNodeDblClick, this);
                        this.on("nodeclick", this.__OnNodeClick, this);
                        this.on("cellclick", function(a) {
                            a.node = a.record;
                            a.isLeaf = this.isLeaf(a.node);
                            this.fire("nodeclick", a)
                        }, this);
                        this.on("cellmousedown", function(a) {
                            a.node = a.record;
                            a.isLeaf = this.isLeaf(a.node);
                            this.fire("nodemousedown", a)
                        }, this);
                        this.on("celldblclick", function(a) {
                            a.node = a.record;
                            a.isLeaf = this.isLeaf(a.node);
                            this.fire("nodedblclick", a)
                        }, this);
                        this.on("beforerowselect", function(a) {
                            a.node = a.selected;
                            a.isLeaf = this.isLeaf(a.node);
                            this.fire("beforenodeselect", a)
                        }, this);
                        this.on("rowselect", function(a) {
                            a.node = a.selected;
                            a.isLeaf = this.isLeaf(a.node);
                            this.fire("nodeselect", a)
                        }, this)
                    },
                    setValue : function(d, b) {
                        if (mini.isNull(d)) {
                            d = ""
                        }
                        d = String(d);
                        if (this.getValue() != d) {
                            var a = this.getCheckedNodes();
                            this.uncheckNodes(a);
                            this.value = d;
                            if (this.showCheckBox) {
                                var c = String(d).split(",");
                                this._dataSource.doCheckNodes(c, true,
                                        b !== false)
                            } else {
                                this.selectNode(d, false)
                            }
                        }
                    },
                    getValue : function(a) {
                        if (this.showCheckBox) {
                            if (a === false) {
                                a = "leaf"
                            }
                            return this._dataSource.getCheckedNodesId(a)
                        } else {
                            return this._dataSource.getSelectedsId()
                        }
                    },
                    getText : function() {
                        var c = [];
                        if (this.showCheckBox) {
                            c = this.getCheckedNodes()
                        } else {
                            var e = this.getSelectedNode();
                            if (e) {
                                c.push(e)
                            }
                        }
                        var f = [], b = this.getTextField();
                        for (var d = 0, a = c.length; d < a; d++) {
                            var e = c[d];
                            f.push(e[b])
                        }
                        return f.join(",")
                    },
                    isGrouping : function() {
                        return false
                    },
                    _createSource : function() {
                        this._dataSource = new mini.DataTree()
                    },
                    _bindSource : function() {
                        mini.TreeGrid.superclass._bindSource.call(this);
                        var a = this._dataSource;
                        a.on("expand", this.__OnTreeExpand, this);
                        a.on("collapse", this.__OnTreeCollapse, this);
                        a.on("checkchanged", this.__OnCheckChanged, this);
                        a.on("addnode", this.__OnSourceAddNode, this);
                        a.on("removenode", this.__OnSourceRemoveNode, this);
                        a.on("movenode", this.__OnSourceMoveNode, this);
                        a.on("beforeloadnode", this.__OnBeforeLoadNode, this);
                        a.on("loadnode", this.__OnLoadNode, this)
                    },
                    __OnBeforeLoadNode : function(a) {
                        this.__showLoading = this.showLoading;
                        this.showLoading = false;
                        this.addNodeCls(a.node, "mini-tree-loading");
                        this.fire("beforeloadnode", a)
                    },
                    __OnLoadNode : function(a) {
                        this.showLoading = this.__showLoading;
                        this.removeNodeCls(a.node, "mini-tree-loading");
                        this.fire("loadnode", a)
                    },
                    _virtualUpdate : function() {
                        var a = this;
                        if (a._updateNodeTimer) {
                            clearTimeout(a._updateNodeTimer);
                            a._updateNodeTimer = null
                        }
                        a._updateNodeTimer = setTimeout(function() {
                            a._updateNodeTimer = null;
                            a.doUpdateRows();
                            a.deferLayout(50)
                        }, 5)
                    },
                    __OnSourceAddNode : function(b) {
                        var a = new Date();
                        if (this.isVirtualScroll() == true) {
                            this._virtualUpdate()
                        } else {
                            this._doAddNodeEl(b.node)
                        }
                        this.fire("addnode", b)
                    },
                    __OnSourceRemoveNode : function(c) {
                        if (this.isVirtualScroll() == true) {
                            this._virtualUpdate()
                        } else {
                            this._doRemoveNodeEl(c.node);
                            var a = this.getParentNode(c.node);
                            var b = this.getChildNodes(a);
                            if (b.length == 0) {
                                this._doUpdateTreeNodeEl(a)
                            }
                        }
                        this.fire("removenode", c)
                    },
                    __OnSourceMoveNode : function(a) {
                        this._doMoveNodeEl(a.node);
                        this.fire("movenode", a)
                    },
                    _doAddNodeEl : function(c) {
                        var g = this.getFrozenColumns();
                        var e = this.getUnFrozenColumns();
                        var a = this.getParentNode(c);
                        var f = this.indexOf(c);
                        var b = false;
                        function d(m, k, j) {
                            var l = this._createRowHTML(m, f, k, j);
                            var i = this.indexOfNode(m) + 1;
                            var n = this.getChildNodeAt(i, a);
                            if (n) {
                                var o = this._getNodeEl(n, j);
                                jQuery(o).before(l)
                            } else {
                                var h = this._getNodesEl(a, j);
                                if (h) {
                                    mini.append(h.firstChild, l)
                                } else {
                                    b = true
                                }
                            }
                        }
                        d.call(this, c, e, 2);
                        d.call(this, c, g, 1);
                        if (b) {
                            this._doUpdateTreeNodeEl(a)
                        }
                    },
                    _doRemoveNodeEl : function(c) {
                        this._doRemoveRowEl(c);
                        var a = this._getNodesEl(c, 1);
                        var b = this._getNodesEl(c, 2);
                        if (a) {
                            a.parentNode.removeChild(a)
                        }
                        if (b) {
                            b.parentNode.removeChild(b)
                        }
                    },
                    _doMoveNodeEl : function(b) {
                        this._doRemoveNodeEl(b);
                        var a = this.getParentNode(b);
                        this._doUpdateTreeNodeEl(a)
                    },
                    _doUpdateNodeTitle : function(a) {
                        this._doUpdateTreeNodeEl(a, false)
                    },
                    _doUpdateTreeNodeEl : function(e, f) {
                        f = f !== false;
                        var d = this.getRootNode();
                        if (d == e) {
                            this.doUpdate();
                            return
                        }
                        if (!this.isVisibleNode(e)) {
                            return
                        }
                        var l = e;
                        var a = this.getFrozenColumns();
                        var c = this.getUnFrozenColumns();
                        var j = this._createNodeHTML(e, a, 1, null, f);
                        var h = this._createNodeHTML(e, c, 2, null, f);
                        var o = this._getNodeEl(e, 1);
                        var m = this._getNodeEl(e, 2);
                        var k = this._getNodesTr(e, 1);
                        var i = this._getNodesTr(e, 2);
                        var p = this._getRowDetailEl(e, 1);
                        var n = this._getRowDetailEl(e, 2);
                        var g = mini.createElements(j);
                        var e = g[0];
                        var b = g[1];
                        if (o) {
                            mini.before(o, e);
                            if (f) {
                                if (p) {
                                    mini.after(p, b)
                                } else {
                                    mini.before(o, b)
                                }
                            }
                            mini.removeNode(o);
                            if (f) {
                                mini.removeNode(k)
                            }
                        }
                        var g = mini.createElements(h);
                        var e = g[0];
                        var b = g[1];
                        if (m) {
                            mini.before(m, e);
                            if (f) {
                                if (n) {
                                    mini.after(n, b)
                                } else {
                                    mini.before(m, b)
                                }
                            }
                            mini.removeNode(m);
                            if (f) {
                                mini.removeNode(i)
                            }
                        }
                        if (e.checked != true && !this.isLeaf(e)) {
                            this._doCheckNodeEl(l)
                        }
                    },
                    addNodeCls : function(b, a) {
                        this.addRowCls(b, a)
                    },
                    removeNodeCls : function(b, a) {
                        this.removeRowCls(b, a)
                    },
                    doUpdate : function() {
                        mini.TreeGrid.superclass.doUpdate
                                .apply(this, arguments)
                    },
                    setData : function(a) {
                        if (!a) {
                            a = []
                        }
                        this._dataSource.setData(a)
                    },
                    loadList : function(c, b, d) {
                        b = b || this.getIdField();
                        d = d || this.getParentField();
                        var a = mini.listToTree(c, this.getNodesField(), b, d);
                        this.setData(a)
                    },
                    _createDrawCellEvent : function(a, c, f, b) {
                        var d = mini.TreeGrid.superclass._createDrawCellEvent
                                .call(this, a, c, f, b);
                        d.node = d.record;
                        d.isLeaf = this.isLeaf(d.node);
                        if (this._treeColumn && this._treeColumn == c.name) {
                            d.isTreeCell = true;
                            d.img = a[this.imgField];
                            d.iconCls = this._getNodeIcon(a);
                            d.nodeCls = "";
                            d.nodeStyle = "";
                            d.nodeHtml = "";
                            d.showTreeIcon = this.showTreeIcon;
                            d.checkBoxType = this._checkBoxType;
                            d.showCheckBox = this.showCheckBox;
                            d.showRadioButton = this.showRadioButton;
                            if (d.showCheckBox && !d.isLeaf) {
                                d.showCheckBox = this.showFolderCheckBox
                            }
                            if (d.showRadioButton && !d.isLeaf) {
                                d.showRadioButton = this.showFolderCheckBox
                            }
                            d.checkable = this.getCheckable(d.node)
                        }
                        return d
                    },
                    _OnDrawCell : function(a, c, f, b) {
                        var d = mini.TreeGrid.superclass._OnDrawCell.call(this,
                                a, c, f, b);
                        if (this._treeColumn && this._treeColumn == c.name) {
                            this.fire("drawnode", d);
                            if (d.nodeStyle) {
                                d.cellStyle = d.nodeStyle
                            }
                            if (d.nodeCls) {
                                d.cellCls = d.nodeCls
                            }
                            if (d.nodeHtml) {
                                d.cellHtml = d.nodeHtml
                            }
                            this._createTreeColumn(d)
                        }
                        return d
                    },
                    _isViewFirstNode : function(b) {
                        if (this._viewNodes) {
                            var c = this.getParentNode(b);
                            var a = this._getViewChildNodes(c);
                            return a[0] === b
                        } else {
                            return this.isFirstNode(b)
                        }
                    },
                    _isViewLastNode : function(b) {
                        if (this._viewNodes) {
                            var c = this.getParentNode(b);
                            var a = this._getViewChildNodes(c);
                            return a[a.length - 1] === b
                        } else {
                            return this.isLastNode(b)
                        }
                    },
                    _isInViewLastNode : function(f, h) {
                        if (this._viewNodes) {
                            var g = null;
                            var d = this.getAncestors(f);
                            for (var e = 0, c = d.length; e < c; e++) {
                                var b = d[e];
                                if (this.getLevel(b) == h) {
                                    g = b
                                }
                            }
                            if (!g || g == this.root) {
                                return false
                            }
                            return this._isViewLastNode(g)
                        } else {
                            return this.isInLastNode(f, h)
                        }
                    },
                    isInLastNode : function(f, h) {
                        var g = null;
                        var d = this.getAncestors(f);
                        for (var e = 0, c = d.length; e < c; e++) {
                            var b = d[e];
                            if (this.getLevel(b) == h) {
                                g = b
                            }
                        }
                        if (!g || g == this.root) {
                            return false
                        }
                        return this.isLastNode(g)
                    },
                    _createNodeTitle : function(q, b, t) {
                        var f = !b;
                        if (!b) {
                            b = []
                        }
                        var u = this.isLeaf(q);
                        var a = this.getLevel(q);
                        var c = t.nodeCls;
                        if (!u) {
                            c = this.isExpandedNode(q) ? this._expandNodeCls
                                    : this._collapseNodeCls
                        }
                        if (q.enabled === false) {
                            c += " mini-disabled"
                        }
                        if (!u) {
                            c += " mini-tree-parentNode"
                        }
                        var d = this.getChildNodes(q);
                        var r = d && d.length > 0;
                        b[b.length] = '<div class="mini-tree-nodetitle ' + c
                                + '" style="' + t.nodeStyle + '">';
                        var h = this.getParentNode(q);
                        var m = 0;
                        for (var s = m; s <= a; s++) {
                            if (s == a) {
                                continue
                            }
                            if (u) {
                                if (s > a - 1) {
                                    continue
                                }
                            }
                            var k = "";
                            if (this._isInViewLastNode(q, s)) {
                                k = "background:none"
                            }
                            b[b.length] = '<span class="mini-tree-indent " style="'
                                    + k + '"></span>'
                        }
                        var l = "";
                        if (this._isViewFirstNode(q) && a == 0) {
                            l = "mini-tree-node-ecicon-first"
                        } else {
                            if (this._isViewLastNode(q)) {
                                l = "mini-tree-node-ecicon-last"
                            }
                        }
                        if (this._isViewFirstNode(q) && this._isViewLastNode(q)) {
                            l = "mini-tree-node-ecicon-last";
                            if (h == this.root) {
                                l = "mini-tree-node-ecicon-firstLast"
                            }
                        }
                        if (!u) {
                            b[b.length] = '<a class="'
                                    + this._eciconCls
                                    + " "
                                    + l
                                    + '" style="'
                                    + (this.showExpandButtons ? ""
                                            : "display:none")
                                    + '" href="javascript:void(0);" onclick="return false;" hidefocus></a>'
                        } else {
                            b[b.length] = '<span class="'
                                    + this._eciconCls
                                    + " "
                                    + l
                                    + '" style="'
                                    + (this.showExpandButtons ? ""
                                            : "display:none") + '"></span>'
                        }
                        b[b.length] = '<span class="mini-tree-nodeshow">';
                        if (t.showTreeIcon) {
                            if (t.img) {
                                var v = this.imgPath + t.img;
                                b[b.length] = '<span class="mini-tree-icon" style="background-image:url('
                                        + v + ');"></span>'
                            } else {
                                b[b.length] = '<span class="' + t.iconCls
                                        + ' mini-tree-icon"></span>'
                            }
                        }
                        if (t.showRadioButton && !t.showCheckBox) {
                            b[b.length] = '<span class="mini-tree-radio" ></span>'
                        }
                        if (t.showCheckBox) {
                            var o = this._createCheckNodeId(q);
                            var g = this.isCheckedNode(q);
                            var j = t.enabled === false ? "disabled" : "";
                            if (t.enabled !== false) {
                                j = t.checkable === false ? "disabled" : ""
                            }
                            b[b.length] = '<input type="checkbox" id="' + o
                                    + '" class="' + this._checkBoxCls
                                    + '" hidefocus ' + (g ? "checked" : "")
                                    + " " + (j) + ' onclick="return false;"/>'
                        }
                        b[b.length] = '<span class="mini-tree-nodetext">';
                        if (this._editingNode == q) {
                            var p = this._id + "$edit$" + q._id;
                            var n = t.value;
                            b[b.length] = '<input id="'
                                    + p
                                    + '" type="text" class="mini-tree-editinput" value="'
                                    + n + '"/>'
                        } else {
                            b[b.length] = t.cellHtml
                        }
                        b[b.length] = "</span>";
                        b[b.length] = "</span>";
                        b[b.length] = "</div>";
                        if (f) {
                            return b.join("")
                        }
                    },
                    _createTreeColumn : function(f) {
                        var d = f.record, c = f.column;
                        f.headerCls += " mini-tree-treecolumn";
                        f.cellCls += " mini-tree-treecell";
                        f.cellStyle += ";padding:0;";
                        var a = this.isLeaf(d);
                        f.cellHtml = this._createNodeTitle(d, null, f);
                        if (d.checked != true && !a) {
                            var b = this.getCheckState(d);
                            if (b == "indeterminate") {
                                this._renderCheckState(d)
                            }
                        }
                    },
                    _createCheckNodeId : function(a) {
                        return this._id + "$checkbox$" + a._id
                    },
                    _renderCheckState : function(b) {
                        if (!this._renderCheckStateNodes) {
                            this._renderCheckStateNodes = []
                        }
                        this._renderCheckStateNodes.push(b);
                        if (this._renderCheckStateTimer) {
                            return
                        }
                        var a = this;
                        this._renderCheckStateTimer = setTimeout(function() {
                            a._renderCheckStateTimer = null;
                            var d = a._renderCheckStateNodes;
                            a._renderCheckStateNodes = null;
                            for (var e = 0, c = d.length; e < c; e++) {
                                a._doCheckNodeEl(d[e])
                            }
                        }, 1)
                    },
                    _createNodeHTML : function(c, e, m, j, d) {
                        var i = !j;
                        if (!j) {
                            j = []
                        }
                        var a = this._dataSource;
                        var k = a.getDataView().indexOf(c);
                        this._createRowHTML(c, k, e, m, j);
                        if (d !== false) {
                            var h = a.getChildNodes(c);
                            var g = this.isVisibleNode(c);
                            if (h && h.length > 0) {
                                var f = this.isExpandedNode(c);
                                if (f == true) {
                                    var b = (f && g) ? "" : "display:none";
                                    var l = this._createNodesId(c, m);
                                    j[j.length] = '<tr class="mini-tree-nodes-tr" style="';
                                    if (mini.isIE) {
                                        j[j.length] = b
                                    }
                                    j[j.length] = '" ><td class="mini-tree-nodes-td" colspan="';
                                    j[j.length] = e.length;
                                    j[j.length] = '" >';
                                    j[j.length] = '<div class="mini-tree-nodes" id="';
                                    j[j.length] = l;
                                    j[j.length] = '" style="';
                                    j[j.length] = b;
                                    j[j.length] = '">';
                                    this._createNodesHTML(h, e, m, j);
                                    j[j.length] = "</div>";
                                    j[j.length] = "</td></tr>"
                                }
                            }
                        }
                        if (i) {
                            return j.join("")
                        }
                    },
                    _createNodesHTML : function(c, f, e, h) {
                        if (!c) {
                            return ""
                        }
                        var a = !h;
                        if (!h) {
                            h = []
                        }
                        h
                                .push('<table class="mini-grid-table" cellspacing="0" cellpadding="0" border="0">');
                        h.push(this._createTopRowHTML(f));
                        if (f.length > 0) {
                            for (var d = 0, b = c.length; d < b; d++) {
                                var g = c[d];
                                this._createNodeHTML(g, f, e, h)
                            }
                        }
                        h.push("</table>");
                        if (a) {
                            return h.join("")
                        }
                    },
                    _createRowsHTML : function(e, d) {
                        if (this.isVirtualScroll()) {
                            return mini.TreeGrid.superclass._createRowsHTML
                                    .apply(this, arguments)
                        }
                        var g = this._dataSource, f = this;
                        var h = [];
                        var c = [];
                        var b = g.getRootNode();
                        if (this._useEmptyView !== true) {
                            c = g.getChildNodes(b)
                        }
                        var a = d == 2 ? this._rowsViewEl.firstChild
                                : this._rowsLockEl.firstChild;
                        a.id = this._createNodesId(b, d);
                        this._createNodesHTML(c, e, d, h);
                        return h.join("")
                    },
                    _createNodesId : function(b, a) {
                        var c = this._id + "$nodes" + a + "$" + b._id;
                        return c
                    },
                    _getNodeEl : function(b, a) {
                        return this._getRowEl(b, a)
                    },
                    _getNodesEl : function(b, a) {
                        b = this.getNode(b);
                        var c = this._createNodesId(b, a);
                        return document.getElementById(c)
                    },
                    _getNodesTr : function(c, a) {
                        var b = this._getNodesEl(c, a);
                        if (b) {
                            return b.parentNode.parentNode
                        }
                    },
                    setTreeColumn : function(a) {
                        this._treeColumn = a;
                        this.deferUpdate()
                    },
                    getTreeColumn : function() {
                        return this._treeColumn
                    },
                    setShowTreeIcon : function(a) {
                        this.showTreeIcon = a;
                        this.deferUpdate()
                    },
                    getShowTreeIcon : function() {
                        return this.showTreeIcon
                    },
                    setShowCheckBox : function(a) {
                        this.showCheckBox = a;
                        this.deferUpdate()
                    },
                    getShowCheckBox : function() {
                        return this.showCheckBox
                    },
                    setShowRadioButton : function(a) {
                        this.showRadioButton = a;
                        this.deferUpdate()
                    },
                    getShowRadioButton : function() {
                        return this.showRadioButton
                    },
                    setCheckBoxType : function(a) {
                        this._checkBoxType = a;
                        this._doUpdateCheckState()
                    },
                    getCheckBoxType : function() {
                        return this._checkBoxType
                    },
                    setIconsField : function(a) {
                        this._iconsField = a
                    },
                    getIconsField : function() {
                        return this._iconsField
                    },
                    _getNodeIcon : function(b) {
                        var a = b[this.iconField];
                        if (!a) {
                            if (this.isLeaf(b)) {
                                a = this.leafIconCls
                            } else {
                                a = this.folderIconCls
                            }
                        }
                        return a
                    },
                    _getCheckBoxEl : function(a) {
                        if (this.isVisibleNode(a) == false) {
                            return null
                        }
                        var b = this._id + "$checkbox$" + a._id;
                        return mini.byId(b, this.el)
                    },
                    useAnimation : true,
                    _updateNodeTimer : null,
                    _doExpandCollapseNode : function(f) {
                        var e = this;
                        if (e._updateNodeTimer) {
                            clearTimeout(e._updateNodeTimer);
                            e._updateNodeTimer = null
                        }
                        var d = new Date();
                        if (this.isVirtualScroll() == true) {
                            e._updateNodeTimer = setTimeout(function() {
                                e._updateNodeTimer = null;
                                e.doUpdateRows();
                                e.deferLayout(50)
                            }, 5);
                            return
                        }
                        function c() {
                            this._doUpdateTreeNodeEl(f);
                            this.deferLayout(20)
                        }
                        if (false || mini.isIE6 || !this.useAnimation) {
                            c.call(this)
                        } else {
                            var a = this.isExpandedNode(f);
                            function g(o, k, n) {
                                var i = this._getNodesEl(o, k);
                                if (i) {
                                    var l = mini.getHeight(i);
                                    i.style.overflow = "hidden";
                                    i.style.height = "0px";
                                    var j = {
                                        height : l + "px"
                                    };
                                    var m = this;
                                    m._inAniming = true;
                                    var p = jQuery(i);
                                    p.animate(j, 250, function() {
                                        i.style.height = "auto";
                                        m._inAniming = false;
                                        m.doLayout();
                                        mini.repaint(i)
                                    })
                                } else {
                                }
                            }
                            function b(o, k, n) {
                                var i = this._getNodesEl(o, k);
                                if (i) {
                                    var l = mini.getHeight(i);
                                    var j = {
                                        height : 0 + "px"
                                    };
                                    var m = this;
                                    m._inAniming = true;
                                    var p = jQuery(i);
                                    p.animate(j, 180, function() {
                                        i.style.height = "auto";
                                        m._inAniming = false;
                                        if (n) {
                                            n.call(m)
                                        }
                                        m.doLayout();
                                        mini.repaint(i)
                                    })
                                } else {
                                    if (n) {
                                        n.call(this)
                                    }
                                }
                            }
                            var e = this;
                            if (a) {
                                c.call(this);
                                g.call(this, f, 2);
                                g.call(this, f, 1)
                            } else {
                                b.call(this, f, 2, c);
                                b.call(this, f, 1)
                            }
                        }
                    },
                    __OnTreeCollapse : function(a) {
                        this._doExpandCollapseNode(a.node)
                    },
                    __OnTreeExpand : function(a) {
                        this._doExpandCollapseNode(a.node)
                    },
                    _doCheckNodeEl : function(d) {
                        var b = this._getCheckBoxEl(d);
                        if (b) {
                            var a = this.getCheckModel();
                            b.checked = d.checked;
                            b.indeterminate = false;
                            if (a == "cascade") {
                                var c = this.getCheckState(d);
                                if (c == "indeterminate") {
                                    b.indeterminate = true
                                } else {
                                    b.indeterminate = false
                                }
                            }
                        }
                    },
                    __OnCheckChanged : function(f) {
                        for (var b = 0, a = f._nodes.length; b < a; b++) {
                            var d = f._nodes[b];
                            this._doCheckNodeEl(d)
                        }
                        if (this._checkChangedTimer) {
                            clearTimeout(this._checkChangedTimer);
                            this._checkChangedTimer = null
                        }
                        var c = this;
                        this._checkChangedTimer = setTimeout(function() {
                            c._checkChangedTimer = null;
                            c.fire("checkchanged")
                        }, 1)
                    },
                    _tryToggleCheckNode : function(c) {
                        var a = this.getCheckable(c);
                        if (a == false) {
                            return
                        }
                        var b = this.isCheckedNode(c);
                        var d = {
                            node : c,
                            cancel : false,
                            checked : b,
                            isLeaf : this.isLeaf(c)
                        };
                        this.fire("beforenodecheck", d);
                        if (d.cancel) {
                            return
                        }
                        this._dataSource.doCheckNodes(c, !b, true);
                        this.fire("nodecheck", d)
                    },
                    _tryToggleNode : function(a) {
                        var c = this.isExpandedNode(a);
                        var b = {
                            node : a,
                            cancel : false
                        };
                        if (c) {
                            this.fire("beforecollapse", b);
                            if (b.cancel == true) {
                                return
                            }
                            this.collapseNode(a);
                            b.type = "collapse";
                            this.fire("collapse", b)
                        } else {
                            this.fire("beforeexpand", b);
                            if (b.cancel == true) {
                                return
                            }
                            this.expandNode(a);
                            b.type = "expand";
                            this.fire("expand", b)
                        }
                    },
                    _OnCellMouseDown : function(a) {
                        if (mini
                                .findParent(a.htmlEvent.target, this._eciconCls)) {
                        } else {
                            if (mini.findParent(a.htmlEvent.target,
                                    "mini-tree-checkbox")) {
                            } else {
                                this.fire("cellmousedown", a)
                            }
                        }
                    },
                    _OnCellClick : function(a) {
                        if (mini
                                .findParent(a.htmlEvent.target, this._eciconCls)) {
                            return
                        }
                        if (mini.findParent(a.htmlEvent.target,
                                "mini-tree-checkbox")) {
                            this._tryToggleCheckNode(a.record)
                        } else {
                            this.fire("cellclick", a)
                        }
                    },
                    __OnNodeDblClick : function(a) {
                    },
                    __OnNodeClick : function(a) {
                    },
                    setIconField : function(a) {
                        this.iconField = a
                    },
                    getIconField : function() {
                        return this.iconField
                    },
                    setAllowSelect : function(a) {
                        this.setAllowRowSelect(a)
                    },
                    getAllowSelect : function() {
                        return this.getAllowRowSelect()
                    },
                    setShowExpandButtons : function(a) {
                        if (this.showExpandButtons != a) {
                            this.showExpandButtons = a;
                            this.doUpdate()
                        }
                    },
                    getShowExpandButtons : function() {
                        return this.showExpandButtons
                    },
                    setShowTreeLines : function(a) {
                        this.showTreeLines = a;
                        if (a == true) {
                            mini.addClass(this.el, "mini-tree-treeLine")
                        } else {
                            mini.removeClass(this.el, "mini-tree-treeLine")
                        }
                    },
                    getShowTreeLines : function() {
                        return this.showTreeLines
                    },
                    setShowArrow : function(a) {
                        this.showArrow = a;
                        if (a == true) {
                            mini.addClass(this.el, "mini-tree-showArrows")
                        } else {
                            mini.removeClass(this.el, "mini-tree-showArrows")
                        }
                    },
                    getShowArrow : function() {
                        return this.showArrow
                    },
                    setLeafIcon : function(a) {
                        this.leafIcon = a
                    },
                    getLeafIcon : function() {
                        return this.leafIcon
                    },
                    setFolderIcon : function(a) {
                        this.folderIcon = a
                    },
                    getFolderIcon : function() {
                        return this.folderIcon
                    },
                    getExpandOnDblClick : function() {
                        return this.expandOnDblClick
                    },
                    setExpandOnNodeClick : function(a) {
                        this.expandOnNodeClick = a;
                        if (a) {
                            mini.addClass(this.el, "mini-tree-nodeclick")
                        } else {
                            mini.removeClass(this.el, "mini-tree-nodeclick")
                        }
                    },
                    getExpandOnNodeClick : function() {
                        return this.expandOnNodeClick
                    },
                    setLoadOnExpand : function(a) {
                        this.loadOnExpand = a
                    },
                    getLoadOnExpand : function() {
                        return this.loadOnExpand
                    },
                    hideNode : function(c) {
                        c = this.getNode(c);
                        if (!c) {
                            return
                        }
                        c.visible = false;
                        this._doUpdateTreeNodeEl(c);
                        var b = this._getNodeEl(c, 1);
                        var a = this._getNodeEl(c, 2);
                        if (b) {
                            b.style.display = "none"
                        }
                        if (a) {
                            a.style.display = "none"
                        }
                    },
                    showNode : function(a) {
                        a = this.getNode(a);
                        if (!a) {
                            return
                        }
                        a.visible = true;
                        this._doUpdateTreeNodeEl(a)
                    },
                    enableNode : function(d) {
                        d = this.getNode(d);
                        if (!d) {
                            return
                        }
                        d.enabled = true;
                        var c = this._getNodeEl(d, 1);
                        var b = this._getNodeEl(d, 2);
                        if (c) {
                            mini.removeClass(c, "mini-disabled")
                        }
                        if (b) {
                            mini.removeClass(b, "mini-disabled")
                        }
                        var a = this._getCheckBoxEl(d);
                        if (a) {
                            a.disabled = false
                        }
                    },
                    disableNode : function(d) {
                        d = this.getNode(d);
                        if (!d) {
                            return
                        }
                        d.enabled = false;
                        var c = this._getNodeEl(d, 1);
                        var b = this._getNodeEl(d, 2);
                        if (c) {
                            mini.addClass(c, "mini-disabled")
                        }
                        if (b) {
                            mini.addClass(b, "mini-disabled")
                        }
                        var a = this._getCheckBoxEl(d);
                        if (a) {
                            a.disabled = true
                        }
                    },
                    imgPath : "",
                    setImgPath : function(a) {
                        this.imgPath = a
                    },
                    getImgPath : function() {
                        return this.imgPath
                    },
                    imgField : "img",
                    setImgField : function(a) {
                        this.imgField = a
                    },
                    getImgField : function() {
                        return this.imgField
                    },
                    getAttrs : function(c) {
                        var i = mini.TreeGrid.superclass.getAttrs.call(this, c);
                        mini._ParseString(c, i, [ "value", "url", "idField",
                                "textField", "iconField", "nodesField",
                                "parentField", "valueField", "checkedField",
                                "leafIcon", "folderIcon", "leafField",
                                "ondrawnode", "onbeforenodeselect",
                                "onnodeselect", "onnodemousedown",
                                "onnodeclick", "onnodedblclick",
                                "onbeforenodecheck", "onnodecheck",
                                "onbeforeexpand", "onexpand",
                                "onbeforecollapse", "oncollapse",
                                "dragGroupName", "dropGroupName", "onendedit",
                                "expandOnLoad", "ondragstart", "onbeforedrop",
                                "ondrop", "ongivefeedback", "treeColumn",
                                "onaddnode", "onremovenode", "onmovenode",
                                "imgPath", "imgField" ]);
                        mini._ParseBool(c, i, [ "allowSelect", "showCheckBox",
                                "showRadioButton", "showExpandButtons",
                                "showTreeIcon", "showTreeLines",
                                "checkRecursive", "enableHotTrack",
                                "showFolderCheckBox", "resultAsTree",
                                "allowDrag", "allowDrop", "showArrow",
                                "expandOnDblClick", "removeOnCollapse",
                                "autoCheckParent", "loadOnExpand",
                                "expandOnNodeClick" ]);
                        if (i.expandOnLoad) {
                            var a = parseInt(i.expandOnLoad);
                            if (mini.isNumber(a)) {
                                i.expandOnLoad = a
                            } else {
                                i.expandOnLoad = i.expandOnLoad == "true" ? true
                                        : false
                            }
                        }
                        var b = i.idField || this.getIdField();
                        var e = i.textField || this.getTextField();
                        var d = i.iconField || this.getIconField();
                        var h = i.nodesField || this.getNodesField();
                        function g(j) {
                            var r = [];
                            for (var s = 0, q = j.length; s < q; s++) {
                                var n = j[s];
                                var t = mini.getChildNodes(n);
                                var u = t[0];
                                var z = t[1];
                                if (!u || !z) {
                                    u = n
                                }
                                var x = jQuery(u);
                                var m = {};
                                var k = m[b] = u.getAttribute("value");
                                m[d] = x.attr("iconCls");
                                m[e] = u.innerHTML;
                                r.add(m);
                                var w = x.attr("expanded");
                                if (w) {
                                    m.expanded = w == "false" ? false : true
                                }
                                var p = x.attr("allowSelect");
                                if (p) {
                                    m.allowSelect = p == "false" ? false : true
                                }
                                if (!z) {
                                    continue
                                }
                                var v = mini.getChildNodes(z);
                                var y = g(v);
                                if (y.length > 0) {
                                    m[h] = y
                                }
                            }
                            return r
                        }
                        var f = g(mini.getChildNodes(c));
                        if (f.length > 0) {
                            i.data = f
                        }
                        if (!i.idField && i.valueField) {
                            i.idField = i.valueField
                        }
                        return i
                    }
                });
mini.regClass(mini.TreeGrid, "TreeGrid");
mini.Tree = function() {
    mini.Tree.superclass.constructor.call(this);
    var a = [ {
        name : "node",
        header : "",
        field : this.getTextField(),
        width : "auto",
        allowDrag : true,
        editor : {
            type : "textbox"
        }
    } ];
    this._columnModel.setColumns(a);
    this._column = this._columnModel.getColumn("node");
    mini.removeClass(this.el, "mini-treegrid");
    mini.addClass(this.el, "mini-tree-nowrap");
    this.setBorderStyle("border:0")
};
mini.extend(mini.Tree, mini.TreeGrid, {
    setTextField : function(a) {
        this._dataSource.setTextField(a);
        this._columnModel.updateColumn("node", {
            field : a
        });
        this.textField = a
    },
    uiCls : "mini-tree",
    _rowHoverCls : "mini-tree-node-hover",
    _rowSelectedCls : "mini-tree-selectedNode",
    _getRecordByEvent : function(a, c) {
        var b = mini.Tree.superclass._getRecordByEvent.call(this, a);
        if (c === false) {
            return b
        }
        if (b && mini.findParent(a.target, "mini-tree-nodeshow")) {
            return b
        }
        return null
    },
    _treeColumn : "node",
    defaultRowHeight : 22,
    _getRowHeight : function(a) {
        var b = this.defaultRowHeight;
        if (a._height) {
            b = parseInt(a._height);
            if (isNaN(parseInt(a._height))) {
                b = rowHeight
            }
        }
        return b
    },
    showHeader : false,
    showTopbar : false,
    showFooter : false,
    showColumns : false,
    showHGridLines : false,
    showVGridLines : false,
    showTreeLines : true,
    setTreeColumn : null,
    setColumns : null,
    getColumns : null,
    frozen : null,
    unFrozen : null,
    showModified : false,
    setNodeText : function(a, c) {
        a = this.getNode(a);
        if (!a) {
            return
        }
        var b = {};
        b[this.getTextField()] = c;
        this.updateNode(a, b)
    },
    setNodeIconCls : function(b, a) {
        b = this.getNode(b);
        if (!b) {
            return
        }
        var c = {};
        c[this.iconField] = a;
        this.updateNode(b, c)
    },
    _OnCellMouseDown : function(a) {
        if (this._editInput) {
            this._editInput.blur()
        }
        this.fire("cellmousedown", a)
    },
    isEditingNode : function(a) {
        return this._editingNode == a
    },
    beginEdit : function(c) {
        c = this.getNode(c);
        if (!c) {
            return
        }
        var a = this.getColumn(0);
        var d = mini._getMap(a.field, c);
        var f = {
            record : c,
            node : c,
            column : a,
            field : a.field,
            value : d,
            cancel : false
        };
        this.fire("cellbeginedit", f);
        if (f.cancel == true) {
            return
        }
        this._editingNode = c;
        this._doUpdateNodeTitle(c);
        var b = this;
        function g() {
            var e = b._id + "$edit$" + c._id;
            b._editInput = document.getElementById(e);
            b._editInput.focus();
            mini.selectRange(b._editInput, 0, 1000);
            mini.on(b._editInput, "keydown", b.__OnEditInputKeyDown, b);
            mini.on(b._editInput, "blur", b.__OnEditInputBlur, b)
        }
        setTimeout(function() {
            g()
        }, 100);
        g()
    },
    cancelEdit : function(b) {
        var a = this._editingNode;
        this._editingNode = null;
        if (a) {
            if (b !== false) {
                this._doUpdateNodeTitle(a)
            }
            mini
                    .un(this._editInput, "keydown", this.__OnEditInputKeyDown,
                            this);
            mini.un(this._editInput, "blur", this.__OnEditInputBlur, this)
        }
        this._editInput = null
    },
    __OnEditInputKeyDown : function(b) {
        if (b.keyCode == 13) {
            var a = this._editingNode;
            var c = this._editInput.value;
            this._editingNode = null;
            this.setNodeText(a, c);
            this.cancelEdit(false);
            this.fire("endedit", {
                node : a,
                text : c
            })
        } else {
            if (b.keyCode == 27) {
                this.cancelEdit()
            }
        }
    },
    __OnEditInputBlur : function(b) {
        var a = this._editingNode;
        if (a) {
            var c = this._editInput.value;
            this.cancelEdit();
            this.setNodeText(a, c);
            this.fire("endedit", {
                node : a,
                text : c
            })
        }
    },
    addRowCls : function(d, a) {
        var c = this._getRowEl(d, 1);
        var b = this._getRowEl(d, 2);
        if (c) {
            mini.addClass(c.firstChild, a)
        }
        if (b) {
            mini.addClass(b.firstChild, a)
        }
    },
    removeRowCls : function(d, a) {
        var c = this._getRowEl(d, 1);
        var b = this._getRowEl(d, 2);
        if (c) {
            mini.removeClass(c, a);
            mini.removeClass(c.firstChild, a)
        }
        if (b) {
            mini.removeClass(b, a);
            mini.removeClass(b.firstChild, a)
        }
    },
    scrollIntoView : function(b) {
        b = this.getNode(b);
        if (!b) {
            return
        }
        if (!this.isVisibleNode(b)) {
            this.expandPath(b)
        }
        var a = this;
        setTimeout(function() {
            var c = a._getNodeEl(b, 2);
            mini.scrollIntoView(c, a._rowsViewEl, false)
        }, 10)
    }
});
mini.regClass(mini.Tree, "Tree");
mini._Tree_Expander = function(a) {
    this.owner = a;
    mini.on(a.el, "click", this.__OnClick, this);
    mini.on(a.el, "dblclick", this.__OnDblClick, this)
};
mini._Tree_Expander.prototype = {
    _canToggle : function() {
        return !this.owner._dataSource._isNodeLoading()
    },
    __OnClick : function(d) {
        var a = this.owner;
        var c = a._getRecordByEvent(d, false);
        if (!c || c.enabled === false) {
            return
        }
        if (mini.findParent(d.target, "mini-tree-checkbox")) {
            return
        }
        var b = a.isLeaf(c);
        if (mini.findParent(d.target, a._eciconCls)) {
            if (this._canToggle() == false) {
                return
            }
            a._tryToggleNode(c)
        } else {
            if (a.expandOnNodeClick && !b && !a._inAniming) {
                if (this._canToggle() == false) {
                    return
                }
                a._tryToggleNode(c)
            }
        }
    },
    __OnDblClick : function(d) {
        var a = this.owner;
        var c = a._getRecordByEvent(d, false);
        if (!c || c.enabled === false) {
            return
        }
        var b = a.isLeaf(c);
        if (a._inAniming) {
            return
        }
        if (mini.findParent(d.target, a._eciconCls)) {
            return
        }
        if (a.expandOnNodeClick) {
            return
        }
        if (a.expandOnDblClick && !b) {
            if (this._canToggle() == false) {
                return
            }
            d.preventDefault();
            a._tryToggleNode(c)
        }
    }
};
mini._Tree_AsyncLoader = function(a) {
    this.owner = a;
    a.on("beforeexpand", this.__OnBeforeNodeExpand, this)
};
mini._Tree_AsyncLoader.prototype = {
    __OnBeforeNodeExpand : function(f) {
        var a = this.owner;
        var d = f.node;
        var b = a.isLeaf(d);
        var c = d[a.getNodesField()];
        if (!b && (!c || c.length == 0)) {
            if (a.loadOnExpand && d.asyncLoad !== false) {
                f.cancel = true;
                a.loadNode(d)
            }
        }
    }
};
