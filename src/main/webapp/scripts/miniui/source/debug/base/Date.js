/**
 * @property {Number} [DAY_MS=86400000] 1天的毫秒数
 * @member Window
 */
var DAY_MS = 86400000,
    /**
     * @property {Number} [HOUR_MS=3600000] 1小时的毫秒数
     * @member Window
     */
    HOUR_MS = 3600000,
    /**
     * @property {Number} [MINUTE_MS=60000] 1分钟的毫秒数
     * @member Window
     */
    MINUTE_MS = 60000;

mini.copyTo(mini, {
    /**
     * 获取指定日期的 0时0分0秒 对应的日期对象
     * @param {Date} date 日期对象
     * @return {Date} 一个新的日期对象，年、月、日和 `date` 一样，时、分、秒 为零
     * @member mini
     */
    clearTime : function(date) {
        if (!date) {
            return null
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    },
    /**
     * 获取指定日期的 23时59分59秒 对应的日期对象
     * @param {Date} date 日期对象
     * @return {Date} 一个新的日期对象，年、月、日和 `date` 一样，时、分、秒分别为23、59、59
     * @member mini
     */
    maxTime : function(date) {
        if (!date) {
            return null
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
    },
    /**
     * 克隆日期对象
     * @param {Date} date 原日期对象 
     * @return {Date} 克隆出来的新日期对象
     * @member mini
     */
    cloneDate : function(date) {
        if (!date) {
            return null
        }
        return new Date(date.getTime())
    },
    /**
     * 根据规则为给定的日期字段添加或减去指定的时间量。如：<br>
     * 要从当前时间减去 5 天，可以通过调用以下方法做到这一点 `mini.addDate(date, 5, "D")` 
     * @param {Date} date 日期对象
     * @param {Date} amount 为字段添加的日期或时间量
     * @param {Date} [field="D"] 日期字段：<ul>
     *  <li>Y &#45; 年</li>
     *  <li>MO &#45; 月</li>
     *  <li>D &#45; 日</li>
     *  <li>H &#45; 时</li>
     *  <li>M &#45; 分</li>
     *  <li>S &#45; 秒</li>
     *  <li>MS &#45; 毫秒</li>
     * </ul>
     * @return {Date} 增加或送去了指定时间量后的日期（传入的 `date` 对象）
     * @member mini
     */
    addDate : function(date, amount, field) {
        if (!field) {
            field = "D"
        }
        date = new Date(date.getTime());
        switch (field.toUpperCase()) {
        case "Y":
            date.setFullYear(date.getFullYear() + amount);
            break;
        case "MO":
            date.setMonth(date.getMonth() + amount);
            break;
        case "D":
            date.setDate(date.getDate() + amount);
            break;
        case "H":
            date.setHours(date.getHours() + amount);
            break;
        case "M":
            date.setMinutes(date.getMinutes() + amount);
            break;
        case "S":
            date.setSeconds(date.getSeconds() + amount);
            break;
        case "MS":
            date.setMilliseconds(date.getMilliseconds() + amount);
            break
        }
        return date
    },
    /**
     * 获取指定日期在当前年的周数（Week Of Year）
     * @param {Number} year 
     * @param {Number} month 
     * @param {Number} day
     * @return {Number} 指定日期在当前年的周数（Week Of Year），是一个 1 到 54 之间的整数
     * @member mini
     * @experimental 这是一项实验室功能，在某些特殊情况下返回值可能不准确，请谨慎使用！<br>
     *      如：mini.getWeek(2016,1,3) 的返回值是 53，而不是预期中的 1。
     */
    getWeek : function(year, month, day) {
        var i = Math.floor((14 - (month)) / 12);
        var g = year + 4800 - i;
        var c = (month) + (12 * i) - 3;
        var j = day + Math.floor(((153 * c) + 2) / 5) + (365 * g)
                + Math.floor(g / 4) - Math.floor(g / 100) + Math.floor(g / 400)
                - 32045;
        var k = (j + 31741 - (j % 7)) % 146097 % 36524 % 1461;
        var e = Math.floor(k / 1460);
        var b = ((k - e) % 365) + e;
        NumberOfWeek = Math.floor(b / 7) + 1;
        return NumberOfWeek
    },
    /**
     * 获取指定日期那一周中星期几（`weekDay` 为 0 表示星期日）对应的日期
     * @param {Date} date 指定日期
     * @param {Number} [weekDay=0] 星期几，是一个 0 到 6 之间的整数 
     * @return {Date} 对应的日期
     * @member mini
     */
    getWeekStartDate : function(date, weekDay) {
        if (!weekDay) {
            weekDay = 0
        }
        if (weekDay > 6 || weekDay < 0) {
            throw new Error("out of weekday")
        }
        var a = date.getDay();
        var b = weekDay - a;
        if (a < weekDay) {
            b -= 7
        }
        var f = new Date(date.getFullYear(), date.getMonth(), date.getDate() + b);
        return f
    },
    /**
     * 获取指定日期是星期几的简写形式
     * @param {Date} date 日期
     * @return {String} 星期几的简写形式：<ul>
     *   <li>中文环境 &#45; "日", "一", "二", "三", "四", "五", "六"</li>
     *   <li>英文环境 &#45; "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"</li>
     * </ul>
     * @member mini
     */
    getShortWeek : function(date) {
        var b = this.dateInfo.daysShort;
        return b[date]
    },

    /**
     * 获取指定日期是星期几的全名形式
     * @param {Date} date 日期
     * @return {String} 星期几的全名形式：<ul>
     *   <li>中文环境 &#45; "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"</li>
     *   <li>英文环境 &#45; "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"</li>
     * </ul>
     * @member mini
     */
    getLongWeek : function(date) {
        var b = this.dateInfo.daysLong;
        return b[date]
    },

    /**
     * 获取指定日期所在月份的简写形式
     * @param {Date} date 日期
     * @return {String} 所在月份简写形式：<ul>
     *   <li>中文环境 &#45; "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"</li>
     *   <li>英文环境 &#45; "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"</li>
     * </ul>
     * @member mini
     */
    getShortMonth : function(date) {
        var a = this.dateInfo.monthsShort;
        return a[date]
    },

    /**
     * 获取指定日期所在月份的全名形式
     * @param {Date} date 日期
     * @return {String} 所在月份的全名形式：<ul>
     *   <li>中文环境 &#45; "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"</li>
     *   <li>英文环境 &#45; "January", "Febraury", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"</li>
     * </ul>
     * @member mini
     */
    getLongMonth : function(date) {
        var a = this.dateInfo.monthsLong;
        return a[date]
    },
    /**
     * 日期信息
     * @property {Object} dateInfo
     * @member mini
     */
    dateInfo : {
        /** @enum {String} mini.dateInfo.monthsLong */
        monthsLong : [
          /** 一月 */
          "January", 
          /** 二月 */
          "Febraury", 
          /** 三月 */
          "March", 
          /** 四月 */
          "April", 
          /** 五月 */
          "May", 
          /** 六月 */
          "June",
          /** 七月 */
          "July", 
          /** 八月 */
          "August", 
          /** 九月 */
          "September", 
          /** 十月 */
          "October", 
          /** 十一月 */
          "November",
          /** 十二月 */
          "December" ],
        /** @enum {String} mini.dateInfo.monthsShort */
        monthsShort : [ 
           /** 1月 */
           "Jan", 
           /** 2月 */
           "Feb", 
           /** 3月 */
           "Mar", 
           /** 4月 */
           "Apr", 
           /** 5月 */
           "May", 
           /** 6月 */
           "Jun", 
           /** 7月 */
           "Jul", 
           /** 8月 */
           "Aug",
           /** 9月 */
           "Sep",
           /** 10月 */
           "Oct", 
           /** 11月 */
           "Nov", 
           /** 12月 */
           "Dec" ],
        /** @enum {String} mini.dateInfo.daysLong */
        daysLong : [ 
            /** 星期日 */
            "Sunday", 
            /** 星期一 */
            "Monday", 
            /** 星期二 */
            "Tuesday", 
            /** 星期三 */
            "Wednesday", 
            /** 星期四 */
            "Thursday",
            /** 星期五 */
            "Friday", 
            /** 星期六 */
            "Saturday" ],
        /** @enum {String} mini.dateInfo.daysShort */
        daysShort : [ 
             /** 日 */
             "Su", 
             /** 一 */
             "Mo", 
             /** 二 */
             "Tu", 
             /** 三 */
             "We", 
             /** 四 */
             "Th", 
             /** 五 */
             "Fr", 
             /** 六 */
             "Sa" ],
        /** @enum {String} mini.dateInfo.quarterLong */
        quarterLong : [ 
           /** 一季度 */
           "Q1", 
           /** 二季度 */
           "Q2", 
           /** 三季度 */
           "Q3", 
           /** 四季度 */
           "Q4" ],
        /** @enum {String} mini.dateInfo.quarterShort */
        quarterShort : [ 
            /** Q1 */
            "Q1", 
            /** Q2 */
            "Q2", 
            /** Q3 */
            "Q3", 
            /** Q4 */
            "Q4" ],
        /** @enum {String} mini.dateInfo.halfYearLong */
        halfYearLong : [ 
            /** 上半年 */
            "first half", 
            /** 下半年 */
            "second half" ],
        /** @enum {String} mini.dateInfo.patterns */
        patterns : {
            /** @property {String} [d = "M/d/yyyy"]  */
            d : "M/d/yyyy",
            /** @property {String} [D = "dddd, MMMM dd, yyyy"] */
            D : "dddd, MMMM dd, yyyy",
            /** @property {String} [f = "dddd, MMMM dd, yyyy H:mm tt"] */
            f : "dddd, MMMM dd, yyyy H:mm tt",
            /** @property {String} [F = "dddd, MMMM dd, yyyy H:mm:ss tt"] */
            F : "dddd, MMMM dd, yyyy H:mm:ss tt",
            /** @property {String} [g = "M/d/yyyy H:mm tt"] */
            g : "M/d/yyyy H:mm tt",
            /** @property {String} [G = "M/d/yyyy H:mm:ss tt"] */
            G : "M/d/yyyy H:mm:ss tt",
            /** @property {String} [m = "MMMM dd"] */
            m : "MMMM dd",
            /** @property {String} [o = "yyyy-MM-ddTHH:mm:ss.fff"] */
            o : "yyyy-MM-ddTHH:mm:ss.fff",
            /** @property {String} [s = "yyyy-MM-ddTHH:mm:ss"] */
            s : "yyyy-MM-ddTHH:mm:ss",
            /** @property {String} [t = "H:mm tt"] */
            t : "H:mm tt",
            /** @property {String} [T = "H:mm:ss tt"] */
            T : "H:mm:ss tt",
            /** @property {String} [U = "dddd, MMMM dd, yyyy HH:mm:ss tt"] */
            U : "dddd, MMMM dd, yyyy HH:mm:ss tt",
            /** @property {String} [y = "MMM, yyyy"] */
            y : "MMM, yyyy"
        },
        /** @enum {String} mini.dateInfo.tt */
        tt : {
            /** @property {String} [AM = "AM"] */
            AM : "AM",
            /** @property {String} [PM = "PM"] */
            PM : "PM"
        },
        /** @enum {String} mini.dateInfo.ten */
        ten : {
            /** @property {String} [Early = "Early"] */
            Early : "Early",
            /** @property {String} [Mid = "Mid"] */
            Mid : "Mid",
            /** @property {String} [Late = "Late"] */
            Late : "Late"
        },
        today : "Today",
        clockType : 24
    }
});

/**
 * 获取此日期是在上半年还是在下半年
 * @return {Number} 如果是在上半年则返回 `0`，否则返回 `1`
 * @member Date
 */
Date.prototype.getHalfYear = function() {
    if (!this.getMonth) {
        return null
    }
    var a = this.getMonth();
    if (a < 6) {
        return 0
    }
    return 1
};
/**
 * 获取此日期所在季度
 * @return {Number} 返回一个 0 到 3 之间的整数
 * @member Date
 */
Date.prototype.getQuarter = function() {
    if (!this.getMonth) {
        return null
    }
    var a = this.getMonth();
    if (a < 3) {
        return 0
    }
    if (a < 6) {
        return 1
    }
    if (a < 9) {
        return 2
    }
    return 3
};

/**
 * 把 `Date` 类型转换为字符串
 * @param {Date} date 日期类型对象。
 * @param {String} pattern 日期格式。例如：”yyyy-MM-dd HH:mm:ss”。 具体格式说明：
 * <table border="1px" bordercolor="#cccccc" cellspacing="0">
 *     <tr>
 *         <th>Name</th>
 *         <th>Description</th>
 *     </tr>
 *     <tr>
 *         <td>d</td>
 *         <td>月中的某一天。一位数的日期没有前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>dd</td>
 *         <td>月中的某一天。一位数的日期有一个前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>ddd</td>
 *         <td>周中某天的缩写名称</td>
 *     </tr>
 *     <tr>
 *         <td>dddd</td>
 *         <td>周中某天的完整名称</td>
 *     </tr>
 *     <tr>
 *         <td>M</td>
 *         <td>月份数字。一位数的月份没有前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>MM</td>
 *         <td>月份数字。一位数的月份有一个前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>MMM</td>
 *         <td>月份的缩写名称。</td>
 *     </tr>
 *     <tr>
 *         <td>MMMM</td>
 *         <td>月份的完整名称。</td>
 *     </tr>
 *     <tr>
 *         <td>y</td>
 *         <td>不包含纪元的年份。如果不包含纪元的年份小于 10，则显示不具有前导零的年份。</td>
 *     </tr>
 *     <tr>
 *         <td>yy</td>
 *         <td>不包含纪元的年份。如果不包含纪元的年份小于 10，则显示具有前导零的年份。</td>
 *     </tr>
 *     <tr>
 *         <td>yyyy</td>
 *         <td>包括纪元的四位数的年份。</td>
 *     </tr>
 *     <tr>
 *         <td>h</td>
 *         <td>12 小时制的小时。一位数的小时数没有前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>hh</td>
 *         <td>12 小时制的小时。一位数的小时数有前导零。</td>
 *     </tr>
 * 
 *     <tr>
 *         <td>H</td>
 *         <td>24 小时制的小时。一位数的小时数没有前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>HH</td>
 *         <td>24 小时制的小时。一位数的小时数有前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>m</td>
 *         <td>分钟。一位数的分钟数没有前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>mm</td>
 *         <td>分钟。一位数的分钟数有一个前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>s</td>
 *         <td>秒。一位数的秒数没有前导零。</td>
 *     </tr>
 *     <tr>
 *         <td>ss</td>
 *         <td>秒。一位数的秒数有一个前导零。</td>
 *     </tr>
 * </table>
 * @returns {String} 格式化后的日期字符串
 * @member mini
 */
mini.formatDate = function(date, pattern, p) {
    if (!date || !date.getFullYear || isNaN(date)) {
        return ""
    }
    var b = date.toString();
    var a = mini.dateInfo;
    if (!a) {
        a = mini.dateInfo
    }
    if (typeof (a) !== "undefined") {
        var j = typeof (a.patterns[pattern]) !== "undefined" ? a.patterns[pattern] : pattern;
        var k = date.getFullYear();
        var i = date.getMonth();
        var l = date.getDate();
        if (pattern == "yyyy-MM-dd") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return k + "-" + i + "-" + l
        }
        if (pattern == "MM/dd/yyyy") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return i + "/" + l + "/" + k
        }
        b = j.replace(/yyyy/g, k);
        b = b.replace(/yy/g, (k + "").substring(2));
        var o = date.getHalfYear();
        b = b.replace(/hy/g, a.halfYearLong[o]);
        var c = date.getQuarter();
        b = b.replace(/Q/g, a.quarterLong[c]);
        b = b.replace(/q/g, a.quarterShort[c]);
        b = b.replace(/MMMM/g, a.monthsLong[i].escapeDateTimeTokens());
        b = b.replace(/MMM/g, a.monthsShort[i].escapeDateTimeTokens());
        b = b.replace(/MM/g, i + 1 < 10 ? "0" + (i + 1) : i + 1);
        b = b.replace(/(\\)?M/g, function(t, s) {
            return s ? t : i + 1
        });
        var d = date.getDay();
        b = b.replace(/dddd/g, a.daysLong[d].escapeDateTimeTokens());
        b = b.replace(/ddd/g, a.daysShort[d].escapeDateTimeTokens());
        b = b.replace(/dd/g, l < 10 ? "0" + l : l);
        b = b.replace(/(\\)?d/g, function(t, s) {
            return s ? t : l
        });
        var g = date.getHours();
        var n = g > 12 ? g - 12 : g;
        if (a.clockType == 12) {
            if (g > 12) {
                g -= 12
            }
        }
        b = b.replace(/HH/g, g < 10 ? "0" + g : g);
        b = b.replace(/(\\)?H/g, function(t, s) {
            return s ? t : g
        });
        b = b.replace(/hh/g, n < 10 ? "0" + n : n);
        b = b.replace(/(\\)?h/g, function(t, s) {
            return s ? t : n
        });
        var f = date.getMinutes();
        b = b.replace(/mm/g, f < 10 ? "0" + f : f);
        b = b.replace(/(\\)?m/g, function(t, s) {
            return s ? t : f
        });
        var q = date.getSeconds();
        b = b.replace(/ss/g, q < 10 ? "0" + q : q);
        b = b.replace(/(\\)?s/g, function(t, s) {
            return s ? t : q
        });
        b = b.replace(/fff/g, date.getMilliseconds());
        b = b.replace(/tt/g, date.getHours() > 12 || date.getHours() == 0 ? a.tt.PM
                : a.tt.AM);
        var date = date.getDate();
        var h = "";
        if (date <= 10) {
            h = a.ten.Early
        } else {
            if (date <= 20) {
                h = a.ten.Mid
            } else {
                h = a.ten.Late
            }
        }
        b = b.replace(/ten/g, h)
    }
    return b.replace(/\\/g, "")
};

/**
 * 将字符串中表示日期格式的字符进行转义处理
 * @member String
 */
String.prototype.escapeDateTimeTokens = function() {
    return this.replace(/([dMyHmsft])/g, "\\$1")
};

/**
 * 将 `date1` 的日加到与 `date2` 的日相同，如：假设 date2 为 2015-05-15，<ul>
 *      <li>如果 `date1` 为 <i>2015-05-10</i>，则调用完 `mini.fixDate(date1, date2)` 后， `date1` 的值将变为 <i>2015-05-15</i></li>
 *      <li>如果 `date1` 为 <i>2015-05-15</i>，则调用完 `mini.fixDate(date1, date2)` 后， `date1` 的值将变为 <i>2015-05-15</i></li>
 *      <li>如果 `date1` 为 <i>2015-05-20</i>，则调用完 `mini.fixDate(date1, date2)` 后， `date1` 的值将变为 <i>2015-06-15</i></li>
 * </ul>
 * @param date1 要进行处理的日期
 * @param date2 参考日期
 * @member mini
 */
mini.fixDate = function(date1, date2) {
    if (+date1) {
        while (date1.getDate() != date2.getDate()) {
            date1.setTime(+date1 + (date1 < date2 ? 1 : -1) * HOUR_MS)
        }
    }
};

/**
 * 把字符串转换成 `Date` 类型对象。
 * @param  {String} str 特定格式字符串。 如：<ul>
 *     <li>2010-11-22</li>
 *     <li>2010/11/22</li>
 *     <li>11-22-201</li>
 *     <li>11/22/2010</li>
 *     <li>2010-11-22T23:23:59</li>
 *     <li>2010/11/22T23:23:59</li>
 *     <li>2010-11-22 23:23:59</li>
 *     <li>2010/11/22 23:23:59</li>
 * </ul>
 * @param  {Boolean} [ignoreTimezone=true] 是否忽略时区
 * @returns {Date} 转换后的日期对象
 * @member mini
 */
mini.parseDate = function(str, ignoreTimezone) {
    try {
        var d = eval(str);
        if (d && d.getFullYear) {
            return d
        }
    } catch (ex) {
    }
    if (typeof str == "object") {
        return isNaN(str) ? null : str
    }
    if (typeof str == "number") {
        var d = new Date(str * 1000);
        if (d.getTime() != str) {
            return null
        }
        return isNaN(d) ? null : d
    }
    if (typeof str == "string") {
        m = str.match(/^([0-9]{4})([0-9]{2})([0-9]{2})$/);
        if (m) {
            var date = new Date(m[1], m[2] - 1, m[3]);
            return date
        }
        m = str.match(/^([0-9]{4}).([0-9]*)$/);
        if (m) {
            var date = new Date(m[1], m[2] - 1);
            return date
        }
        if (str.match(/^\d+(\.\d+)?$/)) {
            var d = new Date(parseFloat(str) * 1000);
            if (d.getTime() != str) {
                return null
            } else {
                return d
            }
        }
        if (ignoreTimezone === undefined) {
            ignoreTimezone = true
        }
        var d = mini.parseISO8601(str, ignoreTimezone)
                || (str ? new Date(str) : null);
        return isNaN(d) ? null : d
    }
    return null
};

/**
 * 把字符串按照 ISO-8601 标准转换成 `Date` 类型对象
 * @param  {String} dateStr 日期字符串
 * @param  {Boolean} [includeTime=false] 是否包含时间
 * @returns {Date} 转换后的日期对象
 * @member mini
 */
mini.parseISO8601 = function(dateStr, includeTime) {
    var a = dateStr.match(/^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
    if (!a) {
        a = dateStr
                .match(/^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/);
        if (a) {
            var d = new Date(a[1], a[2] - 1, a[3], a[4]);
            return d
        }
        a = dateStr.match(/^([0-9]{4}).([0-9]*)/);
        if (a) {
            var d = new Date(a[1], a[2] - 1);
            return d
        }
        a = dateStr.match(/^([0-9]{4}).([0-9]*).([0-9]*)/);
        if (a) {
            var d = new Date(a[1], a[2] - 1, a[3]);
            return d
        }
        a = dateStr.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
        if (!a) {
            return null
        } else {
            var d = new Date(a[3], a[1] - 1, a[2]);
            return d
        }
    }
    var d = new Date(a[1], 0, 1);
    if (includeTime || !a[14]) {
        var c = new Date(a[1], 0, 1, 9, 0);
        if (a[3]) {
            d.setMonth(a[3] - 1);
            c.setMonth(a[3] - 1)
        }
        if (a[5]) {
            d.setDate(a[5]);
            c.setDate(a[5])
        }
        mini.fixDate(d, c);
        if (a[7]) {
            d.setHours(a[7])
        }
        if (a[8]) {
            d.setMinutes(a[8])
        }
        if (a[10]) {
            d.setSeconds(a[10])
        }
        if (a[12]) {
            d.setMilliseconds(Number("0." + a[12]) * 1000)
        }
        mini.fixDate(d, c)
    } else {
        d.setUTCFullYear(a[1], a[3] ? a[3] - 1 : 0, a[5] || 1);
        d.setUTCHours(a[7] || 0, a[8] || 0, a[10] || 0, a[12] ? Number("0."
                + a[12]) * 1000 : 0);
        var f = Number(a[16]) * 60 + (a[18] ? Number(a[18]) : 0);
        f *= a[15] == "-" ? 1 : -1;
        d = new Date(+d + (f * 60 * 1000))
    }
    return d
};

/**
 * 把时间字符串转换成 `Date` 类型对象。
 * @param  {String} timeStr 时间字符串。 如：23:23:59
 * @param  {String} [pattern] 时间格式，如 HH:mm:ss
 * @returns {Date} 转换后的日期对象，日期部分是 1970-01-01
 * @member mini
 */
mini.parseTime = function(timeStr, pattern) {
    if (!timeStr) {
        return null
    }
    var i = parseInt(timeStr);
    if (i == timeStr && pattern) {
        h = new Date(0);
        if (pattern[0] == "H") {
            h.setHours(i)
        } else {
            if (pattern[0] == "m") {
                h.setMinutes(i)
            } else {
                if (pattern[0] == "s") {
                    h.setSeconds(i)
                }
            }
        }
        return h
    }
    var h = mini.parseDate(timeStr);
    if (!h) {
        var b = timeStr.split(":");
        var f = parseInt(parseFloat(b[0]));
        var c = parseInt(parseFloat(b[1]));
        var a = parseInt(parseFloat(b[2]));
        if (!isNaN(f) && !isNaN(c) && !isNaN(a)) {
            h = new Date(0);
            h.setHours(f);
            h.setMinutes(c);
            h.setSeconds(a)
        }
        if (!isNaN(f) && (pattern == "H" || pattern == "HH")) {
            h = new Date(0);
            h.setHours(f)
        } else {
            if (!isNaN(f) && !isNaN(c) && (pattern == "H:mm" || pattern == "HH:mm")) {
                h = new Date(0);
                h.setHours(f);
                h.setMinutes(c)
            } else {
                if (!isNaN(f) && !isNaN(c) && pattern == "mm:ss") {
                    h = new Date(0);
                    h.setMinutes(f);
                    h.setSeconds(c)
                }
            }
        }
    }
    return h
};

// mini.dateInfo 的中文形式
mini.dateInfo = {
    monthsLong : [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月",
            "十一月", "十二月" ],
    monthsShort : [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月",
            "10月", "11月", "12月" ],
    daysLong : [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ],
    daysShort : [ "日", "一", "二", "三", "四", "五", "六" ],
    quarterLong : [ "一季度", "二季度", "三季度", "四季度" ],
    quarterShort : [ "Q1", "Q2", "Q2", "Q4" ],
    halfYearLong : [ "上半年", "下半年" ],
    patterns : {
        d : "yyyy-M-d",
        D : "yyyy年M月d日",
        f : "yyyy年M月d日 H:mm",
        F : "yyyy年M月d日 H:mm:ss",
        g : "yyyy-M-d H:mm",
        G : "yyyy-M-d H:mm:ss",
        m : "MMMd日",
        o : "yyyy-MM-ddTHH:mm:ss.fff",
        s : "yyyy-MM-ddTHH:mm:ss",
        t : "H:mm",
        T : "H:mm:ss",
        U : "yyyy年M月d日 HH:mm:ss",
        y : "yyyy年MM月"
    },
    tt : {
        AM : "上午",
        PM : "下午"
    },
    ten : {
        Early : "上旬",
        Mid : "中旬",
        Late : "下旬"
    },
    today : "今天",
    clockType : 24
};
