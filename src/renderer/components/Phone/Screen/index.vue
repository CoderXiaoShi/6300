<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MenuKeyboard from './MenuKeyboard/index.vue'

</script>
<template>
  <div class="screen">
    <div class="screen-panel">
      <div class="head center">
        <div class="receiver"></div>
        <p>程序员小石</p>
      </div>
      <div class="layout">
        <div class="screen-view">
          <!-- <router-view /> -->
        </div>
      </div>
      <div class="keyboard" >
        <MenuKeyboard />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url('./style.less');
</style>
