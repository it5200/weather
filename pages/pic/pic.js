const AV = require('../../utils/av-live-query-weapp-min');
const LIMIT = 7;
AV.init({
    appId: 'j8dr4m11hsN1Hiy1H4h9mEgO-gzGzoHsz',
    appKey: 'O2B4GUr6NxngBuvtKm5BEPfj',
});
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wallpaper: [],
        isReachEnd: false,
        isLoading: false,
        offsetRange: 0,//用于统计分页加载数据,已经加载数据数量
        imgArr:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.fetchPhotos();
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.showLoading({
            title: '加载中',
        })
        this.fetchPhotos();
        // var that = this;
        // wx.showLoading({
        //     title: '加载中',
        //     mask:true
        // })
        // new AV.Query('pic').descending('createdAt').limit(7).find().then(data => {
        //     wx.hideLoading();
        //     that.setData({ wallpaper: data });
        // })
        //     .catch(wx.hideLoading());
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            wallpaper:[]
        })
        wx.stopPullDownRefresh();
        this.fetchPhotos();
        wx.vibrateShort();
        wx.showToast({
            title: '没事儿别乱拉',//提示信息
            icon: 'success',//成功显示图标
            duration: 1000//时间
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
         var that = this;
         let imgList = [];
        //  console.log("到底了")
         //计算已经加载的数据
         if(that.data.isReachend){
             return;
         }
         let offsetRange = that.data.offsetRange + LIMIT;
         that.setData({
             offsetRange: offsetRange,
             isLoading: true,//正在加载
         })
         new AV.Query('pic').descending('createdAt').limit(LIMIT).skip(that.data.offsetRange).find().then(data => {
             let objects = data;
             if(objects.lengths == 0){
                 that.setData({
                     isReachEnd: true,//已经获取全部数据
                     isLoading: false,//加载结束
                 }) 
             }else{
                 for (let i = 0; i < data.length; i++) {
                     let object = data[i];
                     let res = object._serverData.urls;
                     imgList.push(res)
                 }
                 that.setData({ 
                     wallpaper: that.data.wallpaper.concat(objects),
                     isLoading:false,
                     imgArr: that.data.imgArr.concat(imgList)
                      });
             }
             
         })
        .catch(console.error);
    },
    fetchPhotos: function () {
        
        var that = this;
        let imgList = [];
        new AV.Query('pic')
            .descending('createdAt').limit(7)
            .find()
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                        let object = data[i];
                        let res = object._serverData.urls;
                        imgList.push(res)
                    }
                wx.hideLoading();
                that.setData({ 
                    wallpaper: data,
                    imgArr:imgList
                 })
            })
            .catch(console.error);

    },
    // 点击图片进行预览
    previewImg: function (e) {
        console.log(e.currentTarget.dataset.index);
        var index = e.currentTarget.dataset.index;
        var imgArr = this.data.imgArr;
        wx.previewImage({
            current: imgArr[index],     //当前图片地址
            urls: imgArr,               //所有要预览的图片的地址集合 数组形式
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})