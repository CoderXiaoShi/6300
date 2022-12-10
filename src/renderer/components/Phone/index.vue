<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Screen from './Screen/index.vue'
import Keyboard from './Keyboard/index.vue'

defineProps<{ msg: string }>()
const count = ref(0)
const phoneDom = ref()

onMounted(() => {
  console.log('phoneDom.value', phoneDom.value);
})

</script>

<template>
  <div class="phone" ref="phoneDom">
    <!-- 程序逻辑部分 -->
    <div class="container">
      <Screen />
      <Keyboard />
    </div>
    <!-- 手机的主体部分 -->
    <div class="box">
      <div class="top"></div>
    </div>
  </div>
</template>

<style scoped lang='less'>
@import url('./style.less');
</style>
