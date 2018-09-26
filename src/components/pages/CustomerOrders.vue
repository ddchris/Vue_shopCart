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
              <button type="button" class="btn btn-outline-success btn-sm ml-auto" @click="addCart(item.id,1,false)">
                  <i v-if="status.addItem === item.id " class="fas fa-spinner fa-spin"></i>
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
    <div v-if="showOrder" class="mt-4">
      <div class="row">
        <h3 class="col text-center order-title"><strong >您的購物清單</strong></h3>
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
                <button type="button" class="btn btn-outline-danger">
                  <i @click="delItem(item.id)" class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="text-center align-middle">
                <img :src="item.product.imageUrl" width="100px" height="70px">
              </td>
              <td class="text-center align-middle">
                {{item.product.title}}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td class="text-center align-middle">{{item.qty}}</td>
              <td class="text-center align-middle">{{item.final_total}}</td>
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
              <td class="text-center align-middle"><strong>{{total}}</strong></td>
            </tr>
            <tr v-if="finalTotal !== total">
              <td class="text-center align-middle"></td>
              <td class="text-center align-middle"></td>
              <td class="text-center text-success align-middle">折扣價</td>
              <td class="text-center text-success align-middle"><strong>{{finalTotal}}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row">
        <div class="col-7 input-group mb-5 ml-auto mr-auto">
          <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" aria-label="Recipient's username" aria-describedby="basic-addon2">
          <div class="input-group-append">
            <button class="btn btn-outline-primary" type="button" @click="addCouponCode()">套用優惠碼</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 訂單表格 end -->

    <!-- delCartModal start -->
    <div class="modal fade" id="delCartModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>清空購物車</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <strong> 是否清空購物車</strong> (刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delAll()">確認清空</button>
          </div>
        </div>
      </div>
    </div>
    <!-- delCartModal start -->
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
        loadingItem: "",
        addItem: ""
      },
      carts: [],
      finalTotal: 0,
      total: 0,
      showOrder: false,
      coupon_code: ""
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
      }/products/all`;
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
          $("#productModal").modal("show");
          vm.status.loadingItem = "";
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤", "danger");
          vm.status.loadingItem = "";
        });
    },
    addCart(id, qty = 1, byModal) {
      const vm = this;
      if (byModal) {
        vm.isLoading = true;
      } else {
        vm.status.addItem = id;
      }
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
          vm.status.addItem = "";
          $("#productModal").modal("hide");
          vm.getCart();
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!", "danger");
          vm.status.addItem = "";
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
            if (
              response.data.data.carts &&
              response.data.data.carts.length !== 0
            ) {
              vm.carts = [...response.data.data.carts];
              vm.total = response.data.data.total;
              vm.finalTotal = response.data.data.final_total;
              vm.showOrder = true;
              console.log("vm.carts", response.data.data);
            } else {
              vm.carts = [];
              vm.showOrder = false;
              console.log("here");
            }
          } else {
            console.log("取得購物車失敗");
            vm.showOrder = false;
            vm.$bus.$emit("message:push", "取得得購物車失敗", "danger");
          }
          vm.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.showOrder = false;
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
    },
    delAll() {
      const vm = this;
      vm.isLoading = true;
      vm.carts.forEach(item => {
        var api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${
          item.id
        }`;
        vm.axios
          .delete(api)
          .then(response => {
            if (response.data.success) {
              // console.log("response.data: ", response.data);
              // vm.getCart();
            } else {
              console.log("刪除商品失敗");
              vm.$bus.$emit("message:push", "刪除商品失敗", "danger");
            }
          })
          .catch(error => {
            console.log(error);
            vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          });
      });
      $("#delCartModal").modal("hide");
      vm.isLoading = false;
      vm.carts = [];
      vm.showOrder = false;
    },
    addCouponCode() {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      };
      vm.axios
        .post(api, { data: coupon })
        .then(response => {
          if (response.data.success) {
            vm.coupon_code = "";
            vm.getCart();
            // console.log("response.data: ", response.data);
            // vm.getCart();
          } else {
            console.log("套用優惠券失敗");
            console.log("response.data: ", response.data);
            vm.$bus.$emit("message:push", "套用優惠券失敗", "danger");
          }
          vm.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.isLoading = false;
        });
    },
    openDelCartModal() {
      $("#delCartModal").modal("show");
    }
  }
};
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


