import { GETPRODUCTS, UPDATEPRODUCT } from './type'

export default {
  [GETPRODUCTS] (state, data) {
    state.products = data.products
  },
  [UPDATEPRODUCT] (state, data) {
    // state.products = data.products
    // console.log('state.products:', state.products)
  }
}
