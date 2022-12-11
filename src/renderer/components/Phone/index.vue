<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Screen from './Screen/index.vue'
import Keyboard from './Keyboard/index.vue'
import { keyboardStore } from '../../store/keyboard'
import { KeyboardCode } from '../../constant/enum'

const phoneDom = ref()

const router = useRouter()
const keyboardStoreObj = keyboardStore()

const toPage = (v: string) => {
  router.push(v)
}

const keyboardFnMap: any = {
  'Enter': () => toPage('/menu'),
  'Escape': () => toPage('/'),
  'ArrowUp': (direction: 'down' | 'up') => keyboardStoreObj.setKeyStatus(KeyboardCode.ArrowUp ,direction),
  'ArrowDown': (direction: 'down' | 'up') => keyboardStoreObj.setKeyStatus(KeyboardCode.ArrowDown ,direction),
  'ArrowLeft': (direction: 'down' | 'up') => keyboardStoreObj.setKeyStatus(KeyboardCode.ArrowLeft , direction),
  'ArrowRight': (direction: 'down' | 'up') => keyboardStoreObj.setKeyStatus(KeyboardCode.ArrowRight , direction),
}

onMounted(() => {
  document.addEventListener('keyup', (e) => {
    const { code } = e
    if (code in keyboardFnMap) {
      keyboardFnMap[code]('up');
    }
  })
  document.addEventListener('keydown', (e) => {
    const { code } = e
    if (code in keyboardFnMap) {
      keyboardFnMap[code]('down');
    }
  })
})

const pointerDown = (e: PointerEvent) => {
  e.stopPropagation();
  e.preventDefault();

  const pointerMove = (e: PointerEvent) => {

  }
  const pointerUp = (e: PointerEvent) => {

  }
  document.addEventListener('pointermove', pointerMove);
  document.addEventListener('pointerup', pointerUp);
}
document.addEventListener('pointerdown', pointerDown);
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
