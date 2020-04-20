// miniprogram/pages/Tool/tool.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goBillserve: function () {
      // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.navigateTo({
            url: '../addbillserve/addbillserve',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '您还未授权，请先授权',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '../Me/me',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          }) 
        }
      }
    })
   
  },

  goList: function () {
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.navigateTo({
            url: '../List/list',
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '您还未授权，请先授权',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '../Me/me',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          }) 
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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