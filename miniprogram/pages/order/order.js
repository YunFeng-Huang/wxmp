// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgTextStyle: 'dark',
    scrollTop: '200rpx',
    bgColor: '#ff0000',
    bgColorTop: '#00ff00',
    bgColorBottom: '#0000ff',
    nbTitle: '确定支付信息',
    nbLoading: false,
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    shopList:[],
    fee:10,
    form:{
      textarea:'请填写备注'
    },
    address:{
      value:'浙江省杭州市滨江区江南大道德信Al产业园（杭州市滨江区伟业路3号）',
      name:'黄',
      phone:'17742007513'
    },
    showTextarea:false
  },
  bindinput(e){
    this.setData({
      'form.textarea' : e.detail.value
    })
  },
  bindFormSubmit: function(e) {
    console.log(e.detail.value.textarea)
  },
  openTextarea(){
    this.setData({
      showTextarea:true
    })
  },
  bindTextAreaBlur(){
    this.setData({
      showTextarea:false
    })
  },
  next(){
    let array = this.data.shopList
    let price = 0
    for (let i = 0; i < array.length; ++i) {
      price+=array[i].count * array[i].price
    }
    price+=this.data.fee
    // wx.showModal({
    //   title: '提示',
    //   content: `
    //   支付参数
    //   textarea : ${this.data.form.textarea || this.data.value}
    //   price: ${price}
    //   `,
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
    wx.requestPayment({
      timeStamp: +new Date(),
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success (res) { },
      fail (res) { }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage');
    // eventChannel.emit('someEvent', {data: 'test'});
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data)=> {
      console.log(data)
      this.setData({
        shopList : data.data
      })
    })
    console.log(this.data.shopList,'onLoad')
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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