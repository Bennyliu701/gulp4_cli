/*
 * @Description: 
 * @Author: benny.liu
 * @Github: 
 * @Date: 2020-04-14 11:17:07
 * @LastEditors: benny.liu
 * @LastEditTime: 2020-04-17 15:28:27
 */
var Profile = {
    RELEASE_TAG: '1593522174321', // 当前环境名称
    NODE_ENV: 'dev', // 当前环境名称
    BASE_API: 'https://qa', // 基础请求Api地址
    HOME_ROOT: '', // 当前环境下主页地址
    STATIC_ROOT: './dist', // 当前环境下静态资源地址
    COMMON_ROOT: './dist/common', // 当前环境下公共静态资源地址
    uAccount: $.cookie('uuzu_ACCOUNT'), // 用户账号
    uNickname: $.cookie('uuzu_UNICKNAME') || '', // 用户昵称
    uAuth: $.cookie('uuzu_UAUTH') || '', // 用户权限
    timeMark: false, // 防短信连续请求标识
    deviceId: '', //风控sdk 设备ID
    locationUrl: location.protocol + '//' + location.host, // 当前地址
    /**
     * @desc: 初始化状态： 
     */
    init: function () {
        var that = this;
    },
    /**
     * @desc: 打点统计： 
     */
    toTakeTag: function () {
        $(document).on('click', '.ulink_dot', function () {
            // var DotStr = $(this).attr('data_ulink_dot') || '',
            //     DotArr = DotStr.split(','),
            //     module = DotArr[0],
            //     value = DotArr[1],
            //     target_url = DotArr[2];
            var module = value = '',
                target_url = $(this).attr('data_ulink_dot') || '';
            if (typeof yoozoo === 'undefined') return;
            //事件类型：0. 访问，1. 点击，2. 曝光，3. 退出访问
            yoozoo.customDot(1, module, value, target_url);
            yoozoo.customDot({
                event_type: "1",
                key_module: module,
                key_function: value,
                value: target_url,
                tag: 'collect_ulink_behavior_data'
            });
        })
    },
    /* 解决safari自带放大功能：阻止双击放大 */
    preventZoom: function () {
        var lastTime = 0;
        document.addEventListener('touchstart', function (event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        });
        document.addEventListener('touchend', function (event) {
            var nowTime = (new Date()).getTime();
            if (nowTime - lastTime <= 300) {
                event.preventDefault();
            }
            lastTime = nowTime;
        }, false);
        // 解决safari自带放大功能：阻止双指放大
        document.addEventListener('gesturestart', function (event) {
            event.preventDefault();
        });
    },
    /**
     * @desc: 微信分享
     * 
     */
    shareWeChat: function () {
        new youzuWeixin({
            act_url: "",
            act_id: "", //活动id
            shareTitle: '', // 分享标题
            shareDesc: '', // 分享描述
            shareLink: location.href, // 分享链接
            shareImgUrl: '', // 分享图标
            shareTimeTitle: '', // 分享朋友圈标题
            shareSuccessCallback: function () {}
        }).share();
    },
    /**
     * @desc: 公共ajax方法 
     * @param {type} 类型，地址，参数对象，内容类型，成功回调函数
     * @return: 
     */
    getAjax: function (type, url, params, conType, callback, callbackErr) {
        $.ajax({
            type: type,
            url: url,
            data: params,
            dataType: "json",
            contentType: conType,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                callback(data)
            },
            error: function (err) {
                if (callbackErr) {
                    callbackErr(err)
                } else {
                    Profile.loadingDel()
                }
            }
        });
    },
    /**
     * @desc: IOS兼容宽屏覆盖
     */
    IosCover: function () {
        var _iphone = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent.toLowerCase());
        if (_iphone) {
            var _meta_content = $('meta[name=viewport]').attr('content') + ',viewport-fit=cover';
            $('meta[name=viewport]').attr('content', _meta_content);
        }
    },
    /**
     * @desc: 判断用户态，不存在就跳转到登录
     */
    judgeLogOut: function (refer) {
        var refer = refer || '';
        if (!this.uNickname && !this.uAuth) {
            location.href = refer.length > 0 ? this.locationUrl + '/login.html' + '?refer=' + refer : this.locationUrl + '/login.html';
            return false;
        }
    },
    /**
     * @desc: 判断JSON字符串 或者 普通字符串
     */
    isJsonString: function (str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch (e) {}
        return false;
    },
    /**
     * @desc: 时间戳转换
     */
    getNowTime: function (time) {
        var date = new Date(time * 1000 + 8 * 3600 * 1000);
        return date.toJSON().substr(0, 19).replace('T', ' ');
    },
    /**
     * @desc: 短信验证码倒计时
     * @param {type} 验证码展示对象
     * @return: 
     */
    timeDown: function (o) {
        var str = o.html();
        var _timer = '',
            dur = 1,
            _time_mark = false,
            now = new Date().getTime();
        var future = now - -60000;
        var pms = {
            now: now,
            sec: "00",
            mini: "00",
        }
        var f = {
            zero: function (n) {
                var n = parseInt(n, 10);
                if (n > 0) {
                    if (n <= 9) {
                        n = "0" + n;
                    }
                    return String(n);
                } else {
                    return "00";
                }
            },
            dv: function (now) {
                if (_time_mark) {
                    now += 1000;
                }
                _time_mark = true;
                dur = Math.round((future - now) / 1000);
                if (dur >= 0) {
                    pms.now = now;
                    pms.sec = f.zero(dur % 60);
                    pms.mini = Math.floor((dur / 60)) > 0 ? f.zero(Math.floor((dur / 60)) % 60) : "00";
                }
                return pms;
            },
            ui: function () {
                if (dur <= 0) {
                    o.html(str);
                    clearInterval(_timer);
                    return Profile.timeMark = false;
                }
                f.dv(pms.now);
                o.html(pms.mini + ':' + pms.sec);
                _timer = setTimeout(f.ui, 1000);
            }
        };
        f.ui();
    },
    /**
     * @desc: 排他
     * @param {type} 当前对象
     * @return: 
     */
    killOther: function (target) {
        target
            .addClass("active")
            .siblings()
            .removeClass("active");
    },
    /**
     * @desc: 节流阀
     * @param fn {Function}   实际要执行的函数
     * @param delay {Number}  执行间隔，单位是毫秒（ms）
     *
     * @return {Function}     返回一个“节流”函数
     */
    throttle: function (fn, threshhold) {
        var last
        var timer
        threshhold || (threshhold = 250)
        return function () {
            var context = this
            var args = arguments
            var now = +new Date()
            if (last && now < last + threshhold) {
                clearTimeout(timer)
                timer = setTimeout(function () {
                    last = now
                    fn.apply(context, args)
                }, threshhold)
            } else {
                last = now
                fn.apply(context, args)
            }
        }
    },
    /**
     * @desc: 公共返回顶部
     * @param {type} 目标对象
     * @return: 
     */
    goTop: function (target) {
        var that = this;
        var backTopHtml = '<a href="javascript:void(0);" class="go-top" id="goTop">TOP</a>'
        target.append(backTopHtml);
        $('#goTop').click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 700)
        })
        window.addEventListener("scroll", that.throttle(showTop, 100));

        function showTop() {
            var s = $(window).scrollTop()
            if (s > $(window).height() / 2) {
                $('#goTop').fadeIn(100)
            } else {
                $('#goTop').fadeOut(100)
            }
        }
    },
    /**
     * @desc: 键盘回车
     * @param {type} 目标对象
     * @return: 
     */
    keyPress: function (callback) {
        $(document).keypress(function (e) {
            if (e.keyCode === 13) {
                callback();
            }
        })
    },
    /**
     * @desc: 公共弹窗
     * @param {type} 弹窗标题，内容，点击确认回调
     * @return: 
     */
    prompt: function (title, con, callback) {
        var _this = this;
        var html = '<div class="common-diag">\
                <div class="diag-box">\
                    <h3>' + title + '</h3>\
                    <div class="content">' + con + '</div>\
                    <div class="btns">\
                        <span class="cancel">取消</span>\
                        <span class="confirm">确认</span>\
                    </div>\
                </div>\
            </div>';
        $('body').append(html);
        $(document).on('click', '.cancel', function () {
            $('.common-diag').remove();
        })
        $(document).on('click', '.confirm', callback)
    },
    /**
     * @desc: 公共提示
     * @param {type} 提示内容，回调
     * @return: 
     */
    toast: function (content) {
        if ($('.pop-tip').length <= 0) {
            $('body').append('<div class="pop-tip" style="display:none;"></div>');
        }
        var html =
            '<div class="mark"></div>\
            <div class="tip-icon-box">\
                <div class="tip-icon">\
                    <span>' + content + '</span>\
                </div>\
            </div>';
        $('.pop-tip').html(html).fadeIn(1000);
        setTimeout(function () {
            $('.pop-tip').fadeOut(1000);
        }, 1000);
    },
    /**
     * @desc: 公共loading加载
     */
    loadingAdd: function () {
        var html = '<div class="loading-diag">\
                        <div class="loadingbox">\
                            <img src= "' + Profile.STATIC_ROOT + '/images/loding.gif" alt="">\
                        </div>\
                    </div>';
        $('body').append(html);
    },
    /**
     * @desc: 公共loading删除
     */
    loadingDel: function () {
        if ($('.loading-diag .loadingbox').length > 0) {
            $('.loading-diag').remove()
        }
    },
    /**
     * @desc: 判断客户端类型，pc或移动
     * @return: 终端名称
     */
    deviceType: function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"
        ];
        var flag = 'windows';
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = Agents[v];
                break;
            }
        }
        return flag;
    },
    /**
     * @desc: 浏览器检查结果
     * @return: 终端版本号
     */
    getBrowser: function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/edge\/([\d.]+)/)) ? Sys.edge = s[1]:
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/MicroMessenger\/([\d\.]+)/i)) ? Sys.weChat = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        if (Sys.edge) return {
            broswer: "Edge",
            version: Sys.edge
        };
        if (Sys.ie) return {
            broswer: "IE",
            version: Sys.ie
        };
        if (Sys.firefox) return {
            broswer: "Firefox",
            version: Sys.firefox
        };
        if (Sys.chrome) return {
            broswer: "Chrome",
            version: Sys.chrome
        };
        if (Sys.opera) return {
            broswer: "Opera",
            version: Sys.opera
        };
        if (Sys.weChat) return {
            broswer: "WeChat",
            version: Sys.weChat
        };
        if (Sys.safari) return {
            broswer: "Safari",
            version: Sys.safari
        };

        return {
            broswer: "",
            version: ".0"
        };
    },
    /**
     * @desc: 获取当前浏览器终端版本号
     * @return: 终端版本号
     */
    getBrowserNum: function () {
        var browserNum = Profile.getBrowser().version
        var browserNumLength = browserNum.match(/\./g).length
        if (browserNumLength < 3) {
            for (var ind = 0; ind < (3 - browserNumLength); ind++) {
                browserNum += '.0'
            }
        }
        return browserNum
    },
    /**
     * @desc: 获取当前月份与后一个月
     */
    getOneDate: function (nowTime) {
        var dateObj = {
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
        }
        var nowDate = new Date()
        var nowYear = nowTime ? nowTime.split('-')[0] : nowDate.getFullYear()
        var nowMonth = nowTime ? nowTime.split('-')[1] : (Number(nowDate.getMonth()) + 1)
        var endYear = nowMonth == '12' ? Number(nowYear) + 1 : nowYear
        var endMonth = nowMonth == '12' ? '01' : Number(nowMonth) + 1
        dateObj.startDate = nowYear + '-' + (Number(nowMonth) < 10 ? '0' + Number(nowMonth) : nowMonth)
        dateObj.endDate = endYear + '-' + (Number(endMonth) < 10 ? '0' + Number(endMonth) : endMonth)
        dateObj.startTime = dateObj.startDate + '-01 00:00:00'
        dateObj.endTime = dateObj.endDate + '-01 00:00:00'
        return dateObj
    },
    /**
     * @desc: 获取当前月份与前三个月
     */
    getNowDate: function (endTime) {
        var dateObj = {
            startTime: '',
            endTime: '',
        }
        var nowDate = new Date()
        var nowYear = endTime ? endTime.split('-')[0] : nowDate.getFullYear()
        var nowMonth = endTime ? endTime.split('-')[1] : (nowDate.getMonth() + 1)
        if (nowMonth > 3) {
            dateObj.startTime = (nowYear + '-' + (Number(nowMonth - 3) < 10 ? '0' + (nowMonth - 3) : (nowMonth - 3)))
        } else {
            dateObj.startTime = (nowYear - 1) + '-' + (Number((9 + Number(nowMonth)) < 10 ? '0' + ((9 + Number(nowMonth))) : 9 + Number(nowMonth)))
        }
        dateObj.endTime = nowYear + '-' + (Number(nowMonth) < 10 ? '0' + Number(nowMonth) : nowMonth)
        return dateObj
    },
    /**
     * @desc: 横屏提示
     * @return: 
     */
    changeOrientation: function () {
        var _timer = '';
        var evt =
            "onorientationchange" in window ? "orientationchange" : "resize";
        window.addEventListener(
            evt,
            function () {
                if (evt === "orientationchange") {
                    clearInterval(_timer);
                    if ($("#shadow-box").length > 0) {
                        $("#shadow-box").remove();
                    }
                    _timer = setTimeout(function () {
                        var width = document.documentElement.clientWidth;
                        var height = document.documentElement.clientHeight;
                        // 获取html元素
                        var html = document.documentElement;
                        var orientation = window.orientation || '';
                        if (orientation == 90 || orientation == -90 || width > height) {
                            var shadowBox = document.createElement("div");
                            var nodeChild = document.createElement("p");
                            var nodeText = document.createTextNode(
                                "为了获得最佳体验，请选择竖屏观看"
                            );
                            shadowBox.setAttribute("id", "shadow-box");
                            nodeChild.appendChild(nodeText);
                            shadowBox.appendChild(nodeChild);
                            $("body").append(shadowBox);
                            shadowBox.style.display = "block";
                        } else {
                            if (typeof $("#shadow-box") !== "undefined") {
                                $("#shadow-box").remove();
                            }
                        }
                    }, 300);
                }
            },
            false
        );
    },
}

$(function () {
    Profile.init();
})