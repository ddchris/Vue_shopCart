import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    //用戶輸入不存在頁面時導回產品首頁(未登入導回登入頁面)
    {
      path: '*',
      redirect: 'admin/products'
    },
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import('@/components/pages/Login')
    },
    {
      path: '/admin',
      name: 'Dashboard',
      meta: {
        requireAuth: true
      },
      component: () =>
        import('@/components/Dashboard'),
      children: [{
        path: 'products',
        name: 'Products',
        component: () =>
          import('@/components/pages/Products'),
        meta: {
          requireAuth: true
        }
      }, ]
    }
  ]
})
