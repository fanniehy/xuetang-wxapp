var app = getApp();
Page({
    formSubmit: function(e) {

        wx.request({
            url: app.globalData.domain + '/my/report',
            data: {
                session: app.globalData.session,
                name: e.detail.value.name,
                tel: e.detail.value.tel,
                text: e.detail.value.text,
                formId: e.detail.formId,
                score:e.detail.value.score
            },
            success: function (res) {
                console.log(res);
            }
        });
        wx.showToast({
            title: '感谢您的支持!',
            icon: 'success',
            duration: 2000
        });
        setTimeout(function(){
            wx.navigateBack({})
        },1500)
    },
    formReset: function() {
        console.log('form发生了reset事件')
    }
})