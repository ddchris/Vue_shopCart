// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.min.css';
import 'bootstrap'
//第三方套件習慣往上放

import App from './App'
import router from './router'
//自己定義套件放下邊

Vue.use(VueAxios, axios)
//全域使用第三方 Loading 套件
Vue.component('Loading', Loading)
Vue.config.productionTip = false

axios.defaults.withCredentials = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

//全域導航守衛,判斷需要驗證身分頁面
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth === true) {
    console.log('這裡需要驗證');
    checkLogin(next)
  } else {
    next();
  }
})

function checkLogin(next) {
  const api = `${process.env.APIPATH}/api/user/check`
  axios.post(api)
    .then(response => {
      console.log(response);
      if (response.data.success === true) {
        next();
      } else {
        //若使用者未登入導回登入頁面
        next({
          path: '/login'
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
