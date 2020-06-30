var isFirst = 0;//是否为第一次
var mql = window.matchMedia("(orientation: portrait)");
if(!mql.matches) {
    //横屏添加滚动条
    if($('.scroll-body').height()>$('.common-body').height()){
        if($.cookie('curSize')&&$('.common-body').height()!=$.cookie('curSize').split('-')[0]){
            $('.scroll-body').css({'height':$.cookie('curSize').split('-')[0]})
        }else{
            $('.scroll-body').css({'height':$('.common-body').height()})
        }
    }
    changeFontSize()
}else{
    $('.common-body').attr('style','height:auto');
}
//表单获得焦点后改变表单高度
function changeFontSize(){
    $('input').on("click",function(){
        if(!isFirst){
            var deviceH=$('#container').height();//document.documentElement.clientHeight+"px";
            var curFontSize = $('html').attr('style').split(':')[1];
            $.cookie('curSize',deviceH+'-'+curFontSize);
        }
        var curFontSize = $.cookie('curSize').split('-')[1],
            deviceH = $.cookie('curSize').split('-')[0]
        $('html').attr('style','font-size:'+curFontSize+'');
        isFirst++
        var timer = setInterval(function () {
            if(curFontSize!=$('html').attr('style').split(':')[1]){
                $('html').attr('style','font-size:'+curFontSize+'');
                $('.common-body').attr('style','height:'+deviceH+'px;');
                if(isFirst>2){
                    $('.common-box-foot').attr('style','bottom:-.3rem')
                }else{
                    $('.common-box-foot').attr('style','bottom:-.65rem')
                }
                clearInterval(timer)
            }
            },300)
    });
}

var innerWidthTmp = window.innerWidth;
//横竖屏事件监听方法
function screenListener(){
    try{
        var iw = window.innerWidth;
        //屏幕方向改变处理
        if(iw != innerWidthTmp){
            if(iw>window.innerHeight)orientation = 90;
            else orientation = 0;
            //调用转屏事件
            screenEvent();
            innerWidthTmp = iw;
        }
    } catch(e){alert(e);};
    //间隔固定事件检查是否转屏，默认500毫秒
    setTimeout("screenListener()",500);
}
//屏幕方向标识，0横屏，其他值竖屏
var orientation=0;
//转屏事件，内部功能可以自定义
function screenEvent(){
    if(orientation != 0){
        if($('.scroll-body').height()>$('.common-body').height()){
            if($.cookie('curSize')&&$('.common-body').height()!=$.cookie('curSize').split('-')[0]){
                $('.scroll-body').css({'height':$.cookie('curSize').split('-')[0]})
            }else{
                $('.scroll-body').css({'height':$('.common-body').height()})
            }
        }
    }
}
//启动横竖屏事件监听
screenListener();

$(function () {
    //资源路径
    var locationUrl = location.protocol + '//' + location.host;
    /* ==================== sdk交互 ============================ */
    //安卓
    function isIos() {
        var u = navigator.userAgent;
        return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.match(/(iPad)/) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    //ios
    function isAndroid() {
        var u = navigator.userAgent;
        return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    }
    //首页关闭按钮sdk交互
    var isClock = !0;
    $('.close-btn-index').click(function (e) {
        if(!isClock) return;
        isClock = 0;
        loading(true);
        loginOut(function () {
            if (isAndroid()) {
                sdkAndroid.close();
            } else if (isIos()) {
                window.webkit.messageHandlers.close.postMessage("1");
            }
            isClock = !0;
            loading(false)
        },function () {
            if (isAndroid()) {
                sdkAndroid.close();
            } else if (isIos()) {
                window.webkit.messageHandlers.close.postMessage("1");
            }
            isClock = !0;
            loading(false)
        });

    });
    //sdk账号退出accountOut
    $('.change-login').click(function () {
        if(!isClock) return;
        isClock = 0;
        loginOut(function () {
            if (isAndroid()) {
                sdkAndroid.accountOut();
            } else if (isIos()) {
                window.webkit.messageHandlers.accountOut.postMessage("1");
            }
            isClock = !0;
        },function () {
            if (isAndroid()) {
                sdkAndroid.accountOut();
            } else if (isIos()) {
                window.webkit.messageHandlers.accountOut.postMessage("1");
            }
            isClock = !0;
        });

    });
   // new VConsole();
    //sdk账号注销
    $('.cancel-success a,.logout-success .go-back,.logout-success .close-btn').click(function () {
        $.cookie('uuzu_UAUTH','');
        $.cookie('uuzu_UNICKNAME','');
        $.cookie('params','');
        $.cookie('userInfo','');
        $.cookie('userType','');
        $.cookie('curSize','')
        if (isAndroid()) {
            sdkAndroid.logout();
        } else if (isIos()) {
            window.webkit.messageHandlers.logout.postMessage("1");
        }
    });
    /* ==================== sdk交互结束 ============================ */

    /* ==================== 页面初始化开始 ============================ */
    // var url = 'http://192.168.44.64:3000/index.html?' +
    //     'sequence=3&ticket=423259604d8eb363072cfcb68b2a224e&sessionId=6eb76f3ba38a64c5d492a07221296696&app_id=YrFEPRBpqBTW'
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
        //var r = url.split('?')[1].match(reg); //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }
    /**
     * loading 数据请求成功前loading
     */
    function loading(bool,el) {
        if(bool){
            var el = el ? el : 'body';
            var html_loading = '<div class="loadingO"><img src="'+ locationUrl +'/sdk/img/loading.gif" alt=""></div>';
            $(el).append(html_loading);
        }else{
            $('.loadingO').fadeOut(300)
        }
    }
    //用户信息本地数据，用户类型本地数据
    var userData = $.cookie('userInfo')?JSON.parse($.cookie('userInfo')): '';
    var userType = $.cookie('userType')?JSON.parse($.cookie('userType')): '';
    //sdk传入的参数

    var locationH = location.href;
    var envName = '';
    if(locationH.indexOf('//qa') > -1){
        envName = '//qa';
    }else if(locationH.indexOf('//prv') > -1){
        envName = '//prv';
    }else {
        envName = '//';
    }

    if($('.personal-center').length>0){
        //参数传入后端，用于后端种入登录态
        // $.cookie('uuzu_UNICKNAME', null, {
        //     path: '/',
        //     expires: -1,
        //     domain: '.uzgames.com'
        // });
        var params = $.cookie('params')?JSON.parse($.cookie('params')):'';
        if(!params.app_id){
            /* 获取用户信息 */
            params = {
                app_id: GetQueryString("app_id"),
                sessionId: GetQueryString("sessionId"),
                ticket: GetQueryString("ticket"),
                sequence: GetQueryString("sequence")
            };
            //存入cookie
            $.cookie('params', JSON.stringify(params));
        }
        if(!userData){
            loading(true);
            $.ajax({
                type: 'POST',
                url: envName + 'profileapi.uzgames.com/site/rpcsdklogin',
                data: params,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    if(data.status==1){
                        $.cookie('uuzu_UNICKNAME', JSON.stringify(data.data.setcookie[0].value),
                            {
                                path: '/',
                                domain: '.uzgames.com'
                            });
                        getUserInfo()
                    }else{
                        loading(false);
                        var data = {
                            msg:'서버 연결 실패 하였습니다. 잠시 후 다시 시도해주세요.'
                        };
                        popTip.initPop('1',data,function () {})
                    }
                },
                error: function (err) {
                    loading(false);
                    var data = {
                        msg:'서버 연결 실패 하였습니다. 잠시 후 다시 시도해주세요.'
                    };
                    popTip.initPop('1',data,function () {})
                }
            });
            // Profile.getAjax('POST',
            //     '/site/rpcsdklogin',params,
            //     'application/x-www-form-urlencoded',
            //     function (data) {
            //         if(data.status==1){
            //             $.cookie('uuzu_UNICKNAME', JSON.stringify(data.data.setcookie[0].value));
            //             getUserInfo()
            //         }else{
            //             loading(false);
            //             var data = {
            //                 msg:'서버 연결 실패 하였습니다. 잠시 후 다시 시도해주세요.'
            //             };
            //             popTip.initPop('1',data,function () {})
            //         }
            //     });
        }else{
            if (!userData || !userType) return;
            // userData.avatar?$('#hAvatar').attr('src', userData.avatar):$('#hAvatar').attr('src', 'img/user.png')
            if($('.personal-center-box').length>0){
                //账号登录
                if(userType.korea||userType.gta) {
                    $('#setPwd').find('a').attr('href',locationUrl+'/sdk/mailPhone.html');
                    $('#setPwd').find('em').html('비밀번호 수정');
                    $('.personal-center-footer').show();
                    $('#hNickname').html(userType.korea||userType.gta);
                    //是第三方登录，去设置密码
                }else{
                    $('#setPwd').find('a').attr('href',locationUrl+'/sdk/setpassword.html');
                    $('#setPwd').find('em').html('비밀번호 설정');
                    $('.personal-center-footer').hide();
                    $('#hNickname').html(userData.username);
                }
            }
        }
        function getUserInfo() {
            $.ajax({
                type: 'GET',
                url: envName + 'profileapi.uzgames.com/user/info',
                data: params,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    console.log(data)
                    if(data.status==1){
                        var data1 = data.data;
                        $.cookie('userInfo', JSON.stringify(data1));
                        //只有gta账号
                        //只有korea账号
                        data1.avatar?$('#hAvatar').attr('src', 'https://upload.gtarcade.com/user_pic/' + data1.avatar):$('#hAvatar').attr('src', 'img/user.png');
                        loading(false)
                        /* 获取账号状态 */
                        Profile.getUserType(function (data) {
                            if (data.status === 1) {
                                var datas = data.data;
                                $.cookie('userType', JSON.stringify(datas));
                                //有官方账号首页显示修改密码，没有显示设置密码
                                /*首页重置密码，修改密码*/
                                if($('.personal-center-box').length>0){
                                    //账号登录
                                    if(datas.korea||datas.gta) {
                                        $('#setPwd').find('a').attr('href',locationUrl+'/sdk/mailPhone.html');
                                        $('#setPwd').find('em').html('비밀번호 수정');
                                        $('.personal-center-footer').show();
                                        $('#hNickname').html(datas.korea||datas.gta);
                                        //是第三方登录，去设置密码
                                        //没有韩国账号-设置密码
                                        //没有gta账号-设置密码
                                    }else{
                                        $('#setPwd').find('a').attr('href',locationUrl+'/sdk/setpassword.html');
                                        $('#setPwd').find('em').html('비밀번호 설정');
                                        $('.personal-center-footer').hide();
                                        $('#hNickname').html(data1.username);
                                    }
                                }
                                // $('.personal-center-box li').css({'pointer-events':'auto'});
                                // $('.change-login').css({'pointer-events':'auto'})
                            }
                        });
                    }
                },
                error: function (err) {
                }
            });
            // Profile.getUserInfo(function (data) {
            //     if (data.status === 1) {
            //         var data1 = data.data;
            //         $.cookie('userInfo', JSON.stringify(data1));
            //         //只有gta账号
            //         //只有korea账号
            //         // data1.avatar?$('#hAvatar').attr('src', data1.avatar):$('#hAvatar').attr('src', 'img/user.png')
            //         loading(false)
            //         /* 获取账号状态 */
            //         Profile.getUserType(function (data) {
            //             if (data.status === 1) {
            //                 var datas = data.data;
            //                 $.cookie('userType', JSON.stringify(datas));
            //                 //有官方账号首页显示修改密码，没有显示设置密码
            //                 /*首页重置密码，修改密码*/
            //                 if($('.personal-center-box').length>0){
            //                     //账号登录
            //                     if(datas.korea||datas.gta) {
            //                         $('#setPwd').find('a').attr('href',locationUrl+'/sdk/mailPhone.html');
            //                         $('#setPwd').find('em').html('비밀번호 수정');
            //                         $('.personal-center-footer').show();
            //                         $('#hNickname').html(datas.korea||datas.gta);
            //                         //是第三方登录，去设置密码
            //                         //没有韩国账号-设置密码
            //                         //没有gta账号-设置密码
            //                     }else{
            //                         $('#setPwd').find('a').attr('href',locationUrl+'/sdk/setpassword.html');
            //                         $('#setPwd').find('em').html('비밀번호 설정');
            //                         $('.personal-center-footer').hide();
            //                         $('#hNickname').html(data1.username);
            //                     }
            //                 }
            //                 // $('.personal-center-box li').css({'pointer-events':'auto'});
            //                 // $('.change-login').css({'pointer-events':'auto'})
            //             }
            //         });
            //     }
            // });
        }

    }
    /* ==================== 页面初始化结束 ============================ */

    /* 重置错误提示 */
    $('.common-form .inputs').focus(function () {
        var _this = $(this);
        var err = _this.parent().find('.error') || '';
        err = err.length > 0 ? err : _this.parent().next().find('.error');
        err.hide();
        if($(this).parent().find('i').hasClass('get-icon')){
            $(this).parent().find('i').addClass('clock-click1')
        }else{
            $(this).parent().find('i').addClass('clock-click')
        }
    });
    /* 公共输入框格式校验 */
    $('.common-form .inputJ').blur(function () {
        var _this = $(this),
            _name = _this.prop('name'),
            _val = _this.val() || '',
            pwd = $('#hPwd').val() || '',
            err = _this.parent().find('.error') || '',
            err = err.length > 0 ? err : _this.parent().next().find('.error');
        if (!Profile.emptyCheck(_val, err)) return;
        switch (_name) {
            case 'user':
                Profile.accountCheck(_val, err);
                break;
            case 'olduser':
                Profile.oldAccountCheck(_val, err);
                break;
            case 'pwd':
                Profile.pwdCheck(_val, err);
                break;
            case 'repwd':
                Profile.repwdCheck(_val, pwd, err);
                break;
            case 'phone':
                Profile.phoneCheck(_val, err);
                break;
            case 'mail':
                Profile.mailCheck(_val, err);
                break;
            case 'txtcode':
                Profile.txtCodeCheck(_val, err);
                break;
            case 'nickname':
                Profile.nickCheck(_val, err);
                break;
            default:
                break;
        }
    });
    /* 图形验证码刷新 */
    $('.common-form .code img').click(function () {
        Profile.changeVerifyCode();
    });
    Profile.changeVerifyCode();
    /* ========================= 注册开始 ========================= */
    /* 校验注册账户是否已注册 */
    $('#hUser').on('input property',function () {
        var user = $('#hUser').val() || '';
        if(!Profile.regac.test(user)){
            $('#hSignErr').html('*4 ~ 12 사이의 영문/숫자/부호만 사용 가능합니다.')
        }else{
            $('#hSignErr').html('이 계정은 이미 존재합니다.');
        }
        var err = $('#hSignErr');
        if (Profile.iMark) return;
        if (Profile.accountCheck(user, err)) {
            Profile.iMark = true;
            Profile.signUpModify(user, function (data) {
                Profile.iMark = false;
                if (data.status === 1) {
                    $('#hSignupBtn').addClass('sure-btn-click')
                } else if (data.status === 10001) {
                    err.show();
                }
            });
        }
    });
    /*初始化密码强度展示*/
    Profile.pwdStrongCheck($('#hPwd').val(), $('.mm-level').find('dl'));
    $('#hPwd,#aPwd').on('input property', function (e) {
        e.stopPropagation();
        var _name = $(this).attr('name');
        var _val = $(this).val() || '';
        switch (_name) {
            /* 密码强度校验 */
            case 'pwd':
                Profile.pwdStrongCheck(_val, $('.mm-level').find('dl'));
                break;
            /* 密码注销验证 */
            case 'aPwd':
                var pwd = $('#aPwd').val() || '',
                    logErr = $('#aPwdErr');
                if (Profile.pwdCheck(pwd, logErr)) {
                    // $('#aPwdErr').html('*암호 검증이 성공적으로 끝났습니다.').css('color','#00ff06').show();
                    $('.sure-btn').addClass('sure-btn-click');
                }else{
                    $('#aPwdErr').html('*정확한 비밀번호를 입력해 주세요.').css('color','#ff0000').hide();
                }
                break;
        }
    });

    /*icon聚焦*/
    /* 注册 */
    $('#hSignupBtn').click(function () {
        if($(this).attr('class').indexOf('sure-btn-click')==-1)return false;
        var commonErr = $('.common-body .error');
        var user = $('#hUser').val() || '',
            userErr = $('#hSignErr'),
            pwd = $('#hPwd').val() || '',
            pwdErr = $('#hPwdErr'),
            repwd = $('#hRePwd').val() || '',
            repwdErr = $('#hRepwdErr');
        if (commonErr.css('display') !== 'none') return;
        if (Profile.accountCheck(user, userErr) &&
            Profile.pwdCheck(pwd, pwdErr) &&
            Profile.repwdCheck(pwd, repwd, repwdErr)) {
            Profile.upgradeAccount(user, pwd, repwd, '1', function (data) {
                if (data.status === 1) {
                    $.cookie('userInfo', '');
                    $.cookie('userType', '');
                    var data = {
                        msg:'회원가입 완료! \n' +
                            ' [아이디:'+user+']\n' +
                            ' 계정 보호를 위해 프로필에서 본인인증 권장드립니다.'
                    }
                    popTip.initPop('1',data,function () {
                        location.href = locationUrl + '/sdk/index.html';
                    })
                    if (isAndroid()) {
                        sdkAndroid.upgradeAccount(user);
                    } else if (isIos()) {
                        window.webkit.messageHandlers.upgradeAccount.postMessage(user);
                    }
                } else {
                    userErr.show();
                }
            })
        }
        return false
    })
    /* ========================= 注册结束 ========================= */

    /* ==================== 认证开始 ============================ */
    /* 认证表单切换 */
    $('#hFormTab a').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.common-form').eq($(this).index()).addClass('active').siblings().removeClass('active');
    });
    /* 通信商切换 */
    $('#hPhoneForm .type').click(function () {
        $("#hServerErr").hide()
        $(this).find('a').addClass('checked-item');
        $(this).siblings().find('a').removeClass('checked-item')
    });
    /*同意接收短信切换*/
    var isActive = !0;
    /* 修改接收推广短信邮件设置 */
    $('.pitch-on').click(function () {
        var name = $(this).attr('name'),
            _this = this;
        if(isActive){
            isActive = 0;
            if(name=='sms'||name=='email'){
                Profile.changeMsgInfo(name, 1, function (data) {
                    if (data.status === 1) {
                        $(_this).parent().addClass('user-selected').attr('data-bool','true');
                    }
                });
            }else{
                $(_this).parent().addClass('user-selected')
                //同意注销协议
                $('.sure-btn').addClass('sure-btn-click');
                $('.sure-btn-click').click(function () {
                    location.href = locationUrl + '/sdk/logoutmatter.html';
                })
            }
        }else{
            isActive = !0;
            if(name=='sms'||name=='email'){
                Profile.changeMsgInfo(name, 0, function (data) {
                    if (data.status === 1) {
                        $(_this).parent().removeClass('user-selected').attr('data-bool','false');
                    }
                });
            }else{
                //不同意注销协议
                $('.sure-btn').removeClass('sure-btn-click');
                $(_this).parent().removeClass('user-selected')
            }


        }
    });
    /* 短信验证码或邮箱验证码获取 */ /* SDK */
    $('.common-form .sendMail').click(function (e) {
        e.preventDefault();
        var _this = $(this),
            name = _this.attr('name'),
            phone = $('#hPhone').val() || '',
            phoneErr = $('#hPhoneErr'),
            mail = $('#hMail').val() || '',
            mailErr = $('#hMailErr'),
            code = $('#hCode').val() || '',
            codeErr = $('#hCodeErr'),
            unbindPhone = $('#hUnPhone').val() || '',
            unbindPhoneErr = $('#hUnPhoneErr'),
            unbindMail = $('#hUnMail').val() || '',
            unbindMailErr = $('#hUnMailErr'),
            unbindCode = $('#hUnCode').val() || '',
            unbindCodeErr = $('#hUnCodeErr');
        if (Profile.iMark) return;
        switch (name) {
            case 'phone': // 认证短信验证码获取
                if (Profile.timeMark) return; // 手机验证码2分钟超时限制
                if (Profile.phoneCheck(phone, phoneErr) &&
                    Profile.picCodeCheck(code, codeErr)) {
                    Profile.sendPhoneCode(2, phone, code, function (data) {
                        if (data.status === 1) { // 发送成功，开始倒计时
                            Profile.timeMark = true;
                            Profile.timeDown(_this);
                            _this.attr('data-sid', data.data.session_id);
                            // var data = {
                            //     msg:'验证码已发送至邮箱'
                            // };
                            // popTip.initPop('1',data,function () {
                            // })
                        } else {
                            codeErr.show();
                            Profile.changeVerifyCode();
                        }
                    });
                };
                break;
            case 'mail': // 认证邮箱验证码获取
                if (Profile.mailCheck(mail, mailErr)) {
                    Profile.iMark = true;
                    Profile.sendMailCode(mail, function (data) {
                        Profile.iMark = false;
                        if (data.status === 1) {
                            var data = {
                                msg:'발송 완료. 이메일을 확인해 주세요'
                            };
                            popTip.initPop('1',data,function () {
                            })
                        }else{
                            var data = {
                                msg:'정확한 이메일 주소를 입력해 주세요.'
                            };
                            // mailErr.show(); // 返回错误展示错误码
                            popTip.initPop('0',data,function () {
                            })
                        }
                    })
                };
                break;
            case 'phonepwd': // 找回密码短信验证码获取
                if (Profile.timeMark) return;
                if (Profile.phoneCheck(phone, phoneErr) &&
                    Profile.picCodeCheck(code, codeErr)) {
                    Profile.checkbind('phone', phone, function (data) {
                        if (data.status === 1) {
                            Profile.sendPhoneCode(3, phone, code, function (data) {
                                if (data.status === 1) {
                                    Profile.timeMark = true;
                                    Profile.timeDown(_this);
                                    _this.attr('data-sid', data.data.session_id);
                                } else if(data.status ===44) {
                                    codeErr.html(codeErr.attr('data-reperror')).show();
                                    Profile.changeVerifyCode();
                                } else {
                                    codeErr.html(codeErr.attr('data-error')).show();
                                    Profile.changeVerifyCode();
                                }
                            });
                        } else if (data.status === 3) {
                        } else {
                            var data = {
                                msg:'본 계정과 연동된 휴대폰 번호 혹은 이메일 주소를 입력해주세요.'
                            };
                            popTip.initPop('1',data,function () {})
                            return false;
                        }
                    });
                    };
                break;
            case 'mailpwd': // 找回密码邮箱验证码获取
                if (Profile.mailCheck(mail, mailErr)) {
                    Profile.iMark = true;
                    Profile.checkbind('email', mail, function (data) {
                        Profile.iMark = false;
                        if (data.status === 1) {
                            Profile.getPwdMailCode(mail, function (data) {
                                if (data.status === 0) {
                                    mailErr.show();
                                }else{
                                    var data = {
                                        msg:'발송 완료. 이메일을 확인해 주세요'
                                    };
                                    popTip.initPop('1',data,function () {
                                    })
                                }
                            });
                        } else if (data.status === 3) {
                        } else {
                            var data = {
                                msg:'본 계정과 연동된 휴대폰 번호 혹은 이메일 주소를 입력해주세요.'
                            };
                            popTip.initPop('1',data,function () {})
                            return false;
                        }
                    });
                };
                break;
            case 'unbindPhone': // 解绑手机验证码获取
                if (Profile.timeMark) return;
                if (Profile.phoneCheck(unbindPhone, unbindPhoneErr) &&
                    Profile.picCodeCheck(unbindCode, unbindCodeErr)) {
                    Profile.checkbind('phone', unbindPhone, function (data) {
                        if (data.status === 1) {
                            Profile.sendPhoneCode(4, unbindPhone, unbindCode, function (data) {
                                if (data.status === 1) {
                                    Profile.timeMark = true;
                                    Profile.timeDown(_this);
                                    _this.attr('data-sid', data.data.session_id);
                                    // var data = {
                                    //     msg:'验证码已发送'
                                    // };
                                    // popTip.initPop('1',data,function () {
                                    // })
                                } else {
                                    unbindCodeErr.html('*정확한 휴대폰 번호를 입력해주세요.').show();
                                    Profile.changeVerifyCode();
                                }
                            });
                        } else if (data.status === 3) {
                        } else {
                            unbindPhoneErr.html('*인증되지 않은 휴대폰 번호입니다.').show();
                            return false;
                        }
                    });
                };
                break;
            case 'unbindMail': // 解绑邮箱验证码获取
                if (Profile.mailCheck(unbindMail, unbindMailErr)) {
                    Profile.iMark = true;
                    Profile.sendUnbindMailCode(unbindMail, function (data) {
                        Profile.iMark = false;
                        if (data.status === 1) {
                            var data = {
                                msg:'발송 완료. 이메일을 확인해 주세요'
                            };
                            popTip.initPop('1',data,function () {})
                        }else{
                            unbindMailErr.show();
                        }
                    });
                };
            default:
                break;
        }
    });
    /* 提交认证表单 || 提交找回密码 || 提交找回账户 || 解绑账户 || 解绑邮箱 */ /* SDK */
    $('.common-form .identify-btn').click(function () {
        var _this = $(this),
            name = _this.attr('name'),
            type = $('#hPhoneForm .checked-item').prop('name') || '',
            phone = $('#hPhone').val() || '',
            phoneCode = $('#hPhoneCode').val() || '',
            phoneAd = $('#hSms').attr('data-bool')=='true' ? 1 : 0,
            phoneErr = $('#hPhoneErr'),
            phoneCodeErr = $('#hPhoneCodeErr'),
            mail = $('#hMail').val() || '',
            mailCode = $('#hMailCode').val() || '',
            mailAd = $('#hEmail').attr('data-bool')=='true' ? 1 : 0,
            mailErr = $('#hMailErr'),
            mailCodeErr = $('#hMailCodeErr'),
            unbindPhone = $('#hUnPhone').val() || '',
            unbindPhoneErr = $('#hUnPhoneErr'),
            unbindPhoneCode = $('#hUnPhoneCode').val() || '',
            unbindPhoneCodeErr = $('#hUnPhoneCodeErr'),
            unbindMail = $('#hUnMail').val() || '',
            unbindMailErr = $('#hUnMailErr'),
            unbindMailCode = $('#hUnMailCode').val() || '',
            unbindMailCodeErr = $('#hUnMailCodeErr');
        var signTitle = "인증 성공";
        var accountTitle = "Retrieving account successful!";
        var session_id = $('.sendMail').attr('data-sid')||0;
        if (Profile.iMark || $('.common-form .error').css('display') !== 'none') return;
        switch (name) {
            case 'phone': // 手机提交认证
                if(type!= ''){
                    if (Profile.phoneCheck(phone, phoneErr) &&
                        Profile.txtCodeCheck(phoneCode, phoneCodeErr)) {
                        Profile.identifyPhone(type, phone, phoneCode, phoneAd, session_id, 0,'',function (data) {
                            /* 认证成功悬浮提示,1秒后跳转到首页，失败展示错误信息 */
                            if (data.status === 1) {
                                //绑定成功后，清除cookie，用于首页更新最新数据
                                $.cookie('userInfo', '');
                                $.cookie('userType', '');
                                var data = {
                                    msg:'인증 성공.'
                                };
                                popTip.initPop('1',data,function () {
                                    location.href = locationUrl + '/sdk/index.html';
                                })
                            }else if (data.status === 20005 || data.status === 20004 || data.status === 20003) {
                                /* Account is already bound to a Gta account */
                                phoneErr.html(phoneErr.attr('data-reperror')).show();
                                Profile.changeVerifyCode();
                                return false;
                            } else {
                                phoneCodeErr.show();
                                Profile.changeVerifyCode();
                                return false;
                            }
                        });
                    }
                }else {
                    $("#hServerErr").show()
                }
                break;
            case 'mail': // 邮箱提交认证
                if (Profile.mailCheck(mail, mailErr) &&
                    Profile.txtCodeCheck(mailCode, mailCodeErr)) {
                    Profile.iMark = true;
                    Profile.identifyMail(mail, mailCode, mailAd, 0,'',function (data) {
                        Profile.iMark = false;
                        /* 认证成功悬浮提示,1秒后跳转到首页，失败展示错误信息 */
                        if (data.status === 1) {
                            //绑定成功后，清除cookie，用于首页更新最新数据
                            $.cookie('userInfo', '');
                            $.cookie('userType', '');
                            var data = {
                                msg:signTitle
                            };
                            popTip.initPop('1',data,function () {
                                location.href = locationUrl + '/sdk/index.html';
                            })
                        }else if (data.status === 20006 || data.status === 20004) {
                            /* Account is already bound to a Gta account */
                            mailErr.html(mailErr.attr('data-reperror')).show();
                            return false;
                        } else {
                            mailCodeErr.show();
                            return false;
                        }
                    })
                }
                break;
            case 'phonepwd': // 手机提交找回密码
                if (Profile.phoneCheck(phone, phoneErr) &&
                    Profile.txtCodeCheck(phoneCode, phoneCodeErr)) {
                    var session_id = $('#hPhoneVerify').attr('data-sid')||0;
                    Profile.getPwdPhone(phone, phoneCode, session_id, function (data) {
                        Profile.iMark = false;
                        /* 校验成功跳转重置密码页，失败根据错误码展示错误信息 */
                        if (data.status === 1) {
                            location.href = locationUrl + '/sdk/modifypassword.html';
                        } else {
                            var data = {
                                msg:'인증되지 않은 휴대폰 번호입니다.상세 정보가 기억나지 않을 경우\n' +
                                    '                            고객센터로 문의 부탁드립니다.'
                            };
                            popTip.initPop('0',data,function () {
                            });
                            //phoneCodeErr.show();
                            return false;
                        }
                    });
                }
                break;
            case 'mailpwd': // 邮箱提交找回密码
                if (Profile.mailCheck(mail, mailErr) &&
                    Profile.txtCodeCheck(mailCode, mailCodeErr)) {
                    Profile.iMark = true;
                    Profile.getPwdMail(mail, mailCode, function (data) {
                        Profile.iMark = false;
                        if (data.status === 1) {
                            location.href = locationUrl + '/sdk/modifypassword.html';
                        } else {
                            //mailCodeErr.show();
                            var data = {
                                msg:'인증되지 않은 이메일입니다. 상세 정보가 기억나지 않을 경우\n' +
                                    ' 고객센터로 문의 부탁드립니다.'
                            };
                            popTip.initPop('0',data,function () {
                            });
                            return false;
                        }
                    });
                }
                break;
            case 'unbindPhone': // 解绑手机
                if (Profile.phoneCheck(unbindPhone, unbindPhoneErr) &&
                    Profile.txtCodeCheck(unbindPhoneCode, unbindPhoneCodeErr)) {
                    Profile.unbindPhone(unbindPhoneCode, session_id, function (data) {
                        if (data.status === 1) {
                            //解绑成功后，清除cookie，用于首页更新最新数据
                            $.cookie('userInfo', '');
                            $.cookie('userType', '');
                            var data = {
                                msg:'인증 해제 성공'
                            };
                            popTip.initPop('1',data,function () {
                                location.href = locationUrl + '/sdk/index.html'
                            })
                        } else {
                            unbindPhoneCodeErr.show();
                            return false;
                        }
                    });
                }
                break;
            case 'unbindMail': // 解绑邮箱
                if (Profile.mailCheck(unbindMail, unbindMailErr) &&
                    Profile.txtCodeCheck(unbindMailCode, unbindMailCodeErr)) {
                    Profile.iMark = true;
                    Profile.unbindMail(unbindMail, unbindMailCode, function (data) {
                        Profile.iMark = false;
                        if (data.status === 1) {
                            //解绑成功后，清除cookie，用于首页更新最新数据
                            $.cookie('userInfo', '');
                            $.cookie('userType', '');
                            var data = {
                                msg:'인증 해제 성공'
                            };
                            popTip.initPop('1',data,function () {
                                location.href = locationUrl + '/sdk/index.html'
                            })
                        } else if (data.status === 30001) {
                            unbindMailErr.show();
                            return false;
                        } else {
                            unbindMailCodeErr.show();
                            return false;
                        }
                    });
                }
                break;
            default:
                break;
        }
    })
    /* ==================== 认证结束 ============================ */
    //返回上一页
    $('.go-back,.close-btn').click(function (e) {
        e.preventDefault();
        location.href = locationUrl + '/sdk/index.html';
        $.cookie('curSize','')
    });
    //返回绑定列表
    $('.go-back-list').click(function (e) {
        e.preventDefault();
        location.href = locationUrl + '/sdk/certificatelist.html';
    });
    /* ==================== 修改密码开始 ============================ */
    /* 修改密码（如全绑定，则以tab页形式展示；如仅绑定一项，则展示一项；如全未绑定，则提示联系客服找回 */
    if ($('.getpwd-body').length > 0) {
        loading(true,'.getpwd-body');
        var user = userData.account;
        Profile.accountModify(user, function (data) {
            loading(false)
            if (data.status === 1) {
                var data = data.data;
                var bindPhone = data.bind_phone,
                    bindMail = data.bind_email,
                    formTab = $('#hFormTab'),
                    formPhone = $('#hPhoneForm'),
                    formMail = $('#hMailForm');
                $('.tips-msg').html('인증 시 사용한 휴대폰 번호/일메일 주소가 변경되었을 경우,<br/>고객센터(yz-cs@yoozoo.com)로 문의해 주세요.');
                if (bindPhone != "" && bindMail != "") {
                    formTab.css({'display':'block'});
                    formMail.css({'display':'block'});
                    formPhone.css({'display':'none'});
                } else if (bindPhone != "" && bindMail == "") {
                    formTab.css({'display':'none'});
                    formPhone.css({'display':'block'});
                    formMail.css({'display':'none'});
                } else if (bindMail != "" && bindPhone == "") {
                    formTab.css({'display':'none'});
                    formMail.css({'display':'block'});
                    formPhone.css({'display':'none'})
                }else{
                    formTab.css({'display':'none'});
                    formMail.css({'display':'none'});
                    formPhone.css({'display':'none'});
                    /*没有绑定提示信息*/
                    $('.tips-msg').html('죄송합니다. 보안설정 진행 후 이용가능 합니다.')
                }
            } else {
                var data = {
                    msg:'서버 연결 실패 하였습니다. 잠시 후 다시 시도해주세요.'
                };
                popTip.initPop('1',data,function () {})
                /* 失败展示错误 */
                // userErr.show()
            }
        });
    }
    /*手机邮箱验证tab*/
    $(".tab-list").on("click","li",function(e){
        e.preventDefault();
        $(this).addClass('current').siblings().removeClass('current');
        var _index = $(this).index();
        $('.content_reg').eq(_index).show().siblings().hide();
    });
    /* 提交修改密码表单 */
    $('#hChaPwdBtn').click(function () {
        var pwd = $('#hPwd').val() || '',
            pwdErr = $('#hPwdErr'),
            repwd = $('#hRePwd').val() || '',
            repwdErr = $('#hRepwdErr');
        if (Profile.pwdCheck(pwd, pwdErr) && Profile.repwdCheck(pwd, repwd, repwdErr)) {
            Profile.resetPwd(pwd, repwd, function (data) {
                var status = data.status;
                if (status === 1) {
                    var data = {
                        msg:'암호 변경 성공'
                    }
                    popTip.initPop('1',data,function () {
                        location.href = locationUrl + '/sdk/index.html';
                    })
                } else if (status === 21) { // 密码错误
                    return pwdErr.show();
                } else { // 重复密码错误
                    return repwdErr.show();
                }
            });
        }
        return false
    });
    /* ==================== 修改密码结束 ============================ */

    /* ==================== 个人认证开始 ============================ */
    /*判断是否为第三方登录根据用户信息，获取邮箱，手机绑定状态，默认未绑定*/
    if ($('.center-body').length > 0) {
        loading(true,'.center-body');
        //认证邮箱
        if(!userData)return;
        var username = userData.secure_email.indexOf('@') > -1 ? Profile.hideEmailInfo(userData.secure_email) : userData.secure_email||'미 연동';
        //认证手机
        var phone = userData.secure_phone ? userData.secure_phone : '미 연동';
        if(!userData.secure_email){
            $('.set-email-detail').find('a').attr('href',locationUrl+'/sdk/certificatemail.html').html('진행');
            $('.set-email-detail').find('span').html('미 연동')
        }else {
            $('.set-email-detail').find('a').attr('href',locationUrl+'/sdk/unbindmail.html').html('해제');
            $('.set-email-detail').find('span').html(username)
        }
        if(!userData.secure_phone){
            //去绑定
            $('.set-phone-detail').find('a').attr('href',locationUrl+'/sdk/certificatephone.html').html('진행');
            $('.set-phone-detail').find('span').html('미 연동')
        }else {
            //去解绑
            $('.set-phone-detail').find('a').attr('href',locationUrl+'/sdk/unbindphone.html').html('해제');
            $('.set-phone-detail').find('span').html(phone)
        }

        /* 获取推广短信邮件状态 */
        Profile.getMsgInfo(function (data) {
            if (data.status === 1) {
                var data = data.data;
                data.email > 0 ? $('.set-email dd').addClass('allow-receive') : $('.set-email dd').removeClass('allow-receive');
                data.sms > 0 ? $('.set-phone dd').addClass('allow-receive') : $('.set-phone dd').removeClass('allow-receive');
            }else{
                var data = {
                    msg:'서버 연결 실패 하였습니다. 잠시 후 다시 시도해주세요.'
                    //msg:'시스템이 복잡하니 나중에 다시 시도해 주시기 바랍니다.'
                };
                popTip.initPop('1',data,function () {})
            }
            loading(false)
        });
        /*修改推广短信邮件状态*/
        $('.security-set dl').on('click','dd',function (e) {
            e.preventDefault();
            var _this = this;
            if($(this).hasClass('allow-receive')){
                Profile.changeMsgInfo($(this).attr('name'),0,function (data) {
                    if (data.status === 1) {
                        $(_this).removeClass('allow-receive');
                    }
                })
            }else{
                Profile.changeMsgInfo($(this).attr('name'),1,function (data) {
                    if (data.status === 1) {
                        $(_this).addClass('allow-receive');
                    }
                })
            }

        });
    }
    /* ==================== 个人认证结束 ============================ */
    /* ==================== 第三方绑定解绑开始 ============================ */
    if ($('.account-body').length > 0) { //去绑定
        if (isAndroid()) {
            $('#hGmail').show()
        } else if (isIos()) {
            $('#hGmail').hide()
        }
        /* 获取账号状态 */
        loading(true,'.account-body')
        Profile.getUserType(function (data) {
            if (data.status === 1) {
                var data = data.data;
                //有官方账号首页显示修改密码，没有显示设置密码
                var userType = data;
                var fb = userType.facebook ? '연동 해제':'연동',//'解绑':'绑定',
                    gmail = userType.google ?'연동 해제':'연동',//'解绑':'绑定',
                    korea =userType.korea?'연동 해제':'연동',//'解绑':'绑定',
                    fb1 =userType.facebook?'연동됨':'미연동 상태',//'已绑定':'未绑定',
                    gmail1 = userType.google ?'연동됨':'미연동 상태',
                    korea1 =userType.korea?'연동됨':'미연동 상태';
                // 没有韩国账号-去重置密码
                // 只有韩国账号-第三方绑定
                // 只有gta账号-第三方绑定
                // 有韩国又有gta账号-绑定第三方
                //onlyOne = true;
                function removerC(name,classn) {
                    if($(name).hasClass(classn)) $('#hFb').removeClass(classn)
                }
                if (userType.korea||userType.gta){
                    $('.three-account').show();
                    $('#hFb span').html(fb1);
                    $('#hGmail span').html(gmail1);
                    // $('#hKorea span').html(korea1);
                    $('#hFb a').html(fb);
                    $('#hGmail a').html(gmail);
                    // $('#hKorea a').html(korea);
                    if(!userType.facebook){
                        removerC('#hFb','has-bind')
                        $('#hFb').addClass('no-bind')
                    }else{
                        //登录名称与第三方类型中相同
                        if(userData.username==userType.facebook){
                            $('#hFb a').html('연동됨').css({'background':'#e4e1e1','pointerEvents':'none','color':'#ffffff'});
                        }else{
                            removerC('#hFb','no-bind')
                            $('#hFb').addClass('has-bind')
                        }
                    }
                    if(!userType.google){
                        removerC('#hGmail','has-bind')
                        $('#hGmail').addClass('no-bind')
                    }else{
                        //登录名称与第三方类型中相同
                        if(userData.username==userType.google){
                            $('#hGmail a').html('연동됨').css({'background':'#e4e1e1','pointerEvents':'none','color':'#ffffff'});
                        }else{
                            removerC('#hGmail','no-bind')
                            $('#hGmail').addClass('has-bind')
                        }
                    }
                    // $('#hKorea').addClass('has-bind');
                }else{
                    $('.three-account').hide();
                    $('#hKorea span').html(korea1);
                    $('#hKorea a').html(korea);
                    $('#hKorea').show().addClass('no-bind');
                }
                //去绑定
                $('.no-bind a').click(function (e) {
                    e.preventDefault();
                    var name = $(this).attr('name');
                    if(name=='facebook'||name=='google'){
                        /* 绑定 */
                        $('.pop-account').find('.sure-btn-click').attr('name',name);
                        $('.pop-agree,.pop-mark').fadeIn(300)
                    }else{
                        location.href = locationUrl + '/sdk/setpassword.html';
                    }
                });
                $('.cancel-btn').click(function (e) {
                    e.preventDefault();
                    $('.pop-account,.pop-mark').fadeOut(300);
                });
                $('.sure-btn-click').click(function () {
                    var name = $(this).attr('name');
                    $('.pop-account,.pop-mark').fadeOut(300);
                    // goBind(name);
                    if (isAndroid()) {
                        sdkAndroid.bindThird(name);
                    } else if (isIos()) {
                        window.webkit.messageHandlers.bindThird.postMessage(name);
                    }
                });
                //解绑
                var unbind = !0;
                $('.has-bind a').click(function (e) {
                    e.preventDefault();
                    if(!unbind)return;
                    unbind = 0;
                    //判断是否有官方账号，有官方账号显示需要绑定列表
                    var userName = userType[$(this).attr('name')];
                    /* 解绑 */
                    /* 判断用户当前要解绑账号是否为唯一账号，如果是则弹窗提示，不是则直接解绑 */
                    // if (onlyOne) {
                    //     /* 绑定 */
                    //     $('.pop-account h1').html('끄르다 묶');
                    //     $('.pop-account p').html('지금 묶음해제가 유일한 계좌인데 확실히 묶음해제가 되나요?');
                    //     $('.pop-account,.pop-mark').fadeIn(300);
                    //     $('.cancel-btn').click(function () {
                    //         $('.pop-account,.pop-mark').fadeOut(300);
                    //     });
                    //     $('.sure-btn-click').click(function () {
                    //         $('.pop-account,.pop-mark').fadeOut(300);
                    //         Profile.socialUnBind(userName, function () {
                    //            location.href = locationUrl + '/sdk/index.html';
                    //         });
                    //     })
                    // }
                    Profile.socialUnBind(userName, function (data) {
                        if(data.status==1){
                            var data = {
                                msg:'해제 성공'
                            };
                            $.cookie('userInfo', '');
                            $.cookie('userType', '');
                            popTip.initPop('1',data,function () {
                                location.href = locationUrl + '/sdk/bindaccount.html';
                            })
                        }else{
                            var data = {
                                msg:'서버 연결 실패 하였습니다. 잠시 후 다시 시도해주세요.'
                            };
                            popTip.initPop('1',data,function () {
                            })
                        }
                        unbind = !0;
                    });
                });
            }else{
                var data = {
                    msg:'서버 연결 실패 하였습니다. 잠시 후 다시 시도해주세요.'
                };
                popTip.initPop('1',data,function () {})
            }
            loading(false)
        });

    }


    /* ==================== 第三方绑定解绑开始 ============================ */
    /* ==================== 注销账号开始 ============================ */
    var isOnOff = !0;
    $('.logout-account').click(function () {
        if(!$(this).hasClass('sure-btn-click'))return;
        if(isOnOff){
            isOnOff = 0;
            var params = $.cookie('params')?JSON.parse($.cookie('params')):'';
            var pwd = $('#aPwd').val() || '';
            Profile.getAjax('POST',
                '/site/rpcsdklogin',params,
                'application/x-www-form-urlencoded',
                function (data) {
                    if(data.status==1){
                        Profile.cancelAccount(hex_md5(pwd), function (data) {
                            if (data.status === 1) {
                                location.href = locationUrl + '/sdk/logoutsuccess.html'
                            }else{
                                $('#aPwdErr').html('*정확한 비밀번호를 입력해 주세요.').css('color','#ff0000').show();
                            }
                            isOnOff = !0
                        })
                    }else{
                        $('#aPwdErr').html('*정확한 비밀번호를 입력해 주세요.').css('color','#ff0000').show();
                    }
                });
        }

    });
    /* ==================== 注销账号结束 ============================ */
    /**
     * @desc: 登出
     * @param {type}
     * @return: 退出后刷新当前页面
     */
    function loginOut(callback,callback1) {
        // Profile.getAjax('GET',
        //     '/passport/logout', '',
        //     '',
        //     function (data) {
        //         $.cookie('uuzu_UAUTH','');
        //         $.cookie('uuzu_UNICKNAME','');
        //         $.cookie('params','');
        //         $.cookie('userInfo','');
        //         $.cookie('userType','');
        //         if (data.status === 1) {
        //             callback()
        //         }else{
        //             callback1()
        //         }
        //     });

        $.ajax({
            type: 'GET',
            url: envName + 'profileapi.uzgames.com/passport/logout',
            data: '',
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                $.cookie('uuzu_UAUTH','');
                $.cookie('uuzu_UNICKNAME','');
                $.cookie('params','');
                $.cookie('userInfo','');
                $.cookie('userType','');
                $.cookie('curSize','')
                if(data.status==1){
                    callback()
                }else{
                    callback1()
                }
            },
            error: function (err) {
                $.cookie('uuzu_UAUTH','');
                $.cookie('uuzu_UNICKNAME','');
                $.cookie('params','');
                $.cookie('userInfo','');
                $.cookie('userType','');
                $.cookie('curSize','')
                callback1()
            }
        });
    }
});
function goBind(name,data) {
    /* 绑定 */
    /* 绑定第三方账号，该账号已被其他账号绑定，提示更换其他账号绑定 */
    var datas = '';
    switch (data) {
        //绑定失败
        case '0':
            datas = {
                msg:'죄송합니다. 연동 실패하였습니다. 잠시 후 다시 시도해주세요.'
            };
            popTip.initPop('1',datas,function () {})
            break;
        //绑定成功
        case '1':
            datas = {
                msg:'연동 성공.'
            };
            popTip.initPop('1',datas,function () {
                history.go(0)
            });
            break;
        //重复绑定
        case '2':
            datas = {
                msg:'해당 구글/페이스북 계정은 이미 다른 유주 계정과 연동된 상태입니다.구글/페이스북 앱에서 다른 계정으로 로그인 후 재 시도해 주세요.',
                name:name
            };
            popTip.initPop('2',datas,function () {});
            $('.go-change-btn').click(function (e) {
                e.preventDefault();
                $('.change-account,.pop-mark').fadeOut(300);
            });
            break;
    }
}