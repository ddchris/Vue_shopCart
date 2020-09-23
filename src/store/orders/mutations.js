import { GETORDERS } from './type'

export default {
  [GETORDERS] (state, data) {
    state.orders = data.orders
  }
}
