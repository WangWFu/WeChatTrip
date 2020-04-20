// miniprogram/pages/watchdetail/watchdetail.js
const db = wx.cloud.database();
const app = getApp();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watchlist:[],
    avatarUrl:'',
    nickName:'',
    text:'',
    location:'',
    num:'',
    isActive:false,

    id:'',
    commendlist:[],
    pubid:'',  //发布悬赏的用户_openid


    getwatch:[],   //采纳悬赏的数据
    disabled:false,

    isSimple:'',

    useid:''   //进入用户的_openid
  },
  getPhoto:function(){
    var that=this;
   // 查看是否授权
   wx.getSetting({
    success (res){
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.navigateTo({
          url: './watchpublish/watchpublish?id=' + that.data.id,
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

  // 采纳
  getInfo:function(e){
      var that=this;
      var id=e.currentTarget.dataset.id;
    var iid = e.currentTarget.dataset.iid;  //index
    var arr=that.data.commendlist[iid]    //index指向的数组
    // console.log(arr)
    // console.log(iid)
      var num=that.data.watchlist.num;  //悬赏的金币数
      // console.log(num)
      // console.log(id)
      var openid = e.currentTarget.dataset.openid  //
  if(openid === that.data.useid){
    wx.showToast({
      title: '你不能选择自己的帮助为最佳',
      icon: 'none',
      duration: 2000
    })    
  }else{
    wx.showModal({
      title: '提示',
      content: '确定选择为最佳',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          // 采纳  将数据上传到getwatch集合   然后通过集合查询数据展示到顶部
          db.collection('getwatch').add({
            data:{
              id:arr.id,
              nickName: arr.nickName,
              imgUrl: arr.imgUrl,
              date: arr.date,
              avatarUrl: arr.avatarUrl,
              text: arr.text,
              getopenid: arr._openid,
              getnum:that.data.watchlist.num
            },
            success:function(res){
              console.log('233')
              that.onShow()
            }
          })

          // 扣除自己的金币
          new Promise(function(resolve,reject){
            db.collection('money').where({
              _openid: that.data.pubid
            }).get({
              success: function (res) {
                var delnum = res.data[0].moneyNum - that.data.watchlist.num
                resolve(delnum)
              }
            })
          }).then(res=>{
            console.log(res)
              // 更新自己的金币数目
            db.collection('money').where({
              _openid: that.data.pubid
            }).update({
              data:{
                moneyNum:res
              },
              success:function(res){
                console.log('1111')
              }
            })
          })
          
          // 更新被采纳者的金币数
          wx.cloud.callFunction({
            name: 'update',
            data: {
              _openid: arr._openid,
              num: that.data.watchlist.num
            },
            success: function (res) {
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
      
   
  },
  // 预览图片
  previewImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      // current: that.data.commendlist[index].imgUrl,
      urls: [that.data.commendlist[index].imgUrl],
    })
  },
  //预览采纳的图片
  previewImage1(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      // current: that.data.commendlist[index].imgUrl,
      urls: [that.data.getwatch.imgUrl],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.id)
      console.log(options.pubid)
      console.log(options.useid);
      
    var that = this;
    that.setData({
      id: options.id,
      pubid:options.pubid,
      useid:options.useid
    })
    //判断是否是发布者进入
    if(options.pubid === options.useid){
      that.setData({
        isSimple:true
      })
    }
    // // 查询悬赏内容
    // db.collection('watchlist').doc(options.id).get({
    //   success: function (res) {
    //     // console.log(res)
    //     that.setData({
    //       watchlist: res.data,
    //       // commendlist: res.data.commend
    //     })
    //     // console.log(res.data.commend)
    //   }
    // })
    // // 查询悬赏评论
    // db.collection('watchcom').where({
    //   id:options.id
    // }).get({
    //   success:function(res){
    //     console.log(res)
    //     that.setData({
    //       commendlist:res.data
    //     })
    //   }
    // })
    // // 查询采纳悬赏
    // db.collection('getwatch').where({
    //   id:options.id
    // }).get({
    //   success:function(res){
    //   console.log(res)
    //   if(res.data.length!=0){
    //     that.setData({
    //       getwatch: res.data[0],
    //       disabled:true
    //     })
    //   }
     
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
    // 获取悬赏
    db.collection('watchlist').doc(that.data.id).get({
      success: function (res) {
        // console.log(res)
        that.setData({
          watchlist: res.data,
        })
      }
    })
// 获取评论
    db.collection('watchcom').where({
      id: that.data.id,
      isShow:true
    }).get({
      success: function (res) {
        console.log(res)
        that.setData({
          commendlist: res.data
        })
      }
    })
    const watcher = db.collection('watchcom')
    .where({
      id: that.data.id,
     isShow:true
    })
    .watch({
      onChange: function(snapshot) {
        console.log('docs\'s changed events', snapshot.docChanges)
        console.log('query result snapshot after the event', snapshot.docs)
        console.log('is init data', snapshot.type === 'init')
        that.setData({
          commendlist:snapshot.docs
        })
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
   
    // 查询采纳悬赏
    db.collection('getwatch').where({
      id: that.data.id
    }).get({
      success: function (res) {
        console.log(res)
        if (res.data.length != 0) {
          that.setData({
            getwatch: res.data[0],
            disabled: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // watcher.close()
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