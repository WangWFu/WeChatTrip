// miniprogram/pages/billserverDetail/billserverDetail.js
var date = require('../../utils/utils.js');
const db = wx.cloud.database();
const app = getApp();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    show: false,   //显示记账界面
    oddate: '',   //创建组的时间
   _id:'',          //groupid
    jump:'',
    group:[]
  },
  navchange: function (e) {
    var that = this;
    that.setData({
      index: e.target.dataset.index
    })
  },
  navchangeTo: function (e) {
    var that = this;
    that.setData({
      index: e.target.dataset.index
    })
  },
  // 记一笔
  inAdd(){
    var that = this;

      // 查看是否授权
      wx.getSetting({
        success (res){
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log(res.userInfo)
                that.setData({
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                })
              }
            })
            wx.navigateTo({
              url: './addbillitem/addbillitem?oddate='+that.data.oddate+'&_id='+that.data._id,
            })
          }else{
            wx.navigateTo({
              url: '../sharelogin/sharelogin?groupId=' + that.data._id + '&oddate=' + that.data.oddate,
            })
          }
        }
  })
    // if (that.data.nickName) {
    //   console.log('iiii')
    //   wx.navigateTo({
    //     url: './addbillitem/addbillitem?oddate='+that.data.oddate+'&_id='+that.data._id,
    //   })
    // }else{
    //   console.log('wwwwww')
    //   wx.navigateTo({
    //     url: '../sharelogin/sharelogin?groupId=' + that.data._id + '&oddate=' + that.data.oddate,
    //   })
    // }
  },
  //遮罩框点击外部隐藏
  hidden: function () {
    var that = this;
    that.setData({
      show: false
    })
  },
  in: function () { },

 


  Todeail(e){
    var id = e.currentTarget.dataset.id;
    // var oddate = e.currentTarget.dataset.oddate
    console.log(id)
    wx.navigateTo({
      url: '../billdsc/billdsc?id=' + id,
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.groupId)
    console.log(options.id)
    var that = this;
    if(options.groupId){
      console.log('222')
      that.setData({
        _id:options.groupId,
        oddate: options.oddate,
      })
    }else{
      console.log('444')
      // 获取当前时间
      that.setData({
        date: date.formatTime(new Date()),
        _id: options.id,
        oddate: options.oddate,
      })
    }
   //查询billserver的当前数据
    db.collection('billserver').where({
      groupid: that.data._id
    }).get({
      success:function(res){
        // console.log(res)
        that.setData({
          list:res.data
        })
      }
    })
    app.getopenid().then(function(res){
      that.setData({
        _openid:res,
      })
    })
      db.collection('sharegroup')
      .get({
        success:function(res){
          console.log(res.data)
          //sharegroup集合里和当前_id相同的数据
         var newarr=res.data.filter(item=>item.groupId===that.data._id)
          console.log(newarr)
          that.setData({
            group: newarr
          })
        }
      })
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
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
    db.collection('billserver').where({
      groupid: that.data._id
    }).get({
      success: function (res) {
        // console.log(res)
        that.setData({
          list: res.data
        })
      }
    })
    app.getopenid().then(function (res) {
      that.setData({
        _openid: res,
      })
    })
     // 查看是否授权
     wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              that.setData({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
              })
            }
          })
        }else{

        }
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
  onShareAppMessage: function (ops) {
    var that=this;
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '快来和我一起记账！',
      imageUrl: '',//图片地址
      path: 'pages/billserverDetail/billserverDetail?groupId='+that.data._id,// 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }
    console.log('----')
  }
})