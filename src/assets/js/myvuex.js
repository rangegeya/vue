import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const myvuex = new Vuex.Store({
  state: { count: 2, active: '', BaseImgsUrl: 'http://121.36.6.20:81/test2/public/' },
  mutations: {
    tabChange (state, prarm) {
      state.active = prarm
    }
  }
})
export default myvuex
