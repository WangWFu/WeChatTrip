// miniprogram/pages/List/addlist/addlist.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '身份证', value: '身份证' },
      { name: '护照', value: '护照',  },
      { name: '学生证', value: '学生证' },
      { name: '零钱', value: '零钱' },
      { name: '雨伞', value: '雨伞' },
      { name: '充电器', value: '充电器' },
      { name: '充电宝', value: '充电宝' },
      { name: '拍照杆', value: '拍照杆' },
    ],
    show:false,
    value:'',  //添加物品数据
    city:'',    //城市
    checkValue:[]
  },
  checkboxChange: function (e) {
    var that=this;
    that.setData({
      checkValue:e.detail.value
    })
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
// 增加物品
  addList:function(){
      var that=this;
      that.setData({
        show:true
      })
  },
  // 获取增加物品数据
  submit:function(){
      var that=this;
      var list={
        name:that.data.value,
        value:that.data.value
      }
      if(that.data.value!=''){
       that.data.items.push(list)
        that.setData({
          items: that.data.items,
          value: '',
          show: false
        })
      }
      else{
        wx.showToast({
          title: '请输入物品名',
          icon: 'none',
          duration: 1500
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
  getText(e) {
    var that = this;
     if (e.detail.value!=''){
      that.setData({
        value: e.detail.value
      })
    }
  },

  // blur:function(e){
  //   var that = this;
  //   if (e.detail.value!=''){
  //     that.setData({
  //       value: e.detail.value
  //     })
  //   }
  //   console.log(e.detail.value)
  // },
  // close:function(){
  //   var that=this;
  //   that.setData({
  //     open:false
  //   })
  // },

  // 获取城市名
  getValue:function(e){
    var that=this;
    that.setData({
      city:e.detail.value
    })
  },

  // 提交数据
  submitInfo:function(){
    var that=this;
    var formdata={
      city:that.data.city,
      checkvalue:that.data.checkValue
    }
    if (that.data.city == '' || that.data.checkValue.length==0){
     wx.showToast({
       title: '未填写选择相关信息',
        icon:'none',
        duration:3000
     })
    }
    else{
      db.collection('boxlist').add({
        data:formdata,
        success:function(res){
          // console.log(res);
          wx.navigateTo({
            url: '../list',
          })
        }
      })
      
    }
    console.log(formdata)
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