// miniprogram/pages/addbillserve/addbillserve.js
var date = require('../../utils/utils.js');
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,   //显示记账界面
    text: '',
    date:'',
    list:[],
    nickName:'',
    _openid:''  //发布者的openid
  },

  add: function () {
    var that = this;
    that.setData({
      show: true
    })
  },
  //遮罩框点击外部隐藏
  hidden: function () {
    var that = this;
    that.setData({
      show: false
    })
  },
  in: function () { },


// 获取文本
  getValue: function (e) {
    var that = this;
    that.setData({
      text: e.detail.value
    })
  },
// 添加旅程
  submit: function () {
    var that = this;
    var formdata = {
      groupName: that.data.text,  //旅程名
      date:that.data.date,      //日期
      // billList:[],   //账单
      group:[],   //成员
      nickName: that.data.nickName   //创建者昵称
    }
      db.collection('billgroup').add({
        data:formdata,
        success:function(res){
            console.log(res)
          that.setData({
            show: false
          })
            that.onShow();
        }
      })
  },
// 去往详情页面
  goTodetail:function(e){
    var that= this;
    var id = e.currentTarget.dataset.id;
    var oddate = e.currentTarget.dataset.oddate;
    var Createopenid = that.data._openid
    console.log(oddate)
    console.log(id)
    wx.navigateTo({
      url: '../billserverDetail/billserverDetail?id=' + id + "&oddate=" + oddate + "&Createopenid=" +Createopenid+ '&key='+ "",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取当前时间
    that.setData({
      date: date.formatTime(new Date()),
    })
    //查询账单
    wx.getStorage({
      key: '_openid',
      success:function(res){
        that.setData({
          _openid:res.data
        })
        db.collection('billgroup').where({
          _openid: res.data
        }).get({
          success: function (res) {
            console.log(res)
            that.setData({
              list: res.data
            })
          }
        })
      }
    })
    // app.getopenid().then(function(res){
    //   let id = res
    //   db.collection('billgroup').where({
    //     _openid: id
    //   }).get({
    //     success: function (res) {
    //       console.log(res)
    //       db.collection('sharegroup').where({
    //         _openid:id
    //       }).get({
    //         success:function(res){
    //           console.log(res);
    //         }
    //       })
    //       that.setData({
    //         list: res.data
    //       })
    //     }
    //   })
    // })
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
      wx.getUserInfo({
        success: function(res) {
          // console.log(res.userInfo)
          that.setData({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
          })
        }
      })
     // 查看是否授权
//      wx.getSetting({
//       success (res){
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称
//           wx.getUserInfo({
//             success: function(res) {
//               console.log(res.userInfo)
//               that.setData({
//                 nickName: res.userInfo.nickName,
//                 avatarUrl: res.userInfo.avatarUrl,
//               })
//             }
//           })
//         }else{

//         }
//       }
// })
// wx.cloud.callFunction({
//   name:'getbillgroup',
//   success:function(res){
//     console.log(res)
//     console.log(res.result.list);
//     let a= res.result.list;
//     let b = a.filter(item =>{
//       return item.List.length !==0
//     })
//     console.log(b);
    
//   }
// })
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
    wx.getStorage({
      key: '_openid',
      success:function(res){
        // console.log(res.data)
        db.collection('billgroup').where({
          _openid: res.data
        }).get({
          success: function (res) {
            console.log(res)
            that.setData({
              list: res.data
            })
          }
        })
      }
    })
    // app.getopenid().then(function (res) {
    //   db.collection('billgroup').where({
    //     _openid: res
    //   }).get({
    //     success: function (res) {
    //       console.log(res)
    //       that.setData({
    //         list: res.data
    //       })
    //     }
    //   })
    // })
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