<script setup lang="ts">
import { onMounted } from 'vue'

</script>
<template>
  <div class="keyboard">

    <div class="row">
      <div class="col "  >1 <span class="more" >∝</span></div>
      <div class="col" >2 <span class="more">abc</span></div>
      <div class="col"><span class="more">def</span>3 </div>
    </div>
    <div class="row">
      <div class="col">4<span class="more">ghi</span></div>
      <div class="col ">5<span class="more">jkl</span></div>
      <div class="col"><span class="more">mno</span>6</div>
    </div>
    <div class="row">
      <div class="col">7<span class="more">pqrs</span></div>
      <div class="col">8<span class="more">tuv</span></div>
      <div class="col"><span class="more">wxyz</span>9</div>
    </div>
    <div class="row">
      <div class="col">*<span class="more">+</span></div>
      <div class="col">0<span class="more">&#10134;</span></div>
      <div class="col"><span class="more"></span>#</div>
    </div>

  </div>
</template>

<style lang="less" scoped>
@import url('./style.less');
</style>
