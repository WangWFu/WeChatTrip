// miniprogram/pages/Pagedetail/pagedetail.js
const db = wx.cloud.database();
const app = getApp();
var date = require('../../utils/utils.js')
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,
    _openid: '',
    pubid:'',   //发布者的id
    imglist: [], //轮播图
    textlist: '', //内容

    zanActive: '',
    zannum: '',
    loveActive: '', //爱心样式
    lovenum: '', //爱心值
    collectionActive: '',
    collectionnum: '',
    moneyNum:'',    //自己的金币数

    _id: '', //详情id

    // 评论部分
    commentlist: [],
    comment_id: '', //评论id，上传到云自动生成的_id
    comment_pr_id: '', //评论所属文章id
    comment_user_name: '', //评论人姓名
    comment_user_avatar: '', //评论人头像
    comment_text: "", //评论内容
    comment_time: '', //评论时间

    reply_id: 0, //回复谁的评论，
    parent_id: '', //评论所属哪个评论id下面的，
    reply_name: '', //回复人的昵称 
    parent_name: '', //你回复的那个人的昵称
    replay_text: '', //回复的内容
    replay: [],

    placeholder: '就不说一句吗？',
    type: 0, //判断是回复还是评论

    islogin:''
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  // 赞点击事件
  addzan(e) {
    var that = this;
    let key = that.data._id + '1'
    wx.cloud.callFunction({
      name: 'updateTrip',
      data: {
        _id: that.data._id,
        action: 'addzan',
      },
      success: function (res) {
        that.setData({
          zanActive: true,
        })
        // console.log(res)

        // 先查询再进行插入操作
        setTimeout(() => {
          db.collection('zanlist').where({
            _openid: that.data._openid,
            Pid: that.data._id
          }).get({
            success: function (res) {
              // console.log(res.data)
              let id = res.data.Pid;
              if (id !== that.data._id) {
                db.collection('zanlist').add({
                  data: {
                    Pid: that.data._id,
                    zanActive: true,
                  },
                  success: function (res) {
                    // console.log(res)
                  }
                })
              }
            }
          })
        }, 300)

        wx.setStorage({
          key: that.data._id + '1',
          data: {
            zanActive: true,
          },
        })
        that.onShow()
      }
    })
  },
  //取消点赞
  delzan(e) {
    var that = this;
    var delZanNum = that.data.zannum - 1;
    wx.cloud.callFunction({
      name: 'updateTrip',
      data: {
        _id: that.data._id,
        delZanNum: delZanNum,
        action: 'delzan',
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          zanActive: false,
        })
        //删除点赞集合数据
        db.collection('zanlist').where({
          _openid: that.data._openid,
          Pid: that.data._id
        }).remove({
          success: function (res) {
            // console.log(res)
          }
        })
          //缓存状态
        wx.setStorage({
          key: that.data._id + '1',
          data: {
            zanActive: false,
          },
        })

        that.onShow()
      }
    })
  },

//投币
  addmoney() {
    var that = this;
    var delnum = that.data.moneyNum - 1;
    if(that.data._openid !== that.data.pubid){
      wx.showModal({
        title: '提示',
        content: '给游记投上1金币嘛！',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              loveActive: true,
            })
            db.collection('lovelist').where({
              _openid: that.data._openid,
              Pid: that.data._id
            }).get({
              success: function (res) {
                // console.log(res.data)
                let id = res.data.Pid;
                if (id !== that.data._id) {
                  db.collection('lovelist').add({
                    data: {
                      Pid: that.data._id,
                      loveActive: true,
                    },
                    success: function (res) {
                      // console.log(res)
                    }
                  })
                }
              }
            })
            wx.cloud.callFunction({
              name: 'updateTrip',
              data: {
                _id: that.data._id,
                action: 'addmoney',
              },
              success: function (res) {
                // console.log(res)
                db.collection('money').where({
                  _openid:that.data._openid
                }).update({
                  data:{
                    moneyNum:delnum
                  },
                  success:function(res){
                    // console.log(res);
                  }
                })
              }
            })
            wx.setStorage({
              key: that.data._id + '2',
              data: {
                loveActive: true,
              },
            })
            that.onShow()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
     }else{
      wx.showToast({
        title: '不能给自己投币！',
        icon:'none',
        duration: 2000
      })      
     }
  },
 
  // 收藏点击事件

  addcollection(e) {
    var that = this;
    that.setData({
      collectionActive: true,
    })
    wx.cloud.callFunction({
      name: 'updateTrip',
      data: {
        _id: that.data._id,
        action: 'addcollection',
      },
      success: function (res) {
        // console.log(res)

        // 先查询再进行插入操作
        setTimeout(() => {
          db.collection('zanlist').where({
            _openid: that.data._openid,
            Pid: that.data._id
          }).get({
            success: function (res) {
              // console.log(res.data)
              let id = res.data.Pid;
              if (id !== that.data._id) {
                db.collection('collectionlist').add({
                  data: {
                    Pid: that.data._id,
                    collectionActive: true,
                  },
                  success: function (res) {
                    // console.log(res)
                  }
                })
              }
            }
          })
        }, 300)
        wx.setStorage({
          key: that.data._id + '3',
          data: {
            collectionActive: true,
          },
        })
        that.onShow()
      }
    })
  },
  //取消收藏
  delcollection(e) {
    var that = this;
    var delCollectionNum = that.data.collectionnum - 1;
    that.setData({
      collectionActive: false,
    })
    wx.cloud.callFunction({
      name: 'updateTrip',
      data: {
        _id: that.data._id,
        delCollectionNum: delCollectionNum,
        action: 'delcollection',
      },
      success: function (res) {
        // console.log(res)
        wx.setStorage({
          key: that.data._id + '3',
          data: {
            collectionActive: false,
          },
        })
        //删除收藏集合数据
        db.collection('collectionlist').where({
          _openid: that.data._openid,
          Pid: that.data._id
        }).remove({
          success: function (res) {
            // console.log(res)
          }
        })
        that.onShow()
      }
    })
  },


  // 获取评论文本
  getCommentText: function (e) {
    var val = e.detail.value;
    this.setData({
      comment_text: val,
      replay_text: val
    });
  },

  onReplyBlur: function (e) {
    var val = e.detail.value;
    const text = e.detail.value.trim();
    if (text === '') {
      this.setData({
        // reply_name:null,
        // parent_name:null,
        type: 0,
        placeholder: '就不说一句吗？',
        focus: false
      });
    }

  },


  // 回复评论
  replyComment: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.cid;
    var name = e.currentTarget.dataset.name;
    var type = e.currentTarget.dataset.type;
    console.log(id)
    console.log(name)
    console.log(type)
    that.setData({
      placeholder: '回复' + name + ':',
      type: type,
      focus: true,
      parent_id: id,
      reply_name: name,
      comment_user_name: that.data.comment_user_name //你的昵称
    })
  },

  // 评论发送
  sendComment: function () {
    var that = this;
    //一级评论
    var formdata = {
      comment_pr_id: that.data._id, //评论所属文章id
      comment_user_name: that.data.comment_user_name, //当前用户评论人姓名
      comment_user_avatar: that.data.comment_user_avatar, //评论人头像
      comment_text: that.data.comment_text, //评论内容
      comment_time: date.formatTime(new Date()), //评论时间
      replaylist: that.data.replay
    }
    //二级回复
    var replaydata = {
      comment_user_name:that.data.comment_user_name,   //当前用户评论人姓名
      // reply_name: that.data.comment_user_name,   //被回复者姓名
      // reply_name:that.data.reply_name,
      // parent_name: that.data.parent_name,
      replay_text: that.data.replay_text,
      type: that.data.type,
      parent_id: that.data.parent_id
    }
    var Rerplydata = {
      reply_name: that.data.reply_name,
      comment_user_name: that.data.comment_user_name,
      replay_text: that.data.replay_text,
      type: that.data.type,
      parent_id: that.data.parent_id
    }
    if(that.data.comment_text && that.data.replay_text !==''){
 // 查看是否授权
 wx.getSetting({
  success(res) {
    if (res.authSetting['scope.userInfo']) {
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
      if(that.data.type===0){
  db.collection('tripcomment').add({
    data: formdata,
    success: function (res) {
      console.log(res)
      that.setData({
        comment_text: null
      })
      that.onShow();
    }
  })
}
if(that.data.type==='1'){
      console.log('回复')
      wx.cloud.callFunction({
        name:'comment',
        data:{
          id:that.data.parent_id,
          replaydata:replaydata,
          type:1
        },
        success:function(res){
          console.log(res)
              that.setData({
        comment_text: null
      })
      that.onShow();
     
        }
      })
}
if (that.data.type === '2') {
  console.log('再回复')
  wx.cloud.callFunction({
    name: 'comment',
    data: {
      id: that.data.parent_id,
      Rerplydata: Rerplydata,
      type: 2
    },
    success: function (res) {
      console.log(res)
      that.setData({
        comment_text: null
      })
      that.onShow();
    }
  })
}
    } else {
      wx.showModal({
        title: '提示',
        content: '您还未授权，请先授权',
        success(res) {
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
    }else{
      wx.showToast({
        title: '评论内容不能为空',
        icon:'none',
        duration:2000
      })
    }
   

  },




  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id)
    that.setData({
      _id: options.id
    })
    // app.getopenid().then(function (res) {
    //   that.setData({
    //     _openid: res
    //   })
    // })
    wx.getStorage({
      key: '_openid',
      success:function(res){
        that.setData({
          _openid:res.data
        })
        db.collection('money').where({
          _openid:res.data
        }).get({
          success:function(res){
            console.log(res.data[0]);
            that.setData({
              moneyNum:res.data[0].moneyNum
            })
          }
        })
      }
    })
    // 获取详情
    // db.collection('triplist').doc(options.id).get({
    //   success: function (res) {
    //     // console.log(res)
    //     // console.log(res.data.imgUrl)
    //     that.setData({
    //       imglist: res.data.imgUrl,
    //       textlist: res.data,
    //       zannum: res.data.zanNum,
    //       lovenum: res.data.loveNum, //爱心值
    //       collectionnum: res.data.collenNum,

    //     })
    //   }
    // })
    // 获取评论

    // db.collection('tripcomment').where({
    //   comment_pr_id: options.id
    // }).get({
    //   success: function (res) {
    //     // console.log(res.data[1].replaylist)
    //     console.log(res)
    //     that.setData({
    //       commentlist: res.data
    //     })
    //   }
    // })

    // 缓存点赞、爱心、收藏
    setTimeout(() => {
      wx.getStorage({
        key: this.data._id + '1',
        success(res) {
          console.log(res.data)
          that.setData({
            zanActive: res.data.zanActive
          })
        }
      })
      wx.getStorage({
        key: this.data._id + '2',
        success(res) {
          console.log(res.data)
          that.setData({
            loveActive: res.data.loveActive
          })
        }
      })
      wx.getStorage({
        key: this.data._id + '3',
        success(res) {
          console.log(res.data)
          that.setData({
            collectionActive: res.data.collectionActive
          })
        }
      })
    }, 300)


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
    db.collection('triplist').doc(that.data._id).get({
      success: res => {
        that.setData({
          imglist: res.data.imgUrl,
          textlist: res.data,
          zannum: res.data.zanNum,
          lovenum: res.data.loveNum, //爱心值
          collectionnum: res.data.collenNum,
          pubid:res.data._openid
        })
      }
    })
    // app.getopenid().then(function (res) {
    //   wx.getStorage({
    //     key: res,
    //     success: function (res) {
    //       console.log(res)
    //       that.setData({
    //         comment_user_avatar: res.data.userInfo.avatarUrl,
    //         comment_user_name: res.data.userInfo.nickName
    //       })
    //     },
    //   })
    // })
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                comment_user_name: res.userInfo.nickName,
                comment_user_avatar: res.userInfo.avatarUrl,
              })
            }
          })
        } else {

        }
      }
    })


    // 查询评论
    db.collection('tripcomment').where({
      comment_pr_id: that.data._id
    }).get({
      success: function (res) {
        console.log(res.data[1].replaylist)
        console.log(res)
        that.setData({
          commentlist: res.data
        })
      }
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