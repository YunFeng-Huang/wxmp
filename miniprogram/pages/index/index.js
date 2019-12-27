//index.js
const app = getApp()
// let goods = require('../../../goods.js/index.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    goods:[],
    ActiveSilderIndex:0,
    toView:'good0',
    BoPopType:false,
    tabs: ["下单", "我的订单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    var that = this;
    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
            });
        }
    });
    this.onQuery()
    this.setData({
      nbTitle: '新标题',
      nbLoading: true,
      nbFrontColor: '#ffffff',
      nbBackgroundColor: '#000000',
    })
  },
  tabClick: function (e) {
      this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
      });
  },
  collection:()=>{
    const db = wx.cloud.database()
    const todos = db.collection('todos')
    todos.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        description: "learn cloud database",
        due: new Date("2018-09-01"),
        tags: [
          "cloud",
          "database"
        ],
        // 为待办事项添加一个地理位置（113°E，23°N）
        location: new db.Geo.Point(113, 23),
        done: false
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },
  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('goods').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        res.data.map((item)=>{
          item.food.foods.map((k)=>{
            k.count = 0;
          })
        })
        this.setData({
          goods: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  ActiveSilder(e){
    console.log(e.currentTarget.dataset.num)
    console.log('good'+e.currentTarget.dataset.num)
    this.setData({
      ActiveSilderIndex:e.currentTarget.dataset.num,
      toView:'good'+e.currentTarget.dataset.num
    })
  },
  scroll() {
    wx.createSelectorQuery().select('.header-w').boundingClientRect((rect) => {
      let height = rect.height
      wx.createSelectorQuery().select('.weui-navbar').boundingClientRect((res) => {
        height += res.height
        wx.createSelectorQuery().selectAll('.goodItem').boundingClientRect((v) => {
          let sum = 0
          v.map((item)=>{
            if(item.top <= height){
              sum =  item.dataset.num
            }
          })
          console.log('按钮距离顶部位置', sum)
          this.setData({
            ActiveSilderIndex:sum
          })
        }).exec()
      }).exec()
    }).exec()
  },
  add(e){
    let {oneindex,twoindex} = e.detail
    this.data.goods[oneindex].food.foods[twoindex].count++
    this.setData({
      goods: this.data.goods
    })
  },
  reduce(e){
    let {oneindex,twoindex} = e.detail
    this.data.goods[oneindex].food.foods[twoindex].count > 0 && this.data.goods[oneindex].food.foods[twoindex].count--
    this.setData({
      goods: this.data.goods
    })
  },
  empty(){
    this.data.goods.map((item)=>{
      item.food.foods.map((k)=>{
        k.count = 0;
      })
    })
    this.showPop()
    this.setData({
      goods: this.data.goods
    })
  },
  showPop(e){
    this.setData({
      BoPopType: !this.data.BoPopType
    })
  }
})
