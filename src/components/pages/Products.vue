<template>
  <div>
    <!-- 主頁面 start -->
    <div class="text-right mt-4 mb-4">
      <button
        type="button"
        @click="openProductModal(true)"
        class="btn btn-success"
      >
        新增商品
      </button>
    </div>
    <div class="list-group">
      <button
        type="button"
        class="btn-info list-group-item list-group-item-action active"
      >
        產品列表
      </button>
      <table class="table table-striped">
        <thead>
          <tr>
            <th width="120" scope="col">分類</th>
            <th width="auto" scope="col">名稱</th>
            <th width="120" scope="col">原價</th>
            <th width="120" scope="col">售價</th>
            <th width="150" scope="col">是否啟用</th>
            <th width="180" scope="col">編輯</th>
          </tr>
        </thead>
        <tbody v-show="!isLoading && products && products.length>=1">
          <tr v-for="item in products" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-right">{{ item.origin_price | currency }}</td>
            <td class="text-right">{{ item.price | currency }}</td>
            <td>
              <span v-if="item.is_enabled" class="text-success">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <button
                type="button"
                class="btn-sm btn-outline-primary sm"
                @click="openProductModal(false, item)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn-sm btn-outline-danger sm"
                @click="openDelProductModal(item)"
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
    <!-- 主頁面 end -->

    <!-- 分頁標籤 start -->
    <nav aria-label="Page navigation example" v-show="!isLoading && isNoData">
      <ul class="pagination mt-2">
        <li class="page-item" :class="{ disabled: !pagination.has_pre || isLoading }">
          <a
            @click.prevent="getProducts(pagination.current_page - 1)"
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
          <a class="page-link" href="#" @click.prevent="getProducts(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.has_next || isLoading }">
          <a
            @click.prevent="getProducts(pagination.current_page + 1)"
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

    <!-- productModal start-->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
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
          <ValidationObserver ref="form">
            <form @submit.prevent="onSubmit">
              <div class="modal-body">
                <div class="row">
                  <div class="col-sm-4">
                    <div class="form-group">
                      <label for="image">輸入圖片網址</label>
                      <input
                        type="text"
                        class="form-control"
                        id="image"
                        placeholder="請輸入圖片連結"
                        v-model="tempProduct.imageUrl"
                      />
                    </div>
                    <div class="form-group">
                      <label for="customFile"
                        >或 上傳圖片
                      </label>
                      <!-- 監聽使用者上傳檔案,圖片需以模擬表單的形式送出資料至API -->
                      <ValidationProvider name="file" :rules="{ required: true, image: true, ext:['jpg','png'], size: 6500 }" ref="provider" v-slot="{ classes, errors }">
                        <input
                          :class="classes"
                          type="file"
                          class="form-control"
                          ref="fileInput"
                          @change="uploadFile($event)"
                        />
                        <p :class="classes">{{ errors[0] }}</p>
                      </ValidationProvider>
                    </div>
                    <div v-if="currentFile" class="progress">
                      <div
                        class="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        :aria-valuenow="progress"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :style="{ width: progress + '%' }"
                      >
                        {{ progress }}%
                      </div>
                    </div>
                    <div
                      v-if="!isDefault && !status.fileLoading"
                      class="prodImage"
                      :style="{ backgroundImage: `url(${tempProduct.imageUrl})` }"
                    >
                    </div>
                    <i v-if="!isDefault && status.fileLoading"
                    class="fas fa-spinner fa-spin fa-3x mt-10"
                    ></i>
                  </div>
                  <div class="col-sm-8">
                    <div class="form-group">
                      <label for="title">標題</label>
                      <ValidationProvider name="title" :rules="{required: true, max: 9}" v-slot="{ classes, errors }">
                        <input
                          :class="classes"
                          type="text"
                          class="form-control"
                          id="title"
                          placeholder="請輸入九個字以內的標題"
                          v-model="tempProduct.title"
                        />
                        <p :class="classes">{{ errors[0] }}</p>
                      </ValidationProvider>
                    </div>

                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="category">分類</label>
                        <ValidationProvider name="category" :rules="{required: true, max: 6}" v-slot="{ classes, errors }">
                          <input
                            :class="classes"
                            type="text"
                            class="form-control"
                            id="category"
                            placeholder="六個字以內分類"
                            v-model="tempProduct.category"
                          />
                          <p :class="classes">{{ errors[0] }}</p>
                        </ValidationProvider>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="price">單位</label>
                        <ValidationProvider name="unit" :rules="{required: true, max: 3}" v-slot="{ classes, errors }">
                          <input
                            :class="classes"
                            type="unit"
                            class="form-control"
                            id="unit"
                            placeholder="三個字以內單位"
                            v-model="tempProduct.unit"
                          />
                          <p :class="classes">{{ errors[0] }}</p>
                        </ValidationProvider>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="origin_price">原價</label>
                        <ValidationProvider name="origin_price" :rules="{required: true, digits: true, max: 7}" v-slot="{ classes, errors }">
                            <!-- v-onlyEngNumber -->
                          <input
                            :class="classes"
                            type="text"
                            class="form-control"
                            id="origin_price"
                            placeholder="請輸入原價"
                            v-model="tempProduct.origin_price"
                            @input="restriction('number', 'origin_price', [0,7])"
                          />
                          <p :class="classes">{{ errors[0] }}</p>
                        </ValidationProvider>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="price">售價</label>
                        <ValidationProvider name="price" :rules="{required: true, digits: true, max: 7}" v-slot="{ classes, errors }">
                          <input
                            :class="classes"
                            type="number"
                            class="form-control"
                            id="price"
                            placeholder="請輸入原價"
                            v-model="tempProduct.price"
                          />
                          <p :class="classes">{{ errors[0] }}</p>
                        </ValidationProvider>
                      </div>
                    </div>
                    <hr />
                    <div class="form-group">
                      <label for="description">產品描述</label>
                      <ValidationProvider name="description" :rules="{required: true, max: 20}" v-slot="{ classes, errors }">
                        <textarea
                          :class="classes"
                          type="text"
                          class="form-control"
                          id="description"
                          placeholder="請輸入產品描述最多二十字"
                          v-model="tempProduct.description"
                          @input="restriction('chineseEngNumber', 'description', [0,20])"
                        ></textarea>
                        <p :class="classes">{{ errors[0] }}</p>
                      </ValidationProvider>
                    </div>
                    <div class="form-group">
                      <label for="content">說明內容</label>
                      <ValidationProvider name="content" :rules="{required: true, max: 20}" v-slot="{ classes, errors }">
                        <textarea
                          type="text"
                          :class="classes"
                          class="form-control"
                          id="content"
                          placeholder="請輸入產品說明內容"
                          v-model="tempProduct.content"
                          @input="restriction('chineseEngNumber', 'content', [0,20])"
                        ></textarea>
                        <p :class="classes">{{ errors[0] }}</p>
                      </ValidationProvider>
                    </div>
                    <div class="form-group">
                      <div class="form-check">
                        <!-- 修改 true, false 的值 -->
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="is_enabled"
                          v-model="tempProduct.is_enabled"
                          :true-value="1"
                          :false-value="0"
                        />
                        <label class="form-check-label" for="is_enabled">
                          是否啟用
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  data-dismiss="modal"
                  @click="reset"
                >
                  取消
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                >
                  確認
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
    <!-- productModal end-->

    <!-- delProductModal start -->
    <div
      class="modal fade"
      id="delProductModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
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
            <strong class="text-danger">{{ tempProduct.title }}</strong>
            商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteProduct()"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- delProductModal start -->
  </div>
</template>

<script>
import $ from "jquery"
import { mapState, mapActions, mapMutations } from 'vuex'
import { restriction } from '@/utility'
import UploadService from "@/uploadService"
export default {
  data () {
    return {
      tempProduct: {
        title: '',
        category: '',
        origin_price: '',
        price: '',
        unit: '',
        image: '',
        description: '',
        content: '',
        is_enabled: 0,
        imageUrl: '',
        isNew: true,
      },
      isDefault: true,
      progress: 0,
      currentFile: false,
      status: {
        fileLoading: false
      }
    }
  },
  created () {
    this.getProducts()
  },
  computed: {
    ...mapState([
      'isLoading',
      'isFullPage',
      'pagination',
      'products'
    ]),
    notFullPageLoading () {
      return this.isLoading && !this.isFullPage
    },
    isNoData(){
      return !this.products || this.products && this.products.length<1
    }
  },
  methods: {
    ...mapMutations([
      'SETLOADING'
    ]),
    ...mapActions([
      'GetProducts',
      'UpdateProduct',
      'DelProduct'
    ]),
    getProducts (page = 1, pagination = false) {
      return new Promise( ( resolve, reject )=> {
        if (this.isLoading || pagination && this.pagination.total_pages === 1) reject()
        const vm = this
        let apiData = {
          url: `/admin/products?page=${page}`,
          method: 'get',
        }
        vm.SETLOADING({ isLoading: true, isFullPage: false })
        vm.GetProducts(apiData).then(data => {
        let msgType = data.success ? 'success' : 'danger'
        if(data.message) vm.$bus.$emit('message:push', data.message, msgType)
          resolve()
        }).catch(error => {
          vm.$bus.$emit('message:push', error.message, 'danger')
          vm.SETLOADING({ isLoading: false, isFullPage: false })
          reject()
        })
      })
    },
    openProductModal (isNew, item) {
      if (!this.isLoading) {
        if (isNew) {
          this.tempProduct = {}
          this.isNew = true
          this.progress = 0
        } else {
          this.isDefault = false
          this.tempProduct = Object.assign({}, item)
          this.isNew = false
        }
        let modal = $('#productModal')
        if (modal) {
          modal.modal('show')
        }
      }
    },
    hideModal (id) {
      let modal = $(id)
      if (modal) {
        modal.modal('hide')
      }
      this.showImg = false
      this.isDefault = true
    },
    updateProduct () {
      if (this.isLoading) return
      const vm = this
      let apiData = {
        url: '/admin/product',
        method: 'post',
        data: {data: vm.tempProduct}
      }
      if (vm.isNew === false) {
        apiData.url += `/${vm.tempProduct.id}`
        apiData.method = 'put'
      }
      vm.SETLOADING({ isLoading: true, isFullPage: false })
      vm.hideModal('#productModal')
      vm.UpdateProduct(apiData).then(data => {
        vm.getProducts().then(res => {
          let msgType = data.success ? ('success') : 'danger'
          vm.$bus.$emit('message:push', data.message, msgType)
        })
      }).catch(error => {
        vm.$bus.$emit('message:push', error.message, 'danger')
        vm.SETLOADING({ isLoading: false, isFullPage: false })
      })
    },
    openDelProductModal (item) {
      const vm = this
      $('#delProductModal').modal('show')
      vm.tempProduct = Object.assign({}, item)
    },
    deleteProduct () {
      if (this.isLoading) return
      const vm = this
      let apiData = {
        url: `/admin/product/${vm.tempProduct.id}`,
        method: 'delete',
        data: {data: vm.tempProduct}
      }
      vm.hideModal('#delProductModal')
      vm.SETLOADING({ isLoading: true, isFullPage: false })
      vm.UpdateProduct(apiData).then(data => {
        vm.getProducts().then(res => {
          let msgType = data.success ? ('success') : 'danger'
          vm.$bus.$emit('message:push', data.message, msgType)
        })
      }).catch(error => {
        vm.$bus.$emit('message:push', error.message, 'danger')
        vm.SETLOADING({ isLoading: false, isFullPage: false })
      })
    },
    async uploadFile (e) {
      const { valid } = await this.$refs.provider.validate(e)
      if (this.$refs.fileInput.files.length !== 0 && valid) {
        // TODO: Upload the file
        console.log('Uploaded the file...')
        //利用 $ref 抓取 DOM 中讀到的檔案並模擬表單欄位的形式送出資料至API
        const vm = this
        this.currentFile = vm.$refs.fileInput.files[0]
        const formData = new FormData()
        formData.append('file-to-upload', this.currentFile)
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH
          }/admin/upload`

        //headers 需註明 Content-Type 為表單形式
        vm.axios
          .post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress : this.processSetting()
        })
          .then(response => {
            if (response.data.success === true) {
              vm.status.fileLoading = true
              let firstImg = new Image()
              firstImg.onload = () => {
                //因路徑使用 v-model 綁定物件內的值,故需用 $set強制寫入做雙向綁定
                // this.tempProduct.imageUrl = response.data.imageUrl
                vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
                vm.status.fileLoading = false
              }
              firstImg.src = response.data.imageUrl
            } else {
              vm.$bus.$emit('message:push', response.data.message.message, 'danger')
              vm.status.fileLoading = false
              vm.isDefault = true
              vm.progress = 0
            }
          })
          .catch(error => {
            console.log(error)
            vm.$bus.$emit('message:push', '伺服器內部錯誤', 'danger')
            vm.status.fileLoading = false
            vm.isDefault = true
            vm.progress = 0
          })
      } else {
        this.isDefault = true
        this.progress = 0
        this.currentFile = null
        return
      }
    },
    processSetting(){
      this.progress = 0
      return event => {
        this.progress = Math.round((100 * event.loaded) / event.total)
        if(this.progress < 100) return
        this.status.fileLoading = true
        this.isDefault = false
      }
    },
    restriction(type, fieldName, between){
      this.tempProduct[fieldName] = restriction( this.tempProduct[fieldName], type, between)
    },
    async onSubmit () {
      let success = await this.$refs.form.validate()
      if (!success) {
        return
      }
      this.updateProduct()

      // Resetting Values
      // Wait until the models are updated in the UI
      this.$nextTick(() => {
        this.$refs.form.reset()
      })
    },
    reset () {
      this.$refs.form.reset()
    }
  }
}
</script>

<style>
  table td,
  table th {
    vertical-align: middle !important;
    text-align: center !important;
  }
  .mt-10{
    margin-left: 35%;
    margin-top: 30px;
  }
  .prodImage{
    margin-top: 10px;
    height: 150px;
    background-size: cover;
    background-position: center;
  }
</style>
