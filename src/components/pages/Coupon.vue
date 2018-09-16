<template>
<div>
  <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
      <h4 class="my-0 mr-md-auto font-weight-normal mt-2">優惠券管理</h4>
      <button class="btn btn-outline-primary mt-2" @click="addCoupon()">新增優惠券</button>
  </div>
  <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
    <h5 class="display-6">優惠券清單</h5>
  </div>
  <div class="container">
    <div class="row card-deck mb-3 text-center">
      <div v-for="item in coupons" class="col-5 card mb-4 box-shadow coupon" :key="item.id">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">{{item.title}}</h4>
        </div>
        <div class="card-body" style="height: 150px; background-size: cover; background-position: center" :style="{backgroundImage: `url(https://storage.googleapis.com/vue-course-api.appspot.com/chris2012%2F1537107515811.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=hFfxlDytb%2ByFPlyXsKpDGwB%2BC3OoMpilVVWXe33hKvJ0r0J9Uj7VMvSx2zVRHcGE6iwT1%2B86%2BnL5qC6uaM6s7P5OFlvM9FNkRCE44B646qpEolxcCt%2B4zMxkigfsxjnpmmBaTsNgaDsanvvCAygipWAwan6HVWW44sw%2B%2FfbUgK6q4AKTnb9PEwtGXaMyW0AEFkiM%2BeWTcLfTkiuFw3xVhINbIdjweaZDlW5HPD3EzEn2QJkUzym%2BVTfw3UKQ35HDbDRm7k8WHRhk0W82GiThFzrmd9QhodwIH2RMELLSxRzPmuxaA99Ha76ntP8JY1R5ja%2Fg1EpwOlOUngIp2jK%2Bgw%3D%3D)`}">
          <h1 class="card-title pricing-card-title">${{item.percent/10}}%<small class="text-muted"> off</small></h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>是否有效: {{item.is_enabled ? '可用': '不可用'}}</li>
            <li>優惠券代碼: {{item.code}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- 分頁標籤 start -->
  <nav aria-label="Page navigation example">
    <ul class="pagination mt-2">
      <li class="page-item" :class="{'disabled': !pagination.has_pre}">
        <a @click.prevent="getCoupon(pagination.current_page - 1)" class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </a>
      </li>
      <!-- 利用 total_pages 數字做 v-for 迴圈 -->
      <li class="page-item" :class="{'active': pagination.current_page === page}" v-for="page in pagination.total_pages" :key="page"><a class="page-link" href="#" @click.prevent="getCoupon(page)">{{page}}</a></li>
      <li class="page-item" :class="{'disabled': !pagination.has_next}">
        <a @click.prevent="getCoupon(pagination.current_page + 1)" class="page-link" href="#" aria-label="Next">
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
export default {
  name: "Alert",
  data() {
    return {
      pagination: {},
      coupon: {
        title: "testCoupon",
        is_enabled: 1,
        percent: 75,
        due_date: 9999999999,
        code: "5566"
      },
      coupons:[]
    };
  },
  methods: {
    addCoupon() {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon`;
      console.log("vm.coupon: ", vm.coupon);
      vm.axios
        .post(api, { data: vm.coupon })
        .then(response => {
          if (response.data.success) {
            console.log("response.data: ", response.data);
            // vm.getCart();
          } else {
            console.log("新增優惠券失敗");
            console.log("response.data: ", response.data);
            vm.$bus.$emit("message:push", "新增優惠券失敗", "danger");
          }
          vm.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤!!!", "danger");
          vm.isLoading = false;
        });
    },
    getCoupon(page = 1) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupons?page=${page}`;
      vm.axios
        .get(api)
        .then(response => {
          if (response.data.success) {
            console.log("response.data: ", response.data);
            vm.coupons = response.data.coupons
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
    }
  },
  created() {
    this.getCoupon();
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

.container {
  max-width: 960px;
}

.pricing-header {
  max-width: 700px;
}

.card-deck .card {
  min-width: 220px;
}

.border-top {
  border-top: 1px solid #e5e5e5;
}
.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}

.box-shadow {
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
}

</style>
