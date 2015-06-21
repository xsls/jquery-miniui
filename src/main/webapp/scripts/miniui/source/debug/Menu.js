/**
 * 菜单控件。可加入菜单项对象 {@link mini.MenuItem}。
 * 
 *     @example
 *     &lt;ul id="menu2" class="mini-menu"&gt;
 *         &lt;li&gt;
 *             &lt;span &gt;操作&lt;/span&gt;
 *             &lt;ul&gt;
 *                 &lt;li iconCls="icon-new" onclick="onItemClick"&gt;新建&lt;/li&gt;
 *                 &lt;li class="separator"&gt;&lt;/li&gt;
 *                 &lt;li iconCls="icon-add" onclick="onItemClick"&gt;增加&lt;/li&gt;
 *                 &lt;li iconCls="icon-edit" onclick="onItemClick"&gt;修改&lt;/li&gt;
 *                 &lt;li iconCls="icon-remove" onclick="onItemClick"&gt;删除&lt;/li&gt;
 *             &lt;/ul&gt;
 *         &lt;/li&gt;
 *         &lt;li class="separator"&gt;&lt;/li&gt;
 *         &lt;li iconCls="icon-open" onclick="onItemClick"&gt;打开&lt;/li&gt;
 *         &lt;li iconCls="icon-remove" onclick="onItemClick"&gt;关闭&lt;/li&gt;
 *     &lt;/ul&gt;
 * 
 * @class
 * @extends mini.Control
 * @constructor
 */
mini.Menu = function() {
    this.items = [];
    mini.Menu.superclass.constructor.call(this)
};
mini.extend(mini.Menu, mini.Control);
mini.copyTo(mini.Menu.prototype, mini.Popup_prototype);
var mini_Popup_prototype_hide = mini.Popup_prototype.hide;
mini.copyTo(mini.Menu.prototype, {
    height : "auto",
    width : "auto",
    minWidth : 140,
    vertical : true,
    allowSelectItem : false,
    _selectedItem : null,
    _itemSelectedCls : "mini-menuitem-selected",
    textField : "text",
    resultAsTree : false,
    idField : "id",
    parentField : "pid",
    itemsField : "children",
    showNavArrow : true,
    imgPath : "",
    _clearBorder : false,
    showAction : "none",
    hideAction : "outerclick",
    getbyName : function(b) {
        for (var c = 0, a = this.items.length; c < a; c++) {
            var d = this.items[c];
            if (d.name == b) {
                return d
            }
            if (d.menu) {
                var e = d.menu.getbyName(b);
                if (e) {
                    return e
                }
            }
        }
        return null
    },
    set : function(b) {
        if (typeof b == "string") {
            return this
        }
        var a = b.url;
        delete b.url;
        if (b.imgPath) {
            this.setImgPath(b.imgPath)
        }
        delete b.imgPath;
        this.ownerItem = b.ownerItem;
        delete b.ownerItem;
        mini.Menu.superclass.set.call(this, b);
        if (a) {
            this.setUrl(a)
        }
        return this
    },
    uiCls : "mini-menu",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-menu";
        this.el.innerHTML = '<div class="mini-menu-border"><a class="mini-menu-topArrow" href="#" onclick="return false"></a><div class="mini-menu-inner"></div><a class="mini-menu-bottomArrow" href="#" onclick="return false"></a></div>';
        this._borderEl = this.el.firstChild;
        this._topArrowEl = this._borderEl.childNodes[0];
        this._bottomArrowEl = this._borderEl.childNodes[2];
        this._innerEl = this._borderEl.childNodes[1];
        this._innerEl.innerHTML = '<div class="mini-menu-float"></div><div class="mini-menu-toolbar"></div><div style="clear:both;"></div>';
        this._contentEl = this._innerEl.firstChild;
        this._toolbarEl = this._innerEl.childNodes[1];
        if (this.isVertical() == false) {
            mini.addClass(this.el, "mini-menu-horizontal")
        }
    },
    destroy : function(a) {
        if (this._topArrowEl) {
            this._topArrowEl.onmousedown = this._bottomArrowEl.onmousedown = null
        }
        this._popupEl = this.popupEl = this._borderEl = this._innerEl = this._contentEl = null;
        this._topArrowEl = this._bottomArrowEl = null;
        this.owner = null;
        this.window = null;
        mini.un(document, "mousedown", this.__OnBodyMouseDown,
                this);
        mini.un(window, "resize", this.__OnWindowResize, this);
        mini.Menu.superclass.destroy.call(this, a)
    },
    _disableContextMenu : false,
    _initEvents : function() {
        mini._BindEvents(function() {
            mini.on(document, "mousedown",
                    this.__OnBodyMouseDown, this);
            mini_onOne(this.el, "mouseover",
                    this.__OnMouseOver, this);
            mini.on(window, "resize", this.__OnWindowResize,
                    this);
            if (this._disableContextMenu) {
                mini_onOne(this.el, "contextmenu", function(a) {
                    a.preventDefault()
                }, this)
            }
            mini_onOne(this._topArrowEl, "mousedown",
                    this.__OnTopMouseDown, this);
            mini_onOne(this._bottomArrowEl, "mousedown",
                    this.__OnBottomMouseDown, this)
        }, this)
    },
    within : function(d) {
        if (mini.isAncestor(this.el, d.target)) {
            return true
        }
        for (var b = 0, a = this.items.length; b < a; b++) {
            var c = this.items[b];
            if (c.within(d)) {
                return true
            }
        }
        return false
    },
    /**
     * 
     * function setVertical(vertical)
     * @member mini.Menu
     * @param {Boolean} vertical
     *
     */
    setVertical : function(a) {
        this.vertical = a;
        if (!a) {
            mini.addClass(this.el, "mini-menu-horizontal")
        } else {
            mini.removeClass(this.el, "mini-menu-horizontal")
        }
    },
    /**
     * 
     * function getVertical()
     * @member mini.Menu
     * @returns {Boolean}
     *
     */
    getVertical : function() {
        return this.vertical
    },
    isVertical : function() {
        return this.vertical
    },
    show : function() {
        this.setVisible(true)
    },
    hide : function() {
        this.hideItems();
        mini_Popup_prototype_hide.call(this)
    },
    hideItems : function() {
        for (var b = 0, a = this.items.length; b < a; b++) {
            var c = this.items[b];
            c.hideMenu()
        }
    },
    showItemMenu : function(c) {
        for (var b = 0, a = this.items.length; b < a; b++) {
            var d = this.items[b];
            if (d == c) {
                d.showMenu()
            } else {
                d.hideMenu()
            }
        }
    },
    hasShowItemMenu : function() {
        for (var b = 0, a = this.items.length; b < a; b++) {
            var c = this.items[b];
            if (c && c.menu && c.menu.isPopup) {
                return true
            }
        }
        return false
    },
    setData : function(a) {
        if (!mini.isArray(a)) {
            a = []
        }
        this.setItems(a)
    },
    getData : function() {
        return this.getItems()
    },
    /**
     * 设置菜单项数组。菜单项对象MenuItem。<br/>
     * function setItems(items)
     * @member mini.Menu
     * @param  items
     *
     */
    setItems : function(b) {
        if (!mini.isArray(b)) {
            b = []
        }
        this.removeAll();
        var d = new Date();
        for (var c = 0, a = b.length; c < a; c++) {
            this.addItem(b[c])
        }
    },
    getItems : function() {
        return this.items
    },
    _itemType : "menuitem",
    addItem : function(a) {
        if (a == "-" || a == "|" || a.type == "separator") {
            mini.append(this._contentEl, '<span id="' + a.id
                    + '" class="mini-separator"></span>');
            return
        }
        if (!mini.isControl(a) && !mini.getClass(a.type)) {
            a.type = this._itemType
        }
        a.ownerMenu = this;
        a = mini.getAndCreate(a);
        this.items.push(a);
        this._contentEl.appendChild(a.el);
        a.ownerMenu = this;
        this.fire("itemschanged")
    },
    removeItem : function(a) {
        a = mini.get(a);
        if (!a) {
            return
        }
        this.items.remove(a);
        this._contentEl.removeChild(a.el);
        this.fire("itemschanged")
    },
    removeItemAt : function(a) {
        var b = this.items[a];
        this.removeItem(b)
    },
    removeAll : function() {
        var a = this.items.clone();
        for (var b = a.length - 1; b >= 0; b--) {
            this.removeItem(a[b])
        }
        this._contentEl.innerHTML = ""
    },
    getGroupItems : function(c) {
        if (!c) {
            return []
        }
        var b = [];
        for (var d = 0, a = this.items.length; d < a; d++) {
            var e = this.items[d];
            if (e.groupName == c) {
                b.push(e)
            }
        }
        return b
    },
    getItem : function(d) {
        if (typeof d == "number") {
            return this.items[d]
        }
        if (typeof d == "string") {
            for (var b = 0, a = this.items.length; b < a; b++) {
                var c = this.items[b];
                if (c.id == d) {
                    return c
                }
            }
            return null
        }
        if (d && this.items.indexOf(d) != -1) {
            return d
        }
        return null
    },
    /**
     * 
     * function setAllowSelectItem(allowSelectItem)
     * @member mini.Menu
     * @param {Boolean} allowSelectItem
     *
     */
    setAllowSelectItem : function(a) {
        this.allowSelectItem = a
    },
    /**
     * 
     * function getAllowSelectItem()
     * @member mini.Menu
     * @returns {Boolean}
     *
     */
    getAllowSelectItem : function() {
        return this.allowSelectItem
    },
    setSelectedItem : function(a) {
        a = this.getItem(a);
        this._OnItemSelect(a)
    },
    /**
     * 获得选中的菜单项对象。<br/>
     * function getSelectedItem()
     * @member mini.Menu
     *
     */
    getSelectedItem : function(a) {
        return this._selectedItem
    },
    setShowNavArrow : function(a) {
        this.showNavArrow = a
    },
    getShowNavArrow : function() {
        return this.showNavArrow
    },
    /**
     * 
     * function setTextField(textField)
     * @member mini.Menu
     * @param {String} textField
     *
     */
    setTextField : function(a) {
        this.textField = a
    },
    /**
     * 
     * function getTextField()
     * @member mini.Menu
     * @returns {String}
     *
     */
    getTextField : function() {
        return this.textField
    },
    /**
     * 
     * function setResultAsTree(resultAsTree)
     * @member mini.Menu
     * @param {Boolean} resultAsTree
     *
     */
    setResultAsTree : function(a) {
        this.resultAsTree = a
    },
    /**
     * 
     * function getResultAsTree()
     * @member mini.Menu
     * @returns {Boolean}
     *
     */
    getResultAsTree : function() {
        return this.resultAsTree
    },
    /**
     * 
     * function setIdField(idField)
     * @member mini.Menu
     * @param {String} idField
     *
     */
    setIdField : function(a) {
        this.idField = a
    },
    /**
     * 
     * function getIdField()
     * @member mini.Menu
     * @returns {String}
     *
     */
    getIdField : function() {
        return this.idField
    },
    /**
     * 
     * function setParentField(parentField)
     * @member mini.Menu
     * @param {String} parentField
     *
     */
    setParentField : function(a) {
        this.parentField = a
    },
    /**
     * 
     * function getParentField()
     * @member mini.Menu
     * @returns {String}
     *
     */
    getParentField : function() {
        return this.parentField
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        if (!this.isAutoHeight()) {
            var a = mini.getHeight(this.el, true);
            mini.setHeight(this._borderEl, a);
            this._topArrowEl.style.display = this._bottomArrowEl.style.display = "none";
            this._contentEl.style.height = "auto";
            if (this.showNavArrow
                    && this._borderEl.scrollHeight > this._borderEl.clientHeight) {
                this._topArrowEl.style.display = this._bottomArrowEl.style.display = "block";
                a = mini.getHeight(this._borderEl, true);
                var e = mini.getHeight(this._topArrowEl);
                var b = mini.getHeight(this._bottomArrowEl);
                var d = a - e - b;
                if (d < 0) {
                    d = 0
                }
                mini.setHeight(this._contentEl, d);
                var c = mini.getWidth(this._borderEl, true);
                mini.setWidth(this._topArrowEl, c);
                mini.setWidth(this._bottomArrowEl, c)
            } else {
                this._contentEl.style.height = "auto"
            }
        } else {
            this._borderEl.style.height = "auto";
            this._contentEl.style.height = "auto"
        }
    },
    _measureSize : function() {
        if (this.height == "auto") {
            this.el.style.height = "auto";
            this._borderEl.style.height = "auto";
            this._contentEl.style.height = "auto";
            this._topArrowEl.style.display = this._bottomArrowEl.style.display = "none";
            var a = mini.getViewportBox();
            var c = mini.getBox(this.el);
            this.maxHeight = a.height - 25;
            if (this.ownerItem) {
                var c = mini.getBox(this.ownerItem.el);
                var d = c.top;
                var e = a.height - c.bottom;
                var b = d > e ? d : e;
                b -= 10;
                this.maxHeight = b
            }
        }
        this.el.style.display = "";
        var c = mini.getBox(this.el);
        if (c.width > this.maxWidth) {
            mini.setWidth(this.el, this.maxWidth);
            c = mini.getBox(this.el)
        }
        if (c.height > this.maxHeight) {
            mini.setHeight(this.el, this.maxHeight);
            c = mini.getBox(this.el)
        }
        if (c.width < this.minWidth) {
            mini.setWidth(this.el, this.minWidth);
            c = mini.getBox(this.el)
        }
        if (c.height < this.minHeight) {
            mini.setHeight(this.el, this.minHeight);
            c = mini.getBox(this.el)
        }
    },
    url : "",
    _doLoad : function() {
        var b = mini._getResult(this.url, null, null, null,
                null, this.dataField);
        if (this.dataField && !mini.isArray(b)) {
            b = mini._getMap(this.dataField, b)
        }
        if (!b) {
            b = []
        }
        if (this.resultAsTree == false) {
            b = mini.arrayToTree(b, this.itemsField,
                    this.idField, this.parentField)
        }
        var e = mini.treeToArray(b, this.itemsField,
                this.idField, this.parentField);
        for (var c = 0, a = e.length; c < a; c++) {
            var f = e[c];
            f.text = mini._getMap(this.textField, f);
            if (mini.isNull(f.text)) {
                f.text = ""
            }
        }
        var d = new Date();
        this.setItems(b);
        this.fire("load")
    },
    /**
     * 加载列表数据。比如：tree.loadList(list, "id", "pid")<br/>
     * function loadList(Array, idField, parentField)
     * @member mini.Menu
     * @param  Array
     * @param  idField
     * @param  parentField
     *
     */
    loadList : function(e, c, f) {
        if (!e) {
            return
        }
        c = c || this.idField;
        f = f || this.parentField;
        for (var d = 0, b = e.length; d < b; d++) {
            var g = e[d];
            g.text = mini._getMap(this.textField, g);
            if (mini.isNull(g.text)) {
                g.text = ""
            }
        }
        var a = mini.arrayToTree(e, this.itemsField, c, f);
        this.load(a)
    },
    /**
     * 加载菜单数据<br/>
     * function load(url)
     * @member mini.Menu
     * @param  url
     *
     */
    load : function(a) {
        if (typeof a == "string") {
            this.setUrl(a)
        } else {
            this.setItems(a)
        }
    },
    /**
     * 
     * function setUrl(url)
     * @member mini.Menu
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
     * @member mini.Menu
     * @returns {String}
     *
     */
    getUrl : function() {
        return this.url
    },
    hideOnClick : true,
    setHideOnClick : function(a) {
        this.hideOnClick = a
    },
    getHideOnClick : function() {
        return this.hideOnClick
    },
    hideOnClick : true,
    setImgPath : function(a) {
        this.imgPath = a
    },
    getImgPath : function() {
        return this.imgPath
    },
    _OnItemClick : function(b, a) {
        var c = {
            item : b,
            isLeaf : !b.menu,
            htmlEvent : a
        };
        if (this.hideOnClick) {
            if (this.isPopup) {
                this.hide()
            } else {
                this.hideItems()
            }
        }
        if (this.allowSelectItem && this._selectedItem != b) {
            this.setSelectedItem(b)
        }
        this.fire("itemclick", c);
        if (this.ownerItem) {
        }
    },
    _OnItemSelect : function(a) {
        if (this._selectedItem) {
            this._selectedItem.removeCls(this._itemSelectedCls)
        }
        this._selectedItem = a;
        if (this._selectedItem) {
            this._selectedItem.addCls(this._itemSelectedCls)
        }
        var b = {
            item : this._selectedItem,
            isLeaf : this._selectedItem ? !this._selectedItem.menu
                    : false
        };
        this.fire("itemselect", b)
    },
    onItemClick : function(b, a) {
        this.on("itemclick", b, a)
    },
    onItemSelect : function(b, a) {
        this.on("itemselect", b, a)
    },
    __OnTopMouseDown : function(a) {
        this._startScrollMove(-20)
    },
    __OnBottomMouseDown : function(a) {
        this._startScrollMove(20)
    },
    _startScrollMove : function(c) {
        clearInterval(this._scrollTimer);
        var a = function() {
            clearInterval(b._scrollTimer);
            mini.un(document, "mouseup", a)
        };
        mini.on(document, "mouseup", a);
        var b = this;
        this._scrollTimer = setInterval(function() {
            b._contentEl.scrollTop += c
        }, 50)
    },
    setToolbar : function(a) {
        __mini_setControls(a, this._toolbarEl, this)
    },
    parseItems : function(a) {
        var f = [];
        for (var g = 0, e = a.length; g < e; g++) {
            var d = a[g];
            if (d.className == "separator") {
                var c = {
                    type : "separator",
                    id : d.id,
                    name : d.name
                };
                f.add(c);
                continue
            }
            var h = mini.getChildNodes(d);
            var j = h[0];
            var k = h[1];
            var c = new mini.MenuItem();
            if (!k) {
                mini.applyTo.call(c, d);
                f.add(c);
                continue
            }
            mini.applyTo.call(c, j);
            c.render(document.body);
            var b = new mini.Menu();
            mini.applyTo.call(b, k);
            c.setMenu(b);
            b.render(document.body);
            f.add(c)
        }
        return f.clone()
    },
    getAttrs : function(b) {
        var k = mini.Menu.superclass.getAttrs.call(this, b);
        var c = jQuery(b);
        mini._ParseString(b, k,
                [ "popupEl", "popupCls", "showAction",
                        "hideAction", "xAlign", "yAlign",
                        "modalStyle", "onbeforeopen", "open",
                        "onbeforeclose", "onclose", "url",
                        "onitemclick", "onitemselect",
                        "textField", "idField", "parentField",
                        "toolbar", "imgPath" ]);
        mini._ParseBool(b, k, [ "resultAsTree", "hideOnClick",
                "showNavArrow", "showShadow" ]);
        var a = mini.getChildNodes(b);
        for (var g = a.length - 1; g >= 0; g--) {
            var d = a[g];
            var j = jQuery(d).attr("property");
            if (!j) {
                continue
            }
            j = j.toLowerCase();
            if (j == "toolbar") {
                k.toolbar = d;
                d.parentNode.removeChild(d)
            }
        }
        var a = mini.getChildNodes(b);
        var h = this.parseItems(a);
        if (h.length > 0) {
            k.items = h
        }
        var f = c.attr("vertical");
        if (f) {
            k.vertical = f == "true" ? true : false
        }
        var e = c.attr("allowSelectItem");
        if (e) {
            k.allowSelectItem = e == "true" ? true : false
        }
        return k
    }
});
mini.regClass(mini.Menu, "menu");
mini.MenuBar = function() {
    mini.MenuBar.superclass.constructor.call(this)
};
mini.extend(mini.MenuBar, mini.Menu, {
    uiCls : "mini-menubar",
    vertical : false,
    setVertical : function(a) {
        this.vertical = false
    }
});
mini.regClass(mini.MenuBar, "menubar");
mini.ContextMenu = function() {
    mini.ContextMenu.superclass.constructor.call(this)
};
mini.extend(mini.ContextMenu, mini.Menu, {
    uiCls : "mini-contextmenu",
    vertical : true,
    visible : false,
    _disableContextMenu : true,
    setVertical : function(a) {
        this.vertical = true
    }
});
mini.regClass(mini.ContextMenu, "contextmenu");

/**
 * 菜单项控件。
 * @class
 * @extends mini.Control
 * @constructor
 */
mini.MenuItem = function() {
    mini.MenuItem.superclass.constructor.call(this)
};
mini.extend(mini.MenuItem, mini.Control, {
    text : "",
    iconCls : "",
    iconStyle : "",
    iconPosition : "left",
    img : "",
    showIcon : true,
    showAllow : true,
    checked : false,
    checkOnClick : false,
    groupName : "",
    _hoverCls : "mini-menuitem-hover",
    _pressedCls : "mini-menuitem-pressed",
    _checkedCls : "mini-menuitem-checked",
    _clearBorder : false,
    menu : null,
    set : function(a) {
        if (typeof a == "string") {
            return this
        }
        this.ownerMenu = a.ownerMenu;
        delete a.ownerMenu;
        mini.MenuItem.superclass.set.call(this, a);
        return this
    },
    uiCls : "mini-menuitem",
    _create : function() {
        var a = this.el = document.createElement("div");
        this.el.className = "mini-menuitem";
        this.el.innerHTML = '<div class="mini-menuitem-inner"><div class="mini-menuitem-icon"></div><div class="mini-menuitem-text"></div><div class="mini-menuitem-allow"></div></div>';
        this._innerEl = this.el.firstChild;
        this._iconEl = this._innerEl.firstChild;
        this._textEl = this._innerEl.childNodes[1];
        this.allowEl = this._innerEl.lastChild
    },
    _initEvents : function() {
        mini._BindEvents(function() {
            mini_onOne(this.el, "mouseover",
                    this.__OnMouseOver, this)
        }, this)
    },
    _inputEventsInited : false,
    _initInputEvents : function() {
        if (this._inputEventsInited) {
            return
        }
        this._inputEventsInited = true;
        mini_onOne(this.el, "click", this.__OnClick, this);
        mini_onOne(this.el, "mouseup", this.__OnMouseUp, this);
        mini_onOne(this.el, "mouseout", this.__OnMouseOut, this)
    },
    destroy : function(a) {
        if (this.el) {
            this.el.onmouseover = null
        }
        this.menu = this._innerEl = this._iconEl = this._textEl = this.allowEl = null;
        mini.MenuItem.superclass.destroy.call(this, a)
    },
    within : function(a) {
        if (mini.isAncestor(this.el, a.target)) {
            return true
        }
        if (this.menu && this.menu.within(a)) {
            return true
        }
        return false
    },
    _getIconImg : function() {
        return this.img && this.getTopMenu() ? this
                .getTopMenu().imgPath
                + this.img : this.img
    },
    _doUpdateIcon : function() {
        var b = this._getIconImg();
        var a = !!(this.iconStyle || this.iconCls
                || this.checkOnClick || b);
        if (this._iconEl) {
            mini.setStyle(this._iconEl, this.iconStyle);
            mini.addClass(this._iconEl, this.iconCls);
            if (b && !this.checked) {
                var c = "background-image:url(" + b + ")";
                mini.setStyle(this._iconEl, c)
            }
            if (this.checked) {
                jQuery(this._iconEl).css({
                    "background-image" : ""
                })
            }
            this._iconEl.style.display = a ? "block" : "none"
        }
        if (this.iconPosition == "top") {
            mini.addClass(this.el, "mini-menuitem-icontop")
        } else {
            mini.removeClass(this.el, "mini-menuitem-icontop")
        }
    },
    _hasChildMenu : function() {
        return this.menu && this.menu.items.length > 0
    },
    doUpdate : function() {
        if (this._textEl) {
            this._textEl.innerHTML = this.text
        }
        this._doUpdateIcon();
        if (this.checked) {
            mini.addClass(this.el, this._checkedCls);
            jQuery(this._iconEl).css({
                "background-image" : ""
            })
        } else {
            mini.removeClass(this.el, this._checkedCls)
        }
        if (this.allowEl) {
            if (this._hasChildMenu()) {
                this.allowEl.style.display = "block"
            } else {
                this.allowEl.style.display = "none"
            }
        }
    },
    /**
     * 
     * function setText(text)
     * @member mini.MenuItem
     * @param {String} text
     *
     */
    setText : function(a) {
        this.text = a;
        if (this._textEl) {
            this._textEl.innerHTML = this.text
        }
    },
    /**
     * 
     * function getText()
     * @member mini.MenuItem
     * @returns {String}
     *
     */
    getText : function() {
        return this.text
    },
    /**
     * 
     * function setIconCls(iconCls)
     * @member mini.MenuItem
     * @param {String} iconCls
     *
     */
    setIconCls : function(a) {
        mini.removeClass(this._iconEl, this.iconCls);
        this.iconCls = a;
        this._doUpdateIcon()
    },
    /**
     * 
     * function getIconCls()
     * @member mini.MenuItem
     * @returns {String}
     *
     */
    getIconCls : function() {
        return this.iconCls
    },
    setImg : function(a) {
        this.img = a;
        this._doUpdateIcon()
    },
    getImg : function() {
        return this.img
    },
    /**
     * 
     * function setIconStyle(iconStyle)
     * @member mini.MenuItem
     * @param {String} iconStyle
     *
     */
    setIconStyle : function(a) {
        this.iconStyle = a;
        this._doUpdateIcon()
    },
    /**
     * 
     * function getIconStyle()
     * @member mini.MenuItem
     * @returns {String}
     *
     */
    getIconStyle : function() {
        return this.iconStyle
    },
    /**
     * 
     * function setIconPosition(iconPosition)
     * @member mini.MenuItem
     * @param {String} iconPosition
     *
     */
    setIconPosition : function(a) {
        this.iconPosition = a;
        this._doUpdateIcon()
    },
    /**
     * 
     * function getIconPosition()
     * @member mini.MenuItem
     * @returns {String}
     *
     */
    getIconPosition : function() {
        return this.iconPosition
    },
    /**
     * 
     * function setCheckOnClick(checkOnClick)
     * @member mini.MenuItem
     * @param {Boolean} checkOnClick
     *
     */
    setCheckOnClick : function(a) {
        this.checkOnClick = a;
        if (a) {
            mini.addClass(this.el, "mini-menuitem-showcheck")
        } else {
            mini
                    .removeClass(this.el,
                            "mini-menuitem-showcheck")
        }
        this.doUpdate()
    },
    /**
     * 
     * function getCheckOnClick()
     * @member mini.MenuItem
     * @returns {Boolean}
     *
     */
    getCheckOnClick : function() {
        return this.checkOnClick
    },
    /**
     * 
     * function setChecked(checked)
     * @member mini.MenuItem
     * @param {Boolean} checked
     *
     */
    setChecked : function(a) {
        if (this.checked != a) {
            this.checked = a;
            this.doUpdate();
            this.fire("checkedchanged")
        }
    },
    /**
     * 
     * function getChecked()
     * @member mini.MenuItem
     * @returns {Boolean}
     *
     */
    getChecked : function() {
        return this.checked
    },
    /**
     * 
     * function setGroupName(groupName)
     * @member mini.MenuItem
     * @param {String} groupName
     *
     */
    setGroupName : function(a) {
        if (this.groupName != a) {
            this.groupName = a
        }
    },
    /**
     * 
     * function getGroupName()
     * @member mini.MenuItem
     * @returns {String}
     *
     */
    getGroupName : function() {
        return this.groupName
    },
    setChildren : function(a) {
        this.setMenu(a)
    },
    /**
     * 
     * function setMenu(menu)
     * @member mini.MenuItem
     * @param {Object} menu
     *
     */
    setMenu : function(a) {
        if (mini.isArray(a)) {
            a = {
                type : "menu",
                items : a
            }
        }
        if (this.menu !== a) {
            a.ownerItem = this;
            this.menu = mini.getAndCreate(a);
            this.menu.hide();
            this.menu.ownerItem = this;
            this.doUpdate();
            this.menu.on("itemschanged", this.__OnItemsChanged,
                    this)
        }
    },
    /**
     * 
     * function getMenu()
     * @member mini.MenuItem
     * @returns {Object}
     *
     */
    getMenu : function() {
        return this.menu
    },
    showMenu : function() {
        if (this.menu && this.menu.isDisplay() == false) {
            this.menu.setHideAction("outerclick");
            var a = {
                xAlign : "outright",
                yAlign : "top",
                outXAlign : "outleft",
                outYAlign : "below",
                popupCls : "mini-menu-popup"
            };
            if (this.ownerMenu
                    && this.ownerMenu.vertical == false) {
                a.xAlign = "left";
                a.yAlign = "below";
                a.outXAlign = null
            }
            this.menu.showAtEl(this.el, a)
        }
    },
    hideMenu : function() {
        if (this.menu) {
            this.menu.hide()
        }
    },
    hide : function() {
        this.hideMenu();
        this.setVisible(false)
    },
    __OnItemsChanged : function(a) {
        this.doUpdate()
    },
    getTopMenu : function() {
        if (this.ownerMenu) {
            if (this.ownerMenu.ownerItem) {
                return this.ownerMenu.ownerItem.getTopMenu()
            } else {
                return this.ownerMenu
            }
        }
        return null
    },
    __OnClick : function(g) {
        if (this.isReadOnly()) {
            return
        }
        if (this.checkOnClick) {
            if (this.ownerMenu && this.groupName) {
                var a = this.ownerMenu
                        .getGroupItems(this.groupName);
                if (a.length > 0) {
                    if (this.checked == false) {
                        for (var c = 0, b = a.length; c < b; c++) {
                            var f = a[c];
                            if (f != this) {
                                f.setChecked(false)
                            }
                        }
                        this.setChecked(true)
                    }
                } else {
                    this.setChecked(!this.checked)
                }
            } else {
                this.setChecked(!this.checked)
            }
        }
        this.fire("click");
        var d = this.getTopMenu();
        if (d) {
            d._OnItemClick(this, g)
        }
    },
    __OnMouseUp : function(b) {
        if (this.isReadOnly()) {
            return
        }
        if (this.ownerMenu) {
            var a = this;
            setTimeout(function() {
                if (a.isDisplay()) {
                    a.ownerMenu.showItemMenu(a)
                }
            }, 1)
        }
    },
    __OnMouseOver : function(a) {
        if (this.isReadOnly()) {
            return
        }
        this._initInputEvents();
        mini.addClass(this.el, this._hoverCls);
        this.el.title = this.text;
        if (this._textEl.scrollWidth > this._textEl.clientWidth) {
            this.el.title = this.text
        } else {
            this.el.title = ""
        }
        if (this.ownerMenu) {
            if (this.ownerMenu.isVertical() == true) {
                this.ownerMenu.showItemMenu(this)
            } else {
                if (this.ownerMenu.hasShowItemMenu()) {
                    this.ownerMenu.showItemMenu(this)
                }
            }
        }
    },
    __OnMouseOut : function(a) {
        mini.removeClass(this.el, this._hoverCls)
    },
    onClick : function(b, a) {
        this.on("click", b, a)
    },
    onCheckedChanged : function(b, a) {
        this.on("checkedchanged", b, a)
    },
    getAttrs : function(b) {
        var a = mini.MenuItem.superclass.getAttrs.call(this, b);
        var c = jQuery(b);
        a.text = b.innerHTML;
        mini._ParseString(b, a, [ "text", "iconCls",
                "iconStyle", "iconPosition", "groupName",
                "onclick", "oncheckedchanged" ]);
        mini._ParseBool(b, a, [ "checkOnClick", "checked" ]);
        return a
    }
});
mini.regClass(mini.MenuItem, "menuitem");
mini.Separator = function() {
    mini.Separator.superclass.constructor.call(this)
};
mini.extend(mini.Separator, mini.Control, {
    _clearBorder : false,
    uiCls : "mini-separator",
    _create : function() {
        this.el = document.createElement("span");
        this.el.className = "mini-separator"
    }
});
mini.regClass(mini.Separator, "separator");