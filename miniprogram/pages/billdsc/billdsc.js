// miniprogram/pages/billdsc/billdsc.js
var db=wx.cloud.database();
var app=getApp();
var date = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    list:[],
    buildname:'',
   
    nickName: '',
    groupid: '',
    oddate: '',
    imgSrc: '',
    newTextName: '',  //项目名称
    newNum: '',    //账目
    newtext: '',  //备注文本
    date:'',
    pid:'',      //创建这个账单的人的id
   
    iid:'',   
    show: false,   //显示记账界面

    index_openid:'',   //当前用户的_openid， 用来检测是否是同一个id，
  },

  // 删除
  del(){
   var that=this;
   if(that.data.index_openid === that.data.pid){
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success(res) {
        if (res.confirm) {
          db.collection('billserver').doc(that.data._id).remove({
            success: function (res) {
              console.log(res)
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }else{
    wx.showToast({
      title: '您不是该创建用户，无权修改',
      icon: 'none',
      duration: 2000
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
  in: function () { },

  // 获取文本
  getNum(e) {
    var that = this;
    that.setData({
      newNum: e.detail.value
    })
  },
  getTextName(e) {
    var that = this;
    that.setData({
      newTextName: e.detail.value
    })
  },
  getText(e) {
    var that = this;
    that.setData({
      newtext: e.detail.value
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
  // 编辑
  det(){
      var that=this;
      if(that.data.index_openid === that.data.pid){
        that.setData({
          show: true
        })
      }else{
        wx.showToast({
          title: '您不是该创建用户，无权修改',
          icon: 'none',
          duration: 2000
        })
        
        
      }
  },

  // 预览图片
  previewImage(e) {
    var that = this;
    wx.previewImage({
       current: that.data.imgSrc,
      urls: that.data.imgSrc,
    })
  },
  submit(){
    var that=this;
    var formdata = {
      billname: that.data.newtext,
      billNum: that.data.newNum,
      newdate: that.data.date,
      projectName: that.data.newTextName,
      // iid:that.data._id,
      nickName:that.data.nickName,
      groupid:that.data.groupid,
      oddate:that.data.oddate,
      imgSrc:that.data.imgSrc
    }
    db.collection('billserver').doc(that.data._id).remove({
      success: function (res) {
        db.collection('billserver').add({
          data: formdata,
          success: function (res) {
            var id=res._id
            that.setData({
              _id:id
            })
            db.collection('billserver').where({
              _id: id
            }).get({
              success: function (res) {
                console.log(res)
                that.onShow();
                that.setData({
                  // list: res.data[0],
                  // imgSrc: res.data[0].imgSrc,
                  // newTextName: res.data[0].projectName,  //项目名称
                  // newNum: res.data[0].billNum,    //账目
                  // newtext: res.data[0].billname,  //备注文本
                  // nickName: res.data[0].nickName,
                  // groupid: res.data[0].groupid,
                  // oddate: res.data[0].oddate,
                  show: false,
                 
                })
              }
            })
          }
        })
      }
    })
   
    
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    // console.log(options.oddate)
    var that=this;
    that.setData({
      _id:options.id,
      date: date.formatTime(new Date()),
    })
    db.collection('billserver').doc(options.id).get({
      success:function(res){
        db.collection('billgroup').doc(res.data.groupid).get({
          success: function (res) {
            console.log(res)
            that.setData({
              buildname: res.data.nickName,
              oddate: res.data.date,
            })
          }
        })
        // console.log(res);
        that.setData({
          list:res.data,
          imgSrc:res.data.imgSrc,
          newTextName: res.data.projectName,  //项目名称
          newNum: res.data.billNum,    //账目
          newtext: res.data.billname,  //备注文本
          nickName: res.data.nickName,
          groupid: res.data.groupid,
          pid:res.data._openid,
          // oddate: res.data.oddate,
        })
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
    db.collection('billserver').where({
      _id:that.data._id
    }).get({
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data[0],
          imgSrc: res.data[0].imgSrc,
          newTextName: res.data[0].projectName,  //项目名称
          newNum: res.data[0].billNum,    //账目
          newtext: res.data[0].billname,  //备注文本
          nickName: res.data[0].nickName,
          groupid: res.data[0].groupid,
          // oddate: res.data[0].oddate,
        })
      }
    })
    app.getopenid().then(function(res) {
      // console.log(res);
      that.setData({
        index_openid: res
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
  onShareAppMessage: function () {

  }
})