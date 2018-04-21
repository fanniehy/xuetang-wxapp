/*
* @Author: mark
* @Date:   2016-09-27 16:27:19
* @Last Modified by:   mark
* @Last Modified time: 2016-09-29 10:17:44
*/
App(
    {
        onLaunch: function () {
            this.updateSearchKeyword();
        },
        getUserInfo: function (cb,forceLogin) {
            var that = this;
            if (this.globalData.userInfo && !forceLogin) {
                typeof cb == "function" && cb(this.globalData.userInfo)
            } else {
                //调用登录接口
                wx.login({
                    success: function (res) {
                       var code =  res.code;

                        wx.getUserInfo({
                            success: function (res) {
                                that.globalData.userInfo = res.userInfo;

                                if (code) {
                                    //发起网络请求
                                    wx.request({
                                        url: that.globalData.domain + '/my/onLogin',
                                        data: {
                                            code: code,
                                            nickName:that.globalData.userInfo.nickName,
                                            avatarUrl:that.globalData.userInfo.avatarUrl,
                                            gender : that.globalData.userInfo.gender, //性别 0：未知、1：男、2：女
                                            province : that.globalData.userInfo.province,
                                            city : that.globalData.userInfo.city,
                                            country : that.globalData.userInfo.country
                                        },success: function (res) {
                                            that.globalData.session = res.data;
                                            wx.setStorage({
                                                key:"session",
                                                data:{
                                                    data:res.data.length<100?res.data:"",
                                                    time:new Date().getTime()
                                                }
                                            });
                                            wx.setStorage({
                                                key:"userInfo",
                                                data:{
                                                    data:that.globalData.userInfo,
                                                    time:new Date().getTime()
                                                }
                                            });

                                            that.updateSearchKeyword();
                                            typeof cb == "function" && cb(that.globalData.userInfo);
                                        }
                                    });
                                }
                            },fail:function (res) {
                                // 用户拒绝授权

                                that.globalData.userInfo = {
                                    nickName:'游客',
                                    avatarUrl:''
                                };
                                that.globalData.session = 'emptysession';

                                typeof cb == "function" && cb(that.globalData.userInfo);
                                console.log(res);
                            }
                        });
                    },
                    fail: function (res) {
                        console.log(res);
                    }
                })
            }
        },
        globalData: {
               domain: "https://api.darkal.cn/xuetang",
             //domain: "http://127.0.0.1:8080/xuetang",
            session:null,
            userInfo: null
        },
        onShow: function () {
            try {
                this.updateSession();
            }catch (e){
                // console.log(e);
            }
            //console.log(wx.getStorageSync('session'));
        },
        updateSearchKeyword: function () {
            var that = this;
            wx.request({
                url: that.globalData.domain + '/Datas/keyword.json',
                data: {
                },
                success: function (res) {
                    wx.setStorage({
                        key:"searchKeyword",
                        data:{
                            data:res.data
                        }
                    });
                }
            });

        },
        onHide: function () {
            console.log('页面隐藏')

        },
        updateSession:function(){
            var that = this;
            wx.getStorage({
                key: 'session',
                success: function(res) {
                    var session = res.data.data;
                    if(res.data.data.length>100){
                        session = "";
                    }
                    that.globalData.session = session;
                    // if(new Date().getTime() > res.data.time + 86400000){
                        wx.request({
                            url: that.globalData.domain + '/my/checkSession',
                            data: {
                                session: session
                            },
                            success: function (res) {
                                if(res.data != true){
                                    console.log("强制刷新session");
                                    that.getUserInfo(null,true)
                                }
                            },
                            fail: function(){
                                console.log("强制刷新session");
                                that.getUserInfo(null,true)
                            }
                        });
                    // }
                },
                fail: function(){
                    that.getUserInfo(null,true)
                }
            });
            wx.getStorage({
                key: 'userInfo',
                success: function(res) {
                    that.globalData.userInfo = res.data.data;
                }
            });
        }
    },
);

var appInstance = getApp();
console.log(appInstance); // I am global data
