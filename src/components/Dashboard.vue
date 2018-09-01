<template>
  <div>
    <NavBar/>
    <div class="container-fluid">
      <div class="row">
        <SideBar></SideBar>
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <router-view></router-view>
          </main>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "./NavBar";
import SideBar from "./SideBar";
export default {
  components: {
    NavBar,
    SideBar
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  font-size: 0.875rem;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}
/*
  * Content
  */
[role="main"] {
  padding-top: 70px; /* Space for fixed navbar */
  margin-left: 274px !important;
}

@media screen and (max-width: 1450px) {
  [role="main"] {
    margin-left: 224px !important;
  }
}

@media screen and (max-width: 1250px) {
  [role="main"] {
    margin-left: 204px !important;
  }
}

@media screen and (max-width: 1000px) {
  [role="main"] {
    margin-left: 184px !important;
  }
}

@media screen and (max-width: 830px) {
  [role="main"] {
    padding-top: 80px;
    margin-left: auto !important;
  }
}

</style>
