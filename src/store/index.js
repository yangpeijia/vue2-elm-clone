import Vue from 'vue'
import Vuex from 'vuex'
import BScroll from '.././components/BScroll/better-scroll.vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    totalCount: 0
  },
  mutations: {
    increment: state => {
      if (!BScroll.methods.isConstructed()) {
        return
      }
      state.count++
      state.totalCount++
    },
    decrement: state => {
      state.count--
      state.totalCount--
    },
    reset: state => {
      state.totalCount = 0
    }
  }
})