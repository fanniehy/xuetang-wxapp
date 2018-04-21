// pages/my/my.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
      var that = this;
    // 页面初始化 options为页面跳转所带来的参数
      app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
              userInfo:userInfo
          })
      })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
      this.setData({
          size: "3KB"
      });
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
    vip:function(){
        wx.showModal({
            title: '提示',
            content: 'VIP功能即将上线，敬请期待',
            showCancel:false
        });
    },
    clear:function(){
        wx.clearStorage();
        this.setData({
            size: "0KB"
        });
        wx.showToast({
            title: '清理成功',
            icon:'success'
        });
    },
    onHide:function(){
        // 页面隐藏
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '【矿冶园】矿冶园科技资源共享平台',
        path: 'pages/index',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },
    
  onUnload:function(){
    // 页面关闭
  },
    gotoHistory: function () {
        wx.navigateTo({
            url: '/pages/list/list?type=history'
        })
    },
    report: function () {
        wx.navigateTo({
            url: '/pages/report/report'
        })
    },
    gotoBuy: function () {
        wx.navigateTo({
            url: '/pages/list/list?type=buy'
        })
    }
})