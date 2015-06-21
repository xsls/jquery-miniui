/**
 * 文件上传控件（flash实现）。
 * 
 *     @example
 *     &lt;input id="fileupload1" class="mini-fileupload" name="Fdata" limitType="*.txt" flashUrl="swfupload/swfupload.swf" uploadUrl="upload.aspx" onuploadsuccess="onUploadSuccess" /&gt;
 * 
 * @class
 * @extends mini.ButtonEdit
 * @constructor
 */
mini.FileUpload = function(a) {
    this.postParam = {};
    mini.FileUpload.superclass.constructor.call(this, a);
    this.on("validation", this.__OnValidation, this)
};
mini.extend(mini.FileUpload, mini.ButtonEdit, {
    buttonText : "浏览...",
    _buttonWidth : 56,
    limitTypeErrorText : "上传文件格式为：",
    readOnly : true,
    _cellSpacing : 0,
    limitSize : "",
    limitType : "",
    typesDescription : "上传文件格式",
    uploadLimit : 0,
    queueLimit : "",
    flashUrl : "",
    uploadUrl : "",
    showUploadProgress : true,
    postParam : null,
    uploadOnSelect : false,
    uiCls : "mini-fileupload",
    _create : function() {
        mini.FileUpload.superclass._create.call(this);
        mini.addClass(this.el, "mini-htmlfile");
        this._progressbarEl = mini
                .append(
                        this._borderEl,
                        '<div id="'
                                + this._id
                                + '$progressbar"  class="mini-fileupload-progressbar"><div id="'
                                + this._id
                                + '$complete" class="mini-fileupload-complete"></div></div>');
        this._completeEl = this._progressbarEl.firstChild;
        this._uploadId = this._id + "$button_placeholder";
        this._fileEl = mini.append(this.el, '<span id="'
                + this._uploadId + '"></span>');
        this.uploadEl = this._fileEl;
        mini.on(this._borderEl, "mousemove",
                this.__OnMouseMove, this)
    },
    _getButtonHtml : function() {
        var a = "onmouseover=\"mini.addClass(this, '"
                + this._buttonHoverCls
                + "');\" onmouseout=\"mini.removeClass(this, '"
                + this._buttonHoverCls + "');\"";
        return '<span class="mini-buttonedit-button" ' + a
                + ">" + this.buttonText + "</span>"
    },
    destroy : function(a) {
        if (this._innerEl) {
            mini.clearEvent(this._innerEl);
            this._innerEl = null
        }
        if (this.swfUpload) {
            this.swfUpload.destroy();
            this.swfUpload = null
        }
        mini.FileUpload.superclass.destroy.call(this, a)
    },
    __OnMouseMove : function(a) {
        if (this.enabled == false) {
            return
        }
        var d = this;
        if (!this.swfUpload) {
            var b = new SWFUpload(
                    {
                        file_post_name : this.name,
                        upload_url : d.uploadUrl,
                        flash_url : d.flashUrl,
                        file_size_limit : d.limitSize,
                        file_types : d.limitType,
                        file_types_description : d.typesDescription,
                        file_upload_limit : parseInt(d.uploadLimit),
                        file_queue_limit : d.queueLimit,
                        file_queued_handler : mini
                                .createDelegate(
                                        this.__on_file_queued,
                                        this),
                        upload_error_handler : mini
                                .createDelegate(
                                        this.__on_upload_error,
                                        this),
                        upload_success_handler : mini
                                .createDelegate(
                                        this.__on_upload_success,
                                        this),
                        upload_complete_handler : mini
                                .createDelegate(
                                        this.__on_upload_complete,
                                        this),
                        upload_progress_handler : mini
                                .createDelegate(
                                        this.__on_upload_progress,
                                        this),
                        button_placeholder_id : this._uploadId,
                        button_width : 1000,
                        button_height : 50,
                        button_window_mode : "transparent",
                        button_action : SWFUpload.BUTTON_ACTION.SELECT_FILE,
                        debug : false
                    });
            b.flashReady();
            this.swfUpload = b;
            var c = this.swfUpload.movieElement;
            c.style.zIndex = 1000;
            c.style.position = "absolute";
            c.style.left = "0px";
            c.style.top = "0px";
            c.style.width = "100%";
            c.style.height = "50px"
        } else {
        }
    },
    addPostParam : function(a) {
        mini.copyTo(this.postParam, a)
    },
    setPostParam : function(a) {
        this.addPostParam(a)
    },
    getPostParam : function() {
        return this.postParam
    },
    /**
     * 
     * function setLimitType(limitType)
     * @member mini.FileUpload
     * @param {String} limitType
     *
     */
    setLimitType : function(a) {
        this.limitType = a;
        if (this.swfUpload) {
            this.swfUpload.setFileTypes(this.limitType,
                    this.typesDescription)
        }
    },
    /**
     * 
     * function getLimitType()
     * @member mini.FileUpload
     * @returns {String}
     *
     */
    getLimitType : function() {
        return this.limitType
    },
    setTypesDescription : function(a) {
        this.typesDescription = a;
        if (this.swfUpload) {
            this.swfUpload.setFileTypes(this.limitType,
                    this.typesDescription)
        }
    },
    getTypesDescription : function() {
        return this.typesDescription
    },
    /**
     * 
     * function setButtonText(buttonText)
     * @member mini.FileUpload
     * @param {String} buttonText
     *
     */
    setButtonText : function(a) {
        this.buttonText = a;
        this._buttonEl.innerHTML = a
    },
    /**
     * 
     * function getButtonText()
     * @member mini.FileUpload
     * @returns {String}
     *
     */
    getButtonText : function() {
        return this.buttonText
    },
    setUploadLimit : function(a) {
        this.uploadLimit = a
    },
    setQueueLimit : function(a) {
        this.queueLimit = a
    },
    /**
     * 
     * function setFlashUrl(flashUrl)
     * @member mini.FileUpload
     * @param {String} flashUrl
     *
     */
    setFlashUrl : function(a) {
        this.flashUrl = a
    },
    /**
     * 
     * function setUploadUrl(uploadUrl)
     * @member mini.FileUpload
     * @param {String} uploadUrl
     *
     */
    setUploadUrl : function(a) {
        if (this.swfUpload) {
            this.swfUpload.setUploadURL(a)
        }
        this.uploadUrl = a
    },
    setName : function(a) {
        this.name = a
    },
    /**
     * 上传文件<br/>
     * function startUpload()
     * @member mini.FileUpload
     *
     */
    startUpload : function(b) {
        var a = {
            cancel : false
        };
        this.fire("beforeupload", a);
        if (a.cancel == true) {
            return
        }
        if (this.swfUpload) {
            this.swfUpload.setPostParams(this.postParam);
            this.swfUpload.startUpload()
        }
    },
    setShowUploadProgress : function(a) {
        this.showUploadProgress = a;
        this._progressbarEl.style.display = a ? "block"
                : "none"
    },
    getShowUploadProgress : function() {
        return this.showUploadProgress
    },
    __on_upload_progress : function(c, b, f) {
        if (this.showUploadProgress) {
            var a = mini.getWidth(this._progressbarEl);
            var d = a * b / f;
            mini.setWidth(this._completeEl, d)
        }
        this._progressbarEl.style.display = this.showUploadProgress ? "block"
                : "none";
        var g = {
            file : c,
            complete : b,
            total : f
        };
        this.fire("uploadprogress", g)
    },
    __on_file_queued : function(c) {
        var a = this.swfUpload.getStats().files_queued;
        if (a > 1) {
            for (var b = 0; b < a - 1; b++) {
                this.swfUpload.cancelUpload()
            }
        }
        var d = {
            file : c
        };
        if (this.uploadOnSelect) {
            this.startUpload()
        }
        this.setText(c.name);
        this.fire("fileselect", d)
    },
    __on_upload_success : function(b, a) {
        var c = {
            file : b,
            serverData : a
        };
        this.fire("uploadsuccess", c);
        this._progressbarEl.style.display = "none"
    },
    __on_upload_error : function(a, c, b) {
        this._progressbarEl.style.display = "none";
        var d = {
            file : a,
            code : c,
            message : b
        };
        this.fire("uploaderror", d)
    },
    __on_upload_complete : function(a) {
        this._progressbarEl.style.display = "none";
        this.fire("uploadcomplete", a)
    },
    __fileError : function() {
    },
    getAttrs : function(b) {
        var a = mini.FileUpload.superclass.getAttrs.call(this,
                b);
        mini._ParseString(b, a, [ "limitType", "limitSize",
                "flashUrl", "uploadUrl", "uploadLimit",
                "buttonText", "showUploadProgress",
                "onuploadsuccess", "onuploaderror",
                "onuploadcomplete", "onfileselect",
                "onuploadprogress" ]);
        mini._ParseBool(b, a, [ "uploadOnSelect" ]);
        return a
    }
});
mini.regClass(mini.FileUpload, "fileupload");