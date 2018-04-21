var WxParse = require('../../wxParse/wxParse.js');

var app = getApp();
Page({
    data: {
        loading: true,
        id: 0,
        content: "",//评论框的内容
        isLoading: true,//是否显示加载数据提示
        title: ''//页面标题
    },
    onLoad: function (options) {
        var that = this;
        wx.request({
            url: app.globalData.domain+"/Datas/content.json",
            data: {
                id: options.id,
                session: app.globalData.session
            },
            success: function (res) {
                that.data.title = res.data.title;
                that.data.id = options.id;
                WxParse.wxParse('article', 'html', res.data.content, that, 5);
                that.setData({
                    loading: false,
                    title: res.data.title,
                    author:res.data.author,
                    viewCount:res.data.viewCount
                });


                wx.setNavigationBarTitle({
                    title: res.data.title
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
            title: '【矿冶园】' + this.data.title,
            path: 'pages/content/content?id='+this.data.id,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
});