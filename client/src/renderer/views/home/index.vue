<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue'
import Header from '../../components/Phone/Header/index.vue'
import { KeyboardCode } from '@/constant/enum';
import EventHub from "@/utils/eventHub";


const router = useRouter();

const toMenuPage = () => router.push('/menu')

const toContact = () => router.push('/contacts')

onMounted(() => {
  EventHub.on(KeyboardCode.Enter, toMenuPage)
  EventHub.on(KeyboardCode.btnRightTop, toContact)
})

onUnmounted(() => {
  EventHub.off(KeyboardCode.Enter, toMenuPage)
  EventHub.off(KeyboardCode.btnRightTop, toContact)
})

</script>

<template>
  <div class="page">
    <Header />
    <div class="bottom">
      <span style="text-align: left;">捷径</span>
      <span style="font-size: 14px">功能表</span>
      <span style="text-align: right;">通讯录</span>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
