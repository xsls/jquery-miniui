var DAY_MS = 86400000, HOUR_MS = 3600000, MINUTE_MS = 60000;
mini.copyTo(mini, {
    clearTime : function(a) {
        if (!a) {
            return null
        }
        return new Date(a.getFullYear(), a.getMonth(), a.getDate())
    },
    maxTime : function(a) {
        if (!a) {
            return null
        }
        return new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59, 59)
    },
    cloneDate : function(a) {
        if (!a) {
            return null
        }
        return new Date(a.getTime())
    },
    addDate : function(b, a, c) {
        if (!c) {
            c = "D"
        }
        b = new Date(b.getTime());
        switch (c.toUpperCase()) {
        case "Y":
            b.setFullYear(b.getFullYear() + a);
            break;
        case "MO":
            b.setMonth(b.getMonth() + a);
            break;
        case "D":
            b.setDate(b.getDate() + a);
            break;
        case "H":
            b.setHours(b.getHours() + a);
            break;
        case "M":
            b.setMinutes(b.getMinutes() + a);
            break;
        case "S":
            b.setSeconds(b.getSeconds() + a);
            break;
        case "MS":
            b.setMilliseconds(b.getMilliseconds() + a);
            break
        }
        return b
    },
    getWeek : function(f, d, h) {
        var i = Math.floor((14 - (d)) / 12);
        var g = f + 4800 - i;
        var c = (d) + (12 * i) - 3;
        var j = h + Math.floor(((153 * c) + 2) / 5) + (365 * g)
                + Math.floor(g / 4) - Math.floor(g / 100) + Math.floor(g / 400)
                - 32045;
        var k = (j + 31741 - (j % 7)) % 146097 % 36524 % 1461;
        var e = Math.floor(k / 1460);
        var b = ((k - e) % 365) + e;
        NumberOfWeek = Math.floor(b / 7) + 1;
        return NumberOfWeek
    },
    getWeekStartDate : function(c, e) {
        if (!e) {
            e = 0
        }
        if (e > 6 || e < 0) {
            throw new Error("out of weekday")
        }
        var a = c.getDay();
        var b = e - a;
        if (a < e) {
            b -= 7
        }
        var f = new Date(c.getFullYear(), c.getMonth(), c.getDate() + b);
        return f
    },
    getShortWeek : function(a) {
        var b = this.dateInfo.daysShort;
        return b[a]
    },
    getLongWeek : function(a) {
        var b = this.dateInfo.daysLong;
        return b[a]
    },
    getShortMonth : function(b) {
        var a = this.dateInfo.monthsShort;
        return a[b]
    },
    getLongMonth : function(b) {
        var a = this.dateInfo.monthsLong;
        return a[b]
    },
    dateInfo : {
        monthsLong : [ "January", "Febraury", "March", "April", "May", "June",
                "July", "August", "September", "October", "November",
                "December" ],
        monthsShort : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec" ],
        daysLong : [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
                "Friday", "Saturday" ],
        daysShort : [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
        quarterLong : [ "Q1", "Q2", "Q3", "Q4" ],
        quarterShort : [ "Q1", "Q2", "Q3", "Q4" ],
        halfYearLong : [ "first half", "second half" ],
        patterns : {
            d : "M/d/yyyy",
            D : "dddd, MMMM dd, yyyy",
            f : "dddd, MMMM dd, yyyy H:mm tt",
            F : "dddd, MMMM dd, yyyy H:mm:ss tt",
            g : "M/d/yyyy H:mm tt",
            G : "M/d/yyyy H:mm:ss tt",
            m : "MMMM dd",
            o : "yyyy-MM-ddTHH:mm:ss.fff",
            s : "yyyy-MM-ddTHH:mm:ss",
            t : "H:mm tt",
            T : "H:mm:ss tt",
            U : "dddd, MMMM dd, yyyy HH:mm:ss tt",
            y : "MMM, yyyy"
        },
        tt : {
            AM : "AM",
            PM : "PM"
        },
        ten : {
            Early : "Early",
            Mid : "Mid",
            Late : "Late"
        },
        today : "Today",
        clockType : 24
    }
});
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
mini.formatDate = function(e, r, p) {
    if (!e || !e.getFullYear || isNaN(e)) {
        return ""
    }
    var b = e.toString();
    var a = mini.dateInfo;
    if (!a) {
        a = mini.dateInfo
    }
    if (typeof (a) !== "undefined") {
        var j = typeof (a.patterns[r]) !== "undefined" ? a.patterns[r] : r;
        var k = e.getFullYear();
        var i = e.getMonth();
        var l = e.getDate();
        if (r == "yyyy-MM-dd") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return k + "-" + i + "-" + l
        }
        if (r == "MM/dd/yyyy") {
            i = i + 1 < 10 ? "0" + (i + 1) : i + 1;
            l = l < 10 ? "0" + l : l;
            return i + "/" + l + "/" + k
        }
        b = j.replace(/yyyy/g, k);
        b = b.replace(/yy/g, (k + "").substring(2));
        var o = e.getHalfYear();
        b = b.replace(/hy/g, a.halfYearLong[o]);
        var c = e.getQuarter();
        b = b.replace(/Q/g, a.quarterLong[c]);
        b = b.replace(/q/g, a.quarterShort[c]);
        b = b.replace(/MMMM/g, a.monthsLong[i].escapeDateTimeTokens());
        b = b.replace(/MMM/g, a.monthsShort[i].escapeDateTimeTokens());
        b = b.replace(/MM/g, i + 1 < 10 ? "0" + (i + 1) : i + 1);
        b = b.replace(/(\\)?M/g, function(t, s) {
            return s ? t : i + 1
        });
        var d = e.getDay();
        b = b.replace(/dddd/g, a.daysLong[d].escapeDateTimeTokens());
        b = b.replace(/ddd/g, a.daysShort[d].escapeDateTimeTokens());
        b = b.replace(/dd/g, l < 10 ? "0" + l : l);
        b = b.replace(/(\\)?d/g, function(t, s) {
            return s ? t : l
        });
        var g = e.getHours();
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
        var f = e.getMinutes();
        b = b.replace(/mm/g, f < 10 ? "0" + f : f);
        b = b.replace(/(\\)?m/g, function(t, s) {
            return s ? t : f
        });
        var q = e.getSeconds();
        b = b.replace(/ss/g, q < 10 ? "0" + q : q);
        b = b.replace(/(\\)?s/g, function(t, s) {
            return s ? t : q
        });
        b = b.replace(/fff/g, e.getMilliseconds());
        b = b.replace(/tt/g, e.getHours() > 12 || e.getHours() == 0 ? a.tt.PM
                : a.tt.AM);
        var e = e.getDate();
        var h = "";
        if (e <= 10) {
            h = a.ten.Early
        } else {
            if (e <= 20) {
                h = a.ten.Mid
            } else {
                h = a.ten.Late
            }
        }
        b = b.replace(/ten/g, h)
    }
    return b.replace(/\\/g, "")
};
String.prototype.escapeDateTimeTokens = function() {
    return this.replace(/([dMyHmsft])/g, "\\$1")
};
mini.fixDate = function(b, a) {
    if (+b) {
        while (b.getDate() != a.getDate()) {
            b.setTime(+b + (b < a ? 1 : -1) * HOUR_MS)
        }
    }
};
mini.parseDate = function(s, ignoreTimezone) {
    try {
        var d = eval(s);
        if (d && d.getFullYear) {
            return d
        }
    } catch (ex) {
    }
    if (typeof s == "object") {
        return isNaN(s) ? null : s
    }
    if (typeof s == "number") {
        var d = new Date(s * 1000);
        if (d.getTime() != s) {
            return null
        }
        return isNaN(d) ? null : d
    }
    if (typeof s == "string") {
        m = s.match(/^([0-9]{4})([0-9]{2})([0-9]{2})$/);
        if (m) {
            var date = new Date(m[1], m[2] - 1, m[3]);
            return date
        }
        m = s.match(/^([0-9]{4}).([0-9]*)$/);
        if (m) {
            var date = new Date(m[1], m[2] - 1);
            return date
        }
        if (s.match(/^\d+(\.\d+)?$/)) {
            var d = new Date(parseFloat(s) * 1000);
            if (d.getTime() != s) {
                return null
            } else {
                return d
            }
        }
        if (ignoreTimezone === undefined) {
            ignoreTimezone = true
        }
        var d = mini.parseISO8601(s, ignoreTimezone)
                || (s ? new Date(s) : null);
        return isNaN(d) ? null : d
    }
    return null
};
mini.parseISO8601 = function(e, b) {
    var a = e
            .match(/^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
    if (!a) {
        a = e
                .match(/^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/);
        if (a) {
            var d = new Date(a[1], a[2] - 1, a[3], a[4]);
            return d
        }
        a = e.match(/^([0-9]{4}).([0-9]*)/);
        if (a) {
            var d = new Date(a[1], a[2] - 1);
            return d
        }
        a = e.match(/^([0-9]{4}).([0-9]*).([0-9]*)/);
        if (a) {
            var d = new Date(a[1], a[2] - 1, a[3]);
            return d
        }
        a = e.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
        if (!a) {
            return null
        } else {
            var d = new Date(a[3], a[1] - 1, a[2]);
            return d
        }
    }
    var d = new Date(a[1], 0, 1);
    if (b || !a[14]) {
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
mini.parseTime = function(e, g) {
    if (!e) {
        return null
    }
    var i = parseInt(e);
    if (i == e && g) {
        h = new Date(0);
        if (g[0] == "H") {
            h.setHours(i)
        } else {
            if (g[0] == "m") {
                h.setMinutes(i)
            } else {
                if (g[0] == "s") {
                    h.setSeconds(i)
                }
            }
        }
        return h
    }
    var h = mini.parseDate(e);
    if (!h) {
        var b = e.split(":");
        var f = parseInt(parseFloat(b[0]));
        var c = parseInt(parseFloat(b[1]));
        var a = parseInt(parseFloat(b[2]));
        if (!isNaN(f) && !isNaN(c) && !isNaN(a)) {
            h = new Date(0);
            h.setHours(f);
            h.setMinutes(c);
            h.setSeconds(a)
        }
        if (!isNaN(f) && (g == "H" || g == "HH")) {
            h = new Date(0);
            h.setHours(f)
        } else {
            if (!isNaN(f) && !isNaN(c) && (g == "H:mm" || g == "HH:mm")) {
                h = new Date(0);
                h.setHours(f);
                h.setMinutes(c)
            } else {
                if (!isNaN(f) && !isNaN(c) && g == "mm:ss") {
                    h = new Date(0);
                    h.setMinutes(f);
                    h.setSeconds(c)
                }
            }
        }
    }
    return h
};
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
