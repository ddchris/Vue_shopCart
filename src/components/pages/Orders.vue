<template>
  <div>
    <!-- Loading 套件 start-->
    <loading :active.sync="isLoading"></loading>
    <!-- Loading 套件 end-->

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
          <tr v-for="order in orders">
            <th scope="row">{{ order['create_at'] }}</th>
            <td>{{ order.user.name }}</td>
            <td>
              <div v-for="item in order.products">
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
    </div>
    <!-- 訂單內容 end -->

    <!-- 分頁標籤 start -->
    <nav aria-label="Page navigation example">
      <ul class="pagination mt-2">
        <li class="page-item" :class="{ disabled: !pagination.has_pre }">
          <a
            @click.prevent="getOrders(pagination.current_page - 1)"
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
          :class="{ active: pagination.current_page === page }"
          v-for="page in pagination.total_pages"
          :key="page"
        >
          <a class="page-link" href="#" @click.prevent="getOrders(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.has_next }">
          <a
            @click.prevent="getOrders(pagination.current_page + 1)"
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
import $ from "jquery";
import { mapState, mapMutations } from 'vuex'
export default {
  name: "Alert",
  data () {
    return {
      type: 'add',
      pagination: {},
      coupon: {},
      orders: []
    };
  },
  computed: {
    ...mapState([
      'isLoading'
    ]),
  },
  methods: {
    ...mapMutations([
      'LOADING'
    ]),
    getOrders (page = 1) {
      const vm = this;
      vm.LOADING(true);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH
        }/admin/orders?page=${page}`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data);
            vm.orders = response.data.orders;
            vm.pagination = response.data.pagination;
          } else {
            console.log(response.data.message);
            vm.$bus.$emit("message:push", response.data.message, "danger");
          }
          vm.LOADING(false);
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.LOADING(false);
        });
    },
  },
  created () {
    this.getOrders();
  }
};
</script>
