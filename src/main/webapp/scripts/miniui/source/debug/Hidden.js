mini.Hidden = function() {
    mini.Hidden.superclass.constructor.call(this)
};
mini.extend(mini.Hidden, mini.Control, {
    _clearBorder : false,
    formField : true,
    value : "",
    uiCls : "mini-hidden",
    _create : function() {
        this.el = document.createElement("input");
        this.el.type = "hidden";
        this.el.className = "mini-hidden"
    },
    setName : function(a) {
        this.name = a;
        this.el.name = a
    },
    setValue : function(b) {
        if (b === null || b === undefined) {
            b = ""
        }
        this.value = b;
        if (mini.isDate(b)) {
            var e = b.getFullYear();
            var a = b.getMonth() + 1;
            var c = b.getDate();
            a = a < 10 ? "0" + a : a;
            c = c < 10 ? "0" + c : c;
            this.el.value = e + "-" + a + "-" + c
        } else {
            this.el.value = b
        }
    },
    getValue : function() {
        return this.value
    },
    getFormValue : function() {
        return this.el.value
    }
});
mini.regClass(mini.Hidden, "hidden");