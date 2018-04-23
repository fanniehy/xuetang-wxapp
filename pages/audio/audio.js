// pages/audio/audio.js
const innerAudioContext = wx.createInnerAudioContext()

var util = require("./../../utils/utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // newsAudioTitle:,
    newsInfo: [
      {
        name: 'ul',
        attrs: {
          class: 'newsUl'
        },
        children: [
          {
            name: "li",
            attrs: {
              class: "newsLi"
            },
            children: [{
              name: "p",
              attrs: {
                class: "newAudioInfoTitle"
              },
              children: [
                {
                  type: "text",
                  text: "rich-text 组件内屏蔽所有节点的事件,rich-text 组件内屏蔽所有节点的事件,rich-text 组件内屏蔽所有节点的事件。详情&gt;&gt;"
                }
              ]
            }]
          },
          {
            name: "li",
            attrs: {
              class: "newsLi"
            },
            children: [
              {
                name: "p",
                attrs: {
                  class: "newAudioInfoTitle"
                },
                children: [
                  {
                    type: "text",
                    text: "rich-text 组件内屏蔽所有节点的事件。详情&gt;&gt;"
                  }
                ]
              },
              {
                name: "img",
                attrs: {
                  class: "newAudioInfoImg",
                  src: "http://xuetang.cdn.darkal.cn//static/ueditor/jsp/upload/image/20180421/1524292930029054439.jpg?imageslim"
                },

              }
            ]
          },
          {
            name: "li",
            attrs: {
              class: "newsLi"
            },
            children: [
              {
                name: "p",
                attrs: {
                  class: "newAudioInfoTitle"
                },
                children: [
                  {
                    type: "text",
                    text: "rich-text 组件内屏蔽所有节点的事件,rich-text 组件内屏蔽所有节点的事件,rich-text 组件内屏蔽所有节点的事件,rich-text 组件内屏蔽所有节点的事件。详情&gt;&gt;"
                  }
                ]
              },
              {
                name: "img",
                attrs: {
                  class: "newAudioInfoImg",
                  src: "http://xuetang.cdn.darkal.cn//static/ueditor/jsp/upload/image/20180421/1524292930029054439.jpg?imageslim"
                },

              }
            ]
          },
        ]
      },

    ],
    newsAudio: [
      {
        name: 'div',
        attrs: {
          class: 'moreAudio',
        },
        children: [{
          type: 'text',
          text: '更多语言'
        }]
      },
      {
        name: "ul",
        attrs: {
          class: "audioLists"
        },
        children: [
          {
            name: "li",
            attrs: {
              class: ""
            },
            children: [
              {
                name: "p",
                attrs: {
                  class: "audioli"
                },
                children: [
                  {
                    type: "text",
                    text: "矿冶园每日早报"
                  }
                ]
              },
              {
                name: "span",
                attrs: {
                  class: "audioData"
                },
                children: [
                  {
                    type: "text",
                    text: "04-30"
                  }
                ]
              }
            ]
          },
          {
            name: "li",
            attrs: {
              class: "audioLists"
            },
            children: [
              {
                name: "p",
                attrs: {
                  class: "audioli"
                },
                children: [
                  {
                    type: "text",
                    text: "矿冶园每日早报"
                  }
                ]
              },
              {
                name: "span",
                attrs: {
                  class: "audioData"
                },
                children: [
                  {
                    type: "text",
                    text: "04-30"
                  }
                ]
              }
            ]
          },
          {
            name: "li",
            attrs: {
              class: "audioLists"
            },
            children: [
              {
                name: "p",
                attrs: {
                  class: "audioli"
                },
                children: [
                  {
                    type: "text",
                    text: "矿冶园每日早报"
                  }
                ]
              },
              {
                name: "span",
                attrs: {
                  class: "audioData"
                },
                children: [
                  {
                    type: "text",
                    text: "04-30"
                  }
                ]
              }
            ]
          },
        ]
      }
    ],
    topImg: "newsAudioPic.jpg",
    audioImg: "",
    audioTime: null,
    status: 'voice-play .png',
    precent: 0,
    duration: 0,
    voiceFlag: true,
    navigator_content: "矿冶院信息资源平台",
    navigator_num: 20,
    navigator_date: null,
    audioStartTime:"00:00",
    audioEndTime:""
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    innerAudioContext.src = wx.getStorageSync("audioStorage")
    innerAudioContext.seek(1)
    innerAudioContext.autoplay = true
    setTimeout(() => { innerAudioContext.pause()},100)
    this.setData({
      audioEndTime :this.getMinuteAndSeconds(wx.getStorageSync("audioEndTime"))
    })
    innerAudioContext.onTimeUpdate(() => {
      this.setData({
        audioStartTime: this.getMinuteAndSeconds(innerAudioContext.currentTime),
        precent: (innerAudioContext.currentTime / innerAudioContext.duration) * 100
      })
    })
    innerAudioContext.onEnded(()=>{
      this.setData({
        voiceFlag:true,
        precent:0,
        audioStartTime:0
      })
    })
    console.log("audioLoad")
  },
  getMinuteAndSeconds:function(time){ //进度条时间函数
    var total,m,s;
    var minute = Math.floor(time / 60)
    var seconds = parseInt(time % 60)
    if (minute == 0 && seconds == 0) {
      total = "00:00"
      return total
    }
    if (Math.floor(seconds) / 10 < 1) {
      s = "0" + seconds;
    }else{
      s = seconds
    }
    if (minute == 0) {
      m = "00"
    } else {
      if (Math.floor(minute) / 10 < 1) {
        m = "0" + minute
      } else {
        m = minute
      }
    }
    total = m +":"+ s    
    console.log(seconds)
    console.log(minute)
    console.log(total);
    return total
  },
  onReady: function () {
    // 语音 播放
    //小程序bug,获取时间会有延迟，默认autoplay先开启，再短时间关闭
    var time = util.formatTime(new Date()).nyr
    this.setData({
      navigator_date: time
    })
  },
  onUnload:function(){
    innerAudioContext.pause()
    wx.setStorageSync("remember", innerAudioContext.currentTime)
  },
  pause: function () {
    innerAudioContext.pause()
    this.setData({
      voiceFlag: true,
    })
  },
  start: function () {
    innerAudioContext.play()
    //加了定时器，能让onTimeUpdate起作用  由于获取duration 时候，会发生延迟
    
    setTimeout(() => {
      innerAudioContext.duration
    }, 20)
    this.setData({
      voiceFlag: false,
    })
  },
  changeProgress: function (e) {
    //用户可自行改变进度
    var changeWidth = e.detail.x - e.target.offsetLeft //获得点击之后的进度
    var totalWidth = 0;
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#progress').boundingClientRect()
    query.exec((res) => {
      //res就是 所有标签为mjltest的元素的信息 的数组
      totalWidth = res[0].width;

      this.setData({
        precent: (changeWidth / totalWidth) * 100,
      })
      innerAudioContext.seek((changeWidth * innerAudioContext.duration / totalWidth))
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("123")
  },

  /**
   * 生命周期函数--监听页面卸载
   */

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})