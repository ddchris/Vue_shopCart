<template>
  <div>
    <!-- 商品內容 start -->
    <!-- 外層加上 BS4 格線用 div -->
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in productsAll" :key="item.id">
        <div class="card border-0 shadow-sm">
          <!-- 綁定背景圖片 -->
          <div
            style="
              height: 150px;
              background-size: cover;
              background-position: center;
            "
            :style="{ backgroundImage: `url(${item.imageUrl})` }"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{
              item.category
            }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.description }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <del class="h6"
                >原價 &nbsp; {{ item.origin_price | currency }} &nbsp;
              </del>
              <div class="h5">
                現在只要 &nbsp; {{ item.price | currency }} &nbsp;
              </div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              @click="getProduct(item.id)"
              type="button"
              class="btn btn-outline-secondary btn-sm"
            >
              <i
                class="fas fa-spinner fa-spin"
                v-if="status.loadingItem === item.id"
              ></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-success btn-sm ml-auto"
              @click="addCart(item.id, 1, false)"
            >
              <i
                v-if="status.addItem === item.id"
                class="fas fa-spinner fa-spin"
              ></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 商品內容 end -->

    <!-- 商品 Modal start -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{ product.title }}</span>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="" />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote text-right"></footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">
                {{ product.origin_price }} 元
              </div>
              <del class="h6" v-if="product.price"
                >原價 {{ product.origin_price }} 元</del
              >
              <div class="h4" v-if="product.price">
                現在只要 {{ product.price }} 元
              </div>
            </div>
            <select
              name="number"
              class="form-control mt-3"
              v-model="product.num"
            >
              <option value="1" selected>選購1{{ product.unit }}</option>
              <option v-for="n in 9" :value="n + 1" :key="n">
                選購{{ n + 1 }}{{ product.unit }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              <i class="fas fa-dollar-sign"></i>
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addCart(product.id, product.num, true)"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 商品 Modal end -->

    <!-- 訂單表格 start -->
    <div v-if="showOrder" class="mt-4">
      <div class="row">
        <h3 class="col text-center order-title">
          <strong>您的購物清單</strong>
        </h3>
      </div>
      <div class="row">
        <table class="col-8 ml-auto mr-auto table mt-3">
          <thead>
            <tr>
              <th class="text-center" scope="col">刪除</th>
              <th class="text-center" scope="col">圖片</th>
              <th class="text-center" scope="col" width="240px">品名</th>
              <th class="text-center" scope="col" width="100px">數量</th>
              <th class="text-center" scope="col">單價</th>
            </tr>
          </thead>
          <tbody>
            <tr class="pt-3 pb-3" v-for="item in carts" :key="item.id">
              <td class="text-center align-middle text-danger del">
                <button @click.stop="delItem(item.id)" type="button" class="btn btn-outline-danger">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="text-center align-middle">
                <img :src="item.product.imageUrl" width="100px" height="70px" />
              </td>
              <td class="text-center align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td class="text-center align-middle">{{ item.qty }}</td>
              <td class="text-center align-middle">{{ item.final_total }}</td>
            </tr>
            <tr>
              <td class="text-center align-middle">
                <button type="button" class="btn btn-outline-danger">
                  <i @click="openDelCartModal()" class="fas fa-skull">
                    一鍵刪除
                  </i>
                </button>
              </td>
              <td class="text-center align-middle"></td>
              <td class="text-center align-middle">總計</td>
              <td class="text-center align-middle">
                <strong>{{ total }}</strong>
              </td>
            </tr>
            <tr v-if="finalTotal !== total">
              <td class="text-center align-middle"></td>
              <td class="text-center align-middle"></td>
              <td class="text-center text-success align-middle">折扣價</td>
              <td class="text-center text-success align-middle">
                <strong>{{ finalTotal }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row">
        <div class="col-7 input-group mb-5 ml-auto mr-auto">
          <input
            type="text"
            class="form-control"
            placeholder="請輸入優惠碼"
            v-model="coupon_code"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-primary"
              type="button"
              @click="addCouponCode()"
            >
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="loadingFrame" v-if="isLoading">
      <loading
        :active.sync="notFullPageLoading"
        :is-full-page="false"
        :background-color="'#fff'"
        :loader="'dots'"
        :color="'green'"
        :height="80"
        :width="80"
      ></loading>
    </div>
    <!-- 訂單表格 end -->

    <!-- <button @click="switchLoc">Switch Locale</button> -->
    <!-- 訂單資料表格 start -->
    <div v-if="showOrder" class="row justify-content-center">
      <ValidationObserver ref="form" tag="form" class="col-md-6" @submit.prevent="onSubmit()">
        <div class="form-group">
          <label for="useremail">Email</label>
          <validation-provider rules="required|email" v-slot="{ errors, classes }">
            <input
            :class="classes"
            class="form-control"
            v-model.trim="form.user.email"
            type="email"
            name="email"
            @input="restriction('email', 'email')"
            >
            <div :class="classes">{{ errors[0] }}</div>
          </validation-provider>
        </div>
        <div class="form-group">
          <label for="username">收件人姓名</label>
          <validation-provider :rules="{ required: true, regex: /^[\u4E00-\u9FA5a-zA-Z]{1,5}$/ }" v-slot="{ errors, classes }">
            <input
            type="text"
            :class="classes"
            class="form-control"
            name="name"
            id="username"
            v-model.trim="form.user.name"
            placeholder="輸入姓名"
            @input="restriction('chineseEng', 'name')"
            >
            <div class="text-danger" v-show=" errors[0]">Please enter 2-5 Chinese or English character!</div>
          </validation-provider>
        </div>

        <div class="form-group">
          <label for="usertel">收件人電話</label>
          <validation-provider :rules="{ required: true, min: 1, max: 10, digits: true}" v-slot="{ errors, classes }">
            <input
            :class="classes"
            name="tel"
            type="tel"
            class="form-control"
            id="usertel"
            v-model="form.user.tel"
            placeholder="請輸入電話"
            @input="restriction('number', 'tel', [1,10])"
            >
            <div class="text-danger" v-show=" errors[0]">Please enter 1-10 number character!</div>
          </validation-provider>
        </div>

        <div class="form-group">
          <label for="useraddress">收件人地址</label>
          <validation-provider :rules="{ required: true, min: 1, max: 30}" v-slot="{ errors, classes }">
            <input
            :class="classes"
            type="address"
            class="form-control"
            name="address"
            id="useraddress"
            v-model.trim="form.user.address"
            placeholder="請輸入地址"
            @input="restriction('chineseEngNumber', 'address', [0,30])"
            >
            <div class="text-danger" v-show="errors[0]">Please enter 0-30 number character!</div>
          </validation-provider>
        </div>
        <div class="form-group">
          <label for="useraddress">留言</label>
          <validation-provider :rules="{ required: true, min: 0, max: 100}" v-slot="{ errors, classes }">
            <textarea
            :class="classes"
            name=""
            id=""
            class="form-control"
            cols="30"
            rows="10"
            v-model.trim="form.message"
            @input="restrictionMsg('chineseEngNumber', 'message', [0,100])"
            ></textarea>
            <div class="text-danger" v-show="errors[0]">Please enter 0-100 character!</div>
          </validation-provider>
        </div>
        <div class="text-right">
          <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
      </ValidationObserver>
    </div>
    <!-- 訂單資料表格 end -->

    <div
      class="modal fade"
      id="delCartModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-dialog"
        role="document"
      >
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>清空購物車</span>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <strong> 是否清空購物車</strong> (刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="delAll()">
              確認清空
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- delCartModal start -->
  </div>
</template>

<script>
import $ from "jquery"
import { mapState, mapActions, mapMutations } from 'vuex'
import { restriction, throttle, debounce } from '@/utility'
export default {
  component: {
    // ValidationProvider
  },
  data () {
    return {
      status: {
        loadingItem: '',
        addItem: ''
      },
      coupon_code: '',
      form: {
        user: {
          name: '',
          phone: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      password: '',
      confirmation: '',
      delItemForAll: ''
    }
  },
  created () {
    this.delItemForAll = this.delItem
    this.delItem = this.debounce(this.delItem, 2000)
    this.addCart = this.throttle(this.addCart, 1000)
    this.addCouponCode = this.throttle(this.addCouponCode, 1000)
    const vm = this
    vm.SETLOADING({ isLoading: true, isFullPage: true })
    Promise.all([vm.getProducts(), vm.getCart()]).then((result) => {
        vm.SETLOADING({ isLoading: false, isFullPage: true })
    });
  },
  computed: {
    ...mapState([
      'isLoading',
      'isFullPage',
      'pagination',
      'productsAll',
      'product',
      'carts',
      'finalTotal',
      'total',
      'showOrder',
    ]),
    notFullPageLoading () {
      return this.isLoading && !this.isFullPage
    }
  },
  methods: {
    ...mapMutations([
      'SETLOADING',
      'DELALL',
    ]),
    ...mapActions([
      'GetProductsAll',
      'GetProduct',
      'CreateOrder',
      'AddCart',
      'GetCart',
      'DelItem',
      'AddCouponCode',
    ]),
    getProducts () {
      const vm = this
      return new Promise( ( resolve, reject )=> {
        // if (vm.isLoading) reject()
        let apiData = {
          url: `/products/all`,
          method: 'get',
        }
        // vm.SETLOADING({ isLoading: true, isFullPage: false })
        vm.GetProductsAll(apiData).then(data => {
        let msgType = data.success ? 'success' : 'danger'
        if(data.message) vm.$bus.$emit('message:push', data.message, msgType)
          resolve()
        }).catch(error => {
          vm.$bus.$emit('message:push', error.message, 'danger')
          // vm.SETLOADING({ isLoading: false, isFullPage: false })
          reject()
        })
      })
    },
    getProduct (id) {
      const vm = this
      vm.status.loadingItem = id

      if (this.isLoading) ''
      let apiData = {
        url: `/product/${id}`,
        method: 'get',
      }
      vm.GetProduct(apiData).then(data => {
        $("#productModal").modal("show")
        vm.status.loadingItem = ""
      }).catch(error => {
        vm.$bus.$emit('message:push', error.message, 'danger')
        vm.status.loadingItem = ""
      })
    },
    async addCart (id, qty = 1, byModal) {
      const vm = this
      if(vm.status.addItem) return
      if (byModal) {
        vm.SETLOADING({ isLoading: true, isFullPage: true })
      } else {
        vm.status.addItem = id
      }
      const cart = {
        product_id: id,
        qty
      }
      let apiData = {
        url: `/cart`,
        method: 'post',
        data: { data: cart }
      }

      vm.AddCart(apiData).then(data => {
        vm.status.addItem = ''
        vm.getCart().then(data => {
          $('#productModal').modal('hide')
        })
      }).catch(error => {
        vm.$bus.$emit('message:push', error.message, 'danger')
        vm.status.addItem = ''
        vm.getCart().then(data => {
          $('#productModal').modal('hide')
        })
      })
    },
    getCart () {
      return new Promise( ( resolve, reject )=> {
        const vm = this
        let apiData = {
          url: `/cart`,
          method: 'get'
        }
        vm.GetCart(apiData).then(data => {
          // vm.SETLOADING({ isLoading: false, isFullPage: true })
          resolve()
        }).catch(error => {
          vm.$bus.$emit('message:push', error.message, 'danger')
          reject()
        })
      })
    },
    delItem (id, deleteAll = false) {
      return new Promise( ( resolve, reject )=> {
        // if (this.isLoading && !deleteAll) reject()
        const vm = this
        let apiData = {
          url: `/cart/${id}`,
          method: 'delete'
        }
        if(!deleteAll) vm.SETLOADING({ isLoading: true, isFullPage: true })
        vm.DelItem(apiData).then(data => {
          if (data.success) {
            if(!deleteAll) vm.getCart()
          } else {
            vm.$bus.$emit('message:push', data.message, 'danger')
          }
          vm.$nextTick( ()=> {
            vm.SETLOADING({ isLoading: false, isFullPage: true })
          })
          resolve()
        }).catch(error => {
          vm.$bus.$emit('message:push', error.message, 'danger')
          if(!deleteAll) vm.getCart()
          vm.SETLOADING({ isLoading: false, isFullPage: true })
          reject()
        })
      })
    },
    delAll () {
      const vm = this
      let promiseArray = []
      vm.SETLOADING(true)
      vm.carts.forEach(item => {
        let promise = vm.delItemForAll(item.id, true)
        promiseArray.push(promise)
      })
      Promise.all(promiseArray).then(data => {
        vm.DELALL()
        vm.getCart()
        $("#delCartModal").modal("hide")
        vm.SETLOADING({ isLoading: false, isFullPage: false })
      })
    },
    addCouponCode () {
      if(!this.coupon_code) return
      const vm = this
      const coupon = {
        code: vm.coupon_code
      }
      let apiData = {
        url: `/coupon`,
        method: 'post',
        data: { data: coupon }
      }
      vm.AddCouponCode(apiData).then(data => {
        if (data.success) {
          vm.coupon_code = ''
          vm.getCart()
        } else {
          vm.$bus.$emit('message:push', data.message, 'danger')
        }
        vm.SETLOADING({ isLoading: false, isFullPage: false })
      }).catch(error => {
        vm.$bus.$emit('message:push', error.message, 'danger')
        vm.getCart()
        vm.SETLOADING({ isLoading: false, isFullPage: false })
      })
    },
    openDelCartModal () {
      $('#delCartModal').modal('show')
    },
    createOrder () {
      return new Promise( ( resolve, reject )=> {
        if (this.isLoading) reject()
        const vm = this
        let apiData = {
          url: `/order`,
          method: 'get',
          data : { data: vm.form }
        }
        vm.SETLOADING({ isLoading: true, isFullPage: false })
        vm.CreateOrder(apiData).then(data => {
        let msgType = data.success ? 'success' : 'danger'
        if(data.message) vm.$bus.$emit('message:push', data.message, msgType)
          resolve()
        }).catch(error => {
          vm.$bus.$emit('message:push', error.message, 'danger')
          vm.SETLOADING({ isLoading: false, isFullPage: false })
          reject()
        })
      })
    },
    restriction (type, fieldName, between) {
      this.form.user[fieldName] = restriction(this.form.user[fieldName], type, between)
    },
    restrictionMsg (type, fieldName, between) {
      this.form[fieldName] = restriction(this.form[fieldName], type, between)
    },
    async onSubmit () {
      let success = await this.$refs.form.validate()
      if (!success) {
        return
      }
      this.createOrder()

      // Resetting Values
      // Wait until the models are updated in the UI
      this.$nextTick(() => {
        this.$refs.form.reset()
      })
    },
    reset () {
      this.$refs.form.reset()
    },
    throttle(fn, time) {
      return throttle(fn, time)
    },
    debounce(fn, time) {
      return debounce(fn, time)
    }
  }
}
</script>

<style scoped>
.table tr td {
  padding: 20px !important;
}

.order-title strong {
  background: rgba(247, 210, 131, 0.192);
  padding: 10px;
  border-radius: 10%;
}
</style>


