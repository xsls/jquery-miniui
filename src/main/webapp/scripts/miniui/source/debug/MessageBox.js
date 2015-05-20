mini.MessageBox = {
    alertTitle : "æé†’",
    confirmTitle : "ç¡®è®¤",
    prompTitle : "è¾“å…¥",
    prompMessage : "è¯·è¾“å…¥å†…å®¹ï¼š",
    buttonText : {
        ok : "ç¡®å®š",
        cancel : "å–æ¶ˆ",
        yes : "æ˜¯",
        no : "å¦"
    },
    show : function(e) {
        e = mini.copyTo({
            width : "auto",
            height : "auto",
            showModal : true,
            timeout : 0,
            minWidth : 150,
            maxWidth : 800,
            minHeight : 50,
            maxHeight : 350,
            showHeader : true,
            title : "",
            titleIcon : "",
            iconCls : "",
            iconStyle : "",
            message : "",
            html : "",
            spaceStyle : "margin-right:15px",
            showCloseButton : true,
            buttons : null,
            buttonWidth : 58,
            callback : null
        }, e);
        e.message = String(e.message);
        var f = e.callback;
        var m = new mini.Window();
        m.setBodyStyle("overflow:hidden");
        m.setShowModal(e.showModal);
        m.setTitle(e.title || "");
        m.setIconCls(e.titleIcon);
        m.setShowHeader(e.showHeader);
        m.setShowCloseButton(e.showCloseButton);
        var d = m.uid + "$table", b = m.uid + "$content";
        var v = '<div class="' + e.iconCls + '" style="' + e.iconStyle + '"></div>';
        var o = '<table class="mini-messagebox-table" id="' + d + '" style="" cellspacing="0" cellpadding="0"><tr><td>' + v + '</td><td id="' + b + '" class="mini-messagebox-content-text">'
                + (e.message || "") + "</td></tr></table>";
        var c = '<div class="mini-messagebox-content"></div><div class="mini-messagebox-buttons"></div>';
        m._bodyEl.innerHTML = c;
        var g = m._bodyEl.firstChild;
        if (e.html) {
            if (typeof e.html == "string") {
                g.innerHTML = e.html
            } else {
                if (mini.isElement(e.html)) {
                    g.appendChild(e.html)
                }
            }
        } else {
            g.innerHTML = o
        }
        m._Buttons = [];
        var w = m._bodyEl.lastChild;
        if (e.buttons && e.buttons.length > 0) {
            for (var t = 0, r = e.buttons.length; t < r; t++) {
                var a = e.buttons[t];
                var n = mini.MessageBox.buttonText[a];
                if (!n) {
                    n = a
                }
                var j = new mini.Button();
                j.setText(n);
                j.setWidth(e.buttonWidth);
                j.render(w);
                j.action = a;
                j.on("click", function(l) {
                    var i = l.sender;
                    if (f) {
                        if (f(i.action) === false) {
                            return
                        }
                    }
                    mini.MessageBox.hide(m)
                });
                if (t != r - 1) {
                    j.setStyle(e.spaceStyle)
                }
                m._Buttons.push(j)
            }
        } else {
            w.style.display = "none"
        }
        m.setMinWidth(e.minWidth);
        m.setMinHeight(e.minHeight);
        m.setMaxWidth(e.maxWidth);
        m.setMaxHeight(e.maxHeight);
        m.setWidth(e.width);
        m.setHeight(e.height);
        m.show(e.x, e.y, {
            animType : e.animType
        });
        var q = m.getWidth();
        m.setWidth(q);
        var p = m.getHeight();
        m.setHeight(p);
        var k = document.getElementById(d);
        if (k) {
            k.style.width = "100%"
        }
        var h = document.getElementById(b);
        if (h) {
            h.style.width = "100%"
        }
        var u = m._Buttons[0];
        if (u) {
            u.focus()
        } else {
            m.focus()
        }
        m.on("beforebuttonclick", function(i) {
            if (f) {
                f("close")
            }
            i.cancel = true;
            mini.MessageBox.hide(m)
        });
        mini.on(m.el, "keydown", function(i) {
        });
        if (e.timeout) {
            setTimeout(function() {
                mini.MessageBox.hide(m.uid)
            }, e.timeout)
        }
        return m.uid
    },
    hide : function(e) {
        if (!e) {
            return
        }
        var d = typeof e == "object" ? e : mini.getbyUID(e);
        if (!d) {
            return
        }
        for (var c = 0, a = d._Buttons.length; c < a; c++) {
            var b = d._Buttons[c];
            b.destroy()
        }
        d._Buttons = null;
        d.destroy()
    },
    alert : function(a, b, c) {
        return mini.MessageBox.show({
            minWidth : 250,
            title : b || mini.MessageBox.alertTitle,
            buttons : [ "ok" ],
            message : a,
            iconCls : "mini-messagebox-warning",
            callback : c
        })
    },
    confirm : function(a, b, c) {
        return mini.MessageBox.show({
            minWidth : 250,
            title : b || mini.MessageBox.confirmTitle,
            buttons : [ "ok", "cancel" ],
            message : a,
            iconCls : "mini-messagebox-question",
            callback : c
        })
    },
    prompt : function(d, f, h, e) {
        var g = "prompt$" + new Date().getTime();
        var c = d || mini.MessageBox.promptMessage;
        if (e) {
            c = c + '<br/><textarea id="' + g + '" style="width:200px;height:60px;margin-top:3px;"></textarea>'
        } else {
            c = c + '<br/><input id="' + g + '" type="text" style="width:200px;margin-top:3px;"/>'
        }
        var b = mini.MessageBox.show({
            title : f || mini.MessageBox.promptTitle,
            buttons : [ "ok", "cancel" ],
            width : 250,
            html : '<div style="padding:5px;padding-left:10px;">' + c + "</div>",
            callback : function(j) {
                var i = document.getElementById(g);
                if (h) {
                    return h(j, i.value)
                }
            }
        });
        var a = document.getElementById(g);
        a.focus();
        return b
    },
    loading : function(a, b) {
        return mini.MessageBox.show({
            minHeight : 50,
            title : b,
            showCloseButton : false,
            message : a,
            iconCls : "mini-messagebox-waiting"
        })
    },
    showTips : function(b) {
        var d = jQuery;
        b = d.extend({
            content : "",
            state : "",
            x : "center",
            y : "top",
            offset : [ 10, 10 ],
            fixed : true,
            timeout : 2000
        }, b);
        var a = "mini-tips-" + b.state;
        var c = '<div class="mini-tips ' + a + '">' + b.content + "</div>";
        var e = d(c).appendTo(document.body);
        b.el = e[0];
        b.timeoutHandler = function() {
            e.slideUp();
            setTimeout(function() {
                e.remove()
            }, 2000)
        };
        mini.showAt(b);
        e.hide().slideDown()
    }
};
mini.alert = mini.MessageBox.alert;
mini.confirm = mini.MessageBox.confirm;
mini.prompt = mini.MessageBox.prompt;
mini.loading = mini.MessageBox.loading;
mini.showMessageBox = mini.MessageBox.show;
mini.hideMessageBox = mini.MessageBox.hide;
mini.showTips = mini.MessageBox.showTips;
