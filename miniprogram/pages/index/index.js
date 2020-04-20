const db = wx.cloud.database();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    pagenum: 1, //初始页默认值为1
    page: 1,
    pageSize: 20,

    _openid: '', //用户id

  },

  // 获取数据
  getdatalist: function() { //可在onLoad中设置为进入页面默认加载
    var that = this;
    var pageNum = that.data.page;   //初始页默认值为1
    var pageSize = that.data.pageSize;   //限制20条数据
    db.collection('triplist').skip((pageNum - 1) * pageSize).limit(pageSize).where({
      isShow:true,
      key:'public'
    }).get({
      success: function(res) {
        console.log(res)
        if (res.data.length == 0) {
          wx.showLoading({
            title: '没有更多的数据了',
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
        } else {
          var arr1 = that.data.imglist; //从data获取当前imglist数组
          var arr2 = res.data; //从此次请求返回的数据中获取新数组
          arr1 = arr1.concat(arr2); //合并数组
          that.setData({
            imglist: arr1, //合并后更新imglist
          })
        }
      }
    })
  },


  // 到发布页面事件
  goToPublish: function() {
    var that= this;
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.navigateTo({
            url: './Publish/publish?_openid=' + that.data._openid,
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
  // 跳转详情页
  goToDetial: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Pagedetail/pagedetail?id=' + id,
    })
  },


  // 跳转搜索页面
  go: function() {
    wx.navigateTo({
      url: '../search/search?type=' + 'city' ,
    })
  },




//根据isShow来判断是否审核通过，根据key来判断可见性
  getData: function(res) {
    var that = this;
    db.collection('triplist').where({
      isShow:true,
      key: 'public'
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          imglist: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // app.getopenid().then(function(res) {
    //   // console.log(res);
    //   that.setData({
    //     _openid: res
    //   })
    // })
    wx.getStorage({
      key: '_openid',
      success (res) {
        console.log(res.data)
        that.setData({
          _openid:res.data
        })
      }
    })
    this.getData();
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
    var that = this;
    that.getData();
    const watcher = db.collection('triplist')
    .where({
      isShow:true,
      key: 'public'
    })
    .watch({
      onChange: function(snapshot) {
        console.log('docs\'s changed events', snapshot.docChanges)
        console.log('query result snapshot after the event', snapshot.docs)
        console.log('is init data', snapshot.type === 'init')
        that.setData({
          imglist:snapshot.docs
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
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
    watcher.close()
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
    var that = this;
    var page = that.data.page + 1; //获取当前页数并+1
    that.setData({
      page: page, //更新当前页数
    })
    that.getdatalist(); //重新调用请求获取下一页数据
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})