// miniprogram/pages/List/listdetail/listdetail.js
const app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
      console.log(options.id)
    db.collection('boxlist').doc(options.id).get({
      success:function(res){
        console.log(res)
          that.setData({
            list: res.data.checkvalue
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
  onShareAppMessage: function (ops) {
    var that = this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '快来和我一起记账！',
      imageUrl: '', //图片地址
      // path: 'pages/billserverDetail/billserverDetail?groupId='+that.data._id,// 用户点击首先进入的当前页面
      // path: 'pages/billserverDetail/billserverDetail?scen=2&groupId=' + that.data._id + '&oddate=' + that.data.oddate,
      // path: 'pages/billserverDetail/billserverDetail?groupId=' + that.data._id +'&key='+123
      // + '&oddate=' + that.data.oddate,
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }
  }
})