var common = require('../../utils/utils.js');
var WxParse = require('../../wxParse/wxParse.js');
// var bsurl = require('../../../utils/bsurl.js');

var app = getApp();
Page({


    data: {
        isPay:false,
        videoId:0,
        main: {},
        tab: 0,
        src: "",
        rec: {},
        loading: true,
        offset: 0,
        limit: 20,
        recid: 0,
        loading2: true,
        simi: {},
        id: "",
        isShow: false,//控制emoji表情是否显示
        isLoad: true,//解决初试加载时emoji动画执行一次
        content: "",//评论框的内容
        isLoading: true,//是否显示加载数据提示
        disabled: true,
        cfBg: false,
        _index: 0,
        comments: [],
        emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
        //0x1f---
        emoji: [
            "60a", "60b", "60c", "60d", "60f",
            "61b", "61d", "61e", "61f",
            "62a", "62c", "62e",
            "602", "603", "605", "606", "608",
            "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
            "63a", "63b", "63c", "63d", "63e", "63f",
            "64a", "64b", "64f", "681",
            "68a", "68b", "68c",
            "344", "345", "346", "347", "348", "349", "351", "352", "353",
            "414", "415", "416",
            "466", "467", "468", "469", "470", "471", "472", "473",
            "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
        ],
        emojis: [],//qq、微信原始表情
        alipayEmoji: [],//支付宝表情
        title: ''//页面标题
    },
    onLoad: function (options) {
        this.data.videoId = options.id;
        var that = this;

        var em = {}, emChar = that.data.emojiChar.split("-");
        var emojis = [];
        that.data.emoji.forEach(function (v, i) {
            em = {
                char: emChar[i],
                emoji: "0x1f" + v
            };
            emojis.push(em)
        });
        that.setData({
            emojis: emojis
        });

        if(app.globalData.session && app.globalData.userInfo){
            this.getDetail();
        }else{
            app.getUserInfo(this.getDetail);
        }
    },
    tab: function (e) {
    var t = e.currentTarget.dataset.tab;
    this.setData({
        tab: t
    });
    var that = this;
    if (this.data.tab == 1 && this.data.comments.length == 0) {
        wx.request({
            url: app.globalData.domain+"/Datas/comment.json",
            data: {
                id: that.data.videoId
            },
            success: function (res) {
                that.setData({
                    comments : that.data.comments.concat(res.data)
                })
            }
        })
    }
    if (this.data.tab == 2 && this.data.simi.code != 200) {
        that.setData({loading: true});
        wx.request({
            url: app.globalData.domain+"/Datas/video_bi.json",
        data: { id: that.data.id },
        success: function (res) {
          that.setData({
            loading: false,
            simi: res.data
          });
        }
      })
    }
  },
    onReady: function () {
        // 页面渲染完成
        //设置当前标题
        wx.setNavigationBarTitle({
            title: this.data.title
        })
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    //上拉加载
    onReachBottom: function () {
        console.log("分页待实现");
    },
    //解决滑动穿透问题
    emojiScroll: function (e) {
        console.log(e)
    },
    //文本域失去焦点时 事件处理
    textAreaBlur: function (e) {
        //获取此时文本域值
        console.log(e.detail.value)
        this.setData({
            content: e.detail.value
        })

    },
    //文本域获得焦点事件处理
    textAreaFocus: function () {
        this.setData({
            isShow: false,
            cfBg: false
        })
    },
    //点击表情显示隐藏表情盒子
    emojiShowHide: function () {
        this.setData({
            isShow: !this.data.isShow,
            isLoad: false,
            cfBg: !this.data.false
        })
    },
    //表情选择
    emojiChoose: function (e) {
        //当前输入内容和表情合并
        this.setData({
            content: this.data.content + e.currentTarget.dataset.emoji
        })
    },
    //点击emoji背景遮罩隐藏emoji盒子
    cemojiCfBg: function () {
        this.setData({
            isShow: false,
            cfBg: false
        })
    },
    //发送评论评论 事件处理
    pay: function (event) {
        var that = this;
        if(this.data.isPay){
            wx.navigateTo({
                url: '/pages/mv/mv?id='+event.currentTarget.dataset.videoId
            });
            return;
        }

        console.log(event.currentTarget.dataset.videoId);
        wx.request({
            url: app.globalData.domain+'/pay/createOrder',
            data: {
                videoId: event.currentTarget.dataset.videoId,
                session: app.globalData.session
            },
            success: function (res) {
                console.log("获取支付密匙", res);

                if(!res.data.paySign){
                    wx.showModal({
                        title: '提示',
                        content: '正在登陆，请稍后',
                        showCancel:false
                    });
                    app.getUserInfo(that.getDetail(),true);
                    return;
                }

                wx.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: "prepay_id=" + res.data.packageId,
                    signType: 'MD5',
                    paySign: res.data.paySign,
                    success: function (res) {
                        wx.showToast({
                            title: '支付成功',
                            icon: 'success'
                        });
                        wx.navigateTo({
                            url: '/pages/mv/mv?id='+event.currentTarget.dataset.videoId
                        })
                    },
                    fail: function (res) {
                        console.log(res);
                        wx.showToast({
                            title: '支付失败',
                            icon: 'fail'
                        });
                    },
                    complete: function () {
                        // that.setData({ selected: 0 });//取消选中
                    }
                });
            },
            fail: function (res) {
                //弹出对话框提示支付失败信息
                wx.showToast({
                    title: '网络连接错误，请稍后再试',
                    icon: 'fail'
                });
            }
        });
    },
    getDetail:function () {
        var that = this;
        wx.request({
            url: app.globalData.domain+"/Datas/video.json",
            data: {
                id: this.data.videoId,
                session:app.globalData.session
            },
            success: function (res) {
                wx.getNetworkType({
                    complete: function (r) {
                        that.data.main = res.data.data;
                        that.data.isPay = res.data.pay;
                        var wifi = r.networkType != 'wifi' ? false : true;
                        that.setData({
                            id: that.data.videoId,
                            main: res.data.data,
                            tips: res.data.pay?"您已购买该课程，点击观看":"购买课程：¥"+ res.data.data.price,
                            commentCount:res.data.data.commentCount,
                            wifi: wifi,
                            loading: false,
                            recid: res.data.data.commentThreadId
                        });
                        WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
                    }
                });

                wx.setNavigationBarTitle({
                    title: res.data.data.name
                })
            }
        })
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '【矿冶园】' + this.data.main.name,
            path: 'pages/buy/buy?id='+this.data.videoId,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
});