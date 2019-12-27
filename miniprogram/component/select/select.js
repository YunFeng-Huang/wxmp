// component/select/select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    oneIndex:{
      type:Number
    },
    twoIndex:{
      type:Number
    },
    itemFood:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    add: function (e) {
      // 注册点击事件传给父组件
      this.triggerEvent('add',e.target.dataset)
    },
    reduce:function (e) {
      // 注册点击事件传给父组件
      this.triggerEvent('reduce',e.target.dataset)
    },
  }
})
