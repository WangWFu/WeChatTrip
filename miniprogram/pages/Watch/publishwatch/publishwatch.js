// miniprogram/pages/Watch/publishwatch/publishwatch.js
const chooseLocation = requirePlugin('chooseLocation');
const db=wx.cloud.database();
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '点击选择地点',
    num:0,
    islocation: true,
    location: {},
    text:'',   //文本
    avatarUrl:'',
    nickName:'',

    moneyNum:''  //赏金数
  },
  // 获取文本数据
  getValue:function(e){
    var that=this;
    that.setData({
      text: e.detail.value
    })
  },

  // 赏金增加
  add:function(){
    var that=this;
    let num=that.data.num+1;
    if(num<=that.data.moneyNum){
      that.setData({
        num:num
      })
    }else{
      wx.showToast({
        title: '已经是最大值了',
        icon: 'none',
        duration: 2000
      })
    }
   
  },
  // 赏金减少
  del: function () {
    var that = this;
    if (that.data.num>0){
        that.setData({
          num: that.data.num - 1
        })
      }else{
      wx.showToast({
        title: '已经是最小值了',
        icon:'none',
        duration: 2000
      })
      }
   },

  //跳转地图
  getLocation: function () {
    var that = this;
    const key = '4CQBZ-2QQ6F-NEIJX-JZY44-TKCSZ-N6BXP'; //使用在腾讯位置服务申请的key
    const referer = 'demo'; //调用插件的app的名称
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
    });
  },
  // 发布

  submit:function(){
    var that=this;
    var formdata={
      location: this.data.location.name,
      text:that.data.text,
      num:that.data.num,
      avatarUrl: that.data.avatarUrl,
      nickName: that.data.nickName,
      isShow:false
    }
    db.collection('watchlist').add({
      data:formdata,
      success:function(res){
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          icon: 'none',
          title: "上传成功,等待审核",
        })
      }
    })
    console.log(formdata)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: '_openid',
      success:function(res){
        db.collection('money').where({
          _openid:res.data,
        }).get({
          success:function(res){
            console.log(res)
              that.setData({
                moneyNum:res.data[0].moneyNum
              })
          }
        })
      }
    })
    // app.getopenid().then((res) => {
    //   db.collection('money').where({
    //     _openid:res
    //   }).get({
    //     success:function(res){
    //       console.log(res)
    //         that.setData({
    //           moneyNum:res.data[0].moneyNum
    //         })
    //     }
    //   })
    // })
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
      // 查看是否授权
      // wx.getSetting({
      //   success (res){
      //     if (res.authSetting['scope.userInfo']) {
      //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
      //       wx.getUserInfo({
      //         success: function(res) {
      //           console.log(res.userInfo)
      //           that.setData({
      //             nickName: res.userInfo.nickName,
      //             avatarUrl: res.userInfo.avatarUrl,
      //           })
      //         }
      //       })
      //     }else{
      //     }
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
    var that = this;
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location)
    if (location != null) {
      that.setData({
        location: location,
        islocation: false
      })
    }


   
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