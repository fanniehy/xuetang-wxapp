/**
 * 前端的一些公用方法封装
 */

let webpSupport; //是否支持webp

/**
 * 为图片路径添加域名，及设置宽高
 *
 * @author HuiminLiu
 */
function getImg(url, width, height = width) {
    if (!url)
        return ''

	//去除链接中空白字符
	url = url.replace(/\s+/g, '')

	//加协议头
	if (url.indexOf('//') === 0)
		url = 'http:' + url

	//拼接域名和业务名
	if (!/^http/i.test(url))
		url = 'http://img10.360buyimg.com/img/' + url

	//是否JFS 图片
	let isJfsImg = /jfs\//.test(url)

	//非JFS 或CDN 图片不处理
	if (!isJfsImg || !/(m|img\d{2})\.360buyimg\.com/.test(url) || !/\.(jpg|jpeg|png|webp)/.test(url))
		return url

	//设定宽高
	if (width)
		url = url.replace(/(\/)(?:s\d+x\d+_)?(jfs\/)/, '$1s' + width + 'x' + height + '_$2')

	//从本地存储读取webp 的支持情况
	if (typeof webpSupport == 'undefined') {
		webpSupport = getApp().webpSupport
	} else if (webpSupport && /\.(jpg|jpeg|png)/.test(url) && !/\.webp/.test(url)) {
		url += '.webp'
	}

	//质量压缩
	if (/\.(jpg|jpeg)/.test(url)) {
		let level = { 'wifi': 80, '4g': 60, '3g': 40, '2g': 20 }[getApp().networkType]
		if (level)
			url = url.replace(/(\.(jpg|jpeg))(!q\d{1,2})?/, '$1!q' + level)
	}

	//分散域名
	let pool = [10,11,12,13,14,20,30] //域名池
	let idx = (parseInt(url.substr(url.lastIndexOf('/') + 1, 8), 36) || 0) % pool.length
	url = url.replace(/(\/\/img)\d{1,2}(\.360buyimg\.com)/, '$1' + pool[idx] + '$2')

	return url
}

/**
 * 将 object 转换成 querystring
 * @author Secbone
 *
 * @param obj [Object]
 * @return [String]
 */
function querystring(obj) {
	let item_arr = [];

	for(let key in obj) {
        if (typeof obj[key] == 'undefined') continue;

		if(typeof obj[key] === "string") {
			obj[key] = obj[key].replace(/%/g, "%25");
			obj[key] = obj[key].replace(/&/g, "%26");
			obj[key] = obj[key].replace(/\?/g, "%3F");
			obj[key] = obj[key].replace(/\=/g, "%3D");
		}

		item_arr.push(`${key}=${obj[key]}`);
	}

	return item_arr.join("&");
}

/**
 * 节流函数
 * @author Secbone
 *
 * @param fn [Function] 需要被节流的函数
 * @param wait [Number] 时间，毫秒
 * @return [Function]
 */
function throttle(fn, wait) {
    let last = new Date();

    return function() {
        let now = new Date();

        if(now - last < wait) return;

        last = now;
        return fn.apply(this, arguments);
    }
}

/**
 * 防反跳
 * @author Secbone
 *
 * @param fn [Function] 需要防反跳的函数
 * @param wait [Number] 时间，毫秒
 * @return [Function]
 */
function debounce(fn, wait) {
    let timeout = null;

    return function() {
        let args = arguments;

        if(timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            fn.apply(this, args);
        }, wait);
    }
}

/**
 * 页面参数解码，兼容带% 非法字符的情况
 *
 * @param  {String} s 需要被解码的字符串
 * @return {String}   解码结果
 */
function decode(s) {
    try {
        return decodeURIComponent(s)
    } catch(e) {
        return s
    }
}

/**
 * 校验手机
 */
function isMobile(v, isModify) {
    // 中国移动号段 1340-1348 135 136 137 138 139 150 151 152 157 158 159 187 188 147 182
    // 中国联通号段 130 131 132 155 156 185 186 145
    // 中国电信号段 133,153,180,181,189,177,173,170
    var cm = "134,135,136,137,138,139,150,151,152,157,158,159,187,188,147,182,183,184,178",
        cu = "130,131,132,155,156,185,186,145,176",
        ct = "133,153,180,181,189,177,173,170",
        v = v || "",
		originVal = v,
        h1 = v.substring(0, 3),
        h2 = v.substring(0, 4);
    v = (/^1\d{10}$/).test(v) ? (cu.indexOf(h1) >= 0 ? "联通" : (ct.indexOf(h1) >= 0 ? "电信" : (h2 == "1349" ? "电信" : (cm.indexOf(h1) >= 0 ? "移动" : "未知")))) : false;

    //首先找是否联通，然后查找是否电信，然后在移动中查找‘1349’为电信，最后在移动中查找
	if(!isModify && !v && /^1\d{2}\*{4}\d{4}$/.test(originVal)) {
		v = true;
	}

    return v;
}


module.exports = {
	getImg,
	querystring,
	throttle,
	debounce,
    decode,
	isMobile
}
