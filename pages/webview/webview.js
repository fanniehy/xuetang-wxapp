/*
* @Author: mark
* @Date:   2016-10-09 10:54:24
* @Last Modified by:   mark
* @Last Modified time: 2016-11-25 15:35:09
*/

// mgtv API 操作
import newData from '../../Datas/httputils.js';
var app = getApp();


function urldecode(encodedString){
    var output = encodedString;
    var binVal, thisString;
    var myregexp = /(%[^%]{2})/;
    function utf8to16(str)
    {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = str.length;
        i = 0;
        while(i < len) {
            c = str.charCodeAt(i++);
            switch(c >> 4)
            {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                out += str.charAt(i-1);
                break;
                case 12: case 13:
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
                case 14:
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }
    while((match = myregexp.exec(output)) != null
    && match.length > 1
    && match[0] != '')
    {
        binVal = parseInt(match[1].substr(1),16);
        thisString = String.fromCharCode(binVal);
        output = output.replace(match[1], thisString);
    }

    //output = utf8to16(output);
    output = output.replace(/\\+/g, " ");
    output = utf8to16(output);
    return output;
}


Page({

    data:{
        src:'',
        loading: false,
        loadtxt: '正在加载',
        bg: '',
        trumpArr: []
    },

    onLoad: function(options){
      console.log(options.src)
        let _this = this;
        this.data.src = decodeURIComponent(options.src);
        this.setData({
                src:_this.data.src
        })
    }, 
    onShareAppMessage(options) {
      return {
        title: '矿冶园科技资源共享平台',
        path: 'pages/webview/webview?src=' + encodeURIComponent(options.webViewUrl),
        success: function (res) {
          // 转发成功
          console.log("123")
        },
        fail: function (res) {
          // 转发失败
        }
      }
      // console.log(options.webViewUrl)
    },

    goHome: function () {
      wx.switchTab({
        url: '/pages/index'
      })
    },

    changeSwiper: function(e){

        let _this = this;
        let index = e.detail.current;

        this.setData({
            bg : _this.data.trumpArr[index].picUrl
        })
    },function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '【矿冶园】矿冶讲座',
            path: 'pages/trump/trump',
            success: function(res) {
                // 转发成功
                console.log("123")
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }

})