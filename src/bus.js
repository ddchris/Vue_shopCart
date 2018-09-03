import Vue from 'vue';

// 將 $bus 掛載在 Vue 的原型下做監聽,並注入 main.js
Vue.prototype.$bus = new Vue();

// 由於 event bus 為跨元件監聽,方法名稱及用法可註記於此
// 方法名稱 'messsage:push'
// 參數: message: 訊息內容, status: 樣式，預設值為 warning
// 在 $bus 上使用 $on監聽自定義事件
// vm.$bus.$on('message:push', (message, status = 'warning') => {
//     vm.updateMessage(message, status);
//   });