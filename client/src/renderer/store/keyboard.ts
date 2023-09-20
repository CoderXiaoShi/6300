import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { KeyboardCode } from '../constant/enum'
// KeyboardCode

console.log('KeyboardCode', KeyboardCode);

export const keyboardStore = defineStore('keyboard', () => {
  const data = reactive({
    [KeyboardCode.key0]: 'up',
    [KeyboardCode.key1]: 'up',
    [KeyboardCode.key2]: 'up',
    [KeyboardCode.key3]: 'up',
    [KeyboardCode.key4]: 'up',
    [KeyboardCode.key5]: 'up',
    [KeyboardCode.key6]: 'up',
    [KeyboardCode.key7]: 'up',
    [KeyboardCode.key8]: 'up',
    [KeyboardCode.key9]: 'up',

    [KeyboardCode.xing]: 'up',
    [KeyboardCode.jing]: 'up',

    // 四个功能键
    [KeyboardCode.btnLeftTop]: 'up',
    [KeyboardCode.btnLeftBottom]: 'up',
    [KeyboardCode.btnRightTop]: 'up',
    [KeyboardCode.btnRightBottom]: 'up',

    // 方向键
    [KeyboardCode.ArrowUp]: 'up',
    [KeyboardCode.ArrowDown]: 'up',
    [KeyboardCode.ArrowLeft]: 'up',
    [KeyboardCode.ArrowRight]: 'up',
    [KeyboardCode.Enter]: 'up'

  })

  const setKeyStatus = (keyCode: KeyboardCode, val: 'down' | 'up') => {
    data[keyCode] = val
  } 
  return {
    data,
    setKeyStatus
  }
})

