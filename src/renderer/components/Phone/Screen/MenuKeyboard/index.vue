<script setup lang="ts">
import { onMounted } from 'vue'

</script>
<template>
  <div class="menu-keyboard">
    <div class="col">
      <div class="menu-btn center btn-box-shadow"><div class="dot blue"></div></div>
      <div class="menu-btn center btn-box-shadow"><div class="dot green"></div></div>
    </div>
    <div class="col">
      <div class="direction-keyboard"></div>
      <div class="enter-keyboard "></div>
    </div>
    <div class="col">
      <div class="menu-btn center btn-box-shadow"><div class="dot blue"></div></div>
      <div class="menu-btn center btn-box-shadow"><div class="dot red"></div></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.menu-keyboard{
  // border: 1px solid red;
  height: 60px;
  margin: 0 10px;
  margin-top: 17px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .direction-keyboard{
    background: linear-gradient(121deg, #f4f4f4 0%, #c4c4c4 100%);
    border-radius: 5px;
    width: 50px;
    height: 50px;
    position: relative;
  }
  .enter-keyboard{
    background: #000;
    width: 39px;
    height: 39px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    &:active{
      transform: translate(-50%, -50%) scale(.98);
    }
  }
  .col{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 50px;
  }
  .btn-box-shadow{
    box-shadow: 2px 2px 3px #262626, 1px 1px 2px 0px inset #7d7d7d;
    &:active{
      box-shadow: 0px 0px 3px #262626, 0px 0px 2px 0px inset #7d7d7d;
    }
  }
  .menu-btn{
    width: 35px;
    height: 17px;
    background: #000;
    border-radius: 3px;
  }
  .dot{
    width: 6px;
    height: 3px;
  }
  .blue{ background: blue; }
  .red{ background: #700202; }
  .green{ background: #024c02; }
}
</style>
