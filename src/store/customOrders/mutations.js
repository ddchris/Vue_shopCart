import { GETPRODUCTSALL, GETPRODUCT, GETCART, DELALL } from './type'

export default {
  [GETPRODUCTSALL] (state, data) {
    state.productsAll = data.products
  },
  [GETPRODUCT] (state, data) {
    state.product = data.product
  },
  [GETCART] (state, data) {
    if (data.success) {
      if (
        data.data.carts &&
        data.data.carts.length !== 0
      ) {
        state.carts = data.data.carts
        state.total = data.data.total
        state.finalTotal = data.data.final_total
        state.showOrder = true
      } else {
        state.carts = []
        state.showOrder = false
      }
    }
  },
  [DELALL] (state ) {
    state.carts = []
    state.showOrder = false
  }
}
