/*
* @Author: mark
* @Date:   2016-09-27 17:33:45
* @Last Modified by:   mark
* @Last Modified time: 2017-01-13 15:21:36
*/
// mgtv API 操作
import newData from '../Datas/httputils.js'
const util = require("./../utils/utils.js")
const innerAudioContext = wx.createInnerAudioContext()

var app = getApp();
//创建精选页面对象
Page({
  data: {
    loading: false,
    loadtxt: '正在加载',
    currentId: 'tab1',
    banners: [],
    RollLink: [],
    AvatorText: [],
    newList: [],
    section: [
      { name: '精选', id: 'tab1' }, { name: '第一堂专业课', id: '1032' },
      { name: '进阶课程', id: '1003' }, { name: '行业会议', id: '1004' },
      { name: '学术沙龙', id: '1005' }, { name: '前沿讲座', id: '1021' }
    ],
    audioImg:"newsAudioPic.jpg",
    audioTime:null,
    precent: 0,
    duration: 0,
    voiceFlag: true,
    navigetor_content: "矿冶院信息资源平台",
    navigetor_from: "矿冶园",
    src: "http://fs.w.kugou.com/201804231242/e1ccfc5475242e72c243aab952740605/G034/M00/0C/11/ApQEAFWcEu2AGDtXADwoxwa9Y34111.mp3",
  },

  isEmptyObject: function (e) { //判断Object对象是否为空
    let t;
    for (t in e)
      return !1;
    return !0
  },
  onPullDownRefresh() {
    console.log('--------下拉刷新-------')
    this.onLoad();
  },
  liveTap: function (e) {
    console.log('--------123-------', e);
  },
  onReady: function () {

    // 语音 播放
    innerAudioContext.src = this.data.src
    innerAudioContext.autoplay = true
    setTimeout( ()=> { 
      innerAudioContext.pause() 
    wx.setStorageSync("audioEndTime", innerAudioContext.duration)
    wx.setStorageSync("audioStorage", this.data.src)    

      }, 500) 
    //小程序bug,获取时间会有延迟，默认autoplay先开启，再短时间关闭
    var time = util.formatTime(new Date()).ymd;
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      audioTime: time
    }); 
  },
  onLoad: function () {
    wx.showNavigationBarLoading();
    let _this = this;
    let param = {
      API_URL: app.globalData.domain + "/Datas/" + this.data.currentId + '.json', //替换自己的本地服务器地址
      data: {
        'version': 3
      },
    };
    newData.result(param).then(data => {
      // console.log(data)
      // this.setData({ //设置早报图片
      //   audioImg: ""
      // })
      let datas = data.data.data,
        bannerData = [],
        livingData = [],
        AvatorData = [],
        RollData = [],
        lists = [],
        obj = {};
      for (let i = 0; i < datas.length; i++) {
        if (datas[i].type == 'banner') {
          bannerData = datas[i].templateData;
        }

        if (datas[i].type == 'roundAvatorText') {
          AvatorData = datas[i].templateData;
        }

        if (datas[i].type == 'textRollLink') {
          RollData = datas[i].templateData;
        }

        if (datas[i].type == 'living') {
          livingData = datas[i].templateData;
        }

        if (datas[i].type == 'title' ||
          datas[i].type == 'normalLandScape' ||
          datas[i].type == 'largeLandScapeNodesc' ||
          datas[i].type == 'textMoreLink' ||
          datas[i].type == 'normalLandScapeNodesc' &&
          datas[i].templateData.length) {

          if (datas[i].type == 'title') {
            if (!_this.isEmptyObject(obj)) {
              lists.push(obj);
              obj = {};
              obj.indexs = i;
            }

            if (datas[i + 1] && datas[i + 1].type == 'largeLandScapeNodesc') {
              obj.type = 'big';
              obj.name1 = datas[i].templateData[0].name;
              obj.videoId = datas[i + 1].templateData[0].videoId;
              obj.webUrl = datas[i + 1].templateData[0].webUrl;
              obj.name2 = datas[i + 1].templateData[0].name;
              obj.bigPic = datas[i + 1].templateData[0].picUrl;
            } else {
              obj.title = datas[i].templateData[0].name;
              obj.type = 'small';
            }

            obj.more = datas[i].templateData[0]['jumpChannel'] ? true : false;
            obj.list = [];
          }

          if (datas[i].type == 'textMoreLink') {
            obj.links = datas[i].templateData[0].name;
            obj.webUrl = datas[i].templateData[0].webUrl;
          }

          if (datas[i].type == 'normalLandScape' ||
            datas[i].type == 'normalLandScapeNodesc') {
            obj.list = obj.list.concat(datas[i].templateData);
          }

        }
        if (i == datas.length - 1) {
          lists.push(obj);
        }
      }

      this.setData({
        loading: true,
        loadtxt: '来了来了',
        banners: bannerData,
        live: livingData.length > 0 ? livingData : null,
        RollLink: RollData,
        AvatorText: AvatorData,
        newList: Object.assign([], lists)
      })

      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();

      // app.updateSession();

      // console.log(this.data.newList)
    }).catch(e => {
      this.setData({
        loadtxt: '数据加载异常',
        loading: true
      })
      console.error(e);
    });
    this.initProf();
  },
  audioTo:function(){
    this.start()
    setTimeout(()=>{this.pause()},10)
    wx.navigateTo({
      url: 'audio/audio',
    })
  },
  handleTap: function (e) {

    console.log(e);
    let id = e.currentTarget.id;

    if (id) {
      this.setData({ currentId: id })
      this.onLoad();
    }

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
      }
    });
    wx.showToast({
      title: '预约成功',
      icon: 'success',
      duration: 2000
    });
    // debugger;

    setTimeout(function () {
      wx.navigateTo({
        url: e.detail.target.dataset.url
      })
    }, 500);

  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '矿冶园科技资源共享平台',
      path: 'pages/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  initProf: function () {
    let _this = this;
    let param = {
      API_URL: app.globalData.domain + "/Datas/prof.json",
      data: {
        session: app.globalData.session
      },
    };

    newData.result(param).then(data => {
      let lists1 = [];
      let lists2 = [];
      let lists3 = [];
      let unstartList = [];
      for (let i in data.data.data) {
        if (data.data.data[i].type == "finished") {
          lists3 = data.data.data[i].templateData;
        }
      }

      let afterList = [];

      for (let i = 0; i < lists3.length; i++) {
        let obj = {};
        obj.rankArr = [];
        obj.title = lists3[i].name;
        obj.image = lists3[i].picUrl;
        obj.desc = lists3[i].desc;
        obj.author = lists3[i].author;
        obj.viewCount = lists3[i].viewCount;
        obj.webUrl = lists3[i].webUrl;
        obj.cid = lists3[i].cid;
        obj.buttonText = lists3[i].buttonText;
        afterList.push(obj);
      }


      _this.data.result = unstartList.length;

      this.setData({
        loading: true,
        prof: afterList.length > 0 ? afterList : null
      })


    }).catch(e => {
      this.setData({
        loadtxt: '数据加载异常',
        loading: false
      });
      console.error(e);
    });
  },
  pause: function () {
    innerAudioContext.pause()
    this.setData({
      voiceFlag: true,
    })
  },
  start: function () {
    innerAudioContext.play();
    //加了定时器，能让onTimeUpdate起作用  由于获取duration 时候，会发生延迟
    console.log("123")
    setTimeout(() => {
      innerAudioContext.duration
    }, 10)
    wx.setStorageSync("audioEndTime", innerAudioContext.duration)
    this.setData({
      voiceFlag: false,
    })
  },
  onHide:function(){
    this.pause() //切换页面后，早报停止
  }
});