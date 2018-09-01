<template>
  <div>
    <div class="text-right mb-4">
     <button type="button" @click="updateProductShow(true, {})" class="btn btn-success">Add new products</button>
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
            <td>{{item.is_enabled}}</td>
            <td>
              <button type="button" class="btn-sm btn-outline-success sm" @click="updateProductShow(false, item)">編輯</button>
              <button type="button" class="btn-sm btn-outline-danger sm" @click="deleteProduct(item.id)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
                    <i class="fas fa-spinner fa-spin"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control"
                    ref="files">
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
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      products: [],
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
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products`;
      vm.axios.get(api).then(response => {
        vm.products = response.data.products;
      });
    },
    updateProductShow(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
      } else {
        // 新增物件 Object.assign
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      $("#productModal").modal("toggle");
    },
    updateProduct() {
      $("#productModal").modal("hide");
      let vm = this;
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/product`;
      let httpMethod = "post";
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/product/${vm.tempProduct.id}`;
        httpMethod = "put";
      }
      // API 資料格式為 { data: Product }
      vm.axios[httpMethod](api, { data: vm.tempProduct })
        .then(response => {
          if (response.data.success === true) {
            this.getProducts();
            console.log("新增成功");
          } else {
            this.products.pop();
            console.log("新增失敗");
          }
        })
        .catch(function(error) {});
    },
    deleteProduct(id) {
      let vm = this;
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/product/${id}`;
      let delIndex = 0;
      let delItem = 0;
      // 直接於前端刪除資料以免等待
      vm.products.some((item, index) => {
        console.log("item.id: ", item.id);
        if (item.id === id) {
          //存下刪除的物件,以防後端錯誤時加回去
          delIndex = index;
          delItem = Object.assign({}, vm.products[index]);
          this.products.splice(index, 1);
          console.log("delItem: ", delItem);
          console.log("delIndex: ", delIndex);
          return true;
        }
      });
      vm.axios
        .delete(api)
        .then(response => {
          if (response.data.success === true) {
            console.log("刪除完成");
          } else {
            //刪除出錯時將資料加回前端
            vm.products.splice(delIndex, 0, delItem);
            console.log("刪除失敗");
          }
        })
        .catch(function(error) {
          //刪除出錯時將資料加回前端
          vm.products.splice(delIndex - 1, 0, delItem);
          console.log(error);
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
