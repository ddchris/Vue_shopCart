import Vue from 'vue'
import Vuex from 'vuex'
import { LOADING } from './type'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: true
  },
  mutations: {
    [LOADING] (state, status) {
      state.isLoading =  status
    }
  }
})
