<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MenuKeyboard from './MenuKeyboard/index.vue'
import OpenAnim from '../../OpenAnim/index.vue'
import { systemStore } from '../../../store/system'
import { SystemStatus, CallStatus } from '../../../constant/enum'
import bkg03 from '../../../assets/bkg/3.jpeg'
import Call from '../Call/index.vue'

const store = systemStore()

</script>
<template>
  <div class="screen">
    <div class="screen-panel">
      <div class="head center">
        <div class="receiver"></div>
        <p>程序员小石</p>
      </div>
      <div class="layout">
        <div class="screen-view" :style="`background: url(${bkg03}); background-size: 100% 100%;`">
          <Call v-show="store.data.callStatus !== CallStatus.Close" />
          <OpenAnim v-if="store.data.state === SystemStatus.close" />
          <router-view v-if="store.data.state === SystemStatus.open && store.data.callStatus === CallStatus.Close" />
        </div>
      </div>
      <div class="keyboard">
        <MenuKeyboard />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url('./style.less');
</style>
