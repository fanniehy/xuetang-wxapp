/*
* @Author: mark
* @Date:   2016-09-27 17:33:45
* @Last Modified by:   mark
* @Last Modified time: 2017-01-13 15:21:36
*/
// mgtv API 操作
import newData from '../Datas/httputils.js';
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
    status: 'play',
    precent: 0,
    duration: 0,
    voiceFlag: true,
    navigetor_content: "矿冶院信息资源平台",
    navigetor_from: "矿冶园",
    src: "http://fs.w.kugou.com/201804211457/8afdcbc9dc9401b143c8868cc561407c/G093/M01/0C/08/nQ0DAFiOyGiAJXFkADpFudDpIqU734.mp3",
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
    innerAudioContext.src = this.data.src
    innerAudioContext.autoplay = true
    setTimeout(function () { innerAudioContext.pause() }, 500) //小程序bug,获取时间会有延迟
    this.drawProgressbg();
    innerAudioContext.onTimeUpdate(() => {
      this.drawCircle(innerAudioContext.currentTime * 2 / innerAudioContext.duration)
      this.setData({
        precent: (innerAudioContext.currentTime / innerAudioContext.duration) * 100
      })
    })
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
      status: "play"
    })
  },
  start: function () {
    innerAudioContext.play();
    //加了定时器，能让onTimeUpdate起作用  由于获取duration 时候，会发生延迟
    console.log("123")
    setTimeout(() => {
      innerAudioContext.duration
    }, 10)
    this.setData({
      voiceFlag: false,
      status: "stop"
    })
    // innerAudioContext.onTimeUpdate(() => {
    //   this.drawCircle(innerAudioContext.currentTime * 2 / innerAudioContext.duration)
    //   console.log(innerAudioContext.duration)
    //   console.log(innerAudioContext.currentTime)
    //   this.setData({
    //     precent: (innerAudioContext.currentTime / innerAudioContext.duration) * 100
    //   })
    // })
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
      this.drawCircle((innerAudioContext.currentTime + 5) * 2 / innerAudioContext.duration)
    })
  },
  drawProgressbg: function () {
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(2);// 设置圆环的宽度
    ctx.setStrokeStyle('#20183b'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(40, 40, 30, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#5956CC");

    context.setLineWidth(4);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(40, 40, 30, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
});