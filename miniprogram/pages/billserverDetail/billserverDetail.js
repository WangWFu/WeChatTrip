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
    show: false, //显示记账界面
    oddate: '', //创建组的时间
    _id: '', //groupid
    jump: '',
    group: [],
    _openid:'',

    Createopenid: '', //创建者id
    scen: 1, //好友进入标志
    islogin: '', //好友授权
    nickName: '', //好友用户名
    avatarUrl: '', //好友头像
    already:''
  },
  //顶部切换
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

  inAdd() {
    var that = this;
    wx.navigateTo({
      url: './addbillitem/addbillitem?oddate=' + that.data.oddate + '&_id=' + that.data._id,
    })
  },
  //好友进入且授权
  inAddA(){
    var that = this;
    wx.navigateTo({
      url: './addbillitem/addbillitem?oddate=' + that.data.oddate + '&_id=' + that.data._id,
    })
    //判断是否已经加入账单了
 //已授权就上传数据
 wx.cloud.callFunction({
  name: 'addUseTobill',
  data: {
    id: that.data._id,
    nickName:  that.data.nickName,
    avatarUrl: that.data.avatarUrl,
  },
  success: function (res) {
    console.log(res)
  }
})
//将好友信息上传到sharegroup
db.collection('sharegroup').add({
  data: {
    nickName: that.data.nickName,
    avatarUrl: that.data.avatarUrl,
    groupId:that.data._id,   //当前组账单id
  },
  success: function (res) {}
})
   
    
  },




  //点击授权获取用户信息
  getUserInfo: function (e) {
    var that = this;
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      that.setData({
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        islogin:true
      })
      wx.setStorage({
        key: that.data._openid,
        data: {
          userInfo: e.detail.userInfo,
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
      // // 邀请的好友授权完就将数据上传，没授权不算邀请成功
      // wx.cloud.callFunction({
      //   name: 'addUseTobill',
      //   data: {
      //     id: that.data._id,
      //     nickName: e.detail.userInfo.nickName,
      //     avatarUrl: e.detail.userInfo.avatarUrl,
      //   },
      //   success: function (res) {
      //     console.log(res)
      //     //将好友信息上传到sharegroup
      //     db.collection('sharegroup').add({
      //       data: {
      //         nickName: e.detail.userInfo.nickName,
      //         avatarUrl: e.detail.userInfo.avatarUrl,
      //         groupId: that.data._id
      //       },
      //       success: function (res) {}
      //     })
      //   }
      // })
    } else {
      wx.showModal({
        title: '提示',
        content: '你取消了授权，请允许授权',
      })
    }
  },


  //遮罩框点击外部隐藏
  hidden: function () {
    var that = this;
    that.setData({
      show: false
    })
  },
  in: function () {},




  Todeail(e) {
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
    // console.log(options.groupId)
    console.log(options.id) //账本id
    // console.log(options.Createopenid)  //创建者id
    console.log(options.scen) //好友进入标志
    var that = this;
    // that.setData({
    //   date: date.formatTime(new Date()),
    //   _id: options.id,
    //   oddate: options.oddate,   //创建账本的时间
    //   Createopenid: options.Createopenid,
    //   key: options.key
    // })
    if (that.data.scen == 1) {
      that.setData({
        date: date.formatTime(new Date()),
        _id: options.id,
        oddate: options.oddate, //创建账本的时间
        Createopenid: options.Createopenid,
      })
    }
    //判断好友进入是否授权
    if (options.scen==2) {
      console.log('222')
      that.setData({
        _id: options.groupId,
        oddate: options.oddate,
        scen:2
      })
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                that.setData({
                  nickName: res.userInfo.nickName,
                  avatarUrl: res.userInfo.avatarUrl,
                  islogin: true,
                })
              }
            })
          } else {
            that.setData({
              islogin: false
            })
          }
        }
      })
      // db.collection('sharegroup').where({
      //   _openid:that.data._openid
      // }).get({
      //   success:function(res){
      //   that.setData({
      //     already:true
      //   }) 
      //   }
      // })
    }

    //查询billserver的当前数据
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
    db.collection('sharegroup')
      .get({
        success: function (res) {
          console.log(res.data)
          //sharegroup集合里和当前_id相同的数据
          var newarr = res.data.filter(item => item.groupId === that.data._id)
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
    var that = this;
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
      path: 'pages/billserverDetail/billserverDetail?scen=2&groupId=' + that.data._id + '&oddate=' + that.data.oddate,
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