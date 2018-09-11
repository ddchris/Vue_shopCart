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
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto">
                <i class="fas fa-spinner fa-spin"></i>
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
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{tempProduct.title}}</span>
            </h5>
          </div>
          <div class="modal-body">
            <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{tempProduct.content}}</p>
              <footer class="blockquote-footer text-right"></footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!tempProduct.price">{{tempProduct.origin_price}} 元</div>
              <div class="h6" v-if="tempProduct.price">原價 {{tempProduct.origin_price}} 元</div>
              <div class="h4" v-if="tempProduct.price">現在只要 {{tempProduct.price}} 元</div>
            </div>
            <select name="" class="form-control-3" v-model="tempProduct.num">
              <option value="1">選購1件</option>
            </select>  
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{Number(tempProduct.num) * Number(tempProduct.price)}}</strong> 元
            </div>
              <button type="button" class="btn btn-primary">
                加入購物車
              </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 商品 Modal end -->
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
        isNew: true
      },
      isLoading: false,
      status: {
        loadingItem: false
      }
    };
  },
  created() {
    this.getProducts();
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
            console.log("response.data: ", response.data);
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
          vm.$bus.$emit("message:push", "伺服器內部錯誤", "danger");
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
            console.log("response.data: ", response.data);
            vm.tempProduct = response.data.product;
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
    }
  }
};
</script>

