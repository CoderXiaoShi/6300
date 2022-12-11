<script setup lang="ts">
import { onMounted, ref } from 'vue'
import moment from 'moment'

const time = ref(moment())
const isShowDot = ref(true)

setInterval(() => {
  time.value = moment()
  isShowDot.value = parseInt(time.value.format('ss')) % 2 === 0
}, 1000)

</script>
<template>
  <div class="header">
    <div class="left">
      <i class="iconfont icon-xinhao"></i>
      <div class="battery">
        <div class="battery-process-container" >
          <div class="battery-process " style="width: 50%;"></div>
          <!-- battery-process-warning -->
        </div>
      </div>
    </div>
    <div class="right">
      <div class="time" >{{ time.format('HH') }}<div v-if="isShowDot" class="dot">:</div><div v-else class="dot"></div>{{ time.format('mm') }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header{
  color: #fff;
  height: 20px;
  font-size: 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0 3px;
  justify-content: space-between;
  -webkit-app-region: drag;
  .right, .left{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .battery{
    height: 12px;
    width: 20px;
    box-sizing: border-box;
    display: flex;
    margin-left: 4px;
    flex-direction: row;
    justify-content: right;
    position: relative;
    &::after{
      display: block;
      content: ' ';
      width: 2px;
      height: 8px;
      background: #fff;
      position: absolute;
      top: 2px;
      z-index: 1;
      left: -2px;
    }
    .battery-process-container{
      position: relative;
      z-index: 2;
      height: 12px;
      width: 20px;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 2px;
      display: flex;
      flex-direction: row;
      justify-content: right;
      overflow: hidden;
    }
    .battery-process{
      height: 12px;
      background: linear-gradient(to bottom, rgb(136, 223, 136), green);
    }
    .battery-process-warning{
      background: linear-gradient(to bottom, rgb(255, 119, 119), rgb(223, 10, 10));
    }
  }
  .time{
    color: #000;
    text-shadow:
    #eee 1px 0 0,
    #eee 0 1px 0,
    #eee -1px 0 0,
    #eee 0 -1px 0;
    .dot{
      display: inline-block;
      width: 3px;
      height: 10px;
    }
  }
}
</style>
