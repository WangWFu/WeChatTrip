// miniprogram/pages/myzan/myzan.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _openid: '',
    List: [],
    key:'',
    zan:'',
    collection:''
  },
  goTodetail(e) {
    let id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../Pagedetail/pagedetail?id=' + id,
    })
  },

  getzan() {
    let that=this;
    let list = [];
    db.collection('zanlist').where({
      _openid: that.data._openid
    }).get({
      success: function(res) {
        // console.log(res)
        res.data.forEach((item) => {
          console.log(item.Pid)
          db.collection('triplist').doc(item.Pid).get({
            success: function(res) {
              // console.log(res)
              list.push(res.data)
              // console.log(list)
              that.setData({
                List: list
              })
            }
          })

        })
      }
    })
  },

  getcollection() {
    let that = this;
    let list = [];
    db.collection('collectionlist').where({
      _openid: that.data._openid
    }).get({
      success: function (res) {
        // console.log(res)
        res.data.forEach((item) => {
          console.log(item.Pid)
          db.collection('triplist').doc(item.Pid).get({
            success: function (res) {
              // console.log(res)
              list.push(res.data)
              // console.log(list)
              that.setData({
                List: list
              })
            }
          })

        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options.key)
    app.getopenid().then(function(res) {
      that.setData({
        _openid: res,
        key:options.key
      })
    })
 
    if(options.key==='zan'){
      that.getzan()
      that.setData({
        zan:true
      })
    }
    else if(options.key==='collection'){
      that.getcollection()
      that.setData({
        collection:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})