import { GETORDERS } from './type'

export default {
  [GETORDERS] (state, data) {
    console.log('data:', data)
    state.orders = data.orders
  }
}
