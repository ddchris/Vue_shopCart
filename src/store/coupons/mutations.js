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
    state.coupons.every((coupon, index) => {
      if (coupon.id === id) {
        state.coupons.splice(index, 1)
        return false
      }
      return true
    })
  }
}
