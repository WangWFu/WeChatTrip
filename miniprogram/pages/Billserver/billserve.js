// miniprogram/pages/Billserver/billserve.js
var date = require('../../utils/utils.js');
const db=wx.cloud.database();
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,   //显示记账界面
    datalist:[],
    Num:'',
    text:'',
    date:''
  },
  // 添加记账
  toInAdd:function(){
    var that = this;
    that.setData({
      show: true
    })
  },
  // 关闭记账界面
  // close:function(){
  //   var that = this;
  //   that.setData({
  //     open: false
  //   })
  // },

  //遮罩框点击外部隐藏
  hidden: function () {
    var that = this;
    that.setData({
      show: false
    })
  },
  in: function () { },


  getNum(e){
      var that=this;
      that.setData({
        Num: e.detail.value
      })
  },
  getText(e){
    var that = this;
    that.setData({
      text: e.detail.value
    })
  },

  // 完成事件
  submit:function(){
    var that=this;
    var formdata={
      Num:that.data.Num,
      text:that.data.text,
      date:that.data.date
    }
    db.collection('account').add({
      data:formdata,
      success:function(res){
        console.log(res)
        that.setData({
          show:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 获取当前时间
    that.setData({
      date: date.formatTime(new Date()),
    })
    app.getopenid().then(function(res){
     db.collection('account').where({
       _openid:res
     }).get({
       success:function(res){
         console.log(res)
         that.setData({
           datalist:res.data
         })
       }
     })
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