// miniprogram/pages/Me/me.js
const app = getApp();
const db = wx.cloud.database();
var date = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbox: [{
      value: 0,
      name: '自己可见',
      checked: false,
    }, {
      value: 1,
      name: '别人可见',
      checked: false,
    }],
    _id:'',    //选择的_id

    index: 1,
    list: [],

    _openid: '',
    avatarUrl: '',
    nickName: '',

    isactive: false, //签到标签
    moneyNum: 0,
    isSign: false,

    olddate: '',
    newdate: '',

    islogin:false,
    already:true,  //检查在money集合里是否已经有数据了

    logname:''
  },
  // 弹出框
  showModal(e) {
    var that=this;
    let i=e.currentTarget.dataset.index;
    let key=that.data.list[i].key;
    let _id=e.currentTarget.dataset.id
    console.log(_id)
    if(key==='public'){
      that.setData({
       'checkbox[1].checked':true
      })
    }
    else if (key === 'proviate') {
      that.setData({
        'checkbox[0].checked': true
      })
    }
    this.setData({
      modalName: e.currentTarget.dataset.target,
      _id:_id
    })
  },
  //隐藏框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
// 改变可见性
  ChooseCheckbox(e) {
    let values = e.currentTarget.dataset.value;
    if(values===0){
      this.setData({
        'checkbox[0].checked': true,
        'checkbox[1].checked':false
      })
    }else{
      this.setData({
        'checkbox[1].checked': true,
        'checkbox[0].checked': false,
      })
    }
  },
  //更新状态
  upModal(){
      var that=this;
      let box=that.data.checkbox;
      let b=box.filter(function(item){
        return item.checked===true
      })
      if(b[0].value===1){
        //别人可见
        db.collection('triplist').doc(that.data._id).update({
          data:{
            key:'public'
          },
          success:function(res){
            console.log(res)
            that.hideModal()
          }
        })
      }else{
        //自己可见
        db.collection('triplist').doc(that.data._id).update({
          data: {
            key: 'proviate'
          },
          success: function (res) {
            console.log(res)
            that.hideModal()
          }
        })
      }
  },
  //动态
  navchange: function(e) {
    var that = this;
    that.setData({
      index: e.target.dataset.index
    })
  },
//更多
  navchangeTo: function(e) {
    var that = this;
    that.setData({
      index: e.target.dataset.index
    })

  },

  //money
  Toaddmoney() {
    var that = this;
    var num = that.data.moneyNum + 1;
    if (!that.data.isactive) {
      console.log('ok')
      db.collection('money').where({
        _openid: that.data._openid
      }).update({
        data: {
          moneyNum: num,
          date: that.data.newdate
        },
        success(res) {
          console.log('success')
          that.onShow();
          that.setData({
            isactive: true
          })
          wx.showToast({
            title: '签到成功~',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '你已签到过了~',
        icon: 'none',
        duration: 2000
      })
    }
  },



  goWatch(){
    wx.navigateTo({
      url: '../mywatch/mywatch',
    })
  },
  goList(){
    wx.navigateTo({
      url: '../mybillgroup/mybillgroup',
    })
  },
  goZan() {
    wx.navigateTo({
      url: '../myzan/myzan?key=' + 'zan',
    })
  },
  goCollection() {
    wx.navigateTo({
      url: '../myzan/myzan?key=' + 'collection',
    })
  },
  goAbout(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  // 详情
  goToDetial: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Pagedetail/pagedetail?id=' + id,
    })
  },

  


  //长按删除
  longDel(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    // console.log(id);
    wx.showModal({
      title: '提示',
      content: '要删除动态吗？',
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          db.collection('triplist').where({
            _openid: that.data._openid,
            _id: id
          }).remove({
            success: function(res) {
              that.onShow();
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })

  },
  //点击授权获取用户信息
  getUserInfo: function (e) {
    var that=this;
    console.log(e.detail.userInfo)
  if(e.detail.userInfo) {
      that.setData({
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        islogin:true
      })
     wx.setStorage({
        key: that.data._openid,
        data:{
          userInfo:e.detail.userInfo,
        } 
      })
      if(!that.data.already){
       db.collection('money').add({
        data:{
          moneyNum:0,
          date:0
        },
        success:function(res){
          console.log('3444')
        }
      })
      }
  } else {
    wx.showModal({
      title: '提示',
      content: '你取消了授权，请允许授权',
    })
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.a)
    var that = this;
    let timer = date.formatTime(new Date())
    // console.log(timer)
    //通过检查是否授权，来显示头像
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
                islogin:true
              })
            }
          })
        }else{
          that.setData({
            logname:'授权登录',
            avatarUrl:'',
          })
        }
      }
    })


    // app.getopenid().then(function(res) {
    //   let _openid = res;
    //   // console.log(_openid)
    //   that.setData({
    //     _openid: res
    //   })
    //   // 获取游记
    //   db.collection('triplist').where({
    //     _openid: res
    //   }).get({
    //     success: function(res) {
    //       // console.log(res)
    //       that.setData({
    //         list: res.data
    //       })
    //       let d=res.data.filter(function(item){
    //         return item.key==='public'
    //       })
    //       console.log(d)
    //     }
    //   })

    //   // 用今天的时间去查询是否有数据来判断是否签到
    //   db.collection('money').where({
    //     _openid: res,
    //     date: timer
    //   }).get({
    //     success(res) {
    //       if (res.data.length == 0) {
    //         console.log('22')
    //         that.setData({
    //           isactive: false
    //         })
    //         db.collection('money').where({
    //           _openid: _openid
    //         }).get({
    //           success: function(res) {
    //             // console.log(res)
    //             that.setData({
    //               moneyNum: res.data[0].moneyNum,
    //               already:true
    //             })
    //           }
    //         })
    //       } else {
    //         // console.log(res)
    //         that.setData({
    //           moneyNum: res.data[0].moneyNum,
    //           isactive: true
    //         })
    //       }
    //     }
    //   })
    // })

      wx.getStorage({
        key: '_openid',
        success:function(res){
          that.setData({
            _openid: res.data
          })
 // 获取游记
 db.collection('triplist').where({
  _openid:  res.data
}).get({
  success: function(res) {
    // console.log(res)
    that.setData({
      list: res.data
    })
    let d=res.data.filter(function(item){
      return item.key==='public'
    })
    console.log(d)
  }
})

// 用今天的时间去查询是否有数据来判断是否签到
db.collection('money').where({
  _openid:  res.data,
  date: timer
}).get({
  success(res) {
    if (res.data.length == 0) {
      console.log('22')
      that.setData({
        isactive: false
      })
      db.collection('money').where({
        _openid:  res.data
      }).get({
        success: function(res) {
          // console.log(res)
          that.setData({
            moneyNum: res.data[0].moneyNum,
            already:true
          })
        }
      })
    } else {
      // console.log(res)
      that.setData({
        moneyNum: res.data[0].moneyNum,
        isactive: true
      })
    }
  }
})
        }
      })

    // 获取当前时间
    that.setData({
      newdate: date.formatTime(new Date()),
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
    var that = this;

    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // console.log('[云函数] [login] user openid: ', res.result.openid)
        db.collection('money').where({
          _openid: res.result.openid
        }).get({
          success: function(res) {
            that.setData({
              moneyNum: res.data[0].moneyNum,
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    app.getopenid().then(function(res){
      // 获取游记
      db.collection('triplist').where({
        _openid: res
      }).get({
        success: function (res) {
          // console.log(res)
          that.setData({
            list: res.data
          })
         
        }
      })
    })
    
  //实时更新数据
    // app.getopenid().then(function (res) {
    //   const watcher = db.collection('money').where({
    //     _openid: res
    //   }).watch({
    //     onChange: function (snapshot) {
    //       var data = snapshot.docs;
    //       console.log(data.length)
    //       var end = snapshot.docs.pop();
    //       console.log(end)
    //        var a = snapshot.docChanges.pop();
    //       console.log(a)
    //       if(!end){
    //         console.log('2222')
    //         that.setData({
    //           isactive: false,
    //           moneyNum: 0,
    //         })
    //       }
    //      else if (end.date === that.data.newdate){
    //         console.log('2444')
    //         that.setData({
    //           isactive: end.isactive,
    //           moneyNum: end.moneyNum,
    //         })
    //       }else{
    //         console.log('555')
    //         that.setData({
    //           isactive: false,
    //           moneyNum: end.moneyNum,
    //         })
    //       }
    //       console.log('docs\'s changed events', snapshot.docChanges)
    //       console.log('query result snapshot after the event', snapshot.docs)
    //       console.log('is init data', snapshot.type === 'add')
    //     },
    //     onError: function (err) {
    //       console.error('the watch closed because of error', err)
    //     }
    //   })
    // })



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