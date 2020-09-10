import api from '@/axios'

export default {
  async GetProducts ({ commit }, apiData) {
    console.log('GetProducts')
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    if (res && res.data && res.data.success) {
      commit('GETPRODUCTS', res.data)
      commit('SETPAGINATION', res.data.pagination)
    }
    return res.data
  },
  async UpdateProduct ({ commit }, apiData) {
    console.log('UpdateProduct')
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    console.log('res:', res)
    if (res && res.data && res.data.success) {
      commit('UPDATEPRODUCT', res.data)
      // commit('SETPAGINATION', res.data.pagination)
    }
    return res.data
  },
  async DelProduct ({ commit }, apiData) {
    console.log('UpdateProduct')
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    console.log('res:', res)
    return res.data
  },
}
