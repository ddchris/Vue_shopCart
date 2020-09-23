import api from '@/axios'

export default {
  async GetProductsAll ({ commit }, apiData) {
    let res = await api(apiData)
    // commit('SETLOADING', { isLoading: false, isFullPage: false })
    if (res && res.data && res.data.success) {
      commit('GETPRODUCTSALL', res.data)
      commit('SETPAGINATION', res.data.pagination)
    }
    return res.data
  },
  async GetProduct ({ commit }, apiData) {
    let res = await api(apiData)
    if (res && res.data && res.data.success) {
      commit('GETPRODUCT', res.data)
      commit('SETPAGINATION', res.data.pagination)
    }
    return res.data
  },
  async CreateOrder ({ commit }, apiData) {
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: true })
    return res.data
  },
  async AddCart ({ commit }, apiData) {
    let res = await api(apiData)
    return res.data
  },
  async GetCart ({ commit }, apiData) {
    let res = await api(apiData)
    commit('GETCART', res.data)
    commit('SETLOADING', { isLoading: false, isFullPage: true })
    return res.data
  },
  async DelItem ({ commit }, apiData) {
    let res = await api(apiData)
    return res.data
  },
  async AddCouponCode ({ commit }, apiData) {
    let res = await api(apiData)
    return res.data
  }
}
