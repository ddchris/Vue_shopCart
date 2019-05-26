webpackJsonp([6],{KKnu:function(t,a){},h3ij:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var o=e("7t+N"),s=e.n(o),n={name:"Alert",data:function(){return{type:"add",pagination:{},coupon:{},coupons:[]}},methods:{openCouponModal:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments[1];t!=={}&&(this.coupon=t),this.type="add"===a?"add":"edit",s()("#couponModal").modal("show")},closeCouponModal:function(){s()("#couponModal").modal("hide")},closeDelCouponModal:function(){s()("#delCouponModal").modal("hide")},openDelCouponModal:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t!=={}&&(this.coupon=t),s()("#delCouponModal").modal("show")},addCoupon:function(){var t=this,a=void 0,e=void 0;"add"===this.type?(a="https://vue-course-api.hexschool.io/api/chris2012/admin/coupon",e="post"):(e="put",a="https://vue-course-api.hexschool.io/api/chris2012/admin/coupon/"+t.coupon.id),t.isLoading=!0,t.axios[e](a,{data:t.coupon}).then(function(a){a.data.success||(console.log("新增優惠券失敗"),t.$bus.$emit("message:push","新增優惠券失敗","danger")),t.getCoupons(),t.isLoading=!1,t.closeCouponModal(),t.coupon={}}).catch(function(a){console.log(a),t.$bus.$emit("message:push","伺服器內部錯誤!!!","danger"),t.getCoupons(),t.isLoading=!1,t.closeCouponModal(),t.coupon={}})},getCoupons:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,a=this;a.isLoading=!0;var e="https://vue-course-api.hexschool.io/api/chris2012/admin/coupons?page="+t;a.axios.get(e).then(function(t){t.data.success?(a.coupons=t.data.coupons,a.pagination=t.data.pagination):(console.log("取得優惠券列表失敗"),a.$bus.$emit("message:push","取得優惠券列表失敗","danger")),a.isLoading=!1}).catch(function(t){console.log(t),a.$bus.$emit("message:push","伺服器內部錯誤!!!","danger"),a.isLoading=!1})},delCoupon:function(){var t=this;t.isLoading=!0;var a="https://vue-course-api.hexschool.io/api/chris2012/admin/coupon/"+t.coupon.id;t.axios.delete(a).then(function(a){t.closeDelCouponModal(),a.data.success?console.log("response.data: ",a.data):(console.log("刪除優惠券失敗"),t.$bus.$emit("message:push","刪除優惠券失敗","danger")),t.isLoading=!1,t.getCoupons(t.pagination.current_page)}).catch(function(a){console.log(a),t.$bus.$emit("message:push","伺服器內部錯誤!!!","danger"),t.isLoading=!1,t.getCoupons(),t.closeDelCouponModal()})}},created:function(){this.getCoupons()}},i={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",[e("loading",{attrs:{active:t.isLoading},on:{"update:active":function(a){t.isLoading=a}}}),t._v(" "),e("div",{staticClass:"row mt-2 topRow"},[e("div",{staticClass:"mb-4"},[e("button",{staticClass:"btn btn-lg btn-success",attrs:{type:"button"},on:{click:function(a){t.openCouponModal({},"add")}}},[t._v("新增優惠券")])])]),t._v(" "),e("div",{staticClass:"row ml-3 mr-1"},[e("table",{staticClass:"table table-hover"},[t._m(0),t._v(" "),e("tbody",t._l(t.coupons,function(a){return e("tr",[e("th",{attrs:{scope:"row"}},[t._v(t._s(a.title))]),t._v(" "),e("td",[t._v(t._s(a.percent+"%"))]),t._v(" "),e("td",[t._v(t._s(a.due_date))]),t._v(" "),e("td",[t._v(t._s(a.code))]),t._v(" "),e("td",{class:{"text-success":a.is_enabled,"text-danger":!a.is_enabled}},[t._v(t._s(a.is_enabled?"啟用":"未啟用"))]),t._v(" "),e("td",[e("button",{staticClass:"btn-sm btn-outline-primary sm",attrs:{type:"button"},on:{click:function(e){t.openCouponModal(a,"edit")}}},[t._v("修改")]),t._v(" "),e("button",{staticClass:"btn-sm btn-outline-danger",attrs:{type:"button"},on:{click:function(e){t.openDelCouponModal(a)}}},[t._v("刪除")])])])}))])]),t._v(" "),e("div",{staticClass:"modal fade",attrs:{id:"couponModal",tabindex:"-1",role:"dialog","aria-labelledby":"exampleModalCenterTitle","aria-hidden":"true"}},[e("div",{staticClass:"modal-dialog modal-dialog-centered",attrs:{role:"document"}},[e("div",{staticClass:"modal-content"},[t._m(1),t._v(" "),e("div",{staticClass:"modal-body"},[e("form",{staticClass:"needs-validation",attrs:{novalidate:""}},[e("div",{staticClass:"form-row"},[e("div",{staticClass:"col-md-12 mb-3"},[e("label",{attrs:{for:"validationCustom01"}},[t._v("標題")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.coupon.title,expression:"coupon.title"}],staticClass:"form-control",attrs:{type:"text",id:"validationCustom01",placeholder:"請輸入標題",value:"",required:""},domProps:{value:t.coupon.title},on:{input:function(a){a.target.composing||t.$set(t.coupon,"title",a.target.value)}}}),t._v(" "),e("div",{staticClass:"valid-feedback"},[t._v("\n                  Looks good!\n                ")])]),t._v(" "),e("div",{staticClass:"col-md-6 mb-3"},[e("label",{attrs:{for:"validationCustom02"}},[t._v("優惠百分比")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.coupon.percent,expression:"coupon.percent"}],staticClass:"form-control",attrs:{type:"text",id:"validationCustom02",placeholder:"請輸入優惠百分比",value:"",required:""},domProps:{value:t.coupon.percent},on:{input:function(a){a.target.composing||t.$set(t.coupon,"percent",a.target.value)}}}),t._v(" "),e("div",{staticClass:"valid-feedback"},[t._v("\n                  Looks good!\n                ")])]),t._v(" "),e("div",{staticClass:"col-md-6 mb-3"},[e("label",{attrs:{for:"validationCustomUsername"}},[t._v("優惠碼")]),t._v(" "),e("div",{staticClass:"input-group"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.coupon.code,expression:"coupon.code"}],staticClass:"form-control",attrs:{type:"text",id:"validationCustomUsername",placeholder:"請輸入優惠碼","aria-describedby":"inputGroupPrepend",required:""},domProps:{value:t.coupon.code},on:{input:function(a){a.target.composing||t.$set(t.coupon,"code",a.target.value)}}}),t._v(" "),e("div",{staticClass:"invalid-feedback"},[t._v("\n                    Please choose a username.\n                  ")])])]),t._v(" "),e("div",{staticClass:"col-md-6 mb-3"},[e("label",{attrs:{for:"validationCustomUsername"}},[t._v("到期日")]),t._v(" "),e("div",{staticClass:"input-group"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.coupon.due_date,expression:"coupon['due_date']"}],staticClass:"form-control",attrs:{type:"date",id:"validationCustomUsername",placeholder:"請輸入到期日","aria-describedby":"inputGroupPrepend",required:""},domProps:{value:t.coupon.due_date},on:{input:function(a){a.target.composing||t.$set(t.coupon,"due_date",a.target.value)}}}),t._v(" "),e("div",{staticClass:"invalid-feedback"},[t._v("\n                    Please choose a username.\n                  ")])])])]),t._v(" "),e("div",{staticClass:"form-group"},[e("div",{staticClass:"form-check"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.coupon.is_enabled,expression:"coupon['is_enabled']"}],staticClass:"form-check-input",attrs:{type:"checkbox",value:"",id:"invalidCheck",required:""},domProps:{checked:Array.isArray(t.coupon.is_enabled)?t._i(t.coupon.is_enabled,"")>-1:t.coupon.is_enabled},on:{change:function(a){var e=t.coupon.is_enabled,o=a.target,s=!!o.checked;if(Array.isArray(e)){var n=t._i(e,"");o.checked?n<0&&t.$set(t.coupon,"is_enabled",e.concat([""])):n>-1&&t.$set(t.coupon,"is_enabled",e.slice(0,n).concat(e.slice(n+1)))}else t.$set(t.coupon,"is_enabled",s)}}}),t._v(" "),e("label",{staticClass:"form-check-label",attrs:{for:"invalidCheck"}},[t._v("\n                  是否啟用\n                ")]),t._v(" "),e("div",{staticClass:"invalid-feedback"},[t._v("\n                  You must agree before submitting.\n                ")])])])])]),t._v(" "),e("div",{staticClass:"modal-footer"},[e("button",{staticClass:"btn btn-lg btn-primary mr-3",attrs:{type:"submit"},on:{click:function(a){t.addCoupon()}}},[t._v("送出")])])])])]),t._v(" "),e("div",{staticClass:"modal fade",attrs:{id:"delCouponModal",tabindex:"-1",role:"dialog","aria-labelledby":"exampleModalLabel","aria-hidden":"true"}},[e("div",{staticClass:"modal-dialog",attrs:{role:"document"}},[e("div",{staticClass:"modal-content border-0"},[t._m(2),t._v(" "),e("div",{staticClass:"modal-body"},[t._v("\n          是否刪除 "),e("strong",{staticClass:"text-danger"},[t._v(t._s(t.coupon.title))]),t._v(" 優惠券(刪除後將無法恢復)。\n        ")]),t._v(" "),e("div",{staticClass:"modal-footer"},[e("button",{staticClass:"btn btn-outline-secondary",attrs:{type:"button","data-dismiss":"modal"}},[t._v("取消")]),t._v(" "),e("button",{staticClass:"btn btn-danger",attrs:{type:"button"},on:{click:function(a){t.delCoupon()}}},[t._v("確認刪除")])])])])]),t._v(" "),e("nav",{attrs:{"aria-label":"Page navigation example"}},[e("ul",{staticClass:"pagination mt-2"},[e("li",{staticClass:"page-item",class:{disabled:!t.pagination.has_pre}},[e("a",{staticClass:"page-link",attrs:{href:"#","aria-label":"Previous"},on:{click:function(a){a.preventDefault(),t.getCoupons(t.pagination.current_page-1)}}},[e("span",{attrs:{"aria-hidden":"true"}},[t._v("«")]),t._v(" "),e("span",{staticClass:"sr-only"},[t._v("Previous")])])]),t._v(" "),t._l(t.pagination.total_pages,function(a){return e("li",{key:a,staticClass:"page-item",class:{active:t.pagination.current_page===a}},[e("a",{staticClass:"page-link",attrs:{href:"#"},on:{click:function(e){e.preventDefault(),t.getCoupons(a)}}},[t._v(t._s(a))])])}),t._v(" "),e("li",{staticClass:"page-item",class:{disabled:!t.pagination.has_next}},[e("a",{staticClass:"page-link",attrs:{href:"#","aria-label":"Next"},on:{click:function(a){a.preventDefault(),t.getCoupons(t.pagination.current_page+1)}}},[e("span",{attrs:{"aria-hidden":"true"}},[t._v("»")]),t._v(" "),e("span",{staticClass:"sr-only"},[t._v("Next")])])])],2)])],1)},staticRenderFns:[function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("thead",[e("tr",[e("th",{attrs:{scope:"col"}},[t._v("名稱")]),t._v(" "),e("th",{attrs:{scope:"col"}},[t._v("折扣百分比")]),t._v(" "),e("th",{attrs:{scope:"col"}},[t._v("到期日")]),t._v(" "),e("th",{attrs:{scope:"col"}},[t._v("優惠碼")]),t._v(" "),e("th",{attrs:{scope:"col"}},[t._v("是否啟用")]),t._v(" "),e("th",{attrs:{scope:"col"}},[t._v("編輯")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"modal-header"},[a("h5",{staticClass:"modal-title",attrs:{id:"exampleModalCenterTitle"}},[this._v("新增優惠券")]),this._v(" "),a("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"}},[a("span",{attrs:{"aria-hidden":"true"}},[this._v("×")])])])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"modal-header bg-danger text-white"},[a("h5",{staticClass:"modal-title",attrs:{id:"exampleModalLabel"}},[a("span",[this._v("刪除優惠券")])]),this._v(" "),a("button",{staticClass:"close",attrs:{type:"button","data-dismiss":"modal","aria-label":"Close"}},[a("span",{attrs:{"aria-hidden":"true"}},[this._v("×")])])])}]};var l=e("VU/8")(n,i,!1,function(t){e("KKnu")},null,null);a.default=l.exports}});
//# sourceMappingURL=6.7d9fd139291f03603a85.js.map