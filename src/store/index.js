import Vue from 'vue'
import Vuex from 'vuex'
import { SETLOADING, SETPAGINATION  } from './type'
import coupons from './coupons'
import products from './products'
import orders from './orders'
import './customOrders'
import './login'
import './orders'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
    isFullPage: false,
    pagination: {},
    ...coupons.states,
    ...products.states,
    ...orders.states
  },
  mutations: {
    [SETLOADING] (state, data) {
      state.isLoading = data.isLoading
      state.isFullPage = data.isFullPage
    },
    [SETPAGINATION] (state, pagination) {
      state.pagination = pagination
    },
    ...coupons.mutations,
    ...products.mutations,
    ...orders.mutations
  },
  actions: {
    ...coupons.actions,
    ...products.actions,
    ...orders.actions
  }
})
