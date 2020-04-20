// miniprogram/pages/billserverDetail/addbillitem/addbillitem.js
var date = require('../../../utils/utils.js');
const db = wx.cloud.database();
const app = getApp();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TextName: '',  //项目名称
    Num: '',    //账目
    text: '',  //备注文本
    date: '',  //日期
    _id: '',   //billgroup的_id
    list: [],
    nickName: '',  //从缓存中查找用户名
    oddate: '',

    imgSrc: '',     //选择图片
    fileIDs: [],    //图片云端地址
  },
  // 获取文本
  getNum(e) {
    var that = this;
    that.setData({
      Num: e.detail.value
    })
  },
  getTextName(e) {
    var that = this;
    that.setData({
      TextName: e.detail.value
    })
  },
  getText(e) {
    var that = this;
    that.setData({
      text: e.detail.value
    })
  },

  // 添加图片
  addImg() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgSrc: tempFilePaths
        });
      }
    })
  },

  // 预览图片
  previewImage(e) {
    var that = this;
    wx.previewImage({
      current: that.data.imgSrc,
      urls: that.data.imgSrc,
    })
  },

  // 添加
  submit() {
    var that = this;
    // if (that.data.imageUrl==null){
    //   console.log('111');
    // }else{
    //   console.log('222')
    // }
    
// 没有上传图片的
    if (!that.data.imgSrc) {
      var formdata = {
        billname: that.data.text,
        billNum: that.data.Num,
        newdate: that.data.date,
        nickName: that.data.nickName,
        groupid: that.data._id,
        imgSrc: '',
        projectName: that.data.TextName,
        oddate: that.data.oddate
      }
      db.collection('billserver').add({
        data: formdata,
        success: function (res) {
          // console.log(res)
          // console.log('222')
         wx.navigateBack({
           delta: 1
         })
          // wx.redirectTo({
          //   url: './billserverDetail/billserverDetail'
          // })
        }
      })

    } else {
      let promisearr = [];
      promisearr.push(new Promise(function (reslove, reject) {
        let item = that.data.imgSrc[0];
        // let suffix = /\.\w+$/.exec(item);//正则表达式返回文件的扩展名
        const name = Math.random() * 1000000;
        const cloudPath = 'billimg/' + name + item.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          // cloudPath: 'billimg/' + new Date().getTime() + suffix, // 上传至云端的路径
          cloudPath, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            that.setData({
              fileIDs: res.fileID
            });
            // console.log(res.fileID)//输出上传后图片的返回地址
            reslove();
            wx.showToast({
              icon: 'none',
              title: "上传成功",
            })
          },
          fail: res => {
            wx.hideLoading();
            wx.showToast({
              title: "上传失败",
            })
          }
        })
      }))
      Promise.all(promisearr).then(res => {
        var formdata = {
          billname: that.data.text,
          billNum: that.data.Num,
          newdate: that.data.date,
          nickName: that.data.nickName,
          groupid: that.data._id,
          imgSrc: that.data.fileIDs,
          projectName: that.data.TextName,
          oddate: that.data.oddate
        }
        db.collection('billserver').add({
          data: formdata,
          success: function (res) {
            // console.log(res)
            // console.log('3333')
            wx.navigateBack({
              delta: 1
            })
            // wx.redirectTo({
            //   url: './billserverDetail/billserverDetail'
            // })
          }
        })
      }, function (err) {
        console.log('fail')
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options.oddate);
      // console.log(options._id)
      var that=this;
      that.setData({
        date: date.formatTime(new Date()),
        _id: options._id,
        oddate: options.oddate
      })
    app.getopenid().then(function (res) {
      wx.getStorage({
        key: res,
        success: function (res) {
          that.setData({
            nickName: res.data.userInfo.nickName
          })
        },
        // fail:function(err){
        //   wx.navigateTo({
        //     url: '../login/login',
        //   })
        // }
      })
      // that.setData({
      //   _openid: res,
      // })
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