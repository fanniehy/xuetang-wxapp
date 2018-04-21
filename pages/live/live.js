import newData from '../../Datas/httputils.js';

var app = getApp();
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};

Page({
    data:{
        input_key:"",
        hasKey:false,
        focus:true,
        show:true,
        loading: false,
        loadtxt: '正在加载',
        result:0,
        value: ''
    },

    onLoad: function(params){
        this.search();

    },

    onSearchClear: function(e){
        this.setData({
            hasKey:false,
            value:""
        })
    },

    onFocus: function(e){
        this.data.show = true;
        if(this.data.value.length>0){
            this.setData({
                hasKey:true,
                show:true,
                value:this.data.value,
                recentSearch:this.data.recentSearch
            })
        }else{
            this.setData({
                hasKey:false,
                show:true,
                recentSearch:this.data.recentSearch
            })
        }
    },

    onBlue: function(){
    },
    formSubmit: function(e) {
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
        setTimeout(function(){
            wx.navigateTo({
              url: e.detail.target.dataset.url
            })
        },500);
    },
    formReset: function() {
        console.log('form发生了reset事件')
    },

    onSearchInput(e) {
        if(e.detail.value.length>0){
            this.data.hasKey = true;
            this.setData({
                hasKey: true
            })
        }
        else{
            this.data.hasKey = false;
            this.setData({
                hasKey: false
            })
        }
        this.data.input_key = e.detail.value;
    },

    onSearchConfirm(e) {
        this.search(this.data.input_key);
    },

    onSearchCancel(){
        if(this.data.result == 0){
            console.log("back");
            wx.navigateBack({});
        }else{
            this.setData({
                show:false,
                value:""
            })
        }
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
    search: function(){
        let _this = this;
        let param = {
            API_URL: app.globalData.domain+"/Datas/livelist.json",
            data:{
                session: app.globalData.session
            },
        };

        newData.result(param).then( data => {
            let lists1 = [];
            let lists2 = [];
            let lists3 = [];
            let unstartList = [];
            for (let i in data.data.data){
                if(data.data.data[i].type=="before") {
                    lists1=data.data.data[i].templateData;
                }
                if(data.data.data[i].type=="living") {
                    lists2=data.data.data[i].templateData;
                }
                if(data.data.data[i].type=="finished") {
                    lists3=data.data.data[i].templateData;
                }
            }

            for (let i = 0; i < lists1.length; i++) {
                let obj = {};
                obj.rankArr = [];
                obj.title = lists1[i].name;
                obj.image = lists1[i].picUrl;
                obj.desc = lists1[i].desc;
                obj.author = lists1[i].author;
                obj.viewCount = lists1[i].viewCount;
                obj.webUrl = lists1[i].webUrl;
                obj.cid = lists1[i].cid;
                obj.buttonText = lists1[i].buttonText;
                unstartList.push(obj);
            }

            let liveList = [];

            for (let i = 0; i < lists2.length; i++) {
                let obj = {};
                obj.rankArr = [];
                obj.title = lists2[i].name;
                obj.image = lists2[i].picUrl;
                obj.desc = lists3[i].desc;
                obj.author = lists2[i].author;
                obj.viewCount = lists2[i].viewCount;
                obj.webUrl = lists2[i].webUrl;
                obj.cid = lists2[i].cid;
                obj.buttonText = lists2[i].buttonText;
                liveList.push(obj);
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
                unstart: unstartList.length>0?unstartList:null,
                live: liveList.length>0?liveList:null,
                after: afterList.length>0?afterList:null
            })


        }).catch(e => {
            this.setData({
                loadtxt: '数据加载异常',
                loading: false
            });
            console.error(e);
        });
    }
});