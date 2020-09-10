import api from '@/axios'

export default {
  async GetCoupons ({ commit }, apiData) {
    console.log('GetCoupons')
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    if (res && res.data && res.data.success) {
      commit('GETCOUPONS', res.data)
      commit('SETPAGINATION', res.data.pagination)
    }
    return res.data
  },
  async DelCoupon ({ commit }, apiData) {
    console.log('DelCoupon')
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    return res.data
  },
  async AddCoupon ({ commit }, apiData) {
    console.log('AddCoupon')
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    console.log('SETLOADING')
    return res.data
  },
}
