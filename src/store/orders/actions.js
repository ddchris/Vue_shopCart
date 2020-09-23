import api from '@/axios'

export default {
  async GetOrders ({ commit }, apiData) {
    let res = await api(apiData)
    commit('SETLOADING', { isLoading: false, isFullPage: false })
    if (res && res.data && res.data.success) {
      commit('GETORDERS', res.data)
      commit('SETPAGINATION', res.data.pagination)
    }
    return res.data
  }
}
