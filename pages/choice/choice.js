//index.js
//获取应用实例
import newData from '../../Datas/httputils.js';

var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    scrollId : 'red',
    isScrollX: true,
    activeBannerIndex : 0,
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
      // url: '../logs/logs'
    // })
  },
  bindChange : function(e){
      this.setData({activeBannerIndex : e.detail.current});
  },
  onLoad: function () {

      let param = {
          API_URL: app.globalData.domain+"/Datas/choice.json",
          // data:{
          //     'channelId':this.data.currentId,
          //     'type':'normal'
          // },
      };

      newData.result(param).then( data => {
        if(data.statusCode === 200) {
            this.setData({
                choiceList: data.data
            });
        }
      }).catch(e => {
          this.setData({
              loadtxt: '数据加载异常',
              loading: false
          });

          console.error(e);
      });


    // this.setData({'windowWidth' : 9999});
  },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '【矿冶园】精选课程',
            path: 'pages/choice/choice',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
})
 