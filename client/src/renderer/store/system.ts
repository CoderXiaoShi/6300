import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { SystemStatus, CallStatus } from '../constant/enum'

export const systemStore = defineStore('system', () => {
  const data = reactive({
    state: SystemStatus.open, // 系统状态: close | open
    callStatus: CallStatus.Close
  })
  const changeState = (v: SystemStatus) => data.state = v
  const changeCallStatus = (v: CallStatus) => data.callStatus = v
  return {
    data,
    changeState,
    changeCallStatus,
  }
});
