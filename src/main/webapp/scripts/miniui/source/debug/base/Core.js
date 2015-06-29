/**
 * MiniUI 的全局变量。别名为 nui
 * @class
 * @singleton
 */
mini = {
    /**
     * 所有组件 id 与组件实例的对应关系
     * @property {Object} [components={}] 
     * @protected
     */
    components : {},
    /**
     * 所有组件实例的 uid 与组件实例映射关系
     * @property {Object} [uids={}]
     * @protected
     */
    uids : {},
    /**
     * 所有用户自定义控件
     * @property {Object} [ux={}]
     * @protected
     */
    ux : {},
    /**
     * Document 对象
     * @property {Document} [doc=document]
     */
    doc : document,
    /**
     * Window 对象
     * @property {Window} [window=window]
     */
    window : window,
    /**
     * 是否已就绪
     * @property {Boolean} [isReady=false]
     * @readonly
     */
    isReady : false,
    /**
     * 根据样式类获取对应的 DOM 节点
     * @param {String} className 样式类名称
     * @param {String/HTMLElement/jQuery} [parent] 父节点的 ID，值为 MiniUI 控件的 ID
     * @returns {HTMLElement} 符合条件的第一个 DOM 节点
     */
    byClass : function(className, parent) {
        if (typeof parent == "string") {
            parent = mini.byId(parent)
        }
        return jQuery("." + className, parent)[0]
    },
    /**
     * 获取所有控件实例
     * @returns {mini.Control[]} 所有控件
     */
    getComponents : function() {
        var a = [];
        for ( var d in mini.components) {
            var b = mini.components[d];
            if (b.isControl) {
                a.push(b)
            }
        }
        return a
    },

    /**
     * 根据 id 获取 MiniUI 组件实例，寻找规则：
     * <ol>
     * <li>如果传入的 id 为空或 `undefined`，则返回 null</li>
     * <li>如果传入的 id mini.Control 实例对象，则直接返回传入的控件实例</li>
     * <li>如果传入的 id 是一个字符串，则根据 ID 寻找对应的组件</li>
     * <li>如果传入的 id 是一个 DOM 树的 Element 节点，则根据该节点的 uid 属性寻找对应的组件</li>
     * <li>其他情况返回 null</li>
     * </ol>
     * @param {String/mini.Control/HTMLElement} sel 选择器
     * @returns {mini.Component} 对应的 MiniUI 组件实例，如果没有找到，则返回 null
     */
    get : function(id) {
        // 如果传入的参数为空，则返回 null
        if (!id) {
            return null
        }
        
        // 如果传入的对象是 MiniUI 的控件，则直接返回传入的控件实例
        if (mini.isControl(id)) {
            return id
        }
        
        // 如果传入的是一个字符串，则根据 ID 寻找对应的组件
        if (typeof id == "string") {
            if (id.charAt(0) == "#") {
                id = id.substr(1)
            }
        }
        
        if (typeof id == "string") {
            return mini.components[id]
        } else { // 根据传入参数的 uid 属性寻找对应的控件
            var a = mini.uids[id.uid];
            if (a && a.el == id) {
                return a
            }
        }
        return null
    },
    /**
     * 根据 uid 获取控件实例
     * @param {String} uid 组件的 UID 属性值
     * @returns {mini.Component} 对应的控件实例，如果没有找到，则返回 `undefined`
     */
    getbyUID : function(uid) {
        return mini.uids[uid]
    },
    /**
     * 查找符合条件的控件，如果需要获取所有的 MiniUI 控件，可以调用 {@link mini#getComponents} 方法
     * @param {Function} filter 判断传入的组件是否符合要求的函数。如果 `filter` 的值为 `null` 或 `undefined`，将直接返回一个长度为 0 的空数组。
     * @param {mini.Component} filter.comp 当前控件对象
     * @param {Boolean} filter.return 如果返回 true 则保留当前控件对象，否则将被过滤掉
     * @param {Object} [context=mini] 调用 filter 函数时的上下文，即 `filter` 函数方法体中 `this` 指向的对象
     * @returns {mini.Component[]} 所有符合条件的控件数组，如果没有任何符合条件的控件，将返回一个长度为 0 的空数组
     */
    findControls : function(filter, context) {
        if (!filter) {
            return []
        }
        context = context || mini;
        var a = [];
        var f = mini.uids;
        for ( var c in f) {
            var g = f[c];
            var b = filter.call(context, g);
            if (b === true || b === 1) {
                a.push(g);
                if (b === 1) {
                    break
                }
            }
        }
        return a
    },
    /**
     * 获取父控件下的所有子控件
     * @param {mini.Control/HTMLElement} parent 父控件
     * @returns {mini.Control[]} 所有子控件
     */
    getChildControls : function(parent) {
        var c = parent.el ? parent.el : parent;
        var a = mini.findControls(function(d) {
            if (!d.el || parent == d) {
                return false
            }
            if (mini.isAncestor(c, d.el) && d.within) {
                return true
            }
            return false
        });
        return a
    },
    /**
     * 空方法
     */
    emptyFn : function() {
    },
    /**
     * 将父控件下的所有子控件与其进行关联。<br>
     * 将前缀（_）加子控件的名称作为父控件的属性名，子控件实例作为对应的属性值，关联后可以通过 `control._childName` 取到对应的子控件
     * @param {mini.Control} control 父控件
     * @param {String} [prefix="_"] 前缀
     * @returns 关联了子控件后的父控件
     */
    createNameControls : function(control, prefix) {
        if (!control || !control.el) {
            return
        }
        if (!prefix) {
            prefix = "_"
        }
        var f = control.el;
        var b = mini.findControls(function(c) {
            if (!c.el || !c.name) {
                return false
            }
            if (mini.isAncestor(f, c.el)) {
                return true
            }
            return false
        });
        for (var e = 0, a = b.length; e < a; e++) {
            var j = b[e];
            var d = prefix + j.name;
            if (prefix === true) {
                d = j.name[0].toUpperCase()
                        + j.name.substring(1, j.name.length)
            }
            control[d] = j
        }
    },

    /**
     * 根据控件名称获取多个 MiniUI 控件
     * @param {String} name 控件名称
     * @param {String/mini.Control/HTMLElement} [parent=document.body] 父控件，用于限定获取控件的范围。<br>
     *      如果传入的值是一个字符串，则为父节点的 ID。
     * @returns {mini.Control[]} 对应的 MiniUI 控件数组，如果没有任何符合条件的控件，将返回一个长度为 0 的空数组
     */
    getsbyName : function(name, parent) {
        var b = mini.isControl(parent);
        var e = parent;
        if (parent && b) {
            parent = parent.el
        }
        parent = mini.byId(parent);
        parent = parent || document.body;
        var c = mini.findControls(function(g) {
            if (!g.el) {
                return false
            }
            if (g.name == name && mini.isAncestor(parent, g.el)) {
                return true
            }
            return false
        }, this);
        if (b && c.length == 0 && e && e.getbyName) {
            var f = e.getbyName(name);
            if (f) {
                c.push(f)
            }
        }
        return c
    },
    /**
     * 根据控件名称获取单个 MiniUI 控件
     * @param {String} name 控件名称
     * @param {String/mini.Control/HTMLElement} [parent=document.body] 父控件，用于限定获取控件的范围。<br>
     *      如果传入的值是一个字符串，则为父节点的 ID。
     * @returns {mini.Control} 对应的 MiniUI 控件
     */
    getbyName : function(name, parent) {
        return mini.getsbyName(name, parent)[0]
    },
    /**
     * 获取 URL 中的所有参数
     * @param {String} [url=location.href] 要解析的 URL
     * @returns {Object} 包含所有参数名称和参数值的 Object
     */
    getParams : function(url) {
        if (!url) {
            url = location.href
        }
        url = url.split("?")[1];
        var g = {};
        if (url) {
            var e = url.split("&");
            for (var d = 0, a = e.length; d < a; d++) {
                var f = e[d].split("=");
                try {
                    g[f[0]] = decodeURIComponent(unescape(f[1]))
                } catch (c) {
                }
            }
        }
        return g
    },
    /**
     * 注册一个 MiniUI 组件
     * @param {mini.Component} comp 需要注册的 MiniUI 组件
     */
    reg : function(comp) {
        this.components[comp.id] = comp;
        this.uids[comp.uid] = comp
    },
    /**
     * 注销一个 MiniUI 组件
     * @param {mini.Component} comp 需要注销的 MiniUI 组件
     */
    unreg : function(comp) {
        delete mini.components[comp.id];
        delete mini.uids[comp.uid]
    },
    /**
     * 组件类名称与 MiniUI 控件定义的对应关系
     * @property {Object} [classes={}] 
     * @protected
     */
    classes : {},
    /**
     * uiClass 与 MiniUI 控件定义的对应关系
     * @property {Object} [uiClasses={}] 
     * @protected
     */
    uiClasses : {},
    /**
     * 根据组件类名称获取对应的 MiniUI 组件定义
     * @param {String} className 组件类名称（全小写，不带前缀 mini-）
     * @returns {Function} 对应的 MiniUI 控件定义
     */
    getClass : function(className) {
        if (!className) {
            return null
        }
        return this.classes[className.toLowerCase()]
    },
    /**
     * 根据 uiClass 获取对应的 MiniUI 组件定义
     * @param {String} uiCls uiClass，一般前缀（mini-）加上样式类名称，如： mini-button
     * @returns {Function} 对应的 MiniUI 组件定义
     */
    getClassByUICls : function(a) {
        return this.uiClasses[a.toLowerCase()]
    },
    /**
     * MiniUI 控件 ID 的前缀
     * @property {String} [idPre="mini-"] 
     */
    idPre : "mini-",
    /**
     * 全局的 ID 索引
     * @property {Number} [idIndex=1] 
     * @readonly
     */
    idIndex : 1,
    /**
     * 生成一个新的控件 ID
     * @param {String} idPrefix ID 前缀
     * @returns {String} 新生成的控件 ID
     */
    newId : function(idPrefix) {
        return (idPrefix || this.idPre) + this.idIndex++
    },
    /**
     * 对象浅复制，将 `source` 中的所有属性都复制给 `dest`。
     * @param {Object} dest 目标对象
     * @param {Object} source 源对象
     * @returns {Object} `dest` 对象
     */
    copyTo : function(dest, source) {
        if (dest && source) {
            for ( var a in source) {
                dest[a] = source[a]
            }
        }
        return dest
    },
    /**
     * 对象浅复制，将 `source` 中所有在 `dest` 中为 `null` 或 `undefined` 的属性都复制给 `dest`。
     * @param {Object} dest 目标对象
     * @param {Object} source 源对象
     * @returns {Object} `dest` 对象
     */
    copyIf : function(c, b) {
        if (c && b) {
            for ( var a in b) {
                if (mini.isNull(c[a])) {
                    c[a] = b[a]
                }
            }
        }
        return c
    },
    /**
     * 委托执行指定的函数，即改变方法体内 `this` 的指向
     * @param {Function} fn 需要进行委托调用的函数
     * @param {Object} target 委托的目标对象，即委托函数方法体中 `this` 所指向的对象
     * @returns {Function} 委托函数
     */
    createDelegate : function(fn, target) {
        if (!fn) {
            return function() {
            }
        }
        return function() {
            return fn.apply(target, arguments)
        }
    },
    /**
     * 判断传入的对象是否为 MiniUI 的控件
     * @param {Object} obj 要进行检测的对象
     * @returns {Boolean} 如果传入的对象是 MiniUI 的控件，则返回 `true`， 否则返回 `false`
     */
    isControl : function(obj) {
        return !!(obj && obj.isControl)
    },
    /**
     * 判断传入的对象是否为 DOM 树的 Element 节点
     * @param {Object} obj 要进行检测的对象
     * @returns {Boolean} 如果传入的对象是 DOM 树的 HTMLElement 节点，则返回 `true`， 否则返回 `false`
     */
    isElement : function(a) {
        return a && a.appendChild
    },
    /**
     * 判断传入的对象是否为日期
     * @param {Object} obj 要进行检测的对象
     * @returns {Boolean} 如果传入的对象是日期，则返回 `true`， 否则返回 `false`
     */
    isDate : function(obj) {
        return !!(obj && obj.getFullYear)
    },
    /**
     * 判断传入的对象是否为数组
     * @param {Object} obj 要进行检测的对象
     * @returns {Boolean} 如果传入的对象是数组，则返回 `true`， 否则返回 `false`
     */
    isArray : function(obj) {
        return !!(obj && !!obj.unshift)
    },
    /**
     * 判断传入的对象是否为空对象
     * @param {Object} obj 要进行检测的对象
     * @returns {Boolean} 如果传入的对象是空对象（`null` 或 `undefined`），则返回 `true`， 否则返回 `false`
     */
    isNull : function(obj) {
        return obj === null || obj === undefined
    },
    /**
     * 判断传入的对象是否为数字
     * @param {Object} obj 要进行检测的对象
     * @returns {Boolean} 如果传入的对象是数字，则返回 `true`， 否则返回 `false`
     */
    isNumber : function(obj) {
        return !isNaN(obj) && typeof obj == "number"
    },
    /**
     * 判断两个对象的值是否相等，判断是否相等的规则：
     * <ul>
     * <li>`null`、`undefined` 和空字符串被认为相等</li>
     * <li>两个日期的时间毫秒数相等时，被认为相等</li>
     * <li>两个对象指向同一个引用，被认为相等</li>
     * <li>两个对象转为字符串（`toString()`）时，转换后的字符串相等时，被认为相等</li>
     * </ul>
     * @param {Object} obj1 要进行比较的第一个对象
     * @param {Object} obj2 要进行比较的第二个对象
     * @returns {Boolean} 如果传入的两个对象的值相等，，则返回 `true`， 否则返回 `false`
     */
    isEquals : function(obj1, obj2) {
        if (obj1 !== 0 && obj2 !== 0) {
            if ((mini.isNull(obj1) || obj1 == "") && (mini.isNull(obj2) || obj2 == "")) {
                return true
            }
        }
        if (obj1 && obj2 && obj1.getFullYear && obj2.getFullYear) {
            return obj1.getTime() === obj2.getTime()
        }
        if (typeof obj1 == "object" && typeof obj2 == "object") {
            return obj1 === obj2
        }
        return String(obj1) === String(obj2)
    },
    /**
     * 对数组进行遍历
     * @param {Array} items 需要例遍的数组
     * @param {Function} callback 每个元素执行的回调函数
     * @param {Object} callback.obj 当前被迭代的对象
     * @param {Number} callback.index 索引，从 0 开始
     * @param {Boolean} callback.return 如果返回 `false` 则会中止循环
     * @param {Object} scope 回调函数的上下文，即回调函数方法体中 `this` 所指向的对象
     */
    forEach : function(items, callback, scope) {
        var d = items.clone();
        for (var b = 0, a = d.length; b < a; b++) {
            var e = d[b];
            if (callback.call(scope, e, b, items) === false) {
                break
            }
        }
    },
    /**
     * 对数组进行排序
     * @param {Array} array 要进行排序的数组
     * @param {Function} fn 用来确定元素顺序的函数
     * @param {Object} fn.obj1 第 1 个比较对象
     * @param {Object} fn.obje2 第 2 个比较对象
     * @param {Number} fn.return 该函数必须返回下列值之一：
     *  <ul>
     *      <li><b>负数</b> &#45; 如果所传递的第一个参数比第二个参数小</li>
     *      <li><b>0</b> &#45; 如果两个参数相等</li>
     *      <li><b>正数</b> &#45; 如果第一个参数比第二个参数大</li>
     *  </ul>
     * @param a
     */
    sort : function(array, fn, a) {
        a = a || array;
        array.sort(fn)
    },
    /**
     * 从DOM中删除所有匹配的元素
     * @param {String/HTMLElement/jQuery} selector jQuery 选择器
     * @returns {jQuery} 匹配元素对应的 jQuery 实例
     */
    removeNode : function(selector) {
        jQuery(selector).remove()
    },
    /**
     * 包装控件的外层 HTMLElement 节点
     * @property {HTMLElement} [elWarp=DIV] 
     */
    elWarp : document.createElement("div")
};

//MiniUI 调试模式
if (typeof mini_debugger == "undefined") {
    mini_debugger = true
}
if (typeof mini_useShims == "undefined") {
    mini_useShims = false
}

/**
 * 注册 miniUI 控件类
 * @param clazz {Function} 类定义。如： `mini.Button`
 * @param type {String} 样式类。如： `"button"`
 * @member Window
 */
mini_regClass = function(clazz, type) {
    type = type.toLowerCase();
    if (!mini.classes[type]) {
        mini.classes[type] = clazz;
        clazz.prototype.type = type
    }
    var uiCls = clazz.prototype.uiCls;
    if (!mini.isNull(uiCls) && !mini.uiClasses[uiCls]) {
        mini.uiClasses[uiCls] = clazz
    }
};

/**
 * 属性和方法继承
 * @param {Function} clazz 子类，如：`mini.Button`
 * @param {Function} parent 父类，如：`mini.Control`
 * @param {Object} proto 要追加到子类的 prototype 上的其他属性对象
 * @returns 设置了继承关系后的子类
 * @member Window
 */
mini_extend = function(clazz, parent, proto) {
    if (typeof parent != "function") {
        return this
    }
    var g = clazz, d = g.prototype, a = parent.prototype;
    if (g.superclass == a) {
        return
    }
    g.superclass = a;
    g.superclass.constructor = parent;
    for ( var c in a) {
        d[c] = a[c]
    }
    if (proto) {
        for ( var c in proto) {
            d[c] = proto[c]
        }
    }
    return g
};

mini.copyTo(mini, {
    /**
     * @method extend
     * @member mini
     * @alias Window#mini_extend
     */
    extend : mini_extend,
    /**
     * @method regClass
     * @member mini
     * @alias Window#mini_regClass
     */
    regClass : mini_regClass,
    /**
     * @property {Boolean} [debug=false] 是否开启调试，值为 true 时，如果发起 ajax 请求出现错误，则会 alert 对应的错误代码
     * @member mini
     */
    debug : false
});

/**
 * @method namespace 声明一个命名空间
 * @param {String} ns 命名空间的名称，如：my.ns.hello
 * @member mini
 */
mini.namespace = function(ns) {
    if (typeof ns != "string") {
        return
    }
    ns = ns.split(".");
    var d = window;
    for (var c = 0, a = ns.length; c < a; c++) {
        var b = ns[c];
        var e = d[b];
        if (!e) {
            e = d[b] = {}
        }
        d = e
    }
};

mini._BindCallbacks = [];
mini._BindEvents = function(callback, scope) {
    mini._BindCallbacks.push([ callback, scope ]);
    if (!mini._EventTimer) {
        mini._EventTimer = setTimeout(function() {
            mini._FireBindEvents()
        }, 50)
    }
};
mini._FireBindEvents = function() {
    for (var i = 0, len = mini._BindCallbacks.length; i < len; i++) {
        var c = mini._BindCallbacks[i];
        c[0].call(c[1])
    }
    mini._BindCallbacks = [];
    mini._EventTimer = null
};

/**
 * 根据方法名获取对应的方法
 * @method _getFunctoin
 * @param {String} functionName 方法名，如："mini.get"
 * @returns {Function} 对应的方法，如果方法不存在，则返回 `null`
 * @member mini
 * @private
 */
mini._getFunctoin = function(functionName) {
    if (typeof functionName != "string") {
        return null
    }
    var parts = functionName.split(".");
    var d = null;
    for (var i = 0, len = parts.length; i < len; i++) {
        var b = parts[i];
        if (!d) {
            d = window[b]
        } else {
            d = d[b]
        }
        if (!d) {
            break
        }
    }
    return d
};
/**
 * 获取键值对对象
 * @method _getMap
 * @param {String} name 属性名称
 * @param {String} obj 源对象
 * @returns {Object} 对应对象，如果不存在则返回 `null`
 * @member mini
 * @private
 */
mini._getMap = function(name, obj) {
    if (!name) {
        return null
    }
    var index = name.indexOf(".");
    if (index == -1 && name.indexOf("[") == -1) {
        return obj[name]
    }
    if (index == (name.length - 1)) {
        return obj[name]
    }
    var s = "obj." + name;
    try {
        var v = eval(s)
    } catch (e) {
        return null
    }
    return v
};
mini._setMap = function(a, m, e) {
    if (!e) {
        return
    }
    if (typeof a != "string") {
        return
    }
    var k = a.split(".");
    function g(r, p, o, n) {
        var l = r[p];
        if (!l) {
            l = r[p] = []
        }
        for (var q = 0; q <= o; q++) {
            var s = l[q];
            if (!s) {
                if (n === null || n === undefined) {
                    s = l[q] = {}
                } else {
                    s = l[q] = n
                }
            }
        }
        return r[p][o]
    }
    var c = null;
    for (var f = 0, d = k.length; f <= d - 1; f++) {
        var a = k[f];
        if (f == d - 1) {
            if (a.indexOf("]") == -1) {
                e[a] = m
            } else {
                var b = a.split("[");
                var j = b[0], h = parseInt(b[1]);
                g(e, j, h, "");
                e[j][h] = m
            }
            break
        }
        if (a.indexOf("]") == -1) {
            c = e[a];
            if (f <= d - 2 && c == null) {
                e[a] = c = {}
            }
            e = c
        } else {
            var b = a.split("[");
            var j = b[0], h = parseInt(b[1]);
            e = g(e, j, h)
        }
    }
    return m
};
/**
 * 获取或创建组件
 * @method getAndCreate
 * @param {String/mini.Control/HTMLElement/Object} param 参数，为不同类型时表示的含义分别如下：<ul>
 * <li>`String` &#45; 组件的 id</li>
 * <li>`mini.Control` &#45; 组件，将直接返回此组件</li>
 * <li>`HTMLElement` &#45; 根据 DOM 节点的 uid 属性寻找对应的组件</li>
 * <li>`Object` &#45; 创建组件实例的选项，具体请参见 {@link #create} 方法中的参数描述</li>
 * </ul>
 * @returns {mini.Control} 控件对象，如果不存在则返回 `null` 或 `undefined`
 * @member mini
 */
mini.getAndCreate = function(param) {
    if (!param) {
        return null
    }
    if (typeof param == "string") {
        return mini.components[param]
    }
    if (typeof param == "object") {
        if (mini.isControl(param)) {
            return param
        } else {
            if (mini.isElement(param)) {
                return mini.uids[param.uid]
            } else {
                return mini.create(param)
            }
        }
    }
    return null
};
/**
 * 创建一个组件实例，如果已经存在 id 相同的组件，则会返回已存在的那个组件
 * @method create
 * @param {Object} options 选项，必须包含 id 和 type 属性
 * @param {String} options.id 组件的 id
 * @param {String} options.type 组件的类名，如：`"mini.Button"`
 * @returns {mini.Control} 控件对象，如果 `options` 或 `options.type` 无效，则返回 `null`
 * @member mini
 */
mini.create = function(options) {
    if (!options) {
        return null
    }
    if (mini.get(options.id) === options) {
        return options
    }
    var className = this.getClass(options.type);
    if (!className) {
        return null
    }
    var control = new className();
    control.set(options);
    return control
};


/**
 * MiniUI 组件定义，所有的 MiniUI 控件都是 Component 的子类
 * @class mini.Component
 * @abstract
 */
mini.Component = function() {
    /**
     * 绑定的事件
     * @property {Object}
     * @private
     */
    this._events = {};
    /**
     * UID，内置的组件唯一标识
     * @property {String}
     */
    this.uid = mini.newId(this._idPre);
    this._id = this.uid;
    if (!this.id) {
        this.id = this.uid
    }
    mini.reg(this)
};
mini.Component.prototype = {
    /**
     * 当前组件是否为 mini.Control 的实例
     * @property {Boolean} [isControl=true]
     * @readonly
     */
    isControl : true,
    /**
     * @cfg {String} 控件唯一标识符。<br>
     * <b>重要提示：</b>每个组件实例只允许调用一次 {@link #setId} 方法，再次调用时会抛出异常
     * @accessor
     */
    id : null,
    /**
     * 生成的 UID 前缀
     * @property {String} [_idPre="mini-"] 
     * @private
     */
    _idPre : "mini-",
    /**
     * 是否已经调用过 {@link #setId} 方法设置过 ID 了
     * @property {Boolean} [_idSet=false] 
     * @private
     */
    _idSet : false,
    /**
     * 是否可以通过调用 fire 方法触发指定事件
     * @property {Boolean} [_canFire=true] 
     * @private
     */
    _canFire : true,

    /**
     * 批量设置组件的属性和事件
     * 
     *     @example
     *     control.set({
     *         visible: false,
     *         width: 200,
     *         onclick: functoin(e){
     *         }
     *     });
     *     
     * @param {Object} options 需要设置的属性对象 
     * @param {String/HTMLElement} options.render 需要追加到哪个 DOM 节点中， 与 `renderTo` 等价
     * @param {Object} options.xxx 如果存在对应的 `set` 方法，则调用其 `set` 方法，反之则直接为对象设置属性（`this[xxx] = value`）
     * @param {Function} options.onxxx 需要绑定的事件，`xxx` 为事件类型
     * @param {Object} options.onxxx.event 事件对象
     * @param {String} options.onxxx.event.type 事件类型
     * @param {Object} options.onxxx.event.source 事件源
     * @param {Object} options.onxxx.event.sender 事件发送者
     * @returns {mini.Component} this
     * @chainable
     */
    set : function(options) {
        if (typeof options == "string") {
            return this
        }
        var d = this._allowLayout;
        this._allowLayout = false;
        var f = options.renderTo || options.render;
        delete options.renderTo;
        delete options.render;
        for ( var b in options) { // 绑定事件
            if (b.toLowerCase().indexOf("on") == 0) {
                if (this["_$" + b]) {
                    continue
                }
                var c = options[b];
                this.on(b.substring(2, b.length).toLowerCase(), c);
                delete options[b]
            }
        }
        for ( var b in options) { // 设置属性
            var a = options[b];
            var h = "set" + b.charAt(0).toUpperCase()
                    + b.substring(1, b.length);
            var g = this[h];
            if (g) {
                g.call(this, a)
            } else {
                this[b] = a
            }
        }
        if (f && this.render) { // 添加到 DOM 树
            this.render(f)
        }
        this._allowLayout = d;
        if (this.doLayout) { // 设置布局
            this.doLayout()
        }
        return this
    },
    /**
     * 触发指定类型的事件
     * @param {String} type 事件类型，如：click 
     * @param {Event} [evt] 原始事件
     * @member mini.Component
     */
    fire : function(type, evt) {
        if (this._canFire == false) {
            return
        }
        type = type.toLowerCase();
        var b = this._events[type];
        if (b) {
            if (!evt) {
                evt = {}
            }
            if (evt && evt != this) {
                evt.source = evt.sender = this;
                if (!evt.type) {
                    evt.type = type
                }
            }
            for (var c = 0, a = b.length; c < a; c++) {
                var f = b[c];
                if (f) {
                    f[0].apply(f[1], [ evt ])
                }
            }
        }
    },
    /**
     * 监听事件。 例如：
     * 
     *     @example
     *     control.on("click", function(e){
     *         //...
     *     });
     *     
     * @param {String} type 事件类型，比如 ”click”
     * @param {Function} fn 事件处理函数
     * @param {Object} fn.event 事件对象
     * @param {String} fn.event.type 事件类型
     * @param {mini.Control} fn.event.source 事件源
     * @param {mini.Control} fn.event.sender 事件发送者
     * @param {Object} [scope=this] 事件处理函数的作用域对象
     * @returns {mini.Component} this
     * @chainable
     * @member mini.Component
     */
    on : function(type, fn, scope) {
        if (typeof fn == "string") {
            var f = mini._getFunctoin(fn);
            if (!f) {
                var id = mini.newId("__str_");
                window[id] = fn;
                eval("fn = function(e){var s = "
                        + id
                        + ";var fn = mini._getFunctoin(s); if(fn) {fn.call(this, e)}else{eval(s);}}")
            } else {
                fn = f
            }
        }
        if (typeof fn != "function" || !type) {
            return false
        }
        type = type.toLowerCase();
        var event = this._events[type];
        if (!event) {
            event = this._events[type] = []
        }
        scope = scope || this;
        if (!this.findListener(type, fn, scope)) {
            event.push([ fn, scope ])
        }
        return this
    },
    /**
     * 取消监听事件
     * @param {String} type 事件类型，比如 ”click”
     * @param {Function} fn 事件处理函数
     * @param {Object} [scope] 事件处理函数的作用域对象
     * @returns {mini.Component} this
     * @chainable
     * @member mini.Component
     */
    un : function(type, fn, scope) {
        if (typeof fn != "function") {
            return false
        }
        type = type.toLowerCase();
        var d = this._events[type];
        if (d) {
            scope = scope || this;
            var e = this.findListener(type, fn, scope);
            if (e) {
                d.remove(e)
            }
        }
        return this
    },
    /**
     * 查找事件监听器
     * @param {String} type 事件类型，比如 ”click”
     * @param {Function} fn 事件处理函数
     * @param {Object} [scope] 事件处理函数的作用域对象
     * @returns {Array} 对应的事件处理句柄。是一个长度为 2 的数组：第1个元素为事件的处理方法，第2个元素为 scope 对象
     * @member mini.Component
     */
    findListener : function(type, fn, scope) {
        type = type.toLowerCase();
        scope = scope || this;
        var b = this._events[type];
        if (b) {
            for (var c = 0, a = b.length; c < a; c++) {
                var g = b[c];
                if (g[0] === fn && g[1] === scope) {
                    return g
                }
            }
        }
    },
    setId : function(a) {
        if (!a) {
            throw new Error("id not null")
        }
        if (this._idSet) {
            throw new Error("id just set only one")
        }
        mini.unreg(this); // 先注销原组件
        this.id = a;
        if (this.el) {
            this.el.id = a
        }
        if (this._valueEl) {
            this._valueEl.id = a + "$value"
        }
        if (this._textEl) {
            this._textEl.id = a + "$text"
        }
        this._idSet = true;
        mini.reg(this) // 重新注册组件
    },
    getId : function() {
        return this.id
    },
    /**
     * 销毁组件
     * @member mini.Component
     * @fires destroy
     */
    destroy : function() {
        mini.unreg(this); // 注销组件
        this.fire("destroy") // 触发 destroy 事件
    }
};


/**
 * 控件基类。<br>
 * 是表单、表格、树形、布局、菜单等所有控件的基类。<br>
 * 提供宽度、高度、样式外观、显示、启用。<br>
 * <b>它本身无法被实例化。</b>
 * @class mini.Control
 * @extends mini.Component
 * @abstract
 */

/**
 * 构造方法，创建一个新的控件对象，主要步骤：
 * <ol>
 * <li>先调用父类的构造方法</li>
 * <li>再执行 `_create()` 方法创建相关的 DOM 节点</li>
 * <li>然后执行 `_initEvents()` 方法绑定事件</li>
 * <li>最后设置宽度、高度、样式等属性</li>
 * </ol>
 * @constructor
 * @member mini.Control
 */
mini.Control = function() {
    mini.Control.superclass.constructor.call(this);
    this._create(); // 创建 DOM 节点
    this.el.uid = this.uid; // 设置 uid
    this._initEvents(); // 初始化事件绑定
    if (this._clearBorder) { // 不显示边框
        this.el.style.borderWidth = "0"
    }
    this.addCls(this.uiCls); // 设置样式类
    this.setWidth(this.width); // 设置宽度
    this.setHeight(this.height); // 设置高度
    this.el.style.display = this.visible ? this._displayStyle : "none" // 设置显示状态
};
mini.extend(mini.Control, mini.Component, {
    /**
     * @cfg {String} jsName 指向此控件实例的全局 JS 变量名称
     * @accessor
     * @member mini.Control
     */
    jsName : null,
    /**
     * @cfg {Number/String} [width=""] 宽度，如果为数字，单位为 px，如果为字符串，则为百分比或 `"auto"`
     * @accessor
     * @member mini.Control
     */
    width : "",
    /**
     * @cfg {Number/String} [height=""] 高度，如果为数字，单位为 px，如果为字符串，则为百分比或 `"auto"`
     * @accessor
     * @member mini.Control
     */
    height : "",
    /**
     * @cfg {Boolean} [visible=true] 是否显示控件
     * @accessor
     * @member mini.Control
     */
    visible : true,
    /**
     * @cfg {Boolean} [readOnly=false] 是否只读
     * @accessor
     * @member mini.Control
     */
    readOnly : false,
    /**
     * @cfg {Boolean} [enabled=true] 控件是否可用，值为 true 时 ${@link #readOnly} 将被忽略
     * @accessor
     * @member mini.Control
     */
    enabled : true,
    /**
     * @cfg {String} tooltip 提示信息
     * @accessor
     * @member mini.Control
     */
    tooltip : "",
    /**
     * @property {String} [_readOnlyCls="mini-readonly"] 只读状态时的展现样式类
     * @member mini.Control
     * @private
     */
    _readOnlyCls : "mini-readonly",
    /**
     * @property {String} [_disabledCls="mini-disabled"] 禁用状态时的展现样式类
     * @member mini.Control
     * @private
     */
    _disabledCls : "mini-disabled",
    /**
     * 创建控件的 DOM 节点
     * @member mini.Control
     * @private
     */
    _create : function() {
        this.el = document.createElement("div")
    },
    /**
     * 为控件绑定事件
     * @member mini.Control
     * @private
     */
    _initEvents : function() {
    },
    
    /**
     * 判断指定组件是否在当前控件中
     * @param {Object} comp 组件对象
     * @param {Object} comp.target (required) 组件对象对应的 DOM 节点
     * @returns {Boolean} 如果传入的组件在当前控件中，返回 `true`，否则返回 `false`
     * @member mini.Control
     */
    within : function(comp) {
        if (mini.isAncestor(this.el, comp.target)) {
            return true
        }
        return false
    },
    /**
     * @cfg {String} name 控件名称
     * @accessor
     * @member mini.Control
     */
    name : "",
    setName : function(a) {
        this.name = a
    },
    getName : function() {
        return this.name
    },
    /**
     * 是否自适应高度
     * @returns {Boolean} 如果 `height` 的值为 "" 或 "auto"，返回 `true`，否则返回 `false`
     * @member mini.Control
     */
    isAutoHeight : function() {
        var a = this.el.style.height;
        return a == "auto" || a == ""
    },
    /**
     * 
     * 是否自适应宽度
     * @returns {Boolean} 如果 `width` 的值为 "" 或 "auto"，返回 `true`，否则返回 `false`
     * @member mini.Control
     */
    isAutoWidth : function() {
        var a = this.el.style.width;
        return a == "auto" || a == ""
    },
    /**
     * 是否为固定尺寸
     * @returns {Boolean} 如果 `width` 和 `height` 都指定了固定高度，返回 `true`，否则返回 `false`
     * @member mini.Control
     */
    isFixedSize : function() {
        var b = this.width;
        var a = this.height;
        if (parseInt(b) + "px" == b && parseInt(a) + "px" == a) {
            return true
        }
        return false
    },
    /**
     * 是否为绘制者
     * @returns {Boolean} 
     * @member mini.Control
     */
    isRender : function(a) {
        return !!(this.el && this.el.parentNode && this.el.parentNode.tagName)
    },
    /**
     * 将控件加入到 DOM 节点中进行展现，如：
     * 
     *     @example
     *     control.render(document.body);
     *     
     * @param {HTMLElement/String} element 参考节点。<br>
     *      传入的参数类型为 `String` 时，表示 DOM 节点的 id 或 mini.Component 的 id 属性值，"#body" 代表 document.body 节点
     * @param {String} [renderType="append"] 渲染方式，可选值为：<ul>
     *      <li>append</li>
     *      <li>preend</li>
     *      <li>before</li>
     *      <li>after </li>
     *  </ul>
     * @member mini.Control
     * @fires render
     */
    render : function(element, renderType) {
        if (typeof element === "string") {
            if (element == "#body") {
                element = document.body
            } else {
                element = mini.byId(element)
            }
        }
        if (!element) {
            return
        }
        if (!renderType) {
            renderType = "append"
        }
        renderType = renderType.toLowerCase();
        if (renderType == "before") {
            jQuery(element).before(this.el)
        } else {
            if (renderType == "preend") {
                jQuery(element).preend(this.el)
            } else {
                if (renderType == "after") {
                    jQuery(element).after(this.el)
                } else {
                    element.appendChild(this.el)
                }
            }
        }
        this.el.id = this.id;
        this.doLayout();
        this.fire("render")
    },
    /**
     * 获取控件 DOM 节点
     * @returns {HTMLElement} 控件对应的 DOM 节点
     * @member mini.Control
     */
    getEl : function() {
        return this.el
    },
    setJsName : function(a) {
        this.jsName = a;
        window[a] = this
    },
    getJsName : function() {
        return this.jsName
    },
    setTooltip : function(a) {
        this.tooltip = a;
        this.el.title = a;
        if (this.tooltipPlacement) {
            jQuery(this.el).attr("data-placement", this.tooltipPlacement)
        }
    },
    getTooltip : function() {
        return this.tooltip
    },
    /**
     * 尺寸发生调整后执行的方法
     * @member mini.Control
     * @private
     */
    _sizeChanged : function() {
        this.doLayout()
    },
    setWidth : function(a) {
        if (parseInt(a) == a) {
            a += "px"
        }
        this.width = a;
        this.el.style.width = a;
        this._sizeChanged()
    },
    getWidth : function(d) {
        var c = this.el;
        var a = d ? jQuery(c).width() : jQuery(c).outerWidth();
        if (d && this._borderEl) {
            var b = mini.getBorders(this._borderEl);
            a = a - b.left - b.right
        }
        return a
    },
    setHeight : function(a) {
        if (parseInt(a) == a) {
            a += "px"
        }
        this.height = a;
        this.el.style.height = a;
        this._sizeChanged()
    },
    getHeight : function(c) {
        var b = c ? jQuery(this.el).height() : jQuery(this.el).outerHeight();
        if (c && this._borderEl) {
            var a = mini.getBorders(this._borderEl);
            b = b - a.top - a.bottom
        }
        return b
    },
    /**
     * 获取盒子模型，请参考 {@link mini#getBox}
     * @returns {Object} 盒子模型
     * @member mini.Control
     */
    getBox : function() {
        return mini.getBox(this.el)
    },
    /**
     * @cfg {String} borderStyle 边框样式。针对 datagrid, panel, textbox, combobox 等
     * @accessor
     * @member mini.Control
     */
    setBorderStyle : function(b) {
        var a = this._borderEl || this.el;
        mini.setStyle(a, b);
        this.doLayout()
    },
    getBorderStyle : function() {
        return this.borderStyle
    },
    /**
     * @property {Boolean} [_clearBorder=true] 是否清除边框
     * @member mini.Control
     * @private
     */
    _clearBorder : true,

    /**
     * @cfg {String} style 样式
     * @accessor
     * @member mini.Control
     */
    setStyle : function(a) {
        this.style = a;
        mini.setStyle(this.el, a);
        if (this._clearBorder) {
            this.el.style.borderWidth = "0";
            this.el.style.padding = "0px"
        }
        this.width = this.el.style.width;
        this.height = this.el.style.height;
        this._sizeChanged()
    },
    getStyle : function() {
        return this.style
    },
    /**
     * @cfg {String} cls 样式类
     * @accessor
     * @member mini.Control
     */
    setCls : function(a) {
        this.addCls(a)
    },
    getCls : function() {
        return this.cls
    },
    /**
     * 增加样式类
     * @param {String} cls 样式类名称
     * @member mini.Control
     */
    addCls : function(cls) {
        mini.addClass(this.el, cls)
    },
    /**
     * 去除样式类
     * @param {String} cls 样式类名称
     * @member mini.Control
     */
    removeCls : function(cls) {
        mini.removeClass(this.el, cls)
    },

    /**
     * 处理只读状态
     * @member mini.Control
     * @private
     */
    _doReadOnly : function() {
        if (this.readOnly) {
            this.addCls(this._readOnlyCls)
        } else {
            this.removeCls(this._readOnlyCls)
        }
    },
    setReadOnly : function(a) {
        this.readOnly = a;
        this._doReadOnly()
    },
    getReadOnly : function() {
        return this.readOnly
    },

    /**
     * 获取父控件
     * @param {String} [uiCls] 父控件的样式类。如果传入了此参数，则一直往上找，直到找到类型相匹配才终止
     * @returns {mini.Control} 父控件，如果没有父控件，则返回 `null`
     * @member mini.Control
     */
    getParent : function(uiCls) {
        var b = document;
        var a = this.el.parentNode;
        while (a != b && a != null) {
            var c = mini.get(a);
            if (c) {
                if (!mini.isControl(c)) {
                    return null
                }
                if (!uiCls || c.uiCls == uiCls) {
                    return c
                }
            }
            a = a.parentNode
        }
        return null
    },
    /**
     * 判断当前控件是否为只读
     * @returns {Boolean} 如果当前控件为只读或禁用状态，或者其父控件为只读或禁用状态，返回 `true`，否则返回 `false`
     * @member mini.Control
     */
    isReadOnly : function() {
        if (this.readOnly || !this.enabled) {
            return true
        }
        var a = this.getParent();
        if (a) {
            return a.isReadOnly()
        }
        return false
    },
    setEnabled : function(a) {
        this.enabled = a;
        if (this.enabled) {
            this.removeCls(this._disabledCls)
        } else {
            this.addCls(this._disabledCls)
        }
        this._doReadOnly()
    },
    getEnabled : function() {
        return this.enabled
    },
    /**
     * 启用控件
     * @member mini.Control
     */
    enable : function() {
        this.setEnabled(true)
    },
    /**
     * 禁用控件
     * @member mini.Control
     */
    disable : function() {
        this.setEnabled(false)
    },
    /**
     * @property {String} [_displayStyle=""] 样式的 display 值
     * @member mini.Control
     * @private
     */
    _displayStyle : "",
    setVisible : function(a) {
        this.visible = a;
        if (this.el) {
            this.el.style.display = a ? this._displayStyle : "none";
            this.doLayout()
        }
    },
    getVisible : function() {
        return this.visible
    },
    /**
     * 显示控件
     * @member mini.Control
     */
    show : function() {
        this.setVisible(true)
    },
    /**
     * 隐藏控件
     * @member mini.Control
     */
    hide : function() {
        this.setVisible(false)
    },
    /**
     * 控件当前是否为可见状态
     * @returns {Boolean} 控件可见时返回 `true`，否则返回 `false`
     * @member mini.Control
     */
    isDisplay : function(c) {
        if (mini.WindowVisible == false || !this.el) {
            return false
        }
        var body = document.body;
        var el = this.el;
        while (1) {
            if (el == null || !el.style) {
                return false
            }
            if (el && el.style && el.style.display == "none") {
                if (c) {
                    if (c(el) !== true) {
                        return false
                    }
                } else {
                    return false
                }
            }
            if (el == body) {
                return true
            }
            el = el.parentNode
        }
        return true
    },
    _allowUpdate : true,

    /**
     * 开始更新
     * @member mini.Control
     */
    beginUpdate : function() {
        this._allowUpdate = false
    },
    /**
     * 结束更新
     * @member mini.Control
     */
    endUpdate : function() {
        this._allowUpdate = true;
        this.doUpdate()
    },
    /**
     * 更新
     * @member mini.Control
     */
    doUpdate : function() {
    },
    /**
     * 是否允许调用布局
     * @returns {Boolean} 允许调整且当前为可见状态时返回 `true`，否则返回 `false`
     * @member mini.Control
     */
    canLayout : function() {
        if (this._allowLayout == false) {
            return false
        }
        return this.isDisplay()
    },
    /**
     * 调整控件布局
     * @member mini.Control
     */
    doLayout : function() {
    },
    /**
     * 布局发生改变
     * @member mini.Control
     */
    layoutChanged : function() {
        if (this.canLayout() == false) {
            return
        }
        this.doLayout()
    },
    /**
     * 销毁所有子控件
     * @member mini.Control
     * @private
     */
    _destroyChildren : function(d) {
        if (this.el) {
            var c = mini.getChildControls(this);
            for (var b = 0, a = c.length; b < a; b++) {
                var e = c[b];
                if (e.destroyed !== true) {
                    e.destroy(d)
                }
            }
        }
    },
    
    /**
     * @event destroy 在销毁控件时触发
     * @member mini.Control
     */
    
    /**
     * 销毁控件
     * @member mini.Control
     * @fires destroy
     */
    destroy : function(a) {
        if (this.destroyed !== true) {
            this._destroyChildren(a)
        }
        if (this.el) {
            mini.clearEvent(this.el);
            if (a !== false) {
                var b = this.el.parentNode;
                if (b) {
                    b.removeChild(this.el)
                }
            }
        }
        this._borderEl = null;
        this.el = null;
        mini.unreg(this);
        this.destroyed = true;
        this.fire("destroy")
    },
    
    /**
     * @event focus 在控件获取焦点时触发
     * @member mini.Control
     */
    
    /**
     * 获取焦点
     * @member mini.Control
     * @fires focus
     */
    focus : function() {
        try {
            var a = this;
            a.el.focus()
        } catch (b) {
        }
    },
    
    /**
     * @event blur 在控件失去焦点时触发
     * @member mini.Control
     */
    
    /**
     * 失去焦点
     * @member mini.Control
     * @fires blur
     */
    blur : function() {
        try {
            var a = this;
            a.el.blur()
        } catch (b) {
        }
    },
    /**
     * @cfg {Boolean} [allowAnim=true] 是否允许动画
     * @accessor
     * @member mini.Control
     */
    allowAnim : true,
    setAllowAnim : function(a) {
        this.allowAnim = a
    },
    getAllowAnim : function() {
        return this.allowAnim
    },
    /**
     * 获取遮罩层对应的 DOM 节点
     * @member mini.Control
     * @returns {HTMLElement} 遮罩层对应的 DOM 节点
     * @private
     */
    _getMaskWrapEl : function() {
        return this.el
    },
    /**
     * 显示遮罩层
     * @param {String/Object} options，遮罩层选项。如果类型为 `String`，则来遮罩层的提示消息
     * @param {String} options.html 提示消息
     * @param {HTMLElement} options.el 遮罩层的 DOM 节点
     * @param {HTMLElement} [options.cls="mini-mask-loading"] 遮罩层的样式类
     * @member mini.Control
     */
    mask : function(options) {
        if (typeof options == "string") {
            options = {
                html : options
            }
        }
        options = options || {};
        options.el = this._getMaskWrapEl();
        if (!options.cls) {
            options.cls = this._maskCls
        }
        mini.mask(options)
    },
    /**
     * 取消遮罩
     * @member mini.Control
     */
    unmask : function() {
        mini.unmask(this._getMaskWrapEl());
        this.isLoading = false
    },
    /**
     * @property {String} [_maskCls="mini-mask-loading"] 遮罩层的默认样式类
     * @member mini.Control
     * @private
     */
    _maskCls : "mini-mask-loading",
    /**
     * @cfg {String} [loadingMsg="Loading..."] 数据加载的遮罩层提示消息
     * @accessor
     * @member mini.Control
     */
    loadingMsg : "Loading...",
    /**
     * 显示数据加载的遮罩层
     * @param {String} [msg="Loading..."] 提示消息
     * @member mini.Control
     */
    loading : function(msg) {
        this.mask(msg || this.loadingMsg)
    },
    setLoadingMsg : function(a) {
        this.loadingMsg = a
    },
    getLoadingMsg : function() {
        return this.loadingMsg
    },
    /**
     * 获取上下文菜单
     * @param {String/Array/Object/mini.Control} menu 该参数可以是如下以种值：
     * <ul>
     * <li>String &#45; 菜单控件的 id 或可以被解析为菜单控件的 HTML 源代码</li>
     * <li>Array &#45; 菜单项（mini.MenuItem）数组</li>
     * <li>Object &#45; 创建菜单的配置对象，参数具体选项请参见 {@link mini#create} 方法中的参数描述</li>
     * <li>mini.Control &#45; 这个原样返回此对象</li>
     * </ul>
     * @returns {mini.Menu} 上下文菜单
     * @member mini.Control
     * @private
     */
    _getContextMenu : function(menu) {
        var result = menu;
        if (typeof menu == "string") {
            result = mini.get(menu);
            if (!result) {
                mini.parse(menu);
                result = mini.get(menu)
            }
        } else {
            if (mini.isArray(menu)) {
                result = {
                    type : "menu",
                    items : menu
                }
            } else {
                if (!mini.isControl(menu)) {
                    result = mini.create(menu)
                }
            }
        }
        return result
    },
    /**
     * 显示上下文菜单的方法
     * @param {Event} htmlEvt 原生的 DOM 事件
     * @fires mini.Menu#BeforeOpen
     * @fires mini.Menu#opening
     * @fires mini.Menu#Open
     * @member mini.Control
     * @private
     */
    __OnHtmlContextMenu : function(htmlEvt) {
        var evt = {
            popupEl : this.el,
            htmlEvent : htmlEvt,
            cancel : false
        };
        this.contextMenu.fire("BeforeOpen", evt);
        if (evt.cancel == true) {
            return
        }
        this.contextMenu.fire("opening", evt);
        if (evt.cancel == true) {
            return
        }
        this.contextMenu.showAtPos(htmlEvt.pageX, htmlEvt.pageY);
        this.contextMenu.fire("Open", evt);
        return false
    },
    /**
     * @cfg {String} contextMenu 上下文菜单的 id 或能被解析成 mini.Menu 对象的 HTML 代码
     * @accessor
     * @member mini.Control
     */
    contextMenu : null,
    setContextMenu : function(b) {
        var a = this._getContextMenu(b);
        if (!a) {
            return
        }
        if (this.contextMenu !== a) {
            this.contextMenu = a;
            this.contextMenu.owner = this;
            mini.on(this.el, "contextmenu", this.__OnHtmlContextMenu, this)
        }
    },
    getContextMenu : function() {
        return this.contextMenu
    },
    /**
     * @cfg {Object} [defaultValue] 默认值
     * @accessor
     * @member mini.Control
     */
    setDefaultValue : function(a) {
        this.defaultValue = a
    },
    getDefaultValue : function() {
        return this.defaultValue
    },
    /**
     * @cfg {Object} [value] 值
     * @accessor
     * @member mini.Control
     */
    setValue : function(a) {
        this.value = a
    },
    getValue : function() {
        return this.value
    },
    /**
     * @cfg {Object} [ajaxData=null] 发起 ajax 请求时向后台提交的数据
     * @accessor
     * @member mini.Control
     */
    ajaxData : null,
    /**
     * @cfg {String} [ajaxType=""] 发起 ajax 请求时的请求方式，一般为 "POST" 或 "GET"
     * @accessor
     * @member mini.Control
     */
    ajaxType : "",
    setAjaxData : function(a) {
        this.ajaxData = a
    },
    getAjaxData : function() {
        return this.ajaxData
    },
    setAjaxType : function(a) {
        this.ajaxType = a
    },
    getAjaxType : function() {
        return this.ajaxType
    },
    /**
     * _afterApply
     * @member mini.Control
     * @private
     */
    _afterApply : function(a) {
    },
    /**
     * @cfg {String} [dataField=""] 发起 ajax 请求时，当前控件在提交的数据对象中所对应的字段名称
     * @accessor
     * @member mini.Control
     */
    dataField : "",
    setDataField : function(a) {
        this.dataField = a
    },
    getDataField : function() {
        return this.dataField
    },
    /**
     * @cfg {Number} tabIndex 同 DOM 节点的 tabIndex 属性
     * @accessor
     * @member mini.Control
     */
    tabIndex : 0,
    setTabIndex : function(b) {
        var a = this._textEl || this.el;
        a.tabIndex = b;
        this.tabIndex = b
    },
    getTabIndex : function() {
        return this.tabIndex
    },
    /**
     * 获取 DOM 节点的属性列表。会进行解析的属性包括但不限于：
     * <ul>
     * <li>
     *   <div>String：</div>
     *   <ul>
     *   <li>id</li>
     *   <li>name</li>
     *   <li>value</li>
     *   <li>defaultValue</li>
     *   <li>class</li>
     *   <li>style</li>
     *   <li>borderStyle</li>
     *   <li>width</li>
     *   <li>height</li>
     *   <li>tabIndex</li>
     *   <li>contextMenu</li>
     *   <li>tooltip</li>
     *   <li>data-placement</li>
     *   <li>ajaxType</li>
     *   <li>dataField</li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Boolean：</div>
     *   <ul>
     *   <li>visible</li>
     *   <li>enabled</li>
     *   <li>readOnly</li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Object：</div>
     *   <ul>
     *   <li>ajaxData</li>
     *   <li>ajaxOptions</li>
     *   <li>data-options &#45; 如果 DOM 节点的 `data-options` 属性值为 `"{library:'miniUI'}"`，则在解析后，可以通过 `control.library` 的方式直接获取 library 字段的值</li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Function（Event）：</div>
     *   <ul>
     *   <li>ondestroy</li>
     *   </ul>
     * </li>
     * </ul>
     * @param {HTMLElement} el 要进行解析的 DOM 节点
     * @returns {Object} 有效的属性列表。
     * @member mini.Control
     * @protected
     */
    getAttrs : function(el) {
        var attrs = {};
        var cls = el.className;
        if (cls) {
            attrs.cls = cls
        }
        if (el.value) {
            attrs.value = el.value
        }
        mini._ParseString(el, attrs, [ "id", "name", "width", "height",
                "borderStyle", "value", "defaultValue", "tabIndex",
                "contextMenu", "tooltip", "ondestroy", "data-options",
                "ajaxData", "ajaxType", "dataField", "ajaxOptions",
                "data-placement" ]);
        if (attrs["data-placement"]) {
            this.tooltipPlacement = attrs["data-placement"]
        }
        mini._ParseBool(el, attrs, [ "visible", "enabled", "readOnly" ]);
        if (el.readOnly && el.readOnly != "false") {
            attrs.readOnly = true
        }
        var style = el.style.cssText;
        if (style) {
            attrs.style = style
        }
        if (isIE9) {
            var bg = el.style.background;
            if (bg) {
                if (!attrs.style) {
                    attrs.style = ""
                }
                attrs.style += ";background:" + bg
            }
        }
        if (this.style) {
            if (attrs.style) {
                attrs.style = this.style + ";" + attrs.style
            } else {
                attrs.style = this.style
            }
        }
        if (this.borderStyle) {
            if (attrs.borderStyle) {
                attrs.borderStyle = this.borderStyle + ";" + attrs.borderStyle
            } else {
                attrs.borderStyle = this.borderStyle
            }
        }
        if (typeof attrs.ajaxOptions == "string") {
            attrs.ajaxOptions = eval("(" + attrs.ajaxOptions + ")")
        }
        var ts = mini._attrs;
        if (ts) {
            for (var i = 0, l = ts.length; i < l; i++) {
                var t = ts[i];
                var name = t[0];
                var type = t[1];
                if (!type) {
                    type = "string"
                }
                if (type == "string") {
                    mini._ParseString(el, attrs, [ name ])
                } else {
                    if (type == "bool") {
                        mini._ParseBool(el, attrs, [ name ])
                    } else {
                        if (type == "int") {
                            mini._ParseInt(el, attrs, [ name ])
                        }
                    }
                }
            }
        }
        var options = attrs["data-options"];
        if (options) {
            options = eval("(" + options + ")");
            if (options) {
                mini.copyTo(attrs, options)
            }
        }
        return attrs
    }
});

/**
 * @property {Object} [_attrs=null] 
 * @member mini
 */
mini._attrs = null;
/**
 * 注册 HTML 标签的属性
 * @param {String} attrName 属性名
 * @param {String} [valueType="string"] 属性值类型，如："string"、"number"、"boolean"、"object" 等
 * @member mini
 */
mini.regHtmlAttr = function(attrName, valueType) {
    if (!attrName) {
        return
    }
    if (!valueType) {
        valueType = "string"
    }
    if (!mini._attrs) {
        mini._attrs = []
    }
    mini._attrs.push([ attrName, valueType ])
};

/**
 * 设置容器的子控件
 * @param {Array} children 子控件数组，数组中的元素类型可以是 `String`、`HTMLElement`、`mini.Control` 和 `Object` 类型，具体请参见 {@link mini#getAndCreate} 方法的参数描述
 * @param {HTMLElement} [contentEl=this._contentEl] 容器控件的内容区域对应的 DOM 节点
 * @param {mini.Container} [container=this] 容器对象
 * @returns {mini.Container} 内容区域设置了子控件后的容器对象
 * @member Window
 * @private
 */
__mini_setControls = function(children, contentEl, container) {
    contentEl = contentEl || this._contentEl;
    container = container || this;
    if (!children) {
        children = []
    }
    if (!mini.isArray(children)) {
        children = [ children ]
    }
    for (var d = 0, a = children.length; d < a; d++) {
        var g = children[d];
        if (typeof g == "string") {
            if (g.indexOf("#") == 0) {
                g = mini.byId(g)
            }
        } else {
            if (mini.isElement(g)) {
            } else {
                g = mini.getAndCreate(g);
                g = g.el
            }
        }
        if (!g) {
            continue
        }
        mini.append(contentEl, g)
    }
    mini.parse(contentEl);
    container.doLayout();
    return container
};
/**
 * 容器控件的基类
 * @class
 * @extends mini.Control
 * @abstract
 */
mini.Container = function() {
    mini.Container.superclass.constructor.call(this);
    this._contentEl = this.el
};
mini.extend(mini.Container, mini.Control, {
    /**
     * @method setControls
     * @member mini.Container
     * @alias Window#__mini_setControls
     * @chainable
     */
    setControls : __mini_setControls,
    /**
     * 获取内容区域的 DOM 节点
     * @returns {HTMLElement} 内容区域的 DOM 节点
     */
    getContentEl : function() {
        return this._contentEl
    },
    /**
     * 获取主体区域的 DOM 节点
     * @returns {HTMLElement} 主体区域的 DOM 节点
     */
    getBodyEl : function() {
        return this._contentEl
    },
    within : function(f) {
        if (mini.isAncestor(this.el, f.target)) {
            return true
        }
        var b = mini.getChildControls(this);
        for (var d = 0, a = b.length; d < a; d++) {
            var g = b[d];
            if (g.within(f)) {
                return true
            }
        }
        return false
    }
});

/**
 * 可校验的控件基类
 * @class
 * @extends mini.Control
 * @abstract
 */
mini.ValidatorBase = function() {
    mini.ValidatorBase.superclass.constructor.call(this)
};
mini.extend(mini.ValidatorBase, mini.Control, {
    /**
     * @cfg {Boolean} [required=false] 是否必填
     * @accessor
     * @member mini.ValidatorBase
     */
    required : false,
    /**
     * @cfg {String} [requiredErrorText="This field is required."] 必填校验的错误提示
     * @accessor
     * @member mini.ValidatorBase
     */
    requiredErrorText : "This field is required.",
    /**
     * @property {String} [_requiredCls="mini-required"] 必填字段的样式类
     * @member mini.ValidatorBase
     * @private
     */
    _requiredCls : "mini-required",
    /**
     * @cfg {String} [errorText=""] 校验不通过时的错误提示
     * @accessor
     * @member mini.ValidatorBase
     */
    errorText : "",
    /**
     * @property {String} [_errorCls="mini-error"] 校验不通过时字段的样式类
     * @member mini.ValidatorBase
     * @private
     */
    _errorCls : "mini-error",
    /**
     * @property {String} [_invalidCls="mini-invalid"] 值无效时字段的样式类
     * @member mini.ValidatorBase
     * @private
     */
    _invalidCls : "mini-invalid",
    /**
     * @cfg {String} [errorMode="icon"] 错误提示的展现方式，可选值有："icon" 和 "border"
     * @accessor
     * @member mini.ValidatorBase
     */
    errorMode : "icon",
    /**
     * @cfg {Boolean} [validateOnChanged=true] 值发生改变时是否进行校验
     * @accessor
     * @member mini.ValidatorBase
     */
    validateOnChanged : true,
    /**
     * @cfg {Boolean} [validateOnLeave=true] 失去焦点时是否进行校验
     * @accessor
     * @member mini.ValidatorBase
     */
    validateOnLeave : true,
    /**
     * @property {Boolean} [_IsValid=true] 值是否有效
     * @member mini.ValidatorBase
     * @private
     * @readonly
     */
    _IsValid : true,
    /**
     * 是否可编辑
     * @method isEditable
     * @returns {Boolean} 可编辑时返回 true，反之返回 false
     * @member mini.ValidatorBase
     */
    isEditable : function() {
        if (this.readOnly || !this.allowInput || !this.enabled) {
            return false
        }
        return true
    },
    _tryValidate : function() {
        if (this._tryValidateTimer) {
            clearTimeout(this._tryValidateTimer)
        }
        var a = this;
        this._tryValidateTimer = setTimeout(function() {
            a.validate()
        }, 30)
    },
    /**
     * 进行校验
     * @returns {Boolean} 校验通过返回 true，否则则返回 false
     * @member mini.ValidatorBase
     * @fires validation
     */
    validate : function() {
        if (this.enabled == false) {
            this.setIsValid(true);
            return true
        }
        var a = {
            value : this.getValue(),
            errorText : "",
            isValid : true
        };
        if (this.required) {
            if (mini.isNull(a.value) || String(a.value).trim() === "") {
                a.isValid = false;
                a.errorText = this.requiredErrorText
            }
        }
        this.fire("validation", a);
        this.errorText = a.errorText;
        this.setIsValid(a.isValid);
        return this.isValid()
    },
    /**
     * @method isValid
     * @member mini.ValidatorBase
     * @alias mini.ValidatorBase#getIsValid
     */
    isValid : function() {
        return this._IsValid
    },
    /**
     * 设置校验结果
     * @method setIsValid
     * @member mini.ValidatorBase
     */
    setIsValid : function(a) {
        this._IsValid = a;
        this.doUpdateValid()
    },
    /**
     * 获取校验结果
     * @method getIsValid
     * @returns {Boolean} 校验通过返回 true，反之则返回 false
     * @member mini.ValidatorBase
     */
    getIsValid : function() {
        return this._IsValid
    },
    setValidateOnChanged : function(a) {
        this.validateOnChanged = a
    },
    getValidateOnChanged : function(a) {
        return this.validateOnChanged
    },
    setValidateOnLeave : function(a) {
        this.validateOnLeave = a
    },
    getValidateOnLeave : function(a) {
        return this.validateOnLeave
    },
    setErrorMode : function(a) {
        if (!a) {
            a = "none"
        }
        this.errorMode = a.toLowerCase();
        if (this._IsValid == false) {
            this.doUpdateValid()
        }
    },
    getErrorMode : function() {
        return this.errorMode
    },
    setErrorText : function(a) {
        this.errorText = a;
        if (this._IsValid == false) {
            this.doUpdateValid()
        }
    },
    getErrorText : function() {
        return this.errorText
    },
    setRequired : function(a) {
        this.required = a;
        if (this.required) {
            this.addCls(this._requiredCls)
        } else {
            this.removeCls(this._requiredCls)
        }
    },
    getRequired : function() {
        return this.required
    },
    setRequiredErrorText : function(a) {
        this.requiredErrorText = a
    },
    getRequiredErrorText : function() {
        return this.requiredErrorText
    },
    /**
     * @property {String} [errorIconEl=null] 错误图标元素
     * @member mini.ValidatorBase
     */
    errorIconEl : null,
    /**
     * 获取错误图标的 DOM 节点
     * @returns {HTMLElement} 错误图标的 DOM 节点
     * @member mini.ValidatorBase
     */
    getErrorIconEl : function() {
        return this._errorIconEl
    },
    /**
     * 移除错误图标的 DOM 节点
     * @member mini.ValidatorBase
     * @private
     */
    _RemoveErrorIcon : function() {
    },
    /**
     * 更新校验状态（重新校验）
     * @method doUpdateValid
     * @member mini.ValidatorBase
     */
    doUpdateValid : function() {
        var a = this;
        a.__doUpdateValid()
    },
    /**
     * @property {String} [errorTooltipPlacement="right"] 错误提示的显示位置
     * @member mini.ValidatorBase
     */
    errorTooltipPlacement : "right",
    __doUpdateValid : function() {
        if (!this.el) {
            return
        }
        this.removeCls(this._errorCls);
        this.removeCls(this._invalidCls);
        if (this._IsValid == false) {
            switch (this.errorMode) {
            case "icon":
                this.addCls(this._errorCls);
                var a = this.getErrorIconEl();
                if (a) {
                    a.title = this.errorText;
                    jQuery(a).attr("data-placement", this.errorTooltipPlacement)
                }
                break;
            case "border":
                this.addCls(this._invalidCls);
                this.el.title = this.errorText;
            default:
                this._RemoveErrorIcon();
                break
            }
        } else {
            this._RemoveErrorIcon()
        }
        this.doLayout()
    },
    /**
     * 触发 valuechanged 事件
     * @member mini.ValidatorBase
     * @fires valuechanged
     */
    doValueChanged : function() {
        this._OnValueChanged()
    },
    /**
     * _OnValueChanged
     * @member mini.ValidatorBase
     * @fires valuechanged
     * @private
     */
    _OnValueChanged : function() {
        if (this.validateOnChanged) {
            this._tryValidate()
        }
        this.fire("valuechanged", {
            value : this.getValue()
        })
    },
    
    /**
     * @event valuechanged 在发生改变时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {String} event.value 改变后的值
     * @member mini.ValidatorBase
     */
    onValueChanged : function(event, scope) {
        this.on("valuechanged", event, scope)
    },
    /**
     * @event validation 在进行校验时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {String} event.value 值
     * @param {String} event.errorText 错误提示
     * @param {Boolean} event.isValid 是否有效
     * @member mini.ValidatorBase
     */
    onValidation : function(event, scope) {
        this.on("validation", event, scope)
    },
    /**
     * 获取 DOM 节点的属性列表。除了父类解析的属性外，还会解析以下属性：
     * <ul>
     * <li>
     *   <div>String：</div>
     *   <ul>
     *   <li>label</li>
     *   <li>labelStyle</li>
     *   <li>requiredErrorText</li>
     *   <li>errorMode</li>
     *   <li>errorTooltipPlacement</li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Boolean：</div>
     *   <ul>
     *   <li>validateOnChanged</li>
     *   <li>validateOnLeave</li>
     *   <li>labelField</li>
     *   <li>required</li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Function（Event）：</div>
     *   <ul>
     *   <li>onvaluechanged</li>
     *   <li>onvalidation</li>
     *   </ul>
     * </li>
     * </ul>
     * @param {HTMLElement} el 要进行解析的 DOM 节点
     * @returns {Object} 有效的属性列表。
     * @member mini.ValidatorBase
     * @protected
     */
    getAttrs : function(el) {
        var a = mini.ValidatorBase.superclass.getAttrs.call(this, el);
        mini._ParseString(el, a, [ "onvaluechanged", "onvalidation", "label",
                "labelStyle", "requiredErrorText", "errorMode", "errorTooltipPlacement" ]);
        mini._ParseBool(el, a, [ "validateOnChanged", "validateOnLeave", "labelField" ]);
        var d = el.getAttribute("required");
        if (!d) {
            d = el.required
        }
        if (!d) {
            var c = el.attributes.required;
            if (c) {
                d = c.value == "null" ? null : "true"
            }
        }
        if (d) {
            a.required = d != "false" ? true : false
        }
        return a
    },
    /**
     * 调整标签布局
     * @member mini.ValidatorBase
     * @private
     */
    _labelLayout : function() {
        var b = this._borderEl;
        if (!b) {
            return
        }
        this._labelLayouted = true;
        if (this.labelField) {
            var a = this._labelEl.offsetWidth;
            b.style.marginLeft = a + "px";
            this._doLabelLayout = a === 0
        } else {
            b.style.marginLeft = 0
        }
    },
    /**
     * @property {String} [_labelFieldCls="mini-labelfield"] 标签字段的样式类
     * @member mini.ValidatorBase
     * @private
     */
    _labelFieldCls : "mini-labelfield",
    /**
     * @cfg {Boolean} [labelField=false] 是否为标签字段
     * @accessor
     * @member mini.ValidatorBase
     */
    labelField : false,
    /**
     * @cfg {String} [label=""] 标签
     * @accessor
     * @member mini.ValidatorBase
     */
    label : "",
    /**
     * @cfg {String} [labelStyle=""] 标签样式
     * @accessor
     * @member mini.ValidatorBase
     */
    labelStyle : "",
    setLabelField : function(a) {
        if (this.labelField != a) {
            this.labelField = a;
            if (!this._borderEl) {
                return
            }
            if (!this._labelEl) {
                this._labelEl = mini.append(this.el,
                        '<label class="mini-labelfield-label"></label>');
                this._labelEl.innerHTML = this.label;
                mini.setStyle(this._labelEl, this.labelStyle)
            }
            this._labelEl.style.display = a ? "block" : "none";
            if (a) {
                mini.addClass(this.el, this._labelFieldCls)
            } else {
                mini.removeClass(this.el, this._labelFieldCls)
            }
            this._labelLayout()
        }
    },
    getLabelField : function() {
        this.labelField
    },
    setLabel : function(a) {
        if (this.label != a) {
            this.label = a;
            if (this._labelEl) {
                this._labelEl.innerHTML = a
            }
            this._labelLayout()
        }
    },
    getLabel : function() {
        this.label
    },
    setLabelStyle : function(a) {
        if (this.labelStyle != a) {
            this.labelStyle = a;
            if (this._labelEl) {
                mini.setStyle(this._labelEl, a)
            }
            this._labelLayout()
        }
    },
    getLabelStyle : function() {
        this.labelStyle
    }
});

/**
 * 列表控件的基类
 * @class
 * @extends mini.ValidatorBase
 * @abstract
 */
mini.ListControl = function() {
    this.data = [];
    this._selecteds = [];
    mini.ListControl.superclass.constructor.call(this);
    this.doUpdate()
};
/**
 * @cfg {String} [ajaxType="get"] 发起 ajax 请求时的请求方式
 * @accessor
 * @member mini.ListControl
 */
mini.ListControl.ajaxType = "get";
mini.extend(mini.ListControl, mini.ValidatorBase, {
    /**
     * @cfg {String} [defaultValue=""] 默认值
     * @accessor
     * @member mini.ListControl
     */
    defaultValue : "",
    /**
     * @cfg {String} [value=""] 值
     * @accessor
     * @member mini.ListControl
     */
    value : "",
    /**
     * @cfg {String} [valueField="id"] 值字段
     * @accessor
     * @member mini.ListControl
     */
    valueField : "id",
    /**
     * @cfg {String} [textField="text"] 文本字段
     * @accessor
     * @member mini.ListControl
     */
    textField : "text",
    /**
     * @cfg {String} [dataField=""] 数据列表字段
     * @accessor
     * @member mini.ListControl
     */
    dataField : "",
    /**
     * @cfg {String} [delimiter=","] 分隔符
     * @accessor
     * @member mini.ListControl
     */
    delimiter : ",",
    /**
     * @cfg {Object} [data=null] 数据对象
     * @accessor
     * @member mini.ListControl
     */
    data : null,
    /**
     * @cfg {String} [url=""] 数据加载地址
     * @accessor
     * @member mini.ListControl
     */
    url : "",
    /**
     * @property {String} [_itemCls="mini-list-item"] 数据项的样式类
     * @member mini.ListControl
     * @private
     */
    _itemCls : "mini-list-item",
    /**
     * @property {String} [_itemHoverCls="mini-list-item-hover"] 鼠标悬停项的样式类
     * @member mini.ListControl
     * @private
     */
    _itemHoverCls : "mini-list-item-hover",
    /**
     * @property {String} [_itemSelectedCls="mini-list-item-selected"] 选中项的样式类
     * @member mini.ListControl
     * @private
     */
    _itemSelectedCls : "mini-list-item-selected",
    /**
     * @inheritdoc mini.Component#set
     * @returns {mini.ListControl} this
     * @member mini.ListControl
     */
    set : function(d) {
        if (typeof d == "string") {
            return this
        }
        var c = d.value;
        delete d.value;
        var a = d.url;
        delete d.url;
        var b = d.data;
        delete d.data;
        mini.ListControl.superclass.set.call(this, d);
        if (!mini.isNull(b)) {
            this.setData(b)
        }
        if (!mini.isNull(a)) {
            this.setUrl(a)
        }
        if (!mini.isNull(c)) {
            this.setValue(c)
        }
        return this
    },
    /**
     * @property {String} [uiCls="mini-button"] 控件样式类
     * @member mini.ListControl
     */
    uiCls : "mini-list",
    /**
     * @inheritdoc mini.Control#_create
     * @member mini.ListControl
     * @private
     */
    _create : function() {
    },
    /**
     * @inheritdoc mini.Control#_initEvents
     * @member mini.ListControl
     * @private
     */
    _initEvents : function() {
        mini._BindEvents(function() {
            mini_onOne(this.el, "click", this.__OnClick, this);
            mini_onOne(this.el, "dblclick", this.__OnDblClick, this);
            mini_onOne(this.el, "mousedown", this.__OnMouseDown, this);
            mini_onOne(this.el, "mouseup", this.__OnMouseUp, this);
            mini_onOne(this.el, "mousemove", this.__OnMouseMove, this);
            mini_onOne(this.el, "mouseover", this.__OnMouseOver, this);
            mini_onOne(this.el, "mouseout", this.__OnMouseOut, this);
            mini_onOne(this.el, "keydown", this.__OnKeyDown, this);
            mini_onOne(this.el, "keyup", this.__OnKeyUp, this);
            mini_onOne(this.el, "contextmenu", this.__OnContextMenu, this)
        }, this)
    },
    /**
     * @inheritdoc mini.Control#destroy
     * @member mini.ListControl
     */
    destroy : function(a) {
        if (this.el) {
            this.el.onclick = null;
            this.el.ondblclick = null;
            this.el.onmousedown = null;
            this.el.onmouseup = null;
            this.el.onmousemove = null;
            this.el.onmouseover = null;
            this.el.onmouseout = null;
            this.el.onkeydown = null;
            this.el.onkeyup = null;
            this.el.oncontextmenu = null
        }
        mini.ListControl.superclass.destroy.call(this, a)
    },
    /**
     * @cfg {String} [name=""] 控件名称
     * @accessor
     * @member mini.ListControl
     */
    name : "",
    setName : function(a) {
        this.name = a;
        if (this._valueEl) {
            mini.setAttr(this._valueEl, "name", this.name)
        }
    },
    /**
     * 根据事件对象获取下拉项
     * @param {Object} event 事件对象
     * @param {Object} event.target 事件源
     * @returns {Object} 对应的下拉项
     * @member mini.ListControl
     */
    getItemByEvent : function(event) {
        var b = mini.findParent(event.target, this._itemCls);
        if (b) {
            var a = parseInt(mini.getAttr(b, "index"));
            return this.data[a]
        }
    },
    /**
     * 给下拉项添加样式类
     * @param {Object/Number/String/Function} item 下拉项，具体信息请参见 {@link #getItemEl} 方法中的参数描述
     * @param {String} cls 样式类名称
     * @member mini.ListControl
     */
    addItemCls : function(item, cls) {
        var el = this.getItemEl(item);
        if (el) {
            mini.addClass(el, cls)
        }
    },
    /**
     * 给下拉项移除样式类
     * @param {Object/Number/String/Function} item 下拉项，具体信息请参见 {@link #getItemEl} 方法中的参数描述
     * @param {String} cls 样式类名称
     * @member mini.ListControl
     */
    removeItemCls : function(item, cls) {
        var el = this.getItemEl(item);
        if (el) {
            mini.removeClass(el, cls)
        }
    },
    /**
     * 获取下拉项对应的 DOM 节点
     * @param {Object/Number/String/Function} item 下拉项，具体信息请参见 {@link #getItem} 方法中的参数描述
     * @returns {HTMLElement} 下拉项对应的 DOM 节点
     * @member mini.ListControl
     */
    getItemEl : function(item) {
        item = this.getItem(item);
        var index = this.data.indexOf(item);
        var id = this._createItemId(index);
        return document.getElementById(id)
    },
    /**
     * 下拉项获取焦点
     * @param {Object/Number/String/Function} item 下拉项，具体信息请参见 {@link #getItem} 方法中的参数描述
     * @param {Boolean} scrollToView 是否滚动到当前获取焦点的下拉项
     * @member mini.ListControl
     * @private
     */
    _focusItem : function(item, scrollToView) {
        item = this.getItem(item);
        if (!item) {
            return
        }
        var el = this.getItemEl(item);
        if (scrollToView && el) {
            this.scrollIntoView(item)
        }
        if (this._focusedItem == item) {
            if (el) {
                mini.addClass(el, this._itemHoverCls)
            }
            return
        }
        this._blurItem();
        this._focusedItem = item;
        if (el) {
            mini.addClass(el, this._itemHoverCls)
        }
    },
    /**
     * 将当前取得焦点的下拉项改为失去焦点
     * @member mini.ListControl
     * @private
     */
    _blurItem : function() {
        if (!this._focusedItem) {
            return
        }
        var a = this.getItemEl(this._focusedItem);
        if (a) {
            mini.removeClass(a, this._itemHoverCls)
        }
        this._focusedItem = null
    },
    /**
     * 获取当前取得焦点的下拉项
     * @member mini.ListControl
     * @returns {Object} 当前取得焦点的下拉项，如果所有下拉项都没有取得焦点，则返回 `null`
     */
    getFocusedItem : function() {
        var a = this._focusedItem;
        return this.indexOf(a) == -1 ? null : a
    },
    /**
     * 获取当前取得焦点的下拉项的索引值
     * @member mini.ListControl
     * @returns {Number} 当前取得焦点的下拉项的索引值，如果所有下拉项都没有取得焦点，则返回 `-1`
     */
    getFocusedIndex : function() {
        return this.data.indexOf(this._focusedItem)
    },
    /**
     * @property {Object} [_scrollViewEl=null] 
     * @member mini.ListControl
     * @private
     */
    _scrollViewEl : null,
    /**
     * 滚动到指定下拉项
     * @param {Object/Number/String/Function} item 下拉项，具体信息请参见 {@link #getItemEl} 方法中的参数描述
     * @member mini.ListControl
     */
    scrollIntoView : function(item) {
        try {
            var itemEl = this.getItemEl(item);
            var a = this._scrollViewEl || this.el;
            mini.scrollIntoView(itemEl, a, false)
        } catch (d) {
        }
    },
    /**
     * 获取下拉项。如果需要同时获取多个下拉项，请使用 {@link #findItems} 方法。
     * @param {Object/Number/String/Function} value 下拉项的值或索引位置，具体描述如下
     * <ul>
     * <li>Object &#45; 将直接返回该参数</li>
     * <li>Number &#45; 表示下拉项索引</li>
     * <li>String &#45; 表示下拉项的值</li>
     * <li>Function &#45; 过滤下拉项的方法，包含两个参数：<br>
     * item String 下拉项<br>
     * index Number 下拉项的索引，从 0 开始<br>
     * 返回值类型为 Boolean 类型，返回 `true` 时，会将当前被迭代的下拉项返回</li>
     * </ul>
     *  类型为  时表示；类型为 String 时为
     * @returns {Object} 下拉项对象
     * @member mini.ListControl
     */
    getItem : function(value) {
        if (typeof value == "object") {
            return value
        }
        if (typeof value == "number") {
            return this.data[value]
        }
        return this.findItems(value)[0]
    },
    /**
     * 获取总项数
     * @returns {Number} 总项数
     * @member mini.ListControl
     */
    getCount : function() {
        return this.data.length
    },
    /**
     * 获取对象索引号
     * @param {Object} obj 数据对象
     * @returns {Number} 对应的索引，如果不存在，则返回 -1
     * @member mini.ListControl
     */
    indexOf : function(obj) {
        return this.data.indexOf(obj)
    },
    /**
     * 获取索引处对象
     * @param {Number} index 索引，从 0 开始
     * @returns {Object} 对应索引处的对象
     * @member mini.ListControl
     */
    getAt : function(index) {
        return this.data[index]
    },
    /**
     * 更新项
     * @param {Object} obj 数据对象
     * @param {Object} options 需要更新的属性选项
     * @member mini.ListControl
     */
    updateItem : function(obj, options) {
        obj = this.getItem(obj);
        if (!obj) {
            return
        }
        mini.copyTo(obj, options);
        this.doUpdate()
    },
    /**
     * 加载数据
     * @param {String/Array} data 数据对象或请求数据的 URL
     * @member mini.ListControl
     */
    load : function(data) {
        if (typeof data == "string") {
            this.setUrl(data)
        } else {
            this.setData(data)
        }
    },
    /**
     * 加载数据
     * @param {Array} data 数据对象
     * @member mini.ListControl
     */
    loadData : function(data) {
        this.setData(data)
    },
    setData : function(data) {
        if (typeof data == "string") {
            data = eval(data)
        }
        if (!mini.isArray(data)) {
            data = []
        }
        this.data = data;
        this.doUpdate();
        if (this.value != "") {
            this.deselectAll();
            var records = this.findItems(this.value);
            this.selects(records)
        }
    },
    getData : function() {
        return this.data.clone()
    },
    setUrl : function(a) {
        this.url = a;
        this._doLoad({})
    },
    getUrl : function() {
        return this.url
    },
    /**
     * @cfg {Object} [ajaxData=null] 发起 ajax 请求时向后台提交的数据
     * @accessor
     * @member mini.ListControl
     */
    ajaxData : null,
    /**
     * 从后台服务器加载下拉项的数据
     * @param {Object} params 请求参数
     * @member mini.ListControl
     * @private
     * @fires beforeload
     * @fires preload
     * @fires loaderror
     */
    _doLoad : function(params) {
        try {
            var url = eval(this.url);
            if (url != undefined) {
                this.url = url
            }
        } catch (e) {
        }
        var url = this.url;
        var ajaxMethod = mini.ListControl.ajaxType;
        if (url) {
            if (url.indexOf(".txt") != -1 || url.indexOf(".json") != -1) {
                ajaxMethod = "get"
            }
        }
        var obj = mini._evalAjaxData(this.ajaxData, this);
        mini.copyTo(params, obj);
        var e = {
            url : this.url,
            async : false,
            type : this.ajaxType ? this.ajaxType : ajaxMethod,
            data : params,
            params : params,
            cache : false,
            cancel : false
        };
        this.fire("beforeload", e);
        if (e.data != e.params && e.params != params) {
            e.data = e.params
        }
        if (e.cancel == true) {
            return
        }
        var sf = me = this;
        var url = e.url;
        mini.copyTo(e, {
            success : function(text, textStatus, xhr) {
                delete e.params;
                var obj = {
                    text : text,
                    result : null,
                    sender : me,
                    options : e,
                    xhr : xhr
                };
                var result = null;
                try {
                    mini_doload(obj);
                    result = obj.result;
                    if (!result) {
                        result = mini.decode(text)
                    }
                } catch (ex) {
                    if (mini_debugger == true) {
                        alert(url + "\njson is error.")
                    }
                }
                if (mini.isArray(result)) {
                    result = {
                        data : result
                    }
                }
                if (sf.dataField) {
                    result.data = mini._getMap(sf.dataField, result)
                }
                if (!result.data) {
                    result.data = []
                }
                var ex = {
                    data : result.data,
                    cancel : false
                };
                sf.fire("preload", ex);
                if (ex.cancel == true) {
                    return
                }
                sf.setData(ex.data);
                sf.fire("load");
                setTimeout(function() {
                    sf.doLayout()
                }, 100)
            },
            error : function(xhr, textStatus, errorThrown) {
                var e = {
                    xhr : xhr,
                    text : xhr.responseText,
                    textStatus : textStatus,
                    errorMsg : xhr.responseText,
                    errorCode : xhr.status
                };
                if (mini_debugger == true) {
                    alert(url + "\n" + e.errorCode + "\n" + e.errorMsg)
                }
                sf.fire("loaderror", e)
            }
        });
        this._ajaxer = mini.ajax(e)
    },
    setValue : function(b) {
        if (mini.isNull(b)) {
            b = ""
        }
        if (this.value !== b) {
            this.deselectAll();
            this.value = b;
            if (this._valueEl) {
                this._valueEl.value = b
            }
            var a = this.findItems(this.value);
            this.selects(a);
            this.setSelected(a[0])
        }
    },
    getValue : function() {
        return this.value
    },
    /**
     * 获取在表单中提交的值
     * @returns {String} 在表单中提交的值
     * @member mini.ListControl
     */
    getFormValue : function() {
        return this.value
    },
    setValueField : function(a) {
        this.valueField = a
    },
    getValueField : function() {
        return this.valueField
    },
    setTextField : function(a) {
        this.textField = a
    },
    getTextField : function() {
        return this.textField
    },
    /**
     * 获取下拉项的值
     * @param {Object} item 下拉项
     * @returns {String} 下拉项的值
     * @member mini.ListControl
     */
    getItemValue : function(item) {
        return String(mini._getMap(this.valueField, item))
    },
    /**
     * 获取下拉项的显示文本
     * @param {Object} item 下拉项
     * @returns {String} 下拉项的显示文本
     * @member mini.ListControl
     */
    getItemText : function(item) {
        var a = mini._getMap(this.textField, item);
        return mini.isNull(a) ? "" : String(a)
    },
    /**
     * 获取下拉项的值和显示文本
     * @param {Array/String/Function} items 下拉项数组或以逗号（{@link #delimiter}）分隔的多个下拉项值
     * @returns {String[]} 一个长度为 2 的字符串数组，数组中第 1 个元素是下拉项的值，第 2 个元素是下拉项的显示文本
     * @member mini.ListControl
     */
    getValueAndText : function(items) {
        if (mini.isNull(items)) {
            items = []
        }
        if (!mini.isArray(items)) {
            items = this.findItems(items)
        }
        var c = [];
        var f = [];
        for (var e = 0, b = items.length; e < b; e++) {
            var a = items[e];
            if (a) {
                c.push(this.getItemValue(a));
                f.push(this.getItemText(a))
            }
        }
        return [ c.join(this.delimiter), f.join(this.delimiter) ]
    },
    /**
     * 根据值获取项数组
     * @param {Function/String} values 值，多值之间使用 `,` 分隔，如果传入值为 Function，则包含两个参数，返回值类型为 Boolean：
     * @param {String} values.item 下拉项
     * @param {Number} values.index 下拉项的索引，从 0 开始
     * @param {Boolean} values.return 如果包含当前迭代的下拉项，则返回 `true`，否则返回 `false`
     * @returns {Array} 对应的项数组
     * @member mini.ListControl
     */
    findItems : function(values) {
        if (mini.isNull(values) || values === "") {
            return []
        }
        if (typeof values == "function") {
            var n = values;
            var h = [];
            var f = this.data;
            for (var d = 0, c = f.length; d < c; d++) {
                var g = f[d];
                if (n(g, d) === true) {
                    h.push(g)
                }
            }
            return h
        }
        var q = String(values).split(this.delimiter);
        var f = this.data;
        var m = {};
        for (var d = 0, c = f.length; d < c; d++) {
            var g = f[d];
            var p = g[this.valueField];
            m[p] = g
        }
        var a = [];
        for (var e = 0, b = q.length; e < b; e++) {
            var p = q[e];
            var g = m[p];
            if (g) {
                a.push(g)
            }
        }
        return a
    },
    /**
     * 删除所有项
     * @member mini.ListControl
     */
    removeAll : function() {
        var a = this.getData();
        this.removeItems(a)
    },
    /**
     * 加入多个项
     * @param {Array} items 要加入的项
     * @param {Number} index 插入位置，从 0 开始
     * @member mini.ListControl
     */
    addItems : function(items, index) {
        if (!mini.isArray(items)) {
            return
        }
        if (mini.isNull(index)) {
            index = this.data.length
        }
        this.data.insertRange(index, items);
        this.doUpdate()
    },
    /**
     * 加入单个项
     * @param {Object} item 要加入的项
     * @param {Number} index 插入位置，从 0 开始
     * @member mini.ListControl
     */
    addItem : function(item, index) {
        if (!item) {
            return
        }
        if (this.data.indexOf(item) != -1) {
            return
        }
        if (mini.isNull(index)) {
            index = this.data.length
        }
        this.data.insert(index, item);
        this.doUpdate()
    },
    /**
     * 删除多个项
     * @param {Array} items 要删除的项
     * @member mini.ListControl
     */
    removeItems : function(items) {
        if (!mini.isArray(items)) {
            return
        }
        this.data.removeRange(items);
        this._checkSelecteds();
        this.doUpdate()
    },
    /**
     * 删除项
     * @param {Object} item 要删除的项
     * @member mini.ListControl
     */
    removeItem : function(item) {
        var a = this.data.indexOf(item);
        if (a != -1) {
            this.data.removeAt(a);
            this._checkSelecteds();
            this.doUpdate()
        }
    },
    /**
     * 移动项到新索引位置
     * @param {Object} item 要移动的项
     * @param {Number} index 新位置，从 0 开始
     * @member mini.ListControl
     */
    moveItem : function(item, index) {
        if (!item || !mini.isNumber(index)) {
            return
        }
        if (index < 0) {
            index = 0
        }
        if (index > this.data.length) {
            index = this.data.length
        }
        this.data.remove(item);
        this.data.insert(index, item);
        this.doUpdate()
    },
    /**
     * @property {Object} [_selected=nul] 被选中的项
     * @member mini.ListControl
     * @private
     */
    _selected : null,
    /**
     * @property {Array} [_selecteds=[]] 被选中的多个项
     * @member mini.ListControl
     * @private
     */
    _selecteds : [],
    /**
     * @cfg {Boolean} [multiSelect=false] 多选
     * @member mini.ListControl
     * @private
     */
    multiSelect : false,
    /**
     * 检查选择的项
     * @member mini.ListControl
     * @private
     */
    _checkSelecteds : function() {
        for (var b = this._selecteds.length - 1; b >= 0; b--) {
            var a = this._selecteds[b];
            if (this.data.indexOf(a) == -1) {
                this._selecteds.removeAt(b)
            }
        }
        var c = this.getValueAndText(this._selecteds);
        this.value = c[0];
        if (this._valueEl) {
            this._valueEl.value = this.value
        }
    },
    setMultiSelect : function(a) {
        this.multiSelect = a
    },
    getMultiSelect : function() {
        return this.multiSelect
    },
    /**
     * 是否选中项
     * @param {Object} item
     * @returns {Boolean} 选中时返回 true， 否则返回 false
     * @member mini.ListControl
     */
    isSelected : function(item) {
        if (!item) {
            return false
        }
        return this._selecteds.indexOf(item) != -1
    },
    /**
     * 获取选中项集合
     * @returns {Array} 所有选中项
     * @member mini.ListControl
     */
    getSelecteds : function() {
        var a = this._selecteds.clone();
        var b = this;
        mini.sort(a, function(d, c) {
            var f = b.indexOf(d);
            var e = b.indexOf(c);
            if (f > e) {
                return 1
            }
            if (f < e) {
                return -1
            }
            return 0
        });
        return a
    },
    /**
     * 设置选中的下拉项
     * @param {Number/String/Function/Object} value 类型为 Number 时表示下拉项索引；类型为 String 时为下拉项的值
     * @member mini.ListControl
     */
    setSelected : function(value) {
        if (value) {
            this._selected = value;
            this.select(value)
        }
    },
    /**
     * 获取当前选中的下拉项
     * @returns {Object} 当前选中项
     * @member mini.ListControl
     */
    getSelected : function() {
        return this._selected
    },
    /**
     * 选中下拉项
     * @param {Number/String/Function/Object} value 要选中的下拉项的值或索引，更详细的参数信息请参见 {@link #getItem} 方法中的参数描述
     * @member mini.ListControl
     */
    select : function(value) {
        value = this.getItem(value);
        if (!value) {
            return
        }
        if (this.isSelected(value)) {
            return
        }
        this.selects([ value ])
    },
    /**
     * 取消选中下拉项
     * @param {Number/String/Function/Object} value 要取消选中的下拉项的值或索引，更详细的参数信息请参见 {@link #getItem} 方法中的参数描述
     * @member mini.ListControl
     */
    deselect : function(a) {
        a = this.getItem(a);
        if (!a) {
            return
        }
        if (!this.isSelected(a)) {
            return
        }
        this.deselects([ a ])
    },
    /**
     * 选中所有项
     * @member mini.ListControl
     */
    selectAll : function() {
        var a = this.data.clone();
        this.selects(a)
    },
    /**
     * 取消选中所有项
     * @member mini.ListControl
     */
    deselectAll : function() {
        this.deselects(this._selecteds)
    },
    /**
     * @method clearSelect
     * @member mini.ListControl
     * @alias #deselectAll
     */
    clearSelect : function() {
        this.deselectAll()
    },
    /**
     * 选中多个项
     * @param {Array} values 要选中的项
     * @member mini.ListControl
     */
    selects : function(values) {
        if (!values || values.length == 0) {
            return
        }
        values = values.clone();
        if (this.multiSelect == false && values.length > 1) {
            values.length = 1
        }
        for (var d = 0, b = values.length; d < b; d++) {
            var a = values[d];
            if (!this.isSelected(a)) {
                this._selecteds.push(a)
            }
        }
        var e = this;
        e._doSelects()
    },
    /**
     * 取消选中多个项
     * @param {Array} values 要取消选中的项
     * @member mini.ListControl
     */
    deselects : function(values) {
        if (!values || values.length == 0) {
            return
        }
        values = values.clone();
        for (var c = values.length - 1; c >= 0; c--) {
            var a = values[c];
            if (this.isSelected(a)) {
                this._selecteds.remove(a)
            }
        }
        var d = this;
        d._doSelects()
    },
    /**
     * 进行选中操作
     * @member mini.ListControl
     * @private
     */
    _doSelects : function() {
        var g = this.getValueAndText(this._selecteds);
        this.value = g[0];
        if (this._valueEl) {
            this._valueEl.value = this.value
        }
        for (var e = 0, c = this.data.length; e < c; e++) {
            var b = this.data[e];
            var a = this.isSelected(b);
            if (a) {
                this.addItemCls(b, this._itemSelectedCls)
            } else {
                this.removeItemCls(b, this._itemSelectedCls)
            }
            var d = this.data.indexOf(b);
            var h = this._createCheckId(d);
            var f = document.getElementById(h);
            if (f) {
                f.checked = !!a
            }
        }
    },
    
    /**
     * @event SelectionChanged 在时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Array} event.selecteds 所有选中项
     * @param {Object} event.selected 当前选中项
     * @param {String} event.value 当前选中项的值
     * @member mini.ListControl
     */
    
    /**
     * 改变选中项
     * @member mini.ListControl
     * @private
     * @fires SelectionChanged
     */
    _OnSelectionChanged : function(b, a) {
        var c = this.getValueAndText(this._selecteds);
        this.value = c[0];
        if (this._valueEl) {
            this._valueEl.value = this.value
        }
        var d = {
            selecteds : this.getSelecteds(),
            selected : this.getSelected(),
            value : this.getValue()
        };
        this.fire("SelectionChanged", d)
    },
    /**
     * 创建下拉项对应的多选框的 id
     * @param {Object} item 下拉项
     * @member mini.ListControl
     * @private
     */
    _createCheckId : function(item) {
        return this.uid + "$ck$" + item
    },

    /**
     * 创建下拉项的 DOM 节点 id
     * @param {Object} item 下拉项
     * @member mini.ListControl
     * @private
     */
    _createItemId : function(item) {
        return this.uid + "$" + item
    },

    /**
     * @event Click 鼠标点击时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 Click 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires Click
     */
    __OnClick : function(a) {
        this._fireEvent(a, "Click")
    },

    /**
     * @event Dblclick 双击时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 Dblclick 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires Dblclick
     */
    __OnDblClick : function(a) {
        this._fireEvent(a, "Dblclick")
    },

    /**
     * @event MouseDown 鼠标按下时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 MouseDown 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires MouseDown
     */
    __OnMouseDown : function(a) {
        this._fireEvent(a, "MouseDown")
    },

    /**
     * @event MouseUp 鼠标弹起时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 MouseUp 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires MouseUp
     */
    __OnMouseUp : function(a) {
        this._fireEvent(a, "MouseUp")
    },

    /**
     * @event MouseMove 鼠标移动时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 MouseMove 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires MouseMove
     */
    __OnMouseMove : function(a) {
        this._fireEvent(a, "MouseMove")
    },

    /**
     * @event MouseOver 鼠标滑过时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 MouseOver 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires MouseOver
     */
    __OnMouseOver : function(a) {
        this._fireEvent(a, "MouseOver")
    },

    /**
     * @event MouseOut 鼠标移出时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 MouseOut 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires MouseOut
     */
    __OnMouseOut : function(a) {
        this._fireEvent(a, "MouseOut")
    },

    /**
     * @event KeyDown 键盘按下时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 KeyDown 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires KeyDown
     */
    __OnKeyDown : function(a) {
        this._fireEvent(a, "KeyDown")
    },

    /**
     * @event KeyUp 键盘弹起时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 KeyUp 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires KeyUp
     */
    __OnKeyUp : function(a) {
        this._fireEvent(a, "KeyUp")
    },

    /**
     * @event ContextMenu 弹出上下文菜单时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 ContextMenu 事件
     * @param {Event} htmlEvt 原生的 HTML 事件
     * @member mini.ListControl
     * @private
     * @fires ContextMenu
     */
    __OnContextMenu : function(htmlEvt) {
        this._fireEvent(htmlEvt, "ContextMenu")
    },
    /**
     * 触发事件
     * @member mini.ListControl
     * @private
     */
    _fireEvent : function(event, type) {
        if (!this.enabled) {
            return
        }
        var d = this.getItemByEvent(event);
        if (!d) {
            return
        }
        var c = this["_OnItem" + type];
        if (c) {
            c.call(this, d, event)
        } else {
            var b = {
                item : d,
                htmlEvent : event
            };
            this.fire("item" + type, b)
        }
    },

    /**
     * 触发 itemclick 事件
     * @param {Object} item 鼠标点击的下拉项
     * @param {Event} htmlEvt 原生的 HTML 鼠标点击事件
     * @member mini.ListControl
     * @private
     * @fires itemclick
     */
    _OnItemClick : function(item, htmlEvt) {
        if (this.isReadOnly() || this.enabled == false || item.enabled === false) {
            htmlEvt.preventDefault();
            return
        }
        var b = this.getValue();
        if (this.multiSelect) {
            if (this.isSelected(item)) {
                this.deselect(item);
                if (this._selected == item) {
                    this._selected = null
                }
            } else {
                this.select(item);
                this._selected = item
            }
            this._OnSelectionChanged()
        } else {
            if (!this.isSelected(item)) {
                this.deselectAll();
                this.select(item);
                this._selected = item;
                this._OnSelectionChanged()
            }
        }
        if (b != this.getValue()) {
            this._OnValueChanged()
        }
        var htmlEvt = {
            item : item,
            htmlEvent : htmlEvt
        };
        this.fire("itemclick", htmlEvt)
    },
    
    /**
     * @param {Boolean} [_blurOnOut=true] 鼠标移出时是否触发推动焦点的事件
     * @member mini.ListControl
     * @private
     */
    _blurOnOut : true,
    
    /**
     * @event itemmouseout 鼠标从下拉项上移出时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 鼠标移出时指向的下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 鼠标移出事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 itemmouseout 事件
     * @param {Object} item 鼠标移出时指向的下拉项
     * @param {Event} htmlEvt 原生的 HTML 鼠标移动事件
     * @member mini.ListControl
     * @private
     * @fires itemmouseout
     */
    _OnItemMouseOut : function(item, htmlEvt) {
        if (!this.enabled) {
            return
        }
        if (this._blurOnOut) {
            this._blurItem()
        }
        var event = {
            item : item,
            htmlEvent : htmlEvt
        };
        this.fire("itemmouseout", event)
    },
    
    /**
     * @event itemmousemove 鼠标在下拉项上移动时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 鼠标移动时指向的下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 鼠标移动事件
     * @member mini.ListControl
     */
    
    /**
     * 触发 itemmousemove 事件
     * @param {Object} item 鼠标移动时指向的下拉项
     * @param {Event} htmlEvt 原生的 HTML 鼠标移动事件
     * @member mini.ListControl
     * @private
     * @fires itemmousemove
     */
    _OnItemMouseMove : function(item, htmlEvt) {
        if (!this.enabled || item.enabled === false) {
            return
        }
        this._focusItem(item);
        var event = {
            item : item,
            htmlEvent : htmlEvt
        };
        this.fire("itemmousemove", event)
    },
    
    /**
     * @event itemclick 单击下拉项时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.item 当前点击的下拉项
     * @param {Event} event.htmlEvent 原生的 HTML 单击事件
     * @member mini.ListControl
     */

    /**
     * 绑定 itemclick 事件
     * @param {Function} fn 事件处理函数
     * @param {Object} fn.event {@link #itemclick} 事件对象
     * @param {Object} [scope=this] 事件处理函数的作用域对象
     * @member mini.ListControl
     */
    onItemClick : function(fn, scope) {
        this.on("itemclick", fn, scope)
    },
    
    /**
     * @event itemmousedown 在下拉项上按下鼠标时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @member mini.ListControl
     */
    
    /**
     * 绑定 itemmousedown 事件
     * @param {Function} fn 事件处理函数
     * @param {Object} fn.event {@link #itemmousedown} 事件对象
     * @param {Object} [scope=this] 事件处理函数的作用域对象
     * @member mini.ListControl
     */
    onItemMouseDown : function(fn, scope) {
        this.on("itemmousedown", fn, scope)
    },
    
    /**
     * @event beforeload 在加载数据（发起 Ajax 请求）之前触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {String} event.url 请求的 URL
     * @param {Boolean} [event.async=false] 是否为异步请求
     * @param {String} event.type 请求方式，默认为 {@link #ajaxType} 的值
     * @param {Object} event.data 请求参数
     * @param {Object} event.params 请求参数，与 `data` 相同
     * @param {Boolean} [event.cache=false] 是否允许缓存
     * @param {Boolean} [event.cancel=false] 是否取消请求
     * @member mini.ListControl
     */
    
    /**
     * 绑定 beforeload 事件
     * @param {Function} fn 事件处理函数
     * @param {Object} fn.event {@link #beforeload} 事件对象
     * @param {Object} [scope=this] 事件处理函数的作用域对象
     * @member mini.ListControl
     */
    onBeforeLoad : function(fn, scope) {
        this.on("beforeload", fn, scope)
    },
    
    /**
     * @event load 将数据加载到控件后触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @member mini.ListControl
     */
    
    /**
     * 绑定 `load` 事件
     * @param {Function} fn 事件处理函数
     * @param {Object} fn.event `load` 事件对象
     * @param {Object} [scope=this] 事件处理函数的作用域对象
     * @member mini.ListControl
     */
    onLoad : function(fn, scope) {
        this.on("load", fn, scope)
    },
    
    /**
     * @event loaderror 在加载数据发生错误时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.xhr ajax 请求的 XMLHttpRequest 对象
     * @param {String} event.text xhr 的 responseText
     * @param {String} event.textStatus xhr 的 textStatus
     * @param {String} event.errorMsg xhr 的 responseText
     * @param {Number} event.errorCode xhr 的 status
     * @member mini.ListControl
     */
    
    /**
     * 绑定 loaderror 事件
     * @param {Function} fn 事件处理函数
     * @param {Object} fn.event {@link #loaderror} 事件对象
     * @param {Object} [scope=this] 事件处理函数的作用域对象
     * @member mini.ListControl
     */
    onLoadError : function(fn, scope) {
        this.on("loaderror", fn, scope)
    },
    
    /**
     * @event preload 从后台请求到数据后，准备将数据装载到控件时触发
     * @param {Object} event 当前事件对象
     * @param {String} event.type 事件类型
     * @param {mini.Control} event.source 事件源
     * @param {mini.Control} event.sender 事件发送者
     * @param {Object} event.data 从后台请求到的数据对象
     * @param {Boolean} [event.cancel=false] 是否取消
     * @member mini.ListControl
     */
    
    /**
     * 绑定 preload 事件
     * @param {Function} fn 事件处理函数
     * @param {Object} fn.event {@link #preload} 事件对象
     * @param {Object} [scope=this] 事件处理函数的作用域对象
     * @member mini.ListControl
     */
    onPreLoad : function(fn, scope) {
        this.on("preload", fn, scope)
    },
    
    /**
     * 获取 DOM 节点的属性列表。除了父类解析的属性外，还会解析以下属性：
     * <ul>
     * <li>
     *   <div>String：</div>
     *   <ul>
     *   <li>url</li>
     *   <li>value</li>
     *   <li>textField</li>
     *   <li>valueField</li>
     *   <li></li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Boolean：</div>
     *   <ul>
     *   <li>multiSelect</li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Object：</div>
     *   <ul>
     *   <li>data</li>
     *   </ul>
     * </li>
     * <li>
     *   <div>Function（Event）：</div>
     *   <ul>
     *   <li>onitemclick</li>
     *   <li>onitemmousemove</li>
     *   <li>onselectionchanged</li>
     *   <li>onitemdblclick</li>
     *   <li>onbeforeload</li>
     *   <li>onload</li>
     *   <li>onloaderror</li>
     *   <li>ondataload</li>
     *   </ul>
     * </li>
     * </ul>
     * @param {HTMLElement} el 要进行解析的 DOM 节点
     * @returns {Object} 有效的属性列表。
     * @member mini.ListControl
     * @protected
     */
    getAttrs : function(el) {
        var h = mini.ListControl.superclass.getAttrs.call(this, el);
        mini._ParseString(el, h, [ "url", "data", "value", "textField",
                "valueField", "onitemclick", "onitemmousemove",
                "onselectionchanged", "onitemdblclick", "onbeforeload",
                "onload", "onloaderror", "ondataload" ]);
        mini._ParseBool(el, h, [ "multiSelect" ]);
        var j = h.valueField || this.valueField;
        var c = h.textField || this.textField;
        if (el.nodeName.toLowerCase() == "select") {
            var e = [];
            for (var f = 0, d = el.length; f < d; f++) {
                var g = el.options[f];
                var a = {};
                a[c] = g.text;
                a[j] = g.value;
                e.push(a)
            }
            if (e.length > 0) {
                h.data = e
            }
        }
        return h
    }
});

/**
 * 所有 MiniUI 控件的 uid 与其布局的对应关系
 * @member mini
 * @private
 */
mini._Layouts = {};

/**
 * 布局，调整控件达到合适尺寸
 * @param {String/mini.Container/HTMLElement} [container=document.body] 要进行布局调整的容器对象，或容器对象的 id
 * @param {Boolean} [recursive=true] 是否递归调整子容器的布局
 * @member mini
 */
mini.layout = function(container, recursive) {
    if (!document.body) {
        return
    }
    function c(h) {
        if (!h) {
            return
        }
        var j = mini.get(h);
        if (j) {
            if (j.doLayout) {
                if (!mini._Layouts[j.uid]) {
                    mini._Layouts[j.uid] = j;
                    if (recursive !== false || j.isFixedSize() == false) {
                        j.doLayout(false)
                    }
                    delete mini._Layouts[j.uid]
                }
            }
        } else {
            var g = h.childNodes;
            if (g) {
                for (var e = 0, d = g.length; e < d; e++) {
                    var f = g[e];
                    c(f)
                }
            }
        }
    }
    if (!container) {
        container = document.body
    }
    c(container);
    if (container == document.body) {
        mini.layoutIFrames()
    }
};
/**
 * 将 miniUI 控件替换到指定 DOM 节点，并将指定 DOM 节点的属性应用到该 miniUI 控件上
 * @param {String/HTMLElement} id DOM 节点的 id 或 dom 节点实例
 * @return {mini.Control} this
 * @member mini
 */
mini.applyTo = function(id) {
    id = mini.byId(id);
    if (!id) {
        return this
    }
    if (mini.get(id)) {
        throw new Error("not applyTo a mini control")
    }
    var a = this.getAttrs(id);
    delete a._applyTo;
    if (mini.isNull(a.defaultValue) && !mini.isNull(a.value)) {
        a.defaultValue = a.value
    }
    if (mini.isNull(a.defaultText) && !mini.isNull(a.text)) {
        a.defaultText = a.text
    }
    var c = id.parentNode;
    if (c && this.el != id) {
        c.replaceChild(this.el, id)
    }
    this.set(a);
    this._afterApply(id);
    return this
};
/**
 * 将 DOM 节点解析为 miniUI 控件
 * @param {HTMLElement} element DOM 节点
 * @member mini
 * @private
 */
mini._doParse = function(element) {
    if (!element) {
        return
    }
    var m = element.nodeName.toLowerCase();
    if (!m) {
        return
    }
    var j = String(element.className);
    if (j) {
        var f = mini.get(element);
        if (!f) {
            var d = j.split(" ");
            for (var g = 0, e = d.length; g < e; g++) {
                var n = d[g];
                var h = mini.getClassByUICls(n);
                if (h) {
                    mini.removeClass(element, n);
                    var k = new h();
                    mini.applyTo.call(k, element);
                    element = k.el;
                    break
                }
            }
        }
    }
    if (m == "select" || mini.hasClass(element, "mini-menu")
            || mini.hasClass(element, "mini-datagrid")
            || mini.hasClass(element, "mini-treegrid")
            || mini.hasClass(element, "mini-tree") || mini.hasClass(element, "mini-button")
            || mini.hasClass(element, "mini-textbox")
            || mini.hasClass(element, "mini-buttonedit")) {
        return
    }
    var a = mini.getChildNodes(element, true);
    for (var g = 0, e = a.length; g < e; g++) {
        var c = a[g];
        if (c.nodeType == 1) {
            if (c.parentNode == element) {
                mini._doParse(c)
            }
        }
    }
};

/**
 * 被移除的 MiniUI 控件数组
 * @property {mini.Component[]} [_Removes=[]] 
 * @private
 * @readonly
 */
mini._Removes = [];
/**
 * 是否为第一次将页面中的 DOM 节点解析为 MiniUI 控件
 * @property {Boolean} [_firstParse=true] 
 * @private
 * @readonly
 */
mini._firstParse = true;

/**
 * 将html标签解析为miniui控件。<br>
 * 解析后，才能使用 {@link mini#get} 获取到控件对象。
 * @param {String/HTMLElement/mini.Control} [element=document.body] 需要进行解析的 DOM 节点，如果传入的是一个字符串，则其值为 MiniUI 控件的 ID。
 * @param {Boolean} [relayout=true] 是否重新调整 element 的布局
 * @member mini
 */
mini.parse = function(element, relayout) {
    if (mini._firstParse) {
        mini._firstParse = false;
        var m = document.getElementsByTagName("iframe");
        var c = [];
        for (var h = 0, g = m.length; h < g; h++) {
            var k = m[h];
            c.push(k)
        }
        for (var h = 0, g = c.length; h < g; h++) {
            var k = c[h];
            var a = $(k).attr("src");
            if (!a) {
                continue
            }
            k.loaded = false;
            k._onload = k.onload;
            k._src = a;
            k.onload = function() {
            };
            k.src = ""
        }
        setTimeout(function() {
            for (var o = 0, n = c.length; o < n; o++) {
                var p = c[o];
                if (p._src && $(p).attr("src") == "") {
                    p.loaded = true;
                    p.onload = p._onload;
                    p.src = p._src;
                    p._src = p._onload = null
                }
            }
        }, 20)
    }
    if (typeof element == "string") {
        var b = element;
        element = mini.byId(b);
        if (!element) {
            element = document.body
        }
    }
    if (element && !mini.isElement(element)) {
        element = element.el
    }
    if (!element) {
        element = document.body
    }
    var f = mini.WindowVisible;
    if (isIE) {
        mini.WindowVisible = false
    }
    mini._doParse(element);
    mini.WindowVisible = f;
    if (relayout !== false) {
        mini.layout(element)
    }
};
/**
 * 将 DOM 节点的指定属性值解析为 String 类型后，将其设为 miniUI 控件的属性
 * @param {HTMLElement} element DOM 节点
 * @param {mini.Control} control miniUI 控件
 * @param {String[]} attrNames 要解析的属性名称
 * @member mini
 * @private
 */
mini._ParseString = function(element, control, attrNames) {
    for (var d = 0, a = attrNames.length; d < a; d++) {
        var g = attrNames[d];
        var f = mini.getAttr(element, g);
        if (f) {
            control[g] = f
        }
    }
};
/**
 * 将 DOM 节点的指定属性值解析为 Boolean 类型后，将其设为 miniUI 控件的属性
 * @param {HTMLElement} element DOM 节点
 * @param {mini.Control} control miniUI 控件
 * @param {String[]} attrNames 要解析的属性名称
 * @member mini
 * @private
 */
mini._ParseBool = function(element, control, attrNames) {
    for (var d = 0, a = attrNames.length; d < a; d++) {
        var g = attrNames[d];
        var f = mini.getAttr(element, g);
        if (f) {
            control[g] = f == "true" ? true : false
        }
    }
};
/**
 * 将 DOM 节点的指定属性值解析为 Integer 类型后，将其设为 miniUI 控件的属性
 * @param {HTMLElement} element DOM 节点
 * @param {mini.Control} control miniUI 控件
 * @param {String[]} attrNames 要解析的属性名称
 * @member mini
 * @private
 */
mini._ParseInt = function(element, control, attrNames) {
    for (var d = 0, a = attrNames.length; d < a; d++) {
        var g = attrNames[d];
        var f = parseInt(mini.getAttr(element, g));
        if (!isNaN(f)) {
            control[g] = f
        }
    }
};
/**
 * 将 DOM 节点解析为表格的列，会解析的属性包括但不限于：
 * <ul>
 * <li>
 *   <div>String：</div>
 *   <ul>
 *   <li>name</li>
 *   <li>header</li>
 *   <li>field</li>
 *   <li>editor</li>
 *   <li>filter</li>
 *   <li>renderer</li>
 *   <li>width</li>
 *   <li>type</li>
 *   <li>headerAlign</li>
 *   <li>align</li>
 *   <li>headerCls</li>
 *   <li>cellCls</li>
 *   <li>headerStyle</li>
 *   <li>cellStyle</li>
 *   <li>displayField</li>
 *   <li>dateFormat</li>
 *   <li>listFormat</li>
 *   <li>mapFormat</li>
 *   <li>trueValue</li>
 *   <li>falseValue</li>
 *   <li>dataType</li>
 *   <li>vtype</li>
 *   <li>currencyUnit</li>
 *   <li>summaryType</li>
 *   <li>summaryRenderer</li>
 *   <li>groupSummaryType</li>
 *   <li>groupSummaryRenderer</li>
 *   <li>defaultValue</li>
 *   <li>defaultText</li>
 *   <li>decimalPlaces</li>
 *   <li>data-options</li>
 *   </ul>
 * </li>
 * <li>
 *   <div>Boolean：</div>
 *   <ul>
 *   <li>visible</li>
 *   <li>readOnly</li>
 *   <li>allowSort</li>
 *   <li>allowResize</li>
 *   <li>allowMove</li>
 *   <li>allowDrag</li>
 *   <li>autoShowPopup</li>
 *   <li>unique</li>
 *   <li>autoEscape</li>
 *   <li>enabled</li>
 *   <li>hideable</li>
 *   </ul>
 * </li>
 * </ul>
 * @param {HTMLElement} el DOM 节点
 * @member mini
 * @private
 */
mini._ParseColumns = function(el) {
    var columns = [];
    var cs = mini.getChildNodes(el);
    for (var i = 0, l = cs.length; i < l; i++) {
        var node = cs[i];
        var jq = jQuery(node);
        var column = {};
        var editor = null, filter = null;
        var subCs = mini.getChildNodes(node);
        if (subCs) {
            for (var ii = 0, li = subCs.length; ii < li; ii++) {
                var subNode = subCs[ii];
                var property = jQuery(subNode).attr("property");
                if (!property) {
                    continue
                }
                property = property.toLowerCase();
                if (property == "columns") {
                    column.columns = mini._ParseColumns(subNode);
                    jQuery(subNode).remove()
                }
                if (property == "editor" || property == "filter") {
                    var className = subNode.className;
                    var classes = className.split(" ");
                    for (var i3 = 0, l3 = classes.length; i3 < l3; i3++) {
                        var cls = classes[i3];
                        var clazz = mini.getClassByUICls(cls);
                        if (clazz) {
                            var ui = new clazz();
                            if (property == "filter") {
                                filter = ui.getAttrs(subNode);
                                filter.type = ui.type
                            } else {
                                editor = ui.getAttrs(subNode);
                                editor.type = ui.type
                            }
                            break
                        }
                    }
                    jQuery(subNode).remove()
                }
            }
        }
        column.header = node.innerHTML;
        mini._ParseString(node, column, [ "name", "header", "field", "editor",
                "filter", "renderer", "width", "type", "renderer",
                "headerAlign", "align", "headerCls", "cellCls", "headerStyle",
                "cellStyle", "displayField", "dateFormat", "listFormat",
                "mapFormat", "trueValue", "falseValue", "dataType", "vtype",
                "currencyUnit", "summaryType", "summaryRenderer",
                "groupSummaryType", "groupSummaryRenderer", "defaultValue",
                "defaultText", "decimalPlaces", "data-options" ]);
        mini._ParseBool(node, column, [ "visible", "readOnly", "allowSort",
                "allowResize", "allowMove", "allowDrag", "autoShowPopup",
                "unique", "autoEscape", "enabled", "hideable" ]);
        if (editor) {
            column.editor = editor
        }
        if (filter) {
            column.filter = filter
        }
        if (column.dataType) {
            column.dataType = column.dataType.toLowerCase()
        }
        if (column.defaultValue === "true") {
            column.defaultValue = true
        }
        if (column.defaultValue === "false") {
            column.defaultValue = false
        }
        columns.push(column);
        var options = column["data-options"];
        if (options) {
            options = eval("(" + options + ")");
            if (options) {
                mini.copyTo(column, options)
            }
        }
    }
    return columns
};
/**
 * @property {Object} _Columns
 * @member mini
 * @private
 */
mini._Columns = {};
/**
 * _getColumn
 * @param {String} b
 * @member mini
 * @private
 */
mini._getColumn = function(b) {
    var a = mini._Columns[b.toLowerCase()];
    if (!a) {
        return {}
    }
    return a()
};

/**
 * 索引列
 * @class mini.IndexColumn
 * @constructor
 * @param column 普通列
 */
mini.IndexColumn = function(column) {
    return mini.copyTo({
        /**
         * @cfg {Number} [width=30] 宽度 
         * @accessor
         * @member mini.IndexColumn
         */
        width : 30,
        /**
         * @cfg {String} [cellCls=""] 单元格样式类 
         * @accessor
         * @member mini.IndexColumn
         */
        cellCls : "",
        /**
         * @cfg {String} [align="center"] 对齐方式
         * @accessor
         * @member mini.IndexColumn
         */
        align : "center",
        /**
         * @cfg {Boolean} [draggable=false] 是否可以拖拽
         * @accessor
         * @member mini.IndexColumn
         */
        draggable : false,
        /**
         * @cfg {Boolean} [allowDrag=true] 是否允许拖拽
         * @accessor
         * @member mini.IndexColumn
         */
        allowDrag : true,
        /**
         * @cfg {Boolean} [hideable=true] 是否可隐藏
         * @accessor
         * @member mini.IndexColumn
         */
        hideable : true,
        /**
         * 初始化
         * @param  {mini.DataGrid} grid 数据表格
         * @member mini.IndexColumn
         */
        init : function(grid) {
            grid.on("addrow", this.__OnIndexChanged, this);
            grid.on("removerow", this.__OnIndexChanged, this);
            grid.on("moverow", this.__OnIndexChanged, this);
            if (grid.isTree) {
                grid.on("addnode", this.__OnIndexChanged, this);
                grid.on("removenode", this.__OnIndexChanged, this);
                grid.on("movenode", this.__OnIndexChanged, this);
                grid.on("loadnode", this.__OnIndexChanged, this);
                this._gridUID = grid.uid;
                this._rowIdField = "_id"
            }
        },
        /**
         * 获取索引单元格的 id
         * @param  {mini.DataGrid} grid 数据表格
         * @member mini.IndexColumn
         */
        getNumberId : function(grid) {
            return this._gridUID + "$number$" + grid[this._rowIdField]
        },
        /**
         * 创建索引单元格的数值
         * @param  {mini.DataGrid} grid 数据表格
         * @param  {Number} current 当前索引值
         * @member mini.IndexColumn
         */
        createNumber : function(grid, current) {
            if (mini.isNull(grid.pageIndex)) {
                return current + 1
            } else {
                return (grid.pageIndex * grid.pageSize) + current + 1
            }
        },
        /**
         * 渲染单元格的显示内容
         * @param {Object} evt 事件对象
         * @member mini.IndexColumn
         */
        renderer : function(evt) {
            var b = evt.sender;
            if (this.draggable) {
                if (!evt.cellStyle) {
                    evt.cellStyle = ""
                }
                evt.cellStyle += ";cursor:move;"
            }
            var c = '<div id="' + this.getNumberId(evt.record) + '">';
            if (mini.isNull(b.getPageIndex)) {
                c += evt.rowIndex + 1
            } else {
                c += (b.getPageIndex() * b.getPageSize()) + evt.rowIndex + 1
            }
            c += "</div>";
            return c
        },
        /**
         * 索引改变事件的处理方法
         * @param {Object} evt 事件对象
         * @member mini.IndexColumn
         * @private
         */
        __OnIndexChanged : function(evt) {
            var h = evt.sender;
            var f = h.getDataView();
            for (var g = 0, c = f.length; g < c; g++) {
                var b = f[g];
                var k = this.getNumberId(b);
                var d = document.getElementById(k);
                if (d) {
                    d.innerHTML = this.createNumber(h, g)
                }
            }
        }
    }, column)
};
mini._Columns.indexcolumn = mini.IndexColumn;

/**
 * 选择列
 * @class mini.CheckColumn
 * @constructor
 * @param column 普通列
 */
mini.CheckColumn = function(column) {
    return mini.copyTo({
        /**
         * @cfg {Number} [width=30] 宽度 
         * @accessor
         * @member mini.CheckColumn
         */
        width : 30,
        /**
         * @cfg {String} [cellCls="mini-checkcolumn"] 单元格样式类 
         * @accessor
         * @member mini.CheckColumn
         */
        cellCls : "mini-checkcolumn",
        /**
         * @cfg {String} [headerCls="mini-checkcolumn"] 对齐方式
         * @accessor
         * @member mini.CheckColumn
         */
        headerCls : "mini-checkcolumn",
        /**
         * @cfg {Boolean} [hideable=true] 是否可隐藏
         * @accessor
         * @member mini.CheckColumn
         */
        hideable : true,
        /**
         * @property {Boolean} [_multiRowSelect=true] 是否允许多选
         * @member mini.CheckColumn
         * @private
         */
        _multiRowSelect : true,
        /**
         * 表头渲染器
         * @param  {mini.DataGrid} grid 数据表格
         * @member mini.CheckColumn
         */
        header : function(grid) {
            var d = this.uid + "checkall";
            var b = '<input type="checkbox" id="' + d + '" />';
            if (this.multiSelect == false) {
                b = ""
            }
            return b
        },
        /**
         * 获取选择列单元格的 id
         * @param  {mini.DataGrid} grid 数据表格
         * @member mini.CheckColumn
         */
        getCheckId : function(b, grid) {
            return this._gridUID + "$checkcolumn$" + b[this._rowIdField] + "$" + grid._id
        },
        /**
         * 初始化
         * @param  {mini.DataGrid} grid 数据表格
         * @member mini.CheckColumn
         */
        init : function(grid) {
            grid.on("selectionchanged", this.__OnSelectionChanged, this);
            grid.on("HeaderCellClick", this.__OnHeaderCellClick, this)
        },
        /**
         * 渲染单元格的显示内容
         * @param {Object} evt 事件对象
         * @member mini.CheckColumn
         */
        renderer : function(evt) {
            var h = this.getCheckId(evt.record, evt.column);
            var f = evt.sender.isSelected ? evt.sender.isSelected(evt.record) : false;
            var d = "checkbox";
            var c = evt.sender;
            if (c.getMultiSelect() == false) {
                d = "radio"
            }
            var b = '<input type="' + d + '" id="' + h + '" '
                    + (f ? "checked" : "") + ' hidefocus style="outline:none;" onclick="return false"/>';
            b += '<div class="mini-evt-radio-mask"></div>';
            return b
        },
        
        /**
         * 表头单元格单击事件的处理方法
         * @param {Object} evt 事件对象
         * @member mini.CheckColumn
         * @private
         * @fires checkall
         */
        __OnHeaderCellClick : function(evt) {
            var c = evt.sender;
            if (evt.column != this) {
                return
            }
            var g = c.uid + "checkall";
            var b = document.getElementById(g);
            if (b) {
                if (c.getMultiSelect()) {
                    if (b.checked) {
                        c.deselectAll();
                        var d = c.getDataView();
                        c.selects(d)
                    } else {
                        c.deselectAll()
                    }
                } else {
                    c.deselectAll();
                    if (b.checked) {
                        c.select(0)
                    }
                }
                c.fire("checkall")
            }
        },
        __OnSelectionChanged : function(j) {
            var b = j.sender;
            var d = b.toArray();
            var k = this;
            for (var g = 0, f = d.length; g < f; g++) {
                var h = d[g];
                var m = b.isSelected(h);
                var c = k.getCheckId(h, k);
                var n = document.getElementById(c);
                if (n) {
                    n.checked = m
                }
            }
            if (!this._timer) {
                this._timer = setTimeout(function() {
                    k._doCheckState(b);
                    k._timer = null
                }, 10)
            }
        },
        _doCheckState : function(c) {
            var e = c.uid + "checkall";
            var b = document.getElementById(e);
            if (b && c._getSelectAllCheckState) {
                var d = c._getSelectAllCheckState();
                if (d == "has") {
                    b.indeterminate = true;
                    b.checked = true
                } else {
                    b.indeterminate = false;
                    b.checked = d
                }
            }
        }
    }, column)
};
mini._Columns.checkcolumn = mini.CheckColumn;
mini.ExpandColumn = function(a) {
    return mini.copyTo({
        width : 30,
        headerAlign : "center",
        align : "center",
        draggable : false,
        cellStyle : "padding:0",
        cellCls : "mini-grid-expandCell",
        hideable : true,
        renderer : function(b) {
            return '<a class="mini-grid-ecIcon" href="javascript:#" onclick="return false"></a>'
        },
        init : function(b) {
            b.on("cellclick", this.__OnCellClick, this)
        },
        /**
                     * 
 * @fires render
 * @fires render
                     */
        __OnCellClick : function(d) {
            var c = d.sender;
            if (d.column == this && c.isShowRowDetail) {
                if (mini.findParent(d.htmlEvent.target,
                        "mini-grid-ecIcon")) {
                    var b = c.isShowRowDetail(d.record);
                    if (!b) {
                        d.cancel = false;
                        c.fire("beforeshowrowdetail", d);
                        if (d.cancel === true) {
                            return
                        }
                    } else {
                        d.cancel = false;
                        c.fire("beforehiderowdetail", d);
                        if (d.cancel === true) {
                            return
                        }
                    }
                    if (c.autoHideRowDetail) {
                        c.hideAllRowDetail()
                    }
                    if (b) {
                        c.hideRowDetail(d.record)
                    } else {
                        c.showRowDetail(d.record)
                    }
                }
            }
        }
    }, a)
};
mini._Columns.expandcolumn = mini.ExpandColumn;
mini.CheckBoxColumn = function(a) {
    return mini.copyTo({
        _type : "checkboxcolumn",
        header : "",
        headerAlign : "center",
        cellCls : "mini-checkcolumn",
        trueValue : true,
        falseValue : false,
        readOnly : false,
        getCheckId : function(b, c) {
            return this._gridUID + "$checkbox$"
                    + b[this._rowIdField] + "$" + c._id
        },
        getCheckBoxEl : function(b, c) {
            return document.getElementById(this
                    .getCheckId(b, c))
        },
        renderer : function(f) {
            var g = this.getCheckId(f.record, f.column);
            var b = mini._getMap(f.field, f.record);
            var d = b == this.trueValue ? true : false;
            var c = "checkbox";
            return '<input type="'
                    + c
                    + '" id="'
                    + g
                    + '" '
                    + (d ? "checked" : "")
                    + ' hidefocus style="outline:none;" onclick="return false;"/>'
        },
        init : function(e) {
            this.grid = e;
            //@fires render
            function b(i) {
                if (e.isReadOnly() || this.readOnly) {
                    return
                }
                i.value = mini._getMap(i.field, i.record);
                e.fire("cellbeginedit", i);
                if (i.cancel !== true) {
                    var g = mini._getMap(i.column.field,
                            i.record);
                    var h = g == this.trueValue ? this.falseValue
                            : this.trueValue;
                    if (e._OnCellCommitEdit) {
                        e._OnCellCommitEdit(i.record, i.column,
                                h);
                        e._OnCellEndEdit(i.record, i.column)
                    }
                }
            }
            /**
                         * 
 * @fires render
                         */
            function d(h) {
                if (h.column == this) {
                    var i = this.getCheckId(h.record, h.column);
                    var g = h.htmlEvent.target;
                    if (g.id == i) {
                        if (e.allowCellEdit) {
                            h.cancel = false;
                            b.call(this, h)
                        } else {
                            if (this.readOnly) {
                                return
                            }
                            h.value = mini._getMap(
                                    h.column.field, h.record);
                            e.fire("cellbeginedit", h);
                            if (h.cancel == true) {
                                return
                            }
                            if (e.isEditingRow
                                    && e.isEditingRow(h.record)) {
                                setTimeout(function() {
                                    g.checked = !g.checked
                                }, 1)
                            }
                        }
                    }
                }
            }
            e.on("cellclick", d, this);
            mini.on(this.grid.el, "keydown", function(h) {
                if (h.keyCode == 32 && e.allowCellEdit) {
                    var i = e.getCurrentCell();
                    if (!i) {
                        return
                    }
                    if (i[1] != this) {
                        return
                    }
                    var g = {
                        record : i[0],
                        column : i[1]
                    };
                    g.field = g.column.field;
                    b.call(this, g);
                    h.preventDefault()
                }
            }, this);
            var c = parseInt(this.trueValue), f = parseInt(this.falseValue);
            if (!isNaN(c)) {
                this.trueValue = c
            }
            if (!isNaN(f)) {
                this.falseValue = f
            }
        }
    }, a)
};
mini._Columns.checkboxcolumn = mini.CheckBoxColumn;
mini.RadioButtonColumn = function(a) {
    return mini.copyTo({
        _type : "radiobuttoncolumn",
        header : "",
        headerAlign : "center",
        cellCls : "mini-checkcolumn",
        trueValue : true,
        falseValue : false,
        readOnly : false,
        getCheckId : function(b, c) {
            return this._gridUID + "$radio$"
                    + b[this._rowIdField] + "$" + c._id
        },
        getCheckBoxEl : function(b, c) {
            return document.getElementById(this
                    .getCheckId(b, c))
        },
        renderer : function(g) {
            var b = g.sender;
            var d = this.getCheckId(g.record, g.column);
            var j = mini._getMap(g.field, g.record);
            var i = j == this.trueValue ? true : false;
            var h = "radio";
            var c = b._id + g.column.field;
            var f = "";
            var k = '<div style="position:relative;">';
            k += '<input name="'
                    + c
                    + '" type="'
                    + h
                    + '" id="'
                    + d
                    + '" '
                    + (i ? "checked" : "")
                    + ' hidefocus style="outline:none;" onclick="return false;" style="position:relative;z-index:1;"/>';
            if (!b.allowCellEdit) {
                if (!b.isEditingRow(g.record)) {
                    k += '<div class="mini-grid-radio-mask"></div>'
                }
            }
            k += "</div>";
            return k
        },
        init : function(e) {
            this.grid = e;
            //@fires render
            function b(n) {
                if (e.isReadOnly() || this.readOnly) {
                    return
                }
                n.value = mini._getMap(n.field, n.record);
                e.fire("cellbeginedit", n);
                if (n.cancel !== true) {
                    var h = mini._getMap(n.column.field,
                            n.record);
                    if (h == this.trueValue) {
                        return
                    }
                    var m = h == this.trueValue ? this.falseValue
                            : this.trueValue;
                    var k = e.getData();
                    for (var j = 0, g = k.length; j < g; j++) {
                        var o = k[j];
                        if (o == n.record) {
                            continue
                        }
                        var h = mini._getMap(n.column.field, o);
                        if (h != this.falseValue) {
                            e.updateRow(o, n.column.field,
                                    this.falseValue)
                        }
                    }
                    if (e._OnCellCommitEdit) {
                        e._OnCellCommitEdit(n.record, n.column,
                                m)
                    }
                }
            }
            function d(i) {
                if (i.column == this) {
                    var j = this.getCheckId(i.record, i.column);
                    var g = i.htmlEvent.target;
                    if (g.id == j) {
                        if (e.allowCellEdit) {
                            i.cancel = false;
                            b.call(this, i)
                        } else {
                            if (e.isEditingRow
                                    && e.isEditingRow(i.record)) {
                                var h = this;
                                setTimeout(
                                        function() {
                                            g.checked = true;
                                            var p = e.getData();
                                            for (var n = 0, k = p.length; n < k; n++) {
                                                var s = p[n];
                                                if (s == i.record) {
                                                    continue
                                                }
                                                var q = i.column.field;
                                                var m = mini
                                                        ._getMap(
                                                                q,
                                                                s);
                                                if (m != h.falseValue) {
                                                    if (s != i.record) {
                                                        if (e._dataSource) {
                                                            mini
                                                                    ._setMap(
                                                                            i.column.field,
                                                                            h.falseValue,
                                                                            s);
                                                            e._dataSource
                                                                    ._setModified(
                                                                            s,
                                                                            q,
                                                                            m)
                                                        } else {
                                                            var r = {};
                                                            mini
                                                                    ._setMap(
                                                                            q,
                                                                            h.falseValue,
                                                                            r);
                                                            e
                                                                    ._doUpdateRow(
                                                                            s,
                                                                            r)
                                                        }
                                                    }
                                                }
                                            }
                                        }, 1)
                            }
                        }
                    }
                }
            }
            e.on("cellclick", d, this);
            mini.on(this.grid.el, "keydown", function(h) {
                if (h.keyCode == 32 && e.allowCellEdit) {
                    var i = e.getCurrentCell();
                    if (!i) {
                        return
                    }
                    if (i[1] != this) {
                        return
                    }
                    var g = {
                        record : i[0],
                        column : i[1]
                    };
                    g.field = g.column.field;
                    b.call(this, g);
                    h.preventDefault()
                }
            }, this);
            var c = parseInt(this.trueValue), f = parseInt(this.falseValue);
            if (!isNaN(c)) {
                this.trueValue = c
            }
            if (!isNaN(f)) {
                this.falseValue = f
            }
        }
    }, a)
};
mini._Columns.radiobuttoncolumn = mini.RadioButtonColumn;
mini.ComboBoxColumn = function(a) {
    return mini.copyTo({
        renderer : function(p) {
            var q = !mini.isNull(p.value) ? String(p.value) : "";
            var r = q.split(",");
            var t = "id", h = "text";
            var j = {};
            var n = p.column.editor;
            if (n && n.type == "combobox") {
                var d = this.__editor;
                if (!d) {
                    if (mini.isControl(n)) {
                        d = n
                    } else {
                        n = mini.clone(n);
                        d = mini.create(n)
                    }
                    this.__editor = d
                }
                t = d.getValueField();
                h = d.getTextField();
                j = this._valueMaps;
                if (!j) {
                    j = {};
                    var m = d.getData();
                    for (var k = 0, g = m.length; k < g; k++) {
                        var c = m[k];
                        j[c[t]] = c
                    }
                    this._valueMaps = j
                }
            }
            var f = [];
            for (var k = 0, g = r.length; k < g; k++) {
                var b = r[k];
                var c = j[b];
                if (c) {
                    var s = c[h];
                    if (s === null || s === undefined) {
                        s = ""
                    }
                    f.push(s)
                }
            }
            return f.join(",")
        }
    }, a)
};
mini._Columns.comboboxcolumn = mini.ComboBoxColumn;
mini._Resizer = function(a) {
    this.owner = a;
    mini.on(this.owner.el, "mousedown", this.__OnMouseDown, this)
};
mini._Resizer.prototype = {
    __OnMouseDown : function(c) {
        var a = mini.hasClass(c.target, "mini-resizer-trigger");
        if (a && this.owner.allowResize) {
            var b = this._getResizeDrag();
            b.start(c)
        }
    },
    _getResizeDrag : function() {
        if (!this._resizeDragger) {
            this._resizeDragger = new mini.Drag({
                capture : true,
                onStart : mini.createDelegate(this._OnDragStart, this),
                onMove : mini.createDelegate(this._OnDragMove, this),
                onStop : mini.createDelegate(this._OnDragStop, this)
            })
        }
        return this._resizeDragger
    },
    _OnDragStart : function(a) {
        this.mask = mini.append(document.body,
                '<div class="mini-resizer-mask mini-fixed"></div>');
        this.proxy = mini.append(document.body,
                '<div class="mini-resizer-proxy"></div>');
        this.proxy.style.cursor = "se-resize";
        this.elBox = mini.getBox(this.owner.el);
        mini.setBox(this.proxy, this.elBox)
    },
    _OnDragMove : function(e) {
        var b = this.owner;
        var d = e.now[0] - e.init[0];
        var f = e.now[1] - e.init[1];
        var a = this.elBox.width + d;
        var c = this.elBox.height + f;
        if (a < b.minWidth) {
            a = b.minWidth
        }
        if (c < b.minHeight) {
            c = b.minHeight
        }
        if (a > b.maxWidth) {
            a = b.maxWidth
        }
        if (c > b.maxHeight) {
            c = b.maxHeight
        }
        mini.setSize(this.proxy, a, c)
    },
    /**
     * 
     * @fires render
     * @param a
     * @param c
     */
    _OnDragStop : function(a, c) {
        if (!this.proxy) {
            return
        }
        var b = mini.getBox(this.proxy);
        jQuery(this.mask).remove();
        jQuery(this.proxy).remove();
        this.proxy = null;
        this.elBox = null;
        if (c) {
            this.owner.setWidth(b.width);
            this.owner.setHeight(b.height);
            this.owner.fire("resize")
        }
    }
};
mini._topWindow = null;
mini._getTopWindow = function(a) {
    if (mini._topWindow) {
        return mini._topWindow
    }
    var c = [];
    function b(e) {
        try {
            e.___try = 1;
            c.push(e)
        } catch (d) {
        }
        if (e.parent && e.parent != e) {
            b(e.parent)
        }
    }
    b(window);
    mini._topWindow = c[c.length - 1];
    return mini._topWindow
};
var __ps = mini.getParams();
if (__ps._winid) {
    try {
        window.Owner = mini._getTopWindow()[__ps._winid]
    } catch (ex) {
    }
}
mini._WindowID = "w" + Math.floor(Math.random() * 10000);
mini._getTopWindow()[mini._WindowID] = window;
mini.__IFrameCreateCount = 1;
mini.createIFrame = function(c, j) {
    var d = "__iframe_onload" + mini.__IFrameCreateCount++;
    window[d] = e;
    if (!c) {
        c = ""
    }
    var i = c.split("#");
    c = i[0];
    var l = "_t=" + Math.floor(Math.random() * 1000000);
    if (c.indexOf("?") == -1) {
        c += "?" + l
    } else {
        c += "&" + l
    }
    if (c && c.indexOf("_winid") == -1) {
        var l = "_winid=" + mini._WindowID;
        if (c.indexOf("?") == -1) {
            c += "?" + l
        } else {
            c += "&" + l
        }
    }
    if (i[1]) {
        c = c + "#" + i[1]
    }
    var k = c.indexOf(".mht") != -1;
    var a = k ? c : "";
    var m = '<iframe src="' + a + '" style="width:100%;height:100%;" onload="'
            + d + '()"  frameborder="0"></iframe>';
    var b = document.createElement("div");
    var g = mini.append(b, m);
    var f = false;
    if (k) {
        f = true
    } else {
        setTimeout(function() {
            if (g) {
                g.src = c;
                f = true
            }
        }, 5)
    }
    var h = true;
    function e() {
        if (f == false) {
            return
        }
        setTimeout(function() {
            if (j) {
                j(g, h)
            }
            h = false
        }, 1)
    }
    g._ondestroy = function() {
        window[d] = mini.emptyFn;
        g.src = "";
        try {
            g.contentWindow.document.write("");
            g.contentWindow.document.close()
        } catch (n) {
        }
        g._ondestroy = null;
        g = null
    };
    return g
};
mini._doOpen = function(c) {
    if (typeof c == "string") {
        c = {
            url : c
        }
    }
    c = mini.copyTo({
        width : 700,
        height : 400,
        allowResize : true,
        allowModal : true,
        closeAction : "destroy",
        title : "",
        titleIcon : "",
        iconCls : "",
        iconStyle : "",
        bodyStyle : "padding: 0",
        url : "",
        showCloseButton : true,
        showFooter : false
    }, c);
    c.closeAction = "destroy";
    var i = c.onload;
    delete c.onload;
    var g = c.ondestroy;
    delete c.ondestroy;
    var b = c.url;
    delete c.url;
    var e = mini.getViewportBox();
    if (c.width && String(c.width).indexOf("%") != -1) {
        var a = parseInt(c.width);
        c.width = parseInt(e.width * (a / 100))
    }
    if (c.height && String(c.height).indexOf("%") != -1) {
        var d = parseInt(c.height);
        c.height = parseInt(e.height * (d / 100))
    }
    var f = new mini.Window();
    f.set(c);
    f.load(b, i, g);
    f.show();
    return f
};
/**
 * 弹出子页面。别名为 {@link mini#openTop}
 * 
 *     @example
 *     mini.open({
 *         url: "http://www.hemw.cn",
 *         title: "标题",
 *         width: 800,
 *         height: 600,
 *         allowResize: true,
 *         allowDrag: true,
 *         showCloseButton: true,
 *         showMaxButton: true,
 *         showModal: true,
 *         onload: function () { //弹出页面加载完成
 *             var iframe = this.getIFrameEl();
 *             var data = {};
 *             // 调用弹出页面方法进行初始化
 *             iframe.contentWindow.SetData(data);
 *     
 *         },
 *         ondestroy: function (action) { // 弹出页面关闭前
 *             if (action == "ok") {
 *                 var iframe = this.getIFrameEl();
 *                 //获取选中、编辑的结果
 *                 var data = iframe.contentWindow.GetData();
 *                 data = mini.clone(data);
 *                 ......
 *             }
 *         }
 *     });
 * @param {Object} options 弹出窗口的设置选项
 * @param {Number/String} [options.width = 700] 宽度，单位为像素，也可以是一个百分比
 * @param {Number/String} [options.height = 400] 高度，单位为像素，也可以是一个百分比
 * @param {Boolean} [options.allowResize = true] 是否允许调整窗口尺寸
 * @param {Boolean} [options.allowModal = true] 是否显示为模态窗口
 * @param {String} [options.closeAction = "destroy"] 关闭时的操作： destroy &#45; 销毁；hide &#45; 隐藏。
 * @param {String} [options.title = ""] 标题
 * @param {String} [options.titleIcon = ""] 标题栏的图标
 * @param {String} [options.iconCls = ""] 图标样式类
 * @param {String} [options.iconStyle = ""] 图标样式
 * @param {String} [options.bodyStyle = "padding:0"] 窗口主内容区域的样式
 * @param {String} [options.url = ""] 子页面的 URL
 * @param {Boolean} [options.showCloseButton = true] 是否显示关闭按钮
 * @param {Boolean} [options.showFooter = false] 是否显示底部栏
 * @returns {String} 弹出窗口的唯一标识符
 * @member mini
 */
mini.open = function(options) {
    if (!options) {
        return
    }
    var a = options.url;
    if (!a) {
        a = ""
    }
    var f = a.split("#");
    var a = f[0];
    if (a && a.indexOf("_winid") == -1) {
        var c = "_winid=" + mini._WindowID;
        if (a.indexOf("?") == -1) {
            a += "?" + c
        } else {
            a += "&" + c
        }
        if (f[1]) {
            a = a + "#" + f[1]
        }
    }
    options.url = a;
    options.Owner = window;
    var g = [];
    function d(i) {
        try {
            if (i.mini) {
                g.push(i)
            }
            if (i.parent && i.parent != i) {
                d(i.parent)
            }
        } catch (h) {
        }
    }
    d(window);
    var e = g[g.length - 1];
    return e.mini._doOpen(options)
};
/**
 * @member mini
 * @method openTop
 * @alias mini#open
 */
mini.openTop = mini.open;

mini._getResult = function(a, b, g, f, e, k) {
    var i = null;
    var h = mini.getText(a, b, function(m, l) {
        i = l;
        if (g) {
            if (g) {
                g(m, l)
            }
        }
    }, f, e);
    var c = {
        text : h,
        result : null,
        sender : {
            type : ""
        },
        options : {
            url : a,
            data : b,
            type : e
        },
        xhr : i
    };
    var j = null;
    try {
        mini_doload(c);
        j = c.result;
        if (!j) {
            j = mini.decode(h)
        }
    } catch (d) {
        if (mini_debugger == true) {
            alert(a + "\njson is error")
        }
    }
    if (!mini.isArray(j) && k) {
        j = mini._getMap(k, j)
    }
    if (mini.isArray(j)) {
        j = {
            data : j
        }
    }
    return j ? j.data : null
};
mini.getData = function(b, g, f, a, c) {
    var e = mini.getText(b, g, f, a, c);
    var d = mini.decode(e);
    return d
};
mini.getText = function(b, f, e, a, c) {
    var d = null;
    mini.ajax({
        url : b,
        data : f,
        async : false,
        type : c ? c : "get",
        cache : false,
        dataType : "text",
        success : function(h, i, g) {
            d = h;
            if (e) {
                e(h, g)
            }
        },
        error : a
    });
    return d
};
if (!window.mini_RootPath) {
    mini_RootPath = "/"
}
mini_CreateJSPath = function(g) {
    var a = document.getElementsByTagName("script");
    var f = "";
    for (var e = 0, b = a.length; e < b; e++) {
        var h = a[e].src;
        if (h.indexOf(g) != -1) {
            var d = h.split(g);
            f = d[0];
            break
        }
    }
    var c = location.href;
    c = c.split("#")[0];
    c = c.split("?")[0];
    var d = c.split("/");
    d.length = d.length - 1;
    c = d.join("/");
    if (f.indexOf("http:") == -1 && f.indexOf("file:") == -1) {
        f = c + "/" + f
    }
    return f
};
if (!window.mini_JSPath) {
    mini_JSPath = mini_CreateJSPath("miniui.js")
}
mini.update = function(a, c) {
    if (typeof a == "string") {
        a = {
            url : a
        }
    }
    if (c) {
        a.el = c
    }
    var b = mini.loadText(a.url);
    mini.innerHTML(a.el, b);
    mini.parse(a.el)
};
mini.createSingle = function(a) {
    if (typeof a == "string") {
        a = mini.getClass(a)
    }
    if (typeof a != "function") {
        return
    }
    var b = a.single;
    if (!b) {
        b = a.single = new a()
    }
    return b
};
mini.createTopSingle = function(b) {
    if (typeof b != "function") {
        return
    }
    var a = b.prototype.type;
    if (top && top != window && top.mini && top.mini.getClass(a)) {
        return top.mini.createSingle(a)
    } else {
        return mini.createSingle(b)
    }
};
mini.sortTypes = {
    string : function(a) {
        return String(a).toUpperCase()
    },
    date : function(a) {
        if (!a) {
            return 0
        }
        if (mini.isDate(a)) {
            return a.getTime()
        }
        return mini.parseDate(String(a))
    },
    "float" : function(a) {
        var b = parseFloat(String(a).replace(/,/g, ""));
        return isNaN(b) ? 0 : b
    },
    "int" : function(a) {
        var b = parseInt(String(a).replace(/,/g, ""), 10);
        return isNaN(b) ? 0 : b
    },
    currency : function(a) {
        var b = parseFloat(String(a).replace(/,/g, ""));
        return isNaN(b) ? 0 : b
    }
};
mini._ValidateVType = function(b, k, d, p) {
    var j = b.split(";");
    for (var c = 0, a = j.length; c < a; c++) {
        var b = j[c].trim();
        var m = b.split(":");
        var n = m[0];
        var g = b.substr(n.length + 1, 1000);
        if (g) {
            g = g.split(",")
        } else {
            g = []
        }
        var h = mini.VTypes[n];
        if (h) {
            var o = h(k, g);
            if (o !== true) {
                d.isValid = false;
                var f = m[0] + "ErrorText";
                d.errorText = p[f] || mini.VTypes[f] || "";
                d.errorText = String.format(d.errorText, g[0], g[1], g[2],
                        g[3], g[4]);
                break
            }
        }
    }
};
mini._getErrorText = function(b, a) {
    if (b && b[a]) {
        return b[a]
    } else {
        return mini.VTypes[a]
    }
};
mini.VTypes = {
    minDateErrorText : "Date can not be less than {0}",
    maxDateErrorText : "Date can not be greater than {0}",
    uniqueErrorText : "This field is unique.",
    requiredErrorText : "This field is required.",
    emailErrorText : "Please enter a valid email address.",
    urlErrorText : "Please enter a valid URL.",
    floatErrorText : "Please enter a valid number.",
    intErrorText : "Please enter only digits",
    dateErrorText : "Please enter a valid date. Date format is {0}",
    maxLengthErrorText : "Please enter no more than {0} characters.",
    minLengthErrorText : "Please enter at least {0} characters.",
    maxErrorText : "Please enter a value less than or equal to {0}.",
    minErrorText : "Please enter a value greater than or equal to {0}.",
    rangeLengthErrorText : "Please enter a value between {0} and {1} characters long.",
    rangeCharErrorText : "Please enter a value between {0} and {1} characters long.",
    rangeErrorText : "Please enter a value between {0} and {1}.",
    required : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return false
        }
        return true
    },
    email : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        if (a
                .search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
            return true
        } else {
            return false
        }
    },
    url : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        function c(f) {
            f = f.toLowerCase().split("?")[0];
            var e = "^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,5})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var d = new RegExp(e);
            if (d.test(f)) {
                return (true)
            } else {
                return (false)
            }
        }
        return c(a)
    },
    "int" : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        function c(d) {
            if (d < 0) {
                d = -d
            }
            var e = String(d);
            return e.length > 0 && !(/[^0-9]/).test(e)
        }
        return c(a)
    },
    "float" : function(b, c) {
        if (mini.isNull(b) || b === "") {
            return true
        }
        function a(d) {
            if (d < 0) {
                d = -d
            }
            var e = String(d);
            if (e.split(".").length > 2) {
                return false
            }
            return e.length > 0 && !(/[^0-9.]/).test(e)
        }
        return a(b)
    },
    date : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        if (!a) {
            return false
        }
        var e = null;
        var c = b[0];
        if (c) {
            e = mini.parseDate(a, c);
            if (e && e.getFullYear) {
                if (mini.formatDate(e, c) == a) {
                    return true
                }
            }
        } else {
            e = mini.parseDate(a, "yyyy-MM-dd");
            if (!e) {
                e = mini.parseDate(a, "yyyy/MM/dd")
            }
            if (!e) {
                e = mini.parseDate(a, "MM/dd/yyyy")
            }
            if (e && e.getFullYear) {
                return true
            }
        }
        return false
    },
    maxLength : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        var c = parseInt(b);
        if (!a || isNaN(c)) {
            return true
        }
        if (a.length <= c) {
            return true
        } else {
            return false
        }
    },
    minLength : function(a, b) {
        if (mini.isNull(a) || a === "") {
            return true
        }
        var c = parseInt(b);
        if (isNaN(c)) {
            return true
        }
        if (a.length >= c) {
            return true
        } else {
            return false
        }
    },
    rangeLength : function(b, c) {
        if (mini.isNull(b) || b === "") {
            return true
        }
        if (!b) {
            return false
        }
        var d = parseFloat(c[0]), a = parseFloat(c[1]);
        if (isNaN(d) || isNaN(a)) {
            return true
        }
        if (d <= b.length && b.length <= a) {
            return true
        }
        return false
    },
    rangeChar : function(h, e) {
        if (mini.isNull(h) || h === "") {
            return true
        }
        var b = parseFloat(e[0]), f = parseFloat(e[1]);
        if (isNaN(b) || isNaN(f)) {
            return true
        }
        function g(i) {
            var k = new RegExp("^[\u4e00-\u9fa5]+$");
            if (k.test(i)) {
                return true
            }
            return false
        }
        var d = 0;
        var j = String(h).split("");
        for (var c = 0, a = j.length; c < a; c++) {
            if (g(j[c])) {
                d += 2
            } else {
                d += 1
            }
        }
        if (b <= d && d <= f) {
            return true
        }
        return false
    },
    range : function(b, c) {
        if (mini.VTypes["float"](b, c) == false) {
            return false
        }
        if (mini.isNull(b) || b === "") {
            return true
        }
        b = parseFloat(b);
        if (isNaN(b)) {
            return false
        }
        var d = parseFloat(c[0]), a = parseFloat(c[1]);
        if (isNaN(d) || isNaN(a)) {
            return true
        }
        if (d <= b && b <= a) {
            return true
        }
        return false
    },
    min : function(a, b) {
        if (mini.VTypes["float"](a, b) == false) {
            return false
        }
        if (mini.isNull(a) || a === "") {
            return true
        }
        a = parseFloat(a);
        if (isNaN(a)) {
            return false
        }
        var c = parseFloat(b[0]);
        if (isNaN(c)) {
            return true
        }
        if (c <= a) {
            return true
        }
        return false
    },
    max : function(b, c) {
        if (mini.VTypes["float"](b, c) == false) {
            return false
        }
        if (mini.isNull(b) || b === "") {
            return true
        }
        b = parseFloat(b);
        if (isNaN(b)) {
            return false
        }
        var a = parseFloat(c[0]);
        if (isNaN(a)) {
            return true
        }
        if (b <= a) {
            return true
        }
        return false
    }
};
mini.summaryTypes = {
    count : function(a) {
        if (!a) {
            a = []
        }
        return a.length
    },
    max : function(e, f) {
        if (!e) {
            e = []
        }
        var a = null;
        for (var c = 0, b = e.length; c < b; c++) {
            var g = e[c];
            var d = parseFloat(g[f]);
            if (d === null || d === undefined || isNaN(d)) {
                continue
            }
            if (a == null || a < d) {
                a = d
            }
        }
        return a
    },
    min : function(e, f) {
        if (!e) {
            e = []
        }
        var c = null;
        for (var b = 0, a = e.length; b < a; b++) {
            var g = e[b];
            var d = parseFloat(g[f]);
            if (d === null || d === undefined || isNaN(d)) {
                continue
            }
            if (c == null || c > d) {
                c = d
            }
        }
        return c
    },
    avg : function(f, g) {
        if (!f) {
            f = []
        }
        if (f.length == 0) {
            return 0
        }
        var d = 0;
        for (var c = 0, a = f.length; c < a; c++) {
            var h = f[c];
            var e = parseFloat(h[g]);
            if (e === null || e === undefined || isNaN(e)) {
                continue
            }
            d += e
        }
        var b = d / f.length;
        return b
    },
    sum : function(e, f) {
        if (!e) {
            e = []
        }
        var c = 0;
        for (var b = 0, a = e.length; b < a; b++) {
            var g = e[b];
            var d = parseFloat(g[f]);
            if (d === null || d === undefined || isNaN(d)) {
                continue
            }
            c += d
        }
        return c
    }
};
mini.formatCurrency = function(a, c) {
    if (a === null || a === undefined) {
        null == ""
    }
    a = String(a).replace(/\$|\,/g, "");
    if (isNaN(a)) {
        a = "0"
    }
    sign = (a == (a = Math.abs(a)));
    a = Math.floor(a * 100 + 0.50000000001);
    cents = a % 100;
    a = Math.floor(a / 100).toString();
    if (cents < 10) {
        cents = "0" + cents
    }
    for (var b = 0; b < Math.floor((a.length - (1 + b)) / 3); b++) {
        a = a.substring(0, a.length - (4 * b + 3)) + ","
                + a.substring(a.length - (4 * b + 3))
    }
    c = c || "";
    return c + (((sign) ? "" : "-") + a + "." + cents)
};

mini.emptyFn = function() {
};
