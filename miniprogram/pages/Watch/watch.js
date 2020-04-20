// miniprogram/pages/Watch/watch.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      watchlist:[],
      _openid:''
  },
  // 跳转搜索页面
  search: function() {
    wx.navigateTo({
      url: '../search/search?type='+'thing',
    })
  },
  // 跳转发布页面
  Topublish:function(){
     // 查看是否授权
     wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.navigateTo({
            url: './publishwatch/publishwatch',
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
  // 跳转详情页面
  goTodetail:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;   //_id
    var pubid=e.currentTarget.dataset.pubid   //发布悬赏的用户id
    var useid =that.data._openid   //当前用户的_openid
    console.log(pubid)
    console.log(id)
      wx.navigateTo({
        url: '../watchdetail/watchdetail?id='+id + '&pubid='+pubid + '&useid='+useid,
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getopenid().then(function (res) {
      that.setData({
        _openid: res
      })
    })
    const watcher = db.collection('watchlist')
  .where({
   isShow:true
  })
  .watch({
    onChange: function(snapshot) {
      console.log('docs\'s changed events', snapshot.docChanges)
      console.log('query result snapshot after the event', snapshot.docs)
      console.log('is init data', snapshot.type === 'init')
      that.setData({
        watchlist:snapshot.docs
      })
    },
    onError: function(err) {
      console.error('the watch closed because of error', err)
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
    var that=this;
    db.collection('watchlist').where({
      isShow:true
    }).get({
      success: function (res) {
        console.log(res)
        that.setData({
          watchlist:res.data
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
    watcher.close()
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