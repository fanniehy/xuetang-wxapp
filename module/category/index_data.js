/**
 * 分类页接口api
 * @author gongjuan
 * @version v2017/3/13
 * @description 封装分类页所需的接口
 */
function Callback(success, fail) {
    this.success = success;
    this.fail = fail;
}

/**
 * 获取所有的分类数据
 * @param  {[type]}   mpjId    mpjId 关键词系统id，购物大入口微信是117，手Q是236。如需新建请去关键词系统重新生成 
 * @param  {Function} callback 有两个参数，错误信息和分类数据
 * @param  {[type]}   options  timeout 超时处理时间，单位为ms
 * @return {[type]}            [description]
 */
function getAllCategory(mpjId, callback, options = {}){
   if(!mpjId){
   		callback && callback('参数值mpjId无效', []);
   		return;
   }

//    let cacheKey = `jd_mpjsp_${mpjId}`,
//    let cacheKey = `jd_mpjsmp_${mpjId}`,
//    	   cacheData = jd_storage_api.getStorage(cacheKey, {});
//    if(cacheData){
//       var cacheDataTime = cacheData.time,
//           cacheDataData = cacheData.data;
//       if(cacheDataData && cacheDataData.length && Date.now() - cacheDataTime <= 12 * 60 * 60 * 1000){ // 12个小时以内
//           callback && callback(null, cacheDataData);
//           return;
//       }
//     }

    let reqUrl = `https://api.darkal.cn/Datas/cate.json`;


    wx.request({
        url: reqUrl,
        data: {

        },
        success: function (res) {
            if((!res || res.data.errCode != 0 || !res.data.keywordAreas || !res.data.keywordAreas.length)){
                callback && callback('请求超时，请稍后重试吧', []); // 未返回有效数据
                return;
            }
            let resultData = res.data.keywordAreas;
            // jd_storage_api.putStorage(cacheKey, {data: resultData, time: Date.now()});
            callback && callback(null, resultData);
        }
    })
}

module.exports = {
    getAllCategory: getAllCategory
}