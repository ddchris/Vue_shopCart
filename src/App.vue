<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-light">Light</button>
    <button type="button" class="btn btn-dark">Dark</button>
    <button type="button" class="btn btn-link">Link</button>
  </div>
</template>

<script>
export default {
  name: 'App',
created() {
  this.axios.get(`${process.env.APIPATH}${process.env.CUSTOMPATH}/products`).then((response) => {
  console.log(response.data)
})
},
}
</script>


<style lang="scss">
// 宣告使用 scss
@import "./assets/all.scss";
</style>
