<template>
  <div>
    <!-- Loading 套件 start-->
    <loading
      :active.sync="fullPageLoading"
      :is-full-page="true"
      :background-color="'#959595'"
      :loader="'dots'"
      :color="'green'"
      :height="80"
      :width="80"
    ></loading>
    <!-- Loading 套件 end-->
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Company name</a>
      <input
        class="form-control form-control-dark w-100"
        type="text"
        placeholder="Search"
        aria-label="Search"
      />
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" @click.prevent="logout()">登出</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: "NavBar",
  data () {
    return {
    };
  },
  computed: {
    ...mapState([
      'isLoading',
      'isFullPage'
    ]),
    fullPageLoading () {
      return this.isLoading && this.isFullPage
    }
  },
  methods: {
    ...mapMutations([
      'SETLOADING'
    ]),
    logout () {
      const vm = this;
      vm.SETLOADING(true)
      const api = `${process.env.APIPATH}/logout`;
      this.axios
        .post(api)
        .then(response => {
          if (response.data.success === true) {
            vm.SETLOADING(false)
            vm.$router.push("/login");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
/*
  * Navbar
  */

.navbar-brand {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
}

.navbar .form-control {
  padding: 0.75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #959595;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}

.navbar-nav {
  cursor: pointer;
}
</style>
