<script setup lang="ts">
import { onMounted } from 'vue'
import EventHub from '@/utils/eventHub'

const reset = () => EventHub.emit('reset')

</script>
<template>
  <div class="bottomTools center">
    <i class="iconfont icon-ico_reset" @click.stop="reset"></i>
    <!-- <i class="iconfont icon-guanji"></i> -->
  </div>
</template>
<style lang='less' scoped>
.bottomTools {
  background: #ccc;
  width: 300px;
  height: 30px;
  margin-top: 20px;
  border-radius: 4px;
  /* filter: blur(2px); */
  box-shadow: 0 0 10px #ccc;
  -webkit-app-region: drag;
  cursor: move;

  .iconfont {
    cursor: pointer;
    margin-right: 10px;

    &:hover {
      color: #666;
      -webkit-app-region: no-drag;
    }
  }
}
</style>