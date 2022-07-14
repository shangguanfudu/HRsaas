export const imageerror = {
  // 指令所在的标签插入到DOM中的时候就会执行
  // inserted (el, binding) {
  //   // el.src = binding.value
  //   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
  // },
  // 数据更新的时候就执行
  update (el, binding) {
    // el.src = binding.value
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    el.onerror = function () {
      el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
