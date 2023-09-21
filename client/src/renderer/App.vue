<script setup lang="ts">
import Phone from './components/Phone/index.vue'
import BottomTools from './components/BottomTools/index.vue'

import Test from './components/Test.vue'

import { userStore } from './store/user'

// 初始化部分
// 1. 初始化手机号
const user = userStore()
user.register(); // 注册手机号

// 2. 连接 socket
import '@/utils/socket'

</script>

<template>
  <div class="container">
    <h3>test</h3>
    <hr>
    <Test />
    <!-- <Phone /> -->
  </div>
</template>

<style lang="less" scoped></style>

<style scoped>
.container {
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
