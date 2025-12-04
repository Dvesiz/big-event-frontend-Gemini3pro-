<script setup>
// 这里可以引入一些全局的 setup 逻辑，但对于根组件，通常只需要 `<router-view />`
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
/* 可以在这里添加一些全局样式，例如重置 body 边距，确保应用铺满屏幕 */
body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>