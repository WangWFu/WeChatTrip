// miniprogram/pages/search/search.js
const db=wx.cloud.database();
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
     type:''
  },

  goToDetial:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Pagedetail/pagedetail?id=' + id,
    })
  },
  goTodetail(e){
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
  // 获取搜索框数据
  getValue: function (e) {
    console.log(e.detail.value)
    var that = this;
    if(that.data.type === "city"){
      if (e.detail.value === '') {
        wx.showToast({
          title: '输入框不能为空',
          icon: 'none',
          duration: 2000
        })
      }
      else {
        db.collection('triplist').where({
          location: db.RegExp({
            regexp: e.detail.value,
            //从搜索栏中获取的value作为规则进行匹配。
            options: 'i',
            //大小写不区分
          })
        }).get({
          success: function (res) {
            console.log(res)
            that.setData({
              list:res.data
            })
          }
        })
      }
    }
   else if(that.data.type === "thing"){
      if (e.detail.value === '') {
        wx.showToast({
          title: '输入框不能为空',
          icon: 'none',
          duration: 2000
        })
        
        
    }
    else {
      db.collection('watchlist').where({
        // location: db.RegExp({
        //   regexp: e.detail.value,
        //   //从搜索栏中获取的value作为规则进行匹配。
        //   options: 'i',
        //   //大小写不区分
        // }),
        text: db.RegExp({
          regexp: e.detail.value,
          //从搜索栏中获取的value作为规则进行匹配。
          options: 'i',
          //大小写不区分
        })
      }).get({
        success: function (res) {
          console.log(res)
          that.setData({
            watchlist:res.data
          })
        }
      })
    }
   }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var type = options.type
    
      var that = this;
      that.setData({
      type:type
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