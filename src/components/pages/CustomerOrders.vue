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
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image"
                    placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileLoading"></i>
                  </label>
                  <!-- 監聽使用者上傳檔案,圖片需以模擬表單的形式送出資料至API -->
                  <input type="file" id="customFile" class="form-control"
                    ref="fileInput" @change="uploadFile()">
                </div>
                <img :img="tempProduct.imageUrl"
                  class="img-fluid" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title"
                    placeholder="請輸入標題" v-model="tempProduct.title">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category"
                      placeholder="請輸入分類" v-model="tempProduct.category">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit"
                      placeholder="請輸入單位" v-model="tempProduct.unit">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price"
                      placeholder="請輸入原價" v-model="tempProduct.origin_price">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price"
                      placeholder="請輸入售價" v-model="tempProduct.price">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description"
                    placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content"
                    placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <!-- 修改 true, false 的值 -->
                    <input class="form-check-input" type="checkbox"
                      id="is_enabled" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct()">確認</button>
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

