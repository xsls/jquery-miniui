/**
 * 分页控件。
 * 
 *     @example
 *     &lt;div class="mini-pager" style="width:500px;background:#ccc;" totalCount="123" onpagechanged="onPageChanged" sizeList="[5,10,20,100]"&gt;&lt;/div&gt;
 *     
 *     &lt;script type="text/javascript"&gt;
 *         function onPageChanged(e) {
 *             alert(e.pageIndex+":"+e.pageSize);
 *         }
 *     &lt;/script&gt;
 * 
 * @class
 * @extends mini.Control
 * @constructor
 */
mini.Pager = function() {
    mini.Pager.superclass.constructor.call(this)
};
mini.extend(mini.Pager, mini.Control, {
    pageIndex : 0,
    pageSize : 10,
    totalCount : 0,
    totalPage : 0,
    showPageIndex : true,
    showPageSize : true,
    showTotalCount : true,
    showPageInfo : true,
    showReloadButton : true,
    _clearBorder : false,
    showButtonText : false,
    showButtonIcon : true,
    firstText : "首页",
    prevText : "上一页",
    nextText : "下一页",
    lastText : "尾页",
    pageInfoText : "每页 {0} 条, 共 {1} 条",
    sizeList : [ 10, 20, 50, 100 ],
    set : function(b) {
        if (typeof b == "string") {
            return this
        }
        var a = b.pageIndex;
        delete b.pageIndex;
        mini.Pager.superclass.set.call(this, b);
        if (!mini.isNull(a)) {
            this.setPageIndex(a)
        }
        return this
    },
    uiCls : "mini-pager",
    _create : function() {
        this.el = document.createElement("div");
        this.el.className = "mini-pager";
        var b = '<div class="mini-pager-left"><table cellspacing="0" cellpadding="0" border="0"><tr><td></td><td></td></tr></table></div><div class="mini-pager-right"></div>';
        this.el.innerHTML = b;
        this._leftEl = this.el.childNodes[0];
        this._rightEl = this.el.childNodes[1];
        var a = this._leftEl.getElementsByTagName("td");
        this._barEl = a[0];
        this._barEl2 = a[1];
        this.sizeEl = mini.append(this._barEl,
                '<span class="mini-pager-size"></span>');
        this.sizeCombo = new mini.ComboBox();
        this.sizeCombo.setName("pagesize");
        this.sizeCombo.setWidth(this.pageSizeWidth);
        this.sizeCombo.render(this.sizeEl);
        mini.append(this.sizeEl,
                '<span class="separator"></span>');
        this.firstButton = new mini.Button();
        this.firstButton.render(this._barEl);
        this.prevButton = new mini.Button();
        this.prevButton.render(this._barEl);
        this.indexEl = document.createElement("span");
        this.indexEl.className = "mini-pager-index";
        this.indexEl.innerHTML = '<input id="" type="text" class="mini-pager-num"/><span class="mini-pager-pages">/ 0</span>';
        this._barEl.appendChild(this.indexEl);
        this.numInput = this.indexEl.firstChild;
        this.pagesLabel = this.indexEl.lastChild;
        this.nextButton = new mini.Button();
        this.nextButton.render(this._barEl);
        this.lastButton = new mini.Button();
        this.lastButton.render(this._barEl);
        mini.append(this._barEl,
                '<span class="separator"></span>');
        this.reloadButton = new mini.Button();
        this.reloadButton.render(this._barEl);
        this.firstButton.setPlain(true);
        this.prevButton.setPlain(true);
        this.nextButton.setPlain(true);
        this.lastButton.setPlain(true);
        this.reloadButton.setPlain(true);
        this.buttonsEl = mini.append(this._barEl2,
                '<div class="mini-page-buttons"></div>');
        this.update()
    },
    setButtons : function(a) {
        __mini_setControls(a, this.buttonsEl, this)
    },
    getButtonsEl : function() {
        return this.buttonsEl
    },
    destroy : function(a) {
        if (this.pageSelect) {
            mini.clearEvent(this.pageSelect);
            this.pageSelect = null
        }
        if (this.numInput) {
            mini.clearEvent(this.numInput);
            this.numInput = null
        }
        this.sizeEl = null;
        this._leftEl = null;
        mini.Pager.superclass.destroy.call(this, a)
    },
    _initEvents : function() {
        mini.Pager.superclass._initEvents.call(this);
        this.firstButton.on("click", function(c) {
            this._OnPageChanged(0)
        }, this);
        this.prevButton.on("click", function(c) {
            this._OnPageChanged(this.pageIndex - 1)
        }, this);
        this.nextButton.on("click", function(c) {
            this._OnPageChanged(this.pageIndex + 1)
        }, this);
        this.lastButton.on("click", function(c) {
            this._OnPageChanged(this.totalPage)
        }, this);
        this.reloadButton.on("click", function(c) {
            this._OnPageChanged()
        }, this);
        function a() {
            if (b) {
                return
            }
            b = true;
            var c = parseInt(this.numInput.value);
            if (isNaN(c)) {
                this.update()
            } else {
                this._OnPageChanged(c - 1)
            }
            setTimeout(function() {
                b = false
            }, 100)
        }
        var b = false;
        mini.on(this.numInput, "change", function(c) {
            a.call(this)
        }, this);
        mini.on(this.numInput, "keydown", function(c) {
            if (c.keyCode == 13) {
                a.call(this);
                c.stopPropagation()
            }
        }, this);
        this.sizeCombo.on("valuechanged",
                this.__OnPageSelectChanged, this)
    },
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        mini.layout(this._leftEl);
        mini.layout(this._rightEl)
    },
    /**
     * 
     * function setPageIndex(pageIndex)
     * @member mini.Pager
     * @param {Number} pageIndex
     *
     */
    setPageIndex : function(a) {
        if (isNaN(a)) {
            return
        }
        this.pageIndex = a;
        this.update()
    },
    /**
     * 
     * function getPageIndex()
     * @member mini.Pager
     * @returns {Number}
     *
     */
    getPageIndex : function() {
        return this.pageIndex
    },
    /**
     * 
     * function setPageSize(pageSize)
     * @member mini.Pager
     * @param {Number} pageSize
     *
     */
    setPageSize : function(a) {
        if (isNaN(a)) {
            return
        }
        this.pageSize = a;
        this.update()
    },
    /**
     * 
     * function getPageSize()
     * @member mini.Pager
     * @returns {Number}
     *
     */
    getPageSize : function() {
        return this.pageSize
    },
    /**
     * 
     * function setTotalCount(totalCount)
     * @member mini.Pager
     * @param {Number} totalCount
     *
     */
    setTotalCount : function(a) {
        a = parseInt(a);
        if (isNaN(a)) {
            return
        }
        this.totalCount = a;
        this.update()
    },
    /**
     * 
     * function getTotalCount()
     * @member mini.Pager
     * @returns {Number}
     *
     */
    getTotalCount : function() {
        return this.totalCount
    },
    /**
     * 
     * function setSizeList(sizeList)
     * @member mini.Pager
     * @param {Array} sizeList
     *
     */
    setSizeList : function(a) {
        if (!mini.isArray(a)) {
            return
        }
        this.sizeList = a;
        this.update()
    },
    /**
     * 
     * function getSizeList()
     * @member mini.Pager
     * @returns {Array}
     *
     */
    getSizeList : function() {
        return this.sizeList
    },
    pageSizeWidth : 50,
    setPageSizeWidth : function(a) {
        a = parseInt(a);
        if (isNaN(a)) {
            return
        }
        if (this.pageSizeWidth != a) {
            this.pageSizeWidth = a;
            this.sizeCombo.setWidth(a)
        }
    },
    getPageSizeWidth : function() {
        return this.pageSizeWidth
    },
    /**
     * 
     * function setShowPageSize(showPageSize)
     * @member mini.Pager
     * @param {Boolean} showPageSize
     *
     */
    setShowPageSize : function(a) {
        this.showPageSize = a;
        this.update()
    },
    /**
     * 
     * function getShowPageSize()
     * @member mini.Pager
     * @returns {Boolean}
     *
     */
    getShowPageSize : function() {
        return this.showPageSize
    },
    /**
     * 
     * function setShowPageIndex(showPageIndex)
     * @member mini.Pager
     * @param {Boolean} showPageIndex
     *
     */
    setShowPageIndex : function(a) {
        this.showPageIndex = a;
        this.update()
    },
    /**
     * 
     * function getShowPageIndex()
     * @member mini.Pager
     * @returns {Boolean}
     *
     */
    getShowPageIndex : function() {
        return this.showPageIndex
    },
    setShowTotalCount : function(a) {
        this.showTotalCount = a;
        this.update()
    },
    getShowTotalCount : function() {
        return this.showTotalCount
    },
    /**
     * 
     * function setShowPageInfo(showPageInfo)
     * @member mini.Pager
     * @param {Boolean} showPageInfo
     *
     */
    setShowPageInfo : function(a) {
        this.showPageInfo = a;
        this.update()
    },
    /**
     * 
     * function getShowPageInfo()
     * @member mini.Pager
     * @returns {Boolean}
     *
     */
    getShowPageInfo : function() {
        return this.showPageInfo
    },
    /**
     * 
     * function setShowReloadButton(showReloadButton)
     * @member mini.Pager
     * @param {Boolean} showReloadButton
     *
     */
    setShowReloadButton : function(a) {
        this.showReloadButton = a;
        this.update()
    },
    /**
     * 
     * function getShowReloadButton()
     * @member mini.Pager
     * @returns {Boolean}
     *
     */
    getShowReloadButton : function() {
        return this.showReloadButton
    },
    /**
     * 获取总页数。<br/>
     * function getTotalPage()
     * @member mini.Pager
     * @returns {Number}
     *
     */
    getTotalPage : function() {
        return this.totalPage
    },
    /**
     * 更新分页控件状态。<br/>
     * function update(index, size, total)
     * @member mini.Pager
     * @param  index
     * @param  size
     * @param  total
     *
     */
    update : function(e, p, j) {
        if (mini.isNumber(e)) {
            this.pageIndex = parseInt(e)
        }
        if (mini.isNumber(p)) {
            this.pageSize = parseInt(p)
        }
        if (mini.isNumber(j)) {
            this.totalCount = parseInt(j)
        }
        this.totalPage = parseInt(this.totalCount
                / this.pageSize) + 1;
        if ((this.totalPage - 1) * this.pageSize == this.totalCount) {
            this.totalPage -= 1
        }
        if (this.totalCount == 0) {
            this.totalPage = 0
        }
        if (this.pageIndex > this.totalPage - 1) {
            this.pageIndex = this.totalPage - 1
        }
        if (this.pageIndex <= 0) {
            this.pageIndex = 0
        }
        if (this.totalPage <= 0) {
            this.totalPage = 0
        }
        this.firstButton.enable();
        this.prevButton.enable();
        this.nextButton.enable();
        this.lastButton.enable();
        if (this.pageIndex == 0) {
            this.firstButton.disable();
            this.prevButton.disable()
        }
        if (this.pageIndex >= this.totalPage - 1) {
            this.nextButton.disable();
            this.lastButton.disable()
        }
        this.numInput.value = this.pageIndex > -1 ? this.pageIndex + 1
                : 0;
        this.pagesLabel.innerHTML = "/ " + this.totalPage;
        var k = this.sizeList.clone();
        if (k.indexOf(this.pageSize) == -1) {
            k.push(this.pageSize);
            k = k.sort(function(l, i) {
                return l > i
            })
        }
        var o = [];
        for (var b = 0, a = k.length; b < a; b++) {
            var d = k[b];
            var c = {};
            c.text = d;
            c.id = d;
            o.push(c)
        }
        this.sizeCombo.setData(o);
        this.sizeCombo.setValue(this.pageSize);
        var f = this.firstText, h = this.prevText, n = this.nextText, g = this.lastText;
        if (this.showButtonText == false) {
            f = h = n = g = ""
        }
        this.firstButton.setText(f);
        this.prevButton.setText(h);
        this.nextButton.setText(n);
        this.lastButton.setText(g);
        var f = this.firstText, h = this.prevText, n = this.nextText, g = this.lastText;
        if (this.showButtonText == true) {
            f = h = n = g = ""
        }
        this.firstButton.setTooltip(f);
        this.prevButton.setTooltip(h);
        this.nextButton.setTooltip(n);
        this.lastButton.setTooltip(g);
        this.firstButton
                .setIconCls(this.showButtonIcon ? "mini-pager-first"
                        : "");
        this.prevButton
                .setIconCls(this.showButtonIcon ? "mini-pager-prev"
                        : "");
        this.nextButton
                .setIconCls(this.showButtonIcon ? "mini-pager-next"
                        : "");
        this.lastButton
                .setIconCls(this.showButtonIcon ? "mini-pager-last"
                        : "");
        this.reloadButton
                .setIconCls(this.showButtonIcon ? "mini-pager-reload"
                        : "");
        this.reloadButton.setVisible(this.showReloadButton);
        var m = this.reloadButton.el.previousSibling;
        if (m) {
            m.style.display = this.showReloadButton ? ""
                    : "none"
        }
        this._rightEl.innerHTML = String.format(
                this.pageInfoText, this.pageSize,
                this.totalCount);
        this.indexEl.style.display = this.showPageIndex ? ""
                : "none";
        this.sizeEl.style.display = this.showPageSize ? ""
                : "none";
        this._rightEl.style.display = this.showPageInfo ? ""
                : "none"
    },
    __OnPageSelectChanged : function(b) {
        var a = parseInt(this.sizeCombo.getValue());
        this._OnPageChanged(0, a)
    },
    _OnPageChanged : function(a, b) {
        var c = {
            pageIndex : mini.isNumber(a) ? a : this.pageIndex,
            pageSize : mini.isNumber(b) ? b : this.pageSize,
            cancel : false
        };
        if (c.pageIndex > this.totalPage - 1) {
            c.pageIndex = this.totalPage - 1
        }
        if (c.pageIndex < 0) {
            c.pageIndex = 0
        }
        this.fire("beforepagechanged", c);
        if (c.cancel == true) {
            return
        }
        this.fire("pagechanged", c);
        this.update(c.pageIndex, c.pageSize)
    },
    onPageChanged : function(b, a) {
        this.on("pagechanged", b, a)
    },
    getAttrs : function(el) {
        var attrs = mini.Pager.superclass.getAttrs.call(this,
                el);
        mini._ParseString(el, attrs, [ "onpagechanged",
                "sizeList", "onbeforepagechanged", "buttons" ]);
        mini._ParseBool(el, attrs, [ "showPageIndex",
                "showPageSize", "showTotalCount",
                "showPageInfo", "showReloadButton" ]);
        mini._ParseInt(el, attrs, [ "pageIndex", "pageSize",
                "totalCount", "pageSizeWidth" ]);
        if (typeof attrs.sizeList == "string") {
            attrs.sizeList = eval(attrs.sizeList)
        }
        if (attrs.buttons) {
            attrs.buttons = mini.byId(attrs.buttons)
        }
        return attrs
    }
});
mini.regClass(mini.Pager, "pager");