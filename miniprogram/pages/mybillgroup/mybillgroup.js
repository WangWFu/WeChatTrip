// miniprogram/pages/mybillgroup/mybillgroup.js
var app = getApp();
var db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    _openid:'',
    tig:'您还未加入任何账本~'
  },
  goTodetail:function(e){
    var id = e.currentTarget.dataset.id;
    var oddate = e.currentTarget.dataset.oddate
    console.log(oddate)
    console.log(id)
    wx.navigateTo({
      url: '../billserverDetail/billserverDetail?id=' + id + "&oddate=" + oddate,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // app.getopenid().then(res =>{
    //   that.setData({
    //     _openid:res
    //   })
    // })
    wx.getStorage({
      key: '_openid',
      success:function(res){
        that.setData({
          _openid:res.data
        })
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.cloud.callFunction({
      name:'getbillgroup',
      success:function(res){
        console.log(res)
        console.log(res.result.list);
        let arr1= res.result.list;
        let arr2 = arr1.filter(item =>{
          return item.List.length !==0 && item._openid !== that.data._openid
        })
        // let list = arr2.filter(item =>{
        //   return item._openid !== that.data._openid
        // })
        console.log(arr2);
        // console.log(list);
        that.setData({
          list:arr2,
          tig:''
        })
      }
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})