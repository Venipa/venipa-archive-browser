<template>
  <div class="layout-main">
    <div class="container my-4 d-flex flex-column">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>
<style scoped lang="scss">
.layout-main {
  display: flex;
  flex: 1 1;
  height: 100%;
  min-height: 500px;
}
</style>
