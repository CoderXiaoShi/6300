


// 系统状态
export enum SystemStatus {
  open,
  close
}

export enum CallStatus {
  Start,
  callIng,
  Success,
  Close
}

// 系统 keyCode
export enum KeyboardCode {
  key0 = 0,
  key1 = 1,
  key2 = 2,
  key3 = 3,
  key4 = 4,
  key5 = 5,
  key6 = 6,
  key7 = 7,
  key8 = 8,
  key9 = 9,

  xing = '*',
  jing = '#',

  // 四个功能键
  btnLeftTop = 'btnLeftTop',
  btnLeftBottom = 'btnLeftBottom',
  btnRightTop = 'btnRightTop',
  btnRightBottom = 'btnRightBottom',

  // 方向键
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  Enter = 'Enter'
}