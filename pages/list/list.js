/*
* @Author: mark
* @Date:   2016-09-27 17:33:45
* @Last Modified by:   mark
* @Last Modified time: 2017-01-13 15:21:36
*/
// mgtv API 操作
import newData from '../../Datas/httputils.js';

var app = getApp();
//创建精选页面对象
Page({

    data: {
        title:"【矿冶园】",
        type:'',
        cateId:0,
        loading: false,
        loadtxt: '正在加载',
        newList: []
    },

    isEmptyObject: function(e){ //判断Object对象是否为空

        let t;  

        for (t in e)  
            return !1;  
        return !0 

    },

    onPullDownRefresh() {
        console.log('--------下拉刷新-------')
        this.loadContent();
    },

    onLoad: function (params) {
        this.data.type = params.type;
        this.data.cateId = params.id;
        this.loadContent();
    },
    loadContent:function (){
        wx.showNavigationBarLoading();
        let _this = this;
        var url = app.globalData.domain;

        if(this.data.type === "list" && this.data.cateId){
            url = url + "/Datas/list.json?cateId=" + this.data.cateId;
        }else{
            url = url + "/my/" + this.data.type;
        }

        let param = {
            API_URL: url,
            data:{
                'session':app.globalData.session
            },
        };

        newData.result(param).then(data => {
            let datas = data.data.data,
                bannerData = [],
                lists = [],
                obj = {};
            for (let i = 0; i < datas.length; i++) {
                if (datas[i].type == 'banner') {
                    bannerData = datas[i].templateData;
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
                            obj.name2 = datas[i + 1].templateData[0].name;
                            obj.bigPic = datas[i + 1].templateData[0].picUrl;
                        } else {
                            obj.title = datas[i].templateData[0].name;
                            obj.type = 'small';
                        }

                        _this.data.title = datas[i].templateData[0].name;

                        wx.setNavigationBarTitle({
                            title: datas[i].templateData[0].name
                        });

                        obj.more = datas[i].templateData[0]['jumpChannel'] ? true : false;
                        obj.list = [];

                    }

                    if (datas[i].type == 'textMoreLink') {
                        obj.links = datas[i].templateData[0].name;
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
                newList: Object.assign([], lists)
            });

            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();

            console.log(this.data.newList)
        }).catch(e => {

            this.setData({
                loadtxt: '数据加载异常',
                loading: true
            })

            console.error(e);
        });
    }, 
    goHome: function () {
      wx.switchTab({
        url: '/pages/index'
      })
    },
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      } 
      return {
        title: '【矿冶园】'+this.data.title,
        
        path: 'pages/list/list?type=list&id=' + this.data.cateId,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },

    handleTap: function(e){

        console.log(e);
        let id = e.currentTarget.id;

        if(id){
            this.setData({ currentId: id })
            this.onLoad();
        }

    }
});



// newData.result().then( data => {
//     console.log(data);
// }).catch(e => {
//     console.error(e);
// });