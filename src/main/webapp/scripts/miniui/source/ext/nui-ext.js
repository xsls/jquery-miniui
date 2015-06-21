(function(c) {
    // 重写 mini.getClassByUICls() 方法，支持名称为 nui-* 的样式类
    c.getClassByUICls = function(e) {
        e = e.toLowerCase();
        var d = this.uiClasses[e];
        if (!d) {
            e = e.replace("nui-", "mini-");
            d = this.uiClasses[e]
        }
        return d
    };
    
    // 修改日期控件的默认格式
    c.DatePicker.prototype.valueFormat = "yyyy-MM-dd HH:mm:ss";
    c.ajax = function(e) {
        var d = e.url;
        if (d && d.length > 4 && d.lastIndexOf(".ext") == d.length - 4) {
            if (!e.dataType) {
                e.dataType = "json"
            }
            if (!e.contentType) {
                e.contentType = "application/json; charset=UTF-8"
            }
            if (e.data && mini.isNull(e.data.pageIndex) == false) {
                var f = e.data.page = {};
                f.begin = e.data.pageIndex * e.data.pageSize;
                f.length = e.data.pageSize
            }
            if (e.dataType == "json" && typeof (e.data) == "object") {
                e.data = mini.encode(e.data);
                if (e.data == "{}") {
                    delete e.data
                }
                e.type = "POST"
            }
        }
        return window.jQuery.ajax(e)
    };
    
    /**
     * 通用工具方法的命名空间，该命名空间下主要定义了如下方法：
     * <ul>
     * <li>contains(String str1, String str2)  检查字符串中是否包含另外一个字符串  </li>
     * <li>endWidth(String str1, String str2)  查检字符串是否以另外一个字符串结尾  </li>
     * <li>startWidth(String str1, String str2)  查检字符串是否以另外一个字符串开始</li>
     * </ul>
     * @member mini
     * @property fn
     * @static
     */
    c.fn = {
        /**
         * 检查字符串中是否包含另外一个字符串
         * @param {String} str1 原字符串
         * @param {String} str2 被包含的字符串
         * @returns {Boolean} 如果包含，则返回 true， 否则返回 false
         * @member mini.fn
         */
        contains : function(str1, str2) {
            return ("," + str1 + ",").indexOf("," + str2 + ",") != -1
        },
        /**
         * 查检字符串是否以另外一个字符串结尾
         * @param {String} str1 原字符串
         * @param {String} str2 结尾字符串
         * @returns {Boolean} 如果是以指定字符串结尾，则返回 true， 否则返回 false
         * @member mini.fn
         */
        endWidth : function(str1, str2) {
            if (str1.length < str2.length) {
                return false
            }
            return str1.substr(str1.length - str2.length) === str2
        },
        /**
         * 查检字符串是否以另外一个字符串开始
         * @param {String} str1 原字符串
         * @param {String} str2 开头字符串
         * @returns {Boolean} 如果是以指定字符串开头，则返回 true， 否则返回 false
         * @member mini.fn
         */
        startWidth : function(str1, str2) {
            return str1.substr(0, str2.length) === str2
        }
    };
    var b = jQuery;
    var a = {
        map : {},
        loaded : {},
        timeSeed : true,
        path : "",
        /**
         * 判断指定传入的路径是否为绝对路径
         * @param {String} path 要进行判断的路径
         * @returns {Boolean} 如果传入的路径以 http 或 / 开头，则返回 true， 否则返回 false
         */
        isAbsolutePath : function(path) {
            return c.fn.startWidth(path, "http") || c.fn.startWidth(path, "/")
        },
        /**
         * 获取 JS 文件所在目录对应的的路径
         * @param {String} fileName JS 文件名称
         * @returns {String} JS 文件所在目录对应的的路径，如果没有引入相应的 JS 文件，则返回一个空字符串
         */
        getJSPath : function(fileName) {
            var e = document.scripts;
            for (var g = 0, d = e.length; g < d; g++) {
                var j = e[g].src;
                j = j.split("?")[0];
                var f = c.fn.endWidth(j, fileName);
                if (f) {
                    return j.substr(0, j.lastIndexOf("/")) + "/"
                }
            }
            return ""
        },
        hasLoaded : function(d) {
            return this.loaded[d]
        },
        getLoadInfo : function(d) {
            return this.loaded[d]
        },
        loadCSS : function(e) {
            if (!b.isArray(e)) {
                e = [ e ]
            }
            for (var f = 0, d = e.length; f < d; f++) {
                this.loadCSS(e[f])
            }
        },
        loadJS : function(k, f, e) {
            if (!b.isArray(k)) {
                k = [ k ]
            }
            var d = k.length;
            var j = 0;
            if (e) {
                var h = function(m, l) {
                    a._loadJS(k[m], function() {
                        m++;
                        if (m < d) {
                            h(m, l)
                        } else {
                            l()
                        }
                    })
                };
                h(0, f)
            } else {
                for (var g = 0; g < d; g++) {
                    a._loadJS(k[g], function() {
                        j++;
                        if (j == d) {
                            f()
                        }
                    })
                }
            }
        },
        _loadCSS : function(e, f) {
            if (this.getLoadInfo(e)) {
                return
            }
            f = f || document;
            var d = f.createElement("link");
            d.type = "text/css";
            if (NUI.timeSeed) {
                d.href = e + "?" + (new Date())
            } else {
                d.href = e
            }
            d.rel = "stylesheet";
            f.getElementsByTagName("head")[0].appendChild(d);
            this.loaded[e] = true;
            return d
        },
        _loadJS : function(h, d, g) {
            d = d || function() {
            };
            if (!a.isAbsolutePath(h)) {
                h = a.path + h
            }
            var e = this.getLoadInfo(h);
            if (e) {
                switch (e.status) {
                case "loading":
                    e.handler.push(d);
                    break;
                case "loaded":
                    d();
                    break
                }
                return
            } else {
                this.loaded[h] = {
                    status : "loading",
                    handler : [ d ]
                }
            }
            g = g || document;
            var f = g.createElement("script");
            f.type = "text/javascript";
            if (this.timeSeed) {
                f.src = h + "?" + (new Date())
            } else {
                f.src = h
            }
            f.onreadystatechange = f.onload = function() {
                if (!this.readyState
                        || (this.readyState == "complete" || this.readyState == "loaded")) {
                    a.loaded[h] = a.loaded[h] || {};
                    a.loaded[h].status = "loaded";
                    var k = a.loaded[h].handler;
                    for (var l = 0, j = k.length; l < j; l++) {
                        var m = k[l];
                        if (m && typeof (m) == "function") {
                            m()
                        }
                    }
                }
            };
            g.getElementsByTagName("head")[0].appendChild(f);
            return f
        }
    };
    
    // nui.js 文件所在目录的路径
    a.path = a.getJSPath("nui.js");

    /**
     * JS、CSS 等资源模块化管理的命名空间，该命名空间下主要定义了如下方法：
     * <ul>
     * <li>hasLoaded(String module)  检查指定模块是否已经被加载                    </li>
     * <li>add(String module, Object modConfig)  新增模块                          </li>
     * <li>remove(String module)  移除模块                                         </li>
     * <li>get(String module)  获取模块                                            </li>
     * <li>load(String module)  加载模块的 JS、CSS 等资源文件，别名为 mini.loadRes </li>
     * </ul>
     * @member mini
     * @property {Object} res
     * @static
     */
    c.res = {
        /**
         * 检查指定模块是否已经被加载
         * @param {String} module 模块名称
         * @returns {Object} 如果已经加载过了，则返回对应的模块，否则返回 undefined
         */
        hasLoaded : function(module) {
            return a.loaded[module]
        },
        /**
         * 新增模块
         * @param {String} module 模块名称
         * @param {Object} modConfig 模块
         * @param {String[]} modConfig.css CSS 文件路径
         * @param {String[]} modConfig.js JS 文件路径
         * @param {Boolean} modConfig.order 是否顺序加载
         */
        add : function(module, modConfig) {
            modConfig = modConfig || {};
            modConfig.js = modConfig.js || [];
            modConfig.css = modConfig.css || [];
            modConfig.order = modConfig.order || false;
            a.map[module] = modConfig
        },
        /**
         * 移除模块
         * @param ${String} module 模块名称
         */
        remove : function(module) {
            delete a.map[module]
        },
        /**
         * 获取模块
         * @param ${String} module 模块名称
         * @returns {Object} 对应的模块
         * @returns {String[]} return.css CSS 文件路径
         * @returns {String[]} return.js JS 文件路径
         * @returns {Boolean} return.order 是否顺序加载
         */
        get : function(module) {
            return a.map[module]
        },
        /**
         * 加载模块的 JS、CSS 等资源文件
         * @param {String} module 模块名称
         * @param {Function} callback 加载完成后的回调函数
         */
        load : function(module, callback) {
            var e = this.get(module);
            if (!e) {
                callback();
                return
            }
            a.loadCSS(e.css);
            a.loadJS(e.js, callback, e.order)
        }
    };
    
    /**
     * 加载指定模块的 JS 和 CSS 资源文件。如果使用的是相对路径，其参数路径为 nui.js 文件所在的目录路径
     * @method loadRes
     * @param {String} module 模块名称
     * @param {Function} callback 加载完成后的回调函数
     * @member mini
     * @static
     * @alias mini.res.load
     */
    c.loadRes = function(module, callback) {
        c.res.load(module, callback)
    };
    
    /* 定义 ckeditor 和 swfupload 模块 */
    c.res.add("ckeditor", {
        js : [ "resource/ckeditor/ckeditor.js" ]
    });
    c.res.add("swfupload", {});
    
    /**
     * @class nui
     * @singleton
     * @alias mini
     */
    window.nui = c
})(mini);