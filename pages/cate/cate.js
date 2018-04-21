/**
 * 商品分类页
 *
 * @author HuiminLiu
 */

const helper = require('../../common/fe_helper.js')
const cateApi = require('../../module/category/index_data.js')
// const JDPage = require('../page.js')

// import * as Ptag from '../../api/Ptag/Ptag_constants';
// import PtagUtils from '../../api/Ptag/Ptag_utils.js';
// import PtagManager from '../../api/Ptag/report_manager.js';

const App = getApp()

const statusBarH = 20
const navigatorBarH = 44
const searchBarH = 50
const tabItemH = 50

let svh //Scroll View Height

new Page({
    data: {
        loading: true,
        entries: [],
        curIdx: 0,
        st1: 0,
        st2: 0,
        IMG_NUM: 15, //首屏的图片数量，优先加载这一些
        imgLoadedCount: 0,
        showHomeBtn: false,
    },
    onLoad(options) {
        //事件绑定的节流处理
        this.gotoSearchList = helper.throttle(this.gotoSearchList, 1000)
        this.updateLoadCount = helper.debounce(this.updateLoadCount, 200)

        !svh && wx.getSystemInfo({
            success: res => {
                const winH = res && res.windowHeight
                if (winH)
                    svh = winH - statusBarH - navigatorBarH - searchBarH
            }
        })

        if (options.restore)
            this.restorePrevState()

        this.loadData()

        this.setData({
            showHomeBtn: getCurrentPages().length == 1
        })
    },
    onShareAppMessage() {
        return {
            title: '',
            path: '/pages/cate/cate'
        }
    },
    gotoHomePage() {
        wx.switchTab({ url: '/pages/index/index' })
    },
    loadData() {
        this.setData({ loading: true })
        // this.us.prepare(this.us.OP_CATE)

        cateApi.getAllCategory(117, (err, data) => {
            // this.us.report(this.us.OP_CATE, err ? 1 : 0, err)

            setTimeout(() => {
                this.setData({ loading: false })
            }, 0)

            data.forEach(item1 => {
                let imgIdx = 0 //给图片编个号

                //过滤掉无数据的项
                item1.level1words = item1.level1words.filter(item2 => {
                    if (!item2.level2words)
                        item2.level2words = []

                    //仅保留能从url 中解析出关键词的项
                    item2.level2words = item2.level2words.filter(item3 => {
                        const matches = item3.url.match(/key=([^=&]+)/)

                        if (matches) {
                            try {
                                if (/catid_str,,/.test(matches[1]))
                                    item3.key = item3.keyword
                                else
                                    item3.key = decodeURIComponent(matches[1])
                            } catch (e) {
                                item3.key = item3.keyword
                            }
                            item3.imageUrl = helper.getImg(item3.imageUrl, 140)
                            item3.imgIdx = imgIdx++
                            return true
                        }

                        return false
                    })

                    return item2.level2words.length > 0
                })
            })

            // 过滤一级类目下关键词为空
            data = data.filter(item => item.level1words.length > 0);
            this.wholeEntries = data

            this.setData({ entries: this.minifyEntries() })
            // this.speedMark(4).speedReport()
        })
    },
    //精简数据，以提升setData 的执行效率
    minifyEntries(tabIdx) {
        if (typeof tabIdx == 'undefined')
            tabIdx = this.data.curIdx

        return this.wholeEntries.map((item, index) => {
            const { areaId, areaName, level1words } = item

            return {
                areaId,
                areaName,
                level1words: index == tabIdx ? level1words : []
            }
        })
    },
    switchTab(ev) {
        const { index } = ev.currentTarget.dataset
        if (index == this.data.curIdx) return;
        
        this.setData({
            curIdx: index,
            st2: 0,
            imgLoadedCount: 0,
            entries: this.minifyEntries(index)
        })

        this._st2 = 0
        this.scrollIntoViewForTabItem(index)

    },
    scrollIntoViewForTabItem(index) {
        if (svh) {
            this.setData({ st1: index * tabItemH - (svh - tabItemH) / 2 })
        }
    },
    //还原页面跳转前的状态，用于从搜索页返回时
    restorePrevState() {
        const state = App.gCatePageState

        if (state) {
            this.setData({
                curIdx: state.curIdx,
                st2: state.st2,
            })
            this.scrollIntoViewForTabItem(state.curIdx)
            delete App.gCatePageState
        }
    },
    gotoSearchList(ev) {
        const { key, cateIdx } = ev.currentTarget.dataset
        const { curIdx } = this.data
        const params = helper.querystring({ key, from: 'cate' })

        App.gCatePageState = {
            curIdx: curIdx,
            st2: this._st2,
        }

        wx.redirectTo({
            // url: '/pages/search/list/list?' + params
        })
    },
    onScroll(ev) {
        this._st2 = ev.detail.scrollTop //滚动高度存一下以便后续恢复
    },
    imgOnLoad(ev) {
        const { tab } = ev.currentTarget.dataset

        if (tab == this.data.curIdx) {
            this.data.imgLoadedCount++
            this.updateLoadCount()
        }
    },
    updateLoadCount() {
        this.setData({
            imgLoadedCount: this.data.imgLoadedCount
        })
    }
})
