<template>
<div>
  <!-- Loading 套件 start-->
  <loading :active.sync="isLoading"></loading>
  <!-- Loading 套件 end-->

  <div class="row mt-2 topRow">
    <div class="mb-4">
      <button @click="openCouponModal()" type="button" class="btn btn-lg btn-success">新增優惠券</button>
    </div>
  </div>
  <div class="row ml-3 mr-1">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">名稱</th>
          <th scope="col">折扣百分比</th>
          <th scope="col">到期日</th>
          <th scope="col">是否啟用</th>
          <th scope="col">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coupon in coupons">
          <th scope="row">{{coupon.title}}</th>
          <td>{{coupon.percent/10 + '%'}}</td>
          <td>{{coupon.due_date}}</td>
          <td :class="{'text-success': coupon.is_enabled, 'text-danger': !coupon.is_enabled}">{{coupon.is_enabled ? '啟用':'未啟用'}}</td>
          <td>
            <button @click="openCouponModal(coupon)" type="button" class="btn-sm btn-outline-primary sm">修改</button>
            <button @click="openDelCouponModal(coupon)" type="button" class="btn-sm btn-outline-danger">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal start-->
  <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">新增優惠券</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form class="needs-validation" novalidate>
            <div class="form-row">
              <div class="col-md-12 mb-3">
                <label for="validationCustom01">標題</label>
                <input v-model="coupon.title" type="text" class="form-control" id="validationCustom01" placeholder="請輸入標題" value="" required>
                <div class="valid-feedback">
                  Looks good!
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="validationCustom02">優惠百分比</label>
                <input v-model="coupon.percent" type="text" class="form-control" id="validationCustom02" placeholder="請輸入優惠百分比" value="" required>
                <div class="valid-feedback">
                  Looks good!
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="validationCustomUsername">到期日</label>
                <div class="input-group">
                  <input v-model="coupon['due_date']" type="text" class="form-control" id="validationCustomUsername" placeholder="請輸入到期日" aria-describedby="inputGroupPrepend" required>
                  <div class="invalid-feedback">
                    Please choose a username.
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input v-model="coupon['is_enabled']" class="form-check-input" type="checkbox" value="" id="invalidCheck" required>
                <label class="form-check-label" for="invalidCheck">
                  是否啟用
                </label>
                <div class="invalid-feedback">
                  You must agree before submitting.
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="addCoupon()" class="btn btn-lg btn-primary mr-3" type="submit">送出</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal end-->

  <!-- delCouponModal start -->
  <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>刪除優惠券</span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          是否刪除 <strong class="text-danger">{{coupon.title}}</strong> 優惠券(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="delCoupon()">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
  <!-- delCouponModal start -->

  <!-- 分頁標籤 start -->
  <nav aria-label="Page navigation example">
    <ul class="pagination mt-2">
      <li class="page-item" :class="{'disabled': !pagination.has_pre}">
        <a @click.prevent="getCoupons(pagination.current_page - 1)" class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      <!-- 利用 total_pages 數字做 v-for 迴圈 -->
      <li class="page-item" :class="{'active': pagination.current_page === page}" v-for="page in pagination.total_pages" :key="page"><a class="page-link" href="#" @click.prevent="getCoupons(page)">{{page}}</a></li>
      <li class="page-item" :class="{'disabled': !pagination.has_next}">
        <a @click.prevent="getCoupons(pagination.current_page + 1)" class="page-link" href="#" aria-label="Next">
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
export default {
  name: "Alert",
  data() {
    return {
      pagination: {},
      coupon: {
        title: "",
        is_enabled: "",
        percent: "",
        due_date: "",
        code: ""
      },
      coupons: []
    };
  },
  methods: {
    openCouponModal(coupon = {}) {
      if (coupon !== {}) {
        this.coupon = coupon;
      }
      $("#couponModal").modal("show");
    },
    closeCouponModal() {
      $("#couponModal").modal("hide");
    },
    closeDelCouponModal() {
      $("#delCouponModal").modal("hide");
    },
    openDelCouponModal(coupon = {}) {
      if (coupon !== {}) {
        this.coupon = coupon;
      }
      $("#delCouponModal").modal("show");
    },
    addCoupon() {
      const vm = this;
      let api;
      let method;
      let id;
      // 新增優惠券
      if (vm.coupon === {}) {
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/coupon`;
        method = "post";
      } else if (vm.coupon.id) {
        // 修改優惠券
        method = "put";
        id = vm.coupon.id;
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/coupon/${id}`;
      }
      vm.isLoading = true;
      vm.axios[method](api, { data: vm.coupon })
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data);
          } else {
            console.log("新增優惠券失敗");
            // console.log("response.data: ", response.data);
            vm.$bus.$emit("message:push", "新增優惠券失敗", "danger");
          }
          vm.getCoupons();
          vm.isLoading = false;
          vm.closeCouponModal();
          vm.coupon = {};
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.getCoupons();
          vm.isLoading = false;
          vm.closeCouponModal();
          vm.coupon = {};
        });
    },
    getCoupons(page = 1) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupons?page=${page}`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            // console.log("response.data: ", response.data);
            vm.coupons = response.data.coupons;
            vm.pagination = response.data.pagination;
          } else {
            console.log("取得優惠券列表失敗");
            vm.$bus.$emit("message:push", "取得優惠券列表失敗", "danger");
          }
          vm.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.isLoading = false;
        });
    },
    delCoupon() {
      const vm = this;
      vm.isLoading = true;
      let id = vm.coupon.id;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon/${id}`;
      vm.axios
        .delete(api)
        .then(response => {
          vm.closeDelCouponModal();
          if (response.data.success) {
            console.log("response.data: ", response.data);
          } else {
            console.log("刪除優惠券失敗");
            vm.$bus.$emit("message:push", "刪除優惠券失敗", "danger");
          }
          vm.isLoading = false;
          vm.getCoupons();
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.isLoading = false;
          vm.getCoupons();
          vm.closeDelCouponModal();
        });
    }
  },
  created() {
    this.getCoupons();
  }
};
</script>

<style scope>
html {
  font-size: 14px;
}
@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

.topRow {
  flex-direction: row-reverse;
}
</style>
