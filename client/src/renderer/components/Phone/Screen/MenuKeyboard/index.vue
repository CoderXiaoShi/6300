<script setup lang="ts">
import { onMounted, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import { keyboardStore } from '../../../../store/keyboard';
import { KeyboardCode } from '../../../../constant/enum';

const router = useRouter();
const keyboardStoreObj = keyboardStore();

const toPage = (v: string) => {
  router.push(v)
}

const keyStatus = computed(() => {
  let status = {
    [KeyboardCode.ArrowUp]: keyboardStoreObj.data[KeyboardCode.ArrowUp],
    [KeyboardCode.ArrowDown]: keyboardStoreObj.data[KeyboardCode.ArrowDown],
    [KeyboardCode.ArrowLeft]: keyboardStoreObj.data[KeyboardCode.ArrowLeft],
    [KeyboardCode.ArrowRight]: keyboardStoreObj.data[KeyboardCode.ArrowRight],
  }
  let className = ''
  if (keyboardStoreObj.data[KeyboardCode.ArrowUp] === 'down') {
    className += ' top ';
  }
  if (keyboardStoreObj.data[KeyboardCode.ArrowDown] === 'down') {
    className += ' bottom ';
  }
  if (keyboardStoreObj.data[KeyboardCode.ArrowLeft] === 'down') {
    className += ' left ';
  }
  if (keyboardStoreObj.data[KeyboardCode.ArrowRight] === 'down') {
    className += ' right ';
  }
  return className
})

</script>
<template>
  <div class="menu-keyboard">
    <!-- {{ keyStatus }} -->
    <div class="col">
      <div class="menu-btn center btn-box-shadow" @click="toPage('/contacts')">
        <div class="dot blue"></div>
      </div>
      <div class="menu-btn center btn-box-shadow">
        <div class="dot green"></div>
      </div>
    </div>
    <div class="col">
      <div :class="['direction-keyboard', keyStatus]"></div>
      <div class="enter-keyboard " @click="toPage('/menu')"></div>
    </div>
    <div class="col">
      <div class="menu-btn center btn-box-shadow">
        <div class="dot blue"></div>
      </div>
      <div class="menu-btn center btn-box-shadow" @click="toPage('/')">
        <div class="dot red"></div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.menu-keyboard {
  height: 60px;
  margin: 0 10px;
  margin-top: 17px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .top {
    border-top: 8px solid #999;
  }

  .bottom {
    border-bottom: 8px solid #999;
  }

  .left {
    border-left: 8px solid #999;
  }

  .right {
    border-right: 8px solid #999;
  }

  .direction-keyboard {
    background: linear-gradient(121deg, #f4f4f4 0%, #c4c4c4 100%);
    border-radius: 5px;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    position: relative;
  }

  .enter-keyboard {
    background: #000;
    width: 39px;
    height: 39px;
    position: absolute;
    left: 5px;
    top: 5px;
    border-radius: 5px;

    &:active {
      transform: scale(.9);
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-between;
    height: 50px;
  }

  .btn-box-shadow {
    box-shadow: 2px 2px 3px #262626, 1px 1px 2px 0px inset #7d7d7d;

    &:active {
      box-shadow: 0px 0px 3px #262626, 0px 0px 2px 0px inset #7d7d7d;
    }
  }

  .menu-btn {
    width: 35px;
    height: 17px;
    background: #000;
    border-radius: 3px;
  }

  .dot {
    width: 6px;
    height: 3px;
  }

  .blue {
    background: blue;
  }

  .red {
    background: #700202;
  }

  .green {
    background: #024c02;
  }
}
</style>
