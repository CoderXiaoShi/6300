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
  document.body.setPointerCapture(e.pointerId)
  const oldStyle = {x: 0, y: 0}
  let transform = phoneDom.value.style.transform
  if (transform) {
    let arr = transform.match(/\d+/g)
    console.log(arr);
    oldStyle.x = parseInt(arr[0])
    oldStyle.y = parseInt(arr[2])
  }

  const startY = e.clientY - oldStyle.y
  const startX = e.clientX - oldStyle.x

  const pointerMove = (e: PointerEvent) => {

    const y = startY - e.clientY
    const x = e.clientX - startX
    phoneDom.value.style.transform = 'rotateY('+x+'deg) rotateX('+y+'deg)'
  }
  const pointerUp = (e: PointerEvent) => {
    document.removeEventListener('pointermove', pointerMove)
    document.removeEventListener('pointerup', pointerUp)
    document.body.releasePointerCapture(e.pointerId)
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
      <div class="left"></div>
      <div class="right">
        <div class="volume">
          <span>+</span>
          <span>-</span>
        </div>
      </div>
      <div class="bottom">
        <div class="bottom-header">
        </div>
        <div class="bottom-footer">
        </div>
      </div>
      <div class="head"></div>
      <div class="footer"></div>
    </div>
  </div>
</template>

<style scoped lang='less'>
@import url('./style.less');
</style>
