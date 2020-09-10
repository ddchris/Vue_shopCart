<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    window.store = this.$store.state
  },
}
</script>


<style lang="scss">
// 宣告使用 scss
@import "./assets/all.scss";
</style>

