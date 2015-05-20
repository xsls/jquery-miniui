(function(a) {
    a.ajax = function(c) {
        var b = c.url;
        if (b && b.length > 4 && b.lastIndexOf(".ext") == b.length - 4) {
            if (!c.dataType) {
                c.dataType = "json"
            }
            if (!c.contentType) {
                c.contentType = "application/json; charset=UTF-8"
            }
            if (c.data && mini.isNull(c.data.pageIndex) == false) {
                var d = c.data.page = {};
                d.begin = c.data.pageIndex * c.data.pageSize;
                d.length = c.data.pageSize
            }
            if (c.dataType == "json" && typeof (c.data) == "object") {
                c.data = mini.encode(c.data);
                if (c.data == "{}") {
                    delete c.data
                }
                c.type = "POST"
            }
        }
        return window.jQuery.ajax(c)
    }
})(mini);