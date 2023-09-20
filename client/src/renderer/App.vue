<script setup lang="ts">
import Phone from './components/Phone/index.vue'
import BottomTools from './components/BottomTools/index.vue'
</script>

<template>
  <div class="container">
    <Phone />
  </div>
</template>

<style lang="less" scoped>
</style>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
