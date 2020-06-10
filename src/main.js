// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入使用组件emement-ui
import ElementUI from 'element-ui'
import myaxios from '@/assets/js/myaxios.js'
import myvuex from '@/assets/js/myvuex.js'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/style.css'
// 引入插件

Vue.use(ElementUI)
Vue.use(myaxios)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: myvuex
})
