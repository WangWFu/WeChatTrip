// miniprogram/pages/index/Publish/publish.js
var date = require('../../../utils/utils.js')
const chooseLocation = requirePlugin('chooseLocation');
const db=wx.cloud.database();
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: [], //临时存放图片目录的空数组,
    // isimage: false, //判读是否上传了图片
    date: '', //当前时间
    tag:'#游记',
    tagSel:'',      //标签选中文本
    tag_active: false,  //标签选择
    address:'添加拍摄地点',
    text:'',       //文本数据
    textTitle:'',
    islocation:true,   //
    location:{},   //获取的地址
    fileIDs:[],  //上传图片后的地址

    _openid:'',  //id
    nickName:'',  //用户名
    avatarUrl:'',   //头像

    zanNum:0,
    loveNum:0,
    collenNum:0,


    settings:[
      { name: '自己可见', value:'proviate'},
      { name: '别人可见', value: 'public',checked:'true'},
      ],
    key:'public'
  },

  radioChange(e){
    let key = e.detail.value;
    var that=this;
    that.setData({
      key:key
    })
    console.log(e.detail.value)
  },
  //标题 
  getTextTitle:function(e){
    var that = this;
    that.setData({
      textTitle: e.detail.value
    })
  },
  // 内容
  getText:function(e){
    var that=this;
    that.setData({
      text:e.detail.value
    })
  },

  // 删除照片 &&
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgSrc = this.data.imgSrc;
    imgSrc.splice(index, 1)
    that.setData({
      imgSrc: imgSrc
    });
  },
  // 选择图片 &&&
  addPic1: function (e) {
    var imgSrc = this.data.imgSrc;
    console.log(imgSrc)
    var that = this;
    var n = 9;
    if (9 > imgSrc.length > 0) {
      n = 9 - imgSrc.length;
    } else if (imgSrc.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
         console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (imgSrc.length == 0) {
          imgSrc = tempFilePaths
        } else if (9 > imgSrc.length) {
          imgSrc = imgSrc.concat(tempFilePaths);
        }
        that.setData({
          imgSrc: imgSrc
        });
        
      }
    })
  },

  //图片
  imgbox: function (e) {
    this.setData({
      imgSrc: e.detail.value
    })
  },



  // 预览图片
  previewImage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      current: index,
      urls: that.data.imgSrc,
    })
  },


  // 添加标签
  tagActive: function(e) {
    var that = this;
    var tag = that.data.tag_active;
    if (tag) {
      that.setData({
        tag_active: false,
        tagSel: ''
      })
    } else {
      that.setData({
        tag_active: true,
        tagSel: '游记'
      })
    }
    
  },

  //跳转地图
  getLocation:function(){
    var that = this;
    const key = '4CQBZ-2QQ6F-NEIJX-JZY44-TKCSZ-N6BXP'; //使用在腾讯位置服务申请的key
    const referer = 'demo'; //调用插件的app的名称
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.getLocation()
            }
          })
        }
      }
    })
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
    });
},

  // 日期选择
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
    })
  },

// 发布
  publish:function(e){

    if (!this.data.imgSrc.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      //上传图片到云存储
     
      let promiseArr = [];
      for (let i = 0; i < this.data.imgSrc.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.imgSrc[i];
          // var name = Math.random() * 1000000;
          // var timestamp = name + item.match(/\.[^.]+?$/)[0] + ' ';
          let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
          // var timestamp = new Date().getTime() + suffix + ' ';
          wx.cloud.uploadFile({
            cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
            // cloudPath:  timestamp, // 上传至云端的路径
            filePath: item, // 小程序临时文件路径
            success: res => {
              this.setData({
                 fileIDs: this.data.fileIDs.concat(res.fileID)
              });
              console.log(res.fileID)//输出上传后图片的返回地址
              reslove();
              // wx.navigateTo({
              //   url: '../index/index',
              // })
              wx.navigateBack({
                delta: 1
              })
              wx.showToast({
                icon:'none',
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
        }));
      }
      Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        this.setData({
          imgSrc: []
        })
        // var imgUrl=[]
        // var img = new Array(this.data.fileIDs.trim().split(' '));
        // console.log(img)
        // console.log(this.data.fileIDs.trim().split(' '))
        var formdata = {
          textTitle: this.data.textTitle,
          text: this.data.text,
          imgUrl: this.data.fileIDs,
          location: this.data.location.name,
          tagSel: this.data.tagSel,
          date: this.data.date,
          nickName:this.data.nickName,
          avatarUrl:this.data.avatarUrl,
          zanNum: this.data.zanNum,
          loveNum: this.data.loveNum,
          collenNum: this.data.collenNum,
          isShow:false,
          key:this.data.key
        }
        
        db.collection('triplist').add({
          data:formdata,
          success:function(res){
            console.log(res);
          }
        })
      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 获取当前时间
    that.setData({
      date: date.formatTime(new Date()),
      _openid:options._openid
    })
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
    //  wx.getSetting({
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
  onReady: function() {
    // console.log('onready')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log('onshow')
    var that=this;
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location)
    if(location!=null){
      that.setData({
        location: location,
        islocation:false
      })
    }

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