<template>
  <div>
    <!-- 訂單內容 start -->
    <div class="row ml-3 mr-1">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">購買時間</th>
            <th scope="col">購買人</th>
            <th width="300px" tclass="text-center" scope="col">購買項目</th>
            <th width="100px" scope="col">應付金額</th>
            <th scope="col">寄送地址</th>
            <th scope="col">付款狀態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.products.id">
            <th scope="row">{{ order['create_at'] }}</th>
            <td>{{ order.user.name }}</td>
            <td>
              <div v-for="item in order.products" :key="item.id">
                <p class="text-lg-left">
                  {{ item.product.title + ' ' + item.qty + item.product.unit }}
                </p>
              </div>
            </td>
            <td>{{ order.total }}</td>
            <td>{{ order.user.address }}</td>
            <td
              :class="{
                'text-success': order['is_paid'],
                'text-danger': !order.is_enabled
              }"
            >
              {{ order.is_enabled ? '已付款' : '未付款' }}
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
    <!-- 訂單內容 end -->

    <!-- 分頁標籤 start -->
    <nav aria-label="Page navigation example">
      <ul class="pagination mt-2">
        <li class="page-item" :class="{ disabled: !pagination.has_pre || isLoading }">
          <a
            @click.prevent="getOrders(pagination.current_page - 1, true)"
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
          <a class="page-link" href="#" @click.prevent="getOrders(page, true)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.has_next || isLoading }">
          <a
            @click.prevent="getOrders(pagination.current_page + 1, true)"
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
    }
  },
  computed: {
    ...mapState([
      'isLoading',
      'isFullPage',
      'pagination',
      'orders'
    ]),
    isNoData(){
      return !this.orders || this.orders && this.orders.length<1
    },
    notFullPageLoading () {
      return this.isLoading && !this.isFullPage
    }
  },
  methods: {
    ...mapMutations([
      'SETLOADING'
    ]),
    ...mapActions([
      'GetOrders'
    ]),
    getOrders (page = 1, pagination = false) {
      if (this.isLoading || pagination && this.pagination.total_pages === 1) return
      const vm = this
      let apiData = {
        url: `/admin/orders?page=${page}`,
        method: 'get'
      }
      vm.SETLOADING({ isLoading: true, isFullPage: false })
      vm.GetOrders(apiData).then(data => {
        let msgType = data.success ? 'success' : 'danger'
        if(data.message) vm.$bus.$emit("message:push", data.message, msgType)
      }).catch(error => {
        vm.$bus.$emit("message:push", error.message, "danger")
        vm.SETLOADING({ isLoading: false, isFullPage: false })
      })
    }
  },
  created () {
    this.getOrders()
  }
}
</script>
