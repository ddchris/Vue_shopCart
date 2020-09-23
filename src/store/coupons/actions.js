import api from '@/axios'

export default {
  async GetCoupons ({ commit }, apiData) {
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    if (res && res.data && res.data.success) {
      commit('GETCOUPONS', res.data)
      commit('SETPAGINATION', res.data.pagination)
    }
    return res.data
  },
  async DelCoupon ({ commit }, apiData) {
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    return res.data
  },
  async AddCoupon ({ commit }, apiData) {
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    return res.data
  },
}
