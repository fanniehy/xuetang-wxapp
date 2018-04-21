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
        ranking:[],
        searchBar: {},
        recentSearch: ["矿冶园"],
        hotSearch: ["环保","安全","石墨烯"],
        smartBox: {},
        loading: false,
        loadtxt: '正在加载',
        result:0,
        value: ''
    },

    onLoad: function(params){
        var that = this;
        wx.getStorage({
            key: 'searchHistory',
            success: function (res) {
                that.data.recentSearch = res.data.data;
                that.setData({
                    recentSearch:that.data.recentSearch
                })
            }
        });

        wx.getStorage({
            key: 'searchKeyword',
            success: function (res) {
                that.data.hotSearch = res.data.data;
                that.setData({
                    hotSearch:that.data.hotSearch
                })
            }
        });

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

    search: function(key){
        var keyword ;
        if(key.type === "tap"){
            keyword = key.target.dataset.key;
        }else if(key.value){
            keyword = key.value;
        }else{
            keyword = key;
        }

        if(keyword.length==0){
            return;
        }

        this.data.value=keyword;
        this.data.recentSearch.removeByValue(keyword);
        this.data.recentSearch.unshift(keyword);

        wx.setStorage({
            key:"searchHistory",
            data:{
                data:this.data.recentSearch
            }
        });

        this.setData({
            hasKey:false,
            value:keyword,
            show:false,
        });

        let _this = this;
        let param = {
            API_URL: app.globalData.domain+"/Datas/search.json",
            data:{
                keyword:keyword,
                session: app.globalData.session
            },
        };

        newData.result(param).then( data => {
            let datas = data.data.data[0].templateData;
            let lists = [];
            let newList = [];
            for (let i in datas){
                lists.push(datas[i])
            }

            console.log(lists);

            for (let i = 0; i < lists.length - 1; i++) {
                let obj = {};
                obj.rankArr = [];
                obj.title = lists[i].name;
                obj.image = lists[i].picUrl;
                obj.author = lists[i].author;
                obj.viewCount = lists[i].viewCount;
                obj.webUrl = lists[i].webUrl;
                newList.push(obj);
            }

            _this.data.result = newList.length;

            this.setData({
                loading: true,
                ranking: Object.assign([], newList)

            })

        }).catch(e => {
            this.setData({
                loadtxt: '数据加载异常',
                loading: false
            });
            console.error(e);
        });


    }
})