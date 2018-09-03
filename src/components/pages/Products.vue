<template>
  <div>
    <!-- Loading 套件 -->
    <loading :active.sync="isLoading"></loading>
    <!-- Loading 套件 end-->

    <!-- 主頁面 start -->
    <div class="text-right mb-4">
     <button type="button" @click="openProductModal(true)" class="btn btn-success">Add new products</button>
    </div>
    <div class="list-group">
      <button type="button" class="btn-info list-group-item list-group-item-action active">
        Product List
      </button>
      <table class="table table-striped">
        <thead>
          <tr>
            <th width="120" scope="col">分類</th>
            <th width="auto" scope="col">名稱</th>
            <th width="120" scope="col">原價</th>
            <th width="120" scope="col">售價</th>
            <th width="110" scope="col">是否啟用</th>
            <th width="180" scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in products" :key="item.id">
            <td>{{item.category}}</td>
            <td>{{item.title}}</td>
            <td>{{item.origin_price}}</td>
            <td>{{item.price}}</td>
            <td>
              <span v-if="item.is_enabled" class="text-success">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <button type="button" class="btn-sm btn-outline-success sm" @click="openProductModal(false, item)">編輯</button>
              <button type="button" class="btn-sm btn-outline-danger sm" @click="openDelProductModal(item)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 主頁面 end -->

    <!-- 分頁標籤 start -->
    <nav aria-label="Page navigation example">
      <ul class="pagination mt-2">
        <li class="page-item" :class="{'disabled': !pagination.has_pre}">
          <a @click.prevent="getProducts(pagination.current_page - 1)" class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <!-- 利用 total_pages 數字做 v-for 迴圈 -->
        <li class="page-item" :class="{'active': pagination.current_page === page}" v-for="page in pagination.total_pages" :key="page"><a class="page-link" href="#" @click.prevent="getProducts(page)">{{page}}</a></li>
        <li class="page-item" :class="{'disabled': !pagination.has_next}">
          <a @click.prevent="getProducts(pagination.current_page + 1)" class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- 分頁標籤 end -->

    <!-- productModal start-->
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
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
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
    <!-- productModal end-->

    <!-- delProductModal start -->
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{tempProduct.title}}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct()">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
    <!-- delProductModal start -->
  </div>

</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      products: [],
      pagination:{},
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
        fileLoading: false
      }
    };
  },
  created() {
    this.getProducts();
  },
  computed: {},
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products?page=${page}`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            console.log('response.data: ', response.data);
            vm.products = response.data.products;
            vm.pagination = response.data.pagination;
          } else {
            console.log("取得產品失敗");
          }
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    },
    openProductModal(isNew, item) {
      if (!this.isLoading) {
        if (isNew) {
          this.tempProduct = {};
          this.isNew = true;
        } else {
          this.tempProduct = Object.assign({}, item);
          this.isNew = false;
        }
        let modal = $("#productModal");
        if (modal) {
          modal.modal("show");
        }
      }
    },
    updateProduct() {
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/product`;
      let httpMethod = "post";
      const vm = this;
      if (vm.isNew === false) {
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/product/${vm.tempProduct.id}`;
        httpMethod = "put";
      }
      // 注意 post 傳2個參數，此 API 是傳物件形式 不能直接傳 vm.tempProduct
      this.$http[httpMethod](api, { data: vm.tempProduct })
        .then(response => {
          // console.log(response.data);
          // 如果新增成功
          if (response.data.success) {
            // 重新取得遠端資料
            vm.getProducts();
            let modal = $("#productModal");
            if (modal) {
              modal.modal("hide");
            }
          } else {
            if (this.isNew) {
              console.log("新增失敗");
            } else {
              console.log("編輯失敗");
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openDelProductModal(item) {
      const vm = this;
      $("#delProductModal").modal("show");
      vm.tempProduct = Object.assign({}, item);
    },
    deleteProduct() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/product/${vm.tempProduct.id}`;
      let delIndex = 0;
      let delItem = {};
      vm.isLoading = true;
      vm.axios
        .delete(api)
        .then(response => {
          if (response.data.success === true) {
            vm.getProducts();
            console.log("刪除完成");
          } else {
            console.log("刪除失敗");
          }
          $("#delProductModal").modal("hide");
          vm.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          vm.isLoading = false;
        });
    },
    uploadFile() {
      //利用 $ref 抓取 DOM 中讀到的檔案並模擬表單欄位的形式送出資料至API
      const vm = this;
      const uploadedFile = vm.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append("file-to-upload", uploadedFile);
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/upload`;
      //headers 需註明 Content-Type 為表單形式
      vm.status.fileLoading = true;
      vm.axios
        .post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          if (response.data.success === true) {
            //因路徑使用 v-model 綁定物件內的值,故需用 $set強制寫入做雙向綁定
            // this.tempProduct.imageUrl = response.data.imageUrl
            vm.$set(vm.tempProduct, "imageUrl", response.data.imageUrl);
          } else {
            this.$bus.$emit("message:push", response.data.message, "danger");
          }
          vm.status.fileLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.status.fileLoading = false;
        });
    }
  }
};
</script>

<style>
table td,
table th {
  vertical-align: middle !important;
  text-align: center !important;
}
</style>
