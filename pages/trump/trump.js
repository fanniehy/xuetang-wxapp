/*
* @Author: mark
* @Date:   2016-10-09 10:54:24
* @Last Modified by:   mark
* @Last Modified time: 2016-11-25 15:35:09
*/

// mgtv API 操作
import newData from '../../Datas/httputils.js';
var app = getApp();
Page({

    data:{
        title:'矿冶讲座',
        loading: false,
        loadtxt: '正在加载',
        bg: '',
        trumpArr: []
    },

    onLoad: function(params){

        let _this = this;
        let param = {
            API_URL: app.globalData.domain+"/Datas/live.json",
            data:{}
        };

        newData.result(param).then( data => {

            let datas = data.data.data;

            this.setData({
                trumpArr: data.data.data,
                bg : datas[0].picUrl
            })

        }).catch(e => {

            this.setData({
                loadtxt: '数据加载异常',
                loading: false
            })
            
        })

    },

    changeSwiper: function(e){

        let _this = this;
        let index = e.detail.current;

        this.setData({
            bg : _this.data.trumpArr[index].picUrl
        })
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '【矿冶园】矿冶讲座',
            path: 'pages/trump/trump',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }

})