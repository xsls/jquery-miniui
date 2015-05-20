mini._Grid_Select = function(a) {
    this.owner = a, el = a.el;
    a.on("rowmousemove", this.__OnRowMouseMove, this);
    mini.on(a._viewportEl, "mouseout", this.__OnMouseOut, this);
    mini.on(a._viewportEl, "mousewheel", this.__OnMouseWheel, this);
    a.on("cellmousedown", this.__OnCellMouseDown, this);
    a.on("cellclick", this.__OnGridCellClick, this);
    a.on("celldblclick", this.__OnGridCellClick, this);
    mini.on(a.el, "keydown", this.__OnGridKeyDown, this)
};
mini._Grid_Select.prototype = {
    __OnGridKeyDown : function(l) {
        var b = this.owner;
        var d = mini.findParent(l.target, "mini-grid-detailRow");
        var a = d ? mini.isAncestor(b.el, d) : false;
        if (mini.isAncestor(b._filterEl, l.target)
                || mini.isAncestor(b._summaryEl, l.target)
                || mini.isAncestor(b._toolbarEl, l.target)
                || mini.isAncestor(b._footerEl, l.target)
                || (mini.findParent(l.target, "mini-grid-detailRow") && a)
                || mini.findParent(l.target, "mini-grid-rowEdit")
                || mini.findParent(l.target, "mini-tree-editinput")) {
            return
        }
        var n = b.getCurrentCell();
        if (l.shiftKey || l.ctrlKey || l.altKey) {
            return
        }
        if (l.keyCode == 37 || l.keyCode == 38 || l.keyCode == 39
                || l.keyCode == 40) {
            l.preventDefault()
        }
        var h = b.getVisibleColumns();
        function f(e) {
            return b.getVisibleRows()[e]
        }
        function o(e) {
            return b.getVisibleRows().indexOf(e)
        }
        function c() {
            return b.getVisibleRows().length
        }
        var g = n ? n[1] : null, i = n ? n[0] : null;
        if (!n) {
            i = b.getCurrent()
        }
        var k = h.indexOf(g);
        var m = o(i);
        var j = c();
        switch (l.keyCode) {
        case 9:
            if (b.allowCellEdit && b.editOnTabKey) {
                l.preventDefault();
                b._beginEditNextCell(l.shiftKey == false, true);
                return
            }
            break;
        case 27:
            break;
        case 13:
            if (b.allowCellEdit && b.editNextOnEnterKey) {
                if (b.isEditingCell(n) || !g.editor) {
                    b._beginEditNextCell(l.shiftKey == false);
                    return
                }
            }
            if (b.allowCellEdit && n && !g.readOnly) {
                b.beginEditCell()
            }
            break;
        case 37:
            if (g) {
                if (k > 0) {
                    k -= 1
                }
            } else {
                k = 0
            }
            break;
        case 38:
            if (i) {
                if (m > 0) {
                    m -= 1
                }
            } else {
                m = 0
            }
            if (m != 0 && b.isVirtualScroll()) {
                if (b._viewRegion.start > m) {
                    return
                }
            }
            break;
        case 39:
            if (g) {
                if (k < h.length - 1) {
                    k += 1
                }
            } else {
                k = 0
            }
            break;
        case 40:
            if (i) {
                if (m < j - 1) {
                    m += 1
                }
            } else {
                m = 0
            }
            if (b.isVirtualScroll()) {
                if (b._viewRegion.end < m) {
                    return;
                    b.setScrollTop(b.getScrollTop() + b.defaultRowHeight)
                }
            }
            break;
        default:
            return;
            break
        }
        g = h[k];
        i = f(m);
        if (g && i && b.allowCellSelect) {
            var n = [ i, g ];
            b.setCurrentCell(n);
            b.scrollIntoView(i, g)
        }
        if (!b.onlyCheckSelection) {
            if (i && b.allowRowSelect) {
                b.deselectAll();
                b.setCurrent(i);
                if (i) {
                    b.scrollIntoView(i)
                }
            }
        }
    },
    __OnMouseWheel : function(b) {
        var a = this.owner;
        if (a.allowCellEdit) {
            a.commitEdit()
        }
    },
    __OnGridCellClick : function(d) {
        var b = this.owner;
        if (b.allowCellEdit == false) {
            return
        }
        if (b.cellEditAction != d.type) {
            return
        }
        var a = d.record, c = d.column;
        if (!c.readOnly && !b.isReadOnly()) {
            if (d.htmlEvent.shiftKey || d.htmlEvent.ctrlKey) {
            } else {
                b.beginEditCell()
            }
        }
    },
    __OnCellMouseDown : function(b) {
        var a = this;
        a.__doSelect(b)
    },
    __OnRowMouseMove : function(c) {
        var b = this.owner;
        var a = c.record;
        if (!b.enabled || b.enableHotTrack == false) {
            return
        }
        b.focusRow(a)
    },
    __OnMouseOut : function(a) {
        if (this.owner.allowHotTrackOut) {
            this.owner.focusRow(null)
        }
    },
    __doSelect : function(h) {
        var b = h.record, f = h.column;
        var d = this.owner;
        if (b.enabled === false) {
            return
        }
        if (d.allowCellSelect) {
            var a = [ b, f ];
            d.setCurrentCell(a)
        }
        if (d.onlyCheckSelection && !f._multiRowSelect) {
            return
        }
        if (d.allowRowSelect) {
            var c = {
                record : b,
                selected : b,
                cancel : false
            };
            if (b) {
                d.fire("beforerowselect", c)
            }
            if (c.cancel) {
                return
            }
            if (d.getMultiSelect()) {
                d.el.onselectstart = function() {
                };
                if (h.htmlEvent.shiftKey) {
                    d.el.onselectstart = function() {
                        return false
                    };
                    try {
                        h.htmlEvent.preventDefault()
                    } catch (c) {
                    }
                    var g = d.getCurrent();
                    if (g) {
                        d.deselectAll();
                        d.selectRange(g, b);
                        d.setCurrent(g)
                    } else {
                        d.select(b);
                        d.setCurrent(b)
                    }
                } else {
                    d.el.onselectstart = function() {
                    };
                    if (h.htmlEvent.ctrlKey) {
                        d.el.onselectstart = function() {
                            return false
                        };
                        try {
                            h.htmlEvent.preventDefault()
                        } catch (c) {
                        }
                    }
                    if (h.column._multiRowSelect === true
                            || h.htmlEvent.ctrlKey || d.allowUnselect) {
                        if (d.isSelected(b)) {
                            d.deselect(b)
                        } else {
                            d.select(b);
                            d.setCurrent(b)
                        }
                    } else {
                        if (d.isSelected(b)) {
                        } else {
                            d.deselectAll();
                            d.select(b);
                            d.setCurrent(b)
                        }
                    }
                }
            } else {
                if (!d.isSelected(b)) {
                    d.deselectAll();
                    d.select(b)
                } else {
                    if (h.htmlEvent.ctrlKey || d.allowUnselect) {
                        d.deselectAll()
                    }
                }
            }
        }
    }
};
mini._Grid_RowGroup = function(a) {
    this.owner = a, el = a.el;
    mini.on(a._bodyEl, "click", this.__OnClick, this)
};
mini._Grid_RowGroup.prototype = {
    __OnClick : function(c) {
        var a = this.owner;
        var b = a._getRowGroupByEvent(c);
        if (b) {
            a.toggleRowGroup(b)
        }
    }
};
mini._Grid_ColumnsMenu = function(a) {
    this.owner = a;
    this.menu = this.createMenu();
    mini.on(a.el, "contextmenu", this.__OnContextMenu, this);
    a.on("destroy", this.__OnGridDestroy, this)
};
mini._Grid_ColumnsMenu.prototype = {
    __OnGridDestroy : function(a) {
        if (this.menu) {
            this.menu.destroy()
        }
        this.menu = null
    },
    createMenu : function() {
        var a = mini.create({
            type : "menu",
            hideOnClick : false
        });
        a.on("itemclick", this.__OnItemClick, this);
        return a
    },
    updateMenu : function() {
        var e = this.owner, h = this.menu;
        var d = e.getBottomColumns();
        var b = [];
        for (var c = 0, a = d.length; c < a; c++) {
            var f = d[c];
            if (f.hideable) {
                continue
            }
            var g = {};
            g.checked = f.visible;
            g.checkOnClick = true;
            g.text = e._createHeaderText(f);
            if (g.text == "&nbsp;") {
                if (f.type == "indexcolumn") {
                    g.text = "序号"
                }
                if (f.type == "checkcolumn") {
                    g.text = "选择"
                }
            }
            b.push(g);
            g.enabled = f.enabled;
            g._column = f
        }
        h.setItems(b)
    },
    __OnContextMenu : function(b) {
        var a = this.owner;
        if (a.showColumnsMenu == false) {
            return
        }
        if (mini.isAncestor(a._columnsEl, b.target) == false) {
            return
        }
        this.updateMenu();
        this.menu.showAtPos(b.pageX, b.pageY);
        return false
    },
    __OnItemClick : function(k) {
        var a = this.owner, b = this.menu;
        var f = a.getBottomColumns();
        var m = b.getItems();
        var o = k.item, d = o._column;
        var g = 0;
        for (var j = 0, c = m.length; j < c; j++) {
            var h = m[j];
            if (h.getChecked()) {
                g++
            }
        }
        if (g < 1) {
            o.setChecked(true)
        }
        var n = o.getChecked();
        if (n) {
            a.showColumn(d)
        } else {
            a.hideColumn(d)
        }
    }
};
mini._Grid_CellToolTip = function(a) {
    this.owner = a;
    mini.on(this.owner.el, "mousemove", this.__OnGridMouseMove, this)
};
mini._Grid_CellToolTip.prototype = {
    __OnGridMouseMove : function(g) {
        var d = this.owner;
        if (mini.hasClass(g.target, "mini-grid-headerCell-inner")) {
            var b = g.target;
            if (b.scrollWidth > b.clientWidth) {
                var f = b.innerText || b.textContent || "";
                b.title = f.trim()
            } else {
                b.title = ""
            }
            return
        }
        var a = d._getCellByEvent(g);
        var b = d._getCellEl(a[0], a[1]);
        var c = d.getCellError(a[0], a[1]);
        if (b) {
            if (c) {
                setTimeout(function() {
                    b.title = c.errorText
                }, 10);
                return
            }
            setTimeout(function() {
                var h = b;
                if (b.firstChild) {
                    if (mini.hasClass(b.firstChild, "mini-grid-cell-inner")) {
                        h = b.firstChild
                    }
                    if (mini.hasClass(b.firstChild, "mini-tree-nodetitle")) {
                        h = b.firstChild
                    }
                }
                if (h.scrollWidth > h.clientWidth) {
                    var e = h.innerText || h.textContent || "";
                    b.title = e.trim()
                } else {
                    b.title = ""
                }
            }, 10)
        }
    }
};
mini._Grid_Sorter = function(a) {
    this.owner = a;
    this.owner.on("headercellclick", this.__OnGridHeaderCellClick, this);
    mini.on(a._headerEl, "mousemove", this.__OnGridHeaderMouseMove, this);
    mini.on(a._headerEl, "mouseout", this.__OnGridHeaderMouseOut, this)
};
mini._Grid_Sorter.prototype = {
    __OnGridHeaderMouseOut : function(a) {
        if (this._focusedColumnEl) {
            mini.removeClass(this._focusedColumnEl,
                    "mini-grid-headerCell-hover")
        }
    },
    __OnGridHeaderMouseMove : function(b) {
        var a = mini.findParent(b.target, "mini-grid-headerCell");
        if (a) {
            mini.addClass(a, "mini-grid-headerCell-hover");
            this._focusedColumnEl = a
        }
    },
    __OnGridHeaderCellClick : function(d) {
        var a = this.owner;
        if (!mini.hasClass(d.htmlEvent.target, "mini-grid-column-splitter")) {
            if (a.allowSortColumn && a.isEditing() == false) {
                var c = d.column;
                if (!c.columns || c.columns.length == 0) {
                    if (c.field && c.allowSort !== false) {
                        var b = "asc";
                        if (a.getSortField() == c.field) {
                            b = a.getSortOrder() == "asc" ? "desc" : "asc"
                        }
                        a.sortBy(c.field, b)
                    }
                }
            }
        }
    }
};
mini._Grid_ColumnMove = function(a) {
    this.owner = a;
    mini.on(this.owner.el, "mousedown", this.__onGridMouseDown, this)
};
mini._Grid_ColumnMove.prototype = {
    __onGridMouseDown : function(d) {
        var b = this.owner;
        if (b.isEditing()) {
            return
        }
        if (mini.hasClass(d.target, "mini-grid-column-splitter")) {
            return
        }
        if (d.button == mini.MouseButton.Right) {
            return
        }
        var a = mini.findParent(d.target, b._headerCellCls);
        if (a) {
            this._remove();
            var c = b._getColumnByEvent(d);
            if (b.allowMoveColumn && c && c.allowMove) {
                this.dragColumn = c;
                this._columnEl = a;
                this.getDrag().start(d)
            }
        }
    },
    getDrag : function() {
        if (!this.drag) {
            this.drag = new mini.Drag({
                capture : false,
                onStart : mini.createDelegate(this._OnDragStart, this),
                onMove : mini.createDelegate(this._OnDragMove, this),
                onStop : mini.createDelegate(this._OnDragStop, this)
            })
        }
        return this.drag
    },
    _OnDragStart : function(b) {
        function c(d) {
            var e = d.header;
            if (typeof e == "function") {
                e = e.call(a, d)
            }
            if (mini.isNull(e) || e === "") {
                e = "&nbsp;"
            }
            return e
        }
        var a = this.owner;
        this._dragProxy = mini.append(document.body,
                '<div class="mini-grid-columnproxy"></div>');
        this._dragProxy.innerHTML = '<div class="mini-grid-columnproxy-inner" style="height:26px;">'
                + c(this.dragColumn) + "</div>";
        mini.setXY(this._dragProxy, b.now[0] + 15, b.now[1] + 18);
        mini.addClass(this._dragProxy, "mini-grid-no");
        this.moveTop = mini.append(document.body,
                '<div class="mini-grid-movetop"></div>');
        this.moveBottom = mini.append(document.body,
                '<div class="mini-grid-movebottom"></div>')
    },
    _OnDragMove : function(d) {
        var a = this.owner;
        var e = d.now[0];
        mini.setXY(this._dragProxy, e + 15, d.now[1] + 18);
        this.targetColumn = this.insertAction = null;
        var i = mini.findParent(d.event.target, a._headerCellCls);
        if (i) {
            var b = a._getColumnByEvent(d.event);
            if (b && b != this.dragColumn) {
                var h = a.getParentColumn(this.dragColumn);
                var f = a.getParentColumn(b);
                if (h == f) {
                    this.targetColumn = b;
                    this.insertAction = "before";
                    var g = a.getColumnBox(this.targetColumn);
                    if (e > g.x + g.width / 2) {
                        this.insertAction = "after"
                    }
                }
            }
        }
        if (this.targetColumn) {
            mini.addClass(this._dragProxy, "mini-grid-ok");
            mini.removeClass(this._dragProxy, "mini-grid-no");
            var c = a.getColumnBox(this.targetColumn);
            this.moveTop.style.display = "block";
            this.moveBottom.style.display = "block";
            if (this.insertAction == "before") {
                mini.setXY(this.moveTop, c.x - 4, c.y - 9);
                mini.setXY(this.moveBottom, c.x - 4, c.bottom)
            } else {
                mini.setXY(this.moveTop, c.right - 4, c.y - 9);
                mini.setXY(this.moveBottom, c.right - 4, c.bottom)
            }
        } else {
            mini.removeClass(this._dragProxy, "mini-grid-ok");
            mini.addClass(this._dragProxy, "mini-grid-no");
            this.moveTop.style.display = "none";
            this.moveBottom.style.display = "none"
        }
    },
    _remove : function() {
        var a = this.owner;
        mini.removeNode(this._dragProxy);
        mini.removeNode(this.moveTop);
        mini.removeNode(this.moveBottom);
        this._dragProxy = this.moveTop = this.moveBottom = this.dragColumn = this.targetColumn = null
    },
    _OnDragStop : function(b) {
        var a = this.owner;
        a.moveColumn(this.dragColumn, this.targetColumn, this.insertAction);
        this._remove()
    }
};
mini._Grid_ColumnSplitter = function(a) {
    this.owner = a;
    mini.on(a.el, "mousedown", this.__OnMouseDown, this)
};
mini._Grid_ColumnSplitter.prototype = {
    __OnMouseDown : function(d) {
        var b = this.owner;
        var a = d.target;
        if (mini.hasClass(a, "mini-grid-column-splitter")) {
            var c = b._getColumnById(a.id);
            if (b.isEditing()) {
                return
            }
            if (b.allowResizeColumn && c && c.allowResize) {
                this.splitterColumn = c;
                this.getDrag().start(d)
            }
        }
    },
    getDrag : function() {
        if (!this.drag) {
            this.drag = new mini.Drag({
                capture : true,
                onStart : mini.createDelegate(this._OnDragStart, this),
                onMove : mini.createDelegate(this._OnDragMove, this),
                onStop : mini.createDelegate(this._OnDragStop, this)
            })
        }
        return this.drag
    },
    _OnDragStart : function(c) {
        var b = this.owner;
        var a = b.getColumnBox(this.splitterColumn);
        this.columnBox = a;
        this._dragProxy = mini.append(document.body,
                '<div class="mini-grid-proxy"></div>');
        var d = b.getGridViewBox();
        d.x = a.x;
        d.width = a.width;
        d.right = a.right;
        mini.setBox(this._dragProxy, d)
    },
    _OnDragMove : function(c) {
        var a = this.owner;
        var d = mini.copyTo({}, this.columnBox);
        var b = d.width + (c.now[0] - c.init[0]);
        if (b < a.columnMinWidth) {
            b = a.columnMinWidth
        }
        if (b > a.columnMaxWidth) {
            b = a.columnMaxWidth
        }
        mini.setWidth(this._dragProxy, b)
    },
    _OnDragStop : function(f) {
        var a = this.owner;
        var e = mini.getBox(this._dragProxy);
        var g = this;
        var h = a.allowSortColumn;
        a.allowSortColumn = false;
        setTimeout(function() {
            jQuery(g._dragProxy).remove();
            g._dragProxy = null;
            a.allowSortColumn = h
        }, 10);
        var d = this.splitterColumn;
        var c = parseInt(d.width);
        if (c + "%" != d.width) {
            var b = a.getColumnWidth(d);
            var i = parseInt(c / b * e.width);
            if (i < a.columnMinWidth) {
                i = a.columnMinWidth
            }
            a.setColumnWidth(d, i)
        }
    }
};
mini._Grid_DragDrop = function(a) {
    this.owner = a;
    this.owner.on("CellMouseDown", this.__OnGridCellMouseDown, this)
};
mini._Grid_DragDrop.prototype = {
    __OnGridCellMouseDown : function(f) {
        if (f.htmlEvent.button == mini.MouseButton.Right) {
            return
        }
        var c = this.owner;
        if (c._dragging) {
            return
        }
        this.dropObj = c;
        if (mini.findParent(f.htmlEvent.target, "mini-tree-editinput")) {
            return
        }
        if (c.isReadOnly() || c.isAllowDrag(f.record, f.column) == false) {
            return
        }
        var b = c._OnDragStart(f.record, f.column);
        if (b.cancel) {
            return
        }
        this.dragText = b.dragText;
        var a = f.record;
        this.isTree = !!c.isTree;
        this.beginRecord = a;
        var d = this._getDrag();
        d.start(f.htmlEvent)
    },
    _OnDragStart : function(c) {
        var b = this.owner;
        b._dragging = true;
        var a = this.beginRecord;
        this.dragData = b._getDragData();
        if (this.dragData.indexOf(a) == -1) {
            this.dragData.push(a)
        }
        this.feedbackEl = mini.append(document.body,
                '<div class="mini-feedback"></div>');
        this.feedbackEl.innerHTML = this.dragText;
        this.lastFeedbackClass = "";
        this.enableHotTrack = b.getEnableHotTrack();
        b.setEnableHotTrack(false)
    },
    _getDropTargetObj : function(a) {
        var b = mini.findParent(a.target, "mini-grid", 500);
        if (b) {
            return mini.get(b)
        }
    },
    _OnDragMove : function(d) {
        var c = this.owner;
        var e = this._getDropTargetObj(d.event);
        this.dropObj = e;
        var a = d.now[0], f = d.now[1];
        mini.setXY(this.feedbackEl, a + 15, f + 18);
        if (e && e.allowDrop) {
            this.isTree = e.isTree;
            var b = e._getRecordByEvent(d.event);
            this.dropRecord = b;
            if (b) {
                if (this.isTree) {
                    this.dragAction = this.getFeedback(b, f, 3)
                } else {
                    this.dragAction = this.getFeedback(b, f, 2)
                }
            } else {
                this.dragAction = "no"
            }
        } else {
            this.dragAction = "no"
        }
        if (e && e.allowDrop && !b && e.getData().length == 0) {
            this.dragAction = "add"
        }
        this.lastFeedbackClass = "mini-feedback-" + this.dragAction;
        this.feedbackEl.className = "mini-feedback " + this.lastFeedbackClass;
        if (this.dragAction == "no") {
            b = null
        }
        this.setRowFeedback(b, this.dragAction)
    },
    _OnDragStop : function(o) {
        var a = this.owner;
        var s = this.dropObj;
        a._dragging = false;
        mini.removeNode(this.feedbackEl);
        a.setEnableHotTrack(this.enableHotTrack);
        this.feedbackEl = null;
        this.setRowFeedback(null);
        if (this.isTree) {
            var c = [];
            for (var n = 0, f = this.dragData.length; n < f; n++) {
                var q = this.dragData[n];
                var t = false;
                for (var m = 0, h = this.dragData.length; m < h; m++) {
                    var d = this.dragData[m];
                    if (d != q) {
                        t = a.isAncestor(d, q);
                        if (t) {
                            break
                        }
                    }
                }
                if (!t) {
                    c.push(q)
                }
            }
            this.dragData = c
        }
        if (this.dragAction == "add" && !this.dropRecord) {
            this.dropRecord = s.getRootNode ? s.getRootNode() : {
                __root : true
            }
        }
        if (this.dropRecord && s && this.dragAction != "no") {
            var r = a._OnDragDrop(this.dragData, this.dropRecord,
                    this.dragAction);
            if (!r.cancel) {
                var c = r.dragNodes, b = r.targetNode, g = r.action;
                if (s.isTree) {
                    if (a == s) {
                        s.moveNodes(c, b, g)
                    } else {
                        a.removeNodes(c);
                        s.addNodes(c, b, g)
                    }
                } else {
                    var p = s.indexOf(b);
                    if (g == "after") {
                        p += 1
                    }
                    if (a == s) {
                        s.moveRow(c, p)
                    } else {
                        a.removeRows(c);
                        if (this.dragAction == "add") {
                            s.addRows(c)
                        } else {
                            s.addRows(c, p)
                        }
                    }
                }
                var r = {
                    dragNode : r.dragNodes[0],
                    dropNode : r.targetNode,
                    dragAction : r.action,
                    dragNodes : r.dragNodes,
                    targetNode : r.targetNode
                };
                s.fire("drop", r)
            }
        }
        this.dropRecord = null;
        this.dragData = null
    },
    setRowFeedback : function(d, c) {
        var e = this.owner;
        var g = this.dropObj;
        if (this.lastAddDomRow && g) {
            g.removeRowCls(this.lastAddDomRow, "mini-tree-feedback-add")
        }
        if (d == null || this.dragAction == "add") {
            mini.removeNode(this.feedbackLine);
            this.feedbackLine = null
        }
        this.lastRowFeedback = d;
        if (d != null) {
            if (c == "before" || c == "after") {
                if (!this.feedbackLine) {
                    this.feedbackLine = mini.append(document.body,
                            "<div class='mini-feedback-line'></div>")
                }
                this.feedbackLine.style.display = "block";
                var b = g.getRowBox(d);
                var a = b.x, h = b.y - 1;
                if (c == "after") {
                    h += b.height
                }
                mini.setXY(this.feedbackLine, a, h);
                var f = g.getBox(true);
                mini.setWidth(this.feedbackLine, f.width)
            } else {
                g.addRowCls(d, "mini-tree-feedback-add");
                this.lastAddDomRow = d
            }
        }
    },
    getFeedback : function(q, m, p) {
        var a = this.owner;
        var n = this.dropObj;
        var o = n.getRowBox(q);
        var g = o.height;
        var r = m - o.y;
        var s = null;
        if (this.dragData.indexOf(q) != -1) {
            return "no"
        }
        var f = false;
        if (p == 3) {
            f = n.isLeaf(q);
            for (var d = 0, c = this.dragData.length; d < c; d++) {
                var j = this.dragData[d];
                var b = n.isAncestor(j, q);
                if (b) {
                    s = "no";
                    break
                }
            }
        }
        if (s == null) {
            if (p == 2) {
                if (r > g / 2) {
                    s = "after"
                } else {
                    s = "before"
                }
            } else {
                if (f && n.allowLeafDropIn === false) {
                    if (r > g / 2) {
                        s = "after"
                    } else {
                        s = "before"
                    }
                } else {
                    if (r > (g / 3) * 2) {
                        s = "after"
                    } else {
                        if (g / 3 <= r && r <= (g / 3 * 2)) {
                            s = "add"
                        } else {
                            s = "before"
                        }
                    }
                }
            }
        }
        var k = n._OnGiveFeedback(s, this.dragData, q, a);
        return k.effect
    },
    _getDrag : function() {
        if (!this.drag) {
            this.drag = new mini.Drag({
                onStart : mini.createDelegate(this._OnDragStart, this),
                onMove : mini.createDelegate(this._OnDragMove, this),
                onStop : mini.createDelegate(this._OnDragStop, this)
            })
        }
        return this.drag
    }
};
mini._Grid_Events = function(a) {
    this.owner = a, el = a.el;
    mini.on(el, "click", this.__OnClick, this);
    mini.on(el, "dblclick", this.__OnDblClick, this);
    mini.on(el, "mousedown", this.__OnMouseDown, this);
    mini.on(el, "mouseup", this.__OnMouseUp, this);
    mini.on(el, "mousemove", this.__OnMouseMove, this);
    mini.on(el, "mouseover", this.__OnMouseOver, this);
    mini.on(el, "mouseout", this.__OnMouseOut, this);
    mini.on(el, "keydown", this.__OnKeyDown, this);
    mini.on(el, "keyup", this.__OnKeyUp, this);
    mini.on(el, "contextmenu", this.__OnContextMenu, this);
    a.on("rowmousemove", this.__OnRowMouseMove, this)
};
mini._Grid_Events.prototype = {
    _row : null,
    __OnRowMouseMove : function(b) {
        var a = this.owner;
        var c = b.record;
        if (this._row != c) {
            b.record = c;
            b.row = c;
            a.fire("rowmouseenter", b)
        }
        this._row = c
    },
    __OnClick : function(a) {
        this._fireEvent(a, "Click")
    },
    __OnDblClick : function(a) {
        this._fireEvent(a, "Dblclick")
    },
    __OnMouseDown : function(b) {
        var a = this.owner;
        if (mini.findParent(b.target, "mini-tree-editinput")) {
            return
        }
        this._fireEvent(b, "MouseDown");
        setTimeout(function() {
            var c = mini.findParent(b.target, "mini-grid-detailRow");
            if (mini.isAncestor(a.el, c)) {
                return
            }
            a._tryFocus(b)
        }, 30)
    },
    __OnMouseUp : function(b) {
        if (mini.findParent(b.target, "mini-tree-editinput")) {
            return
        }
        var a = this.owner;
        if (mini.isAncestor(a.el, b.target)) {
            this._fireEvent(b, "MouseUp")
        }
    },
    __OnMouseMove : function(a) {
        this._fireEvent(a, "MouseMove")
    },
    __OnMouseOver : function(a) {
        this._fireEvent(a, "MouseOver")
    },
    __OnMouseOut : function(a) {
        this._fireEvent(a, "MouseOut")
    },
    __OnKeyDown : function(a) {
        this._fireEvent(a, "KeyDown")
    },
    __OnKeyUp : function(a) {
        this._fireEvent(a, "KeyUp")
    },
    __OnContextMenu : function(a) {
        this._fireEvent(a, "ContextMenu")
    },
    _fireEvent : function(h, b) {
        var a = this.owner;
        var j = a._getCellByEvent(h);
        var f = j[0], d = j[1];
        if (f) {
            var g = {
                record : f,
                row : f,
                htmlEvent : h
            };
            var i = a["_OnRow" + b];
            if (i) {
                i.call(a, g)
            } else {
                a.fire("row" + b, g)
            }
        }
        if (d) {
            var g = {
                column : d,
                field : d.field,
                htmlEvent : h
            };
            var i = a["_OnColumn" + b];
            if (i) {
                i.call(a, g)
            } else {
                a.fire("column" + b, g)
            }
        }
        if (f && d) {
            var g = {
                sender : a,
                record : f,
                row : f,
                column : d,
                field : d.field,
                htmlEvent : h
            };
            var i = a["_OnCell" + b];
            if (i) {
                i.call(a, g)
            } else {
                a.fire("cell" + b, g)
            }
            if (d["onCell" + b]) {
                d["onCell" + b].call(d, g)
            }
        }
        if (!f && d && mini.findParent(h.target, "mini-grid-headerCell")) {
            var g = {
                column : d,
                htmlEvent : h
            };
            var i = a["_OnHeaderCell" + b];
            if (i) {
                i.call(a, g)
            } else {
                var c = "onheadercell" + b.toLowerCase();
                if (d[c]) {
                    g.sender = a;
                    d[c](g)
                }
                a.fire("headercell" + b, g)
            }
        }
    }
};