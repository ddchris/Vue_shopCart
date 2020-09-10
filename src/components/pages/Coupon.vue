<template>
  <div>
    <div class="row mt-2 topRow">
      <div class="mb-4">
        <button
          @click="openCouponModal({}, 'add')"
          type="button"
          class="btn btn-lg btn-success"
        >
          新增優惠券
        </button>
      </div>
    </div>
    <div class="row ml-3 mr-1">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">名稱</th>
            <th scope="col">折扣百分比</th>
            <th scope="col">到期日</th>
            <th scope="col">優惠碼</th>
            <th scope="col">是否啟用</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody v-show="!isLoading && coupons && coupons.length>=1">
          <tr v-for="coupon in coupons" :key="coupon.id">
            <th scope="row">{{ coupon.title }}</th>
            <td>{{ coupon.percent + '%' }}</td>
            <td>{{ coupon.due_date }}</td>
            <td>{{ coupon.code }}</td>
            <td
              :class="{
                'text-success': coupon.is_enabled,
                'text-danger': !coupon.is_enabled
              }"
            >
              {{ coupon.is_enabled ? '啟用' : '未啟用' }}
            </td>
            <td>
              <button
                @click="openCouponModal(coupon, 'edit')"
                type="button"
                class="btn-sm btn-outline-primary sm"
              >
                修改
              </button>
              <button
                @click="openDelCouponModal(coupon)"
                type="button"
                class="btn-sm btn-outline-danger"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
    </div>

    <div class="noData" v-show="!isLoading && isNoData">
      <img src="./../../assets/imgs/noData.png">
      <span>暫無資料！</span>
    </div>
    <!-- Modal start-->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">
              {{ tip }}優惠券
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
            <form class="needs-validation" novalidate>
              <div class="form-row">
                <div class="col-md-12 mb-3">
                  <label for="validationCustom01">標題</label>
                  <input
                    v-model="coupon.title"
                    type="text"
                    class="form-control"
                    id="validationCustom01"
                    placeholder="請輸入標題"
                    value=""
                    required
                  />
                  <div class="valid-feedback">Looks good!</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="validationCustom02">優惠百分比</label>
                  <input
                    v-model="coupon.percent"
                    type="text"
                    class="form-control"
                    id="validationCustom02"
                    placeholder="請輸入優惠百分比"
                    value=""
                    required
                  />
                  <div class="valid-feedback">Looks good!</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="validationCustomUsername">優惠碼</label>
                  <div class="input-group">
                    <input
                      v-model="coupon.code"
                      type="text"
                      class="form-control"
                      id="validationCustomUsername"
                      placeholder="請輸入優惠碼"
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                    <div class="invalid-feedback">
                      Please choose a username.
                    </div>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="validationCustomUsername">到期日</label>
                  <div class="input-group">
                    <input
                      v-model="coupon['due_date']"
                      type="date"
                      class="form-control"
                      id="validationCustomUsername"
                      placeholder="請輸入到期日"
                      aria-describedby="inputGroupPrepend"
                      required
                    />
                    <div class="invalid-feedback">
                      Please choose a username.
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input
                    v-model="coupon['is_enabled']"
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="invalidCheck"
                    required
                  />
                  <label class="form-check-label" for="invalidCheck">
                    是否啟用
                  </label>
                  <div class="invalid-feedback">
                    You must agree before submitting.
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              @click="addCoupon()"
              class="btn btn-lg btn-primary mr-3"
              type="submit"
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal end-->

    <!-- delCouponModal start -->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
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
            是否刪除
            <strong class="text-danger">{{ coupon.title }}</strong>
            優惠券(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="delCoupon()">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- delCouponModal end -->

    <!-- 分頁標籤 start -->
    <nav aria-label="Page navigation example" v-show="!isNoData">
      <ul class="pagination mt-2">
        <li class="page-item" :class="{ disabled: !pagination.has_pre || isLoading }">
          <a
            @click.prevent="getCoupons(pagination.current_page - 1, true)"
            class="page-link"
            href="#"
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <!-- 利用 total_pages 數字做 v-for 迴圈 -->
        <li
          class="page-item"
          :class="{ active: pagination.current_page === page, disabled: isLoading }"
          v-for="page in pagination.total_pages"
          :key="page"
        >
          <a class="page-link" href="#" @click.prevent="getCoupons(page, true)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.has_next || isLoading }">
          <a
            @click.prevent="getCoupons(pagination.current_page + 1, true)"
            class="page-link"
            href="#"
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- 分頁標籤 end -->
  </div>
</template>

<script>
import $ from "jquery"
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "Alert",
  data () {
    return {
      type: 'add',
      coupon: {},
      apiData: {
        url: '',
        method: '',
        data: ''
      }
    }
  },
  created () {
    this.getCoupons()
  },
  computed: {
    ...mapState([
      'isLoading',
      'isFullPage',
      'coupons',
      'pagination'
    ]),
    tip () {
      return this.type === 'add' ? '新增' : '修改'
    },
    notFullPageLoading () {
      return this.isLoading && !this.isFullPage
    },
    isNoData(){
      return !this.coupons || this.coupons && this.coupons.length<1
    }
  },
  methods: {
    ...mapMutations([
      'SETLOADING',
      'ADDCOUPONS',
      'DELCOUPON',
    ]),
    ...mapActions([
      'GetCoupons',
      'DelCoupon',
      'AddCoupon',
    ]),
    openCouponModal (coupon = {}, type) {
      if (coupon !== {}) {
        this.coupon = coupon
      }
      if (type === 'add') {
        this.type = 'add'
      } else {
        this.type = 'edit'
      }
      $("#couponModal").modal("show")
    },
    closeCouponModal () {
      $("#couponModal").modal("hide")
    },
    closeDelCouponModal () {
      $("#delCouponModal").modal("hide")
    },
    openDelCouponModal (coupon = {}) {
      if (coupon !== {}) {
        this.coupon = coupon
      }
      $("#delCouponModal").modal("show")
    },
    addCoupon () {
      if(this.isLoading) return
      const vm = this
      let api = this.type === 'add' ? `/admin/coupon` : `/admin/coupon/${vm.coupon.id}`
      let method = this.type === 'add' ? 'post' : 'put'
      let apiData = {
        url: api,
        method,
        data: { data: vm.coupon }
      }
      vm.closeCouponModal()
      vm.SETLOADING({ isLoading: true, isFullPage: false })
      vm.AddCoupon(apiData).then(res => {
        console.log('then:')
        console.log('isLoading:', this.isLoading)
        console.log('isFullPage:', this.isFullPage)
        let type = res.success ? 'success' : 'danger'
        vm.$bus.$emit('message:push', res.message, type)
        this.ADDCOUPONS(vm.coupon)
        vm.coupon = {}
      })
        .catch(error => {
          console.log(error)
          vm.$bus.$emit("message:push", error.message, "danger")
          vm.closeCouponModal()
          vm.getCoupons()
          vm.coupon = {}
        })
      // vm.axios[method](api, { data: vm.coupon })
      //   .then(response => {
      //     if (response.data.success) {
      //       // console.log("response.data: ", response.data)
      //     } else {
      //       console.log("新增優惠券失敗")
      //       // console.log("response.data: ", response.data)
      //       vm.$bus.$emit("message:push", "新增優惠券失敗", "danger")
      //     }
      //     vm.getCoupons()
      //     vm.SETLOADING(false)
      //     vm.closeCouponModal()
      //     vm.coupon = {}
      //   })
      //   .catch(error => {
      //     console.log(error)
      //     vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger")
      //     vm.getCoupons()
      //     vm.SETLOADING(false)
      //     vm.closeCouponModal()
      //     vm.coupon = {}
      //   })
    },
    getCoupons (page = 1, pagination = false) {
      if (this.isLoading || pagination && this.pagination.total_pages === 1) return
      const vm = this
      let apiData = {
        url: `/admin/coupons?page=${page}`,
        method: 'get',
        data: vm.coupon
      }
      vm.SETLOADING({ isLoading: true, isFullPage: false })
      vm.GetCoupons(apiData).then(data => {
        let msgType = data.success ? 'success' : 'danger'
        if(data.message) vm.$bus.$emit("message:push", data.message, msgType)
      }).catch(error => {
        vm.$bus.$emit("message:push", error.message, "danger")
        vm.SETLOADING({ isLoading: false, isFullPage: false })
      })
    },
    delCoupon () {
      if(this.isLoading) return
      const vm = this
      let apiData = {
        url: `/admin/coupon/${vm.coupon.id}`,
        method: 'delete'
      }
      vm.SETLOADING({ isLoading: true, isFullPage: false })
      vm.closeDelCouponModal()
      vm.DelCoupon(apiData).then(res => {
        vm.DELCOUPON(vm.coupon.id)
        if (res.success) {
          vm.$bus.$emit("message:push", res.message, "success")
        } else {
          vm.$bus.$emit("message:push", res.message, "danger")
        }
      }).catch(error => {
        vm.getCoupons()
        vm.$bus.$emit("message:push", error.message, "danger")
      })
    }
  }
}
</script>

<style lang="scss" scope>
html {
  font-size: 14px;
}
@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

.topRow {
  flex-direction: row-reverse;
}
</style>
