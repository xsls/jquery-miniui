(function(a) {
    // 重写 MiniUI 的 ajax 对象
    a.ajax = function(options) {
        var b = options.url;
        if (b && b.length > 4 && b.lastIndexOf(".ext") == b.length - 4) {
            if (!options.dataType) {
                options.dataType = "json"
            }
            if (!options.contentType) {
                options.contentType = "application/json; charset=UTF-8"
            }
            if (options.data && mini.isNull(options.data.pageIndex) == false) {
                var d = options.data.page = {};
                d.begin = options.data.pageIndex * options.data.pageSize;
                d.length = options.data.pageSize
            }
            if (options.dataType == "json" && typeof (options.data) == "object") {
                options.data = mini.encode(options.data);
                if (options.data == "{}") {
                    delete options.data
                }
                options.type = "POST"
            }
        }
        return window.jQuery.ajax(options)
    }
})(mini);