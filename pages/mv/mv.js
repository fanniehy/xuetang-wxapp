var common = require('../../utils/utils.js');
var WxParse = require('../../wxParse/wxParse.js');
// var bsurl = require('../../../utils/bsurl.js');

var app = getApp();
var intervalId;
var commentIntervalId;

var startTime = 0;
var watchTime = 0;

Page({
    data: {
        live:false,
        lastStatus:0,
        content_en: '',
        content_cn: '',
        fontSize:false,
        words: [
          {
            "start": "0",
            "content_en": "",
            "content_cn": "",
            "ending": "1.4645"
          },
          {
            "start": "1.4645",
            "content_en": "miners work in dynamic and unpredictable conditions",
            "content_cn": "矿工在充满变数的和不可预知的条件下工作",
            "ending": "3.45524641"
          },
          {
            "start": "6.4645",
            "content_en": "they are exposed to health and safety hazards",
            "content_cn": "他们的健康和安全都暴露在危险之中",
            "ending": "9.24641"
          },
          {
            "start": "11.4864645",
            "content_en": "mining companies are constantly working to make this environment safe",
            "content_cn": "矿业公司一直在努力使矿工处于更加安全的工作环境之中",
            "ending": "15.2464541"
          },
          {
            "start": "17.844645",
            "content_en": "what if there is a smart and intelligent way to make the environment in mind safer",
            "content_cn": "试想一下，如果真的有一种智能的方法可以让环境更加安全",
            "ending": "23.24641"
          },
          {
            "start": "25.4645",
            "content_en": "meet Joel and Samuel",
            "content_cn": "这是乔尔和塞缪尔",
            "ending": "28.24641"
          },
          {
            "start": "30.4645",
            "content_en": "they are two miners who work",
            "content_cn": "他们是两名一起工作的矿工",
            "ending": "32.24641"
          },
          {
            "start": "35.4645",
            "content_en": "it's smart mine a technology advanced mining company",
            "content_cn": "他们在一家技术先进的矿业公司工作",
            "ending": "38.24641"
          },
          {
            "start": "41.4645",
            "content_en": "let's see how they plan to do this",
            "content_cn": "让我们看看他们打算怎么做",
            "ending": "45.24641"
          },
          {
            "start": "46.4645",
            "content_en": "Joel and Samuel start off by wearing their smart gear which is integrated with a wearable technology",
            "content_cn": "乔尔和塞缪尔开始穿上与可穿戴技术相结合的智能服装",
            "ending": "53.24641"
          },
          {
            "start": "56.4645",
            "content_en": "the jacket has an integrated smart sensor which monitors their vitals",
            "content_cn": "外套有一个集成的智能传感器，监测其生命体征",
            "ending": "60.24641"
          },

        ],
        likeCount:null,//点赞数量
        like:null,//点赞状态
        likeSrc:"zan",//点赞图片
        luckeyMoney:0,
        showModal: false,
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
      this.videoContext = wx.createVideoContext("mvideo")
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

        wx.request({
            url: app.globalData.domain + "/Datas/video.json",
            data: {
                id: options.id,
                session: app.globalData.session
            },
            success: function (res) {
                // wx.getNetworkType({
                //     complete: function (r) {

                that.main = res.data.data;
                console.log(res)
                that.setData({
                    id: options.id,
                    main: res.data.data,
                    commentCount: res.data.data.commentCount,
                    price: res.data.data.price,
                    start:res.data.data.start,
                    live:res.data.data.videoURL.indexOf('push') > 1,
                    tips:res.data.tips,
                    loading: false,
                    recid: res.data.data.commentThreadId,
                    title: res.data.data.name,
                    likeCount: res.data.data.likeCount,//点赞数量
                    like:res.data.like
                    
                });
                WxParse.wxParse('article', 'html', common.htmlDecodeByRegExp(res.data.data.content), that, 10);
                // }
                // });
                that.main.lastStatus = res.data.start;

                if(res.data.start === 0) {
                    intervalId = setInterval(that.loadVideo, 10000);
                }else{
                    intervalId = setInterval(that.loadVideo, 20000);
                }
                wx.setNavigationBarTitle({
                    title: res.data.data.name
                })
            }
        });
        
    },
    timeUpDate(e) {
      // e.detail.currentTime //获取当前播放时间
      var words = this.data.words
      var vedioIndex = this.getIndex(e.detail.currentTime) || 0;
      this.setData({
        content_en: words[vedioIndex].content_cn,
        content_cn: words[vedioIndex].content_en,
      })
    },
    fullScreenChange(e){
      this.setData({
        fontSize:!this.data.fontSize
      })
    },
    getIndex: function (currentTime) {
      var words = this.data.words
      for (let i = 1; i < words.length; i++) {
        if (currentTime > words[i].start && currentTime < words[i].ending) {
          return i;
        }
        if (currentTime > words[i].ending && currentTime < words[i + 1].start || currentTime < words[0].start || currentTime > words[words.length - 1].ending) {
          return 0;
        }
      }
    },
    loadVideoDelay: function () {
      setTimeout(this.loadVideo, 5000);
    },
    loadVideo: function () {
      return;
        var that = this;
        wx.request({
            url: app.globalData.domain + "/Datas/video.json",
            data: {
                id: this.data.videoId,
                type: "ajax",
                session: app.globalData.session
            },
            success: function (res) {
                if(res.data.start !== that.main.lastStatus) {
                    that.main = res.data.data;
                    that.main.lastStatus = res.data.start;
                    that.setData({
                        main: res.data.data,
                        commentCount: res.data.data.commentCount,
                        price: res.data.data.price,
                        start:res.data.start,
                        live:res.data.data.videoURL.indexOf('push') > 1,
                        loading: false,
                        tips:res.data.tips,
                        recid: res.data.data.commentThreadId
                    });
                    // clearInterval(intervalId);
                }
            }
        })
    },
    loadComment: function () {
        var that = this;
        wx.request({
            url: app.globalData.domain + "/Datas/comment.json",
            data: {
                id: that.data.videoId
            },
            success: function (res) {
                that.setData({
                    commentCount: res.data.length,
                    comments: res.data
                })
            }
        })
    },
    tab: function (e) {
        var t = e.currentTarget.dataset.tab;
        this.setData({
            tab: t
        });
        var that = this;
        if (this.data.tab == 1 && this.data.comments.length == 0) {
            this.loadComment();
            commentIntervalId = setInterval(this.loadComment, 10000);
        }
        if (this.data.tab == 2 && this.data.simi.code != 200) {
            that.setData({loading: true});
            wx.request({
                url: app.globalData.domain + "/Datas/video_bi.json",
                data: {id: that.data.id},
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
        startTime = (new Date()).valueOf();
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
        watchTime = watchTime + (new Date()).valueOf() - startTime;
        startTime = (new Date()).valueOf();
    },
    uploadLog:function () {
        watchTime = watchTime + (new Date()).valueOf() - startTime;

        var that = this;
        wx.request({
            url: app.globalData.domain + "/report/video",
            data: {
                videoId: that.data.videoId,
                session: app.globalData.session,
                watchTime: watchTime
            }
        })
    },
    goLike:function(e){
      var dataset = e.target.dataset;
      let v_id = dataset.videoId;
      let likeType = dataset.like;
      this.setData({
        like:likeType?0:1
      })
      if (likeType) {
        var reLike = this.data.likeCount - 1
        this.setData({
          likeCount: reLike
        })
      } else {
        var reLike = this.data.likeCount + 1
        this.setData({
          likeCount: reLike
        })
      }    
      wx.request({
          url: app.globalData.domain + "/video/like",
          data: {
            video_id: v_id,
            session: app.globalData.session,
            type: this.data.like,
          },
          success:(res)=>{
            //成功后回调
          }
        })
    },
    goHome: function () {
        wx.switchTab({
            url: '/pages/index'
        })
    },
    onUnload: function () {
        this.uploadLog();

            // 页面关闭
        clearInterval(commentIntervalId);
        clearInterval(intervalId);
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
    //文本域失去焦点时 事件处理
    inputChange: function (e) {
        //获取此时文本域值
        console.log(e.detail.value);
        this.setData({
            luckeyMoney: e.detail.value
        })

    },
    /**
     * 弹窗
     */
    showDialogBtn: function() {
        this.setData({
            showModal: true
        })
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {
    },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        this.hideModal();
    },
    formSubmit: function (e) {
      wx.request({
        url: app.globalData.domain + '/my/subscribe',
        data: {
          session: app.globalData.session,
          cid: e.detail.target.dataset.cid,
          formId: e.detail.formId
        },
        success: function (res) {
          console.log(res);
        }
      });
      wx.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      });
    },
    formReset: function () {
      console.log('form发生了reset事件')
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        this.hideModal();

        if(app.globalData.session && app.globalData.userInfo){
            this.sendHongBaoRequest();
        }else{
            app.getUserInfo(this.sendHongBaoRequest);
        }
    },
    sendHongBaoRequest:function(){
        var that = this, conArr = [];;
        wx.request({
            url: app.globalData.domain+'/pay/createLuckyMoneyOrder',
            data: {
                fee:that.data.luckeyMoney,
                videoId: that.data.videoId,
                session: app.globalData.session
            },
            success: function (res) {
                console.log("获取支付密匙", res);

                wx.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: "prepay_id=" + res.data.packageId,
                    signType: 'MD5',
                    paySign: res.data.paySign,
                    success: function (res) {
                        conArr.push({
                            avatar: app.globalData.userInfo.avatarUrl,
                            uName: app.globalData.userInfo.nickName,
                            money:true,
                            top: false,
                            time: common.formatTime(new Date()),
                            content: app.globalData.userInfo.nickName + " 赞赏了 ¥"+that.data.luckeyMoney,
                        });
                        that.setData({
                            comments: conArr.concat(that.data.comments),
                            commentCount: ++that.main.commentCount
                        });
                        wx.showToast({
                            title: '感谢您的支持',
                            icon: 'success'
                        });
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
    //发送评论评论 事件处理
    send: function () {
        var that = this, conArr = [];
        //此处延迟的原因是 在点发送时 先执行失去文本焦点 再执行的send 事件 此时获取数据不正确 故手动延迟100毫秒
        setTimeout(function () {
            app.getUserInfo(function (userInfo) {
                if (that.data.content.trim().length > 0) {
                    conArr.push({
                        avatar: userInfo.avatarUrl,
                        uName: userInfo.nickName,
                        time: common.formatTime(new Date()),
                        top:false,
                        content: that.data.content
                    });

                    wx.request({
                        url: app.globalData.domain + '/Datas/createComment',
                        data: {
                            avatar: userInfo.avatarUrl,
                            uName: userInfo.nickName,
                            videoId:that.data.videoId,
                            content: that.data.content
                        },
                        success: function (res) {
                            console.log(res);
                        }
                    });
                    that.main.commentCount = that.data.comments.length;
                    that.setData({
                        comments: conArr.concat(that.data.comments),
                        commentCount: ++that.main.commentCount,
                        content: "我要评论",//清空文本域值
                        isShow: false,
                        cfBg: false
                    });


                } else {
                    that.setData({
                        content: ""//清空文本域值
                    })
                }
            })
        }, 100)
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }

        return {
            title: this.data.main.name,
            path: this.data.main.price>0?'pages/buy/buy?id='+this.data.videoId:'pages/mv/mv?id='+this.data.videoId,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
});