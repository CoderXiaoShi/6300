<script setup lang="ts">
import { userStore } from '@/store/user'
import useRoomHooks from '@/hooks/useRoomHooks'

// 初始化部分
// 1. 初始化手机号
const user = userStore()
const roomHook = useRoomHooks()

// user.editContact({ phone: '15073235172' })
// user.editContact({ phone: '15030877211' })
// user.editContact({ phone: '150' })

</script>
<template>
  <h4>room</h4>

  <hr>
  <div>
    {{ user.data.phone }}
    <hr>
    <ul>
      <li v-for="contactItem of user.data.contacts">
        {{ contactItem.phone }}
        <button @click="roomHook.call(contactItem.phone)" v-if="contactItem.phone !== user.data.phone">call</button>
      </li>
    </ul>
  </div>
  <canvas id="canvas" width="300" height="200"></canvas>
  <video id="remoteVideo" autoplay style="width: 300px; height: 200px;" controls></video>
</template>
<style scoped>
#canvas {
  position: fixed;
  border: 1px solid #000;
  top: 0;
  left: 0;
}
</style>