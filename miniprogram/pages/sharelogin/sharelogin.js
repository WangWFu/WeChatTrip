// miniprogram/pages/sharelogin/sharelogin.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var date = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName: '',
    avatarUrl: '',
    _openid: '',
    isOK: false,
    groupId:'',
    oddate:'',
    newdate: ''
  },
  bindGetUserInfo(e){
    var that=this;
    if (e.detail.userInfo) {
      that.setData({
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        isOK: true
      })
      wx.setStorage({
        key: that.data._openid,
        data: {
          userInfo: e.detail.userInfo,
          moneyNum: 0
        }
      })
      db.collection('money').add({
        data: {
          moneyNum: 0,
          date: 0
        },
        success: function (res) {
          console.log('3444')
        }
      })
      var formdata={
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        groupId: that.data.groupId
      }
      db.collection('sharegroup').add({
        data:formdata,
        success:function(res){
        wx.navigateTo({
            url: '../billserverDetail/billserverDetail?groupId=' + that.data.groupId + '&oddate=' + that.data.oddate,
          })
        }
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    app.getopenid().then(function (res) {
      that.setData({
        _openid: res,
      })
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // console.log('[云函数] [login] user openid: ', res.result.openid)
        this.setData({
          _openid: res.result.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    that.setData({
      groupId: options.groupId,
      oddate: options.oddate
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