<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watchEffect, nextTick } from 'vue'
import Header from '../../components/Phone/Header/index.vue'
import { keyboardStore } from '../../store/keyboard'
import { KeyboardCode } from '../../constant/enum'

const keyboardStoreObj = keyboardStore()

const i = ref(4)
const tableDom = ref()
const menuList = [
  { label: '信息', },
  { label: '通讯录', },
  { label: '设置', },
  { label: '资料', },
  { label: '影音天地', },
  { label: '网络', },
  { label: '管理器', },
  { label: '应用软件', },
  { label: '一键通', },
  { label: '无线互联网', },
]

onMounted(() => {
  console.log('in menu')
})

onBeforeUnmount(() => {
  console.log('out menu')
})

watchEffect(() => {
  if (keyboardStoreObj.data[KeyboardCode.ArrowDown] === 'down') {
    i.value += 3
  }
  if (keyboardStoreObj.data[KeyboardCode.ArrowUp] === 'down') {
    i.value -= 3
  }
  if (keyboardStoreObj.data[KeyboardCode.ArrowRight] === 'down') {
    i.value += 1
  }
  if (keyboardStoreObj.data[KeyboardCode.ArrowLeft] === 'down') {
    i.value -= 1
  }
  if (i.value > menuList.length - 1) {
    i.value = menuList.length - 1;
  } else if (i.value < 0) {
    i.value = 0;
  }
})

</script>

<template>
  <div class="page">
    <Header />
    <div class="table" ref="tableDom">
      <div 
        v-for="(item, index) of menuList" 
        :class="['table-item', i === index && 'active'] " 
        :key="item.label"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="bottom">
      <span style="text-align: left;" >选择</span>
      <span style="font-size: 14px" >退出</span>
      <span style="text-align: right;">操作</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.body{
  overflow-y: scroll;
}
.table{
  height: 160px;
  overflow: scroll;
  .table-item{
    width: calc(160px / 3);
    height: calc(160px / 3);
    font-size: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
