// miniprogram/pages/watchdetail/watchpublish/watchpublish.js
var date = require('../../../utils/utils.js');
const app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    imgSrc: [],
    text: '',
    fileIDs: '',
    date: '', //日期
    nickName: '', //评论者姓名
    avatarUrl: '', //评论者头像
    id: '', //悬赏id 
    _openid: '' //评论者id
  },
  getPhoto: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          imgSrc: tempFilePaths
        })
      }
    })
  },
  getText: function(e) {
    var that = this;
    that.setData({
      text: e.detail.value
    })
  },
  publish() {
    
    if (!this.data.imgSrc.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      let item = this.data.imgSrc[0];
      console.log(item)
      let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
      wx.cloud.uploadFile({
        cloudPath: 'img/' + new Date().getTime() + suffix, // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          this.setData({
            fileIDs: res.fileID
          });
          console.log(res.fileID) //输出上传后图片的返回地址
          db.collection('watchcom').add({
            data: {
              text: this.data.text,
              imgUrl: this.data.fileIDs,
              date: this.data.date,
              nickName: this.data.nickName,
              avatarUrl: this.data.avatarUrl,
              isGet: false,
              id: this.data.id,
              isShow:false,
              disable:false
            },
            success:function(res){
              console.log(res)
            }
          })
          wx.navigateBack({
            delta: 1
          })
          wx.showToast({
            icon: 'none',
            title: "上传成功,等待审核",
          })

        },
        fail: res => {
          wx.hideLoading();
          wx.showToast({
            title: "上传失败",
          })
        }
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    var that = this;
    // 获取当前时间
    that.setData({
      date: date.formatTime(new Date()),
      id: options.id
    })
    wx.getStorage({
      key: '_openid',
      success:function(res){
      that.setData({
        _openid: res.data
      })
      }
    })
    // app.getopenid().then(function(res) {
    //   console.log(res);
    //   that.setData({
    //     _openid: res
    //   })
    // })
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
          }else{}
        }
      })
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