
/**
* Represents a book.
* @param {string} val - The value of v-model
* @param {string} type - The type of restriction.
* @param {Array} between - The length of v-model value.
*/
export function restriction (val, type, between) {

  if (!val) return val
  if (type) {
    let reg = ''
    switch (type) {
      case 'number':
        reg = /[^\d]/g
        break
      case 'engNumber':
        reg = /[^a-zA-Z0-9]/g
        break
      case 'chinese':
        reg = /[^\u4E00-\u9FA5]/g
        break
      case 'chineseEng':
        reg = /[^\u4E00-\u9FA5a-zA-Z]/g
        break
      case 'chineseEngNumber':
        reg = /[^\u4E00-\u9FA5a-zA-Z0-9]/g
        break
      case 'email':
        reg = /[^a-zA-Z0-9.@]/g
        break
      default:
        break
    }
    if (val.replace) val = val.replace(reg, '')
  }
  if (Array.isArray(between) && between.length === 2) {
    if (val.substring) val = val.substring(...(between.map(v => v-1)))
  }
  return val
}

export function throttle(func, threshold = 500) {
  let last, timer
  return function () {
    let args = arguments
    let now = +new Date()
    if (last && now < last + threshold) {
      clearTimeout(timer)
      timer = setTimeout( () => {
        last = now
        func.apply(this, args)
      }, threshold)
    } else {
      last = now
      func.apply(this, args)
    }
  }
}

export function debounce(func, delay = 500) {
  let timer = null
  return function () {
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout( () => {
      func.apply(this, args)
    }, delay)
  }
}
