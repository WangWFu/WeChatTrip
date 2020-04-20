// miniprogram/pages/Trip/trip.js
const db=wx.cloud.database();
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   tig:'还没有未完成的行程，快来添加吧~',
   tigend:'还没有已完成的行程诶~',
   show:false,
   isActive:false,
 

   date:'请选择完成日期',
   textTitle:'',
    text:'',
    _openid:'',
    isfinish:false,

    Finishlist:[],
    unFinishlist:[]
  },

  add:function(){
      var that=this;
       // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.setData({
            show:true
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
  //遮罩框点击外部隐藏
  hidden:function(){
    var that = this;
    that.setData({
      show: false
    })
  },
  in:function(){},
  
  // 完成添加事件
  endAdd:function(){
    var that = this;
    var formdata={
      date: that.data.date,
      textTitle: that.data.textTitle,
      text: that.data.text,
      isfinish:that.data.isfinish
    }
    db.collection('datalist').add({
      data:formdata,
      success:function(res){
        // console.log(res);
        that.onShow()
      }
    })
    that.setData({
      show: false,
      date: '请选择完成日期',
      textTitle: '',
      text: ''

    })
  },

// 任务完成
  complete:function(event){
    var that=this;
    var id = event.currentTarget.dataset.id;
    // console.log(id)
    wx.showModal({
      title: '提示',
      content: '行程已完成了吗！',
      success(res) {
        if (res.confirm) {
          that.setData({
            isActive: true
          })
          db.collection('datalist').doc(id).update({
            data:{
              isfinish:true
            },
            success:function(res){
              that.onShow()
            }
          })
        } else if (res.cancel) {
          that.setData({
            isActive: false
          })
        }
      }
    })
  },
  // 长按删除
  conDel: function (event){
    var that=this;
    var id = event.currentTarget.dataset.id;
    // console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定删除该任务？',
      cancelColor:'#FFDD81',
      success(res) {
        if (res.confirm) {
          db.collection('datalist').doc(id).remove({
            success:function(res){
               that.onShow()
            }
          })
        } else if (res.cancel) {
         
        }
      }
    })
  },
  //标题 
  getTestTitle: function (e) {
    var that = this;
    that.setData({
      textTitle: e.detail.value
    })
  },
  //内容 
  getTest: function (e) {
    var that = this;
    that.setData({
      text: e.detail.value
    })
  },
  // 日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
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
    app.getopenid().then(function (res) {
      // console.log(res)
      db.collection('datalist').where({
        _openid: res
      }).get({
        success: function (res) {
          // console.log(res)
          var getdata=res.data;
        
        var a=getdata.filter(function(val,index){
            return val.isfinish===false
          })
          var b = getdata.filter(function (val, index) {
            return val.isfinish === true
          })
          that.setData({
            unFinishlist:a,
            Finishlist:b
          })
         
        }
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