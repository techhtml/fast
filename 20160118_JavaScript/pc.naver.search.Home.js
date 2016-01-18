pc.naver.search.AutoComplete = jindo.$Class({
    _config: null ,
    _elInput: null ,
    _nIntervalId: 0,
    _api: null ,
    _beforeInputValue: null ,
    _oAjax: null ,
    _sAutoCode: "0000000010",
    _sInOut: null ,
    _welListLayer: null ,
    _welListCon: null ,
    _welHint: null ,
    _lineClass: "lnk_autocomplete_on",
    _dMouseOverList: null ,
    _dClickList: null ,
    _dClickCityLayer: null ,
    _welLayerInCity: null ,
    _welLayerOutCity: null ,
    _welLayerCity: null ,
    _fClickCityLayerCheck: null ,
    _alertMsg0: "출발지는 국내공항만 선택 가능합니다.",
    _alertMsg1: "다구간 경유지는 해외 공항만 선택 가능합니다.",
    _alertMsg2: "마지막 도착지는 국내 공항만 선택 가능합니다.",
    _wtListTemplate: null ,
    _listTemplate: ["{for num:item in items}", '<li class="item" data-order="{=num}">', '<a href="javascript:;" class="_item" data-code="{=item.code}" data-kairport-name="{=item.kAirPortName}" data-eairport-name="{=item.eAirPortName}" data-enation-name="{=item.eNationName}" data-knation-name="{=item.kNationName}" data-ecity-name="{=item.eCityName}" data-kcity-name="{=item.kCityName}" >', "<strong>{=item.highlighted0}, {=item.highlighted1}({=item.highlighted2})</strong>", '<p><span class="flight_ly_code">{=item.highlighted4}</span><span class="sp_flight flight_ly_airport">{=item.highlighted5}</span></p>', "</a>", "</li>", "{/for}"].join(""),
    $init: function(a) {
        this._config = pc.naver.search.config,
            this._api = this._config.apiAutoComplete,
            this._welLayerInCity = a.welLayerInCity,
            this._welLayerOutCity = a.welLayerOutCity,
            this._welInTableInCity = $Element(this._welLayerInCity.query("._in")),
            this._welInTableOutCity = $Element(this._welLayerOutCity.query("._in")),
            this._welOutTableOutCity = $Element(this._welLayerOutCity.query("._out_line")),
            this._welMessageInCity = $Element(this._welLayerInCity.query("._alert")),
            this._welMessageOutCity = $Element(this._welLayerOutCity.query("._alert")),
            this._leftLayerClass = a.leftLayerClass,
            this._rightLayerClass = a.rightLayerClass,
            this._threeLayerClass = a.threeLayerClass,
            this._assignElement(),
            this._assignEvent(),
            this._makeAjax(),
            this._wtListTemplate = $Template(this._listTemplate)
    },
    _assignElement: function() {},
    _assignEvent: function() {
        this._fOnFocus = $Fn(this._onFocus, this),
            this._fOnBlur = $Fn(this._onBlur, this),
            this._fOnKeyDown = $Fn(this._onKeydown, this),
            this._fMouseOverList = $Fn(this._onMouseOverList, this).bind(),
            this._fClickList = $Fn(this._onClickList, this).bind(),
            this._fMouseDownDocument = $Fn(this._onMouseDownDocument, this),
            this._fClickCityLayer = $Fn(this._onClickCityLayer, this).bind(),
            this._fClickCityLayerCheck = $Fn(this._onClickCityLayerCheck, this)
    },
    _makeAjax: function() {
        this._oAjax = new $Ajax(this._api,{
            type: "jsonp",
            onload: jindo.$Fn(this._onRetrieveSuccess, this).bind(),
            onerror: jindo.$Fn(this._onRetrieveError, this).bind()
        })
    },
    selectAutoComplete: function(a) {
        this._cleanInput(),
            this._cityLayerHide(),
            this._sTab = a.sTab,
            this._sAct = a.sAct,
            this._elInput = a.elInput,
            this._sAutoCode = a.sAutoCode,
            this._sInOut = a.sInOut,
            this._welListLayer = a.welListLayer,
            this._welListCon = a.welListCon,
            this._welArea = a.welArea,
            this._nOrder = a.nOrder,
            "in" == this._sInOut ? this._welLayerCity = this._welLayerInCity : ("out" == this._sInOut || "inOut" == this._sInOut) && (this._welLayerCity = this._welLayerOutCity),
            this._welArea.append(this._welLayerCity.$value()),
            "OW" == this._sTab || "RT" == this._sTab ? (0 == this._nOrder && "departure" == this._sAct && (this._welMessageInCity.show(),
                this._welMessageInCity.html(this._alertMsg0)),
            0 == this._nOrder && "arrival" == this._sAct && this._welMessageOutCity.hide()) : "MD" == this._sTab && (1 == this._nOrder && "departure" == this._sAct && (this._welMessageInCity.show(),
                this._welMessageInCity.html(this._alertMsg0)),
            1 == this._nOrder && "arrival" == this._sAct && (this._welMessageOutCity.show(),
                this._welMessageOutCity.html(this._alertMsg1)),
            2 == this._nOrder && "departure" == this._sAct && (this._welMessageOutCity.show(),
                this._welMessageOutCity.html(this._alertMsg1)),
            2 == this._nOrder && "arrival" == this._sAct && this._welMessageOutCity.hide(),
            3 == this._nOrder && "departure" == this._sAct && (this._welMessageOutCity.show(),
                this._welMessageOutCity.html(this._alertMsg1)),
            3 == this._nOrder && "arrival" == this._sAct && (this._welMessageInCity.show(),
                this._welMessageInCity.html(this._alertMsg2))),
            this._welOutTableOutCity.hide(),
            "OW" == this._sTab || "RT" == this._sTab ? "departure" == this._sAct ? this._welInTableInCity.show() : "arrival" == this._sAct && this._welInTableOutCity.show() : "MD" == this._sTab && (this._welInTableOutCity.hide(),
                "departure" == this._sAct ? (this._welInTableInCity.hide(),
                    2 == this._nOrder || 3 == this._nOrder ? this._welLayerOutCity.addClass("flight_ly_rec_departure_dep") : this._welLayerOutCity.removeClass("flight_ly_rec_departure_dep")) : "arrival" == this._sAct && (1 == this._nOrder ? this._welInTableOutCity.hide() : 2 == this._nOrder ? this._welOutTableOutCity.show() : 3 == this._nOrder && this._welInTableInCity.hide())),
            this._attachEvent(),
            this._watchInput(),
            this._elInput.focus(),
            this._cityLayerShow()
    },
    _cityLayerShow: function() {
        null  != this._welLayerCity && (this._welLayerCity.removeClass(this._leftLayerClass),
            this._welLayerCity.removeClass(this._rightLayerClass),
            this._welLayerCity.removeClass(this._threeLayerClass),
            "departure" == this._sAct ? this._welLayerCity.addClass(this._leftLayerClass) : "arrival" == this._sAct && this._welLayerCity.addClass(this._rightLayerClass),
            this._welLayerCity.show("block"),
        "MD" == this._sTab && 3 == this._nOrder && "arrival" == this._sAct && (this._welLayerCity.removeClass(this._rightLayerClass),
            this._welLayerCity.addClass(this._threeLayerClass)))
    },
    _cityLayerHide: function() {
        null  != this._welLayerCity && this._welLayerCity.hide()
    },
    _onMouseOverList: function(a) {
        for (var b = a.currentElement, c = a.element, d = $Element(b).queryAll("li"), e = 0; e < d.length; e++) {
            var f = $Element(d[e]);
            f.removeClass(this._lineClass),
            c == d[e] && f.addClass(this._lineClass)
        }
    },
    _onClickList: function(a) {
        var b = a.element
            , c = $Element(b).query("a._item")
            , d = this._getSelectedInfo(c);
        this.fireEvent("onClickItem", d),
            this._cleanInput(),
            this.hide(),
            this._cityLayerHide(),
            this.fireEvent("onBlurInput", null ),
            this._sendClickCr(a, "auto")
    },
    _enterSelect: function(a) {
        var b = this._welListCon.query("." + this._lineClass);
        if (null  != b) {
            var c = $Element(b).query("a._item")
                , d = this._getSelectedInfo(c);
            this.fireEvent("onClickItem", d),
                this._cleanInput(),
                this.hide(),
                this._cityLayerHide(),
                this.fireEvent("onBlurInput", null ),
                this._sendClickCr(a, "auto")
        }
    },
    _upLine: function() {
        var a = this._welListCon.query("." + this._lineClass)
            , b = this._welListCon.queryAll("li")
            , c = 0;
        if (null  == a)
            c = b.length - 1;
        else {
            var d = $Element(a);
            c = parseInt(d.attr("data-order"), 10),
                d.removeClass(this._lineClass)
        }
        0 >= c ? c = b.length - 1 : c--,
            $Element(b[c]).addClass(this._lineClass);
        var e = $Element(b[c])
            , f = e.query("a").getAttribute("data-kcity-name");
        this._inputValue(f)
    },
    _downLine: function() {
        var a = this._welListCon.query("." + this._lineClass)
            , b = 0;
        if (null  == a)
            b = -1;
        else {
            var c = $Element(a);
            b = parseInt(c.attr("data-order"), 10),
                c.removeClass(this._lineClass)
        }
        var d = this._welListCon.queryAll("li");
        b >= d.length - 1 ? b = 0 : b++,
            $Element(d[b]).addClass(this._lineClass);
        var e = $Element(d[b])
            , f = e.query("a").getAttribute("data-kcity-name");
        this._inputValue(f)
    },
    _inputValue: function(a) {
        this._beforeInputValue = a,
            this._elInput.value = a
    },
    _onClickCityLayer: function(a) {
        var b = a.element
            , c = this._getSelectedInfo(b);
        this.fireEvent("onClickItem", c),
            this._cleanInput(),
            this.hide(),
            this._cityLayerHide(),
            this.fireEvent("onBlurInput", null ),
            this._sendClickCr(a, "direct"),
            "_flight_section" == this._config.elSectionClass ? tCR("a=" + c.cr + "&r=1&i=" + this._config.GDID) : clickcr(a.element, c.cr, "", "", a._event)
    },
    _onClickCityLayerCheck: function(a) {
        var b = a.element
            , c = b.tagName.toLowerCase();
        "a" == c || "span" == c || (this._cleanInput(),
            this.hide(),
            this._cityLayerHide(),
            this.fireEvent("onBlurInput", null ))
    },
    _onChange: function() {
        this._request(this._elInput.value)
    },
    _onFocus: function() {},
    _onBlur: function() {},
    _onKeyup: function() {},
    _onKeydown: function(a) {
        if (null  != this._elInput) {
            var b = a.key()
                , c = 9;
            if (b.up)
                1 == this._welListLayer.visible() && (this._upLine(),
                    a.stop());
            else if (c == b.keyCode)
                if (c == b.keyCode && b.shift) {
                    if (this._welLayerCity.visible())
                        return this._cityLayerHide(),
                            this._cleanInput(),
                            this.hide(),
                            void this.fireEvent("onBlurInput", null );
                    this._welListLayer.visible() ? (this._upLine(),
                        a.stop()) : (this._cleanInput(),
                        this.hide(),
                        this.fireEvent("onBlurInput", null ))
                } else {
                    if (this._welLayerCity.visible())
                        return this._cityLayerHide(),
                            this._cleanInput(),
                            this.hide(),
                            void this.fireEvent("onBlurInput", null );
                    this._welListLayer.visible() ? (this._downLine(),
                        a.stop()) : (this._cleanInput(),
                        this.hide(),
                        this.fireEvent("onBlurInput", null ))
                }
            else
                b.down ? (1 == this._welListLayer.visible() && (this._downLine(),
                    a.stop()),
                    a.stop()) : b.enter ? 1 == this._welListLayer.visible() && (this._enterSelect(a),
                    a.stop()) : b.right || b.left
        }
    },
    _onMouseDownDocument: function(a) {
        var b = a.element;
        if (b) {
            if ($Element(b).hasClass("flight_hint"))
                return void window.setTimeout($Fn(function() {
                    this._elInput.focus()
                }, this).bind(), 0);
            if (this._welLayerCity.visible()) {
                var c = $Element(b).isChildOf(this._welLayerCity.$value());
                1 == c || $Element(b).hasClass("_city") || b == this._elInput || (this.fireEvent("onBlurInput", null ),
                    this._cleanInput(),
                    this.hide(),
                    this._cityLayerHide())
            } else if (this._welListLayer.visible()) {
                var c = $Element(b).isChildOf(this._welListLayer.$value());
                1 == c || b == this._elInput || (this.fireEvent("onBlurInput", null ),
                    this._cleanInput(),
                    this.hide(),
                    this._cityLayerHide())
            } else
                this.fireEvent("onBlurInput", null ),
                    this._cleanInput(),
                    this.hide(),
                    this._cityLayerHide()
        }
    },
    _request: function(a) {
        return a = $S(a).trim(),
            a = a.$value(),
            0 === a.length ? (this.hide(),
                void this._cityLayerShow()) : (this._cityLayerHide(),
                void this._oAjax.abort().request({
                    q_enc: "UTF-8",
                    st: this._sAutoCode,
                    r_lt: "1111111111",
                    r_format: "json",
                    r_enc: "UTF-8",
                    r_unicode: "0",
                    r_escape: "1",
                    q: a
                }))
    },
    _onRetrieveSuccess: function(a) {
        var b = a.json();
        if (!b || !b.items)
            return void this.hide();
        if ("in" == this._sInOut) {
            if (0 == b.items[8].length)
                return void this.hide();
            for (var c = b.items[8], d = 0; d < c.length; d++) {
                var e = c[d]
                    , f = [];
                f[0] = e[0],
                    f[1] = e[1],
                    f[2] = e[2],
                    f[3] = ["대한민국"],
                    f[4] = ["Korea Republic of"],
                    f[5] = [""],
                    f[6] = [""],
                    f[7] = e[3],
                    f[8] = e[4],
                    c[d] = f
            }
            b.items[8] = c
        } else if ("out" == this._sInOut) {
            if (0 == b.items[9].length)
                return void this.hide()
        } else if ("inOut" == this._sInOut && 0 == b.items[9].length)
            return void this.hide();
        this._inputHtml(b.items, b.query[0]),
            this.show()
    },
    _inputHtml: function(a, b) {
        for (var c = [], d = [], e = 0; 8 > e; e++)
            a.shift();
        for (var e = 0; a[e]; e++)
            for (var f = 0; a[e][f]; f++) {
                var g = a[e][f][3][0]
                    , h = a[e][f][1][0];
                if ("out" != this._sInOut || "대한민국" != g) {
                    var i = a[e][f][2][0]
                        , j = a[e][f][4][0]
                        , k = a[e][f][0][0]
                        , l = a[e][f][7][0]
                        , m = a[e][f][8][0];
                    d.push({
                        code: k,
                        kCityName: h,
                        eCityName: i,
                        eNationName: j,
                        kNationName: g,
                        eAirPortName: m,
                        kAirPortName: l,
                        highlighted0: this._makeStrong(g, b),
                        highlighted1: this._makeStrong(h, b),
                        highlighted2: this._makeStrong(i, b),
                        highlighted3: this._makeStrong(j, b),
                        highlighted4: this._makeStrong(k, b),
                        highlighted5: this._makeStrong(l, b),
                        highlighted6: this._makeStrong(m, b)
                    })
                }
            }
        c.push(this._makeHtml(d, "acard")),
            this._welListCon.html(c.join(""))
    },
    _makeStrong: function(a, b) {
        if ("undefined" == typeof a)
            return "";
        for (var c = new RegExp("[.*+?|()\\[\\]{}\\\\]","g"), d = b.replace(/()/g, " ").replace(/^\s+|\s+$/g, ""), e = d.match(/\S/g), f = [], g = 0, h = e.length; h > g; g++)
            f.push(e[g].replace(/[\S]+/g, "[" + e[g].toLowerCase().replace(c, "\\$&") + "|" + e[g].toUpperCase().replace(c, "\\$&") + "] ").replace(/[\s]+/g, "[\\s]*"));
        d = "(" + f.join("") + ")";
        var i = ""
            , j = new RegExp(d);
        return j.test(a) && (i = a.replace(j, "<span class='flight_ly_highlight'>$1</span>")),
        i || a
    },
    _makeHtml: function(a, b) {
        return a && a.length > 0 ? this._wtListTemplate.process({
            items: a,
            clickLog: b
        }) : ""
    },
    _watchInput: function() {
        this._nIntervalId = window.setInterval($Fn(this._onWatch, this).bind(), 200)
    },
    _onWatch: function() {
        var a = this._elInput.value;
        this._beforeInputValue != a && (this._beforeInputValue = a,
            this._onChange())
    },
    _cleanInput: function() {
        this._detachEvent(),
        this._elInput && (this._elInput.value = "",
            this._elInput = null ),
            window.clearInterval(this._nIntervalId)
    },
    _onRetrieveError: function() {},
    show: function() {
        this._welListLayer.show("block")
    },
    hide: function() {
        this._oAjax.abort(),
            this._welListLayer.hide(),
            this._welListCon.empty()
    },
    _getSelectedInfo: function(a) {
        var b = $Element(a)
            , c = b.attr("data-knation-name");
        return obj = {
            sCode: b.attr("data-code"),
            sTab: this._sTab,
            sAct: this._sAct,
            sWhere: "대한민국" == c ? "in" : "out",
            nOrder: this._nOrder,
            kCityName: b.attr("data-kcity-name"),
            eCityName: b.attr("data-ecity-name"),
            kNationName: c,
            eNationName: b.attr("data-enation-name"),
            kAirPortName: b.attr("data-kairport-name"),
            eAirPortName: b.attr("data-eairport-name"),
            cr: b.attr("data-cr")
        }
    },
    _detachEvent: function() {
        this._elInput && (this._fOnFocus.detach(this._elInput, "focus"),
            this._fOnBlur.detach(this._elInput, "blur"),
            this._fOnKeyDown.detach(this._elInput, "keydown"),
            this._fMouseDownDocument.detach(document.body, "mousedown"),
            this._fClickCityLayerCheck.detach(this._welLayerCity.$value(), "click")),
        null  != this._dMouseOverList && (this._welListCon.undelegate("mouseover", "li", this._fMouseUpList),
            this._dMouseOverList = null ),
        null  != this._dClickList && (this._welListCon.undelegate("click", "li", this._fClickList),
            this._dClickList = null ),
        null  != this._dClickCityLayer && (this._welLayerCity.undelegate("click", "a", this._fClickCityLayer),
            this._dClickCityLayer = null )
    },
    _attachEvent: function() {
        this._elInput && (this._fOnFocus.attach(this._elInput, "focus"),
            this._fOnBlur.attach(this._elInput, "blur"),
            this._fOnKeyDown.attach(this._elInput, "keydown"),
            this._fMouseDownDocument.attach(document.body, "mousedown"),
            this._fClickCityLayerCheck.attach(this._welLayerCity.$value(), "click"),
            this._dMouseOverList = this._welListCon.delegate("mouseover", "li", this._fMouseOverList),
            this._dClickList = this._welListCon.delegate("click", "li", this._fClickList),
            this._dClickCityLayer = this._welLayerCity.delegate("click", "a", this._fClickCityLayer))
    },
    _sendClickCr: function(a, b) {
        if ("_flight_section" == this._config.elSectionClass)
            var c = "fly_";
        else
            var c = "";
        var d = ""
            , e = "";
        "OW" == this._sTab ? d = c + "one" : "RT" == this._sTab ? d = c + "rnd" : "MD" == this._sTab && (d = c + "mul"),
        "direct" == b && ("OW" == this._sTab ? "departure" == this._sAct ? e = "depchoice" : "arrival" == this._sAct && (e = "arrchoice") : "RT" == this._sTab ? "departure" == this._sAct ? e = "depchoice" : "arrival" == this._sAct && (e = "arrchoice") : "MD" == this._sTab && (1 == this._nOrder ? "departure" == this._sAct ? e = "depsel1" : "arrival" == this._sAct && (e = "arrsel1") : 2 == this._nOrder ? "departure" == this._sAct ? e = "depsel2" : "arrival" == this._sAct && (e = "arrsel2") : 3 == this._nOrder && ("departure" == this._sAct ? e = "depsel3" : "arrival" == this._sAct && (e = "arrsel3"))),
            "_flight_section" == this._config.elSectionClass ? tCR("a=" + d + "." + e + "&r=1&i=" + this._config.GDID) : clickcr(a.element, d + "." + e, "", "", a._event)),
        "auto" == b && ("OW" == this._sTab ? "departure" == this._sAct ? e = "depauto" : "arrival" == this._sAct && (e = "arrauto") : "RT" == this._sTab ? "departure" == this._sAct ? e = "depauto" : "arrival" == this._sAct && (e = "arrauto") : "MD" == this._sTab && (1 == this._nOrder ? "departure" == this._sAct ? e = "depauto1" : "arrival" == this._sAct && (e = "arrauto1") : 2 == this._nOrder ? "departure" == this._sAct ? e = "depauto2" : "arrival" == this._sAct && (e = "arrauto2") : 3 == this._nOrder && ("departure" == this._sAct ? e = "depauto3" : "arrival" == this._sAct && (e = "arrauto3"))),
            "_flight_section" == this._config.elSectionClass ? tCR("a=" + d + "." + e + "&r=1&i=" + this._config.GDID) : clickcr(a.element, d + "." + e, "", "", a._event))
    }
}).extend(jindo.UIComponent),
    pc.naver.search.Calendar = jindo.$Class({
        _oFromDate: null ,
        _oToDate: null ,
        _oneDate: null ,
        _twoDate: null ,
        _threeDate: null ,
        _sTab: null ,
        _sOrder: null ,
        _dateAttrName: "data_date",
        _sHeader: null ,
        oHoliday: {
            2000: {
                1: {
                    1: !0
                },
                2: {
                    5: !0,
                    6: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    11: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    11: !0,
                    12: !0,
                    13: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2001: {
                1: {
                    1: !0,
                    24: !0,
                    25: !0
                },
                3: {
                    1: !0
                },
                5: {
                    1: !0,
                    5: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    30: !0
                },
                10: {
                    1: !0,
                    2: !0,
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2002: {
                1: {
                    1: !0
                },
                2: {
                    11: !0,
                    12: !0,
                    13: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    19: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    20: !0,
                    21: !0,
                    22: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2003: {
                1: {
                    1: !0
                },
                2: {
                    1: !0,
                    2: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    8: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    10: !0,
                    11: !0,
                    12: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2004: {
                1: {
                    1: !0,
                    21: !0,
                    22: !0,
                    23: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    26: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    27: !0,
                    28: !0,
                    29: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2005: {
                1: {
                    1: !0
                },
                2: {
                    8: !0,
                    9: !0,
                    10: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    15: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    17: !0,
                    18: !0,
                    19: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2006: {
                1: {
                    1: !0,
                    29: !0,
                    30: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                10: {
                    3: !0,
                    5: !0,
                    6: !0,
                    7: !0
                },
                12: {
                    25: !0
                }
            },
            2007: {
                1: {
                    1: !0
                },
                2: {
                    17: !0,
                    18: !0,
                    19: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    24: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    24: !0,
                    25: !0,
                    26: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2008: {
                1: {
                    1: !0
                },
                2: {
                    6: !0,
                    7: !0,
                    8: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    12: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    13: !0,
                    14: !0,
                    15: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2009: {
                1: {
                    1: !0,
                    25: !0,
                    26: !0,
                    27: !0
                },
                3: {
                    1: !0
                },
                5: {
                    2: !0,
                    5: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                10: {
                    2: !0,
                    3: !0,
                    4: !0
                },
                12: {
                    25: !0
                }
            },
            2010: {
                1: {
                    1: !0
                },
                2: {
                    13: !0,
                    14: !0,
                    15: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    21: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    21: !0,
                    22: !0,
                    23: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2011: {
                1: {
                    1: !0
                },
                2: {
                    2: !0,
                    3: !0,
                    4: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    10: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    11: !0,
                    12: !0,
                    13: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2012: {
                1: {
                    1: !0,
                    23: !0,
                    24: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    28: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    29: !0,
                    30: !0
                },
                10: {
                    1: !0,
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2013: {
                1: {
                    1: !0
                },
                2: {
                    10: !0,
                    11: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    17: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    18: !0,
                    19: !0,
                    20: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2014: {
                1: {
                    1: !0,
                    30: !0,
                    31: !0
                },
                2: {
                    1: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    6: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    7: !0,
                    8: !0,
                    9: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2015: {
                1: {
                    1: !0
                },
                2: {
                    18: "설날",
                    19: "설날",
                    20: "설날"
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    25: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    26: !0,
                    27: !0,
                    28: !0,
                    29: !0
                },
                10: {
                    3: !0,
                    9: !0
                },
                12: {
                    25: !0
                }
            },
            2016: {
                1: {
                    1: !0
                },
                2: {
                    8: !0,
                    9: !0,
                    10: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    14: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    14: !0,
                    15: !0,
                    16: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2017: {
                1: {
                    1: !0,
                    27: !0,
                    28: !0,
                    29: !0,
                    30: !0
                },
                3: {
                    1: !0
                },
                5: {
                    3: !0,
                    5: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                10: {
                    3: !0,
                    4: !0,
                    5: !0,
                    6: !0
                },
                12: {
                    25: !0
                }
            },
            2018: {
                1: {
                    1: !0
                },
                2: {
                    15: !0,
                    16: !0,
                    17: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    7: !0,
                    22: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    23: !0,
                    24: !0,
                    25: !0,
                    26: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2019: {
                1: {
                    1: !0
                },
                2: {
                    4: !0,
                    5: !0,
                    6: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    6: !0,
                    12: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    12: !0,
                    13: !0,
                    14: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2020: {
                1: {
                    1: !0,
                    24: !0,
                    25: !0,
                    26: !0,
                    27: !0
                },
                3: {
                    1: !0
                },
                4: {
                    30: !0
                },
                5: {
                    5: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    30: !0
                },
                10: {
                    1: !0,
                    2: !0,
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2021: {
                1: {
                    1: !0
                },
                2: {
                    11: !0,
                    12: !0,
                    13: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    19: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    20: !0,
                    21: !0,
                    22: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2022: {
                1: {
                    1: !0
                },
                2: {
                    1: !0,
                    2: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    8: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    9: !0,
                    10: !0,
                    11: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2023: {
                1: {
                    1: !0,
                    21: !0,
                    22: !0,
                    23: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    27: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    28: !0,
                    29: !0,
                    30: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2024: {
                1: {
                    1: !0
                },
                2: {
                    9: !0,
                    10: !0,
                    11: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    15: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    16: !0,
                    17: !0,
                    18: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2025: {
                1: {
                    1: !0,
                    29: !0,
                    30: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                10: {
                    3: !0,
                    5: !0,
                    6: !0,
                    7: !0
                },
                12: {
                    25: !0
                }
            },
            2026: {
                1: {
                    1: !0
                },
                2: {
                    17: !0,
                    18: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    24: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    24: !0,
                    25: !0,
                    26: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2027: {
                1: {
                    1: !0
                },
                2: {
                    6: !0,
                    7: !0,
                    8: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    13: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    14: !0,
                    15: !0,
                    16: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            },
            2028: {
                1: {
                    1: !0,
                    26: !0,
                    27: !0,
                    28: !0
                },
                3: {
                    1: !0
                },
                5: {
                    2: !0,
                    5: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                10: {
                    2: !0,
                    3: !0,
                    4: !0
                },
                12: {
                    25: !0
                }
            },
            2029: {
                1: {
                    1: !0
                },
                2: {
                    13: !0,
                    14: !0
                },
                3: {
                    1: !0
                },
                5: {
                    5: !0,
                    20: !0
                },
                6: {
                    6: !0
                },
                8: {
                    15: !0
                },
                9: {
                    21: !0,
                    22: !0,
                    23: !0
                },
                10: {
                    3: !0
                },
                12: {
                    25: !0
                }
            }
        },
        $init: function(a, b) {
            this._assignElement(),
                this._assignEvent();
            var c = {
                nYear: b.nYear,
                nMonth: b.nMonth,
                nDate: b.nDate
            };
            if (this._oFromDate = {
                    nYear: b.oFromDate.nYear,
                    nMonth: b.oFromDate.nMonth,
                    nDate: b.oFromDate.nDate
                },
                    this._oToDate = {
                        nYear: b.oToDate.nYear,
                        nMonth: b.oToDate.nMonth,
                        nDate: b.oToDate.nDate
                    },
                    this.setToday(c.nYear, c.nMonth, c.nDate),
                null  != b.oShowDate.nYear) {
                var d = b.oShowDate;
                this._setShownDate(d.nYear, d.nMonth),
                    this.draw(null , null , !0)
            } else
                this.draw();
            this._sHeader = "_flight_section" == pc.naver.search.config.elSectionClass ? "fly_" : "",
                this._onDeactivate(),
                this._onActivate()
        },
        _assignElement: function() {
            var a = (this.option("sClassPrefix"),
                this.getBaseElement());
            this._welTBody = $Element($$.getSingle(".tb_body", a))
        },
        _assignEvent: function() {
            this._fClickSelectDate = $Fn(this._onClickSelectDate, this).bind(),
            this.elBtnPrevMonth && this.wfPrevMonth.detach(this.elBtnPrevMonth, "click"),
            this.elBtnNextMonth && this.wfNextMonth.detach(this.elBtnNextMonth, "click"),
                this.wfPrevMonth = jindo.$Fn(function(a) {
                    a.stop(jindo.$Event.CANCEL_DEFAULT),
                        this.draw(0, -1, !0),
                        this._sendClickCr(a, "prevMonth")
                }, this),
                this.wfNextMonth = jindo.$Fn(function(a) {
                    a.stop(jindo.$Event.CANCEL_DEFAULT),
                        this.draw(0, 1, !0),
                        this._sendClickCr(a, "nextMonth")
                }, this)
        },
        setDates: function(a) {
            this._sTab = a.sTab,
                this._oneDate = a.oneDate,
                this._twoDate = a.twoDate,
                this._threeDate = a.threeDate,
                this._fireEvent()
        },
        _onClickSelectDate: function(a) {
            var b = $Element(a.element);
            if (!b.hasClass(this.option("sClassPrefix") + "unselectable")) {
                var c = b.attr(this._dateAttrName);
                if ("one" == this._sOrder) {
                    if (this._oneDate = c,
                        null  != this._twoDate) {
                        var d = this._compFutureDate(this._oneDate, this._twoDate);
                        1 == d && (this._twoDate = null )
                    }
                    if (null  != this._threeDate) {
                        var d = this._compFutureDate(this._oneDate, this._threeDate);
                        1 == d && (this._twoDate = null ,
                            this._threeDate = null )
                    }
                } else if ("two" == this._sOrder) {
                    if (this._twoDate = c,
                        null  != this._oneDate) {
                        var e = this._compPastDate(this._twoDate, this._oneDate);
                        if (1 == e)
                            return
                    }
                    if (null  != this._threeDate) {
                        var d = this._compFutureDate(this._twoDate, this._threeDate);
                        1 == d && (this._threeDate = null )
                    }
                } else if ("three" == this._sOrder) {
                    if (this._threeDate = c,
                        null  != this._oneDate) {
                        var e = this._compPastDate(this._threeDate, this._oneDate);
                        if (1 == e)
                            return
                    }
                    if (null  != this._twoDate) {
                        var e = this._compPastDate(this._threeDate, this._twoDate);
                        if (1 == e)
                            return
                    }
                }
                this._fireEvent(),
                    this.draw(0, 0, !0),
                    this._sendClickCr(a, "date")
            }
        },
        showCalendar: function(a) {
            if (this._sTab = a.sTab,
                    this._sOrder = a.sOrder,
                    "OW" == this._sTab ? this._twoDate = null  : "RT" == this._sTab ? this._threeDate = null  : "MD" == this._sTab,
                "one" == this._sOrder && null  != this._oneDate) {
                var b = this._oneDate.split(".");
                this._setShownDate(b[0], b[1])
            } else if ("two" == this._sOrder && null  != this._twoDate) {
                var b = this._twoDate.split(".");
                this._setShownDate(b[0], b[1])
            } else if ("three" == this._sOrder && null  != this._threeDate) {
                var b = this._threeDate.split(".");
                this._setShownDate(b[0], b[1])
            }
            this.draw(null , null , !0)
        },
        changeTab: function(a, b) {
            this._sTab = a,
                "OW" == a ? (this._twoDate = null ,
                    this._threeDate = null ) : "RT" == a ? this._threeDate = null  : "MD" == a && (this._threeDate = null ),
                1 == b ? this.changeDomestic("MD" == a ? !1 : !0) : 0 == b && this.changeDomestic(!1)
        },
        draw: function(a, b, c) {
            var d = this.option("sClassPrefix")
                , e = this.getDate()
                , f = this._getShownDate();
            if (f && "undefined" != typeof c && c) {
                var g = this.getRelativeDate(a, b, 0, f);
                a = g.nYear,
                    b = g.nMonth
            } else
                "undefined" == typeof a && "undefined" == typeof b && "undefined" == typeof c ? (a = e.nYear,
                    b = e.nMonth) : (a = a || f.nYear,
                    b = b || f.nMonth);
            if (this.fireEvent("beforeDraw", {
                    nYear: a,
                    nMonth: b
                })) {
                this.elTitle && this._setCalendarTitle(a, b),
                this.elTitleYear && this._setCalendarTitle(a, b, "year"),
                this.elTitleMonth && this._setCalendarTitle(a, b, "month"),
                    this._clear(jindo.Calendar.getWeeks(a, b)),
                    this._setShownDate(a, b);
                var h, i, j, k, l, m, n, o, p, q = this.getToday(), r = this.getFirstDay(a, b), s = this.getLastDay(a, b), t = this.getLastDate(a, b), u = 0, v = this.getRelativeDate(0, -1, 0, {
                    nYear: a,
                    nMonth: b,
                    nDate: 1
                }), w = this.getRelativeDate(0, 1, 0, {
                    nYear: a,
                    nMonth: b,
                    nDate: 1
                }), x = this.getLastDate(v.nYear, v.nMonth), y = [], z = this.getWeeks(a, b);
                for (p = 0; z > p; p++)
                    o = this.elWeekTemplate.cloneNode(!0),
                        jindo.$Element(o).appendTo(this.elWeekAppendTarget),
                        this._aWeekElement.push(o);
                if (this._aDateElement = jindo.$$("." + d + "date", this.elWeekAppendTarget),
                        this._aDateContainerElement = jindo.$$("." + d + "week > *", this.elWeekAppendTarget),
                    r > 0)
                    for (p = x - r; x > p; p++)
                        y.push(p + 1);
                for (p = 1; t + 1 > p; p++)
                    y.push(p);
                for (n = y.length - 1,
                         p = 1; 7 - s > p; p++)
                    y.push(p);
                for (p = 0; p < y.length; p++) {
                    h = !1,
                        i = !1,
                        j = jindo.$Element(this._aDateContainerElement[p]),
                        k = a,
                        l = b,
                        r > p ? (h = !0,
                            j.addClass(d + "prev-mon"),
                            k = v.nYear,
                            l = v.nMonth) : p > n ? (i = !0,
                            j.addClass(d + "next-mon"),
                            k = w.nYear,
                            l = w.nMonth) : (k = a,
                            l = b),
                    0 === u && j.addClass(d + "sun"),
                    6 == u && j.addClass(d + "sat"),
                    k == q.nYear && 1 * l == q.nMonth && y[p] == q.nDate && null  == this._oneDate && null  == this._twoDate && null  == this._threeDate && j.addClass(d + "today"),
                        j.attr(this._dateAttrName, k + "." + 1 * l + "." + y[p]);
                    var A = {
                        nYear: parseInt(k, 10),
                        nMonth: 1 * l,
                        nDate: y[p]
                    };
                    if (null  != this._oToDate) {
                        var B = this.isBetween(A, this._oFromDate, this._oToDate);
                        0 == B && j.addClass(d + "unselectable")
                    }
                    if ("two" == this._sOrder && null  != this._oneDate) {
                        var C = this.isPast(A, this._getDateStr2Obj(this._oneDate));
                        C && j.addClass(d + "unselectable")
                    }
                    if ("three" == this._sOrder) {
                        var D = null ;
                        if (null  != this._oneDate && (D = this._oneDate),
                            null  != this._twoDate && (D = this._twoDate),
                            null  != D) {
                            var C = this.isPast(A, this._getDateStr2Obj(D));
                            C && j.addClass(d + "unselectable")
                        }
                    }
                    var E = A.nYear.toString()
                        , F = A.nMonth.toString()
                        , G = A.nDate.toString();
                    this.oHoliday[E] && this.oHoliday[E][F] && this.oHoliday[E][F][G] && (0 == j.hasClass(d + "unselectable") && 0 == j.hasClass(d + "next-mon") && 0 == j.hasClass(d + "prev-mon") && j.addClass(d + "holiday"),
                    j.hasClass(d + "sat") && j.removeClass(d + "sat"));
                    var H = null
                        , I = null ;
                    if (null  != this._oneDate && null  != this._twoDate && null  == this._threeDate ? (H = this._oneDate,
                            I = this._twoDate) : null  != this._oneDate && null  == this._twoDate && null  != this._threeDate ? (H = this._oneDate,
                            I = this._threeDate) : null  == this._oneDate && null  != this._twoDate && null  != this._threeDate ? (H = this._twoDate,
                            I = this._threeDate) : null  != this._oneDate && null  != this._twoDate && null  != this._threeDate && (H = this._oneDate,
                            I = this._threeDate),
                        null  != H && null  != I) {
                        var J = this._checkGap(A, H, I);
                        if (1 == J) {
                            var K = A.nYear + "." + A.nMonth + "." + A.nDate;
                            this._twoDate != K && j.addClass(d + "gap")
                        }
                    }
                    m = {
                        elDate: this._aDateElement[p],
                        elDateContainer: j.$value(),
                        nYear: k,
                        nMonth: l,
                        nDate: y[p],
                        bPrevMonth: h,
                        bNextMonth: i,
                        sHTML: y[p]
                    };
                    var L = '<a href="javascript:;">' + m.sHTML.toString() + "</a>";
                    jindo.$Element(m.elDate).html(L),
                        this._aMetaData.push({
                            nYear: k,
                            nMonth: l,
                            nDate: y[p]
                        }),
                        u = (u + 1) % 7,
                        this.fireEvent("draw", m)
                }
                if (this._welTBody) {
                    var M = this._welTBody.query("td[" + this._dateAttrName + "=" + this._oneDate + "]");
                    if (M) {
                        var N = $Element(M);
                        N.removeClass(d + "selected"),
                            N.removeClass(d + "dim")
                    }
                    var O = this._welTBody.query("td[" + this._dateAttrName + "=" + this._twoDate + "]");
                    if (O) {
                        var P = $Element(O);
                        P.removeClass(d + "selected"),
                            P.removeClass(d + "dim")
                    }
                    var Q = this._welTBody.query("td[" + this._dateAttrName + "=" + this._threeDate + "]");
                    if (Q) {
                        var R = $Element(Q);
                        R.removeClass(d + "selected"),
                            R.removeClass(d + "dim")
                    }
                    if ("OW" == this._sTab) {
                        var M = this._welTBody.query("td[" + this._dateAttrName + "=" + this._oneDate + "]");
                        if (M) {
                            var N = $Element(M);
                            N.addClass(d + "selected")
                        }
                    } else if ("RT" == this._sTab) {
                        var M = this._welTBody.query("td[" + this._dateAttrName + "=" + this._oneDate + "]");
                        if (M) {
                            var N = $Element(M);
                            N.addClass("one" == this._sOrder ? d + "selected" : d + "dim")
                        }
                        var O = this._welTBody.query("td[" + this._dateAttrName + "=" + this._twoDate + "]");
                        if (O) {
                            var P = $Element(O);
                            P.addClass("two" == this._sOrder ? d + "selected" : d + "dim")
                        }
                    } else if ("MD" == this._sTab) {
                        var M = this._welTBody.query("td[" + this._dateAttrName + "=" + this._oneDate + "]");
                        if (M) {
                            var N = $Element(M);
                            N.addClass("one" == this._sOrder ? d + "selected" : d + "dim")
                        }
                        var O = this._welTBody.query("td[" + this._dateAttrName + "=" + this._twoDate + "]");
                        if (O) {
                            var P = $Element(O);
                            P.addClass("two" == this._sOrder ? d + "selected" : d + "dim")
                        }
                        var Q = this._welTBody.query("td[" + this._dateAttrName + "=" + this._threeDate + "]");
                        if (Q) {
                            var R = $Element(Q);
                            R.addClass("three" == this._sOrder ? d + "selected" : d + "dim")
                        }
                    }
                }
                this.fireEvent("afterDraw", {
                    nYear: a,
                    nMonth: b
                })
            }
        },
        _checkGap: function(a, b, c) {
            var d = b.split(".")
                , e = c.split(".")
                , f = new Date(a.nYear,a.nMonth - 1,a.nDate).getTime()
                , g = new Date(parseInt(d[0], 10),parseInt(d[1], 10) - 1,parseInt(d[2])).getTime()
                , h = new Date(parseInt(e[0], 10),parseInt(e[1], 10) - 1,parseInt(e[2])).getTime();
            return f > g && h > f ? !0 : !1
        },
        changeDomestic: function(a) {
            if (0 == a) {
                var b = {
                    nYear: parseInt(this._htToday.nYear),
                    nMonth: parseInt(this._htToday.nMonth),
                    nDate: parseInt(this._htToday.nDate)
                }
                    , c = b.nYear + "." + b.nMonth + "." + b.nDate;
                c == this._oneDate && (this._oneDate = null ),
                c == this._twoDate && (this._twoDate = null ),
                c == this._threeDate && (this._threeDate = null ),
                    this._changeFromDate("+1"),
                    this._fireEvent()
            } else
                1 == a && this._changeFromDate("0")
        },
        _changeFromDate: function(a) {
            var b = {
                nYear: parseInt(this._htToday.nYear),
                nMonth: parseInt(this._htToday.nMonth),
                nDate: parseInt(this._htToday.nDate)
            };
            if ("+1" == a) {
                var c = new Date(b.nYear,b.nMonth - 1,b.nDate);
                c.setTime(c.getTime() + 864e5),
                    this._oFromDate = {
                        nYear: c.getFullYear(),
                        nMonth: c.getMonth() + 1,
                        nDate: c.getDate()
                    }
            } else
                "0" == a && (this._oFromDate = {
                    nYear: b.nYear,
                    nMonth: b.nMonth,
                    nDate: b.nDate
                })
        },
        getSelectedOption: function() {
            return {
                sdate1: this._changeSendData(this._oneDate),
                sdate2: this._changeSendData(this._twoDate),
                sdate3: this._changeSendData(this._threeDate)
            }
        },
        _changeSendData: function(a) {
            if (null  == a || "" == a)
                return null ;
            var b = a.split(".")
                , c = parseInt(b[1], 10)
                , d = parseInt(b[2], 10)
                , e = c.toString()
                , f = d.toString();
            return 10 > c && (e = "0" + c),
            10 > d && (f = "0" + d),
            b[0] + "" + e + f
        },
        _changeForDate: function(a) {
            if (null  != a && "" != a) {
                var b = a.split(".")
                    , c = parseInt(b[1], 10)
                    , d = parseInt(b[2], 10)
                    , e = c.toString()
                    , f = d.toString();
                return 10 > c && (e = "0" + c),
                10 > d && (f = "0" + d),
                b[0] + "." + e + "." + f
            }
        },
        _setCalendarTitle: function(a, b, c) {
            10 > b && (b = ("0" + 1 * b).toString());
            var d, e = this.elTitle, f = this.option("sTitleFormat");
            if ("undefined" != typeof c)
                switch (c) {
                    case "year":
                        e = this.elTitleYear,
                            f = this.option("sYearTitleFormat"),
                            d = f.replace(/yyyy/g, a).replace(/y/g, a.toString().substr(2, 2));
                        break;
                    case "month":
                        e = this.elTitleMonth,
                            f = this.option("sMonthTitleFormat"),
                            d = f.replace(/mm/g, b).replace(/m/g, 1 * b).replace(/M/g, this.option("aMonthTitle")[b - 1])
                }
            else
                d = f.replace(/yyyy/g, a).replace(/y/g, a.toString().substr(2, 2)).replace(/mm/g, b).replace(/m/g, 1 * b).replace(/M/g, this.option("aMonthTitle")[b - 1]);
            d += ".";
            for (var g = [], h = 0; h < d.length; h++) {
                var i = d.charAt(h);
                if ("." == i)
                    var j = '<span class="flight_cla_gap sp_calendar_num sp_calendar_num_gap">.</span>';
                else
                    var j = '<span class="sp_calendar_num sp_calendar_num_' + i + " flight_cla_" + i + '">' + i + "</span>";
                g.push(j)
            }
            jindo.$Element(e).html(g.join(""))
        },
        _fireEvent: function() {
            var a = {
                sTab: this._sTab,
                sOrder: this._sOrder,
                oneDate: this._changeForDate(this._oneDate),
                twoDate: this._changeForDate(this._twoDate),
                threeDate: this._changeForDate(this._threeDate)
            };
            this.fireEvent("onClickSelectDate", a)
        },
        _getDateStr2Obj: function(a) {
            var b = a.split(".");
            return {
                nYear: parseInt(b[0], 10),
                nMonth: parseInt(b[1], 10),
                nDate: parseInt(b[2], 10)
            }
        },
        _sendClickCr: function(a, b) {
            var c = ""
                , d = "";
            "OW" == this._sTab ? (c = this._sHeader + "one",
            "one" == this._sOrder && ("prevMonth" == b ? d = "scprevmonth" : "nextMonth" == b ? d = "scnextmonth" : "date" == b && (d = "scdate"))) : "RT" == this._sTab ? (c = this._sHeader + "rnd",
                "one" == this._sOrder ? "prevMonth" == b ? d = "dprevmonth" : "nextMonth" == b ? d = "dnextmonth" : "date" == b && (d = "dcalendar") : "two" == this._sOrder && ("prevMonth" == b ? d = "rprevmonth" : "nextMonth" == b ? d = "rnextmonth" : "date" == b && (d = "rcalendar"))) : "MD" == this._sTab && (c = this._sHeader + "mul",
                "one" == this._sOrder ? "prevMonth" == b ? d = "dprevmonth1" : "nextMonth" == b ? d = "dnextmonth1" : "date" == b && (d = "dcalendar1") : "two" == this._sOrder ? "prevMonth" == b ? d = "dprevmonth2" : "nextMonth" == b ? d = "dnextmonth2" : "date" == b && (d = "dcalendar2") : "three" == this._sOrder && ("prevMonth" == b ? d = "dprevmonth3" : "nextMonth" == b ? d = "dnextmonth3" : "date" == b && (d = "dcalendar3"))),
                "_flight_section" == pc.naver.search.config.elSectionClass ? tCR("a=" + c + "." + d + "&r=1&i=" + pc.naver.search.config.GDID) : clickcr(a.element, c + "." + d, "", "", a._event)
        },
        isBetween: function(a, b, c) {
            var d = this.getDateObject(b).getTime()
                , e = this.getDateObject(c).getTime()
                , f = this.getDateObject(a).getTime();
            return f >= d && e >= f ? !0 : !1
        },
        isFuture: function(a, b) {
            return this.getTime(a) > this.getTime(b) ? !0 : !1
        },
        isPast: function(a, b) {
            return this.getTime(a) < this.getTime(b) ? !0 : !1
        },
        _compFutureDate: function(a, b) {
            var c = a.split(".")
                , d = b.split(".")
                , e = new Date(c[0],c[1],c[2]).getTime()
                , f = new Date(d[0],d[1],d[2]).getTime();
            return e > f ? !0 : !1
        },
        _compPastDate: function(a, b) {
            var c = a.split(".")
                , d = b.split(".")
                , e = new Date(c[0],c[1],c[2]).getTime()
                , f = new Date(d[0],d[1],d[2]).getTime();
            return f > e ? !0 : !1
        },
        getTime: function(a) {
            return this.getDateObject(a).getTime()
        },
        getDateObject: function(a) {
            return 3 == arguments.length ? new Date(arguments[0],arguments[1] - 1,arguments[2]) : new Date(a.nYear,a.nMonth - 1,a.nDate)
        },
        getRelativeDate: function(a, b, c, d) {
            var e = jindo.$Date(new Date(d.nYear,d.nMonth,d.nDate))
                , f = {
                1: 31,
                2: 28,
                3: 31,
                4: 30,
                5: 31,
                6: 30,
                7: 31,
                8: 31,
                9: 30,
                10: 31,
                11: 30,
                12: 31
            };
            return e.isLeapYear() && (f = {
                1: 31,
                2: 29,
                3: 31,
                4: 30,
                5: 31,
                6: 30,
                7: 31,
                8: 31,
                9: 30,
                10: 31,
                11: 30,
                12: 31
            }),
            f[d.nMonth] == d.nDate && (d.nDate = f[d.nMonth + b]),
                this.getDateHashTable(new Date(parseInt(d.nYear, 10) + a,d.nMonth + b - 1,d.nDate + c))
        },
        getDateHashTable: function(a) {
            return 3 == arguments.length ? {
                nYear: arguments[0],
                nMonth: arguments[1],
                nDate: arguments[2]
            } : (arguments.length <= 1 && (a = a || new Date),
            {
                nYear: a.getFullYear(),
                nMonth: a.getMonth() + 1,
                nDate: a.getDate()
            })
        },
        setToday: function(a, b, c) {
            return this._htToday || (this._htToday = {}),
                this._htToday.nYear = a,
                this._htToday.nMonth = b,
                this._htToday.nDate = c,
                this
        },
        getToday: function() {
            var a = this._htToday || this.getDateHashTable(new Date);
            return {
                nYear: a.nYear,
                nMonth: a.nMonth,
                nDate: a.nDate
            }
        },
        getFirstDay: function(a, b) {
            return new Date(a,b - 1,1).getDay()
        },
        getLastDay: function(a, b) {
            return new Date(a,b,0).getDay()
        },
        getLastDate: function(a, b) {
            return new Date(a,b,0).getDate()
        },
        getWeeks: function(a, b) {
            var c = this.getFirstDay(a, b)
                , d = this.getLastDate(a, b);
            return Math.ceil((c + d) / 7)
        },
        isValidDate: function(a, b, c) {
            return 12 >= b && c <= this.getLastDate(a, b) ? !0 : !1
        },
        isSameDate: function(a, b) {
            return this.getTime(a) == this.getTime(b) ? !0 : !1
        },
        _onActivate: function() {
            this.elBtnPrevYear && this.wfPrevYear.attach(this.elBtnPrevYear, "click"),
            this.elBtnPrevMonth && this.wfPrevMonth.attach(this.elBtnPrevMonth, "click"),
            this.elBtnNextMonth && this.wfNextMonth.attach(this.elBtnNextMonth, "click"),
            this.elBtnNextYear && this.wfNextYear.attach(this.elBtnNextYear, "click"),
            this._welTBody && this._welTBody.delegate("click", "td", this._fClickSelectDate)
        },
        _onDeactivate: function() {
            this.elBtnPrevYear && this.wfPrevYear.detach(this.elBtnPrevYear, "click"),
            this.elBtnPrevMonth && this.wfPrevMonth.detach(this.elBtnPrevMonth, "click"),
            this.elBtnNextMonth && this.wfNextMonth.detach(this.elBtnNextMonth, "click"),
            this.elBtnNextYear && this.wfNextYear.detach(this.elBtnNextYear, "click"),
            this._welTBody && this._welTBody.undelegate("click", "td", this._fClickSelectDate)
        }
    }).extend(jindo.Calendar),
    pc.naver.search.PeopleSeat = jindo.$Class({
        _config: null ,
        _welSection: null ,
        _welIsDomestic: !1,
        _welTotalNum: 1,
        _welAdultNum: 1,
        _welChildNum: 0,
        _welBabyNum: 0,
        _seatType: "일반석",
        $init: function() {
            this._config = pc.naver.search.config,
                "_flight_filter" == this._config.elSectionClass ? (this._welTotalNum = this._config.flightData.total,
                    this._welAdultNum = this._config.flightData.adult,
                    this._welChildNum = this._config.flightData.child,
                    this._welBabyNum = this._config.flightData.baby,
                    this._seatType = this._config.flightData.seat) : "_flight_section" == this._config.elSectionClass && (this._seatType = 1 == this._config.flightData.isDomestic || "1" == this._config.flightData.isDomestic ? "전체" : "일반석"),
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            var a = $Element(document.body).query("div." + this._config.elSectionClass);
            this._welSection = $Element(a),
                this._flightHeader = $Element(this._welSection.query("div.flight_header")),
                this._navigation = $Element(this._welSection.query("ul.navigation_list")),
                this._memberSelect = $Element(this._welSection.query("div.member_select")),
                this._memberTextArea = $Element(this._memberSelect.query("p")),
                this._memberAlert = $Element(this._memberSelect.query("p.dsc_alert")),
                this._seatSelect = $Element(this._welSection.query("div.seat_select")),
                this._domLayer = $Element(this._seatSelect.query("div._dom")),
                this._interLayer = $Element(this._seatSelect.query("div._inter")),
                this._seatTextArea = $Element(this._seatSelect.query("p"))
        },
        _assignEvent: function() {
            this._memberSelect.delegate("click", ".clk", $Fn(this._onClickSelect, this).bind()),
                this._memberSelect.delegate("click", ".p_btn", $Fn(this._onClickPeopleCntBtn, this).bind()),
                this._seatSelect.delegate("click", ".clk", $Fn(this._onClickSelect, this).bind()),
                this._seatSelect.delegate("click", ".s_btn", $Fn(this._onClickSeatBtn, this).bind()),
                $Fn(this._onClickOuter, this).attach($Element(document.body), "click")
        },
        getSelectedOption: function() {
            var a = {};
            a.total = this._welTotalNum,
                a.adult = this._welAdultNum,
                a.child = this._welChildNum,
                a.baby = this._welBabyNum,
                a.seatK = this._seatType;
            var b = "";
            return "일반석" == this._seatType ? b = "Y" : "비즈니스석" == this._seatType ? b = "C" : "일등석" == this._seatType ? b = "F" : "전체" == this._seatType ? b = "YC" : "일반석/할인석" == this._seatType && (b = "Y"),
                a.seat = b,
                a
        },
        setData: function(a, b, c, d, e) {
            var f = "";
            f = "0" == a || 0 == a ? !1 : !0,
                this.setIsDomestic(f),
                this._welTotalNum = parseInt(b) + parseInt(c) + parseInt(d),
                this._welAdultNum = b,
                this._welChildNum = c,
                this._welBabyNum = d,
                "Y" == e ? this._seatType = "0" == a || 0 == a ? "일반석" : "일반석/할인석" : "C" == e ? this._seatType = "비즈니스석" : "F" == e ? this._seatType = "일등석" : "YC" == e && (this._seatType = "전체");
            var g = "";
            1 == this._welTotalNum ? g = "성인 1명" : this._welAdultNum > 0 && this._welChildNum > 0 && this._welBabyNum > 0 ? g = "승객 " + this._welTotalNum + "명" : (g = "성인 " + this._welAdultNum + "명",
                this._welChildNum > 0 ? g += ", 소아 " + this._welChildNum + "명" : this._welBabyNum > 0 && (g += ", 유아 " + this._welBabyNum + "명")),
                this._memberTextArea.html(g),
                $Element(this._memberSelect.query("div.adult_cnt")).html(this._welAdultNum),
                $Element(this._memberSelect.query("div.child_cnt")).html(this._welChildNum),
                $Element(this._memberSelect.query("div.baby_cnt")).html(this._welBabyNum),
                this._seatTextArea.html(this._seatType),
                1 == a || 1 == a ? ($Element(this._domLayer.query("a.btn_ly_seat_on")).removeClass("btn_ly_seat_on"),
                    "전체" == this._seatType ? $Element(this._domLayer.query("a.type_yc")).addClass("btn_ly_seat_on") : "일반석/할인석" == this._seatType ? $Element(this._domLayer.query("a.type_dy")).addClass("btn_ly_seat_on") : "비즈니스석" == this._seatType && $Element(this._domLayer.query("a.type_dc")).addClass("btn_ly_seat_on")) : ($Element(this._interLayer.query("a.btn_ly_seat_on")).removeClass("btn_ly_seat_on"),
                    "일반석" == this._seatType ? $Element(this._interLayer.query("a.type_y")).addClass("btn_ly_seat_on") : "비즈니스석" == this._seatType ? $Element(this._interLayer.query("a.type_c")).addClass("btn_ly_seat_on") : "일등석" == this._seatType && $Element(this._interLayer.query("a.type_f")).addClass("btn_ly_seat_on"))
        },
        _onClickSelect: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = $Element(c.parent());
            d.hasClass("member_select") ? this._sendClickCr(a, "passengers") : d.hasClass("seat_select") && this._sendClickCr(a, "class"),
                d.hasClass("flight_select_on") ? this._hideLayer() : (this._hideLayer(),
                    this._showLayer(c))
        },
        _onClickPeopleCntBtn: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = $Element(c.parent())
                , e = $Element($Element(d.parent().parent().parent()).query("p._alert"))
                , f = $Element(d.query(".p_cnt"))
                , g = c.html()
                , h = d.attr("data-type")
                , i = parseInt(f.html());
            if (e.css("display", "none"),
                "인원 추가" == g) {
                if ("adult" == h ? this._sendClickCr(a, "adultplus") : "child" == h ? this._sendClickCr(a, "kidplus") : "baby" == h && this._sendClickCr(a, "babyplus"),
                        !(this._welTotalNum < 9))
                    return e.html("승객은 최대 9명까지 조회할 수 있습니다."),
                        void e.css("display", "block");
                if ("adult" == h)
                    this._welAdultNum++;
                else if ("child" == h)
                    this._welChildNum++;
                else if ("baby" == h) {
                    if (this._welBabyNum > this._welAdultNum - 1)
                        return e.html("유아는 성인 1명당 1명까지 탑승할 수 있습니다."),
                            void e.css("display", "block");
                    this._welBabyNum++
                }
                this._welTotalNum++,
                    f.html(i + 1)
            } else if ("인원 감소" == g && ("adult" == h ? this._sendClickCr(a, "adultminus") : "child" == h ? this._sendClickCr(a, "kidminus") : "baby" == h && this._sendClickCr(a, "babyminus"),
                i > 0)) {
                if ("adult" == h) {
                    if (1 == this._welAdultNum)
                        return;
                    if (this._welAdultNum == this._welBabyNum)
                        return e.html("유아는 성인 1명당 1명까지 탑승할 수 있습니다."),
                            void e.css("display", "block");
                    this._welAdultNum--
                } else
                    "child" == h ? this._welChildNum-- : "baby" == h && this._welBabyNum--;
                this._welTotalNum--,
                    f.html(i - 1)
            }
            var j = "";
            this._welAdultNum > 0 && this._welChildNum > 0 && this._welBabyNum > 0 ? j = "승객 " + this._welTotalNum + "명" : (j = "성인 " + this._welAdultNum + "명",
                this._welChildNum > 0 ? j += ", 소아 " + this._welChildNum + "명" : this._welBabyNum > 0 && (j += ", 유아 " + this._welBabyNum + "명")),
                this._memberTextArea.html(j)
        },
        _onClickSeatBtn: function(a) {
            for (var b = a.element, c = $Element(b), d = c.text(), e = c.parent().parent().queryAll("a"), f = 0; e.length > f; f++)
                "_flight_section" == this._config.elSectionClass ? $Element(e[f]).removeClass("flight_ly_btn_seat_on") : "_flight_filter" == this._config.elSectionClass && $Element(e[f]).removeClass("btn_ly_seat_on");
            "_flight_section" == this._config.elSectionClass ? c.addClass("flight_ly_btn_seat_on") : "_flight_filter" == this._config.elSectionClass && c.addClass("btn_ly_seat_on"),
                "일반석" == d ? this._sendClickCr(a, "ieconomy") : "비즈니스석" == d ? c.hasClass("type_dc") ? this._sendClickCr(a, "dbusiness") : c.hasClass("type_c") && this._sendClickCr(a, "ibusiness") : "일등석" == d ? this._sendClickCr(a, "ifirst") : "전체" == d ? this._sendClickCr(a, "dall") : "일반석/할인석" == d && this._sendClickCr(a, "ddiscount"),
                this._seatType = d,
                this._seatTextArea.html(d),
                this._hideLayer()
        },
        _onClickOuter: function(a) {
            {
                var b = a.element
                    , c = $Element(b)
                    , d = $Element(c.parent());
                $Element(this._welSection.query("div.flight_select_on"))
            }
            null  != d && (d.hasClass("member_select") || d.hasClass("seat_select") || d.hasClass("btn_ly_person") || d.hasClass("flight_ly_btn_person")) || this._hideLayer()
        },
        setIsDomestic: function(a) {
            if (a) {
                if (this._domLayer.addClass("_target_layer"),
                        this._interLayer.removeClass("_target_layer"),
                    "_flight_section" == this._config.elSectionClass) {
                    var b = $Element(this._domLayer.query("a.flight_ly_btn_seat_on")).text();
                    this._seatType = b,
                        this._seatTextArea.html(b)
                } else if ("_flight_filter" == this._config.elSectionClass) {
                    var b = $Element(this._domLayer.query("a.btn_ly_seat_on")).text();
                    this._seatType = b,
                        this._seatTextArea.html(b)
                }
            } else if (this._domLayer.removeClass("_target_layer"),
                    this._interLayer.addClass("_target_layer"),
                "_flight_section" == this._config.elSectionClass) {
                var b = $Element(this._interLayer.query("a.flight_ly_btn_seat_on")).text();
                this._seatType = b,
                    this._seatTextArea.html(b)
            } else if ("_flight_filter" == this._config.elSectionClass) {
                var b = $Element(this._interLayer.query("a.btn_ly_seat_on")).text();
                this._seatTextArea.html(b),
                    this._seatType = b
            }
        },
        _showLayer: function(a) {
            var b = $Element(a.parent())
                , c = $Element(b.query("div._target_layer"));
            b.addClass("flight_select_on"),
                c.css("display", "block")
        },
        _hideLayer: function() {
            for (var a = this._welSection.queryAll(".flight_select_on"), b = 0; b < a.length; b++) {
                var c = $Element(a[b]);
                c.hasClass("_departure_date_select_area") || c.hasClass("_arrival_date_select_area") || c.hasClass("_date_select_area_0") || c.hasClass("_date_select_area_1") || c.hasClass("_date_select_area_2") || c.removeClass("flight_select_on"),
                null  != c.query("div._target_layer") && $Element(c.query("div._target_layer")).css("display", "none")
            }
        },
        _sendClickCr: function(a, b) {
            var c = ""
                , d = "";
            "_flight_filter" == this._config.elSectionClass ? d = $Element(this._navigation.query("a.lnk_navigation_on span")).text() : "_flight_section" == this._config.elSectionClass && (d = $Element(this._flightHeader.query("a.on")).text(),
                c = "fly_"),
                "편도" == d ? main = "one" : "왕복" == d ? main = "rnd" : "다구간" == d && (main = "mul"),
                "_flight_section" == this._config.elSectionClass ? tCR("a=" + c + main + "." + b + "&r=1&i=" + this._config.GDID) : clickcr(a.element, c + main + "." + b, "", "", a._event)
        }
    }).extend(jindo.UIComponent),
    pc.naver.search.RecentSearch = jindo.$Class({
        _elBase: null ,
        _welRecentSection: null ,
        _welRecentList: null ,
        _listTemplate: ["{for num:item in items}", '<li class="recent_result_item _num_{=num}" data-scity1="{=item.SCITY1}" data-ecity1="{=item.ECITY1}" data-scity2="{=item.SCITY2}" data-ecity2="{=item.ECITY2}" data-scity3="{=item.SCITY3}" data-ecity3="{=item.ECITY3}"', ' data-sdate1="{=item.SDATE1}" data-sdate2="{=item.SDATE2}" data-sdate3="{=item.SDATE3}" data-adult="{=item.Adt}" data-child="{=item.Chd}" data-infant="{=item.Inf}" data-faretype="{=item.FareType}" data-trip="{=item.TRIP}"', ' data-domestic="{=item.is_domestic}" data-stayLength="{=item.StayLength}"', ' data-img-url="{=item.IMG_URL}" data-scityk="{=item.SCITYK}" data-scity2k="{=item.SCITY2K}" data-scity3k="{=item.SCITY3K}" data-ecity1k="{=item.ECITY1K}" data-ecity2k="{=item.ECITY2K}" data-ecityk="{=item.ECITYK}" data-continent="{=item.Continent}">', "<a class=\"lnk_recent_result\" href=\"javascript:;\" onclick=\"clickcr(this, 'lnb.recent{=num+1}', '', '', event);\">", '<span class="thumb_recent"><img class="thumb_image" src="{=item.IMG_URL}=f60_60_round"><span class="sp_flight thumb_mask"></span></span>', '<dl class="recent_box">', '{if item.TRIP == "MD"}', '<dt class="tit_recent"><span class="box_recent">{=item.ECITY1K}<span class="txt_code">{=item.ECITY1}</span></span> ', "{if item.SCITY2K != null && item.SCITY2K.length > 0 && item.ECITY1K != item.SCITY2K}", '<span class="box_recent">{=item.SCITY2K}<span class="txt_code">{=item.SCITY2}</span></span> ', "{/if}", '<span class="box_recent">{=item.ECITY2K}<span class="txt_code">{=item.ECITY2}</span></span>', "{if item.SCITY3K != null && item.SCITY3K.length > 0 && item.ECITY2K != item.SCITY3K}", '<span class="box_recent">{=item.SCITY3K}<span class="txt_code">{=item.SCITY3}</span></span>', "{/if}", "</dt>", "{else}", '<dt class="tit_recent"><span class="box_recent">{=item.ECITYK}<span class="txt_code">{=item.ECITY1}</span></span></dt>', "{/if}", '<dd class="txt_date">{=item.SDATE1}.', "{if item.SDATE2 != null && item.SDATE2.length > 0}", " - {if item.SDATE3 != null && item.SDATE3.length > 0}{=item.SDATE3}.{else}{=item.SDATE2}.{/if}", "{/if}", "</dd>", '<dd class="txt_info">{=item.sTRIP}, 승객{=item.persons}명, {=item.sFareType}</dd>', "</dl>", "</a>", '<a href="javascript:;" class="btn_remove"><span class="sp_flight txt_remove">삭제</span></a>', "</li>", "{/for}"].join(""),
        _wtListTemplate: null ,
        _regexp: null ,
        $init: function(a) {
            this._elBase = a.elBase,
                this._assignElement(),
                this._assignEvent(),
                this._wtListTemplate = $Template(this._listTemplate),
                this._regexp = /[\<\>\"]|script|iframe/
        },
        _assignElement: function() {
            var a = $Element(this._elBase);
            this._welRecentSection = $Element(a.query("div.recent_area")),
                this._welRecentResult = $Element(this._welRecentSection.query("div.recent_result_area")),
                this._welRecentNoResult = $Element(this._welRecentSection.query("div.trip_result_no_result")),
                this._welRecentList = $Element(a.query(".recent_result_list")),
                this._planArea = $Element(a.query("ul.navigation_list"))
        },
        _assignEvent: function() {
            this._welRecentList.delegate("click", ".lnk_recent_result", $Fn(this._onItemClick, this).bind()),
                this._welRecentList.delegate("click", ".btn_remove", $Fn(this._onRemoveClick, this).bind())
        },
        _onItemClick: function(a) {
            var b = $Element(a.element)
                , c = $Element(b.parent())
                , d = {};
            d.SCITY1 = c.attr("data-scity1"),
                d.SCITYK = c.attr("data-scityk"),
                d.ECITY1 = c.attr("data-ecity1"),
                d.ECITY1K = c.attr("data-ecity1k"),
                d.SCITY2 = c.attr("data-scity2"),
                d.SCITY2K = c.attr("data-scity2k"),
                d.ECITY2 = c.attr("data-ecity2"),
                d.ECITY2K = c.attr("data-ecity2k"),
                d.SCITY3 = c.attr("data-scity3"),
                d.SCITY3K = c.attr("data-scity3k"),
                d.ECITY3 = c.attr("data-ecity3"),
                d.ECITYK = c.attr("data-ecityK"),
                d.SDATE1 = c.attr("data-sdate1"),
                d.SDATE2 = c.attr("data-sdate2"),
                d.SDATE3 = c.attr("data-sdate3"),
                d.StayLength = c.attr("data-stayLength"),
                d.TRIP = c.attr("data-trip"),
                d.FareType = c.attr("data-faretype"),
                d.Adt = c.attr("data-adult"),
                d.Chd = c.attr("data-child"),
                d.Inf = c.attr("data-infant"),
                d.is_domestic = c.attr("data-domestic"),
                d.Continent = c.attr("data-continent"),
                this.fireEvent("onClickItem", d)
        },
        _onRemoveClick: function(a) {
            var b = function(a, b) {
                return a.SDATE1 != b.SDATE1 ? !1 : a.SDATE2 != b.SDATE2 ? !1 : a.SDATE3 != b.SDATE3 ? !1 : a.SCITY1 != b.SCITY1 ? !1 : a.SCITY2 != b.SCITY2 ? !1 : a.SCITY3 != b.SCITY3 ? !1 : a.ECITY1 != b.ECITY1 ? !1 : a.ECITY2 != b.ECITY2 ? !1 : a.ECITY3 != b.ECITY3 ? !1 : a.TRIP != b.TRIP ? !1 : a.Adt != b.Adt ? !1 : a.Chd != b.Chd ? !1 : a.Inf != b.Inf ? !1 : a.FareType != b.FareType ? !1 : !0
            }
                , c = $Element(a.element)
                , d = $Element(c.parent())
                , e = {};
            e.SCITY1 = d.attr("data-scity1"),
                e.ECITY1 = d.attr("data-ecity1"),
                e.SCITY2 = d.attr("data-scity2"),
                e.ECITY2 = d.attr("data-ecity2"),
                e.SCITY3 = d.attr("data-scity3"),
                e.ECITY3 = d.attr("data-ecity3"),
                e.SDATE1 = this._makeStringDt(d.attr("data-sdate1")),
                e.SDATE2 = this._makeStringDt(d.attr("data-sdate2")),
                e.SDATE3 = this._makeStringDt(d.attr("data-sdate3")),
                e.TRIP = d.attr("data-trip"),
                e.FareType = d.attr("data-faretype"),
                e.Adt = d.attr("data-adult"),
                e.Chd = d.attr("data-child"),
                e.Inf = d.attr("data-infant");
            var f = localStorage || window.localStorage;
            if (null  !== f) {
                var g = f.getItem("recent")
                    , h = null ;
                h = JSON.parse(g);
                for (var i = 0; i < h.length; i++) {
                    for (var j in h[i])
                        if (/[\<\>\"]|script|iframe/.test(h[i][j]))
                            return void f.setItem("recent", "[]");
                    if (b(h[i], e)) {
                        h.splice(i, 1);
                        break
                    }
                }
                f.setItem("recent", JSON.stringify(h)),
                    this.loadRecentSearch()
            }
        },
        loadRecentSearch: function() {
            var a = []
                , b = []
                , c = localStorage.getItem("recent");
            if (null  != c && "undefined" != typeof c) {
                var d = JSON.parse(c);
                d.length <= 0 ? (this._welRecentResult.$value().style.display = "none",
                    this._welRecentNoResult.$value().style.display = "block") : (this._welRecentResult.$value().style.display = "block",
                    this._welRecentNoResult.$value().style.display = "none");
                for (var e = 0, f = d.length - 1; f >= 0 && 2 > e; f--) {
                    var g = {
                        persons: 0
                    };
                    for (var h in d[f]) {
                        if (this._regexp.test(d[f][h]))
                            return localStorage.setItem("recent", "[]"),
                                this._welRecentResult.$value().style.display = "none",
                                void (this._welRecentNoResult.$value().style.display = "block");
                        "TRIP" === h ? g["s" + h] = "RT" === d[f][h] ? "왕복" : "OW" === d[f][h] ? "편도" : "다구간" : "Adt" === h ? (g["s" + h] = "성인 " + d[f][h] + "명",
                            g.persons = parseInt(d[f][h])) : "Chd" === h && d[f][h] ? (g["s" + h] = "소아 " + d[f][h] + "명",
                            g.persons += parseInt(d[f][h])) : "Inf" === h && d[f][h] ? (g["s" + h] = "유아 " + d[f][h] + "명",
                            g.persons += parseInt(d[f][h])) : "FareType" === h && ("Y" === d[f][h] ? g["s" + h] = 1 == d[f].is_domestic ? "할인/일반석" : "일반석" : "C" === d[f][h] ? g["s" + h] = "비즈니스석" : "F" === d[f][h] ? g["s" + h] = "일등석" : "YC" === d[f][h] && (g["s" + h] = "전체")),
                        ("SDATE1" === h || "SDATE2" === h || "SDATE3" === h) && (d[f][h] = this._makeDtString(d[f][h])),
                            g[h] = d[f][h]
                    }
                    b.push(g),
                        e++
                }
                if (b.length > 0) {
                    for (var i = 0; i < b.length; i++)
                        b[i].clickNum = i + 1;
                    a.push(this._wtListTemplate.process({
                        items: b
                    }))
                }
                this._welRecentList.html(a.join(""));
                var j = $Element(this._planArea.query("a.lnk_navigation_on span")).text();
                "다구간" == j ? null  != this._welRecentList.query("li._num_2") && $Element(this._welRecentList.query("li._num_2")).css("display", "none") : null  != this._welRecentList.query("li._num_2") && $Element(this._welRecentList.query("li._num_2")).css("display", "block")
            } else
                this._welRecentResult.$value().style.display = "none",
                    this._welRecentNoResult.$value().style.display = "block"
        },
        saveRecentSearch: function(a) {
            var b = function(a, b) {
                    return a.SDATE1 != b.SDATE1 ? !1 : a.SDATE2 != b.SDATE2 ? !1 : a.SDATE3 != b.SDATE3 ? !1 : a.SCITY1 != b.SCITY1 ? !1 : a.SCITY2 != b.SCITY2 ? !1 : a.SCITY3 != b.SCITY3 ? !1 : a.ECITY1 != b.ECITY1 ? !1 : a.ECITY2 != b.ECITY2 ? !1 : a.ECITY3 != b.ECITY3 ? !1 : a.TRIP != b.TRIP ? !1 : a.Adt != b.Adt ? !1 : a.Chd != b.Chd ? !1 : a.Inf != b.Inf ? !1 : a.FareType != b.FareType ? !1 : !0
                }
                ;
            if (null  == a.SDATE1 || a.SDATE1.length <= 0)
                return !1;
            if (null  == a.SCITY1 || a.SCITY1.length <= 0)
                return !1;
            if (null  == a.ECITY1 || a.ECITY1.length <= 0)
                return !1;
            if (null  == a.TRIP || a.TRIP.length <= 0)
                return !1;
            if (null  == a.FareType || a.FareType.length <= 0)
                return !1;
            for (g in a)
                if (this._regexp.test(a[g]))
                    return !0;
            var c = localStorage || window.localStorage;
            if (null  !== c) {
                var d = c.getItem("recent")
                    , e = null ;
                if (null  !== d) {
                    e = JSON.parse(d);
                    for (var f = 0; f < e.length; f++) {
                        for (var g in e[f])
                            if (/[\<\>\"]|script|iframe/.test(e[f][g]))
                                return void c.setItem("recent", "[]");
                        if (b(e[f], a)) {
                            e.splice(f, 1);
                            break
                        }
                    }
                } else
                    e = new Array;
                e.length >= 10 && e.splice(0, 1),
                    e.push(a),
                    c.setItem("recent", JSON.stringify(e))
            }
        },
        _makeDtString: function(a) {
            if ("" != a) {
                var b = /^(\d{4})(\d{2})(\d{2})$/g
                    , c = b.exec(a);
                return null  === c || c.length < 4 ? "invalid" : c[1] + "." + c[2] + "." + c[3]
            }
            return ""
        },
        _makeStringDt: function(a) {
            if ("" != a) {
                var b = a.split(".");
                return b[0] + "" + b[1] + b[2]
            }
            return ""
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.AutoCompleteControl = jindo.$Class({
        _config: null ,
        _welSection: null ,
        _oAutoComplete: null ,
        _tabClassOn: "lnk_navigation_on",
        _routeClassOff: "trip_info_route_off",
        _routeClassArea: "trip_info_route",
        $init: function() {
            this._config = pc.naver.search.config,
                this._assignElement(),
                this._assignEvent(),
                this._makeAutoComplete()
        },
        _assignElement: function() {
            var a = $Element(document.body).query("div." + this._config.elSectionClass);
            this._welSection = $Element(a),
                this._awelTabLi = [];
            for (var b = this._welSection.queryAll(".navigation_area ul li a"), c = 0; c < b.length; c++)
                this._awelTabLi.push($Element(b[c]));
            this._welLayerInCity = $Element(this._welSection.query("script._in_city").innerHTML),
                this._welLayerOutCity = $Element(this._welSection.query("script._out_city").innerHTML),
                this._awelDepartureRoute = [],
                this._awelDepartureInput = [],
                this._awelArrivalRoute = [],
                this._awelArrivalInput = [],
                this._awelDepartureListLayer = [],
                this._awelDepartureListCon = [],
                this._awelArrivalListLayer = [],
                this._awelArrivalListCon = [],
                this._awelDepartureArea = [],
                this._awelArrivalArea = [],
                this._elDepartureRoute0 = this._welSection.query("strong._departure_route_0"),
                this._elArrivalRoute0 = this._welSection.query("strong._arrival_route_0"),
                this._elDepartureRoute1 = this._welSection.query("strong._departure_route_1"),
                this._elArrivalRoute1 = this._welSection.query("strong._arrival_route_1"),
                this._elDepartureRoute2 = this._welSection.query("strong._departure_route_2"),
                this._elArrivalRoute2 = this._welSection.query("strong._arrival_route_2"),
                this._elDepartureRoute3 = this._welSection.query("strong._departure_route_3"),
                this._elArrivalRoute3 = this._welSection.query("strong._arrival_route_3"),
                this._awelDepartureRoute.push($Element(this._elDepartureRoute0)),
                this._awelArrivalRoute.push($Element(this._elArrivalRoute0)),
                this._awelDepartureRoute.push($Element(this._elDepartureRoute1)),
                this._awelArrivalRoute.push($Element(this._elArrivalRoute1)),
                this._awelDepartureRoute.push($Element(this._elDepartureRoute2)),
                this._awelArrivalRoute.push($Element(this._elArrivalRoute2)),
                this._awelDepartureRoute.push($Element(this._elDepartureRoute3)),
                this._awelArrivalRoute.push($Element(this._elArrivalRoute3)),
                this._elDepartureInput0 = this._welSection.query("input._departure_input_0"),
                this._elArrivalInput0 = this._welSection.query("input._arrival_input_0"),
                this._elDepartureInput1 = this._welSection.query("input._departure_input_1"),
                this._elArrivalInput1 = this._welSection.query("input._arrival_input_1"),
                this._elDepartureInput2 = this._welSection.query("input._departure_input_2"),
                this._elArrivalInput2 = this._welSection.query("input._arrival_input_2"),
                this._elDepartureInput3 = this._welSection.query("input._departure_input_3"),
                this._elArrivalInput3 = this._welSection.query("input._arrival_input_3"),
                this._awelDepartureInput.push($Element(this._elDepartureInput0)),
                this._awelArrivalInput.push($Element(this._elArrivalInput0)),
                this._awelDepartureInput.push($Element(this._elDepartureInput1)),
                this._awelArrivalInput.push($Element(this._elArrivalInput1)),
                this._awelDepartureInput.push($Element(this._elDepartureInput2)),
                this._awelArrivalInput.push($Element(this._elArrivalInput2)),
                this._awelDepartureInput.push($Element(this._elDepartureInput3)),
                this._awelArrivalInput.push($Element(this._elArrivalInput3)),
                this._elDepartureListLayer0 = this._welSection.query("div._departure_list_layer_0"),
                this._elArrivalListLayer0 = this._welSection.query("div._arrival_list_layer_0"),
                this._elDepartureListLayer1 = this._welSection.query("div._departure_list_layer_1"),
                this._elArrivalListLayer1 = this._welSection.query("div._arrival_list_layer_1"),
                this._elDepartureListLayer2 = this._welSection.query("div._departure_list_layer_2"),
                this._elArrivalListLayer2 = this._welSection.query("div._arrival_list_layer_2"),
                this._elDepartureListLayer3 = this._welSection.query("div._departure_list_layer_3"),
                this._elArrivalListLayer3 = this._welSection.query("div._arrival_list_layer_3"),
                this._awelDepartureListLayer.push($Element(this._elDepartureListLayer0)),
                this._awelArrivalListLayer.push($Element(this._elArrivalListLayer0)),
                this._awelDepartureListLayer.push($Element(this._elDepartureListLayer1)),
                this._awelArrivalListLayer.push($Element(this._elArrivalListLayer1)),
                this._awelDepartureListLayer.push($Element(this._elDepartureListLayer2)),
                this._awelArrivalListLayer.push($Element(this._elArrivalListLayer2)),
                this._awelDepartureListLayer.push($Element(this._elDepartureListLayer3)),
                this._awelArrivalListLayer.push($Element(this._elArrivalListLayer3)),
                this._elDepartureListCon0 = this._welSection.query("ul._departure_list_con_0"),
                this._elArrivalListCon0 = this._welSection.query("ul._arrival_list_con_0"),
                this._elDepartureListCon1 = this._welSection.query("ul._departure_list_con_1"),
                this._elArrivalListCon1 = this._welSection.query("ul._arrival_list_con_1"),
                this._elDepartureListCon2 = this._welSection.query("ul._departure_list_con_2"),
                this._elArrivalListCon2 = this._welSection.query("ul._arrival_list_con_2"),
                this._elDepartureListCon3 = this._welSection.query("ul._departure_list_con_3"),
                this._elArrivalListCon3 = this._welSection.query("ul._arrival_list_con_3"),
                this._awelDepartureListCon.push($Element(this._elDepartureListCon0)),
                this._awelArrivalListCon.push($Element(this._elArrivalListCon0)),
                this._awelDepartureListCon.push($Element(this._elDepartureListCon1)),
                this._awelArrivalListCon.push($Element(this._elArrivalListCon1)),
                this._awelDepartureListCon.push($Element(this._elDepartureListCon2)),
                this._awelArrivalListCon.push($Element(this._elArrivalListCon2)),
                this._awelDepartureListCon.push($Element(this._elDepartureListCon3)),
                this._awelArrivalListCon.push($Element(this._elArrivalListCon3)),
                this._elDepartureArea0 = this._welSection.query("div._departure_area_0"),
                this._elArrivalArea0 = this._welSection.query("div._arrival_area_0"),
                this._elDepartureArea1 = this._welSection.query("div._departure_area_1"),
                this._elArrivalArea1 = this._welSection.query("div._arrival_area_1"),
                this._elDepartureArea2 = this._welSection.query("div._departure_area_2"),
                this._elArrivalArea2 = this._welSection.query("div._arrival_area_2"),
                this._elDepartureArea3 = this._welSection.query("div._departure_area_3"),
                this._elArrivalArea3 = this._welSection.query("div._arrival_area_3"),
                this._awelDepartureArea.push($Element(this._elDepartureArea0)),
                this._awelArrivalArea.push($Element(this._elArrivalArea0)),
                this._awelDepartureArea.push($Element(this._elDepartureArea1)),
                this._awelArrivalArea.push($Element(this._elArrivalArea1)),
                this._awelDepartureArea.push($Element(this._elDepartureArea2)),
                this._awelArrivalArea.push($Element(this._elArrivalArea2)),
                this._awelDepartureArea.push($Element(this._elDepartureArea3)),
                this._awelArrivalArea.push($Element(this._elArrivalArea3)),
                this._welAddRouteBtn = $Element(this._welSection.query("._add_route_btn")),
                this._welRoute3Area = $Element(this._welSection.query("._route_area_3")),
                this._welCalendar3Area = $Element(this._welSection.query("._calendar_area_3")),
                this._welDelRouteBtn = $Element(this._welSection.query("._del_route_btn"))
        },
        _assignEvent: function() {
            this._fClickRoute = $Fn(this._onClickRoute, this).bind(),
                this._dClickDepartureRoute0 = this._welSection.delegate("click", "strong._departure_route_0", this._fClickRoute),
                this._dClickArrivalRoute0 = this._welSection.delegate("click", "strong._arrival_route_0", this._fClickRoute),
                this._dClickDepartureRoute1 = this._welSection.delegate("click", "strong._departure_route_1", this._fClickRoute),
                this._dClickArrivalRoute1 = this._welSection.delegate("click", "strong._arrival_route_1", this._fClickRoute),
                this._dClickDepartureRoute2 = this._welSection.delegate("click", "strong._departure_route_2", this._fClickRoute),
                this._dClickArrivalRoute2 = this._welSection.delegate("click", "strong._arrival_route_2", this._fClickRoute),
                this._dClickDepartureRoute3 = this._welSection.delegate("click", "strong._departure_route_3", this._fClickRoute),
                this._dClickArrivalRoute3 = this._welSection.delegate("click", "strong._arrival_route_3", this._fClickRoute),
                this._fClickAddRouteBtn = $Fn(this._onClickAddRouteBtn, this).attach(this._welAddRouteBtn.$value(), "click"),
                this._fClickDelRouteBtn = $Fn(this._onClickDelRouteBtn, this).attach(this._welDelRouteBtn.$value(), "click")
        },
        getSelectedOption: function() {
            var a = {}
                , b = this._getSelectedTab();
            return "OW" == b || "RT" == b ? (a.scity1 = this.getSelectedAttr(this._elDepartureRoute0),
                a.ecity1 = this.getSelectedAttr(this._elArrivalRoute0),
                a.scity2 = null ,
                a.ecity2 = null ,
                a.scity3 = null ,
                a.ecity3 = null ) : "MD" == b && (a.scity1 = this.getSelectedAttr(this._elDepartureRoute1),
                a.ecity1 = this.getSelectedAttr(this._elArrivalRoute1),
                a.scity2 = this.getSelectedAttr(this._elDepartureRoute2),
                a.ecity2 = this.getSelectedAttr(this._elArrivalRoute2),
                a.scity3 = null ,
                a.ecity3 = null ,
            1 == this._welRoute3Area.visible() && (a.scity3 = this.getSelectedAttr(this._elDepartureRoute3),
                a.ecity3 = this.getSelectedAttr(this._elArrivalRoute3))),
                a
        },
        getSelectedAttr: function(a) {
            var b = $Element(a);
            if (null  == b.attr("data-code") || "" == b.attr("data-code")) {
                var c = b.query("._name").innerHTML
                    , d = b.parent().query(".flight_code").innerHTML;
                return {
                    code: d,
                    eNationName: null ,
                    kNationName: null ,
                    eCityName: null ,
                    kCityName: c,
                    eAirPortName: null ,
                    kAirPortName: null
                }
            }
            return {
                code: b.attr("data-code"),
                eNationName: b.attr("data-enation-name"),
                kNationName: b.attr("data-knation-name"),
                eCityName: b.attr("data-ecity-name"),
                kCityName: b.attr("data-kcity-name"),
                eAirPortName: b.attr("data-eairport-name"),
                kAirPortName: b.attr("data-kairport-name")
            }
        },
        _makeAutoComplete: function() {
            var a = {
                welLayerInCity: this._welLayerInCity,
                welLayerOutCity: this._welLayerOutCity,
                leftLayerClass: "ly_recommendation_departure",
                rightLayerClass: "ly_recommendation_destination",
                threeLayerClass: "ly_recommendation_departure"
            };
            this._oAutoComplete = new pc.naver.search.AutoComplete(a),
                this._oAutoComplete.attach({
                    onClickItem: $Fn(function(a) {
                        if ("OW" == a.sTab || "RT" == a.sTab) {
                            if ("departure" == a.sAct) {
                                var b = $Element(this._elDepartureRoute0);
                                this.fireEvent("onClickItem", {
                                    isDomestic: 2,
                                    scityK: a.kCityName,
                                    scity: a.sCode
                                })
                            } else if ("arrival" == a.sAct) {
                                var b = $Element(this._elArrivalRoute0);
                                this._pass(a)
                            }
                            this._setRouteInput(b, a)
                        } else if ("MD" == a.sTab) {
                            if (1 == a.nOrder && "departure" == a.sAct) {
                                var b = $Element(this._elDepartureRoute1);
                                this.fireEvent("onClickItem", {
                                    isDomestic: 2,
                                    scityK: a.kCityName,
                                    scity: a.sCode
                                })
                            } else if (1 == a.nOrder && "arrival" == a.sAct) {
                                var b = $Element(this._elArrivalRoute1);
                                this._pass(a)
                            } else if (2 == a.nOrder && "departure" == a.sAct)
                                var b = $Element(this._elDepartureRoute2);
                            else if (2 == a.nOrder && "arrival" == a.sAct)
                                var b = $Element(this._elArrivalRoute2);
                            else if (3 == a.nOrder && "departure" == a.sAct)
                                var b = $Element(this._elDepartureRoute3);
                            else if (3 == a.nOrder && "arrival" == a.sAct)
                                var b = $Element(this._elArrivalRoute3);
                            this._setRouteInput(b, a)
                        }
                        "OW" == a.sTab || "RT" == a.sTab ? "departure" == a.sAct ? this._copyRoute(this._elDepartureRoute0, this._elDepartureRoute1) : "arrival" == a.sAct && ("대한민국" == $Element(this._elArrivalRoute0).attr("data-knation-name") ? (this._removeRoute(this._elArrivalRoute1, "도착"),
                            this._removeRoute(this._elDepartureRoute2, "출발")) : (this._copyRoute(this._elArrivalRoute0, this._elArrivalRoute1),
                            this._copyRoute(this._elArrivalRoute0, this._elDepartureRoute2))) : "MD" == a.sTab && (1 == a.nOrder && "departure" == a.sAct ? this._copyRoute(this._elDepartureRoute1, this._elDepartureRoute0) : 1 == a.nOrder && "arrival" == a.sAct ? ("출발" == $Element(this._elDepartureRoute2).query("._name").innerHTML && this._copyRoute(this._elArrivalRoute1, this._elDepartureRoute2),
                            this._copyRoute(this._elArrivalRoute1, this._elArrivalRoute0)) : 2 == a.nOrder && "arrival" == a.sAct && ("대한민국" != $Element(this._elArrivalRoute2).attr("data-knation-name") ? "출발" == $Element(this._elDepartureRoute3).query("._name").innerHTML && this._copyRoute(this._elArrivalRoute2, this._elDepartureRoute3) : (this._hideRoute3Area(),
                            this._showAddRouteBtn()))),
                        "RT" == a.sTab && "arrival" == a.sAct && ("대한민국" == $Element(this._elArrivalRoute0).attr("data-knation-name") ? this.fireEvent("setUndefinedBtn", {
                            isAct: !1
                        }) : this.fireEvent("setUndefinedBtn", {
                            isAct: !0
                        })),
                        "MD" == a.sTab && "arrival" == a.sAct && 2 == a.nOrder && "대한민국" != $Element(this._elArrivalRoute2).attr("data-knation-name") && this._showRoute3(),
                        ("OW" == a.sTab || "RT" == a.sTab) && "arrival" == a.sAct && "인천" == $Element(this._elDepartureRoute0).query("._name").innerHTML && "대한민국" == $Element(this._elArrivalRoute0).attr("data-knation-name") && (this._setDepartureKimpo(),
                            this._copyRoute(this._elDepartureRoute0, this._elDepartureRoute1))
                    }, this).bind(),
                    onBlurInput: $Fn(function() {
                        this._allCleanRoute()
                    }, this).bind()
                })
        },
        _showRoute3Area: function() {
            this._welRoute3Area.show("block"),
                this._welCalendar3Area.show("block")
        },
        _hideRoute3Area: function() {
            this._welRoute3Area.hide(),
                this._welCalendar3Area.hide()
        },
        _setRouteInput: function(a, b) {
            a.attr("data-code", b.sCode),
                a.attr("data-enation-name", b.eNationName),
                a.attr("data-knation-name", b.kNationName),
                a.attr("data-ecity-name", b.eCityName),
                a.attr("data-kcity-name", b.kCityName),
                a.attr("data-eairport-name", b.eAirPortName),
                a.attr("data-kairport-name", b.kAirPortName);
            var c = a.query("._name");
            $Element(c).html(b.kCityName);
            var d = $$.getSingle(".flight_code", a.$value().parentNode);
            $Element(d).html(b.sCode);
            var e = $$.getSingle("!." + this._routeClassArea, a.$value());
            $Element(e).removeClass(this._routeClassOff)
        },
        _copyRoute: function(a, b) {
            var c = $Element(a)
                , d = $Element(b);
            d.attr("data-code", c.attr("data-code")),
                d.attr("data-enation-name", c.attr("data-enation-name")),
                d.attr("data-knation-name", c.attr("data-knation-name")),
                d.attr("data-ecity-name", c.attr("data-ecity-name")),
                d.attr("data-kcity-name", c.attr("data-kcity-name")),
                d.attr("data-eairport-name", c.attr("data-eairport-name")),
                d.attr("data-kairport-name", c.attr("data-kairport-name"));
            var e = c.query("._name")
                , f = d.query("._name");
            f.innerHTML = e.innerHTML;
            var g = $$.getSingle(".flight_code", b.parentNode);
            g.innerHTML = c.attr("data-code");
            var h = $$.getSingle("!." + this._routeClassArea, g);
            $Element(h).removeClass(this._routeClassOff)
        },
        _removeRoute: function(a, b) {
            var c = $Element(a);
            c.attr("data-code", ""),
                c.attr("data-enation-name", ""),
                c.attr("data-knation-name", ""),
                c.attr("data-ecity-name", ""),
                c.attr("data-kcity-name", ""),
                c.attr("data-eairport-name", ""),
                c.attr("data-kairport-name", "");
            var d = c.query("._name");
            d.innerHTML = b;
            var e = $$.getSingle(".flight_code", a.parentNode);
            e.innerHTML = b + "지 선택";
            var f = $$.getSingle("!." + this._routeClassArea, a);
            $Element(f).addClass(this._routeClassOff)
        },
        _onClickRoute: function(a) {
            var b = a.element
                , c = this._getSelectedTab()
                , d = b.getAttribute("data-act")
                , e = parseInt(b.getAttribute("data-order"), 10)
                , f = this._getAutoCode(c, d, e)
                , g = f.sAutoCode
                , h = f.inOut
                , i = null
                , j = null ;
            "departure" == d ? (welRoute = this._awelDepartureRoute[e],
                welInput = this._awelDepartureInput[e],
                i = this._awelDepartureListLayer[e],
                j = this._awelDepartureListCon[e],
                welArea = this._awelDepartureArea[e]) : "arrival" == d && (welRoute = this._awelArrivalRoute[e],
                welInput = this._awelArrivalInput[e],
                i = this._awelArrivalListLayer[e],
                j = this._awelArrivalListCon[e],
                welArea = this._awelArrivalArea[e]);
            for (var k = 0; k < this._awelDepartureRoute.length; k++)
                this._awelDepartureInput[k].$value().blur(),
                    this._awelArrivalInput[k].$value().blur();
            welRoute.hide(),
                welInput.show();
            var l = {
                sTab: c,
                sAct: d,
                nOrder: e,
                sAutoCode: g,
                sInOut: h,
                elInput: welInput.$value(),
                welListLayer: i,
                welListCon: j,
                welArea: welArea
            };
            this._oAutoComplete.selectAutoComplete(l),
                this._sendClickCr(a, l, "route")
        },
        _allCleanRoute: function() {
            for (var a = 0; a < this._awelDepartureRoute.length; a++)
                this._awelDepartureRoute[a].show("block"),
                    this._awelDepartureInput[a].hide(),
                    this._awelArrivalRoute[a].show("block"),
                    this._awelArrivalInput[a].hide()
        },
        _getSelectedTab: function() {
            for (var a = 0; a < this._awelTabLi.length; a++)
                if (this._awelTabLi[a].hasClass(this._tabClassOn))
                    switch (a) {
                        case 0:
                            return "OW";
                        case 1:
                            return "RT";
                        case 2:
                            return "MD"
                    }
        },
        _getAutoCode: function(a, b, c) {
            if ("OW" == a) {
                if ("departure" == b)
                    return {
                        sAutoCode: "0000000010",
                        inOut: "in"
                    };
                if ("arrival" == b)
                    return {
                        sAutoCode: "0000000001",
                        inOut: "inOut"
                    }
            } else if ("RT" == a) {
                if ("departure" == b)
                    return {
                        sAutoCode: "0000000010",
                        inOut: "in"
                    };
                if ("arrival" == b)
                    return {
                        sAutoCode: "0000000001",
                        inOut: "inOut"
                    }
            } else if ("MD" == a)
                if ("departure" == b)
                    switch (c) {
                        case 1:
                            return {
                                sAutoCode: "0000000010",
                                inOut: "in"
                            };
                        case 2:
                            return {
                                sAutoCode: "0000000001",
                                inOut: "out"
                            };
                        case 3:
                            return {
                                sAutoCode: "0000000001",
                                inOut: "out"
                            }
                    }
                else if ("arrival" == b)
                    switch (c) {
                        case 1:
                            return {
                                sAutoCode: "0000000001",
                                inOut: "out"
                            };
                        case 2:
                            return {
                                sAutoCode: "0000000001",
                                inOut: "inOut"
                            };
                        case 3:
                            return {
                                sAutoCode: "0000000010",
                                inOut: "in"
                            }
                    }
        },
        setMultiInitRoute: function() {
            "도착" != $Element(this._elArrivalRoute1).query("._name").innerHTML && ("대한민국" == $Element(this._elArrivalRoute1).attr("data-knation-name") ? (this._removeRoute(this._elArrivalRoute1, "도착"),
                this._removeRoute(this._elDepartureRoute2, "출발")) : this._copyRoute(this._elArrivalRoute1, this._elDepartureRoute2)),
                this._removeRoute(this._elArrivalRoute2, "도착"),
                this._removeRoute(this._elDepartureRoute3, "출발"),
                this._setArrivalInCheon(),
                this._hideRoute3Area(),
                this._showAddRouteBtn()
        },
        _setArrivalInCheon: function() {
            var a = $Element(this._elArrivalRoute3);
            a.attr("data-code", "ICN"),
                a.attr("data-enation-name", "Korea Republic of"),
                a.attr("data-knation-name", "대한민국"),
                a.attr("data-ecity-name", "Seoul"),
                a.attr("data-kcity-name", "인천"),
                a.attr("data-eairport-name", "Incheon Int Arpt"),
                a.attr("data-kairport-name", "인천국제공항");
            var b = a.query("._name");
            b.innerHTML = "인천";
            var c = $$.getSingle(".flight_code", a.$value().parentNode);
            $Element(c).html("ICN")
        },
        _setDepartureKimpo: function() {
            var a = $Element(this._elDepartureRoute0);
            a.attr("data-code", "GMP"),
                a.attr("data-enation-name", "Korea Republic of"),
                a.attr("data-knation-name", "대한민국"),
                a.attr("data-ecity-name", "Seoul"),
                a.attr("data-kcity-name", "김포"),
                a.attr("data-eairport-name", "Gimpo Int Arpt"),
                a.attr("data-kairport-name", "김포국제공항");
            var b = a.query("._name");
            b.innerHTML = "김포";
            var c = $$.getSingle(".flight_code", a.$value().parentNode);
            $Element(c).html("GMP")
        },
        _onClickAddRouteBtn: function(a) {
            var b = "여정을 추가하려면 도착지를 해외로 선택하세요.";
            return "도착" == $Element(this._elArrivalRoute2).query("._name").innerHTML ? void alert(b) : "대한민국" == $Element(this._elArrivalRoute2).attr("data-knation-name") ? void alert(b) : (this._showRoute3(),
                void this._sendClickCr(a, {
                    sTab: "MD"
                }, "addRoute"))
        },
        _showRoute3: function() {
            0 == this._welRoute3Area.visible() && this._copyRoute(this._elArrivalRoute2, this._elDepartureRoute3),
                this._setArrivalInCheon(),
                this._showRoute3Area(),
                this._hideAddRouteBtn()
        },
        _onClickDelRouteBtn: function(a) {
            this._hideRoute3Area(),
                this._showAddRouteBtn(),
                this._sendClickCr(a, {
                    sTab: "MD"
                }, "removeRoute")
        },
        _showAddRouteBtn: function() {
            this._welAddRouteBtn.show("block")
        },
        _hideAddRouteBtn: function() {
            this._welAddRouteBtn.hide()
        },
        _pass: function(a) {
            var b = !1;
            "대한민국" == a.kNationName && (b = !0),
                this.fireEvent("onClickItem", {
                    isDomestic: b,
                    ecity1: a.sCode
                })
        },
        _sendClickCr: function(a, b, c) {
            if ("_flight_section" == this._config.elSectionClass)
                var d = "fly_";
            else
                var d = "";
            var e = ""
                , f = "";
            "OW" == b.sTab ? e = d + "one" : "RT" == b.sTab ? e = d + "rnd" : "MD" == b.sTab && (e = d + "mul"),
                "route" == c ? "departure" == b.sAct ? "MD" == b.sTab ? 1 == b.nOrder ? f = "depairport1" : 2 == b.nOrder ? f = "depairport2" : 3 == b.nOrder && (f = "depairport3") : f = "depairport" : "arrival" == b.sAct && ("MD" == b.sTab ? 1 == b.nOrder ? f = "arrairport1" : 2 == b.nOrder ? f = "arrairport2" : 3 == b.nOrder && (f = "arrairport3") : f = "arrairport") : "removeRoute" == c ? f = "close3" : "addRoute" == c && (f = "add"),
                clickcr(a.element, e + "." + f, "", "", a._event)
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.CalendarControl = jindo.$Class({
        _tabClassOn: "lnk_navigation_on",
        _strDeparture: "가는날 선택",
        _strArrival: "오는날 선택",
        _dateBtnFocusClass: "btn_trip_on",
        _dateSelectClass: "txt_trip_on",
        _sHeader: null ,
        $init: function() {
            this._config = pc.naver.search.config,
                this._flightData = this._config.flightData,
                this._sHeader = "_flight_section" == this._config.elSectionClass ? "fly_" : "",
                this._assignElement(),
                this._assignEvent(),
                this._makeCalendar(),
                this._initCalendar()
        },
        _assignElement: function() {
            var a = $Element(document.body).query("div." + this._config.elSectionClass);
            this._welSection = $Element(a),
                this._elCalendar = this._welSection.query(".flight_option .flight_option_wrap .flight_option_row .flight_select .flight_calendar ._calendar"),
                this._awelTabLi = [];
            for (var b = this._welSection.queryAll(".navigation_area .navigation_list li a"), c = 0; c < b.length; c++)
                this._awelTabLi.push($Element(b[c]));
            this._welCalendar = $Element(this._welSection.query("#_calendar")),
                this._welDepartureDateArea = $Element(this._welSection.query("#l_8 ._departure_date_select_area")),
                this._welArrivalDateArea = $Element(this._welSection.query("#l_8 ._arrival_date_select_area")),
                this._welMDDateArea0 = $Element(this._welSection.query("#l_3 ._date_select_area_0")),
                this._welMDDateArea1 = $Element(this._welSection.query("#l_5 ._date_select_area_1")),
                this._welMDDateArea2 = $Element(this._welSection.query("#l_7 ._date_select_area_2")),
                this._welDepartureDateText = $Element(this._welSection.query("#l_8 ._departure_date_txt")),
                this._welArrivalDateText = $Element(this._welSection.query("#l_8 ._arrival_date_txt")),
                this._welOneDateText = $Element(this._welSection.query("#l_3 ._one_date_txt")),
                this._welTwoDateText = $Element(this._welSection.query("#l_5 ._two_date_txt")),
                this._welThreeDateText = $Element(this._welSection.query("#l_7 ._three_date_txt")),
                this._welRoute3Area = $Element(this._welSection.query("._route_area_3")),
                this._welRTArrivalDateArea = $Element(this._welSection.query("._arrival_date_btn")),
                this._welMijeongArea = $Element(this._welSection.query("._mijeong_area")),
                this._welMijeongBtn = $Element(this._welSection.query("._mijeong_btn")),
                this._welMijeongLayer = $Element(this._welSection.query("._mijeong_layer")),
                this._welStayArea = $Element(this._welSection.query("._stay_area"))
        },
        _assignEvent: function() {
            this._welSection.delegate("click", "._departure_date_btn", $Fn(this._onClickDateBtn, this).bind("owrt", "departure")),
                this._welSection.delegate("click", "._arrival_date_btn", $Fn(this._onClickDateBtn, this).bind("owrt", "arrival")),
                this._welSection.delegate("click", "._md_date_btn_0", $Fn(this._onClickDateBtn, this).bind("md", "0")),
                this._welSection.delegate("click", "._md_date_btn_1", $Fn(this._onClickDateBtn, this).bind("md", "1")),
                this._welSection.delegate("click", "._md_date_btn_2", $Fn(this._onClickDateBtn, this).bind("md", "2")),
                this._welSection.delegate("click", "._mijeong_btn", $Fn(this._onClickMijeongBtn, this).bind()),
                this._fClickStayArea = $Fn(this._onClickStayArea, this).bind(),
                this._welMijeongLayer.delegate("click", "li", $Fn(this._onClickStayItem, this).bind()),
                this._fMouseDownDocumentForStay = $Fn(this._onMouseDownDocumentForStay, this),
                this._fMouseDownDocument = $Fn(this._onMouseDownDocument, this)
        },
        _onClickStayArea: function() {
            return this._fMouseDownDocumentForStay.detach(document.body, "mousedown"),
                this._welMijeongLayer.visible() ? void this._hideStayLayer() : (this._welMijeongLayer.show(),
                    this._welArrivalDateArea.addClass("flight_select_on"),
                    this._welStayArea.addClass("inp_undefined"),
                    void this._fMouseDownDocumentForStay.attach(document.body, "mousedown"))
        },
        _onClickStayItem: function(a) {
            var b = $Element(a.element)
                , c = b.attr("data-num")
                , d = b.query("a").innerHTML;
            this._welStayArea.html(d),
                this._welStayArea.attr("data-num", c),
                this._hideStayLayer(),
                this._fMouseDownDocumentForStay.detach(document.body, "mousedown"),
                this._sendClickCr(a, null , "staySelect")
        },
        _onClickMijeongBtn: function(a) {
            if (1 != this._welMijeongBtn.hasClass("btn_undefined_off") && (this._dClickStayArea = this._welSection.undelegate("click", "._mijeong_area", this._fClickStayArea),
                    this._fMouseDownDocumentForStay.detach(document.body, "mousedown"),
                "RT" == this._getSelectedTab())) {
                if (this._welMijeongArea.visible())
                    return void this._hideStayArea();
                this._showStayArea(),
                    this._sendClickCr(a, null , "stayClick")
            }
        },
        setUndefinedBtn: function(a) {
            1 == a ? this._welMijeongBtn.removeClass("btn_undefined_off") : 0 == a && (this._welMijeongBtn.addClass("btn_undefined_off"),
                this._hideStayArea())
        },
        _hideStayLayer: function() {
            this._welMijeongLayer.hide(),
                this._welArrivalDateArea.removeClass(this._dateBtnFocusClass),
                this._welStayArea.removeClass("inp_undefined")
        },
        _hideStayArea: function() {
            this._welMijeongLayer.hide(),
                this._welMijeongArea.hide(),
                this._welMijeongBtn.removeClass("btn_undefined_on"),
                this._welRTArrivalDateArea.show(),
                this._welStayArea.attr("data-num", ""),
                this._welStayArea.html("체류기간"),
                this._welMijeongArea.undelegate("click", "._stay_area", this._fClickStayArea),
                this._fMouseDownDocumentForStay.detach(document.body, "mousedown")
        },
        _showStayArea: function() {
            this._welMijeongArea.show(),
                this._welMijeongBtn.addClass("btn_undefined_on"),
                this._welRTArrivalDateArea.hide(),
                this._welMijeongArea.delegate("click", "._stay_area", this._fClickStayArea),
                this._fMouseDownDocumentForStay.attach(document.body, "mousedown")
        },
        _onMouseDownDocumentForStay: function(a) {
            var b = a.element;
            if (b) {
                var c = $Element(b).isChildOf(this._welArrivalDateArea.$value());
                c || this._hideStayLayer()
            }
        },
        _onMouseDownDocument: function(a) {
            var b = a.element;
            if (b) {
                var c = $Element(b).isChildOf(this._welDepartureDateArea.$value())
                    , d = $Element(b).isChildOf(this._welArrivalDateArea.$value())
                    , e = $Element(b).isChildOf(this._welMDDateArea0.$value())
                    , f = $Element(b).isChildOf(this._welMDDateArea1.$value())
                    , g = $Element(b).isChildOf(this._welMDDateArea2.$value());
                c || d || e || f || g ? ("OW" == this._getSelectedTab() && 1 == d && this._hideCalendar(),
                1 == d && this._welMijeongBtn.hasClass("btn_undefined_on") && this._hideCalendar()) : this._hideCalendar()
            }
        },
        _onClickDateBtn: function(a, b, c) {
            var d = $$.getSingle("!.search_area", c.element);
            if ("arrival" != b || !$Element(d).hasClass("search_area_single_trip")) {
                this._removeSelectedClass();
                var e = this._welCalendar.attr("data-where");
                if (this._welCalendar.visible() && e == b)
                    return void this._hideCalendar();
                this._welCalendar.attr("data-where", b);
                var f = null
                    , g = null ;
                "departure" == b ? (f = this._welDepartureDateArea,
                    f.removeClass("flight_calendar_destination"),
                    f.addClass("flight_calendar_departure"),
                    this._welDepartureDateArea.addClass(this._dateBtnFocusClass),
                    g = "one") : "arrival" == b ? (f = this._welArrivalDateArea,
                    f.removeClass("flight_calendar_departure"),
                    f.addClass("flight_calendar_destination"),
                    this._welArrivalDateArea.addClass(this._dateBtnFocusClass),
                    g = "two") : "0" == b ? (f = this._welMDDateArea0,
                    this._welMDDateArea0.addClass(this._dateBtnFocusClass),
                    g = "one") : "1" == b ? (f = this._welMDDateArea1,
                    this._welMDDateArea1.addClass(this._dateBtnFocusClass),
                    g = "two") : "2" == b && (f = this._welMDDateArea2,
                    this._welMDDateArea2.addClass(this._dateBtnFocusClass),
                    g = "three"),
                    f.append(this._welCalendar.$value()),
                    this._fMouseDownDocument.detach(document.body, "mousedown"),
                    this._fMouseDownDocument.attach(document.body, "mousedown");
                var h = {
                    sTab: this._getSelectedTab(),
                    sOrder: g,
                    sWhere: b
                };
                this._oCalendar.showCalendar(h),
                    this._welCalendar.show(),
                    this._sendClickCr(c, h, "date")
            }
        },
        _hideCalendar: function() {
            this._fMouseDownDocument.detach(document.body, "mousedown"),
                this._welCalendar.hide(),
                this._welCalendar.attr("data-where", ""),
                this._removeSelectedClass()
        },
        _removeSelectedClass: function() {
            this._welDepartureDateArea.removeClass(this._dateBtnFocusClass),
                this._welArrivalDateArea.removeClass(this._dateBtnFocusClass),
                this._welMDDateArea0.removeClass(this._dateBtnFocusClass),
                this._welMDDateArea1.removeClass(this._dateBtnFocusClass),
                this._welMDDateArea2.removeClass(this._dateBtnFocusClass)
        },
        changeTab: function(a) {
            var b = this._strDeparture
                , c = this._strArrival;
            if ("OW" == a ? (this._welArrivalDateText.html(c),
                    this._welTwoDateText.html(b),
                    this._welThreeDateText.html(b),
                    this._welArrivalDateText.removeClass(this._dateSelectClass),
                    this._welTwoDateText.removeClass(this._dateSelectClass),
                    this._welThreeDateText.removeClass(this._dateSelectClass)) : "RT" == a ? (this._welArrivalDateText.html() == b && this._welArrivalDateText.html(c),
                    this._welThreeDateText.html(b),
                    this._welThreeDateText.removeClass(this._dateSelectClass)) : "MD" == a && this._welTwoDateText.html() == c && this._welTwoDateText.html(b),
                    this._oCalendar.changeTab(a, this._getIsDomesticFindRoute()),
                    this._welStayArea.attr("data-num", ""),
                    this._welStayArea.html("체류기간"),
                    this._hideStayArea(),
                    this._hideStayLayer(),
                "RT" == a) {
                var d = this._welSection.query("#l_1 ._arrival_area_0 ._arrival_route_0")
                    , e = d.getAttribute("data-knation-name");
                "대한민국" == e ? this._welMijeongBtn.addClass("btn_undefined_off") : this._welMijeongBtn.removeClass("btn_undefined_off")
            }
        },
        _setStayLength: function(a) {
            if ("undefined" != typeof a && "" != a && null  != a) {
                switch (this._welStayArea.attr("data-num", a),
                    a) {
                    case "5D":
                        this._welStayArea.html("5일");
                        break;
                    case "7D":
                        this._welStayArea.html("7일");
                        break;
                    case "14D":
                        this._welStayArea.html("14일");
                        break;
                    case "20D":
                        this._welStayArea.html("20일");
                        break;
                    case "1M":
                        this._welStayArea.html("1개월");
                        break;
                    case "2M":
                        this._welStayArea.html("2개월");
                        break;
                    case "3M":
                        this._welStayArea.html("3개월");
                        break;
                    case "6M":
                        this._welStayArea.html("6개월");
                        break;
                    case "1Y":
                        this._welStayArea.html("1년")
                }
                this._showStayArea()
            }
        },
        setDates: function(a, b, c, d, e) {
            var f = null
                , g = null
                , h = null ;
            "undefined" != typeof b && "" != b && null  != b && (f = parseInt(b.substring(0, 4), 10) + "." + parseInt(b.substring(4, 6), 10) + "." + parseInt(b.substring(6, 8), 10)),
            "undefined" != typeof c && "" != c && null  != c && (g = parseInt(c.substring(0, 4), 10) + "." + parseInt(c.substring(4, 6), 10) + "." + parseInt(c.substring(6, 8), 10)),
            "undefined" != typeof d && "" != d && null  != d && (h = parseInt(d.substring(0, 4), 10) + "." + parseInt(d.substring(4, 6), 10) + "." + parseInt(d.substring(6, 8), 10)),
            "undefined" != typeof e && null  != e && "" != e && this._setStayLength(e);
            var i = {
                sTab: a,
                oneDate: f,
                twoDate: g,
                threeDate: h
            };
            this._oCalendar.setDates(i)
        },
        _initCalendar: function() {
            var a = this._flightData.sdate1
                , b = this._flightData.sdate2
                , c = this._flightData.sdate3
                , d = this._flightData.staylength;
            if ("undefined" != typeof a && "" != a && null  != a) {
                var e = parseInt(a.substring(0, 4), 10) + "." + parseInt(a.substring(4, 6), 10) + "." + parseInt(a.substring(6, 8), 10)
                    , f = null
                    , g = null ;
                "undefined" != typeof b && "" != b && null  != b && (f = parseInt(b.substring(0, 4), 10) + "." + parseInt(b.substring(4, 6), 10) + "." + parseInt(b.substring(6, 8), 10)),
                "undefined" != typeof c && "" != c && null  != c && (g = parseInt(c.substring(0, 4), 10) + "." + parseInt(c.substring(4, 6), 10) + "." + parseInt(c.substring(6, 8), 10));
                var h = {
                    sTab: this._getSelectedTab(),
                    oneDate: e,
                    twoDate: f,
                    threeDate: g
                };
                this._oCalendar.setDates(h),
                    this._setStayLength(d)
            }
        },
        _makeCalendar: function() {
            var a = this._flightData.today.split(".")
                , b = parseInt(a[0], 10)
                , c = parseInt(a[1], 10)
                , d = parseInt(a[2], 10)
                , e = this._getIsDomesticFindRoute()
                , f = null ;
            if (0 == e) {
                var g = new Date(b,c - 1,d);
                g.setTime(g.getTime() + 864e5),
                    f = {
                        nYear: g.getFullYear(),
                        nMonth: g.getMonth() + 1,
                        nDate: g.getDate()
                    }
            } else
                f = {
                    nYear: b,
                    nMonth: c,
                    nDate: d
                };
            var h = new Date(b,c - 1,d);
            h.setTime(h.getTime() + 31536e6);
            var i = {
                nYear: h.getFullYear(),
                nMonth: h.getMonth() + 1,
                nDate: h.getDate()
            }
                , j = {
                nYear: this._flightData.syear,
                nMonth: this._flightData.smonth
            };
            1 != this._flightData.isDomestic && 1 != this._flightData.isDomestic || "RT" != this._config.trip || this._welMijeongBtn.addClass("btn_undefined_off"),
                this._oCalendar = new pc.naver.search.Calendar("_calendar",{
                    nYear: a[0],
                    nMonth: a[1],
                    nDate: a[2],
                    oFromDate: f,
                    oToDate: i,
                    oShowDate: j,
                    sTitleFormat: "yyyy.mm"
                }).attach({
                    onClickSelectDate: $Fn(function(a) {
                        var b = this._strDeparture
                            , c = this._strArrival;
                        if (this._welDepartureDateText.html(b),
                                this._welArrivalDateText.html(c),
                                this._welOneDateText.html(b),
                                this._welTwoDateText.html(b),
                                this._welThreeDateText.html(b),
                                this._welDepartureDateText.removeClass(this._dateSelectClass),
                                this._welArrivalDateText.removeClass(this._dateSelectClass),
                                this._welOneDateText.removeClass(this._dateSelectClass),
                                this._welTwoDateText.removeClass(this._dateSelectClass),
                                this._welThreeDateText.removeClass(this._dateSelectClass),
                            "OW" == a.sTab) {
                            var d = b;
                            null  != a.oneDate && (d = a.oneDate + ".",
                                this._welDepartureDateText.addClass(this._dateSelectClass),
                                this._welOneDateText.addClass(this._dateSelectClass)),
                                this._welDepartureDateText.html(d),
                                this._welOneDateText.html(d + ".")
                        } else if ("RT" == a.sTab) {
                            var d = b
                                , e = c;
                            null  != a.oneDate && (d = a.oneDate + ".",
                                this._welDepartureDateText.addClass(this._dateSelectClass),
                                this._welOneDateText.addClass(this._dateSelectClass)),
                            null  != a.twoDate && (e = a.twoDate + ".",
                                this._welArrivalDateText.addClass(this._dateSelectClass),
                                this._welTwoDateText.addClass(this._dateSelectClass)),
                                this._welDepartureDateText.html(d),
                                this._welOneDateText.html(d),
                                this._welArrivalDateText.html(e),
                                this._welTwoDateText.html(e)
                        } else if ("MD" == a.sTab) {
                            var d = b
                                , e = b
                                , f = b;
                            null  != a.oneDate && (d = a.oneDate + ".",
                                this._welDepartureDateText.addClass(this._dateSelectClass),
                                this._welOneDateText.addClass(this._dateSelectClass)),
                            null  != a.twoDate && (e = a.twoDate + ".",
                                this._welArrivalDateText.addClass(this._dateSelectClass),
                                this._welTwoDateText.addClass(this._dateSelectClass)),
                            null  != a.threeDate && (f = a.threeDate + ".",
                                this._welThreeDateText.addClass(this._dateSelectClass)),
                                this._welDepartureDateText.html(d),
                                this._welOneDateText.html(d),
                                this._welArrivalDateText.html(e),
                                this._welTwoDateText.html(e),
                                this._welThreeDateText.html(f)
                        }
                        this._hideCalendar()
                    }, this).bind()
                })
        },
        setIsDomestic: function(a) {
            this._oCalendar.changeDomestic(a)
        },
        _getIsDomesticFindRoute: function() {
            var a = this._getSelectedTab();
            if ("OW" == a || "RT" == a) {
                var b = this._welSection.query("#l_1 ._arrival_area_0 ._arrival_route_0")
                    , c = b.getAttribute("data-knation-name");
                if (null  == c)
                    return !0;
                if ("대한민국" == c)
                    return !0;
                if ("대한민국" != c)
                    return !1
            } else if ("MD" == a)
                return !1
        },
        _getSelectedTab: function() {
            for (var a = 0; a < this._awelTabLi.length; a++)
                if (this._awelTabLi[a].hasClass(this._tabClassOn))
                    switch (a) {
                        case 0:
                            return "OW";
                        case 1:
                            return "RT";
                        case 2:
                            return "MD"
                    }
        },
        getSelectedOption: function() {
            var a = this._getSelectedTab()
                , b = this._oCalendar.getSelectedOption()
                , c = {};
            if ("OW" == a || "RT" == a) {
                if (c.sdate1 = b.sdate1,
                        c.sdate2 = b.sdate2,
                        c.sdate3 = null ,
                        c.stayLength = null ,
                        this._welMijeongBtn.hasClass("btn_undefined_on")) {
                    c.sdate2 = null ;
                    var d = this._welStayArea.attr("data-num");
                    c.stayLength = "" == d ? null  : d
                }
            } else
                "MD" == a && (c.sdate1 = b.sdate1,
                    c.sdate2 = b.sdate2,
                    c.sdate3 = null ,
                    c.stayLength = null ,
                1 == this._welRoute3Area.visible() && (c.sdate3 = b.sdate3));
            return c
        },
        _sendClickCr: function(a, b, c) {
            var d = ""
                , e = "";
            "date" == c ? "OW" == b.sTab ? (d = this._sHeader + "one",
            "departure" == b.sWhere && (e = "sdate")) : "RT" == b.sTab ? (d = this._sHeader + "rnd",
                "departure" == b.sWhere ? e = "ddate" : "arrival" == b.sWhere && (e = "rdate")) : "MD" == b.sTab && (d = this._sHeader + "mul",
                "0" == b.sWhere ? e = "ddate1" : "1" == b.sWhere ? e = "ddate2" : "2" == b.sWhere && (e = "ddate3")) : "stayClick" == c ? (d = this._sHeader + "rnd",
                e = "ropen") : "staySelect" == c && (d = this._sHeader + "rnd",
                e = "rstay"),
                "_flight_section" == this._config.elSectionClass ? tCR("a=" + d + "." + e) : clickcr(a.element, d + "." + e, "", "", a._event)
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.DetailResult = jindo.$Class({
        _config: null ,
        _oAjax: null ,
        _oDetailList: null ,
        _main: null ,
        $init: function() {
            this._config = pc.naver.search.config,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            var a = $Element(document.body);
            this._elContentArea = $Element(a.query("div.content")),
                this._resultArea = $Element(this._elContentArea.query("div.result_area")),
                this._detailArea = $Element(this._resultArea.query("div.trip_reservation")),
                this._detailTitleDesc = $Element(this._detailArea.query("p.dsc_info")),
                this._detailList = $Element(this._detailArea.query("ul.trip_reservation_list")),
                this._loadingArea = $Element(this._detailArea.query("div.trip_loading")),
                this._errorArea = $Element(this._detailArea.query("div.trip_error")),
                this._tripInfoArea = $Element(this._detailArea.query("div.trip_info")),
                this._detailViewType = $Element(this._detailArea.query("div.trip_btn_box")),
                this._promotionTitle = $Element(this._detailArea.query("div.trip_promotion_banner"))
        },
        _assignEvent: function() {
            this._fOverDetailPrice = this._detailList.delegate("mouseover", "a.lnk_price", $Fn(this._onOverDetailPrice, this).bind()),
                this._fOutDetailPrice = this._detailList.delegate("mouseout", "a.lnk_price", $Fn(this._onOutDetailPrice, this).bind()),
                this._fClickDetailViewType = this._detailViewType.delegate("click", "a.btn_trip_price", $Fn(this._onClickDetailViewType, this).bind())
        },
        getDetailList: function(a, b, c, d, e) {
            this._main = "isr",
                this._detailList.html(""),
                this._errorArea.css("display", "none"),
                this._detailArea.css("display", "block"),
                this._loadingArea.css("display", "block");
            for (var f = {}, g = a.split("&"), h = 0; h < g.length; h++) {
                var i = g[h].split("=");
                f[i[0]] = i[1]
            }
            f.SelSeatType = b,
                f.SelFareType = c,
                f.AirV = d;
            var j = $Cookie();
            f._csrf = j.get("XSRF-TOKEN"),
            null  != this._oAjax && this._oAjax.abort(),
                this._oAjax = new $Ajax("/Detail",{
                    method: "post",
                    onerror: $Fn(function() {
                        this._errorArea.css("display", "block"),
                            this._loadingArea.css("display", "none")
                    }, this).bind(),
                    onload: $Fn(function(a) {
                        0 !== a.json().retCode && (this._errorArea.css("display", "block"),
                            this._loadingArea.css("display", "none")),
                            this._oDetailList = a.json(),
                            this._detailRender(a.json().AgencyList),
                            e(a.json().AgencyList.length)
                    }, this).bind(),
                    timeout: 1e3,
                    ontimeout: $Fn(function() {
                        this._errorArea.css("display", "block"),
                            this._loadingArea.css("display", "none")
                    }, this).bind()
                }).request(f)
        },
        getDAgencyList: function(a, b, c) {
            this._main = "dsr",
                this._detailList.html(""),
                this._detailArea.css("display", "block"),
                this._loadingArea.css("display", "block");
            for (var d = {}, e = a.bParam.split("&"), f = 0; f < e.length; f++) {
                var g = e[f].split("=");
                d[g[0]] = g[1]
            }
            d.Itin = "OW" == b ? 0 : 1;
            var h = $Cookie();
            d._csrf = h.get("XSRF-TOKEN"),
            null  != this._oAjax && this._oAjax.abort(),
                this._oAjax = new $Ajax("/DAgencyList",{
                    method: "post",
                    onerror: $Fn(function() {
                        this._errorArea.css("display", "block"),
                            this._loadingArea.css("display", "none")
                    }, this).bind(),
                    onload: $Fn(function(b) {
                        void 0 == b.json().AgtList && (this._errorArea.css("display", "block"),
                            this._loadingArea.css("display", "none")),
                            this._oDetailList = b.json(),
                            this._detailRender(b.json().AgtList, a, d),
                            c(b.json().AgtList.length)
                    }, this).bind(),
                    timeout: 1e3,
                    ontimeout: $Fn(function() {
                        this._errorArea.css("display", "block"),
                            this._loadingArea.css("display", "none")
                    }, this).bind()
                }).request(d)
        },
        _detailRender: function(a, b, c) {
            for (var d = [], e = 0, f = !1, g = 0; g < a.length; g++) {
                var h = ""
                    , i = ""
                    , j = ""
                    , k = ""
                    , l = ""
                    , m = ""
                    , n = "0"
                    , o = ""
                    , p = ""
                    , q = ""
                    , r = ""
                    , s = ""
                    , t = "0"
                    , u = ""
                    , v = ""
                    , w = ""
                    , x = ""
                    , y = ""
                    , z = "0"
                    , A = ""
                    , B = ""
                    , C = ""
                    , D = ""
                    , E = ""
                    , F = ""
                    , G = ""
                    , H = "";
                if (this._detailViewType.css("display", "none"),
                    void 0 == b) {
                    for (var I = {}, J = a[g].BookingParam.split("&"), K = 0; K < J.length; K++) {
                        var L = J[K].split("=");
                        I[L[0]] = L[1]
                    }
                    "0" == a[g].NaverSaleFare ? (j = a[g].SaleFare,
                        k = a[g].TotalPrice,
                        o = a[g].AdtPrice,
                        r = a[g].AdtTotalSum,
                        u = a[g].ChdPrice,
                        x = a[g].ChdTotalSum) : ("OW" == I.TRIP ? F = "편도" : "RT" == I.TRIP ? F = "왕복" : "MD" == I.TRIP && (F = "다구간"),
                    e < this._makeStringPrice(a[g].SaleFare) - this._makeStringPrice(a[g].NaverSaleFare) && (0 != e && (f = !0),
                        e = this._makeStringPrice(a[g].SaleFare) - this._makeStringPrice(a[g].NaverSaleFare)),
                        H = a[g].SaleFare,
                        j = a[g].NaverSaleFare,
                        G = a[g].NoPromotionTotalPrice,
                        k = a[g].TotalPrice),
                        h = "HK" == a[g].Seat ? "가능" : "대기",
                        o = a[g].AdtPrice,
                        r = a[g].AdtTotalSum,
                        u = a[g].ChdPrice,
                        x = a[g].ChdTotalSum,
                        i = a[g].Name,
                        n = I.Adt,
                        p = a[g].AdtTax1,
                        q = a[g].AdtTax2,
                        t = I.Chd,
                        v = a[g].ChdTax1,
                        w = a[g].ChdTax2,
                        z = I.Inf,
                        A = a[g].InfPrice,
                        B = a[g].InfTax1,
                        C = a[g].InfTax2,
                        D = a[g].InfTotalSum,
                        l = '<span class="sp_flight txt_terms">' + a[g].FareTypeKR + "</span>",
                        m = a[g].adcrLink,
                        E = null  == a[g].InternationalDesc ? "DB에 프로모션 문구 입력되야함" : a[g].InternationalDesc,
                        y = 'style="background:#fff"'
                } else
                    h = "가능",
                        i = a[g].AgtName,
                        j = this._makePriceString(b.JAdultFare),
                        k = this._makePriceString(b.JAdultFare * c.ACnt0 + b.JChildFare * c.CCnt0),
                        n = c.ACnt0,
                        o = this._makePriceString((b.JAdultFare - b.JAFuel - b.JATax) * c.ACnt0),
                        p = this._makePriceString(b.JAFuel * c.ACnt0),
                        q = this._makePriceString(b.JATax * c.ACnt0),
                        r = this._makePriceString(b.JAdultFare * c.ACnt0),
                        t = c.CCnt0,
                        u = this._makePriceString((b.JChildFare - b.JCFuel - b.JCTax) * c.CCnt0),
                        v = this._makePriceString(b.JCFuel * c.CCnt0),
                        w = this._makePriceString(b.JCTax * c.CCnt0),
                        x = this._makePriceString(b.JChildFare * c.CCnt0),
                        m = a[g].adcrLink,
                        E = null  == a[g].DomesticDesc ? "DB에 프로모션 문구 입력되야함" : a[g].DomesticDesc;
                1 == a[g].SupportNaverLogin && (s = '<span class="ly_naver_login_wrap"><a href="#" class="sp_flight btn_naver_login">네이버 아이디로 로그인</a><span class="ly_naver_login"><span class="sp_flight ico_col"></span>네이버 아이디로 로그인하여 예약 가능한 여행사입니다.</span></span>'),
                parseInt(n) + parseInt(t) + parseInt(z) > 1 && this._detailViewType.css("display", "block");
                var M = '				<li class="trip_reservation_item" ' + y + '> 					<div class="trip_reservation_cell">                         <div class="tit_reservation"><span class="ico_reservation" style="background-image:url(./img/company/' + a[g].CompanyId + '.png)"></span><span class="tit_txt_reservation">' + i + '</span></div>                     </div>                     <div class="trip_reservation_cell">                         <div class="dsc_reservation">' + E + " " + s + '</div>                     </div>                     <div class="trip_reservation_cell">                     	<div class="txt_bill txt_bill_promotion">';
                "0" != a[g].NaverSaleFare && void 0 == b && (M += '	            	<div class="txt_cost"> 	                    ' + F + ' 	                    <del><span class="txt_pay txt_pay_ch adt" style="display:none;text-decoration: line-through;">' + H + '</span><span class="txt_pay txt_pay_ch total" style="text-decoration: line-through;">' + G + '</span><span class="txt_won">원</span></del> 	                </div>'),
                    M += '                            <div class="txt_total">',
                "0" != a[g].NaverSaleFare && void 0 == b && (M += '                            	<span class="sp_flight ico_naver">네이버 추가할인</span>'),
                    M += '                            	<span class="txt_pay txt_pay_ch adt" style="display:none">' + j + '</span><span class="txt_pay txt_pay_ch total">' + k + '</span><span class="txt_won">원</span>                             	<a href="javascript:;" class="lnk_price" style="font-weight: normal;">상세가격</a> 			                   	<div class="ly_total_pay _adt_pay" style="display:none;"> 			                        <dl class="total_pay_box"> 			                        <dt class="tit_total_pay">성인 1명 기본 요금</dt> 			                        <dd class="txt_total_pay">' + this._makePriceString(this._makeStringPrice(o) / n) + '원</dd> 			                        <dt class="tit_total_pay">유류할증료 X 1</dt> 			                        <dd class="txt_total_pay">' + this._makePriceString(this._makeStringPrice(p) / n) + '원</dd> 			                        <dt class="tit_total_pay">제세공과금 X 1</dt> 			                        <dd class="txt_total_pay">' + this._makePriceString(this._makeStringPrice(q) / n) + '원</dd> 			                        <dt class="tit_total_pay">총 성인 요금</dt> 			                        <dd class="txt_total_pay">' + this._makePriceString(this._makeStringPrice(r) / n) + '원</dd> 			                        </dl> 			                        <dl class="total_pay_result"> 			                        <dt class="total_pay_result_title">총 예상 요금</dt> 			                        <dd class="total_pay_result_text"><span class="txt_pay">' + this._makePriceString(this._makeStringPrice(r) / n) + "</span>원</dd>",
                    M += void 0 == b ? '		                        	<dd class="total_pay_result_info">유류할증료/제세공과금 등 포함</dd>' : '		   	                     	<dd class="total_pay_result_info">유류할증료/제세공과금 포함</dd>',
                    M += '			                        </dl> 			                        <div class="bg_layer"></div> 			                    </div> 			                    <div class="ly_total_pay _total_pay _target_total_pay" style="display:none;"> 			                        <dl class="total_pay_box"> 			                        <dt class="tit_total_pay">성인 ' + n + '명 기본 요금</dt> 			                        <dd class="txt_total_pay">' + o + '원</dd> 			                        <dt class="tit_total_pay">유류할증료 X ' + n + '</dt> 			                        <dd class="txt_total_pay">' + p + '원</dd> 			                        <dt class="tit_total_pay">제세공과금 X ' + n + '</dt> 			                        <dd class="txt_total_pay">' + q + '원</dd> 			                        <dt class="tit_total_pay">총 성인 요금</dt> 			                        <dd class="txt_total_pay">' + r + "원</dd> 			                        </dl>",
                "0" != t && (M += '									<dl class="total_pay_box"> 			                        <dt class="tit_total_pay">소아 ' + t + '명 기본 요금</dt> 			                        <dd class="txt_total_pay">' + u + '원</dd> 			                        <dt class="tit_total_pay">유류할증료 X ' + t + '</dt> 			                        <dd class="txt_total_pay">' + v + '원</dd> 			                        <dt class="tit_total_pay">제세공과금 X ' + t + '</dt> 			                        <dd class="txt_total_pay">' + w + '원</dd> 			                        <dt class="tit_total_pay">총 소아 요금</dt> 			                        <dd class="txt_total_pay">' + x + "원</dd> 			                        </dl>"),
                "0" != z && (M += '									<dl class="total_pay_box"> 			                        <dt class="tit_total_pay">유아 ' + z + '명 기본 요금</dt> 			                        <dd class="txt_total_pay">' + A + '원</dd> 			                        <dt class="tit_total_pay">유류할증료 X ' + z + '</dt> 			                        <dd class="txt_total_pay">' + B + '원</dd> 			                        <dt class="tit_total_pay">제세공과금 X ' + z + '</dt> 			                        <dd class="txt_total_pay">' + C + '원</dd> 			                        <dt class="tit_total_pay">총 유아 요금</dt> 			                        <dd class="txt_total_pay">' + D + "원</dd> 			                        </dl>"),
                    M += '			                        <dl class="total_pay_result"> 			                        <dt class="total_pay_result_title">총 예상 요금</dt> 			                        <dd class="total_pay_result_text"><span class="txt_pay">' + k + "</span>원</dd>",
                    M += void 0 == b ? '		                       		<dd class="total_pay_result_info">유류할증료/제세공과금 등 포함</dd>' : '		                        	<dd class="total_pay_result_info">유류할증료/제세공과금 포함</dd>',
                    M += '		                        	</dl> 		                       	<div class="bg_layer"></div> 		                    	</div> 		                	</div> 							<span class="txt_info"><span class="txt_state">' + h + "</span>" + l + '</span> 						</div> 					</div> 					<div class="trip_reservation_cell">                         <a href="' + m + '" class="sp_flight btn_reservation" target="_blank" onclick="clickcr(this, \'' + this._main + ".otabook', '', '" + (g + 1) + "', event);\">예약</a>                     </div> 				</li>",
                    d.push(M)
            }
            if (this._loadingArea.css("display", "none"),
                    this._detailTitleDesc.html("선택하신 여정의 항공편을 아래 여행사에서 예약하세요."),
                    this._detailList.html(d.join("")),
                    this._detailList.css("display", "block"),
                    this._tripInfoArea.css("display", "block"),
                e > 0) {
                if (f)
                    var N = '<span class="sp_flight txt_promotion_copy1">네이버 항공권</span>';
                else
                    var N = '<span class="sp_flight txt_promotion_copy1_v2">네이버 항공권 최대</span>';
                for (var O = new String(e), P = /(-?[0-9]+)([0-9]{3})/; P.test(O); )
                    O = O.replace(P, "$1,$2");
                for (var Q = 0; Q < O.length; Q++)
                    N += "," == O[Q] ? '<span class="sp_flight txt_promotion_comma">,</span>' : '<span class="sp_flight txt_promotion_num' + O[Q] + '">' + O[Q] + "</span>";
                N += '<span class="sp_flight txt_promotion_won">원</span><span class="sp_flight txt_promotion_copy2">추가할인이 적용된 항공편입니다. (성인, 소아 기준)</span>',
                    this._promotionTitle.html(N),
                    this._promotionTitle.css("display", "block")
            } else
                this._promotionTitle.css("display", "none");
            $Element(this._detailArea.query("div.trip_btn_box a:nth-child(2)")).fireEvent("click")
        },
        _onOverDetailPrice: function(a) {
            var b = a.element
                , c = $Element(b);
            null  != this._detailList.query("div.ly_total_pay_on") && ($Element(this._detailList.query("div.ly_total_pay_on")).css("display", "none").removeClass("ly_total_pay_on"),
                $Element(this._detailList.query("a.lnk_price_on")).removeClass("lnk_price_on")),
                c.addClass("lnk_price_on"),
                $Element(c.parent().query("div._target_total_pay")).css("display", "block").addClass("ly_total_pay_on")
        },
        _onOutDetailPrice: function(a) {
            var b = a.element
                , c = $Element(b);
            c.removeClass("lnk_price_on"),
                $Element(c.parent().query("div._target_total_pay")).css("display", "none").removeClass("ly_total_pay_on")
        },
        _onClickDetailViewType: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = c.attr("data-view");
            if ("total" == d ? clickcr(a.element, this._main + ".totalprice", "", "", a._event) : "adt" == d && clickcr(a.element, this._main + ".adult1price", "", "", a._event),
                    !c.hasClass("btn_trip_price_on")) {
                $Element(c.parent().query("a.btn_trip_price_on")).removeClass("btn_trip_price_on"),
                    c.addClass("btn_trip_price_on");
                for (var e = this._detailList.queryAll("span.txt_pay_ch"), f = 0; f < e.length; f++)
                    $Element(e[f]).css("display", "none");
                e = this._detailList.queryAll("span." + d);
                for (var f = 0; f < e.length; f++)
                    $Element(e[f]).css("display", "inline-block");
                var g = this._detailList.queryAll("div._total_pay")
                    , h = this._detailList.queryAll("div._adt_pay");
                if ("total" == d) {
                    for (var f = 0; f < g.length; f++)
                        $Element(g[f]).addClass("_target_total_pay");
                    for (var f = 0; f < g.length; f++)
                        $Element(h[f]).removeClass("_target_total_pay")
                } else if ("adt" == d) {
                    for (var f = 0; f < g.length; f++)
                        $Element(g[f]).removeClass("_target_total_pay");
                    for (var f = 0; f < g.length; f++)
                        $Element(h[f]).addClass("_target_total_pay")
                }
            }
        },
        _makePriceString: function(a) {
            for (var b = new String(a), c = /(-?[0-9]+)([0-9]{3})/; c.test(b); )
                b = b.replace(c, "$1,$2");
            return b
        },
        _makeStringPrice: function(a) {
            for (var b = a.split(","), c = "", d = 0; d < b.length; d++)
                c += b[d];
            return c
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter = jindo.$Class({
        _config: null ,
        _oAjax: null ,
        _oFlightsList: null ,
        _oSearchParam: null ,
        _isDomestic: null ,
        _temp: null ,
        $init: function() {
            this._config = pc.naver.search.config,
                this._isDomestic = this._config.flightData.isDomestic,
                this._assignElement(),
                this._assignEvent(),
                this._makeFilterSort(),
                this._makeFilterAirline(),
                this._makeFilterDepartureTime(),
                this._makeFilterArrivalTime(),
                this._makeFilterTakeTime(),
                this._makeFilterWay(),
                this._makeFilterPriceRange(),
                this._makeFilterFare(),
                this._makeFilterSeat(),
                this._makeFilterSeatType(),
                this._makeFilterBar()
        },
        _assignElement: function() {
            var a = $Element(document.body);
            this._welContentArea = $Element(a.query("div.content")),
                this._welOneFilterCon = $Element(this._welContentArea.query("._departure_list")),
                this._welTwoFilterCon = $Element(this._welContentArea.query("._arrival_list")),
                this._welThreeFilterCon = $Element(this._welContentArea.query("._trip3_list")),
                this._welOneFilterContainer = $Element(this._welContentArea.query("._departure_list .trip_filter")),
                this._welTwoFilterContainer = $Element(this._welContentArea.query("._arrival_list .trip_filter")),
                this._welThreeFilterContainer = $Element(this._welContentArea.query("._trip3_list .trip_filter")),
                this._welFilterContainer = $Element(this._welContentArea.query("._departure_list ul.trip_filter_list")),
                this._welFilterBarContainer = $Element(this._welContentArea.query("._departure_list .trip_banner ._bar_container")),
                this._welOneFilterArea = $Element(this._welContentArea.query("._departure_list .trip_banner")),
                this._welTwoFilterArea = $Element(this._welContentArea.query("._arrival_list .trip_banner")),
                this._welThreeFilterArea = $Element(this._welContentArea.query("._trip3_list .trip_banner")),
                this._welFilterFlight = $Element(this._welFilterContainer.query(".filter_flight")),
                this._welFilterDepartureTime = $Element(this._welFilterContainer.query(".filter_departure_time")),
                this._welFilterTakeTime = $Element(this._welFilterContainer.query(".filter_required_time")),
                this._welFilterArrivalTime = $Element(this._welFilterContainer.query(".filter_arrived_time")),
                this._welFilterWay = $Element(this._welFilterContainer.query(".filter_way_type")),
                this._welFilterSeat = $Element(this._welFilterContainer.query(".filter_seat")),
                this._welFilterSeatType = $Element(this._welFilterContainer.query(".filter_seat_type")),
                this._welFilterFare = $Element(this._welFilterContainer.query(".filter_pay_term")),
                this._welFilterPriceRange = $Element(this._welFilterContainer.query(".filter_price")),
                this._welFilterBar = $Element(this._welContentArea.query(".trip_banner")),
                this._welLayerSort = $Element(this._welFilterBar.query(".ly_filter")),
                this._welLayerAirline = $Element(this._welFilterFlight.query(".ly_filter")),
                this._welLayerDepartureTime = $Element(this._welFilterDepartureTime.query(".ly_filter")),
                this._welLayerArrivalTime = $Element(this._welFilterArrivalTime.query(".ly_filter")),
                this._welLayerTakeTime = $Element(this._welFilterTakeTime.query(".ly_filter")),
                this._welLayerWay = $Element(this._welFilterWay.query(".ly_filter")),
                this._welLayerSeat = $Element(this._welFilterSeat.query(".ly_filter")),
                this._welLayerSeatType = $Element(this._welFilterSeatType.query(".ly_filter")),
                this._welLayerFare = $Element(this._welFilterFare.query(".ly_filter")),
                this._welLayerPriceRange = $Element(this._welFilterPriceRange.query(".ly_filter"))
        },
        _showHideFilterMenu: function(a) {
            0 == a || 0 == a ? (this._welFilterTakeTime.show(),
                this._welFilterSeat.show(),
                this._welFilterSeatType.hide(),
                this._welFilterFare.show(),
                this._welFilterWay.show(),
                this._welOneFilterCon.removeClass("domestic_flight_area"),
                this._welTwoFilterCon.removeClass("domestic_flight_area"),
                this._welThreeFilterCon.removeClass("domestic_flight_area")) : (1 == a || 1 == a) && (this._welFilterTakeTime.hide(),
                this._welFilterSeat.hide(),
                this._welFilterSeatType.show(),
                this._welFilterFare.hide(),
                this._welFilterWay.hide(),
                this._welOneFilterCon.addClass("domestic_flight_area"),
                this._welTwoFilterCon.addClass("domestic_flight_area"),
                this._welThreeFilterCon.addClass("domestic_flight_area"))
        },
        _assignEvent: function() {
            this._dClickFilterFlight = this._welFilterFlight.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterDepartureTime = this._welFilterDepartureTime.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterTakeTime = this._welFilterTakeTime.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterArrivalTime = this._welFilterArrivalTime.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterWay = this._welFilterWay.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterSeat = this._welFilterSeat.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterSeatType = this._welFilterSeatType.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterFare = this._welFilterFare.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._dClickFilterPriceRange = this._welFilterPriceRange.delegate("click", ".btn_trip_filter", $Fn(this._onClickFilterItem, this).bind()),
                this._fMouseDownDocument = $Fn(this._onMouseDownDocument, this)
        },
        departurefilterRender: function(a, b, c, d) {
            this._welOneFilterContainer.append(this._welFilterContainer.$value()),
                this._welOneFilterArea.append(this._welFilterBarContainer.$value()),
                0 == b || 0 == b ? this._isDomestic = !1 : (1 == b || 1 == b) && (this._isDomestic = !0),
                this._showHideFilterMenu(b);
            var e = {
                oData: a,
                isDomestic: this._isDomestic,
                trip: c,
                sAirline: d
            };
            this._oFilterAirline.initList("one", e),
                this._oFilterDepartureTime.initList("one", e),
                this._oFilterArrivalTime.initList("one", e),
                this._oFilterPriceRange.initSlider("one", e),
                this._oFilterSort.initList("one", e),
                0 == b || 0 == b ? (this._oFilterSeat.initList("one", e),
                    this._oFilterTakeTime.initSlider("one", e),
                    this._oFilterFare.initList("one", e),
                    this._oFilterWay.initList("one", e)) : (1 == b || 1 == b) && this._oFilterSeatType.initList("one", e),
                this._oFilterBar.setIsDomestic(b),
                this._setFilterBar()
        },
        setOneBackStatus: function() {
            this._welOneFilterContainer.append(this._welFilterContainer.$value()),
                this._welOneFilterArea.append(this._welFilterBarContainer.$value()),
                this._oFilterAirline.initList("oneBack", null ),
                this._oFilterDepartureTime.initList("oneBack", null ),
                this._oFilterArrivalTime.initList("oneBack", null ),
                this._oFilterPriceRange.initSlider("oneBack", null ),
                this._oFilterSort.initList("oneBack", null ),
                0 == this._isDomestic || 0 == this._isDomestic ? (this._oFilterTakeTime.initSlider("oneBack", null ),
                    this._oFilterFare.initList("oneBack", null ),
                    this._oFilterWay.initList("oneBack", null ),
                    this._oFilterSeat.initList("oneBack", null )) : (1 == this._isDomestic || 1 == this._isDomestic) && this._oFilterSeatType.initList("oneBack", null ),
                this._setFilterBar()
        },
        setTwoStatus: function(a) {
            this._welTwoFilterContainer.append(this._welFilterContainer.$value()),
                this._welTwoFilterArea.append(this._welFilterBarContainer.$value()),
                this._oFilterAirline.initList("two", a),
                this._oFilterDepartureTime.initList("two", a),
                this._oFilterArrivalTime.initList("two", a),
                this._oFilterPriceRange.initSlider("two", a),
                this._oFilterSort.initList("two", a),
                0 == this._isDomestic || 0 == this._isDomestic ? (this._oFilterFare.initList("two", a),
                    this._oFilterTakeTime.initSlider("two", a),
                    this._oFilterWay.initList("two", a),
                    this._oFilterSeat.initList("two", a)) : (1 == this._isDomestic || 1 == this._isDomestic) && this._oFilterSeatType.initList("two", a),
                this._setFilterBar()
        },
        setTwoBackStatus: function() {
            this._welTwoFilterContainer.append(this._welFilterContainer.$value()),
                this._welTwoFilterArea.append(this._welFilterBarContainer.$value()),
                this._oFilterAirline.initList("twoBack", null ),
                this._oFilterDepartureTime.initList("twoBack", null ),
                this._oFilterArrivalTime.initList("twoBack", null ),
                this._oFilterPriceRange.initSlider("twoBack", null ),
                this._oFilterSort.initList("twoBack", null ),
                0 == this._isDomestic || 0 == this._isDomestic ? (this._oFilterFare.initList("twoBack", null ),
                    this._oFilterTakeTime.initSlider("twoBack", null ),
                    this._oFilterWay.initList("twoBack", null ),
                    this._oFilterSeat.initList("twoBack", null )) : (1 == this._isDomestic || 1 == this._isDomestic) && this._oFilterSeatType.initList("twoBack", null ),
                this._setFilterBar()
        },
        setThreeStatus: function(a) {
            this._welThreeFilterContainer.append(this._welFilterContainer.$value()),
                this._welThreeFilterArea.append(this._welFilterBarContainer.$value()),
                this._oFilterAirline.initList("three", a),
                this._oFilterDepartureTime.initList("three", a),
                this._oFilterArrivalTime.initList("three", a),
                this._oFilterTakeTime.initSlider("three", a),
                this._oFilterPriceRange.initSlider("three", a),
                this._oFilterSort.initList("three", a),
                this._oFilterFare.initList("three", a),
                this._oFilterWay.initList("three", a),
                this._oFilterSeat.initList("three", a),
                this._setFilterBar()
        },
        setThreeBackStatus: function() {
            this._oFilterAirline.initList("threeBack", null ),
                this._oFilterDepartureTime.initList("threeBack", null ),
                this._oFilterArrivalTime.initList("threeBack", null ),
                this._oFilterTakeTime.initSlider("threeBack", null ),
                this._oFilterPriceRange.initSlider("threeBack", null ),
                this._oFilterSort.initList("threeBack", null ),
                this._oFilterFare.initList("threeBack", null ),
                this._oFilterWay.initList("threeBack", null ),
                this._oFilterSeat.initList("threeBack", null ),
                this._setFilterBar()
        },
        _setFilterBar: function() {
            if (0 == this._isDomestic || 0 == this._isDomestic) {
                var a = this._oFilterAirline.getSelectedValue()
                    , b = this._oFilterDepartureTime.getSelectedValue()
                    , c = this._oFilterTakeTime.getSelectedValue()
                    , d = this._oFilterArrivalTime.getSelectedValue()
                    , e = this._oFilterWay.getSelectedValue()
                    , f = this._oFilterSeat.getSelectedValue()
                    , g = this._oFilterFare.getSelectedValue()
                    , h = this._oFilterPriceRange.getSelectedValue()
                    , i = [];
                i[0] = a,
                    i[1] = b,
                    i[2] = c,
                    i[3] = d,
                    i[4] = e,
                    i[5] = f,
                    i[6] = g,
                    i[7] = h
            } else if (1 == this._isDomestic || 1 == this._isDomestic) {
                var a = this._oFilterAirline.getSelectedValue()
                    , b = this._oFilterDepartureTime.getSelectedValue()
                    , d = this._oFilterArrivalTime.getSelectedValue()
                    , j = this._oFilterSeatType.getSelectedValue()
                    , h = this._oFilterPriceRange.getSelectedValue()
                    , i = [];
                i[0] = a,
                    i[1] = b,
                    i[2] = d,
                    i[3] = j,
                    i[4] = h
            }
            this._oFilterBar.drawList(i)
        },
        _makeFilterBar: function() {
            this._oFilterBar = new pc.naver.service.Filter.FilterBar(this._welFilterBar),
                this._oFilterBar.attach({
                    showLayer: $Fn(function() {}, this).bind()
                })
        },
        _makeFilterSort: function() {
            this._oFilterSort = new pc.naver.service.Filter.Sort(this._welFilterBar),
                this._oFilterSort.attach({
                    changeItem: $Fn(function(a) {
                        this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind()
                })
        },
        _makeFilterAirline: function() {
            this._oFilterAirline = new pc.naver.service.Filter.Airline(this._welLayerAirline),
                this._oFilterAirline.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind(),
                    closeLayer: $Fn(function() {
                        this._hideLayer()
                    }, this).bind()
                })
        },
        _makeFilterDepartureTime: function() {
            this._oFilterDepartureTime = new pc.naver.service.Filter.DepartureTime(this._welLayerDepartureTime),
                this._oFilterDepartureTime.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind(),
                    closeLayer: $Fn(function() {
                        this._hideLayer()
                    }, this).bind()
                })
        },
        _makeFilterArrivalTime: function() {
            this._oFilterArrivalTime = new pc.naver.service.Filter.ArrivalTime(this._welLayerArrivalTime),
                this._oFilterArrivalTime.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind(),
                    closeLayer: $Fn(function() {
                        this._hideLayer()
                    }, this).bind()
                })
        },
        _makeFilterTakeTime: function() {
            this._oFilterTakeTime = new pc.naver.service.Filter.TakeTime(this._welLayerTakeTime),
                this._oFilterTakeTime.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind()
                })
        },
        _makeFilterWay: function() {
            this._oFilterWay = new pc.naver.service.Filter.Way(this._welLayerWay),
                this._oFilterWay.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind(),
                    closeLayer: $Fn(function() {
                        this._hideLayer()
                    }, this).bind()
                })
        },
        _makeFilterSeat: function() {
            this._oFilterSeat = new pc.naver.service.Filter.Seat(this._welLayerSeat),
                this._oFilterSeat.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind(),
                    closeLayer: $Fn(function() {
                        this._hideLayer()
                    }, this).bind()
                })
        },
        _makeFilterSeatType: function() {
            this._oFilterSeatType = new pc.naver.service.Filter.SeatType(this._welLayerSeatType),
                this._oFilterSeatType.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind(),
                    closeLayer: $Fn(function() {
                        this._hideLayer()
                    }, this).bind()
                })
        },
        _makeFilterFare: function() {
            this._oFilterFare = new pc.naver.service.Filter.Fare(this._welLayerFare),
                this._oFilterFare.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind(),
                    closeLayer: $Fn(function() {
                        this._hideLayer()
                    }, this).bind()
                })
        },
        _makeFilterPriceRange: function() {
            this._oFilterPriceRange = new pc.naver.service.Filter.PriceRange(this._welLayerPriceRange),
                this._oFilterPriceRange.attach({
                    changeItem: $Fn(function(a) {
                        this._setFilterBar(),
                            this.fireEvent("changeItem", a),
                            this._sendClickCr(a, "filter")
                    }, this).bind()
                })
        },
        _onClickFilterItem: function(a) {
            var b = a.element.parentNode
                , c = $Element(b);
            if (c.hasClass("trip_filter_item_on"))
                return void c.removeClass("trip_filter_item_on");
            var d = this._welFilterContainer.query("li.trip_filter_item_on");
            d && $Element(d).removeClass("trip_filter_item_on"),
                c.addClass("trip_filter_item_on"),
                this._detachEventDocument(),
                this._attachEventDocument();
            var e = {
                filterName: c.attr("data-filter-name"),
                we: a
            };
            this._sendClickCr(e, "menu")
        },
        _onMouseDownDocument: function(a) {
            var b = a.element;
            if (b) {
                var c = $Element(b).isChildOf(this._welFilterFlight.$value())
                    , d = $Element(b).isChildOf(this._welFilterDepartureTime.$value())
                    , e = $Element(b).isChildOf(this._welFilterTakeTime.$value())
                    , f = $Element(b).isChildOf(this._welFilterArrivalTime.$value())
                    , g = $Element(b).isChildOf(this._welFilterWay.$value())
                    , h = $Element(b).isChildOf(this._welFilterSeat.$value())
                    , i = $Element(b).isChildOf(this._welFilterSeatType.$value())
                    , j = $Element(b).isChildOf(this._welFilterFare.$value())
                    , k = $Element(b).isChildOf(this._welFilterPriceRange.$value());
                c || d || e || f || g || h || i || j || k || this._hideLayer()
            }
        },
        _hideLayer: function() {
            var a = this._welFilterContainer.query("li.trip_filter_item_on");
            a && $Element(a).removeClass("trip_filter_item_on"),
                this._detachEventDocument()
        },
        _attachEventDocument: function() {
            this._fMouseDownDocument.attach(document, "mousedown")
        },
        _detachEventDocument: function() {
            this._fMouseDownDocument.detach(document, "mousedown")
        },
        _sendClickCr: function(a, b) {
            if ("filter" == b) {
                var c = a.oChangeItem.we
                    , d = a.oChangeItem.filterName
                    , e = a.oChangeItem.code;
                if (0 == this._isDomestic || 0 == this._isDomestic)
                    var f = "ift";
                else if (1 == this._isDomestic || 1 == this._isDomestic)
                    var f = "dft";
                var g = "";
                if ("FilterAirV" == d)
                    g = "all" == e ? "airlineall" : "airlinesel";
                else if ("FilterDepartureTm" == d) {
                    var h = a.oChangeItem.route;
                    if ("one" == h ? g = "dep1" : "two" == h ? g = "dep2" : "three" == h && (g = "dep3"),
                        "all" == e)
                        g += e;
                    else {
                        var i = e.split("/")[1];
                        g += i
                    }
                } else if ("FilterJrnyTm" == d) {
                    var h = a.oChangeItem.route;
                    "one" == h ? g = "tm1dur" : "two" == h ? g = "tm2dur" : "three" == h && (g = "tm3dur")
                } else if ("FilterArrivalTm" == d) {
                    var h = a.oChangeItem.route;
                    if ("one" == h ? g = "arr1" : "two" == h ? g = "arr2" : "three" == h && (g = "arr3"),
                        "all" == e)
                        g += e;
                    else {
                        var i = e.split("/")[1];
                        g += i
                    }
                } else
                    "FilterWay" == d ? "0" == e ? g = "nonstop" : "1" == e ? g = "1stop" : "2" == e ? g = "2stops" : "all" == e && (g = "allstops") : "FilterSeat" == d ? "all" == e ? g = "allseats" : "0" == e ? g = "avail" : "1" == e && (g = "wait") : "FilterSeatType" == d ? "all" == e ? g = "class" : "Y" == e ? g = "economy" : "D" == e ? g = "event" : "C" == e && (g = "business") : "FilterFareType" == d ? g = "all" == e ? "allcond" : "selcond" : "FilterSaleFare" == d ? g = "price" : "sort" == d && (0 == this._isDomestic || 0 == this._isDomestic ? f = "ist" : (1 == this._isDomestic || 1 == this._isDomestic) && (f = "dst"),
                        "가격 높은순" == e || "가격 낮은순" == e ? g = "price" : "출발시각 빠른순" == e || "출발시각 늦은순" == e ? g = "deptime" : "도착시각 빠른순" == e || "도착시각 늦은순" == e ? g = "arrtime" : "소요시간 짧은순" == e || "소요시간 긴순" == e ? g = "duration" : ("항공사 오름차순" == e || "항공사 내림차순" == e) && (g = "airline"))
            } else if ("menu" == b) {
                var c = a.we
                    , d = a.filterName
                    , f = ""
                    , g = "";
                0 == this._isDomestic || 0 == this._isDomestic ? f = "isr" : (1 == this._isDomestic || 1 == this._isDomestic) && (f = "dsr"),
                    "airline" == d ? g = "airline" : "departuretime" == d ? g = "deptime" : "taketime" == d ? g = "duration" : "arrivaltime" == d ? g = "arrtime" : "way" == d ? g = "stops" : "seat" == d ? g = "avail" : "seattype" == d ? g = "class" : "fare" == d ? g = "condition" : "pricerange" == d && (g = "price")
            }
            clickcr(c.element, f + "." + g, "", "", c._event)
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.Airline = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        _sSelectAirline: "",
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            this._welUL = $Element(this._welLayer.query("ul.filter_list"))
        },
        _assignEvent: function() {
            this._dClickItem = this._welUL.delegate("click", ".filter_item", $Fn(this._onClickItem, this).bind())
        },
        _onClickItem: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = c.attr("data_code")
                , e = "filter_item_on"
                , f = $Element($$.getSingle("[data_code=all]", this._welUL.$value()))
                , g = {
                filterName: "FilterAirV",
                code: null ,
                check: null ,
                step: this._sStep,
                we: a
            };
            if ("all" == d) {
                for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                    $Element(h[i]).removeClass(e);
                c.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null )
            } else if (1 == c.hasClass(e)) {
                c.removeClass(e),
                    g.code = d,
                    g.check = !1;
                var h = this._welUL.queryAll("." + e);
                0 == h.length && (f.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null ))
            } else
                c.addClass(e),
                    f.removeClass(e),
                    g.code = d,
                    g.check = !0;
            for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                this._aNowData[i].check = 1 == $Element(h[i]).hasClass(e) ? !0 : !1;
            this.fireEvent("changeItem", {
                oChangeItem: g
            })
        },
        initList: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a) {
                this._isDomestic = b.isDomestic;
                var c = b.oData.FilterAirV;
                if (this._aNowData = this._makeData(c, []),
                        this._aOneData = this._aNowData,
                    "" != b.sAirline) {
                    for (var d = 0; d < this._aNowData.length; d++)
                        this._aNowData[d].check = this._aNowData[d].code == b.sAirline ? !0 : !1;
                    this._sSelectAirline = b.sAirline
                } else
                    this._sSelectAirline = ""
            } else if ("two" == a) {
                var c = b.oData.FilterAirV;
                if (this._aNowData = this._makeData(c, []),
                    (1 == this._isDomestic || 1 == this._isDomestic) && "" != this._sSelectAirline)
                    for (var d = 0; d < this._aNowData.length; d++)
                        this._aNowData[d].check = this._aNowData[d].code == this._sSelectAirline ? !0 : !1;
                this._aTwoData = this._aNowData
            } else if ("three" == a) {
                var c = b.oData.FilterAirV;
                this._aNowData = this._makeData(c, []),
                    this._aThreeData = this._aNowData
            } else
                "oneBack" == a ? this._aNowData = this._aOneData : "twoBack" == a ? this._aNowData = this._aTwoData : "threeBack" == a && (this._aNowData = this._aThreeData);
            var e = this._makeHTML(this._aNowData);
            this._welUL.html(e)
        },
        _makeHTML: function() {
            for (var a = "filter_item_on", b = "", c = this._aNowData, d = [], e = 0; e < c.length; e++)
                0 != e && d.push(c[e].name);
            d = d.sort(),
                this._aNowData = [],
                this._aNowData.push(c[0]);
            for (var e = 0; e < d.length; e++)
                for (var f = 0; f < c.length; f++)
                    d[e] == c[f].name && this._aNowData.push(c[f]);
            for (var e = 0; e < this._aNowData.length; e++) {
                var g = '<li class="filter_item {isCheck}" data_code="' + this._aNowData[e].code + '" data_air_name="' + this._aNowData[e].name + '"><span class="sp_flight ico_check"></span>' + this._aNowData[e].name + "</li>";
                g = 1 == this._aNowData[e].check ? g.replace("{isCheck}", a) : g.replace("{isCheck}", ""),
                    b += g
            }
            return b
        },
        _makeData: function(a, b) {
            b.push({
                code: "all",
                name: "전체",
                check: !0
            });
            for (var c in a)
                b.push({
                    code: c,
                    name: a[c],
                    check: !1
                });
            return b
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        getSelectedValue: function() {
            var a = {};
            a.filterName = "항공사",
                a.filterCode = "airline";
            var b = $Element(this._welUL.query("[data_code=all]"));
            if (1 == b.hasClass("filter_item_on"))
                a.filterDesc = "all";
            else {
                var c = this._welUL.queryAll(".filter_item_on");
                if (0 == c.length)
                    return a.filterDesc = "none",
                        a;
                var d = $Element(c[0]);
                a.filterDesc = d.attr("data_air_name"),
                c.length >= 2 && (a.filterDesc += " 외 " + (c.length - 1) + "개")
            }
            return a
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.ArrivalTime = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {},
        _assignEvent: function() {
            this._dClickItem = this._welLayer.delegate("click", ".filter_item", $Fn(this._onClickItem, this).bind())
        },
        _onClickItem: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = b.parentNode
                , e = $Element(d)
                , f = $Element($$.getSingle("[data_time=all]", d))
                , g = c.attr("data_time")
                , h = e.attr("data_order")
                , i = "filter_item_on"
                , j = {
                filterName: "FilterArrivalTm",
                route: null ,
                code: null ,
                check: null ,
                step: this._sStep,
                we: a
            };
            if ("all" == g) {
                for (var k = e.queryAll(".filter_item"), l = 0; l < k.length; l++)
                    $Element(k[l]).removeClass(i);
                c.addClass(i),
                    j.route = h,
                    j.code = "all",
                    j.check = !0
            } else if (1 == c.hasClass(i)) {
                c.removeClass(i),
                    j.route = h,
                    j.code = g,
                    j.check = !1;
                var k = e.queryAll("." + i);
                0 == k.length && (f.addClass(i),
                    j.route = h,
                    j.code = "all",
                    j.check = !0)
            } else
                c.addClass(i),
                    f.removeClass(i),
                    j.route = h,
                    j.code = g,
                    j.check = !0;
            var m = this._welLayer.query("._one_list")
                , n = this._welLayer.query("._two_list")
                , o = this._welLayer.query("._three_list");
            m && this._saveCheckItem(m, this._aNowData[0]),
            n && (this._saveCheckItem(n, this._aNowData[1]),
            ("two" == this._sStatus || "twoBack" == this._sStatus) && this._copyObject(this._aNowData[1], this._aOneData[1])),
            o && this._saveCheckItem(o, this._aNowData[2]),
                this.fireEvent("changeItem", {
                    oChangeItem: j
                })
        },
        initList: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a) {
                var c = b.isDomestic;
                this._isDomestic = c,
                    this._trip = b.trip,
                    0 == c || 0 == c ? this._addOutHtml(this._trip) : (1 == c || 1 == c) && this._addInHtml(this._trip),
                    this._aNowData = [];
                for (var d = this._welLayer.queryAll("._route"), e = 0; e < d.length; e++) {
                    var f = $Element(d[e]).queryAll("li");
                    this._aNowData[e] = [];
                    for (var g = 0; g < f.length; g++) {
                        var h = $Element(f[g])
                            , b = {
                            code: h.attr("data_time"),
                            name: "",
                            check: h.hasClass("filter_item_on")
                        };
                        this._aNowData[e][g] = b
                    }
                }
                this._aOneData = this._aNowData,
                    this._aTwoData = this._copyArray(this._aNowData),
                    this._aThreeData = this._copyArray(this._aNowData),
                    this._welOneAll = $Element($$.getSingle("._one_list [data_time=all]", this._welLayer.$value())),
                    this._welTwoAll = $Element($$.getSingle("._two_list [data_time=all]", this._welLayer.$value())),
                    this._welThreeAll = $Element($$.getSingle("._three_list [data_time=all]", this._welLayer.$value()))
            } else
                "two" == a ? this._aNowData = this._aTwoData : "three" == a ? this._aNowData = this._aThreeData : "oneBack" == a ? this._aNowData = this._aOneData : "twoBack" == a ? this._aNowData = this._aTwoData : "threeBack" == a && (this._aNowData = this._aThreeData);
            this._showHideRoute(a),
                this._showHideItem(a, this._aNowData)
        },
        _showHideItem: function(a) {
            var b = (this._welLayer.query("._one_list"),
                this._welLayer.query("._two_list"))
                , c = this._welLayer.query("._three_list")
                , d = "filter_item_on";
            if ("MD" == this._trip) {
                if ("one" == a || "oneBack" == a)
                    for (var e = this._welLayer.queryAll(".filter_item"), f = 0; f < e.length; f++)
                        $Element(e[f]).show();
                else if ("two" == a)
                    for (var e = $Element(b).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                        var g = $Element(e[f]);
                        "all" == g.attr("data_time") ? g.addClass(d) : g.removeClass(d)
                    }
                else if ("three" == a)
                    for (var e = $Element(c).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                        var g = $Element(e[f]);
                        "all" == g.attr("data_time") ? g.addClass(d) : g.removeClass(d)
                    }
            } else {
                var h = "ly_filter_route_box"
                    , i = this._welLayer.queryAll("._route");
                if ("one" == a || "oneBack" == a)
                    for (var f = 0; f < i.length; f++)
                        $Element(i[f]).addClass(h);
                else
                    for (var f = 0; f < i.length; f++)
                        $Element(i[f]).removeClass(h)
            }
        },
        _checkIt: function() {
            var a = this._welLayer.query("._one_list")
                , b = this._welLayer.query("._two_list")
                , c = this._welLayer.query("._three_list")
                , d = "filter_item_on";
            if (a)
                for (var e = $Element(a).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                    var g = $Element(e[f]);
                    1 == this._aNowData[0][f].check ? g.addClass(d) : g.removeClass(d)
                }
            if (b)
                for (var e = $Element(b).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                    var g = $Element(e[f]);
                    1 == this._aNowData[1][f].check ? g.addClass(d) : g.removeClass(d)
                }
            if (c)
                for (var e = $Element(c).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                    var g = $Element(e[f]);
                    1 == this._aNowData[2][f].check ? g.addClass(d) : g.removeClass(d)
                }
        },
        _saveCheckItem: function(a, b) {
            for (var c = "filter_item_on", d = $Element(a).queryAll(".filter_item"), e = 0; e < d.length; e++)
                b[e].check = 1 == $Element(d[e]).hasClass(c) ? !0 : !1
        },
        _showHideRoute: function(a) {
            var b = this._welLayer.query("._one_list")
                , c = this._welLayer.query("._two_list")
                , d = this._welLayer.query("._three_list");
            "MD" == this._trip ? "one" == a || "oneBack" == a ? (b.style.display = "block",
                c.style.display = "none",
                d.style.display = "none") : "two" == a || "twoBack" == a ? (b.style.display = "none",
                c.style.display = "block",
                d.style.display = "none") : ("three" == a || "three" == a) && (b.style.display = "none",
                c.style.display = "none",
                d.style.display = "block") : "one" == a || "oneBack" == a ? (b.style.display = "block",
            c && (c.style.display = "block"),
            d && (d.style.display = "block"),
                this._checkIt()) : "two" == a || "twoBack" == a ? (b.style.display = "none",
                c.style.display = "block",
            d && (d.style.display = "none")) : ("three" == a || "threeBack" == a) && (b.style.display = "none",
                c.style.display = "none",
                d.style.display = "block")
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _addOutHtml: function(a) {
            var b = '<div class="{where} _route">';
            b += '<strong class="filter_list_title">{title}</strong>',
                b += '<ul class="filter_list" data_order="{order}">',
                b += '<li class="filter_item filter_item_on" data_time="all"><span class="sp_flight ico_check"></span>전체</li>',
                b += '<li class="filter_item" data_time="00/06"><span class="sp_flight ico_check"></span>00:00 - 06:00</li>',
                b += '<li class="filter_item" data_time="06/12"><span class="sp_flight ico_check"></span>06:00 - 12:00</li>',
                b += '<li class="filter_item" data_time="12/18"><span class="sp_flight ico_check"></span>12:00 - 18:00</li>',
                b += '<li class="filter_item" data_time="18/24"><span class="sp_flight ico_check"></span>18:00 - 24:00</li>',
                b += "</ul>",
                b += "</div>";
            var c = "";
            "OW" == a ? (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one")) : "RT" == a ? (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one"),
                c += b,
                c = c.replace("{where}", "_two_list"),
                c = c.replace("{title}", "오는날"),
                c = c.replace("{order}", "two")) : "MD" == a && (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "여정 1"),
                c = c.replace("{order}", "one"),
                c += b,
                c = c.replace("{where}", "_two_list"),
                c = c.replace("{title}", "여정 2"),
                c = c.replace("{order}", "two"),
                c += b,
                c = c.replace("{where}", "_three_list"),
                c = c.replace("{title}", "여정 3"),
                c = c.replace("{order}", "three")),
                this._welLayer.html(c)
        },
        _addInHtml: function(a) {
            var b = '<div class="{where} _route">';
            b += '<strong class="filter_list_title">{title}</strong>',
                b += '<ul class="filter_list" data_order="{order}">',
                b += '<li class="filter_item filter_item_on" data_time="all"><span class="sp_flight ico_check"></span>전체</li>',
                b += '<li class="filter_item" data_time="00/06"><span class="sp_flight ico_check"></span>00:00 - 06:00</li>',
                b += '<li class="filter_item" data_time="06/09"><span class="sp_flight ico_check"></span>06:00 - 09:00</li>',
                b += '<li class="filter_item" data_time="09/12"><span class="sp_flight ico_check"></span>09:00 - 12:00</li>',
                b += '<li class="filter_item" data_time="12/15"><span class="sp_flight ico_check"></span>12:00 - 15:00</li>',
                b += '<li class="filter_item" data_time="15/18"><span class="sp_flight ico_check"></span>15:00 - 18:00</li>',
                b += '<li class="filter_item" data_time="18/24"><span class="sp_flight ico_check"></span>18:00 - 24:00</li>',
                b += "</ul>",
                b += "</div>";
            var c = "";
            "OW" == a ? (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one")) : "RT" == a && (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one"),
                c += b,
                c = c.replace("{where}", "_two_list"),
                c = c.replace("{title}", "오는날"),
                c = c.replace("{order}", "two")),
                this._welLayer.html(c)
        },
        _copyObject: function(a, b) {
            if ("undefined" != typeof a) {
                for (var c = 0; c < a.length; c++) {
                    var d = a[c]
                        , e = {};
                    for (var f in d)
                        e[f] = d[f];
                    b[c] = e
                }
                return b
            }
        },
        _copyArray: function(a) {
            for (var b = [], c = 0; c < a.length; c++) {
                var d = a[c];
                b[c] = [];
                for (var e = 0; e < d.length; e++) {
                    var f = d[e]
                        , g = {};
                    for (var h in f)
                        g[h] = f[h];
                    b[c].push(g)
                }
            }
            return b
        },
        getSelectedValue: function() {
            var a = "filter_item_on"
                , b = {};
            b.filterName = "도착시간",
                b.filterCode = "arrivaltime";
            var c = this._sStatus
                , d = !0;
            if ("one" == c || "oneBack" == c)
                for (var e = this._welLayer.queryAll("[data_time=all]"), f = 0; f < e.length; f++)
                    0 == $Element(e[f]).hasClass(a) && (d = !1);
            else if ("two" == c || "twoBack" == c)
                var d = this._welTwoAll.hasClass(a) ? !0 : !1;
            else if ("three" == c || "threeBack" == c)
                var d = this._welThreeAll.hasClass(a) ? !0 : !1;
            return b.filterDesc = 1 == d ? "all" : "일부 도착시간",
                b
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.DepartureTime = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {},
        _assignEvent: function() {
            this._dClickItem = this._welLayer.delegate("click", ".filter_item", $Fn(this._onClickItem, this).bind())
        },
        _onClickItem: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = b.parentNode
                , e = $Element(d)
                , f = $Element($$.getSingle("[data_time=all]", d))
                , g = c.attr("data_time")
                , h = e.attr("data_order")
                , i = "filter_item_on"
                , j = {
                filterName: "FilterDepartureTm",
                route: null ,
                code: null ,
                check: null ,
                step: this._sStep,
                we: a
            };
            if ("all" == g) {
                for (var k = e.queryAll(".filter_item"), l = 0; l < k.length; l++)
                    $Element(k[l]).removeClass(i);
                c.addClass(i),
                    j.route = h,
                    j.code = "all",
                    j.check = !0
            } else if (1 == c.hasClass(i)) {
                c.removeClass(i),
                    j.route = h,
                    j.code = g,
                    j.check = !1;
                var k = e.queryAll("." + i);
                0 == k.length && (f.addClass(i),
                    j.route = h,
                    j.code = "all",
                    j.check = !0)
            } else
                c.addClass(i),
                    f.removeClass(i),
                    j.route = h,
                    j.code = g,
                    j.check = !0;
            var m = this._welLayer.query("._one_list")
                , n = this._welLayer.query("._two_list")
                , o = this._welLayer.query("._three_list");
            m && this._saveCheckItem(m, this._aNowData[0]),
            n && (this._saveCheckItem(n, this._aNowData[1]),
            ("two" == this._sStatus || "twoBack" == this._sStatus) && this._copyObject(this._aNowData[1], this._aOneData[1])),
            o && this._saveCheckItem(o, this._aNowData[2]),
                this.fireEvent("changeItem", {
                    oChangeItem: j
                })
        },
        initList: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a) {
                var c = b.isDomestic;
                this._isDomestic = c,
                    this._trip = b.trip,
                    0 == c || 1 == c ? this._addOutHtml(this._trip) : (1 == c || 1 == c) && this._addInHtml(this._trip),
                    this._aNowData = [];
                for (var d = this._welLayer.queryAll("._route"), e = 0; e < d.length; e++) {
                    var f = $Element(d[e]).queryAll("li");
                    this._aNowData[e] = [];
                    for (var g = 0; g < f.length; g++) {
                        var h = $Element(f[g])
                            , b = {
                            code: h.attr("data_time"),
                            name: "",
                            check: h.hasClass("filter_item_on")
                        };
                        this._aNowData[e][g] = b
                    }
                }
                this._aOneData = this._aNowData,
                    this._aTwoData = this._copyArray(this._aNowData),
                    this._aThreeData = this._copyArray(this._aNowData),
                    this._welOneAll = $Element($$.getSingle("._one_list [data_time=all]", this._welLayer.$value())),
                    this._welTwoAll = $Element($$.getSingle("._two_list [data_time=all]", this._welLayer.$value())),
                    this._welThreeAll = $Element($$.getSingle("._three_list [data_time=all]", this._welLayer.$value()))
            } else
                "two" == a ? this._aNowData = this._aTwoData : "three" == a ? this._aNowData = this._aThreeData : "oneBack" == a ? this._aNowData = this._aOneData : "twoBack" == a ? this._aNowData = this._aTwoData : "threeBack" == a && (this._aNowData = this._aThreeData);
            this._showHideRoute(a),
                this._showHideItem(a, this._aNowData)
        },
        _showHideItem: function(a) {
            var b = (this._welLayer.query("._one_list"),
                this._welLayer.query("._two_list"))
                , c = this._welLayer.query("._three_list")
                , d = "filter_item_on";
            if ("MD" == this._trip) {
                if ("one" == a || "oneBack" == a)
                    for (var e = this._welLayer.queryAll(".filter_item"), f = 0; f < e.length; f++)
                        $Element(e[f]).show();
                else if ("two" == a)
                    for (var e = $Element(b).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                        var g = $Element(e[f]);
                        "all" == g.attr("data_time") ? g.addClass(d) : g.removeClass(d)
                    }
                else if ("three" == a)
                    for (var e = $Element(c).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                        var g = $Element(e[f]);
                        "all" == g.attr("data_time") ? g.addClass(d) : g.removeClass(d)
                    }
            } else {
                var h = "ly_filter_route_box"
                    , i = this._welLayer.queryAll("._route");
                if ("one" == a || "oneBack" == a)
                    for (var f = 0; f < i.length; f++)
                        $Element(i[f]).addClass(h);
                else
                    for (var f = 0; f < i.length; f++)
                        $Element(i[f]).removeClass(h)
            }
        },
        _checkIt: function() {
            var a = this._welLayer.query("._one_list")
                , b = this._welLayer.query("._two_list")
                , c = this._welLayer.query("._three_list")
                , d = "filter_item_on";
            if (a)
                for (var e = $Element(a).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                    var g = $Element(e[f]);
                    1 == this._aNowData[0][f].check ? g.addClass(d) : g.removeClass(d)
                }
            if (b)
                for (var e = $Element(b).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                    var g = $Element(e[f]);
                    1 == this._aNowData[1][f].check ? g.addClass(d) : g.removeClass(d)
                }
            if (c)
                for (var e = $Element(c).queryAll(".filter_item"), f = 0; f < e.length; f++) {
                    var g = $Element(e[f]);
                    1 == this._aNowData[2][f].check ? g.addClass(d) : g.removeClass(d)
                }
        },
        _saveCheckItem: function(a, b) {
            for (var c = "filter_item_on", d = $Element(a).queryAll(".filter_item"), e = 0; e < d.length; e++)
                b[e].check = 1 == $Element(d[e]).hasClass(c) ? !0 : !1
        },
        _showHideRoute: function(a) {
            var b = this._welLayer.query("._one_list")
                , c = this._welLayer.query("._two_list")
                , d = this._welLayer.query("._three_list");
            "MD" == this._trip ? "one" == a || "oneBack" == a ? (b.style.display = "block",
                c.style.display = "none",
                d.style.display = "none") : "two" == a || "twoBack" == a ? (b.style.display = "none",
                c.style.display = "block",
                d.style.display = "none") : ("three" == a || "three" == a) && (b.style.display = "none",
                c.style.display = "none",
                d.style.display = "block") : "one" == a || "oneBack" == a ? (b.style.display = "block",
            c && (c.style.display = "block"),
            d && (d.style.display = "block"),
                this._checkIt()) : "two" == a || "twoBack" == a ? (b.style.display = "none",
                c.style.display = "block",
            d && (d.style.display = "none")) : ("three" == a || "threeBack" == a) && (b.style.display = "none",
                c.style.display = "none",
                d.style.display = "block")
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _addOutHtml: function(a) {
            var b = '<div class="{where} _route">';
            b += '<strong class="filter_list_title">{title}</strong>',
                b += '<ul class="filter_list" data_order="{order}">',
                b += '<li class="filter_item filter_item_on" data_time="all"><span class="sp_flight ico_check"></span>전체</li>',
                b += '<li class="filter_item" data_time="00/06"><span class="sp_flight ico_check"></span>00:00 - 06:00</li>',
                b += '<li class="filter_item" data_time="06/12"><span class="sp_flight ico_check"></span>06:00 - 12:00</li>',
                b += '<li class="filter_item" data_time="12/18"><span class="sp_flight ico_check"></span>12:00 - 18:00</li>',
                b += '<li class="filter_item" data_time="18/24"><span class="sp_flight ico_check"></span>18:00 - 24:00</li>',
                b += "</ul>",
                b += "</div>";
            var c = "";
            "OW" == a ? (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one")) : "RT" == a ? (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one"),
                c += b,
                c = c.replace("{where}", "_two_list"),
                c = c.replace("{title}", "오는날"),
                c = c.replace("{order}", "two")) : "MD" == a && (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "여정 1"),
                c = c.replace("{order}", "one"),
                c += b,
                c = c.replace("{where}", "_two_list"),
                c = c.replace("{title}", "여정 2"),
                c = c.replace("{order}", "two"),
                c += b,
                c = c.replace("{where}", "_three_list"),
                c = c.replace("{title}", "여정 3"),
                c = c.replace("{order}", "three")),
                this._welLayer.html(c)
        },
        _addInHtml: function(a) {
            var b = '<div class="{where} _route">';
            b += '<strong class="filter_list_title">{title}</strong>',
                b += '<ul class="filter_list" data_order="{order}">',
                b += '<li class="filter_item filter_item_on" data_time="all"><span class="sp_flight ico_check"></span>전체</li>',
                b += '<li class="filter_item" data_time="00/06"><span class="sp_flight ico_check"></span>00:00 - 06:00</li>',
                b += '<li class="filter_item" data_time="06/09"><span class="sp_flight ico_check"></span>06:00 - 09:00</li>',
                b += '<li class="filter_item" data_time="09/12"><span class="sp_flight ico_check"></span>09:00 - 12:00</li>',
                b += '<li class="filter_item" data_time="12/15"><span class="sp_flight ico_check"></span>12:00 - 15:00</li>',
                b += '<li class="filter_item" data_time="15/18"><span class="sp_flight ico_check"></span>15:00 - 18:00</li>',
                b += '<li class="filter_item" data_time="18/24"><span class="sp_flight ico_check"></span>18:00 - 24:00</li>',
                b += "</ul>",
                b += "</div>";
            var c = "";
            "OW" == a ? (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one")) : "RT" == a && (c += b,
                c = c.replace("{where}", "_one_list"),
                c = c.replace("{title}", "가는날"),
                c = c.replace("{order}", "one"),
                c += b,
                c = c.replace("{where}", "_two_list"),
                c = c.replace("{title}", "오는날"),
                c = c.replace("{order}", "two")),
                this._welLayer.html(c)
        },
        _copyArray: function(a) {
            for (var b = [], c = 0; c < a.length; c++) {
                var d = a[c];
                b[c] = [];
                for (var e = 0; e < d.length; e++) {
                    var f = d[e]
                        , g = {};
                    for (var h in f)
                        g[h] = f[h];
                    b[c].push(g)
                }
            }
            return b
        },
        _copyObject: function(a, b) {
            if ("undefined" != typeof a) {
                for (var c = 0; c < a.length; c++) {
                    var d = a[c]
                        , e = {};
                    for (var f in d)
                        e[f] = d[f];
                    b[c] = e
                }
                return b
            }
        },
        getSelectedValue: function() {
            var a = "filter_item_on"
                , b = {};
            b.filterName = "출발시간",
                b.filterCode = "departuretime";
            var c = this._sStatus
                , d = !0;
            if ("one" == c || "oneBack" == c)
                for (var e = this._welLayer.queryAll("[data_time=all]"), f = 0; f < e.length; f++)
                    0 == $Element(e[f]).hasClass(a) && (d = !1);
            else if ("two" == c || "twoBack" == c)
                var d = this._welTwoAll.hasClass(a) ? !0 : !1;
            else if ("three" == c || "threeBack" == c)
                var d = this._welThreeAll.hasClass(a) ? !0 : !1;
            return b.filterDesc = 1 == d ? "all" : "일부 출발시간",
                b
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.Fare = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            this._welUL = $Element(this._welLayer.query("ul.filter_list"))
        },
        _assignEvent: function() {
            this._dClickItem = this._welUL.delegate("click", ".filter_item", $Fn(this._onClickItem, this).bind())
        },
        _onClickItem: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = c.attr("data_code")
                , e = "filter_item_on"
                , f = $Element($$.getSingle("[data_code=all]", this._welUL.$value()))
                , g = {
                filterName: "FilterFareType",
                code: null ,
                check: null ,
                step: this._sStep,
                we: a
            };
            if ("all" == d) {
                for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                    $Element(h[i]).removeClass(e);
                c.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null )
            } else if (1 == c.hasClass(e)) {
                c.removeClass(e),
                    g.code = d,
                    g.check = !1;
                var h = this._welUL.queryAll("." + e);
                0 == h.length && (f.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null ))
            } else
                c.addClass(e),
                    f.removeClass(e),
                    g.code = d,
                    g.check = !0;
            for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                this._aNowData[i].check = 1 == $Element(h[i]).hasClass(e) ? !0 : !1;
            this.fireEvent("changeItem", {
                oChangeItem: g
            })
        },
        _getParsingData: function(a) {
            var b = [];
            for (var c in a) {
                if (-1 != c.indexOf("A01") || -1 != c.indexOf("A02"))
                    var d = !0;
                else
                    var d = !1;
                var e = {
                    code: c,
                    name: a[c],
                    check: d
                };
                b.push(e)
            }
            sortFunc = $Fn(function(a, b) {
                return a.code > b.code ? 1 : a.code < b.code ? -1 : 0
            }, this).bind(),
                b.sort(sortFunc);
            var f = {
                code: "all",
                name: "전체",
                check: !1
            };
            return b.unshift(f),
                b
        },
        initList: function(a, b) {
            this._sStatus = a;
            if (this._setStep(a),
                "one" == a || 1 != this._isDomestic && 1 != this._isDomestic) {
                if ("one" == a) {
                    this._isDomestic = b.isDomestic;
                    var c = b.oData.FilterFareType;
                    this._aNowData = this._getParsingData(c),
                        this._aOneData = this._aNowData
                } else if ("two" == a) {
                    var c = b.oData.FilterFareType;
                    this._aTwoData = this._getParsingData(c),
                        this._aNowData = this._aTwoData
                } else if ("three" == a) {
                    var c = b.oData.FilterFareType;
                    this._aThreeData = this._getParsingData(c),
                        this._aNowData = this._aThreeData
                } else
                    "oneBack" == a ? this._aNowData = this._aOneData : "twoBack" == a ? this._aNowData = this._aTwoData : "threeBack" == a && (this._aNowData = this._aThreeData);
                var d = this._makeHTML(this._aNowData);
                this._welUL.html(d)
            }
        },
        _makeHTML: function(a) {
            for (var b = "filter_item_on", c = "", d = 0; d < a.length; d++) {
                var e = '<li class="filter_item {isCheck}" data_code="' + a[d].code + '" data_fare_name="' + a[d].name + '"><span class="sp_flight ico_check"></span>' + a[d].name + "</li>";
                e = 1 == a[d].check ? e.replace("{isCheck}", b) : e.replace("{isCheck}", ""),
                    c += e
            }
            return c
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _getList: function() {
            var a = "filter_item_on"
                , b = []
                , c = $Element($$.getSingle("[data_code=all]", this._welUL.$value()))
                , d = this._welUL.queryAll(".filter_item");
            if (1 == c.hasClass(a))
                for (var e = 0; e < d.length; e++) {
                    var f = $Element(d[e])
                        , g = {
                        code: f.attr("data_code"),
                        name: f.attr("data_fare_name"),
                        check: f.hasClass(a)
                    };
                    b.push(g)
                }
            else
                for (var e = 0; e < d.length; e++) {
                    var f = $Element(d[e]);
                    if ("all" == f.attr("data_code")) {
                        var g = {
                            code: f.attr("data_code"),
                            name: f.attr("data_fare_name"),
                            check: !0
                        };
                        b.push(g)
                    } else if (1 == f.hasClass(a)) {
                        var g = {
                            code: f.attr("data_code"),
                            name: f.attr("data_fare_name"),
                            check: !1
                        };
                        b.push(g)
                    }
                }
            return b
        },
        getSelectedValue: function() {
            var a = {};
            a.filterName = "요금조건",
                a.filterCode = "fare";
            var b = $Element(this._welUL.query("[data_code=all]"));
            if (1 == b.hasClass("filter_item_on"))
                a.filterDesc = "all";
            else {
                var c = this._welUL.queryAll(".filter_item_on");
                if (0 == c.length)
                    return a.filterDesc = "all",
                        a;
                var d = $Element(c[0]);
                a.filterDesc = d.attr("data_fare_name"),
                c.length >= 2 && (a.filterDesc += " 외 " + (c.length - 1) + "개")
            }
            return a
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.PriceRange = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _oNowData: null ,
        _oOneData: null ,
        _oTwoData: null ,
        _oThreeData: null ,
        _oSlider: null ,
        _errorMsg: "값을 표시할 수 없습니다",
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            this._welConText = $Element(this._welLayer.query(".txt_price_info"))
        },
        _assignEvent: function() {},
        _transNumber: function(a) {
            if (-1 != a.indexOf(","))
                var b = parseInt(a.split(",").join(""), 10);
            else
                var b = parseInt(a, 10);
            return b
        },
        initSlider: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a) {
                this._isDomestic = b.isDomestic;
                var c = b.oData.FilterSaleFare;
                if ("undefined" == typeof c || null  == c || void 0 == c || "" == c)
                    return void this._welConText.html(this._errorMsg);
                var d = this._transNumber(c.min)
                    , e = this._transNumber(c.max);
                this._oNowData = {
                    nMin: d,
                    nMax: e,
                    nValue: null
                },
                    this._oOneData = this._oNowData,
                    this._welConText.html("전체")
            } else if ("two" == a) {
                var c = b.oData.FilterSaleFare;
                if ("undefined" == typeof c || null  == c || void 0 == c || "" == c)
                    return void this._welConText.html(this._errorMsg);
                var d = this._transNumber(c.min)
                    , e = this._transNumber(c.max);
                this._oNowData = {
                    nMin: d,
                    nMax: e,
                    nValue: null
                },
                    this._oTwoData = this._oNowData
            } else if ("three" == a) {
                var c = b.oData.FilterSaleFare;
                if ("undefined" == typeof c || null  == c || void 0 == c || "" == c)
                    return void this._welConText.html(this._errorMsg);
                var d = this._transNumber(c.min)
                    , e = this._transNumber(c.max);
                this._oNowData = {
                    nMin: d,
                    nMax: e,
                    nValue: null
                },
                    this._oThreeData = this._oNowData
            } else
                "oneBack" == a ? this._oNowData = this._oOneData : "twoBack" == a ? this._oNowData = this._oTwoData : "threeBack" == a && (this._oNowData = this._oThreeData);
            this._welLayer.show("block"),
                this._makeSlider(this._oNowData),
                this._setInitSlider(a),
                this._welLayer.attr("style", null )
        },
        _makeSlider: function(a) {
            null  != this._oSlider && (this._oSlider.deactivate(),
                this._oSlider.detachAll(),
                this._oSlider = null );
            var b = this
                , c = a.nMin
                , d = a.nMax;
            this._oSlider = new jindo.Slider($("price_slider"),{
                nMinValue: c,
                nMaxValue: d
            }).attach({
                beforeChange: $Fn(function(a) {
                    this._oNowData.nPosition = a.nPos
                }, this).bind(),
                change: $Fn(function(a) {
                    var b = 10 * parseInt(Math.floor(a.nValue) / 10, 10)
                        , c = "";
                    c = d == a.nValue ? "전체" : this._getPriceHtml(b),
                        this._welConText.html(c),
                        this._oSlider.nRealPrice = a.nValue,
                        this._oSlider.nDispPrice = b,
                        this._oNowData.nPosition = a.nPos
                }, this).bind(),
                handleUp: $Fn(function(a) {
                    a.element = this._oSlider._aThumbs[0];
                    var c = {
                        filterName: "FilterSaleFare",
                        code: this._oSlider.nDispPrice,
                        step: b._sStep,
                        we: a
                    };
                    b.fireEvent("changeItem", {
                        oChangeItem: c
                    })
                }, this).bind()
            })
        },
        _setInitSlider: function() {
            if ("one" == this._sStatus || "two" == this._sStatus || "three" == this._sStatus)
                this._oSlider.values(0, this._oNowData.nMax, !0);
            else if ("oneBack" == this._sStatus) {
                this._oSlider.positions(0, this._oOneData.nPosition);
                var a = this._oSlider.values();
                this._oSlider.nDispPrice = 10 * parseInt(Math.floor(a) / 10, 10)
            } else if ("twoBack" == this._sStatus) {
                this._oSlider.positions(0, this._oTwoData.nPosition);
                var a = this._oSlider.values();
                this._oSlider.nDispPrice = 10 * parseInt(Math.floor(a) / 10, 10)
            } else if ("threeBack" == this._sStatus) {
                this._oSlider.positions(0, this._oThreeData.nPosition);
                var a = this._oSlider.values();
                this._oSlider.nDispPrice = 10 * parseInt(Math.floor(a) / 10, 10)
            }
        },
        getSelectedValue: function() {
            if (this._welConText.html() == this._errorMsg)
                return {
                    filterName: "가격대",
                    filterCode: "pricerange",
                    filterDesc: "all"
                };
            var a = {};
            a.filterName = "가격대",
                a.filterCode = "pricerange";
            var b = "전체" == this._welConText.html() ? !0 : !1;
            return a.filterDesc = 1 == b ? "all" : this._numFormat(this._oSlider.nDispPrice) + "원 미만",
                a
        },
        _getPriceHtml: function(a) {
            return '<span class="txt_won_area"><strong class="txt_won">' + this._numFormat(a) + "</strong>원</span> 미만"
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _numFormat: function(a) {
            return a.toFixed(0).replace(/./g, function(a, b, c) {
                return b > 0 && "." !== a && (c.length - b) % 3 === 0 ? "," + a : a
            })
        },
        _copyObject: function(a, b) {
            for (var c in a)
                b[c] = a[c];
            return b
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.Seat = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        _aDefaultData: null ,
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent(),
                this._makeDefaultData()
        },
        _assignElement: function() {
            this._welUL = $Element(this._welLayer.query("ul.filter_list"))
        },
        _assignEvent: function() {
            this._dClickItem = this._welUL.delegate("click", ".filter_item", $Fn(this._onClickItem, this).bind())
        },
        _makeDefaultData: function() {
            this._aDefaultData = [],
                this._aDefaultData[0] = {
                    code: "all",
                    name: "전체",
                    check: !1
                },
                this._aDefaultData[1] = {
                    code: "0",
                    name: "예약가능",
                    check: !0
                },
                this._aDefaultData[2] = {
                    code: "1",
                    name: "대기예약",
                    check: !1
                }
        },
        initList: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a || 1 != this._isDomestic && 1 != this._isDomestic) {
                "one" == a ? (this._isDomestic = b.isDomestic,
                    this._aNowData = this._copyArray(this._aDefaultData, []),
                    this._aOneData = this._aNowData) : "two" == a ? (this._aNowData = this._getCheckData(),
                    this._aTwoData = this._aNowData) : "three" == a ? (this._aNowData = this._getCheckData(),
                    this._aThreeData = this._aNowData) : "oneBack" == a ? this._aNowData = this._aOneData : "twoBack" == a ? this._aNowData = this._aTwoData : "threeBack" == a && (this._aNowData = this._aThreeData);
                var c = this._makeHTML(this._aNowData);
                this._welUL.html(c)
            }
        },
        _makeHTML: function(a) {
            for (var b = "filter_item_on", c = "", d = 0; d < a.length; d++) {
                var e = '<li class="filter_item {isCheck}" data_code="' + a[d].code + '" data_seat_name="' + a[d].name + '"><span class="sp_flight ico_check"></span>' + a[d].name + "</li>";
                e = 1 == a[d].check ? e.replace("{isCheck}", b) : e.replace("{isCheck}", ""),
                    c += e
            }
            return c
        },
        _onClickItem: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = c.attr("data_code")
                , e = "filter_item_on"
                , f = $Element($$.getSingle("[data_code=all]", this._welUL.$value()))
                , g = {
                filterName: "FilterSeat",
                code: null ,
                check: null ,
                step: this._sStep,
                we: a
            };
            if ("all" == d) {
                for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                    $Element(h[i]).removeClass(e);
                c.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null )
            } else if (1 == c.hasClass(e)) {
                c.removeClass(e),
                    g.code = d,
                    g.check = !1;
                var h = this._welUL.queryAll("." + e);
                0 == h.length && (f.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null ))
            } else
                c.addClass(e),
                    f.removeClass(e),
                    g.code = d,
                    g.check = !0;
            for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                this._aNowData[i].check = 1 == $Element(h[i]).hasClass(e) ? !0 : !1;
            this.fireEvent("changeItem", {
                oChangeItem: g
            })
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _copyArray: function(a, b) {
            for (var c = 0; c < a.length; c++) {
                var d = a[c]
                    , e = {};
                for (var f in d)
                    e[f] = d[f];
                b.push(e)
            }
            return b
        },
        _getCheckData: function() {
            for (var a = this._welUL.queryAll(".filter_item"), b = [], c = 0; c < a.length; c++) {
                var d = $Element(a[c]);
                b[c] = {
                    code: d.attr("data_code"),
                    name: d.attr("data_seat_name"),
                    check: d.hasClass("filter_item_on")
                }
            }
            return b
        },
        getSelectedValue: function() {
            var a = {};
            a.filterName = "좌석상태",
                a.filterCode = "seat";
            var b = $Element(this._welUL.query("[data_code=all]"));
            if (1 == b.hasClass("filter_item_on"))
                a.filterDesc = "all";
            else {
                for (var c = this._welUL.queryAll(".filter_item_on"), d = [], e = 0; e < c.length; e++)
                    d[e] = $Element(c[e]).attr("data_seat_name");
                a.filterDesc = d.join(", ")
            }
            return a
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.SeatType = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        _aDefaultData: null ,
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent(),
                this._makeDefaultData()
        },
        _assignElement: function() {
            this._welUL = $Element(this._welLayer.query("ul.filter_list"))
        },
        _assignEvent: function() {
            this._dClickItem = this._welUL.delegate("click", ".filter_item", $Fn(this._onClickItem, this).bind())
        },
        _makeDefaultData: function() {
            this._aDefaultData = [],
                this._aDefaultData[0] = {
                    code: "all",
                    name: "전체",
                    check: !0
                },
                this._aDefaultData[1] = {
                    code: "Y",
                    name: "일반석",
                    check: !1
                },
                this._aDefaultData[2] = {
                    code: "D",
                    name: "할인석",
                    check: !1
                },
                this._aDefaultData[3] = {
                    code: "C",
                    name: "비즈니스석",
                    check: !1
                }
        },
        initList: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a || 0 != this._isDomestic && 0 != this._isDomestic) {
                if ("one" == a) {
                    this._isDomestic = b.isDomestic;
                    var c = b.oData.FilterSeatType;
                    if ("undefined" != typeof c && "" != c)
                        for (var d = c.split(","), e = 0; e < d.length; e++) {
                            if ("all" == d[e]) {
                                this._aDefaultData[0].check = !0,
                                    this._aDefaultData[1].check = !1,
                                    this._aDefaultData[2].check = !1,
                                    this._aDefaultData[3].check = !1;
                                break
                            }
                            "Y" == d[e] ? (this._aDefaultData[0].check = !1,
                                this._aDefaultData[1].check = !0) : "D" == d[e] ? (this._aDefaultData[0].check = !1,
                                this._aDefaultData[2].check = !0) : "C" == d[e] && (this._aDefaultData[0].check = !1,
                                this._aDefaultData[3].check = !0)
                        }
                    this._aNowData = this._copyArray(this._aDefaultData, []),
                        this._aOneData = this._aNowData
                } else
                    "two" == a ? (this._aNowData = this._copyArray(this._aDefaultData, []),
                        this._aTwoData = this._aNowData) : "three" == a ? (this._aNowData = this._copyArray(this._aDefaultData, []),
                        this._aThreeData = this._aNowData) : "oneBack" == a ? this._aNowData = this._aOneData : "twoBack" == a ? this._aNowData = this._aTwoData : "threeBack" == a && (this._aNowData = this._aThreeData);
                var f = this._makeHTML(this._aNowData);
                this._welUL.html(f)
            }
        },
        _makeHTML: function(a) {
            for (var b = "filter_item_on", c = "", d = 0; d < a.length; d++) {
                var e = '<li class="filter_item {isCheck}" data_code="' + a[d].code + '" data_seattype_name="' + a[d].name + '"><span class="sp_flight ico_check"></span>' + a[d].name + "</li>";
                e = 1 == a[d].check ? e.replace("{isCheck}", b) : e.replace("{isCheck}", ""),
                    c += e
            }
            return c
        },
        _onClickItem: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = c.attr("data_code")
                , e = "filter_item_on"
                , f = $Element($$.getSingle("[data_code=all]", this._welUL.$value()))
                , g = {
                filterName: "FilterSeatType",
                code: null ,
                check: null ,
                step: this._sStep,
                we: a
            };
            if ("all" == d) {
                for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                    $Element(h[i]).removeClass(e);
                c.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null )
            } else if (1 == c.hasClass(e)) {
                c.removeClass(e),
                    g.code = d,
                    g.check = !1;
                var h = this._welUL.queryAll("." + e);
                0 == h.length && (f.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null ))
            } else {
                c.addClass(e),
                    f.removeClass(e);
                for (var h = this._welUL.queryAll(".filter_item"), j = !0, i = 0; i < h.length; i++) {
                    var c = $Element(h[i]);
                    "all" != c.attr("data_code") && 0 == c.hasClass(e) && (j = !1)
                }
                1 == j ? (g.code = "all",
                    g.check = !0) : (g.code = d,
                    g.check = !0)
            }
            for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                this._aNowData[i].check = 1 == $Element(h[i]).hasClass(e) ? !0 : !1;
            this.fireEvent("changeItem", {
                oChangeItem: g
            })
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _copyArray: function(a, b) {
            for (var c = 0; c < a.length; c++) {
                var d = a[c]
                    , e = {};
                for (var f in d)
                    e[f] = d[f];
                b.push(e)
            }
            return b
        },
        getSelectedValue: function() {
            var a = {};
            a.filterName = "좌석종류",
                a.filterCode = "seattype";
            var b = $Element(this._welUL.query("[data_code=all]"));
            if (1 == b.hasClass("filter_item_on"))
                a.filterDesc = "all";
            else {
                var c = this._welUL.queryAll(".filter_item_on")
                    , d = $Element(c[0]);
                a.filterDesc = d.attr("data_seattype_name"),
                c.length >= 2 && (a.filterDesc = "all")
            }
            return a
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.Sort = jindo.$Class({
        _welBase: null ,
        _oNowData: null ,
        _oOneData: null ,
        _oTwoData: null ,
        _oThreeData: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        $init: function(a) {
            this._welBase = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            this._welSortArea = $Element(this._welBase.query(".sort_box")),
                this._welLayer = $Element(this._welBase.query(".ly_filter")),
                this._welUL = $Element(this._welLayer.query(".filter_list")),
                this._welText = $Element(this._welBase.query(".txt_sort"))
        },
        _assignEvent: function() {
            this._dClickSortArea = this._welSortArea.delegate("click", ".btn_sort", $Fn(this._onClickSortArea, this).bind()),
                this._dClickLayer = this._welLayer.delegate("click", "li", $Fn(this._onClickItem, this).bind()),
                this._fMouseDownDocument = $Fn(this._onMouseDownDocument, this)
        },
        initList: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a) {
                var c = b.isDomestic;
                if (this._isDomestic = c,
                        0 == c || 0 == c ? this._addOutHtml() : (1 == c || 1 == c) && this._addInHtml(),
                    0 == c || 0 == c) {
                    var d = $Element($$.getSingle("[data_name=price]", this._welLayer.$value()))
                        , e = $Element(d.query("._type0"));
                    e.addClass("on"),
                        e.show()
                } else if (1 == c || 1 == c) {
                    var f = $Element($$.getSingle("[data_name=departure]", this._welLayer.$value()))
                        , e = $Element(f.query("._type0"));
                    e.addClass("on"),
                        e.show()
                }
                this._oNowData = this._getDefaultData(this._isDomestic),
                    this._oOneData = this._oNowData
            } else
                "two" == a ? (this._oTwoData = this._getDefaultData(this._isDomestic),
                    this._oNowData = this._oTwoData) : "three" == a ? (this._oThreeData = this._getDefaultData(this._isDomestic),
                    this._oNowData = this._oThreeData) : "oneBack" == a ? this._oNowData = this._oOneData : "twoBack" == a ? this._oNowData = this._oTwoData : "threeBack" == a && (this._oNowData = this._oThreeData);
            this._clearSelectedList(),
                this._checkItem(this._oNowData)
        },
        _getDefaultData: function(a) {
            return 0 == a || 0 == a ? {
                filter: "price",
                type: "_type0",
                text: "가격 낮은순"
            } : 1 == a || 1 == a ? {
                filter: "departure",
                type: "_type0",
                text: "출발시각 빠른순"
            } : void 0
        },
        _checkItem: function(a) {
            var b = "filter_item_on";
            this._clearSelectedList();
            var c = $$.getSingle("[data_name=" + a.filter + "]", this._welUL.$value())
                , d = $Element(c);
            d.addClass(b);
            var e = $Element(d.query("." + a.type));
            e.addClass("on"),
                e.show(),
                this._welText.html(a.text)
        },
        _onClickItem: function(a) {
            this._hideLayer();
            var b = "filter_item_on"
                , c = a.element
                , d = $Element(c)
                , e = d.attr("data_name")
                , f = ""
                , g = "_type0"
                , h = "_type1"
                , i = $Element(d.query("." + g))
                , j = $Element(d.query("." + h));
            this._oNowData.filter = e,
                d.hasClass(b) ? i.hasClass("on") ? (i.removeClass("on"),
                    i.hide(),
                    j.addClass("on"),
                    j.show(),
                    this._oNowData.type = h) : j.hasClass("on") && (j.removeClass("on"),
                    j.hide(),
                    i.addClass("on"),
                    i.show(),
                    this._oNowData.type = g) : (this._clearSelectedList(),
                    d.addClass(b),
                    i.addClass("on"),
                    i.show(),
                    this._oNowData.type = g),
                "price" == e ? f = d.hasClass(b) ? i.hasClass("on") ? "가격 낮은순" : "가격 높은순" : "가격 낮은순" : "departure" == e ? f = d.hasClass(b) ? i.hasClass("on") ? "출발시각 빠른순" : "출발시각 늦은순" : "출발시각 빠른순" : "arrival" == e ? f = d.hasClass(b) ? i.hasClass("on") ? "도착시각 빠른순" : "도착시각 늦은순" : "도착시각 빠른순" : "take" == e ? f = d.hasClass(b) ? i.hasClass("on") ? "소요시간 짧은순" : "소요시간 긴순" : "소요시간 짧은순" : "way" == e ? f = d.hasClass(b) ? i.hasClass("on") ? "직항/경유 짧은순" : "직항/경유 긴순" : "직항/경유 짧은순" : "airline" == e && (f = d.hasClass(b) ? i.hasClass("on") ? "항공사 오름차순" : "항공사 내림차순" : "항공사 오름차순"),
                this._oNowData.text = f,
                this._welText.html(f),
                this.fireEvent("changeItem", {
                    oChangeItem: {
                        filterName: "sort",
                        code: f,
                        step: this._sStep,
                        we: a
                    }
                })
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _clearSelectedList: function() {
            var a = this._welLayer.query(".filter_item_on");
            if (a) {
                var b = $Element(a);
                b.removeClass("filter_item_on")
            }
            var c = this._welLayer.query(".on");
            if (c) {
                var d = $Element(c);
                d.removeClass("on"),
                    d.hide();
                var e = $Element(c.parentNode);
                $Element(e.query("._type0")).attr("style", "")
            }
        },
        _onClickSortArea: function(a) {
            this._detachEventDocument();
            var b = a.element
                , c = $Element(b.parentNode);
            return c.hasClass("sort_box_on") ? void this._hideLayer() : (this._showLayer(),
                void (0 == this._isDomestic || 0 == this._isDomestic ? clickcr(a.element, "isr.sort", "", "", a._event) : (1 == this._isDomestic || 1 == this._isDomestic) && clickcr(a.element, "dsr.sort", "", "", a._event)))
        },
        _addOutHtml: function() {
            var a = '<li class="filter_item filter_item_on" data_name="price"><strong class="tit_apply">가격</strong><span class="txt_apply txt_type_01 _type0">낮은순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">높은순<span class="sp_flight ico_check"></span></span></li>';
            a += '<li class="filter_item" data_name="departure"><strong class="tit_apply">출발시각</strong><span class="txt_apply txt_type_01 _type0">빠른순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">늦은순<span class="sp_flight ico_check"></span></span></li>',
                a += '<li class="filter_item" data_name="arrival"><strong class="tit_apply">도착시각</strong><span class="txt_apply txt_type_01 _type0">빠른순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">늦은순<span class="sp_flight ico_check"></span></span><span class="sp_flight ico_check"></span></li>',
                a += '<li class="filter_item" data_name="take"><strong class="tit_apply">소요시간</strong><span class="txt_apply txt_type_01 _type0">짧은순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">긴순<span class="sp_flight ico_check"></span></span><span class="sp_flight ico_check"></span></li>',
                a += '<li class="filter_item" data_name="airline"><strong class="tit_apply">항공사</strong><span class="txt_apply txt_type_01 _type0">오름차순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">내림차순<span class="sp_flight ico_check"></span></span><span class="sp_flight ico_check"></span></li>',
                this._welUL.html(a)
        },
        _addInHtml: function() {
            var a = '<li class="filter_item" data_name="price"><strong class="tit_apply">가격</strong><span class="txt_apply txt_type_01 _type0">낮은순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">높은순<span class="sp_flight ico_check"></span></span></li>';
            a += '<li class="filter_item filter_item_on" data_name="departure"><strong class="tit_apply">출발시각</strong><span class="txt_apply txt_type_01 _type0">빠른순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">늦은순<span class="sp_flight ico_check"></span></span></li>',
                a += '<li class="filter_item" data_name="arrival"><strong class="tit_apply">도착시각</strong><span class="txt_apply txt_type_01 _type0">빠른순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">늦은순<span class="sp_flight ico_check"></span></span><span class="sp_flight ico_check"></span></li>',
                a += '<li class="filter_item" data_name="airline"><strong class="tit_apply">항공사</strong><span class="txt_apply txt_type_01 _type0">오름차순<span class="sp_flight ico_check"></span></span><span class="txt_apply txt_type_02 _type1">내림차순<span class="sp_flight ico_check"></span></span><span class="sp_flight ico_check"></span></li>',
                this._welUL.html(a)
        },
        _onMouseDownDocument: function(a) {
            var b = a.element;
            if (b) {
                var c = $Element(b).isChildOf(this._welSortArea.$value());
                c || (this._welSortArea.removeClass("sort_box_on"),
                    this._detachEventDocument())
            }
        },
        _copyObject: function(a, b) {
            for (var c in a)
                b[c] = a[c];
            return b
        },
        _attachEventDocument: function() {
            this._fMouseDownDocument.attach(document, "mousedown")
        },
        _detachEventDocument: function() {
            this._fMouseDownDocument.detach(document, "mousedown")
        },
        _showLayer: function() {
            this._welSortArea.addClass("sort_box_on"),
                this._attachEventDocument()
        },
        _hideLayer: function() {
            this._welSortArea.removeClass("sort_box_on"),
                this._detachEventDocument()
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.TakeTime = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        _oSlider0: null ,
        _oSlider1: null ,
        _oSlider2: null ,
        _errorMsg: "값을 표시할 수 없습니다",
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            this._aelText = this._welLayer.queryAll(".filter_list_title"),
                this._awelText = [];
            for (var a = 0; a < this._aelText.length; a++)
                this._awelText[a] = $Element(this._aelText[a]);
            this._aelTitle = this._welLayer.queryAll("._title"),
                this._awelTitle = [];
            for (var a = 0; a < this._aelTitle.length; a++)
                this._awelTitle[a] = $Element(this._aelTitle[a]);
            this._aelDisp = this._welLayer.queryAll(".txt_time"),
                this._awelDisp = [];
            for (var a = 0; a < this._aelDisp.length; a++)
                this._awelDisp[a] = $Element(this._aelDisp[a]);
            this._welSliderArea0 = $Element(this._welLayer.query("._one_slider")),
                this._welSliderArea1 = $Element(this._welLayer.query("._two_slider")),
                this._welSliderArea2 = $Element(this._welLayer.query("._three_slider"))
        },
        _assignEvent: function() {},
        _showHideSlider: function(a) {
            if ("MD" == this._trip)
                "one" == a || "oneBack" == a ? (this._welSliderArea0.show("block"),
                    this._welSliderArea1.hide(),
                    this._welSliderArea2.hide(),
                    this._awelTitle[0].html("여정 1"),
                    this._awelTitle[1].html("여정 2"),
                    this._awelTitle[2].html("여정 3")) : "two" == a || "twoBack" == a ? (this._welSliderArea0.hide(),
                    this._welSliderArea1.show("block"),
                    this._welSliderArea2.hide()) : ("three" == a || "threeBack" == a) && (this._welSliderArea0.hide(),
                    this._welSliderArea1.hide(),
                    this._welSliderArea2.show("block"));
            else {
                "one" == a || "oneBack" == a ? ("OW" == this._trip ? (this._welSliderArea0.show("block"),
                    this._welSliderArea1.hide(),
                    this._welSliderArea2.hide()) : "RT" == this._trip && (this._welSliderArea0.show("block"),
                    this._welSliderArea1.show("block"),
                    this._welSliderArea2.hide()),
                    "OW" == this._trip ? this._awelTitle[0].html("가는날") : "RT" == this._trip && (this._awelTitle[0].html("가는날"),
                        this._awelTitle[1].html("오는날"))) : "two" == a || "twoBack" == a ? (this._welSliderArea0.hide(),
                    this._welSliderArea1.show("block"),
                    this._welSliderArea2.hide()) : ("three" == a || "threeBack" == a) && (this._welSliderArea0.hide(),
                    this._welSliderArea1.hide(),
                    this._welSliderArea2.show("block"));
                var b = "ly_filter_route_box"
                    , c = this._welLayer.queryAll("._route");
                if ("one" == a || "oneBack" == a)
                    for (var d = 0; d < c.length; d++)
                        $Element(c[d]).addClass(b);
                else
                    for (var d = 0; d < c.length; d++)
                        $Element(c[d]).removeClass(b)
            }
        },
        initSlider: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a || 1 != this._isDomestic && 1 != this._isDomestic)
                if ("one" == a) {
                    var c = b.oData.FilterJrnyTm;
                    if (this._trip = b.trip,
                            this._isDomestic = b.isDomestic,
                            this._clearSlider(),
                            this._welSliderArea0.show("block"),
                            this._welSliderArea1.show("block"),
                            this._welSliderArea2.show("block"),
                        "undefined" == typeof c || null  == c) {
                        for (var d = 0; d < this._awelDisp.length; d++)
                            this._awelDisp[d].html(this._errorMsg);
                        return void this._showHideSlider(a)
                    }
                    for (var d = 0; d < this._awelDisp.length; d++)
                        this._awelDisp[d].html("전체");
                    if (this._aNowData = [],
                        "undefined" != typeof c[0]) {
                        var e = this._getParsingData(c[0]);
                        this._aNowData.push(e)
                    }
                    if ("undefined" != typeof c[1]) {
                        var f = this._getParsingData(c[1]);
                        this._aNowData.push(f)
                    }
                    if ("undefined" != typeof c[2]) {
                        var g = this._getParsingData(c[2]);
                        this._aNowData.push(g)
                    }
                    this._aOneData = this._aNowData,
                        this._aTwoData = this._copyArray(this._aNowData, []),
                        this._aThreeData = this._copyArray(this._aNowData, []),
                    "undefined" != typeof this._aNowData[0] && (this._oSlider0 = this._makeSlider(this._oSlider0, "slider_0", this._aNowData[0], this._awelDisp[0], 0)),
                    "undefined" != typeof this._aNowData[1] && (this._oSlider1 = this._makeSlider(this._oSlider1, "slider_1", this._aNowData[1], this._awelDisp[1], 1)),
                    "undefined" != typeof this._aNowData[2] && (this._oSlider2 = this._makeSlider(this._oSlider2, "slider_2", this._aNowData[2], this._awelDisp[2], 2)),
                        this._setInitSlider(a),
                        this._showHideSlider(a)
                } else
                    this._showHideSlider(a)
        },
        _setInitSlider: function() {
            this._welLayer.show(),
                this._oSlider0.values(0, 100),
            null  != this._oSlider1 && this._oSlider1.values(0, 100),
            null  != this._oSlider2 && this._oSlider2.values(0, 100),
                this._welLayer.attr("style", null )
        },
        _makeSlider: function(a, b, c, d, e) {
            null  != a && (a.deactivate(),
                a.detachAll(),
                a = null );
            var f = this
                , g = new jindo.Slider($(b),{
                nMinValue: 0,
                nMaxValue: 100
            }).attach({
                beforeChange: function(a) {
                    var b = this._elTrack.offsetWidth
                        , c = this._aThumbs[0].offsetWidth
                        , e = b - c
                        , g = a.nPos;
                    if (!(0 > g || g > e)) {
                        var h = "전체"
                            , i = 0
                            , j = 0;
                        if (this.isSameHour) {
                            var k = this.nSliderMaxLevel
                                , l = e / k;
                            if (1 / 0 == l)
                                return void d.html("전체");
                            var m = Math.round(g * k / e);
                            if (a.nPos = l * m,
                                m == this.nSliderMaxLevel)
                                h = "전체",
                                    i = this.nMaxHour,
                                    j = this.nMaxMin;
                            else if (0 == m) {
                                var n = this.nMinMin;
                                this.nMinMin < 10 && (n = "0" + this.nMinMin),
                                    h = this.nMinHour + "시간 " + n + "분 미만",
                                    i = this.nMinHour,
                                    j = this.nMinMin
                            } else
                                h = this.nMinHour + "시간 " + (this.nMinMin + m) + "분 미만",
                                    i = this.nMinHour,
                                    j = this.nMinMin + m
                        } else {
                            var k = this.nSliderMaxLevel
                                , l = e / k
                                , m = Math.round(g * k / e);
                            if (a.nPos = l * m,
                                m == this.nSliderMaxLevel)
                                h = "전체",
                                    i = this.nMaxHour,
                                    j = this.nMaxMin;
                            else if (0 == m) {
                                var n = this.nMinMin;
                                this.nMinMin < 10 && (n = "0" + this.nMinMin),
                                    h = this.nMinHour + "시간 " + n + "분 미만",
                                    i = this.nMinHour,
                                    j = this.nMinMin
                            } else {
                                var o = this.nStartTimeDot + .5 * m
                                    , p = 2 == o.toString().split(".").length ? !0 : !1
                                    , q = Math.floor(o);
                                1 == p ? (h = q + "시간 30분 미만",
                                    j = 30) : (h = q + "시간 00분 미만",
                                    j = 0),
                                    i = q
                            }
                        }
                        this.sText = h,
                            this.nPosition = a.nPos,
                            this.nThumbHour = i,
                            this.nThumbMin = j,
                            this.nNowLevel = m,
                            d.html(h),
                            f._aNowData[this.idx].nPosition = this.nPosition
                    }
                },
                handleUp: function(a) {
                    a.element = this._aThumbs[0];
                    var b = {
                        filterName: "FilterJrnyTm",
                        route: this.route,
                        minHour: this.nMinHour,
                        minMin: this.nMinMin,
                        maxHour: this.nThumbHour,
                        maxMin: this.nThumbMin,
                        step: f._sStep,
                        we: a
                    };
                    f.fireEvent("changeItem", {
                        oChangeItem: b
                    })
                },
                change: function() {}
            });
            g.idx = e;
            var h = "";
            "slider_0" == b ? h = "one" : "slider_1" == b ? h = "two" : "slider_2" == b && (h = "three"),
                g.route = h;
            var i = c.nMinHour
                , j = c.nMinMin
                , k = c.nMaxHour
                , l = c.nMaxMin;
            if (i == k) {
                var m = l - j;
                g.nSliderMaxLevel = m,
                    g.nMinHour = i,
                    g.nMinMin = j,
                    g.nMaxHour = k,
                    g.nMaxMin = l,
                    g.nStartTimeDot = n,
                    g.nEndTimeDot = o,
                    g.isSameHour = !0,
                    g.status = "init"
            } else {
                var n = i
                    , o = k;
                j > 0 && (n += .5),
                l > 0 && (o += .5);
                var m = (o - n) / .5;
                g.nSliderMaxLevel = m,
                    g.nMinHour = i,
                    g.nMinMin = j,
                    g.nMaxHour = k,
                    g.nMaxMin = l,
                    g.nStartTimeDot = n,
                    g.nEndTimeDot = o,
                    g.isSameHour = !1,
                    g.status = "init"
            }
            return i == k && j == l ? g.deactivate() : g.activate(),
                g.welText = d,
                g
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        getSelectedValue: function() {
            if (null  == this._oSlider0)
                return {
                    filterName: "소요시간",
                    filterCode: "taketime",
                    filterDesc: "all"
                };
            var a = {};
            a.filterName = "소요시간",
                a.filterCode = "taketime";
            var b = this._sStatus
                , c = !0;
            return "one" == b || "oneBack" == b ? ("전체" != this._oSlider0.welText.html() && (c = !1),
            null  != this._oSlider1 && "전체" != this._oSlider1.welText.html() && (c = !1),
            null  != this._oSlider2 && "전체" != this._oSlider2.welText.html() && (c = !1)) : "two" == b ? "전체" != this._oSlider1.welText.html() && (c = !1) : "twoBack" == b ? "전체" != this._oSlider1.welText.html() && (c = !1) : "three" == b ? "전체" != this._oSlider2.welText.html() && (c = !1) : "threeBack" == b && "전체" != this._oSlider2.welText.html() && (c = !1),
                a.filterDesc = 1 == c ? "all" : "일부 소요시간",
                a
        },
        _clearSlider: function() {
            null  != this._oSlider0 && (this._oSlider0.deactivate(),
                this._oSlider0.detachAll(),
                this._oSlider0 = null ),
            null  != this._oSlider1 && (this._oSlider1.deactivate(),
                this._oSlider1.detachAll(),
                this._oSlider1 = null ),
            null  != this._oSlider2 && (this._oSlider2.deactivate(),
                this._oSlider2.detachAll(),
                this._oSlider2 = null )
        },
        _getParsingData: function(a) {
            var b = {
                nMinHour: parseInt(a.Min[0], 10),
                nMinMin: parseInt(a.Min[1], 10),
                nMaxHour: parseInt(a.Max[0], 10),
                nMaxMin: parseInt(a.Max[1], 10),
                nPosition: null
            };
            return b
        },
        _copyArray: function(a, b) {
            for (var c = 0; c < a.length; c++) {
                var d = a[c]
                    , e = {};
                for (var f in d)
                    e[f] = d[f];
                b.push(e)
            }
            return b
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.Way = jindo.$Class({
        _welLayer: null ,
        _sStatus: null ,
        _sStep: null ,
        _isDomestic: null ,
        _aNowData: null ,
        _aOneData: null ,
        _aTwoData: null ,
        _aThreeData: null ,
        _aDefaultData: null ,
        $init: function(a) {
            this._welLayer = a,
                this._assignElement(),
                this._assignEvent(),
                this._makeDefaultData()
        },
        _assignElement: function() {
            this._welUL = $Element(this._welLayer.query("ul.filter_list"))
        },
        _assignEvent: function() {
            this._dClickItem = this._welUL.delegate("click", ".filter_item", $Fn(this._onClickItem, this).bind())
        },
        _makeDefaultData: function() {
            this._aDefaultData = [],
                this._aDefaultData[0] = {
                    code: "all",
                    name: "전체",
                    check: !0
                },
                this._aDefaultData[1] = {
                    code: "0",
                    name: "직항",
                    check: !1
                },
                this._aDefaultData[2] = {
                    code: "1",
                    name: "경유1회",
                    check: !1
                },
                this._aDefaultData[3] = {
                    code: "2",
                    name: "경유2회 이상",
                    check: !1
                }
        },
        initList: function(a, b) {
            if (this._sStatus = a,
                    this._setStep(a),
                "one" == a || 1 != this._isDomestic && 1 != this._isDomestic) {
                "one" == a ? (this._isDomestic = b.isDomestic,
                    this._aNowData = this._copyArray(this._aDefaultData, []),
                    this._aOneData = this._aNowData) : "two" == a ? (this._aNowData = this._copyArray(this._aDefaultData, []),
                    this._aTwoData = this._aNowData) : "three" == a ? (this._aNowData = this._copyArray(this._aDefaultData, []),
                    this._aThreeData = this._aNowData) : "oneBack" == a ? this._aNowData = this._aOneData : "twoBack" == a ? this._aNowData = this._aTwoData : "threeBack" == a && (this._aNowData = this._aThreeData);
                var c = this._makeHTML(this._aNowData);
                this._welUL.html(c)
            }
        },
        _makeHTML: function(a) {
            for (var b = "filter_item_on", c = "", d = 0; d < a.length; d++) {
                var e = '<li class="filter_item {isCheck}" data_code="' + a[d].code + '" data_way_name="' + a[d].name + '"><span class="sp_flight ico_check"></span>' + a[d].name + "</li>";
                e = 1 == a[d].check ? e.replace("{isCheck}", b) : e.replace("{isCheck}", ""),
                    c += e
            }
            return c
        },
        _onClickItem: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = c.attr("data_code")
                , e = "filter_item_on"
                , f = $Element($$.getSingle("[data_code=all]", this._welUL.$value()))
                , g = {
                filterName: "FilterWay",
                code: null ,
                check: null ,
                step: this._sStep,
                we: a
            };
            if ("all" == d) {
                for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                    $Element(h[i]).removeClass(e);
                c.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null )
            } else if (1 == c.hasClass(e)) {
                c.removeClass(e),
                    g.code = d,
                    g.check = !1;
                var h = this._welUL.queryAll("." + e);
                0 == h.length && (f.addClass(e),
                    g.code = "all",
                    g.check = !0,
                    this.fireEvent("closeLayer", null ))
            } else
                c.addClass(e),
                    f.removeClass(e),
                    g.code = d,
                    g.check = !0;
            for (var h = this._welUL.queryAll(".filter_item"), i = 0; i < h.length; i++)
                this._aNowData[i].check = 1 == $Element(h[i]).hasClass(e) ? !0 : !1;
            this.fireEvent("changeItem", {
                oChangeItem: g
            })
        },
        _setStep: function(a) {
            "one" == a || "oneBack" == a ? this._sStep = 0 : "two" == a || "twoBack" == a ? this._sStep = 1 : ("three" == a || "threeBack" == a) && (this._sStep = 2)
        },
        _copyArray: function(a, b) {
            for (var c = 0; c < a.length; c++) {
                var d = a[c]
                    , e = {};
                for (var f in d)
                    e[f] = d[f];
                b.push(e)
            }
            return b
        },
        getSelectedValue: function() {
            var a = {};
            a.filterName = "직항/경유",
                a.filterCode = "way";
            var b = $Element(this._welUL.query("[data_code=all]"));
            if (1 == b.hasClass("filter_item_on"))
                a.filterDesc = "all";
            else {
                for (var c = this._welUL.queryAll(".filter_item_on"), d = [], e = 0; e < c.length; e++)
                    d[e] = $Element(c[e]).attr("data_way_name");
                a.filterDesc = d.join(", ")
            }
            return a
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Filter.FilterBar = jindo.$Class({
        _welBar: null ,
        _isDomestic: null ,
        $init: function(a) {
            this._welBar = a,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            this._welUL = $Element(this._welBar.query(".apply_filter_list")),
                this._welBtnGroup = $Element(this._welBar.query(".lst_btn_box")),
                this._welContaienr = $Element(this._welBar.query("._bar_container"))
        },
        _assignEvent: function() {
            this._dClickLeft = this._welBtnGroup.delegate("click", ".btn_arr_left", $Fn(this._onClickLeft, this).bind()),
                this._dClickRight = this._welBtnGroup.delegate("click", ".btn_arr_right", $Fn(this._onClickRight, this).bind()),
                this._dClickLi = this._welContaienr.delegate("click", "li.apply_filter_item", $Fn(this._onClickLi, this).bind())
        },
        _onClickLi: function(a) {
            var b = $Element(a.element);
            this.fireEvent("showLayer", {
                filterCode: b.attr("data_filter_code")
            })
        },
        _onClickLeft: function(a) {
            this._nPage--,
            this._nPage <= 0 && (this._nPage = 0),
                this._showGroup(this._nPage),
                0 == this._isDomestic || 0 == this._isDomestic ? clickcr(a.element, "isr.prev", "", "", a._event) : (1 == this._isDomestic || 1 == this._isDomestic) && clickcr(a.element, "dsr.prev", "", "", a._event)
        },
        _onClickRight: function(a) {
            this._nPage++,
            this._nPage >= this._nMaxGroup && (this._nPage = this._nMaxGroup),
                this._showGroup(this._nPage),
                0 == this._isDomestic || 0 == this._isDomestic ? clickcr(a.element, "isr.next", "", "", a._event) : (1 == this._isDomestic || 1 == this._isDomestic) && clickcr(a.element, "dsr.next", "", "", a._event)
        },
        drawList: function(a) {
            for (var b = "", c = 0; c < a.length; c++)
                ("airline" != a[c].filterCode || "none" != a[c].filterDesc) && "all" != a[c].filterDesc && (b += '<li class="apply_filter_item" data_filter_code="' + a[c].filterCode + '"><strong class="tit_apply_filter">' + a[c].filterName + '</strong><p class="txt_apply_filter">' + a[c].filterDesc + "</p></li>");
            "" == b && (b = '<li class="apply_filter_item" data_filter_code="all" style="padding-left:0px"><strong class="tit_apply_filter"></strong><p class="txt_apply_filter">전체</p></li>'),
                this._welUL.html(b),
                this._welBtnGroup.hide(),
                this._nMaxGroup = this._makeGroup(),
            this._nMaxGroup > 0 && this._welBtnGroup.show(),
                this._nPage = 0,
                this._showGroup(0)
        },
        _showGroup: function(a) {
            for (var b = this._welUL.queryAll("li.apply_filter_item"), c = 0; c < b.length; c++) {
                var d = $Element(b[c]);
                d.attr("data_group") == a.toString() ? d.show("block") : d.hide()
            }
        },
        _makeGroup: function() {
            for (var a = 420, b = 0, c = 0, d = this._welUL.queryAll("li"), e = 0; e < d.length; e++) {
                var f = $Element(d[e]);
                b += f.width(),
                b >= a && (b = f.width(),
                    c++),
                    f.attr("data_group", c)
            }
            return c
        },
        setIsDomestic: function(a) {
            this._isDomestic = a
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.FilterControl = jindo.$Class({
        _config: null ,
        _oSelectedFilter: {},
        _oAirline: null ,
        $init: function() {
            this._config = pc.naver.search.config,
                this._oAirline = pc.naver.service.oAirline,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            $Element(document.body)
        },
        _assignEvent: function() {},
        setFiltering: function(a, b) {
            if (0 == a || 0 == a)
                for (var c = ["Departure", "Middle", "Arrive"], d = 0; d < c.length; d++) {
                    this._oSelectedFilter[c[d]] = {
                        FilterAirV: ["all"],
                        FilterDepartureTm: ["all"],
                        FilterDepartureTm_one: ["all"],
                        FilterDepartureTm_two: ["all"],
                        FilterJrnyTm: ["all"],
                        FilterJrnyTm_one: ["all"],
                        FilterJrnyTm_two: ["all"],
                        FilterArrivalTm: ["all"],
                        FilterArrivalTm_one: ["all"],
                        FilterArrivalTm_two: ["all"],
                        FilterWay: ["all"],
                        FilterSeat: ["0"],
                        FilterSaleFare: [99999999]
                    },
                        this._oSelectedFilter[c[d]].FilterFareType = [];
                    for (var e in b)
                        if (e.length > 3) {
                            var f = e.split("/");
                            "A01" == f[0] && this._oSelectedFilter[c[d]].FilterFareType.push(e)
                        } else
                            ("A01" == e || "A02" == e) && this._oSelectedFilter[c[d]].FilterFareType.push(e)
                }
            else
                for (var c = ["DepartureList", "ArriveList"], d = 0; d < c.length; d++)
                    this._oSelectedFilter[c[d]] = {
                        FilterAirV: ["all"],
                        FilterDepartureTm: ["all"],
                        FilterArrivalTm: ["all"],
                        FilterSeatType: ["all"],
                        FilterSaleFare: [99999999]
                    },
                    void 0 != b && ("YC" == b ? this._oSelectedFilter[c[d]].FilterSeatType = ["all"] : "Y" == b ? this._oSelectedFilter[c[d]].FilterSeatType = ["Y", "D"] : "C" == b && (this._oSelectedFilter[c[d]].FilterSeatType = ["C"]))
        },
        defaultFiltering: function(a, b) {
            if (0 == a || 0 == a)
                for (var c = ["Departure", "Middle", "Arrive"], d = 0; d < c.length; d++) {
                    for (var e in b.Schedules[c[d]])
                        b.Schedules[c[d]][e].visible = !0,
                            b.Schedules[c[d]][e].visibleFilter = {
                                FilterAirV: !0,
                                FilterDepartureTm: !0,
                                FilterDepartureTm_one: !0,
                                FilterDepartureTm_two: !0,
                                FilterJrnyTm: !0,
                                FilterJrnyTm_one: !0,
                                FilterJrnyTm_two: !0,
                                FilterArrivalTm: !0,
                                FilterArrivalTm_one: !0,
                                FilterArrivalTm_two: !0,
                                FilterWay: !0,
                                FilterSeat: !0,
                                FilterSaleFare: !0
                            };
                    for (var e in b[c[d]]) {
                        b[c[d]][e].visible = "HK" === b[c[d]][e].Seat ? !0 : !1,
                            b[c[d]][e].FareVisible = [];
                        for (var f = 0; f < b[c[d]][e].FareList.length; f++)
                            for (var g in b[c[d]][e].FareList[f]) {
                                var h = {};
                                if (g.length > 3) {
                                    var i = g.split("/");
                                    "A01" === i[0] && (h[g] = b[c[d]][e].FareList[f][g],
                                        b[c[d]][e].FareVisible.push(h))
                                } else
                                    ("A01" === g || "A02" == g) && (h[g] = b[c[d]][e].FareList[f][g],
                                        b[c[d]][e].FareVisible.push(h))
                            }
                    }
                }
            else if (1 == a || 1 == a)
                for (var c = ["DepartureList", "ArriveList"], d = 0; d < c.length; d++)
                    if (b[c[d]].length > 0)
                        for (var f = 0; f < b[c[d]].length; f++) {
                            var j = b[c[d]][f];
                            j.visible = !0,
                                j.visibleFilter = {
                                    FilterAirV: !0,
                                    FilterDepartureTm: !0,
                                    FilterArrivalTm: !0,
                                    FilterSeatType: !0,
                                    FilterSaleFare: !0
                                },
                                j.FareVisible = []
                        }
            return b
        },
        makeFilterSpec: function(a, b, c, d, e) {
            var f = {
                FilterAirV: {},
                FilterSaleFare: {},
                FilterFareType: {},
                FilterJrnyTm: {}
            };
            if (0 == a || 0 == a) {
                for (var g = e, h = [], i = [], j = [], k = [], l = 0; l < c.length; l++) {
                    for (var m = 0; m < c[l].FareList.length; m++)
                        for (var n in c[l].FareList[m]) {
                            var o = c[l].FareList[m][n];
                            o = "0" == o[1] ? o[0] : o[1],
                                i.push(this._makeStringPrice(o)),
                                j.push(n)
                        }
                    for (var p in d)
                        if (p == c[l].SID) {
                            h.push(d[p].MainAirV + ":" + d[p].MainAirVKR);
                            var q = d[p].JrnyTm.slice(0, 2) + "" + d[p].JrnyTm.slice(5, 7);
                            k.push(q)
                        }
                }
                h = $A(h).unique().$value();
                for (var l = 0; l < h.length; l++) {
                    var r = h[l].split(":");
                    f.FilterAirV[r[0]] = r[1]
                }
                i = i.sort(function(a, b) {
                    return a - b
                }),
                    f.FilterSaleFare.max = this._makePriceString(i[i.length - 1]),
                    f.FilterSaleFare.min = this._makePriceString(i[0]),
                    j = $A(j).unique().$value();
                for (var l = 0; l < j.length; l++)
                    f.FilterFareType[j[l]] = e[j[l]];
                k = k.sort(function(a, b) {
                    return a - b
                });
                var s = {
                    max: [parseInt(k[k.length - 1].slice(0, 2)), parseInt(k[k.length - 1].slice(2, 4))],
                    min: [parseInt(k[0].slice(0, 2)), parseInt(k[0].slice(2, 4))]
                };
                f.FilterJrnyTm[0] = s
            } else if (1 == a || 1 == a) {
                for (var h = [], i = [], l = 0; l < c.length; l++)
                    h.push(c[l].JCarCode),
                        i.push(c[l].JAdultFare);
                h = $A(h).unique().$value();
                for (var l = 0; l < h.length; l++)
                    f.FilterAirV[h[l]] = this._oAirline[h[l]];
                i = i.sort(function(a, b) {
                    return a - b
                }),
                    f.FilterSaleFare.max = this._makePriceString(i[i.length - 1]),
                    f.FilterSaleFare.min = this._makePriceString(i[0]),
                    "YC" == e ? f.FilterSeatType = "all" : "Y" == e ? f.FilterSeatType = "Y,D" : "C" == e && (f.FilterSeatType = "C")
            }
            f.FilterFareType = g;
            var t = {
                oData: f,
                isDomestic: a,
                trip: b
            };
            return t
        },
        filtering: function(a, b, c) {
            var d = "";
            0 == b.is_domestic || 0 == b.is_domestic ? 0 === c.step ? d = "Departure" : 1 === c.step ? d = "" != b.SDATE3 ? "Middle" : "Arrive" : 2 === c.step && (d = "Arrive") : d = 0 == c.step ? "two" == c.route ? "ArriveList" : "DepartureList" : "ArriveList";
            var e = c.filterName;
            0 != b.is_domestic && 0 != b.is_domestic || void 0 == c.route || 0 != c.step || (e += "_",
                e += c.route);
            var f = "Arrive";
            if ("FilterJrnyTm" === c.filterName)
                c.maxHour < 10 && (c.maxHour = "0" + c.maxHour),
                c.maxMin < 10 && (c.maxMin = "0" + c.maxMin),
                    this._oSelectedFilter[d][e] = [c.maxHour + "" + c.maxMin];
            else if ("FilterSaleFare" === c.filterName)
                this._oSelectedFilter[d][e] = [],
                    this._oSelectedFilter[d][e].push(c.code);
            else if (c.check)
                "all" == c.code ? (this._oSelectedFilter[d][e] = [],
                    this._oSelectedFilter[d][e].push("all"),
                0 != b.is_domestic && 0 != b.is_domestic || 0 != c.step || "two" != c.route || (this._oSelectedFilter[f][c.filterName] = [],
                    this._oSelectedFilter[f][c.filterName].push("all"))) : "all" == this._oSelectedFilter[d][e][0] ? (this._oSelectedFilter[d][e] = [],
                    this._oSelectedFilter[d][e].push(c.code),
                0 != b.is_domestic && 0 != b.is_domestic || 0 != c.step || "two" != c.route || (this._oSelectedFilter[f][c.filterName] = [],
                    this._oSelectedFilter[f][c.filterName].push(c.code))) : (this._oSelectedFilter[d][e].push(c.code),
                0 != b.is_domestic && 0 != b.is_domestic || 0 != c.step || "two" != c.route || this._oSelectedFilter[f][c.filterName].push(c.code));
            else {
                for (var g = 0; g < this._oSelectedFilter[d][e].length; g++)
                    this._oSelectedFilter[d][e][g] == c.code && this._oSelectedFilter[d][e].splice(g, 1);
                if ((0 == b.is_domestic || 0 == b.is_domestic) && 0 == c.step && "two" == c.route)
                    for (var g = 0; g < this._oSelectedFilter[f][c.filterName].length; g++)
                        this._oSelectedFilter[f][c.filterName][g] == c.code && this._oSelectedFilter[f][c.filterName].splice(g, 1)
            }
            if (0 == b.is_domestic || 0 == b.is_domestic) {
                if (0 == c.step && "two" == c.route) {
                    for (var h in a.Schedules[f])
                        a.Schedules[f][h].visibleFilter[c.filterName] = !1;
                    for (var g = 0; g < a.Departure.length; g++) {
                        a.Schedules[d][a.Departure[g].SID].visibleFilter[e] = !1;
                        for (var i = 0; i < a.Departure[g].CSID.length; i++) {
                            var j = a.Departure[g].CSID[i]
                                , k = a.Departure[g].SID + "_" + j + "_" + a.Departure[g].Seat;
                            if (void 0 != a[f][k]) {
                                var l = a.Schedules[f][a[f][k].SID];
                                for (var m in l)
                                    for (var n = 0; n < this._oSelectedFilter[d][e].length; n++) {
                                        var o = this._oSelectedFilter[d][e][n];
                                        if ("all" === o && (a.Schedules[d][a.Departure[g].SID].visibleFilter[e] = !0),
                                            "FilterDepartureTm" === c.filterName || "FilterArrivalTm" === c.filterName) {
                                            var p = "";
                                            "FilterDepartureTm" === c.filterName ? p = l.StartTm.split(":") : "FilterArrivalTm" === c.filterName && (p = l.EndTm.split(":"));
                                            var q = p[0] + "" + p[1]
                                                , r = o.split("/")
                                                , s = r[0] + "00"
                                                , t = r[1] + "00";
                                            q >= s && t >= q && (a.Schedules[d][a.Departure[g].SID].visibleFilter[e] = !0,
                                                a.Schedules[f][a[f][k].SID].visibleFilter[c.filterName] = !0)
                                        } else if ("FilterJrnyTm" === c.filterName) {
                                            var p = l.JrnyTm.split("시간 ");
                                            p[0] + p[1].slice(0, 2) <= o && (a.Schedules[d][a.Departure[g].SID].visibleFilter[e] = !0,
                                                a.Schedules[f][a[f][k].SID].visibleFilter[c.filterName] = !0)
                                        }
                                    }
                            }
                        }
                        a.Schedules[d][a.Departure[g].SID].visible = !0;
                        for (var u in a.Schedules[d][a.Departure[g].SID].visibleFilter)
                            0 == a.Schedules[d][a.Departure[g].SID].visibleFilter[u] && (a.Schedules[d][a.Departure[g].SID].visible = !1)
                    }
                    for (var v in a.Schedules[f]) {
                        a.Schedules[f][v].visible = !0;
                        for (var m in a.Schedules[f][v].visibleFilter)
                            0 == a.Schedules[f][v].visibleFilter[m] && (a.Schedules[f][v].visible = !1)
                    }
                } else if ("FilterAirV" === c.filterName || "FilterDepartureTm" === c.filterName || "FilterArrivalTm" === c.filterName || "FilterJrnyTm" === c.filterName || "FilterWay" === c.filterName)
                    for (var v in a.Schedules[d]) {
                        a.Schedules[d][v].visibleFilter[e] = !1;
                        for (var g = 0; g < this._oSelectedFilter[d][e].length; g++) {
                            var o = this._oSelectedFilter[d][e][g];
                            if ("all" === o && (a.Schedules[d][v].visibleFilter[e] = !0),
                                "FilterAirV" === c.filterName && o === a.Schedules[d][v].MainAirV)
                                a.Schedules[d][v].visibleFilter[e] = !0;
                            else if ("FilterDepartureTm" === c.filterName || "FilterArrivalTm" === c.filterName) {
                                var p = "";
                                "FilterDepartureTm" === c.filterName ? p = a.Schedules[d][v].StartTm.split(":") : "FilterArrivalTm" === c.filterName && (p = a.Schedules[d][v].EndTm.split(":"));
                                var q = p[0] + "" + p[1]
                                    , r = o.split("/")
                                    , s = r[0] + "00"
                                    , t = r[1] + "00";
                                q >= s && t >= q && (a.Schedules[d][v].visibleFilter[e] = !0)
                            } else if ("FilterJrnyTm" === c.filterName) {
                                var w = a.Schedules[d][v].JrnyTm.slice(0, 2) + "" + a.Schedules[d][v].JrnyTm.slice(5, 7);
                                o >= w && (a.Schedules[d][v].visibleFilter[e] = !0)
                            } else
                                "FilterWay" === c.filterName && o == a.Schedules[d][v].ViaNo && (a.Schedules[d][v].visibleFilter[e] = !0)
                        }
                        a.Schedules[d][v].visible = !0;
                        for (var m in a.Schedules[d][v].visibleFilter)
                            0 == a.Schedules[d][v].visibleFilter[m] && (a.Schedules[d][v].visible = !1)
                    }
                else if ("FilterSeat" === c.filterName)
                    for (var v in a[d]) {
                        a[d][v].visible = !1;
                        for (var g = 0; g < this._oSelectedFilter[d][e].length; g++) {
                            var o = this._oSelectedFilter[d][e][g];
                            if ("all" === o)
                                a[d][v].visible = !0;
                            else {
                                var x = "";
                                0 == o ? x = "HK" : 1 == o && (x = "HL"),
                                x == a[d][v].Seat && (a[d][v].visible = !0)
                            }
                        }
                    }
                else if ("FilterFareType" === c.filterName || "FilterSaleFare" === c.filterName)
                    for (var v in a[d]) {
                        a[d][v].FareVisible = [];
                        for (var i = 0; i < a[d][v].FareList.length; i++)
                            for (var g = 0; g < this._oSelectedFilter[d].FilterFareType.length; g++)
                                for (var y in a[d][v].FareList[i]) {
                                    var z = a[d][v].FareList[i][y];
                                    z = "0" == z[1] ? z[0] : z[1];
                                    for (var A = z.split(","), B = "", n = 0; n < A.length; n++)
                                        B += A[n];
                                    "all" == this._oSelectedFilter[d].FilterFareType[g] && B <= this._oSelectedFilter[d].FilterSaleFare[0] ? a[d][v].FareVisible.push(a[d][v].FareList[i]) : y == this._oSelectedFilter[d].FilterFareType[g] && B <= this._oSelectedFilter[d].FilterSaleFare[0] && a[d][v].FareVisible.push(a[d][v].FareList[i])
                                }
                    }
            } else
                for (var g = 0; g < a[d].length; g++) {
                    a[d][g].visibleFilter[e] = !1;
                    for (var i = 0; i < this._oSelectedFilter[d][e].length; i++) {
                        var o = this._oSelectedFilter[d][e][i];
                        if ("all" === o && (a[d][g].visibleFilter[e] = !0),
                            "FilterAirV" == e)
                            o == a[d][g].JCarCode && (a[d][g].visibleFilter[e] = !0);
                        else if ("FilterDepartureTm" == e || "FilterArrivalTm" == e) {
                            var p = "";
                            "FilterDepartureTm" === e ? p = a[d][g].StartTM.split(":") : "FilterArrivalTm" === c.filterName && (p = a[d][g].EndTM.split(":"));
                            var q = p[0] + "" + p[1]
                                , r = o.split("/")
                                , s = r[0] + "00"
                                , t = r[1] + "00";
                            q >= s && t >= q && (a[d][g].visibleFilter[e] = !0)
                        } else
                            "FilterSeatType" == e ? o == a[d][g].Seat && (a[d][g].visibleFilter[e] = !0) : "FilterSaleFare" == e && a[d][g].JAdultFare <= o && (a[d][g].visibleFilter[e] = !0)
                    }
                    a[d][g].visible = !0;
                    for (var m in a[d][g].visibleFilter)
                        0 == a[d][g].visibleFilter[m] && (a[d][g].visible = !1)
                }
            return a
        },
        _makePriceString: function(a) {
            for (var b = new String(a), c = /(-?[0-9]+)([0-9]{3})/; c.test(b); )
                b = b.replace(c, "$1,$2");
            return b
        },
        _makeStringPrice: function(a) {
            if ("" != a) {
                var b = a.split(",");
                return parseInt(b.join(""))
            }
            return ""
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.SortControl = jindo.$Class({
        _config: null ,
        _oSelectedFilter: {},
        $init: function() {
            this._config = pc.naver.search.config,
                this._assignElement(),
                this._assignEvent()
        },
        _assignElement: function() {
            $Element(document.body)
        },
        _assignEvent: function() {},
        sorting: function(a, b, c, d) {
            var e = a.split(" ")
                , f = [];
            if (0 == b || 0 == b) {
                if ("가격" == e[0]) {
                    for (var g in c) {
                        var h = c[g].FareVisible[0];
                        for (var i in h) {
                            if ("0" == h[i][1])
                                var j = h[i][0];
                            else
                                var j = h[i][1];
                            for (var k = j.split(","), l = "", m = 0; m < k.length; m++)
                                l += k[m]
                        }
                        f.push(l)
                    }
                    "낮은순" == e[1] ? f = f.sort(function(a, b) {
                        return a - b
                    }) : "높은순" == e[1] && (f = f.sort(function(a, b) {
                        return b - a
                    })),
                        f = $A(f).unique().$value();
                    for (var n = [], o = 0; o < f.length; o++)
                        for (var g in c) {
                            var h = c[g].FareVisible[0];
                            for (var i in h) {
                                if ("0" == h[i][1])
                                    var j = h[i][0];
                                else
                                    var j = h[i][1];
                                for (var k = j.split(","), l = "", m = 0; m < k.length; m++)
                                    l += k[m]
                            }
                            f[o] === l && n.push(c[g])
                        }
                } else if ("출발시각" == e[0] || "도착시각" == e[0]) {
                    var p = "출발시각" == e[0] ? "StartTm" : "EndTm";
                    for (var g in c) {
                        var q = d[c[g].SID][p].split(":");
                        f.push(q[0] + "" + q[1])
                    }
                    "빠른순" == e[1] ? f = f.sort(function(a, b) {
                        return a - b
                    }) : "늦은순" == e[1] && (f = f.sort(function(a, b) {
                        return b - a
                    })),
                        f = $A(f).unique().$value();
                    for (var n = [], o = 0; o < f.length; o++)
                        for (var g in c) {
                            var q = d[c[g].SID][p].split(":");
                            q[0] + "" + q[1] == f[o] && n.push(c[g])
                        }
                } else if ("소요시간" == e[0]) {
                    for (var g in c) {
                        var q = d[c[g].SID].JrnyTm.split("시간");
                        f.push(q[0] + "" + q[1].slice(1, 3))
                    }
                    "짧은순" == e[1] ? f = f.sort(function(a, b) {
                        return a - b
                    }) : "긴순" == e[1] && (f = f.sort(function(a, b) {
                        return b - a
                    })),
                        f = $A(f).unique().$value();
                    for (var n = [], o = 0; o < f.length; o++)
                        for (var g in c) {
                            var q = d[c[g].SID].JrnyTm.split("시간");
                            q[0] + "" + q[1].slice(1, 3) == f[o] && n.push(c[g])
                        }
                } else if ("항공사" == e[0]) {
                    for (var g in c)
                        f.push(d[c[g].SID].MainAirVKR);
                    "오름차순" == e[1] ? f = f.sort() : "내림차순" == e[1] && (f = f.reverse()),
                        f = $A(f).unique().$value();
                    for (var n = [], o = 0; o < f.length; o++)
                        for (var g in c)
                            d[c[g].SID].MainAirVKR == f[o] && n.push(c[g])
                }
            } else if (1 == b || 1 == b)
                if ("가격" == e[0]) {
                    for (var g in c)
                        f.push(c[g].JAdultFare);
                    "낮은순" == e[1] ? f = f.sort(function(a, b) {
                        return a - b
                    }) : "높은순" == e[1] && (f = f.sort(function(a, b) {
                        return b - a
                    })),
                        f = $A(f).unique().$value();
                    for (var n = [], o = 0; o < f.length; o++)
                        for (var g in c)
                            f[o] === c[g].JAdultFare && n.push(c[g])
                } else if ("출발시각" == e[0] || "도착시각" == e[0]) {
                    var p = "출발시각" == e[0] ? "StartTM" : "EndTM";
                    for (var g in c) {
                        var q = c[g][p].split(":");
                        f.push(q[0] + "" + q[1])
                    }
                    "빠른순" == e[1] ? f = f.sort(function(a, b) {
                        return a - b
                    }) : "늦은순" == e[1] && (f = f.sort(function(a, b) {
                        return b - a
                    })),
                        f = $A(f).unique().$value();
                    for (var n = [], o = 0; o < f.length; o++)
                        for (var g in c) {
                            var q = c[g][p].split(":");
                            q[0] + "" + q[1] == f[o] && n.push(c[g])
                        }
                } else if ("항공사" == e[0]) {
                    for (var g in c)
                        f.push(c[g].JCarCode);
                    "오름차순" == e[1] ? f = f.sort() : "내림차순" == e[1] && (f = f.reverse()),
                        f = $A(f).unique().$value();
                    for (var n = [], o = 0; o < f.length; o++)
                        for (var g in c)
                            c[g].JCarCode == f[o] && n.push(c[g])
                }
            return c = n
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.Flights = jindo.$Class({
        _config: null ,
        _viewType: 1,
        _trip: "RT",
        _isDomestic: !1,
        _continentCode: 1,
        _oAjax: null ,
        _oSearchParam: null ,
        _continent: {
            1: ".lnk_recommendation_ase",
            2: ".lnk_recommendation_chn",
            3: ".lnk_recommendation_jpn",
            4: ".lnk_recommendation_usa",
            5: ".lnk_recommendation_eur",
            6: ".lnk_recommendation_oce",
            7: ".lnk_recommendation_all",
            8: ".lnk_recommendation_all",
            9: ".lnk_recommendation_all",
            10: ".lnk_recommendation_all",
            11: ".lnk_recommendation_kor"
        },
        $init: function() {
            if (this._config = pc.naver.search.config,
                    this._viewType = this._config.viewType,
                    this._isDomestic = this._config.flightData.isDomestic,
                    this._trip = this._config.trip,
                    this._assignElement(),
                    this._assignEvent(),
                    this._makeAutoComplete(),
                    this._makeCalendar(),
                    this._makePeopleSeat(),
                    this._makeRecentSearch(),
                    this._makeSearchResult(),
                    this._recommendationRender(),
                    this._assignDocumentScroll(),
                    this._oPeopleSeat.setData(this._config.flightData.isDomestic, this._config.flightData.adult, this._config.flightData.child, this._config.flightData.baby, this._config.flightData.seat),
                    "null" != this._config.stayLength ? this._oCalendarControl.setDates(this._config.trip, this._config.flightData.sdate1, this._config.flightData.sdate2, this._config.flightData.sdate3, this._config.stayLength) : this._oCalendarControl.setDates(this._config.trip, this._config.flightData.sdate1, this._config.flightData.sdate2, this._config.flightData.sdate3),
                    "MD" == this._trip ? null  != this._recentArea.query("li._num_2") && $Element(this._recentArea.query("li._num_2")).css("display", "none") : null  != this._recentArea.query("li._num_2") && $Element(this._recentArea.query("li._num_2")).css("display", "block"),
                2 == this._viewType)
                if (0 == this._continentCode) {
                    var a = this._oAutoCompleteControl.getSelectedOption();
                    this._getContinent(a.ecity1.code, $Fn(function(a) {
                        this._continentCode = a,
                            this._flightSearchBtn.fireEvent("click")
                    }, this).bind())
                } else
                    this._flightSearchBtn.fireEvent("click")
        },
        _assignElement: function() {
            var a = $Element(document.body);
            this._elFilter = $Element(a.query("div." + this._config.elSectionClass)),
                this._elContentArea = $Element(a.query("div.content")),
                this._planArea = $Element(this._elFilter.query("ul.navigation_list")),
                this._searchArea = $Element(this._elFilter.query("div.search_area")),
                this._welDepartureDateArea = $Element(this._searchArea.query("#l_8 ._departure_date_select_area")),
                this._dateSelect = $Element(this._searchArea.query("div._cal")),
                this._planAddBtn = $Element(this._searchArea.query("a._add_route_btn")),
                this._favoriteArea = $Element(this._elContentArea.query("div.recommendation_area")),
                this._favoriteTab = $Element(this._favoriteArea.query("ul.recommendation_navigation_list")),
                this._favoriteTabImgList = $Element(this._favoriteArea.query("ul.recommendation_img_list")),
                this._favoriteList = $Element(this._favoriteArea.query("ul.recommendation_list")),
                this._flightSearchBtn = $Element(this._searchArea.query("a.btn_search")),
                this._arrivalCity = $Element(this._searchArea.query("div._arrival_area_0")),
                this._arrivalCityName = $Element(this._searchArea.query("div._arrival_area_0 span._name")),
                this._arrivalCityCode = $Element(this._searchArea.query("div._arrival_area_0 span.flight_code")),
                this._arrivalMDCity = $Element(this._searchArea.query("div._arrival_area_1")),
                this._arrivalMDCityName = $Element(this._searchArea.query("div._arrival_area_1 span._name")),
                this._arrivalMDCityCode = $Element(this._searchArea.query("div._arrival_area_1 span.flight_code")),
                this._resultArea = $Element(this._elContentArea.query("div.result_area")),
                this._loadingArea = $Element(this._resultArea.query("div.loading_area")),
                this._tripArrival = $Element(this._elContentArea.query("div.result_area div._arrival_list")),
                this._arrivalResultArea = $Element(this._elContentArea.query("div._arrival_result")),
                this._tripThird = $Element(this._elContentArea.query("div.result_area div._trip3_list")),
                this._thirdResultArea = $Element(this._elContentArea.query("div._trip3_result")),
                this._recentArea = $Element(this._elFilter.query("ul.recent_result_list")),
                this._elDepartureRoute0 = this._elFilter.query("strong._departure_route_0"),
                this._elDepartureRoute1 = this._elFilter.query("strong._departure_route_1"),
                this._elArrivalRoute0 = this._elFilter.query("strong._arrival_route_0"),
                this._elArrivalRoute1 = this._elFilter.query("strong._arrival_route_1"),
                this._elDepartureRoute2 = this._elFilter.query("strong._departure_route_2"),
                this._welTopBtn = $Element(a.query("a.btn_top"))
        },
        _assignEvent: function() {
            this._fClickTab = $Fn(this._onClickPlanArea, this).attach(this._planArea.$value(), "click"),
                this._fClickFavoriteTab = $Fn(this._onClickFavoriteTab, this).attach(this._favoriteTab.$value(), "click"),
                this._fClickFlightSearchBtn = $Fn(this._onClickFlightSearchBtn, this).attach(this._flightSearchBtn.$value(), "click"),
                this._fClickfavoriteCity = this._favoriteList.delegate("click", "li.recommendation_item", $Fn(this._onClickfavoriteCity, this).bind()),
                this._fClickTopBtn = $Fn(this._onClickTopBtn, this).attach(this._welTopBtn.$value(), "click")
        },
        _makeAutoComplete: function() {
            this._oAutoCompleteControl = new pc.naver.service.AutoCompleteControl,
                this._oAutoCompleteControl.attach({
                    onClickItem: $Fn(function(a) {
                        2 == a.isDomestic ? this._recommendationRender(a.scity, a.scityK) : (this._isDomestic = 1 == a.isDomestic || 1 == a.isDomestic ? !0 : !1,
                            this._oPeopleSeat.setIsDomestic(a.isDomestic),
                            this._oCalendarControl.setIsDomestic(a.isDomestic),
                            this._getContinent(a.ecity1, $Fn(function(a) {
                                this._continentCode = a,
                                1 == this._viewType && (0 != a ? $Element(this._favoriteTab.query(this._continent[a])).fireEvent("click") : $Element(this._favoriteTab.query(".lnk_recommendation_all")).fireEvent("click"))
                            }, this).bind()))
                    }, this).bind(),
                    setUndefinedBtn: $Fn(function(a) {
                        this._oCalendarControl.setUndefinedBtn(a.isAct)
                    }, this).bind()
                })
        },
        _makeCalendar: function() {
            this._oCalendarControl = new pc.naver.service.CalendarControl,
                this._oCalendarControl.attach({
                    onClickDate: $Fn(function() {}, this).bind()
                })
        },
        _makePeopleSeat: function() {
            this._oPeopleSeat = new pc.naver.search.PeopleSeat
        },
        _makeSearchResult: function() {
            this._oSearchResult = new pc.naver.service.SearchResult
        },
        _isLocalStorageSupported: function() {
            var a = "test"
                , b = window.localStorage;
            try {
                return b.setItem(a, "1"),
                    b.removeItem("testKey"),
                    !0
            } catch (c) {
                return !1
            }
        },
        _makeRecentSearch: function() {
            if (0 != this._isLocalStorageSupported()) {
                var a = {};
                a.elBase = document.body,
                    this._oRecentSearch = new pc.naver.search.RecentSearch(a),
                    this._oRecentSearch.loadRecentSearch(),
                    this._oRecentSearch.attach({
                        onClickItem: $Fn(function(a) {
                            this._trip = a.TRIP,
                                this._isDomestic = a.is_domestic,
                                1 == a.is_domestic || 1 == a.is_domestic ? this._isDomestic = !0 : (0 == a.is_domestic || 0 == a.is_domestic) && (this._isDomestic = !1),
                                this._continentCode = a.Continent,
                                this._setSearchData(a),
                                this._flightSearchBtn.fireEvent("click"),
                            1 != a.is_domestic && "1" != a.is_domestic && 1 != a.is_domestic || "RT" != a.TRIP || this._oCalendarControl.setUndefinedBtn(!1)
                        }, this).bind()
                    })
            }
        },
        _sendClickCr: function(a, b, c) {
            var d = "";
            "OW" == b ? d = "one" : "RT" == b ? d = "rnd" : "MD" == b && (d = "mul"),
                clickcr(a.element, d + "." + c, "", "", a._event)
        },
        _onClickFlightSearchBtn: function(a) {
            this._sendClickCr(a, this._trip, "search");
            var b = this._trip
                , c = this._oAutoCompleteControl.getSelectedOption()
                , d = this._oCalendarControl.getSelectedOption()
                , e = this._oPeopleSeat.getSelectedOption()
                , f = this._isDomestic;
            if ("" == c.ecity1.code || "도착지 선택" == c.ecity1.code || null  != c.ecity2 && "도착지 선택" == c.ecity2.code)
                return void alert("도착지를 입력해주세요.");
            if (null  == c.scity1.code)
                return void alert("출발지를 입력해주세요.");
            if (null  == d.sdate1)
                return void alert("가는날을 선택해주세요.");
            if (null  == d.sdate2 && "RT" == b && null  == d.stayLength)
                return void alert("오는날을 선택해주세요.");
            if (null  == d.sdate2 && "MD" == b && null  == d.stayLength)
                return void alert("가는날을 선택해주세요.");
            if (null  == d.sdate3 && "MD" == b && null  != c.scity3 && null  == d.stayLength)
                return void alert("가는날을 선택해주세요.");
            if (c.ecity1.code === c.scity1.code)
                return void alert("출발지와 도착지는 다르게 입력해주세요.");
            if (c.scity1.kCityName == c.ecity1.kCityName)
                return void alert("출발지와 도착지는 다르게 입력해주세요.");
            if ("서울" == c.scity1.kCityName && "김포" == c.ecity1.kCityName)
                return void alert("출발지와 도착지는 다르게 입력해주세요.");
            if ("Seoul" == c.scity1.eCityName && "Seoul" == c.ecity1.eCityName)
                return void alert("출발지와 도착지는 다르게 입력해주세요.");
            if ("MD" == b) {
                if (null  != c.scity2.eCityName && null  != c.ecity2.eCityName && c.scity2.eCityName == c.ecity2.eCityName)
                    return void alert("출발지와 도착지는 다르게 입력해주세요.");
                if (2 == this._viewType && null  == c.ecity2.kNationName)
                    ;
                else if (null  == c.ecity3 && "대한민국" != c.ecity2.kNationName && null  != c.ecity2.kNationName)
                    return void alert("마지막 여정의 도착지는 국내공항으로 선택해주세요.")
            }
            var g = {};
            g.SCITY1 = c.scity1.code,
                g.ECITY1 = c.ecity1.code,
                g.SCITY2 = "RT" == b ? c.ecity1.code : c.scity2 ? c.scity2.code : "",
                g.ECITY2 = "RT" == b ? c.scity1.code : c.ecity2 ? c.ecity2.code : "",
                g.SCITY3 = c.scity3 ? c.scity3.code : "",
                g.ECITY3 = c.ecity3 ? c.ecity3.code : "",
                g.SCITYK = c.scity1.kCityName,
                g.SCITY2K = c.scity2 ? c.scity2.kCityName : "",
                g.SCITY3K = c.scity3 ? c.scity3.kCityName : "",
                g.ECITY1K = c.ecity1.kCityName,
                g.ECITY2K = c.scity2 ? c.ecity2.kCityName : "",
                g.ECITYK = c.ecity3 ? c.ecity3.kCityName : c.ecity2 ? c.ecity2.kCityName : c.ecity1.kCityName,
                g.SDATE1 = d.sdate1,
                g.SDATE2 = null  == d.sdate2 ? "" : d.sdate2,
                g.SDATE3 = null  == d.sdate3 ? "" : d.sdate3,
                g.StayLength = null  == d.stayLength ? "" : d.stayLength,
                g.TRIP = b,
                g.FareType = e.seat,
                g.Adt = e.adult,
                g.Chd = e.child,
                g.Inf = e.baby,
                g.Continent = this._continentCode,
                g.is_domestic = 1 == f || 1 == f ? 1 : 0;
            var h = $Cookie();
            g._csrf = h.get("XSRF-TOKEN");
            var i = h.get("sparam");
            if (null  !== i && "string" == typeof i) {
                var j = JSON.parse(decodeURIComponent(i));
                g.query = null  !== j && "string" == typeof j.query && null  !== j.query && j.query.length > 0 ? j.query : ""
            }
            this._oSearchParam = g,
                this._loadingRender(g),
                this._favoriteArea.css("display", "none"),
                this._resultArea.css("display", "block"),
                this._tripArrival.css("display", "none"),
                this._arrivalResultArea.css("display", "none"),
                this._tripThird.css("display", "none"),
                this._thirdResultArea.css("display", "none"),
                this._getImageUrl(g.ECITY1, $Fn(function(a, b, c) {
                    var d = a.split("=");
                    this._loadingArea.css({
                        backgroundImage: "url(" + d[0] + "=f692_923_fst)"
                    });
                    var e = a.split("=");
                    g.IMG_URL = e[0],
                    ("wikimedia" == b || "wikipedia" == b || "flickr" == b || "pexels" == b) && ($Element(this._loadingArea.query("a.lnk_origin")).html("사진 : " + b),
                        $Element(this._loadingArea.query("a.lnk_origin")).attr("href", c)),
                        this._oRecentSearch.saveRecentSearch(g),
                        this._oRecentSearch.loadRecentSearch(),
                        this._oSearchResult.getFlightsList(g)
                }, this).bind())
        },
        _onClickPlanArea: function(a) {
            for (var b = a.element, c = $Element(b), d = "", e = this._planArea.queryAll("li a"), f = $Element(this._searchArea.query("#l_1")), g = this._searchArea.queryAll("div.md_li"), h = 0; h < e.length; h++)
                $Element(e[h]).removeClass("lnk_navigation_on");
            if ("a" == c.tag)
                d = $Element(c.query("span")).html(),
                    c.addClass("lnk_navigation_on");
            else {
                if ("span" != c.tag)
                    return;
                d = c.html(),
                    $Element(c.parent()).addClass("lnk_navigation_on")
            }
            if ("편도" == d) {
                null  != this._recentArea.query("li._num_2") && $Element(this._recentArea.query("li._num_2")).css("display", "block"),
                    this._oPeopleSeat.setIsDomestic(1 == this._isDomestic || 1 == this._isDomestic ? !0 : !1),
                    this._trip = "OW",
                    this._searchArea.addClass("search_area_single_trip"),
                    this._searchArea.removeClass("search_area_multi_trip"),
                    this._dateSelect.css("display", "block"),
                    this._planAddBtn.css("display", "none"),
                    this._welDepartureDateArea.css("display", "block"),
                    f.show();
                for (var h = 0; h < g.length; h++)
                    $Element(g[h]).css("display", "none");
                this._oCalendarControl.changeTab("OW")
            } else if ("왕복" == d) {
                null  != this._recentArea.query("li._num_2") && $Element(this._recentArea.query("li._num_2")).css("display", "block"),
                    this._oPeopleSeat.setIsDomestic(1 == this._isDomestic || 1 == this._isDomestic ? !0 : !1),
                    this._trip = "RT",
                    this._searchArea.removeClass("search_area_single_trip"),
                    this._searchArea.removeClass("search_area_multi_trip"),
                    this._dateSelect.css("display", "block"),
                    this._planAddBtn.css("display", "none"),
                    this._welDepartureDateArea.css("display", "block"),
                    f.show();
                for (var h = 0; h < g.length; h++)
                    $Element(g[h]).css("display", "none");
                this._oCalendarControl.changeTab("RT")
            } else if ("다구간" == d) {
                null  != this._recentArea.query("li._num_2") && $Element(this._recentArea.query("li._num_2")).css("display", "none"),
                    this._oPeopleSeat.setIsDomestic(!1),
                    this._trip = "MD",
                    this._searchArea.removeClass("search_area_single_trip"),
                    this._searchArea.addClass("search_area_multi_trip"),
                    this._dateSelect.css("display", "none"),
                    this._planAddBtn.css("display", "block"),
                    this._welDepartureDateArea.css("display", "none"),
                    f.hide();
                for (var h = 0; h < g.length - 2; h++)
                    $Element(g[h]).css("display", "block");
                this._oCalendarControl.changeTab("MD"),
                    this._oAutoCompleteControl.setMultiInitRoute()
            }
        },
        _onClickFavoriteTab: function(a) {
            var b = a.element
                , c = $Element(b);
            $Element(this._favoriteTab.query("a.lnk_recommendation_on")).removeClass("lnk_recommendation_on"),
                c.addClass("lnk_recommendation_on");
            var d = $Element(c.parent().parent().parent()).className().split(" ");
            $Element(c.parent().parent().parent()).removeClass(d[1]),
                d = c.className().split(" "),
                $Element(c.parent().parent().parent()).addClass(d[2]),
                this._recommendationRender()
        },
        _onClickfavoriteCity: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = c.attr("data-code")
                , e = c.attr("data-name");
            if (e.indexOf("(") > 0) {
                var f = e.split("(");
                e = f[0]
            }
            var g = c.attr("data-dom");
            if (g = 1 == g || "1" == g ? !0 : !1,
                    this._continentCode = parseInt(c.attr("data-con")),
                1 == g || 1 == g)
                "MD" == this._trip && $Element(this._planArea.query("span.lnk_navigation_round_way")).fireEvent("click");
            else {
                this._arrivalMDCity.removeClass("trip_info_route_off"),
                    this._arrivalMDCityName.html(e),
                    this._arrivalMDCityCode.html(d);
                var h = $Element(this._arrivalMDCity.query(".tit_airport"));
                h.attr("data-code", d),
                    h.attr("data-kcity-name", e),
                    h.attr("data-knation-name", "")
            }
            this._arrivalCity.removeClass("trip_info_route_off"),
                this._arrivalCityName.html(e),
                this._arrivalCityCode.html(d);
            var h = $Element(this._arrivalCity.query(".tit_airport"));
            h.attr("data-code", d),
                h.attr("data-kcity-name", e),
                1 == g ? h.attr("data-knation-name", "대한민국") : h.attr("data-knation-name", ""),
                "OW" == this._trip || "RT" == this._trip ? 1 == g || 1 == g ? (this._removeRoute(this._elArrivalRoute1, "도착"),
                    this._removeRoute(this._elDepartureRoute2, "출발")) : (this._copyRoute(this._elArrivalRoute0, this._elArrivalRoute1),
                    this._copyRoute(this._elArrivalRoute0, this._elDepartureRoute2)) : "MD" == this._trip && ("출발" == $Element(this._elDepartureRoute2).query("._name").innerHTML && this._copyRoute(this._elArrivalRoute1, this._elDepartureRoute2),
                    this._copyRoute(this._elArrivalRoute1, this._elArrivalRoute0)),
            "RT" == this._trip && this._oCalendarControl.setUndefinedBtn(1 == g ? !1 : !0),
            ("OW" == this._trip || "RT" == this._trip) && ("인천" != $Element(this._elDepartureRoute0).query("._name").innerHTML || 1 != g && 1 != g || (this._setDepartureKimpo(),
                this._copyRoute(this._elDepartureRoute0, this._elDepartureRoute1))),
                this._isDomestic = g,
                this._oPeopleSeat.setIsDomestic(this._isDomestic),
                this._oCalendarControl.setIsDomestic(this._isDomestic)
        },
        _getContinent: function(a, b) {
            var c = a;
            null  != this._oAjax && this._oAjax.abort(),
                this._oAjax = new $Ajax("getContinent?city_code=" + c,{
                    method: "get",
                    onload: $Fn(function(a) {
                        var c = a.json();
                        b(0 == c.retCode ? c.retMessage : 0)
                    }, this).bind(),
                    onerror: $Fn(function() {
                        b(0)
                    }, this).bind()
                }).request()
        },
        _recommendationRender: function(a, b) {
            var c = $Element(this._favoriteTab.query("a.lnk_recommendation_on")).attr("data-con")
                , d = this._oAutoCompleteControl.getSelectedOption()
                , e = void 0 == a ? d.scity1.code : a
                , f = void 0 == b ? d.scity1.kCityName : b;
            null  != this._oAjax && this._oAjax.abort(),
                this._oAjax = new $Ajax("Shortest?SCITY=" + e + "&SCITY_NAME=" + encodeURIComponent(f) + "&CID=" + c,{
                    method: "get",
                    onload: $Fn(function(a) {
                        var b = [];
                        if (0 == a.json().retCode) {
                            for (var d in a.json().result)
                                b.push(a.json().result[d]);
                            for (var e = [], f = 0; 8 > f; f++) {
                                var g = ""
                                    , h = ""
                                    , i = ""
                                    , j = '<span class="sp_flight txt_time">' + b[f].shortestHour + "</span>";
                                (0 == f || 6 == f) && (g = "recommendation_item_x2"),
                                    0 == b[f].viaCount ? i = "직항" : 100 == b[f].viaCount ? (i = b[f].shortestHour,
                                        j = "") : i = "경유 " + b[f].viaCount + "회";
                                var k = null ;
                                0 == f || 6 == f ? (k = b[f].img2.split("="),
                                    h = b[f].img2,
                                    k[1] = "=f461_230_blur") : (k = b[f].img1.split("="),
                                    h = b[f].img1,
                                    k[1] = "=f230_230_blur");
                                var l = void 0 == b[f].continedId ? c : b[f].continedId
                                    , m = "" == b[f].copyrightUrl ? "javascript:;" : b[f].copyrightUrl
                                    , n = '<li class="recommendation_item ' + g + '" data-code="' + b[f].ecity + '" data-name="' + b[f].cityName + '" data-dom="' + b[f].isDomestic + '" data-con="' + l + '" onclick="clickcr(this, \'' + b[f].clickId + "', '', '', event);\"> 										<span class=\"lnk_recommendation\" style=\"background-image:url(" + h + ')"> 											<dl class="recommendation_box"> 												<dt class="tit_airport">' + b[f].cityName + '</dt> 				                                <dd class="txt_airport_code">' + b[f].cityNameEng + '</dd> 												<dd class="txt_airport_info"><span class="sp_flight txt_trip txt_trip_direct">' + i + "</span>" + j + '</dd> 											</dl> 				                            <span class="bg_gradient"></span> 				                            <div class="recommendation_box_cover" style="background-image:url(' + k[0] + k[1] + ')"> 												<dl class="recommendation_cover_area"> 												<dt class="tit_airport">' + b[f].cityName + '</dt> 				                                <dd class="txt_airport_code">' + b[f].cityNameEng + "</dd>";
                                ("wikimedia" == b[f].copyright || "wikipedia" == b[f].copyright || "flickr" == b[f].copyright || "pexels" == b[f].copyright) && (n += '												<dd class="txt_cover_info"><a href="' + m + "\" target=\"_blank\" onclick=\"clickcr(this, 'mai.imglink', '', '', event);\">사진 : " + b[f].copyright + "</a></dd>"),
                                    n += '												<dd class="cover_in" style="background-image:url(' + k[0] + '=f120_120_round)"></dd> 												</dl> 												<span class="sp_flight etc_arr"></span> 											</div> 				          				</span> 				           			</li>',
                                    e.push(n)
                            }
                            this._favoriteList.html(e.join(""))
                        } else
                            alert("인기여행지를 불러오는데 실패하였습니다.")
                    }, this).bind(),
                    onerror: $Fn(function() {
                        alert("인기여행지를 불러오는데 실패하였습니다.")
                    }, this).bind()
                }).request()
        },
        _loadingRender: function(a) {
            var b = "" == a.SDATE2 ? "" : "" == a.SDATE3 ? " - " + this._makeDtString(a.SDATE2) : " - " + this._makeDtString(a.SDATE2) + " - " + this._makeDtString(a.SDATE3)
                , c = "";
            "OW" == a.TRIP ? c = "편도" : "RT" == a.TRIP ? c = "왕복" : "MD" == a.TRIP && (c = "다구간");
            var d = ' 			<div class="loading_progress_area">';
            "" == a.SCITY2 ? d += ' 						<ul class="loading_progress_menu loading_progress_menu_type_1"> 						<li class="loading_progress_item loading_progress_item_1">' + a.SCITY1 + '</li> 						<li class="loading_progress_item loading_progress_item_2">' + a.ECITY1 + "</li> 						</ul>" : a.SCITY2 == a.ECITY1 && "" == a.SCITY3 ? d += ' 						<ul class="loading_progress_menu loading_progress_menu_type_2"> 						<li class="loading_progress_item loading_progress_item_1">' + a.SCITY1 + '</li> 						<li class="loading_progress_item loading_progress_item_2">' + a.SCITY2 + '</li> 						<li class="loading_progress_item loading_progress_item_3">' + a.ECITY2 + "</li> 						</ul>" : a.SCITY2 != a.ECITY1 && "" == a.SCITY3 ? d += ' 						<ul class="loading_progress_menu loading_progress_menu_type_3"> 						<li class="loading_progress_item loading_progress_item_1">' + a.SCITY1 + '</li> 						<li class="loading_progress_item loading_progress_item_2">' + a.ECITY1 + '</li> 						<li class="loading_progress_item loading_progress_item_3">' + a.SCITY2 + '</li> 						<li class="loading_progress_item loading_progress_item_4">' + a.ECITY2 + "</li> 						</ul>" : "" != a.SCITY3 && (d += ' 						<ul class="loading_progress_menu loading_progress_menu_type_5"> 						<li class="loading_progress_item loading_progress_item_1">' + a.SCITY1 + '</li> 						<li class="loading_progress_item loading_progress_item_2">' + a.ECITY1 + '</li> 						<li class="loading_progress_item loading_progress_item_3">' + a.SCITY2 + '</li> 						<li class="loading_progress_item loading_progress_item_4">' + a.ECITY2 + '</li> 						<li class="loading_progress_item loading_progress_item_5">' + a.SCITY3 + '</li> 						<li class="loading_progress_item loading_progress_item_6">' + a.ECITY3 + "</li> 						</ul>"),
                d += ' 						<div class="loading_pregress_bar"> 							<div id="loading" class="loading_progress_animation_bar"> 								<div class="sp_flight loading_progress_animation_target"></div> 							</div> 						</div> 						<div class="loading_progress_date">' + this._makeDtString(a.SDATE1) + b + '</div> 					</div> 					<div class="loading_phase_area"> 						<p class="loading_phase">',
                d += "MD" == a.TRIP ? ' 							<span class="txt_phase"><strong class="txt_phase_str">' + a.SCITYK + "</strong>에서 출발하는</span>" : ' 							<span class="txt_phase"><strong class="txt_phase_str">' + a.SCITYK + '</strong>에서</span> 							<span class="txt_phase"><strong class="txt_phase_str">' + a.ECITYK + "</strong>까지</span>",
                d += ' 							<span class="txt_phase"><strong class="txt_phase_str">' + c + '</strong>여정을</span> 							<span class="txt_phase">찾고 있습니다</span> 						</p> 						<a href="#" target="_blank" class="lnk_origin"></a> 					</div> 					<div class="loading_background_mask"></div>',
                this._loadingArea.html(d)
        },
        _getImageUrl: function(a, b) {
            null  != this._oAjax && this._oAjax.abort(),
                this._oAjax = new $Ajax("getImageUrl?city_code=" + a + "&img_type=m1500",{
                    method: "get",
                    onload: $Fn(function(a) {
                        var c = a.json();
                        0 == c.retCode ? b(c.retMessage.img, c.retMessage.copyright, c.retMessage.copyright_url) : b("http://dbscthumb.phinf.naver.net/3720_000_1/20141225144755098_KSFOPP56G.JPG/Mid-Hudson_ballo.JPG?type=m1500")
                    }, this).bind(),
                    onerror: $Fn(function() {
                        b("http://dbscthumb.phinf.naver.net/3720_000_1/20141225144755098_KSFOPP56G.JPG/Mid-Hudson_ballo.JPG?type=m1500")
                    }, this).bind()
                }).request()
        },
        _setSearchData: function(a) {
            "OW" == a.TRIP ? ($Element(this._planArea.query("span.lnk_navigation_one_way")).fireEvent("click"),
                $Element(this._searchArea.query("div._arrival_area_0")).removeClass("trip_info_route_off"),
                $Element(this._searchArea.query("strong._arrival_route_0")).attr("data-code", ""),
                $Element(this._searchArea.query("strong._departure_route_0")).attr("data-code", ""),
                $Element(this._searchArea.query("div._departure_area_0 span._name")).html(a.SCITYK),
                $Element(this._searchArea.query("div._departure_area_0 span.flight_code")).html(a.SCITY1),
                $Element(this._searchArea.query("div._arrival_area_0 span._name")).html(a.ECITYK),
                $Element(this._searchArea.query("div._arrival_area_0 span.flight_code")).html(a.ECITY1)) : "RT" == a.TRIP ? ($Element(this._planArea.query("span.lnk_navigation_round_way")).fireEvent("click"),
                $Element(this._searchArea.query("div._arrival_area_0")).removeClass("trip_info_route_off"),
                $Element(this._searchArea.query("strong._arrival_route_0")).attr("data-code", ""),
                $Element(this._searchArea.query("strong._departure_route_0")).attr("data-code", ""),
                $Element(this._searchArea.query("div._departure_area_0 span._name")).html(a.SCITYK),
                $Element(this._searchArea.query("div._departure_area_0 span.flight_code")).html(a.SCITY1),
                $Element(this._searchArea.query("div._arrival_area_0 span._name")).html(a.ECITYK),
                $Element(this._searchArea.query("div._arrival_area_0 span.flight_code")).html(a.ECITY1)) : "MD" == a.TRIP && ($Element(this._searchArea.query("div._arrival_area_0")).removeClass("trip_info_route_off"),
                $Element(this._searchArea.query("strong._arrival_route_0")).attr("data-code", ""),
                $Element(this._searchArea.query("strong._departure_route_0")).attr("data-code", ""),
                $Element(this._searchArea.query("div._departure_area_0 span._name")).html(a.SCITYK),
                $Element(this._searchArea.query("div._departure_area_0 span.flight_code")).html(a.SCITY1),
                $Element(this._searchArea.query("div._arrival_area_0 span._name")).html(a.ECITY1K),
                $Element(this._searchArea.query("div._arrival_area_0 span.flight_code")).html(a.ECITY1),
                $Element(this._planArea.query("span.lnk_navigation_multi_way")).fireEvent("click"),
                $Element(this._searchArea.query("div._arrival_area_1")).removeClass("trip_info_route_off"),
                $Element(this._searchArea.query("strong._arrival_route_1")).attr("data-code", ""),
                $Element(this._searchArea.query("strong._departure_route_1")).attr("data-code", ""),
                $Element(this._searchArea.query("div._departure_area_1 span._name")).html(a.SCITYK),
                $Element(this._searchArea.query("div._departure_area_1 span.flight_code")).html(a.SCITY1),
                $Element(this._searchArea.query("div._arrival_area_1 span._name")).html(a.ECITY1K),
                $Element(this._searchArea.query("div._arrival_area_1 span.flight_code")).html(a.ECITY1),
                $Element(this._planArea.query("span.lnk_navigation_multi_way")).fireEvent("click"),
                $Element(this._searchArea.query("div._arrival_area_2")).removeClass("trip_info_route_off"),
                $Element(this._searchArea.query("strong._arrival_route_2")).attr("data-code", ""),
                $Element(this._searchArea.query("strong._departure_route_2")).attr("data-code", ""),
                $Element(this._searchArea.query("div._departure_area_2 span._name")).html(a.SCITY2K),
                $Element(this._searchArea.query("div._departure_area_2 span.flight_code")).html(a.SCITY2),
                $Element(this._searchArea.query("div._arrival_area_2 span._name")).html(a.ECITY2K),
                $Element(this._searchArea.query("div._arrival_area_2 span.flight_code")).html(a.ECITY2),
            "" != a.SDATE3 && ($Element(this._searchArea.query("div#l_6")).css("display", "block"),
                $Element(this._searchArea.query("div#l_7")).css("display", "block"),
                $Element(this._searchArea.query("div._arrival_area_3")).removeClass("trip_info_route_off"),
                $Element(this._searchArea.query("div._departure_area_3")).removeClass("trip_info_route_off"),
                $Element(this._searchArea.query("strong._arrival_route_3")).attr("data-code", ""),
                $Element(this._searchArea.query("strong._departure_route_3")).attr("data-code", ""),
                $Element(this._searchArea.query("div._departure_area_3 span._name")).html(a.SCITY3K),
                $Element(this._searchArea.query("div._departure_area_3 span.flight_code")).html(a.SCITY3),
                $Element(this._searchArea.query("div._arrival_area_3 span._name")).html(a.ECITYK),
                $Element(this._searchArea.query("div._arrival_area_3 span.flight_code")).html(a.ECITY3),
                this._planAddBtn.css("display", "none"))),
                this._oCalendarControl.setDates(a.TRIP, this._makeStringDt(a.SDATE1), this._makeStringDt(a.SDATE2), this._makeStringDt(a.SDATE3), a.StayLength),
                this._oPeopleSeat.setData(a.is_domestic, a.Adt, a.Chd, a.Inf, a.FareType)
        },
        _makeDtString: function(a) {
            if ("" != a) {
                var b = /^(\d{4})(\d{2})(\d{2})$/g
                    , c = b.exec(a);
                return null  === c || c.length < 4 ? "invalid" : c[1] + "." + c[2] + "." + c[3] + "."
            }
            return ""
        },
        _makeStringDt: function(a) {
            if ("" != a) {
                var b = a.split(".");
                return b[0] + "" + b[1] + b[2]
            }
            return ""
        },
        _copyRoute: function(a, b) {
            var c = $Element(a)
                , d = $Element(b);
            d.attr("data-code", c.attr("data-code")),
                d.attr("data-enation-name", c.attr("data-enation-name")),
                d.attr("data-knation-name", c.attr("data-knation-name")),
                d.attr("data-ecity-name", c.attr("data-ecity-name")),
                d.attr("data-kcity-name", c.attr("data-kcity-name")),
                d.attr("data-eairport-name", c.attr("data-eairport-name")),
                d.attr("data-kairport-name", c.attr("data-kairport-name"));
            var e = c.query("._name")
                , f = d.query("._name");
            f.innerHTML = e.innerHTML;
            var g = $$.getSingle(".flight_code", b.parentNode);
            g.innerHTML = c.attr("data-code");
            var h = $$.getSingle("!.trip_info_route", g);
            $Element(h).removeClass("trip_info_route_off")
        },
        _removeRoute: function(a, b) {
            var c = $Element(a);
            c.attr("data-code", ""),
                c.attr("data-enation-name", ""),
                c.attr("data-knation-name", ""),
                c.attr("data-ecity-name", ""),
                c.attr("data-kcity-name", ""),
                c.attr("data-eairport-name", ""),
                c.attr("data-kairport-name", "");
            var d = c.query("._name");
            d.innerHTML = b;
            var e = $$.getSingle(".flight_code", a.parentNode);
            e.innerHTML = b + "지 선택";
            var f = $$.getSingle("!.trip_info_route", a);
            $Element(f).addClass("trip_info_route_off")
        },
        _setDepartureKimpo: function() {
            var a = $Element(this._elDepartureRoute0);
            a.attr("data-code", "GMP"),
                a.attr("data-enation-name", "Korea Republic of"),
                a.attr("data-knation-name", "대한민국"),
                a.attr("data-ecity-name", "Seoul"),
                a.attr("data-kcity-name", "김포"),
                a.attr("data-eairport-name", "Gimpo Int Arpt"),
                a.attr("data-kairport-name", "김포국제공항");
            var b = a.query("._name");
            b.innerHTML = "김포";
            var c = $$.getSingle(".flight_code", a.$value().parentNode);
            $Element(c).html("GMP")
        },
        _onClickTopBtn: function(a) {
            var b = "";
            b = null  == this._oSearchParam ? "mai" : 0 == this._oSearchParam.is_domestic ? "isr" : "dsr",
                clickcr(a.element, b + ".top", "", "", a._event),
                window.scrollTo(0, 0)
        },
        _assignDocumentScroll: function() {
            this._welTopBtn.css({
                opacity: 0,
                position: "fixed"
            }),
                this._oTransition = new jindo.Transition,
            $Document().scrollPosition().top > 0 && this._oTransition.start(300, this._welTopBtn.$value(), {
                "@opacity": 1
            }),
                window.onscroll = $Fn(function() {
                    var a = $Document().scrollPosition();
                    a.top > 0 ? this._oTransition.start(300, this._welTopBtn.$value(), {
                        "@opacity": 1
                    }) : (this._oTransition.abort(),
                        this._oTransition.start(300, this._welTopBtn.$value(), {
                            "@opacity": 0
                        }))
                }, this).bind()
        }
    }).extend(jindo.UIComponent),
    pc.naver.service.SearchResult = jindo.$Class({
        _config: null ,
        _oAjax: null ,
        _oFlightsList: null ,
        _oRenderItem: {
            sid: "",
            type: "",
            payment: "",
            psid: "",
            seat: ""
        },
        _oRenderList: null ,
        _oSearchParam: null ,
        _oAirline: null ,
        _oDomesticDeparture: null ,
        _selectContinent: null ,
        _oDetailLength: null ,
        _oRouteTripOpen: !1,
        _oMorph: null ,
        _continent: {
            1: "trip_title_southeast",
            2: "trip_title_china",
            3: "trip_title_japan",
            4: "trip_title_america",
            5: "trip_title_europe",
            6: "trip_title_oceania",
            7: "trip_title_asia",
            8: "trip_title_middleeast",
            9: "trip_title_south_america",
            10: "trip_title_africa",
            11: "trip_title_korea"
        },
        $init: function() {
            this._config = pc.naver.search.config,
                this._config.airlineFlag = "" != this._config.airlineName ? !0 : !1,
                this._oAirline = pc.naver.service.oAirline,
                this._assignElement(),
                this._assignEvent(),
                this._makeFilter(),
                this._makeDetailResult(),
                this._oMorph = new jindo.Morph({
                    bUseTransition: !1,
                    fEffect: jindo.Effect.cubicEaseOut
                })
        },
        _assignElement: function() {
            var a = $Element(document.body);
            this._elFilterArea = $Element(a.query("div._flight_filter")),
                this._elContentArea = $Element(a.query("div.content")),
                this._favoriteArea = $Element(this._elContentArea.query("div.recommendation_area")),
                this._resultArea = $Element(this._elContentArea.query("div.result_area")),
                this._loadingArea = $Element(this._resultArea.query("div.loading_area")),
                this._tripDeparture = $Element(this._elContentArea.query("div.result_area div._departure_list")),
                this._tripDepartureTitle = $Element(this._tripDeparture.query("div.trip_title")),
                this._departureFilter = $Element(this._tripDeparture.query("div.trip_filter")),
                this._departureBanner = $Element(this._tripDeparture.query("div.trip_banner")),
                this._departureList = $Element(this._tripDeparture.query("ul.trip_result_list")),
                this._departureListInfo = $Element(this._tripDeparture.query("div.trip_info")),
                this._departureDateTxt = $Element(this._tripDeparture.query("span.txt_date")),
                this._departurePlanDesc = $Element(this._tripDeparture.query("p.dsc_info")),
                this._departurePartnerDesc = $Element(this._tripDeparture.query("p.dsc_partner")),
                this._departureTitle = $Element(this._tripDeparture.query("h3.tit_arrival")),
                this._departureMDTitle = $Element(this._tripDeparture.query("h3.tit_trip_1")),
                this._departurePromotion = $Element(this._tripDeparture.query("div.trip_promotion_banner")),
                this._departureResultArea = $Element(this._elContentArea.query("div._departure_result")),
                this._departureResultDateTxt = $Element(this._departureResultArea.query("span.txt_date")),
                this._departureResultPlanDesc = $Element(this._departureResultArea.query("p.dsc_info")),
                this._departureResultList = $Element(this._departureResultArea.query("div.trip_result")),
                this._departureResultTitle = $Element(this._departureResultArea.query("h3.tit_departure")),
                this._departureResultMDTitle = $Element(this._departureResultArea.query("h3.tit_trip_1")),
                this._departureCancel = $Element(this._elContentArea.query("div._departure_result span.btn_close")),
                this._tripArrival = $Element(this._elContentArea.query("div.result_area div._arrival_list")),
                this._tripArrivalTitle = $Element(this._tripArrival.query("div.trip_title")),
                this._arrivalTopList = $Element(this._tripArrival.query("ul.trip_result_list")),
                this._arrivalList = $Element(this._tripArrival.query("div.trip_result_another  ul.trip_result_list")),
                this._arrivalListInfo = $Element(this._tripArrival.query("div.trip_info")),
                this._arrivalAnotherInfo = $Element(this._tripArrival.query("div.trip_result_another_title")),
                this._arrivalDateTxt = $Element(this._tripArrival.query("span.txt_date")),
                this._arrivalPlanDesc = $Element(this._tripArrival.query("p.dsc_info")),
                this._arrivalPartnerDesc = $Element(this._tripArrival.query("p.dsc_partner")),
                this._arrivalTitle = $Element(this._tripArrival.query("h3.tit_departure")),
                this._arrivalMDTitle = $Element(this._tripArrival.query("h3.tit_trip_2")),
                this._arrivalPromotion = $Element(this._tripArrival.query("div.trip_promotion_banner")),
                this._arrivalResultArea = $Element(this._elContentArea.query("div._arrival_result")),
                this._arrivalFilter = $Element(this._arrivalResultArea.query("ul.trip_filter_list")),
                this._arrivalResultDateTxt = $Element(this._arrivalResultArea.query("span.txt_date")),
                this._arrivalResultPlanDesc = $Element(this._arrivalResultArea.query("p.dsc_info")),
                this._arrivalResultList = $Element(this._arrivalResultArea.query("div.trip_result")),
                this._arrivalResultTitle = $Element(this._arrivalResultArea.query("h3.tit_arrival")),
                this._arrivalResultMDTitle = $Element(this._arrivalResultArea.query("h3.tit_trip_2")),
                this._arrivalCancel = $Element(this._elContentArea.query("div._arrival_result span.btn_close")),
                this._tripThird = $Element(this._elContentArea.query("div.result_area div._trip3_list")),
                this._tripThirdTitle = $Element(this._tripThird.query("div.trip_title")),
                this._thirdTopList = $Element(this._tripThird.query("ul.trip_result_list")),
                this._thirdList = $Element(this._tripThird.query("div.trip_result_another  ul.trip_result_list")),
                this._thirdListInfo = $Element(this._tripThird.query("div.trip_info")),
                this._thirdAnotherInfo = $Element(this._tripThird.query("div.trip_result_another_title")),
                this._thirdDateTxt = $Element(this._tripThird.query("span.txt_date")),
                this._thirdPlanDesc = $Element(this._tripThird.query("p.dsc_info")),
                this._thirdPromotion = $Element(this._tripThird.query("div.trip_promotion_banner")),
                this._thirdResultArea = $Element(this._elContentArea.query("div._trip3_result")),
                this._thirdFilter = $Element(this._thirdResultArea.query("ul.trip_filter_list")),
                this._thirdResultDateTxt = $Element(this._thirdResultArea.query("span.txt_date")),
                this._thirdResultPlanDesc = $Element(this._thirdResultArea.query("p.dsc_info")),
                this._thirdResultList = $Element(this._thirdResultArea.query("div.trip_result")),
                this._thirdCancel = $Element(this._elContentArea.query("div._trip3_result span.btn_close")),
                this._detailArea = $Element(this._resultArea.query("div.trip_reservation")),
                this._welLeftArea = $Element($$.getSingle("div.flight_filter")),
                this._welRightArea = $Element($$.getSingle("div.result_area"))
        },
        _assignEvent: function() {
            this._fClickList = this._elContentArea.delegate("click", "li.trip_result_item", $Fn(this._onClickList, this).bind()),
                this._fClickRoute = this._elContentArea.delegate("click", "div.txt_way", $Fn(this._onClickRoute, this).bind()),
                this._fClickDepartureCancel = $Fn(this._onClickDepartureCancel, this).attach(this._departureCancel.$value(), "click"),
                this._fClickArrivalCancel = $Fn(this._onClickArrivalCancel, this).attach(this._arrivalCancel.$value(), "click"),
                this._fClickThirdCancel = $Fn(this._onClickThirdCancel, this).attach(this._thirdCancel.$value(), "click"),
                this._fClickPayment = this._elContentArea.delegate("click", "li.ly_payment_item", $Fn(this._onClickPayment, this).bind()),
                this._fClickPaymentCheck = this._elContentArea.delegate("click", "a.btn_check", $Fn(this._onClickPaymentCheck, this).bind()),
                this._fClickPaymentClose = this._elContentArea.delegate("click", "a.btn_close", $Fn(this._onClickPaymentClose, this).bind()),
                this._fOverDetailSchedule = this._elContentArea.delegate("mouseover", "a.btn_trip_schedule", $Fn(this._onOverDetailSchedule, this).bind()),
                this._fOutDetailSchedule = this._elContentArea.delegate("mouseout", "a.btn_trip_schedule", $Fn(this._onOutDetailSchedule, this).bind())
        },
        _makeFilter: function() {
            this._oFilter = new pc.naver.service.Filter,
                this._oFilterControl = new pc.naver.service.FilterControl,
                this._oSortControl = new pc.naver.service.SortControl,
                this._oFilter.attach({
                    changeItem: $Fn(function(a) {
                        if ("sort" == a.oChangeItem.filterName)
                            if (0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic) {
                                if (0 == a.oChangeItem.step)
                                    this._oFlightsList.Departure = this._oSortControl.sorting(a.oChangeItem.code, this._oSearchParam.is_domestic, this._oFlightsList.Departure, this._oFlightsList.Schedules.Departure),
                                        this._flightsListRender("Departure", this._oSearchParam, this._oFlightsList.Departure);
                                else if (1 == a.oChangeItem.step)
                                    if ("" != this._oSearchParam.SDATE3) {
                                        var b = this._oSortControl.sorting(a.oChangeItem.code, this._oSearchParam.is_domestic, this._oRenderList, this._oFlightsList.Schedules.Middle);
                                        this._flightsListRender("Middle", this._oSearchParam, b)
                                    } else {
                                        var b = this._oSortControl.sorting(a.oChangeItem.code, this._oSearchParam.is_domestic, this._oRenderList, this._oFlightsList.Schedules.Arrive);
                                        this._flightsListRender("Arrive", this._oSearchParam, b)
                                    }
                                else if (2 == a.oChangeItem.step) {
                                    var b = this._oSortControl.sorting(a.oChangeItem.code, this._oSearchParam.is_domestic, this._oRenderList, this._oFlightsList.Schedules.Arrive);
                                    this._flightsListRender("Arrive", this._oSearchParam, b)
                                }
                            } else
                                (1 == this._oSearchParam.is_domestic || 1 == this._oSearchParam.is_domestic) && (0 == a.oChangeItem.step ? (this._oFlightsList.DepartureList = this._oSortControl.sorting(a.oChangeItem.code, this._oSearchParam.is_domestic, this._oFlightsList.DepartureList),
                                    this._flightsListRender("Departure", this._oSearchParam, this._oFlightsList.DepartureList)) : 1 == a.oChangeItem.step && (this._oFlightsList.ArriveList = this._oSortControl.sorting(a.oChangeItem.code, this._oSearchParam.is_domestic, this._oFlightsList.ArriveList),
                                    this._flightsListRender("Arrive", this._oSearchParam, this._oFlightsList.ArriveList)));
                        else if (0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic) {
                            if ("FilterSeat" == a.oChangeItem.filterName) {
                                var c = a.oChangeItem.step;
                                a.oChangeItem.step = 0,
                                    this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, a.oChangeItem),
                                    a.oChangeItem.step = 1,
                                    this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, a.oChangeItem),
                                "" != this._oSearchParam.SDATE3 && (a.oChangeItem.step = 2,
                                    this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, a.oChangeItem)),
                                    a.oChangeItem.step = c
                            } else
                                this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, a.oChangeItem);
                            if (0 === a.oChangeItem.step)
                                this._flightsListRender("Departure", this._oSearchParam, this._oFlightsList.Departure);
                            else if (1 === a.oChangeItem.step) {
                                if ("RT" == this._oSearchParam.TRIP) {
                                    var b = this._makeRenderList("Departure", "Arrive", this._oRenderItem.sid, this._oRenderItem.type, this._oRenderItem.payment);
                                    this._flightsListRender("Arrive", this._oSearchParam, b)
                                } else if ("MD" == this._oSearchParam.TRIP)
                                    if ("" != this._oSearchParam.ECITY3) {
                                        var b = this._makeRenderList("Departure", "Middle", this._oRenderItem.sid, this._oRenderItem.type, this._oRenderItem.payment);
                                        this._flightsListRender("Middle", this._oSearchParam, b)
                                    } else {
                                        var b = this._makeRenderList("Departure", "Arrive", this._oRenderItem.sid, this._oRenderItem.type, this._oRenderItem.payment);
                                        this._flightsListRender("Arrive", this._oSearchParam, b)
                                    }
                            } else if (2 === a.oChangeItem.step) {
                                var b = this._makeRenderList("Middle", "Arrive", this._oRenderItem.sid, this._oRenderItem.type, this._oRenderItem.payment, this._oRenderItem.psid, this._oRenderItem.seat);
                                this._flightsListRender("Arrive", this._oSearchParam, b)
                            }
                        } else
                            (1 == this._oSearchParam.is_domestic || 1 == this._oSearchParam.is_domestic) && (this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, a.oChangeItem),
                                0 === a.oChangeItem.step ? this._flightsListRender("Departure", this._oSearchParam, this._oFlightsList.DepartureList) : 1 === a.oChangeItem.step && this._flightsListRender("Arrive", this._oSearchParam, this._oFlightsList.ArriveList));
                        this._setHeight()
                    }, this).bind()
                })
        },
        _makeDetailResult: function() {
            this._oDetailResult = new pc.naver.service.DetailResult
        },
        _loading: function() {
            this._elFilterArea.height(923);
            this._departureResultArea.css("display", "none"),
                this._tripDeparture.css("display", "none"),
                this._arrivalResultArea.css("display", "none"),
                this._tripDeparture.css("display", "none"),
                this._thirdResultArea.css("display", "none"),
                this._tripThird.css("display", "none"),
                this._detailArea.css("display", "none"),
                this._loadingArea.css("display", "block")
        },
        _startAnimation: function() {
            this._stopAnimation(),
                this._oMorph.pushRepeatStart(1 / 0).pushAnimate(10, [$("loading"), {
                    "@width": "0%"
                }]).pushAnimate(3e3, [jindo.$("loading"), {
                    "@width": "92.7%"
                }]).pushAnimate(500, [jindo.$("loading"), {
                    "@width": "92.7%"
                }]).pushRepeatEnd().play()
        },
        _stopAnimation: function() {
            this._oMorph.pause(),
                this._oMorph.clear()
        },
        _noResult: function(a) {
            var b = "";
            if (0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic)
                if ("noCity" == a)
                    b = "MD" == this._oSearchParam.TRIP ? ' 							<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 								<div class="sp_flight ico_no_result"></div> 								<h3 class="tit_no_result">선택하신 여정의 다구간 항공편이 없습니다.</h3> 								<p class="dsc_no_result">출발지, 도착지를 변경하여 재조회 해보세요.</p> 							</div>' : ' 							<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 								<div class="sp_flight ico_no_result"></div> 								<h3 class="tit_no_result">"' + this._oSearchParam.SCITYK + '"에서 "' + this._oSearchParam.ECITYK + '" 여정으로 운항하는 항공편이 없습니다.</h3> 								<p class="dsc_no_result">출발지, 도착지를 변경하여 재조회 해보세요.</p> 							</div>';
                else if ("noFlight" == a) {
                    var c = [this._oSearchParam.SDATE1.slice(0, -4), this._oSearchParam.SDATE1.slice(4, -2), this._oSearchParam.SDATE1.slice(-2)].join(".");
                    if ("OW" == this._oSearchParam.TRIP)
                        b = ' 							<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 								<div class="sp_flight ico_no_result"></div> 								<h3 class="tit_no_result">"' + c + '." 일정으로 예약 가능한 항공편이 없습니다.</h3> 								<p class="dsc_no_result">여행날짜를 변경하여 재조회 해보세요.</p> 							</div>';
                    else {
                        var c = [this._oSearchParam.SDATE1.slice(0, -4), this._oSearchParam.SDATE1.slice(4, -2), this._oSearchParam.SDATE1.slice(-2)].join(".")
                            , d = "" == this._oSearchParam.SDATE3 ? this._oSearchParam.SDATE2 : this._oSearchParam.SDATE3
                            , e = [d.slice(0, -4), d.slice(4, -2), d.slice(-2)].join(".");
                        b = ' 							<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 								<div class="sp_flight ico_no_result"></div> 								<h3 class="tit_no_result">"' + c + ". ~ " + e + '." 일정으로 예약 가능한 항공편이 없습니다.</h3> 								<p class="dsc_no_result">여행날짜를 변경하여 재조회 해보세요</p> 							</div>'
                    }
                } else
                    b = "networkError" == a || "invalidOut" == a ? ' 					<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 						<div class="sp_flight ico_no_result"></div> 						<h3 class="tit_no_result">일시적인 오류로 항공권 정보를<br>불러올 수 없습니다.</h3> 					</div>' : ' 					<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 						<div class="sp_flight ico_no_result"></div> 						<h3 class="tit_no_result">선택하신 조건으로 검색된 예약 가능한 항공편이 없습니다.</h3> 						<p class="dsc_no_result">최초 검색결과는 현재 예약 가능한 항공편만 보여집니다.<br>						대기예약 항공편을 조회하려면 "좌석상태" 필터조건을 변경해 주세요.</p> 					</div>';
            else if ("noFlight" == a)
                if ("OW" == this._oSearchParam.TRIP) {
                    var c = [this._oSearchParam.SDATE1.slice(0, -4), this._oSearchParam.SDATE1.slice(4, -2), this._oSearchParam.SDATE1.slice(-2)].join(".");
                    b = ' 						<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 							<div class="sp_flight ico_no_result"></div> 							<h3 class="tit_no_result">"' + c + '." 일정으로 예약 가능한 항공편이 없습니다.</h3> 							<p class="dsc_no_result">검색결과는 예약 가능한 항공편만 보여집니다.<br> 							여행날짜를 변경하여 재조회 해보세요.</p> 						</div>'
                } else {
                    var c = [this._oSearchParam.SDATE1.slice(0, -4), this._oSearchParam.SDATE1.slice(4, -2), this._oSearchParam.SDATE1.slice(-2)].join(".")
                        , e = [this._oSearchParam.SDATE2.slice(0, -4), this._oSearchParam.SDATE2.slice(4, -2), this._oSearchParam.SDATE2.slice(-2)].join(".");
                    b = ' 						<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 							<div class="sp_flight ico_no_result"></div> 							<h3 class="tit_no_result">"' + c + ". ~ " + e + '." 일정으로 예약 가능한 항공편이 없습니다.</h3> 							<p class="dsc_no_result">검색결과는 예약 가능한 항공편만 보여집니다.<br> 							여행날짜를 변경하여 재조회 해보세요.</p> 						</div>'
                }
            else
                b = "noCity" == a ? ' 					<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 						<div class="sp_flight ico_no_result"></div> 						<h3 class="tit_no_result">"' + this._oSearchParam.SCITYK + '"에서 "' + this._oSearchParam.ECITYK + '" 여정으로 운항하는 항공편이 없습니다.</h3> 						<p class="dsc_no_result">출발지, 도착지를 변경하여 재조회 해보세요.</p> 					</div>' : "networkError" == a || "invalidOut" == a ? ' 				<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 					<div class="sp_flight ico_no_result"></div> 					<h3 class="tit_no_result">일시적인 오류로 항공권 정보를<br>불러올 수 없습니다.</h3> 				</div>' : ' 				<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:711px;"> 					<div class="sp_flight ico_no_result"></div> 					<h3 class="tit_no_result">선택하신 필터조건으로 검색된 항공권이 없습니다.</h3> 					<p class="dsc_no_result">적용된 필터 조건을 확인해보세요.</p> 				</div>';
            var f = "";
            f = "MD" == this._oSearchParam.TRIP ? this._oSearchParam.SCITYK + "에서 " + this._oSearchParam.ECITY1K + " 가는 항공편을 선택하세요." : this._oSearchParam.SCITYK + "에서 " + this._oSearchParam.ECITYK + " 가는 항공편을 선택하세요.";
            var g = this._oSearchParam.SDATE1.substring(0, 4) + "." + this._oSearchParam.SDATE1.substring(4, 6) + "." + this._oSearchParam.SDATE1.substring(6, 8) + ".";
            this._departureDateTxt.html(g),
                this._departurePlanDesc.html(f),
                this._departureFilter.css("display", "none"),
                this._departureBanner.css("display", "none"),
                this._loadingArea.css("display", "none"),
                this._departureList.html(b),
                this._departureListInfo.css("display", "none"),
                "MD" == this._oSearchParam.TRIP ? (this._departureMDTitle.css("display", "block"),
                    this._departureResultMDTitle.css("display", "block"),
                    this._departureTitle.css("display", "none"),
                    this._departureResultTitle.css("display", "none")) : (this._departureMDTitle.css("display", "none"),
                    this._departureResultMDTitle.css("display", "none"),
                    this._departureTitle.css("display", "block"),
                    this._departureResultTitle.css("display", "block")),
                this._tripDeparture.css("display", "block"),
                this._setHeight()
        },
        _noFilterResult: function(a, b, c) {
            var d = "";
            "Departure" === a ? d = "628px" : "" == b.SDATE3 && "Arrive" == a || "Middle" == a ? d = "435px" : "" != b.SDATE3 && "Arrive" == a && (d = "262px");
            var e = "";
            if (1 == c)
                if (0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic)
                    if (this._config.airlineFlag)
                        if (void 0 == this._oFlightsList.FilterSpec.FilterAirV[this._config.airlineCode]) {
                            for (var f = !1, g = 0; g < this._oFlightsList.Departure.length; g++)
                                if ("HK" == this._oFlightsList.Departure[g].Seat) {
                                    f = !0;
                                    break
                                }
                            e = f ? ' 							<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:' + d + ';"> 								<div class="sp_flight ico_no_result"></div> 								<h3 class="tit_no_result">선택하신 조건으로 검색된 "' + this._config.airlineName + '" 항공권이 없습니다.</h3> 								<p class="dsc_no_result">"항공사" 필터 조건을 변경하여 다른 항공사 항공편을 확인하시거나<br> 								전체 항공편을 재조회 해보세요.</p> 							</div>' : ' 							<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:' + d + ';"> 								<div class="sp_flight ico_no_result"></div> 								<h3 class="tit_no_result">선택하신 조건으로 검색된 "' + this._config.airlineName + '" 항공권이 없습니다.</h3> 								<p class="dsc_no_result">최초 검색결과는 예약 가능한 항공편만 보여집니다.<br> 								"항공사" 및 "좌석상태" 필터 조건을 변경하여 다른 항공사 항공편을 확인하시거나<br> 								여행날짜, 좌석종류를 변경하여 재조회 해보세요.</p> 							</div>'
                        } else
                            e = ' 						<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:' + d + ';"> 							<div class="sp_flight ico_no_result"></div> 							<h3 class="tit_no_result">선택하신 조건으로 검색된 항공권이 없습니다.</h3> 							<p class="dsc_no_result">최초 검색결과는 예약 가능한 항공편만 보여집니다.<br> 							“좌석상태” 필터 조건을 변경하셔서 대기예약 항공편을 확인하시거나<br> 							여행날짜, 좌석종류를 변경하여 재조회 해보세요.</p> 						</div>';
                    else
                        e = ' 						<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:' + d + ';"> 							<div class="sp_flight ico_no_result"></div> 							<h3 class="tit_no_result">선택하신 조건으로 검색된 예약가능한 항공편이 없습니다.</h3> 							<p class="dsc_no_result">최초 검색결과는 예약 가능한 항공편만 보여집니다.<br> 							대기예약 항공편을 조회하려면 "좌석상태" 필터조건을 변경해주세요.</p> 						</div>';
                else
                    e = ' 				<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:' + d + ';"> 					<div class="sp_flight ico_no_result"></div> 					<h3 class="tit_no_result">선택하신 조건으로 검색된 "' + this._config.airlineName + '" 항공권이 없습니다.</h3> 					<p class="dsc_no_result">검색결과는 예약 가능한 항공편만 보여집니다.<br> 					"항공사" 필터 조건을 변경하여 다른 항공사 항공편을 확인하시거나<br> 					여행날짜, 좌석종류를 변경하여 재조회 해보세요.</p> 				</div>';
            else
                e = ' 				<div class="trip_result trip_result_no_result trip_result_no_result_type_1" style="height:' + d + ';"> 					<div class="sp_flight ico_no_result"></div> 					<h3 class="tit_no_result">선택하신 필터조건으로 검색된 항공권이 없습니다.</h3> 					<p class="dsc_no_result">적용된 필터 조건을 확인해보세요.</p> 				</div>';
            "Departure" === a ? (this._departureList.html(e),
                this._departureListInfo.css("display", "none")) : "" == b.SDATE3 && "Arrive" == a || "Middle" == a ? (this._arrivalList.html(e),
                this._arrivalListInfo.css("display", "none"),
                this._arrivalAnotherInfo.css("display", "none"),
                $Element(this._arrivalAnotherInfo.parent()).removeClass("trip_result_another")) : "" != b.SDATE3 && "Arrive" == a && (this._thirdList.html(e),
                this._thirdListInfo.css("display", "none"),
                this._thirdAnotherInfo.css("display", "none"),
                $Element(this._thirdAnotherInfo.parent()).removeClass("trip_result_another")),
                this._setHeight()
        },
        getFlightsList: function(a) {
            this._oSearchParam = a,
                this._loading(),
                this._startAnimation(),
            null  != this._oAjax && this._oAjax.abort(),
                this._departurePromotion.css("display", "none"),
                this._departurePartnerDesc.css("display", "none"),
                this._arrivalPartnerDesc.css("display", "none"),
                this._oAjax = new $Ajax("/Avail",{
                    method: "post",
                    onerror: $Fn(function() {
                        this._noResult(),
                            this._stopAnimation()
                    }, this).bind(),
                    onload: $Fn(function(b) {
                        if (this._stopAnimation(),
                            (0 == a.is_domestic || 0 == a.is_domestic) && 0 != b.json().retCode || (1 == a.is_domestic || 1 == a.is_domestic) && void 0 == b.json().DepartureList || (0 == a.is_domestic || 0 == a.is_domestic) && 0 == b.json().retCode && 0 == b.json().Departure.length)
                            return void this._noResult(b.json().errType);
                        if (0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic) {
                            if (this._oFilterControl.setFiltering(this._oSearchParam.is_domestic, b.json().FilterSpec.FilterFareType),
                                    this._oFlightsList = b.json(),
                                    this._oFlightsList = this._oFilterControl.defaultFiltering(this._oSearchParam.is_domestic, this._oFlightsList),
                                    this._oFlightsList.Departure = this._oSortControl.sorting("출발시각 빠른순", this._oSearchParam.is_domestic, this._oFlightsList.Departure, this._oFlightsList.Schedules.Departure),
                                    this._oFlightsList.Departure = this._oSortControl.sorting("소요시간 짧은순", this._oSearchParam.is_domestic, this._oFlightsList.Departure, this._oFlightsList.Schedules.Departure),
                                    this._oFlightsList.Departure = this._oSortControl.sorting("가격 낮은순", this._oSearchParam.is_domestic, this._oFlightsList.Departure),
                                    this._config.airlineFlag) {
                                var c = {
                                    filterName: "FilterAirV",
                                    code: this._config.airlineCode,
                                    check: !0,
                                    step: 0
                                };
                                this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, c)
                            }
                            this._flightsListRender("Departure", this._oSearchParam, this._oFlightsList.Departure, !0),
                                this._config.airlineFlag ? this._oFilter.departurefilterRender(this._oFlightsList.FilterSpec, this._oSearchParam.is_domestic, this._oSearchParam.TRIP, this._config.airlineCode) : this._oFilter.departurefilterRender(this._oFlightsList.FilterSpec, this._oSearchParam.is_domestic, this._oSearchParam.TRIP, ""),
                                setLcs("", "flights_domresult")
                        } else if (1 == this._oSearchParam.is_domestic || 1 == this._oSearchParam.is_domestic) {
                            if (this._oFilterControl.setFiltering(this._oSearchParam.is_domestic, this._oSearchParam.FareType),
                                    this._oFlightsList = b.json(),
                                    this._oFlightsList = this._oFilterControl.defaultFiltering(this._oSearchParam.is_domestic, this._oFlightsList),
                                    this._oFlightsList.DepartureList = this._oSortControl.sorting("출발시각 빠른순", this._oSearchParam.is_domestic, this._oFlightsList.DepartureList),
                                    this._oFlightsList.ArriveList = this._oSortControl.sorting("출발시각 빠른순", this._oSearchParam.is_domestic, this._oFlightsList.ArriveList),
                                    this._config.airlineFlag) {
                                var c = {
                                    filterName: "FilterAirV",
                                    code: this._config.airlineCode,
                                    check: !0,
                                    step: 0
                                };
                                this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, c),
                                    c.step = 1,
                                    this._oFlightsList = this._oFilterControl.filtering(this._oFlightsList, this._oSearchParam, c)
                            }
                            this._flightsListRender("Departure", this._oSearchParam, this._oFlightsList.DepartureList, !0);
                            var d = this._oFilterControl.makeFilterSpec(this._oSearchParam.is_domestic, this._oSearchParam.TRIP, this._oFlightsList.DepartureList, {}, this._oSearchParam.FareType);
                            this._ofilterSpec = d,
                                this._config.airlineFlag ? this._oFilter.departurefilterRender(d.oData, this._oSearchParam.is_domestic, this._oSearchParam.TRIP, this._config.airlineCode) : this._oFilter.departurefilterRender(d.oData, this._oSearchParam.is_domestic, this._oSearchParam.TRIP, ""),
                                setLcs("", "flights_intresult")
                        }
                        this._config.airlineFlag = !1,
                            this._setHeight()
                    }, this).bind(),
                    timeout: 1e3,
                    ontimeout: $Fn(function() {
                        this._noResult()
                    }, this).bind()
                }).request(a)
        },
        _setHeight: function(a) {
            var b = (this._welLeftArea.height(),
                this._welRightArea.height())
                , c = 470;
            void 0 != a && a > 3 && (c = 159 + 86 * a),
                $Element(this._welRightArea.query("div.trip_reservation_box")).css("min-height", c + "px"),
                this._welLeftArea.height(b)
        },
        _flightsListRender: function(a, b, c, d) {
            var e = b.is_domestic
                , f = this._oFlightsList.FilterSpec
                , g = 0 == e || 0 == e ? this._oFlightsList.Schedules[a] : {}
                , h = "";
            "OW" == b.TRIP ? h = "편도" : "RT" == b.TRIP ? h = "왕복" : "MD" == b.TRIP && (h = "전체");
            for (var i = [], j = [], k = 0, l = 0, m = !1, n = 0; n < c.length; n++) {
                var o = ""
                    , p = ""
                    , q = ""
                    , r = ""
                    , s = ""
                    , t = ""
                    , u = ""
                    , v = ""
                    , w = ""
                    , x = ""
                    , y = ""
                    , z = ""
                    , A = ""
                    , B = ""
                    , C = ""
                    , D = ""
                    , E = ""
                    , F = ""
                    , G = ""
                    , H = ""
                    , I = ""
                    , J = ""
                    , K = ""
                    , L = ""
                    , M = ""
                    , N = ""
                    , O = ""
                    , P = !1;
                if (I = b.SDATE1.substring(0, 4) + "." + b.SDATE1.substring(4, 6) + "." + b.SDATE1.substring(6, 8) + ".",
                        J = b.SDATE2.substring(0, 4) + "." + b.SDATE2.substring(4, 6) + "." + b.SDATE2.substring(6, 8) + ".",
                        K = b.SDATE3.substring(0, 4) + "." + b.SDATE3.substring(4, 6) + "." + b.SDATE3.substring(6, 8) + ".",
                    "" !== b.SDATE3 && (K = b.SDATE3.substring(0, 4) + "." + b.SDATE3.substring(4, 6) + "." + b.SDATE3.substring(6, 8) + "."),
                        "Departure" === a ? (H = I,
                            "MD" == b.TRIP ? (L = b.SCITYK + "에서 " + b.ECITY1K + " 가는 항공편을 선택하세요.",
                                M = b.SCITYK + "에서 " + b.ECITY1K + " 가는 항공편") : (L = b.SCITYK + "에서 " + b.ECITYK + " 가는 항공편을 선택하세요.",
                                M = b.SCITYK + "에서 " + b.ECITYK + " 가는 항공편")) : "" == b.SDATE3 && "Arrive" == a || "Middle" == a ? (H = J,
                            "MD" == b.TRIP ? (L = b.SCITY2K + "에서 " + b.ECITY2K + " 가는 항공편을 선택하세요.",
                                M = b.SCITY2K + "에서 " + b.ECITY2K + " 가는 항공편") : (L = b.ECITYK + "에서 " + b.SCITYK + " 가는 항공편을 선택하세요.",
                                M = b.ECITYK + "에서 " + b.SCITYK + " 가는 항공편")) : "" != b.SDATE3 && "Arrive" == a && (H = K,
                            L = b.SCITY3K + "에서 " + b.ECITYK + " 가는 항공편을 선택하세요.",
                            M = b.SCITY3K + "에서 " + b.ECITYK + " 가는 항공편"),
                    c[n].visible && c[n].FareVisible.length > 0 && (void 0 == g[c[n].SID].visible || g[c[n].SID].visible) && (0 == e || 0 == e) || (1 == e || 1 == e) && c[n].visible) {
                    if (0 == e || 0 == e) {
                        var Q = g[c[n].SID];
                        if (void 0 != Q) {
                            o = c[n].SID,
                                p = void 0 != c[n].PSID ? c[n].PSID : "",
                                F = c[n].Seat,
                                q = Q.MainAirV,
                                r = Q.MainAirVKR,
                                s = "ICN, GMP" == Q.StartAirp ? "SEL" : Q.StartAirp,
                                t = Q.EndAirp,
                                u = Q.StartTm,
                                v = Q.EndTm,
                                x = "~";
                            var R = Q.JrnyTm.split("시간");
                            w = "00" == R[0] ? R[1] : Q.JrnyTm,
                                O = Q.ElapsedDay > 0 ? "+" + Q.ElapsedDay + "일" : "",
                                c[n].FareVisible.length > 1 ? N = '<a href="javascript:;" class="btn_pay_terms btn_pay_select btn_pay_terms_parentover" data-len="' + c[n].FareVisible.length + '">요금조건<strong>' + c[n].FareVisible.length + '<span class="sp_flight ico_terms"></span></strong></a>' : 1 == c[n].FareVisible.length && "Departure" === a && (N = '<a href="javascript:;" class="btn_pay_terms btn_pay_select btn_pay_terms_parentover" data-len="' + c[n].FareVisible.length + '">요금조건<strong>1<span class="sp_flight ico_terms"></span></strong></a>'),
                                N += '<div class="ly_payment" style="display:none;"> 									<strong class="ly_tit_payemnt">요금조건</strong> 									<ul class="ly_payment_list">';
                            for (var S = 0; S < c[n].FareVisible.length; S++)
                                for (var T in c[n].FareVisible[S]) {
                                    var U = c[n].FareVisible[S][T];
                                    if ("0" == U[1])
                                        U = U[0];
                                    else {
                                        for (var V = U[0].split(","), W = U[1].split(","), X = "", Y = "", Z = 0; Z < V.length; Z++)
                                            X += V[Z];
                                        for (var Z = 0; Z < W.length; Z++)
                                            Y += W[Z];
                                        X - Y > l && (0 != l && (m = !0),
                                            l = X - Y),
                                            U = U[1]
                                    }
                                    0 == S ? ("0" == c[n].FareVisible[S][T][1] ? P = !1 : (P = !0,
                                        C = c[n].FareVisible[S][T][0]),
                                        D = '<span class="sp_flight txt_terms">' + f.FilterFareType[T] + "</span>",
                                        B = U,
                                        G = T,
                                        N += '<li class="ly_payment_item ly_payment_item_on" data-fare="' + T + '"><span class="sp_flight ico_input"></span><p class="dsc_payment">									<span class="txt_payment">' + f.FilterFareType[T] + '</span><span class="txt_price">' + U + "~</span></p></li>") : N += '<li class="ly_payment_item" data-fare="' + T + '"><span class="sp_flight ico_input"></span><p class="dsc_payment">									<span class="txt_payment">' + f.FilterFareType[T] + '</span><span class="txt_price">' + U + "~</span></p></li>"
                                }
                            if (N += '</ul><a href="javascript:;" class="sp_flight btn_check" role="button">요금선택</a><a href="javascript:;" class="sp_flight btn_close" role="button">레이어 닫기</a></div>',
                                0 == Q.ViaNo)
                                y = "직항",
                                    A = '<div class="txt_way"><span class="sp_flight ico_way ' + z + '"></span>' + y + "</div>";
                            else {
                                z = 1 == Q.ViaNo ? "ico_way_via" : 2 == Q.ViaNo ? "ico_way_via_2" : "ico_way_via_3",
                                    y = "경유 " + Q.ViaNo + "회",
                                    A = '<div class="txt_way"><span class="sp_flight ico_way ' + z + '"></span><a href="javascript:;" class="btn_pay_terms btn_pay_terms_v2">' + y + '<span class="sp_flight ico_terms"></span></a><div class="ly_tooltip" style="display:none"><ul>';
                                for (var Z = 0; Z < Q.DetailSchedule.length; Z++)
                                    if (Z != Q.DetailSchedule.length - 1 && (EndAirpKR = Q.DetailSchedule[Z].EndAirpKR,
                                            EndCityKR = "",
                                        -1 != EndAirpKR.indexOf("(") && (arr = EndAirpKR.split("("),
                                            EndAirpKR = arr[0],
                                            EndCityKR = "(" + arr[1]),
                                            A += '<li><span class="ellipsis"><strong>' + EndAirpKR + "</strong>" + EndCityKR + "</span>&nbsp;경유</li>"),
                                        Q.DetailSchedule[Z].StopCity.length > 0)
                                        for (var $ = 0; $ < Q.DetailSchedule[Z].StopCity.length; $++)
                                            EndAirpKR = Q.DetailSchedule[Z].StopCity[$].cityKR,
                                                EndCityKR = "",
                                            -1 != EndAirpKR.indexOf("(") && (arr = EndAirpKR.split("("),
                                                EndAirpKR = arr[0],
                                                EndCityKR = "(" + arr[1]),
                                                A += '<li><span class="ellipsis"><strong>' + EndAirpKR + "</strong>" + EndCityKR + "</span>&nbsp;체류</li>";
                                A += '</ul><a href="javascript:;" class="sp_flight btn_close" role="button">레이어 닫기</a></div></div>'
                            }
                            E = "HK" == c[n].Seat ? "가능" : "대기"
                        }
                        this._tripDeparture.hasClass("domestic_flight_area") && this._tripDeparture.removeClass("domestic_flight_area"),
                        this._tripArrival.hasClass("domestic_flight_area") && this._tripArrival.removeClass("domestic_flight_area")
                    } else {
                        o = n,
                            q = c[n].JCarCode,
                            r = this._oAirline[c[n].JCarCode],
                            "Departure" === a ? (s = "ICN, GMP" == b.SCITY1 ? this._oFlightsList.SearchParam.SCITY1 : b.SCITY1,
                                t = b.ECITY1) : (s = b.ECITY1,
                                t = "ICN, GMP" == b.SCITY1 ? this._oFlightsList.SearchParam.SCITY1 : b.SCITY1),
                            u = c[n].StartTM,
                            v = c[n].EndTM,
                            h = "편도",
                            E = "가능";
                        var R = c[n].JrnyTM.split("시간");
                        w = "00" == R[0] ? R[1] : c[n].JrnyTM,
                            "Y" == c[n].Seat ? y = "일반석" : "D" == c[n].Seat ? y = "할인석" : "C" == c[n].Seat && (y = "비즈니스석"),
                            A = '<div class="txt_seat"><span class="sp_flight ico_seat"></span>' + y + "</div>",
                        "OZ" == c[n].JCarCode && (c[n].bParam.indexOf("Etc0=BX") >= 0 || c[n].bParam.indexOf("Etc1=BX") >= 0) && (N = '<div class="box_flightinfo"><span class="sp_flight ico_question"></span>에어부산<br>공동운항<div class="ly_flightinfo"><span class="sp_flight etc"></span>실제 에어부산을 탑승하는 항공편입니다.</div></div>');
                        for (var _ = String(c[n].JAdultFare).split("").join(",").split(""), Z = _.length - 1, S = 1; Z >= 0; Z--,
                            S++)
                            S % 6 != 0 && S % 2 == 0 && (_[Z] = ""),
                                B = _.join("");
                        this._tripDeparture.addClass("domestic_flight_area"),
                            this._tripArrival.addClass("domestic_flight_area"),
                            this._departurePartnerDesc.css("display", "block"),
                            this._arrivalPartnerDesc.css("display", "block")
                    }
                    var ab = '<li class="trip_result_item" data-step="' + a + '" data-sid="' + o + '" data-psid="' + p + '" data-seat="' + F + '" data-air="' + q + '"> 					<div class="trip_result_cell">                     	<div class="h_result" title="' + r + '"><span class="ico_airline" style="background-image:url(./img/pc_logo/' + q + '.png)"></span><span class="h_tit_result">' + r + '</span></div>                     </div>                     <div class="trip_result_cell"> 	                    <div class="box_route"> 	                        <div class="route_info_box"> 	                            <dl class="route_info"> 	                                <dt class="blind">출발지</dt> 	                                <dd class="txt_code">' + s + '</dd> 	                                <dd class="txt_time">' + u + '</dd> 	                            </dl> 	                            <dl class="route_info"> 	                                <dt class="blind">도착지</dt> 	                                <dd class="txt_code">' + t + '</dd> 	                                <dd class="txt_time">' + v + '<span class="txt_more_info">' + O + '</span></dd> 	                            </dl> 	                            <dl class="route_info route_info_time"> 	                                <dt class="sp_flight ico_time">총 소요시간</dt> 	                                <dd class="txt_time">' + w + '</dd> 	                            </dl> 	                        </div> 	                    </div> 	                </div> 	                <div class="trip_result_cell">                         <div class="box_info">                         	' + A + "                        </div>                     </div>";
                    ab += P ? '<div class="trip_result_cell"> 		                        <div class="box_info"> 		                            <div class="txt_bill txt_bill_promotion"> 		                                <div class="txt_cost"> 		                                    ' + h + ' <del><span class="txt_pay" data-fare="' + G + '">' + C + '</span><span class="txt_won">원</span></del> 		                                </div> 		                                <div class="txt_total"> 		                                    <span class="sp_flight ico_naver">네이버 추가할인</span> 		                                    <span class="txt_pay" data-fare="' + G + '">' + B + '</span><span class="txt_won">원</span> 		                                </div> 		                                <div class="txt_info"> 		                                    <span class="txt_state">' + E + "</span> 		                                    " + D + " 		                                </div> 		                            </div> 		                        </div> 		                    </div>" : '<div class="trip_result_cell">                         <div class="box_info">                             <div class="txt_bill">                                 <div class="txt_total">' + h + '                                 	<span class="txt_pay" data-fare="' + G + '">' + B + '</span><span class="txt_won">원</span><span class="txt_more">' + x + '</span>                                 </div>                                 <div class="txt_info">                                     <span class="txt_state">' + E + "</span>                                     " + D + "                                 </div>                             </div>                         </div>                     </div>",
                        ab += '<div class="trip_result_cell">                     ' + N + "                     </div> 		        </li>",
                        c[n].Top ? j.push(ab) : i.push(ab)
                } else
                    k++
            }
            var bb = "";
            if (l > 0) {
                bb = m ? '<span class="sp_flight txt_promotion_copy1_v2">네이버 항공권 최대</span>' : '<span class="sp_flight txt_promotion_copy1">네이버 항공권</span>';
                for (var cb = new String(l), db = /(-?[0-9]+)([0-9]{3})/; db.test(cb); )
                    cb = cb.replace(db, "$1,$2");
                for (var n = 0; n < cb.length; n++)
                    bb += "," == cb[n] ? '<span class="sp_flight txt_promotion_comma">,</span>' : '<span class="sp_flight txt_promotion_num' + cb[n] + '">' + cb[n] + "</span>";
                bb += '<span class="sp_flight txt_promotion_won">원</span><span class="sp_flight txt_promotion_copy2">추가할인이 적용된 항공편입니다. (성인, 소아 기준)</span>'
            }
            this._loadingArea.css("display", "none"),
                this._departurePlanDesc.css("display", "block"),
                this._departureFilter.css("display", "block"),
                this._departureBanner.css("display", "block");
            var eb = "Departure" === a ? this._departureListInfo : this._arrivalListInfo;
            0 != e && 0 != e || "OW" == b.TRIP ? this._departureListInfo.css("display", "none") : (eb.css("display", "block"),
                "RT" == b.TRIP ? ($Element(eb.query("ul._rt_info")).css("display", "block"),
                    $Element(eb.query("ul._md_info")).css("display", "none")) : "MD" == b.TRIP && ($Element(eb.query("ul._rt_info")).css("display", "none"),
                    $Element(eb.query("ul._md_info")).css("display", "block"))),
                "Departure" === a ? (null  != this._selectContinent && this._tripDepartureTitle.removeClass(this._continent[this._selectContinent]),
                    this._tripDepartureTitle.addClass(this._continent[this._oSearchParam.Continent]),
                    this._selectContinent = this._oSearchParam.Continent,
                    this._departureDateTxt.html(H),
                    this._departureResultDateTxt.html(H),
                    this._departurePlanDesc.html(L),
                    this._departureResultPlanDesc.html(M),
                    this._departureList.html(i.join("")),
                    this._tripDeparture.css("display", "block"),
                    "MD" == b.TRIP ? (this._departureMDTitle.css("display", "block"),
                        this._departureResultMDTitle.css("display", "block"),
                        this._departureTitle.css("display", "none"),
                        this._departureResultTitle.css("display", "none")) : (this._departureMDTitle.css("display", "none"),
                        this._departureResultMDTitle.css("display", "none"),
                        this._departureTitle.css("display", "block"),
                        this._departureResultTitle.css("display", "block")),
                    l > 0 ? (this._departurePromotion.html(bb),
                        this._departurePromotion.css("display", "block")) : this._departurePromotion.css("display", "none")) : "" == b.SDATE3 && "Arrive" == a || "Middle" == a ? ("" != this._continent[this._oSearchParam.Continent] && (null  != this._selectContinent && this._tripArrivalTitle.removeClass(this._continent[this._selectContinent]),
                    this._tripArrivalTitle.addClass(this._continent[this._oSearchParam.Continent]),
                    this._selectContinent = this._oSearchParam.Continent),
                    i.length > 0 && (0 == e || 0 == e) ? (this._arrivalAnotherInfo.css("display", "block"),
                        $Element(this._arrivalAnotherInfo.parent()).addClass("trip_result_another")) : (this._arrivalAnotherInfo.css("display", "none"),
                        $Element(this._arrivalAnotherInfo.parent()).removeClass("trip_result_another")),
                    this._arrivalDateTxt.html(H),
                    this._arrivalResultDateTxt.html(H),
                    this._arrivalPlanDesc.html(L),
                    this._arrivalResultPlanDesc.html(M),
                    this._arrivalList.html(i.join("")),
                    this._arrivalTopList.html(j.join("")),
                    this._tripArrival.css("display", "block"),
                    "MD" == b.TRIP ? (this._arrivalMDTitle.css("display", "block"),
                        this._arrivalResultMDTitle.css("display", "block"),
                        this._arrivalTitle.css("display", "none"),
                        this._arrivalResultTitle.css("display", "none")) : (this._arrivalMDTitle.css("display", "none"),
                        this._arrivalResultMDTitle.css("display", "none"),
                        this._arrivalTitle.css("display", "block"),
                        this._arrivalResultTitle.css("display", "block")),
                    l > 0 ? (this._arrivalPromotion.html(bb),
                        this._arrivalPromotion.css("display", "block")) : this._arrivalPromotion.css("display", "none")) : "" != b.SDATE3 && "Arrive" == a && (this._thirdListInfo.css("display", "block"),
                    i.length > 0 && (0 == e || 0 == e) ? (this._thirdAnotherInfo.css("display", "block"),
                        $Element(this._thirdAnotherInfo.parent()).addClass("trip_result_another")) : (this._thirdAnotherInfo.css("display", "none"),
                        $Element(this._thirdAnotherInfo.parent()).removeClass("trip_result_another")),
                null  != this._selectContinent && this._tripThirdTitle.removeClass(this._continent[this._selectContinent]),
                    l > 0 ? (this._thirdPromotion.html(bb),
                        this._thirdPromotion.css("display", "block")) : this._thirdPromotion.css("display", "none"),
                    this._tripThirdTitle.addClass(this._continent[this._oSearchParam.Continent]),
                    this._selectContinent = this._oSearchParam.Continent,
                    this._thirdDateTxt.html(H),
                    this._thirdResultDateTxt.html(H),
                    this._thirdPlanDesc.html(L),
                    this._thirdResultPlanDesc.html(M),
                    this._thirdList.html(i.join("")),
                    this._thirdTopList.html(j.join("")),
                    this._tripThird.css("display", "block")),
            k == c.length && this._noFilterResult(a, b, d)
        },
        _resultRender: function(a, b) {
            var c = this._oSearchParam.is_domestic
                , d = 0 == c || 0 == c ? this._oFlightsList.Schedules[a][b] : {}
                , e = 0 == c || 0 == c ? d.DetailSchedule : []
                , f = "직항"
                , g = "txt_trip_direct"
                , h = 0
                , i = ""
                , j = ""
                , k = "";
            if (0 == c || 0 == c)
                h = d.ViaNo,
                    j = d.ElapsedDay > 0 ? "+" + d.ElapsedDay + "일" : "",
                0 != d.ViaNo && (f = "경유 " + d.ViaNo + "회",
                    g = "txt_trip_via"),
                    "Y" == this._oSearchParam.FareType ? i = "일반석" : "C" == this._oSearchParam.FareType ? i = "비즈니스석" : "F" == this._oSearchParam.FareType && (i = "일등석");
            else {
                var l = this._oFlightsList[a + "List"][b]
                    , m = {};
                h = 0,
                    "Y" == l.Seat ? i = "일반석" : "D" == l.Seat ? i = "할인석" : "C" == l.Seat && (i = "비즈니스석"),
                    d.MainAirV = l.JCarCode,
                    d.MainAirVKR = this._oAirline[l.JCarCode],
                    d.JrnyTm = l.JrnyTM,
                    m.StartAirpKR = "Departure" == a ? this._oSearchParam.SCITYK : this._oSearchParam.ECITYK,
                    m.StartAirp = "Departure" == a ? this._oSearchParam.SCITY1 : this._oSearchParam.ECITY1,
                    m.StartDt = "",
                    m.StartTm = l.StartTM,
                    m.AirV = "",
                    m.FltNum = "",
                    m.FltTm = "",
                    m.EndAirpKR = "Departure" == a ? this._oSearchParam.ECITYK : this._oSearchParam.SCITYK,
                    m.EndAirp = "Departure" == a ? this._oSearchParam.ECITY1 : this._oSearchParam.SCITY1,
                    m.EndDt = "",
                    m.EndTm = l.EndTM,
                    m.ConTm = "",
                    e.push(m),
                "OZ" == l.JCarCode && (l.bParam.indexOf("Etc0=BX") >= 0 || l.bParam.indexOf("Etc1=BX") >= 0) && (k = '<div class="box_flightinfo"><span class="sp_flight ico_question"></span>에어부산<br>공동운항<div class="ly_flightinfo"><span class="sp_flight etc"></span>실제 에어부산을 탑승하는 항공편입니다.</div></div>')
            }
            var n = d.JrnyTm
                , o = d.JrnyTm.split("시간");
            "00" == o[0] && (n = o[1]);
            for (var p = '<div class="trip_route"> 						<h4 class="h_result"><span class="ico_airline" style="background-image:url(./img/pc_logo/' + d.MainAirV + '.png)"></span><span class="h_tit_result">' + d.MainAirVKR + '</span></h4> 						<div class="route_info route_info_' + h + '"> 							<span class="bg_route_line"></span>', q = [], r = 1, s = 0; s < e.length; s++) {
                var t = 0 === s ? "rute_departure" : ""
                    , u = e[s].StartAirpKR + " 출발"
                    , v = e[s].StartAirp
                    , w = e[s].StartDt.split(" ")
                    , x = w[0]
                    , y = e[s].StartTm
                    , z = e[s].AirV + e[s].FltNum
                    , A = e[s].FltTm + " 비행"
                    , B = '	<li class="rute_item ' + t + '"> 									<dl class="ly_info_area"> 									<dt class="tit_info">' + u + '</dt> 									<dd class="dsc_flight"><span class="blind">운항정보</span><span class="txt_date">' + x + '.</span><span class="sp_flight txt_time">' + y + '</span></dd> 									<dd class="dsc_aviation"><span class="blind">항공정보</span><span class="txt_airport_code">' + v + '</span><span class="txt_aircraft_number">' + z + '</span></dd> 									<dd class="txt_lead_time"><span class="blind">소요시간</span>' + A + '</dd> 									</dl> 									<span class="sp_flight airline_info"></span> 								</li>';
                if ((0 == c || 0 == c) && e[s].StopCity.length > 0)
                    for (var C = 0; C < e[s].StopCity.length; C++) {
                        var D = e[s].StopCity[C];
                        B += '	<li class="rute_item"> 											<dl class="ly_info_area"> 											<dt class="tit_info">' + D.cityKR + ' 체류</dt> 											<dd class="dsc_flight"><span class="blind">운항정보</span><span class="txt_date">' + x + '.</span><span class="sp_flight txt_time">&nbsp;&nbsp;</span></dd> 											<dd class="dsc_aviation"><span class="blind">항공정보</span><span class="txt_airport_code" style="margin-top:7px">' + D.city + '</span></dd> 											<dd class="txt_lead_time"><span class="blind">소요시간</span>' + D.stopTm + ' 대기</dd> 											</dl> 											<span class="sp_flight airline_info"></span> 										</li>'
                    }
                t = s === e.length - 1 ? "rute_arrival" : "",
                    u = s === e.length - 1 ? e[s].EndAirpKR + " 도착" : e[s].EndAirpKR + " 경유",
                    v = e[s].EndAirp,
                    w = e[s].EndDt.split(" "),
                    x = w[0],
                    y = e[s].EndTm,
                    A = s === e.length - 1 ? "" : e[s].ConTm + " 대기",
                    B += '	<li class="rute_item ' + t + '"> 									<dl class="ly_info_area"> 									<dt class="tit_info">' + u + '</dt> 									<dd class="dsc_flight"><span class="blind">운항정보</span><span class="txt_date">' + x + '.</span><span class="sp_flight txt_time">' + y + '</span></dd> 									<dd class="dsc_aviation"><span class="blind">항공정보</span><span class="txt_airport_code" style="margin-top:7px">' + v + '</span></dd> 									<dd class="txt_lead_time"><span class="blind">소요시간</span>' + A + '</dd> 									</dl> 									<span class="sp_flight airline_info"></span> 								</li>',
                    q.push(B);
                var E = '<dl class="route_info_box route_info_box_' + r + '"> 								<dt class="blind"></dt> 								<dd class="airline_info"> 									<strong class="txt_title">' + e[s].StartAirpKR + '</strong> 									<span class="txt_code">' + e[s].StartAirp + '</span> 									<span class="txt_number">' + e[s].AirV + e[s].FltNum + '</span> 									<span class="sp_flight ico_spot"></span> 									<span class="sp_flight route_line_via"></span> 								</dd>';
                if (r++,
                        E += 0 == s ? '<dd class="sp_flight txt_time">' + e[s].StartTm + "</dd></dl>" : "</dl>",
                    (0 == c || 0 == c) && e[s].StopCity.length > 0)
                    for (var C = 0; C < e[s].StopCity.length; C++) {
                        var D = e[s].StopCity[C];
                        E += '<dl class="route_info_box route_info_box_' + r + '"> 									<dt class="blind"></dt> 									<dd class="airline_info"> 										<strong class="txt_title">' + D.cityKR + '</strong> 										<span class="txt_code">' + D.city + '</span> 										<span class="txt_number"></span> 										<span class="sp_flight ico_spot"></span> 										<span class="sp_flight route_line_via"></span> 									</dd></dl>',
                            r++
                    }
                if (s === e.length - 1) {
                    var F = 4;
                    3 == h && (F = 5),
                        E += '<dl class="route_info_box route_info_box_' + F + '"> 							<dt class="blind">도착지</dt> 							<dd class="airline_info"> 								<strong class="txt_title">' + e[s].EndAirpKR + '</strong> 								<span class="txt_code">' + e[s].EndAirp + '</span> 								<span class="txt_number"></span> 								<span class="sp_flight ico_spot"></span> 							</dd> 							<dd class="sp_flight txt_time">' + e[s].EndTm + '<span class="txt_more_info">' + j + "</span></dd> 							</dl>"
                }
                p += E
            }
            p += '	<p class="txt_airport_info"><span class="sp_flight txt_trip ' + g + '">' + f + '</span><span class="sp_flight txt_time">' + n + '</span>,<span class="txt_seat">' + i + "</span></p> 					</div>",
                "" != k ? p += k : (p += '<a href="javascript:;"" class="btn_trip_schedule">상세일정</a> 								<div class="ly_schedule" style="z-index:100;"> 									<div class="ly_schedule_area"> 										<ol class="route_list">',
                    p += q.join(""),
                    p += '<span class="sp_flight etc"></span></ol></div></div>'),
                p += "</div>",
                "Departure" == a ? (this._departureResultList.html(p),
                    this._tripDeparture.css("display", "none"),
                    this._departureResultArea.css("display", "block")) : "" == this._oSearchParam.SDATE3 && "Arrive" == a || "Middle" == a ? (this._arrivalResultList.html(p),
                    this._tripArrival.css("display", "none"),
                    this._arrivalResultArea.css("display", "block")) : "" != this._oSearchParam.SDATE3 && "Arrive" == a && (this._thirdResultList.html(p),
                    this._tripThird.css("display", "none"),
                    this._thirdResultArea.css("display", "block"))
        },
        _selectDeparture: function(a, b, c, d, e, f) {
            this._resultRender("Departure", a),
                window.scrollTo(0, 0);
            var g = "OW" == this._oSearchParam.TRIP || "" != this._oSearchParam.StayLength ? "Departure" : "Arrive"
                , h = this._oSearchParam.is_domestic
                , i = ""
                , j = "";
            if (0 == h || 0 == h) {
                if ("OW" == this._oSearchParam.TRIP || "" != this._oSearchParam.StayLength) {
                    for (var k = 0; k < this._oFlightsList[g].length; k++)
                        this._oFlightsList[g][k].SID === a && (i = this._oFlightsList[g][k].TravelAgency,
                            j = this._oFlightsList[g][k].Seat);
                    this._oDetailLength = this._oDetailResult.getDetailList(i, j, b, f, $Fn(function(a) {
                        this._setHeight(a)
                    }, this).bind())
                } else if ("RT" == this._oSearchParam.TRIP || "MD" == this._oSearchParam.TRIP) {
                    var l = "RT" == this._oSearchParam.TRIP ? "Arrive" : "" == this._oSearchParam.SDATE3 ? "Arrive" : "Middle"
                        , m = this._makeRenderList("Departure", l, a, b, c);
                    this._flightsListRender(l, this._oSearchParam, m);
                    var n = this._oFilterControl.makeFilterSpec(this._oSearchParam.is_domestic, this._oSearchParam.TRIP, m, this._oFlightsList.Schedules[l], this._oFlightsList.FilterSpec.FilterFareType);
                    this._oFilter.setTwoStatus(n)
                }
            } else if ("OW" == this._oSearchParam.TRIP)
                this._oDetailResult.getDAgencyList(this._oFlightsList.DepartureList[a], this._oSearchParam.TRIP, $Fn(function(a) {
                    this._setHeight(a)
                }, this).bind());
            else if ("RT" == this._oSearchParam.TRIP) {
                this._oDomesticDeparture = this._oFlightsList.DepartureList[a],
                    "" == this._config.airlineName ? this._flightsListRender("Arrive", this._oSearchParam, this._oFlightsList.ArriveList) : this._flightsListRender("Arrive", this._oSearchParam, this._oFlightsList.ArriveList, !0);
                var n = this._oFilterControl.makeFilterSpec(this._oSearchParam.is_domestic, this._oSearchParam.TRIP, this._oFlightsList.ArriveList);
                this._oFilter.setTwoStatus(n)
            }
        },
        _makeRenderList: function(a, b, c, d, e, f, g) {
            var h = [];
            if (e = e.slice(0, e.length - 1),
                "Departure" == a) {
                for (var i = 0; i < this._oFlightsList.Departure.length; i++)
                    if (this._oFlightsList.Departure[i].SID == c)
                        for (var j = 0; j < this._oFlightsList.Departure[i].CSID.length; j++) {
                            var k = c + "_" + this._oFlightsList.Departure[i].CSID[j] + "_" + this._oFlightsList.Departure[i].Seat;
                            void 0 != this._oFlightsList[b][k] && h.push(this._oFlightsList[b][k])
                        }
            } else if ("Middle" == a) {
                var l = f + "_" + c + "_" + g;
                if (void 0 == this._oFlightsList.Middle[l].CSID || this._oFlightsList.Middle[l].CSID[0] == c)
                    void 0 != this._oFlightsList.Arrive[l] && h.push(this._oFlightsList.Arrive[l]);
                else
                    for (var i = 0; i < this._oFlightsList.Middle[l].CSID.length; i++) {
                        var k = this._oFlightsList.Middle[l].SID + "_" + this._oFlightsList.Middle[l].CSID[i] + "_" + this._oFlightsList.Middle[l].Seat;
                        void 0 != this._oFlightsList.Arrive[k] && h.push(this._oFlightsList.Arrive[k])
                    }
            }
            h = this._oSortControl.sorting("출발시각 빠른순", this._oSearchParam.is_domestic, h, this._oFlightsList.Schedules[b]),
                h = this._oSortControl.sorting("소요시간 짧은순", this._oSearchParam.is_domestic, h, this._oFlightsList.Schedules[b]),
                h = this._oSortControl.sorting("가격 낮은순", this._oSearchParam.is_domestic, h);
            for (var m = [], n = [], o = 0; o < h.length; o++) {
                for (var p = JSON.parse(JSON.stringify(h[o])), q = !1, r = 0; r < p.FareList.length; r++) {
                    var s = p.FareList[r][d];
                    void 0 != s && (s = "0" == s[1] ? s[0] : s[1]),
                    s === e && (p.FareVisible = [p.FareList[r]],
                        p.Top = !0,
                        m.push(p),
                        q = !0)
                }
                q || n.push(p)
            }
            h = n;
            for (var i = m.length - 1; i > -1; i--)
                h.unshift(m[i]);
            return this._oRenderList = h,
                this._oRenderItem.sid = c,
                this._oRenderItem.type = d,
                this._oRenderItem.payment = e + "~",
                this._oRenderItem.psid = f,
                this._oRenderItem.seat = g,
                h
        },
        _onClickList: function(a) {
            var b = a.element
                , c = $Element(b);
            if (c.parent().parent().query("div.tooltip_on") && ($Element(c.parent().parent().query("div.tooltip_on")).css("display", "none"),
                    $Element(c.parent().parent().query("div.tooltip_on")).removeClass("tooltip_on"),
                    $Element(c.parent().parent().query("a.btn_pay_terms_v2_on")).removeClass("btn_pay_terms_v2_on")),
                    0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic ? clickcr(a.element, "isr.schedule", "", "", a._event) : clickcr(a.element, "dsr.schedule", "", "", a._event),
                !c.hasClass("recommendation_navigation_item") && !c.hasClass("recommendation_item")) {
                var d = c.attr("data-sid")
                    , e = c.attr("data-psid")
                    , f = c.attr("data-seat")
                    , g = c.attr("data-step")
                    , h = c.attr("data-air")
                    , i = this._oSearchParam.is_domestic;
                if (null  != d) {
                    var j = 0;
                    if (null  != c.query("a.btn_pay_select")) {
                        var j = parseInt($Element(c.query("a.btn_pay_select")).attr("data-len"));
                        j > 1 && (null  == c.query("a.btn_pay_terms_on") ? (null  != c.parent().query("div.ly_payment_on") && $Element(c.parent().query("div.ly_payment_on")).removeClass("ly_payment_on").css("display", "none"),
                        null  != c.parent().query("a.btn_pay_terms_on") && $Element(c.parent().query("a.btn_pay_terms_on")).removeClass("btn_pay_terms_on"),
                            $Element(c.query("div.ly_payment")).addClass("ly_payment_on").css("display", "block"),
                            $Element(c.query("a.btn_pay_select")).addClass("btn_pay_terms_on")) : (null  != c.parent().query("div.ly_payment_on") && $Element(c.parent().query("div.ly_payment_on")).removeClass("ly_payment_on").css("display", "none"),
                        null  != c.parent().query("a.btn_pay_terms_on") && $Element(c.parent().query("a.btn_pay_terms_on")).removeClass("btn_pay_terms_on")))
                    }
                    if (2 > j) {
                        var k = $Element(c.query("span.txt_pay")).attr("data-fare")
                            , l = $Element(c.query("span.txt_pay")).text() + "~";
                        if ("Departure" == g)
                            this._selectDeparture(d, k, l, e, f, h);
                        else if ("Arrive" == g)
                            if (this._resultRender("Arrive", d),
                                0 == i || 0 == i) {
                                var m = ""
                                    , n = ""
                                    , o = e + "_" + d + "_" + f;
                                m = this._oFlightsList.Arrive[o].TravelAgency,
                                    n = this._oFlightsList.Arrive[o].Seat,
                                    this._oDetailLength = this._oDetailResult.getDetailList(m, n, k, h, $Fn(function(a) {
                                        this._setHeight(a)
                                    }, this).bind()),
                                    setLcs("", "flights_intbook")
                            } else {
                                var p = {};
                                for (var q in this._oDomesticDeparture)
                                    for (var r in this._oFlightsList.ArriveList[d])
                                        q == r && "number" == typeof this._oDomesticDeparture[q] && (p[q] = this._oDomesticDeparture[q] + this._oFlightsList.ArriveList[d][r]),
                                        "bParam" == q && "bParam" == r && (p.bParam = this._oDomesticDeparture[q] + "&" + this._oFlightsList.ArriveList[d][r]);
                                this._oDetailResult.getDAgencyList(p, this._oSearchParam.TRIP, $Fn(function(a) {
                                    this._setHeight(a)
                                }, this).bind()),
                                    setLcs("", "flights_dombook")
                            }
                        else if ("Middle" == g) {
                            var s = $Element(c.query("span.txt_pay")).attr("data-fare")
                                , t = $Element(c.query("span.txt_pay")).text() + "~"
                                , u = this._makeRenderList("Middle", "Arrive", d, s, t, e, f);
                            this._resultRender("Middle", d),
                                this._flightsListRender("Arrive", this._oSearchParam, u);
                            var v = this._oFilterControl.makeFilterSpec(this._oSearchParam.is_domestic, this._oSearchParam.TRIP, u, this._oFlightsList.Schedules.Arrive, this._oFlightsList.FilterSpec.FilterFareType);
                            this._oFilter.setThreeStatus(v)
                        }
                    }
                    this._setHeight()
                }
            }
        },
        _onClickRoute: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = $Element(c.parent().query("div.ly_tooltip"))
                , e = $Element(c.parent().query("a.btn_pay_terms_v2"));
            null  != e && (c.parent().parent().parent().parent().query("div.ly_payment_on") && ($Element(c.parent().parent().parent().parent().query("div.ly_payment_on")).css("display", "none"),
                $Element(c.parent().parent().parent().parent().query("div.ly_payment_on")).removeClass("ly_payment_on"),
                $Element(c.parent().parent().parent().parent().query("a.btn_pay_terms_on")).removeClass("btn_pay_terms_on")),
                d.hasClass("tooltip_on") ? (d.css("display", "none"),
                    e.removeClass("btn_pay_terms_v2_on"),
                    d.removeClass("tooltip_on")) : (c.parent().parent().parent().parent().query("div.tooltip_on") && ($Element(c.parent().parent().parent().parent().query("div.tooltip_on")).css("display", "none"),
                    $Element(c.parent().parent().parent().parent().query("div.tooltip_on")).removeClass("tooltip_on"),
                    $Element(c.parent().parent().parent().parent().query("a.btn_pay_terms_v2_on")).removeClass("btn_pay_terms_v2_on")),
                    d.css("display", "block"),
                    e.addClass("btn_pay_terms_v2_on"),
                    d.addClass("tooltip_on")))
        },
        _onClickDepartureCancel: function(a) {
            0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic ? clickcr(a.element, "isr.back1", "", "", a._event) : clickcr(a.element, "dsr.back1", "", "", a._event),
                this._tripArrival.css("display", "none"),
                this._tripThird.css("display", "none"),
                this._departureResultArea.css("display", "none"),
                this._arrivalResultArea.css("display", "none"),
                this._thirdResultArea.css("display", "none"),
                this._tripDeparture.css("display", "block"),
                this._detailArea.css("display", "none"),
                this._oFilter.setOneBackStatus(),
                this._setHeight()
        },
        _onClickArrivalCancel: function(a) {
            0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic ? clickcr(a.element, "isr.back2", "", "", a._event) : clickcr(a.element, "dsr.back2", "", "", a._event),
                this._arrivalResultArea.css("display", "none"),
                this._thirdResultArea.css("display", "none"),
                this._tripThird.css("display", "none"),
                this._tripArrival.css("display", "block"),
                this._detailArea.css("display", "none"),
                this._oFilter.setTwoBackStatus(),
                this._setHeight()
        },
        _onClickThirdCancel: function(a) {
            0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic ? clickcr(a.element, "isr.back3", "", "", a._event) : clickcr(a.element, "dsr.back3", "", "", a._event),
                this._thirdResultArea.css("display", "none"),
                this._tripThird.css("display", "block"),
                this._detailArea.css("display", "none"),
                this._oFilter.setThreeBackStatus(),
                this._setHeight()
        },
        _onClickPayment: function(a) {
            var b = a.element
                , c = $Element(b);
            0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic ? clickcr(a.element, "isr.condsel", "", "", a._event) : clickcr(a.element, "dsr.condsel", "", "", a._event),
                $Element(c.parent().parent().parent().query("div.ly_payment")).addClass("ly_payment_on").css("display", "block"),
                $Element(c.parent().parent().parent().query("a.btn_pay_select")).addClass("btn_pay_terms_on"),
                $Element(c.parent().query("li.ly_payment_item_on")).removeClass("ly_payment_item_on"),
                c.addClass("ly_payment_item_on")
        },
        _onClickPaymentClose: function(a) {
            var b = a.element
                , c = $Element(b)
                , d = $Element(c.parent());
            if (d.hasClass("ly_payment_on"))
                0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic ? clickcr(a.element, "isr.condcancel", "", "", a._event) : clickcr(a.element, "dsr.condcancel", "", "", a._event),
                null  != c.parent().parent().query("div.ly_payment_on") && $Element(c.parent().parent().query("div.ly_payment_on")).removeClass("ly_payment_on").css("display", "none"),
                null  != c.parent().parent().query("a.btn_pay_terms_on") && $Element(c.parent().parent().query("a.btn_pay_terms_on")).removeClass("btn_pay_terms_on");
            else if (d.hasClass("tooltip_on")) {
                var e = $Element(c.parent().parent().query("div.ly_tooltip"))
                    , f = $Element(c.parent().parent().query("a.btn_pay_terms_v2"));
                e.css("display", "none"),
                    f.removeClass("btn_pay_terms_v2_on"),
                    e.removeClass("tooltip_on")
            }
        },
        _onClickPaymentCheck: function(a) {
            var b = a.element
                , c = $Element($Element(b).parent())
                , d = $Element(c.parent().parent()).attr("data-sid")
                , e = $Element(c.parent().parent()).attr("data-psid")
                , f = $Element(c.parent().parent()).attr("data-seat")
                , g = $Element(c.parent().parent()).attr("data-step")
                , h = $Element(c.parent().parent()).attr("data-air")
                , i = $Element(c.parent().query("li.ly_payment_item_on")).attr("data-fare")
                , j = $Element(c.parent().query("li.ly_payment_item_on span.txt_price")).text();
            if (0 == this._oSearchParam.is_domestic || 0 == this._oSearchParam.is_domestic ? clickcr(a.element, "isr.condok", "", "", a._event) : clickcr(a.element, "dsr.condok", "", "", a._event),
                null  != c.parent().parent().query("div.ly_payment_on") && $Element(c.parent().parent().query("div.ly_payment_on")).removeClass("ly_payment_on").css("display", "none"),
                null  != c.parent().parent().query("a.btn_pay_terms_on") && $Element(c.parent().parent().query("a.btn_pay_terms_on")).removeClass("btn_pay_terms_on"),
                "Departure" == g)
                this._selectDeparture(d, i, j, e, f, h);
            else if ("Arrive" == g) {
                var k = (this._oSearchParam.is_domestic,
                    "")
                    , l = ""
                    , m = e + "_" + d + "_" + f;
                k = this._oFlightsList.Arrive[m].TravelAgency,
                    l = this._oFlightsList.Arrive[m].Seat,
                    this._resultRender("Arrive", d),
                    this._oDetailLength = this._oDetailResult.getDetailList(k, l, i, h, $Fn(function(a) {
                        this._setHeight(a)
                    }, this).bind())
            } else if ("Middle" == g) {
                var n = this._makeRenderList("Middle", "Arrive", d, i, j, e, f);
                this._resultRender("Middle", d),
                    this._flightsListRender("Arrive", this._oSearchParam, n);
                var o = this._oFilterControl.makeFilterSpec(this._oSearchParam.is_domestic, this._oSearchParam.TRIP, n, this._oFlightsList.Schedules.Arrive, this._oFlightsList.FilterSpec.FilterFareType);
                this._oFilter.setThreeStatus(o)
            }
            this._setHeight()
        },
        _onOverDetailSchedule: function(a) {
            var b = a.element
                , c = $Element(b);
            return "route_info route_info_0" == $Element(c.parent().query("div.route_info")).className() ? void $Element(c.parent().query("div.ly_schedule")).css("display", "none") : void c.addClass("btn_trip_schedule_on")
        },
        _onOutDetailSchedule: function(a) {
            var b = a.element
                , c = $Element(b);
            c.removeClass("btn_trip_schedule_on")
        }
    }).extend(jindo.UIComponent);
