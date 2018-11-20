<template>
  <div class="text-center">
    <Alert></Alert>
    <!-- Loading 套件 start-->
    <loading :active.sync="isLoading"></loading>
    <!-- Loading 套件 end-->

    <!-- 表單可以監聽submit事件並取消預設 -->
    <form class="form-signin" @submit.prevent="login">
      <img class="mb-4" src="./../../assets/imgs/login.png" alt="" width="86" height="86">
      <h1 class="h3 mb-3 font-weight-normal">請輸入登入資訊</h1>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" v-model="user.username" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" v-model="user.password" id="inputPassword" class="form-control" placeholder="Password" required>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> 記住我
        </label>
      </div>
      <button class="btn btn-lg btn-primary btn-block" type="submit">立即登入</button>
      <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
    </form>
  </div>
</template>

<script>
import Alert from "../AlertMessage";
export default {
  name: "Login",
  components: {
    Alert
  },
  data() {
    return {
      user: {
        username: "",
        password: ""
      },
      isLoading: false
    };
  },
  methods: {
    login() {
      const vm = this;
      const api = `${process.env.APIPATH}/admin/signin`;
      vm.isLoading = true;
      this.axios
        .post(api, vm.user)
        .then(response => {
          if (response.data.success) {
            vm.$router.push("/admin/products");
          } else {
            vm.$bus.$emit("message:push", "帳號密碼錯誤,請重新輸入", "danger");
          }
          vm.isLoading = false;
        })
        .catch(function(error) {
          console.log(error);
          vm.$bus.$emit("message:push", "伺服器內部錯誤", "danger");
          vm.isLoading = false;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  padding-top: 10%;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
