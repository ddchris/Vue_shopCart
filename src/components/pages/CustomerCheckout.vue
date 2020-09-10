<template>
  <div>
    <!-- Loading 套件 start-->
    <loading :active.sync="isLoading"></loading>
    <!-- Loading 套件 end-->
    <div class="my-5 row justify-content-center">
      <form class="col-md-6" @submit.prevent="payOrder">
        <table class="table">
          <thead>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </thead>
          <tbody>
            <tr v-for="item in order.products" :key="item.id">
              <td class="align-middle">{{ item.product.title }}</td>
              <td class="align-middle">
                {{ item.qty }}/{{ item.product.unit }}
              </td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-right">總計</td>
              <td class="text-right">{{ order.total }}</td>
            </tr>
          </tfoot>
        </table>

        <table class="table">
          <tbody>
            <tr>
              <th width="100">Email</th>
              <td>{{ order.user.email }}</td>
            </tr>
            <tr>
              <th>姓名</th>
              <td>{{ order.user.name }}</td>
            </tr>
            <tr>
              <th>收件人電話</th>
              <td>{{ order.user.tel }}</td>
            </tr>
            <tr>
              <th>收件人地址</th>
              <td>{{ order.user.address }}</td>
            </tr>
            <tr>
              <th>付款狀態</th>
              <td>
                <span v-if="!order.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-right" v-if="order.is_paid === false">
          <button class="btn btn-danger">確認付款去</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState, mapMutations } from 'vuex'
export default {
  name: "CustomCheckout",
  data () {
    return {
      pagination: {},
      order: {
        user: {}
      }
    };
  },
  methods: {
    ...mapMutations([
      'SETLOADING'
    ]),
    getOrder () {
      const vm = this;
      vm.SETLOADING(true);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order/${this.orderId
        }`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data);
            vm.order = response.data.order;
          } else {
            // console.log(response.data.message);
            vm.$bus.$emit("message:push", response.data.message, "danger");
          }
          vm.SETLOADING(false);
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.SETLOADING(false);
        });
    },
    payOrder () {
      const vm = this;
      vm.SETLOADING(true);
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/pay/${this.orderId
        }`;
      vm.axios
        .post(api)
        .then(response => {
          vm.SETLOADING(false);
          if (response.data.success) {
            // console.log("response.data: ", response.data);
            vm.order.is_paid = true;
            vm.$bus.$emit("message:push", response.data.message, "success");
            setTimeout(() => {
              vm.$router.push(`/customer_orders`);
            }, 500);
          } else {
            // console.log(response.data.message);
            vm.$bus.$emit("message:push", response.data.message, "danger");
          }
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.SETLOADING(false);
        });
    }
  },
  created () {
    // 對應路由內自定義變數名稱
    this.orderId = this.$route.params.orderId;
    this.getOrder();
  },
  computed: {
    ...mapState([
      'isLoading'
    ]),
  },
};
</script>
