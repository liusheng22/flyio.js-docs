// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './stylus/main.styl'
import App from './App'
import router from './router'
var Fly=require("flyio.js/dist/npm/fly")
Vue.config.productionTip = false
// 避免使用 Object.assign，改用简单赋值
window.log = console.log.bind(console)
window.fly = new Fly
window.Fly = Fly
window.bus = new Vue()
window.store = {
  title:"",
  menus:{},
  map:{}
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

console.log("%c***********************\n" +
  "本站使用fly作为网络请求库\n" +
  "github: https://github.com/liusheng22/flyio \n" +
  "author: liusheng22, 欢迎 star! \n"+
  "***********************",'color: teal')
console.log("您可以直接输入fly验证其功能")
