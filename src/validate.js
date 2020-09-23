
import Vue from 'vue'
import { ValidationProvider, extend, localize, configure, ValidationObserver  } from 'vee-validate'
import { required, email, regex, alpha_num, max, min, confirmed, image, digits, ext, size } from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'
import TW from 'vee-validate/dist/locale/zh_TW.json'

// localize({
//   en: {
//     names: {
//       email: 'E-mail Address',
//       password: 'Password'
//     }
//   },
//   tw: {
//     names: {
//       email: 'البريد الاليكتروني',
//       password: 'كلمة السر'
//     }
//   }
// })

// localize('zh_TW', TW)

extend('email', email)
extend('regex', regex)
extend('confirmed', {
  ...confirmed,
  message: (field) => `${field} is required!`
})
extend('max', {
  ...max,
  props: ['length'],
  validate: (value, { length }) => {
    if(!value) return false
    return (value + '').length <= length
  },
  message: (a, { length } ) => `長度不得超過${length}個字!`
})
extend('digits', {
  ...digits,
  validate: value => {
    console.log('digits', value);
    return typeof Number(value) === 'number' && !isNaN(Number(value))
  }
})
extend('min', min)
extend('ext', ext)
extend('size', size)
extend('alpha_num', alpha_num)
extend('image', image)
// extend('digits', digits)
extend('required', {
  ...required,
  validate: value  => {
    if (!value) return false
    return true
  },
  message: (field) => `${field} is required!`
})

extend('positive', {
  validate: value => {
    return value > 0
  }
})

extend('min', {
  validate (value, { length } ) {
    return value.length >= length
  },
  params: ['length']
})

extend('minMax', {
  validate (value, { min, max }) {
    return value.length >= min && value.length <= max
  },
  params: ['min', 'max'],
  // message: 'The {_field_} field must have at least {min} characters and {max} characters at most'
  message: (fieldName, placeholders) => {
    return `The ${fieldName} field must have at least ${placeholders.min} characters and ${placeholders.max} characters at most`
  }
})

extend('one_of', (value, values) => {
  return values.indexOf(value) !== -1
})

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: 'Password confirmation does not match'
})

// Note 根據不同驗證狀態，設定對應的 class
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'text-danger is-invalid'
  }
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
