// miniprogram/pages/login/login.js
const app=getApp();
const db=wx.cloud.database()
var date = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName: '',
    avatarUrl: '',
    _openid:'',
    isOK:false,
    key:'',
    newdate:''
  },
  bindGetUserInfo: function (e) {
    var that=this;
    console.log(e.detail.userInfo)
  if(e.detail.userInfo) {
      that.setData({
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        isOK:true
      })
     wx.setStorage({
        key: that.data._openid,
        data:{
          userInfo:e.detail.userInfo,
        } 
      })
      db.collection('money').add({
        data:{
          moneyNum:0,
          date:0
        },
        success:function(res){
          console.log('3444')
        }
      })
      wx.switchTab({
        url: '../index/index',
      })
  } else {
    wx.showModal({
      title: '提示',
      content: '你取消了授权，请允许授权',
    })
  }
  },
  // openSetting() { wx.openSetting() },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.jump)
    var that=this;
    app.getopenid().then(function (res) {
      that.setData({
        _openid: res,
      })
    })
    // 获取当前时间
    that.setData({
      newdate: date.formatTime(new Date()),
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
    app.getopenid().then(function (res) {
      that.setData({
        _openid: res,
      })
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