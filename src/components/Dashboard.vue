<template>
  <div>
    <NavBar/>
    <Alert></Alert>
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
import Alert from "./AlertMessage"
export default {
  components: {
    NavBar,
    SideBar,
    Alert
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
  margin-left: 184 !important;
}

@media screen and (max-width: 1000px) {
  [role="main"] {
    margin-left: 194px !important;
  }
}

@media screen and (max-width: 867px) {
  [role="main"] {
    margin-left: 160px !important;
  }
}

@media screen and (max-width: 768px) {
  [role="main"] {
    padding-top: 146px;
    margin-left: auto !important;
  }
}

</style>
