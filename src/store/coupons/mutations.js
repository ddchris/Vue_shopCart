import { GETCOUPONS, ADDCOUPONS, DELCOUPON  } from './type'

export default {
  [GETCOUPONS] (state, data) {
    state.coupons = data.coupons
    state.pagination = data.pagination
  },
  [ADDCOUPONS] (state, coupon) {
    state.coupons.push(coupon)
  },
  [DELCOUPON] (state, id) {
    state.coupons.every((x, index) => {
      console.log('x.id:', x.id)
      console.log('id:', id)
      if (x.id === id) {
        state.coupons.splice(index, 1)
        console.log('state.coupons:', state.coupons)
        return false
      }
      return true
    })
  }
}
