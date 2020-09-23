import actions from './actions'
import mutations from './mutations'

export default {
  states: {
    productsAll: [],
    product: {},
    carts: [],
    total: 0,
    finalTotal: 0,
    showOrder: false,
  },
  actions,
  mutations
}
