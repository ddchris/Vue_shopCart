<template>
  <div>
    <!-- Loading 套件 start-->
    <loading :active.sync="isLoading"></loading>
    <!-- Loading 套件 end-->

    <!-- 商品內容 start -->
    <!-- 外層加上 BS4 格線用 div -->
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
            <!-- 綁定背景圖片 -->
            <div style="height: 150px; background-size: cover; background-position: center"
             :style="{backgroundImage: `url(${item.imageUrl})`}">
            </div>
            <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
                <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.description}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
                <del class="h6">原價&nbsp {{item.origin_price | currency}}&nbsp </del>
                <div class="h5">現在只要&nbsp{{item.price | currency}}&nbsp </div>
            </div>
            </div>
            <div class="card-footer d-flex">
            <button  @click="getProduct(item.id)" type="button" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addCart(item.id,1,false)">
                <i v-if="addItem" class="fas fa-spinner fa-spin"></i>
                加到購物車
            </button>
            </div>
        </div>
      </div>
    </div>
    <!-- 商品內容 end -->

    <!-- 商品 Modal start -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{tempProduct.title}}</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{tempProduct.content}}</p>
              <footer class="blockquote text-right"></footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!tempProduct.price">{{tempProduct.origin_price}} 元</div>
              <del class="h6" v-if="tempProduct.price">原價 {{tempProduct.origin_price}} 元</del>
              <div class="h4" v-if="tempProduct.price">現在只要 {{tempProduct.price}} 元</div>
            </div>
            <select name="number" class="form-control mt-3" v-model="tempProduct.num">
              <option value="1" selected>
                選購1{{tempProduct.unit}}
              </option>
              <option v-for="n in 9" :value="n+1" :key="n">
                選購{{n+1}}{{tempProduct.unit}}
              </option>
            </select>  
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              <i class="fas fa-dollar-sign"></i>
              小計 <strong>{{ tempProduct.num * tempProduct.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary" @click="addCart(tempProduct.id, tempProduct.num, true)">
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 商品 Modal end -->

    <!-- 訂單表格 start -->
    <div class="row">
      <h3 class="col text-center mt-1 order-title"><strong >您的購物清單</strong></h3>
    </div>
    <div class="row">
      <table class="col-8 ml-auto mr-auto table mt-3 mb-5">
        <thead>
          <tr>
            <th class="text-center" scope="col">刪除</th>
            <th class="text-center" scope="col" width="240px">品名</th>
            <th class="text-center" scope="col">數量</th>
            <th class="text-center" scope="col">單價</th>
          </tr>
        </thead>
        <tbody>
          <tr class="pt-3 pb-3" v-for="item in carts">
            <td class="text-center align-middle text-danger del"><i @click="delItem(item.id)" class="far fa-trash-alt"></i></td>
            <td class="text-center align-middle">{{item.product.title}}</td>
            <td class="text-center align-middle">{{item.qty}}</td>
            <td class="text-center align-middle">{{item.final_total}}</td>
          </tr>
          <tr>
            <td class="text-center align-middle"></td>
            <td class="text-center align-middle"></td>
            <td class="text-center align-middle">總計</td>
            <td class="text-center align-middle"><strong>{{finalTotal}}</strong></td>
          </tr>
          <tr>
            <td class="text-center align-middle"></td>
            <td class="text-center align-middle"></td>
            <td class="text-center text-success align-middle">折扣價</td>
            <td class="text-center text-success align-middle"><strong>{{finalTotal}}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 訂單表格 end -->
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {
        title: "",
        category: "",
        origin_price: "",
        price: "",
        unit: "",
        image: "",
        description: "",
        content: "",
        is_enabled: 0,
        imageUrl: "",
        isNew: true,
        num: 1
      },
      isLoading: false,
      status: {
        loadingItem: false,
        addItem: false
      },
      carts: [],
      finalTotal: 0
    };
  },
  created() {
    this.getProducts();
    this.getCart();
  },
  computed: {},
  methods: {
    getProducts() {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data);
            vm.products = response.data.products;
            vm.pagination = response.data.pagination;
          } else {
            console.log("取得產品失敗");
            vm.$bus.$emit("message:push", "取得產品失敗", "danger");
          }
          vm.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!", "danger");
          vm.isLoading = false;
        });
    },
    getProduct(id) {
      const vm = this;
      vm.status.loadingItem = id;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/product/${id}`;
      vm.isLoading = true;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data.product);
            vm.tempProduct = response.data.product;
            vm.tempProduct.num = 1;
          } else {
            console.log("取得產品失敗");
            vm.$bus.$emit("message:push", "取得產品失敗", "danger");
          }
          vm.isLoading = false;
          $("#productModal").modal("show");
          vm.status.loadingItem = "";
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤", "danger");
          vm.isLoading = false;
          vm.status.loadingItem = "";
        });
    },
    addCart(id, qty = 1, byModal) {
      const vm = this;
      if (byModal) {
        vm.isLoading = true
      } else {
        vm.addItem = true;
      }
      vm.status.loadingItem = id;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const cart = {
        product_id: id,
        qty
      };
      vm.axios
        .post(api, { data: cart })
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data);
          } else {
            console.log("取得產品失敗");
            vm.$bus.$emit("message:push", "加入購物車失敗", "danger");
          }
          vm.addItem = false;
          $("#productModal").modal("hide");
          vm.status.loadingItem = "";
          vm.getCart();
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!", "danger");
          vm.addItem = false;
          vm.status.loadingItem = "";
          $("#productModal").modal("hide");
          vm.getCart();
        });
    },
    getCart() {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            // console.log("response.data.carts: ", response.data.data);
            if (response.data.data.carts) {
              vm.carts = [...response.data.data.carts];
              vm.finalTotal = response.data.data.final_total;
              console.log("vm.carts: ", vm.carts);
            } else {
              vm.carts = [];
              console.log("here");
            }
          } else {
            console.log("取得購物車失敗");
            vm.$bus.$emit("message:push", "取得得購物車失敗", "danger");
          }
          vm.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.isLoading = false;
        });
    },
    delItem(id) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      vm.axios
        .delete(api)
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data);
            vm.getCart();
          } else {
            console.log("刪除商品失敗");
            vm.$bus.$emit("message:push", "刪除商品失敗", "danger");
          }
          vm.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.isLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.table i:before {
  cursor: pointer;
  border: 1px solid red;
  border-radius: 30%;
  padding: 10px;
}

.table tr td {
  padding: 20px !important;
}

.order-title strong {
  background: rgba(247, 210, 131, 0.192);
  padding: 10px;
  border-radius: 10%;
}
</style>


