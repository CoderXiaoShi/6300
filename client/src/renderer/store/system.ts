import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { SystemStatus } from '../constant/enum'

export const systemStore = defineStore('system', () => {
  const data = reactive({
    state: SystemStatus.open // 系统状态: close | open 
  })
  const changeState = (v: SystemStatus) => data.state = v
  return {
    data,
    changeState,
  }
});
