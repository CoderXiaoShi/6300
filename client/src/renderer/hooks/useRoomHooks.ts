import socketClient from '@/utils/socket'
import { userStore } from '@/store/user'
import EventHub from '@/utils/eventHub'
import { systemStore } from '@/store/system'
import { CallStatus } from '@/constant/enum'

let localPeerRtc: RTCPeerConnection | any = null

/*

通话需求分析

  是否在线
  call 联系人
  socket 创建房间
  socket 通知被呼叫者
  被呼叫者 拒绝 | 接听
  接听建立 rtc 连接
  建立 语音通话

  call 流程
    1. 呼叫者 call 被呼叫者                                 call_ing
    2. 创建房间                              
    3. socket 将房间同步到 被呼叫者
    3. 创建 peerConnection, 并设置 offer
    4. 将 offer 发给 被呼叫者
    5. 被呼叫者 接受到 offer 并 setRemoteDescription
    6. 被呼叫者 创建 answer 并 setLocalDescription
    7. 被呼叫者 将 answer 发送给 呼叫者
    8. 呼叫者 接受到 answer 并 setRemoteDescription
    9. 此时双方 在 ontrack 事件中可以接收到 媒体流            call_success

  数据
    房间人数
    连接状态
    通信数据

  逻辑
    呼叫者把 phone 发送到服务端
    服务端为两个人建立房间
    被呼叫者是否接通
    建立 双方 rtc 的链接
    建立 音频流通信
    挂断连接
    中断 rtc
    终端 room
  UI
    电话列表
    点击拨打, 展示嘟嘟嘟...声音
    对方接收到展示对方电话号码, 播放铃声
    接通, 绘制音频波形
    任意一方挂断, 中断 rtc
    中断 房间
*/

interface Room {
  id: string;
  users: Array<string>;
  caller: string;
  callee: string;
}

class Room {
  constructor(id: string, users: Array<string>) {
    this.id = id;
    this.users = users;
    this.caller = users[0]
    this.callee = users[1]
  }
}

let room: any = null;
let isRTCConnect = false;
let candidateList: any = [];

// 用户不在线
socketClient.on('call_fail', (data: any) => {
  console.log('call_fail', data)
})

// 房间中的所有人
socketClient.on('roomInfo', (data: any) => {
  room = new Room(data.id, data.users)
  console.log('roomInfo', room)
})

socketClient.on('candidate', (candidate: any) => {
  console.log('socket candidate', candidate)
  if (isRTCConnect) {
    if (candidateList.length) {
      for (const ice of candidateList) {
        localPeerRtc.addIceCandidate(ice)
      }
      candidateList = []
    }
    localPeerRtc.addIceCandidate(candidate)
  } else {
    candidateList.push(candidate)
  }
})



const pcEvent = (pc: RTCPeerConnection, targetPhone: string) => {
  pc.ontrack = (e) => {
    let newStream = new MediaStream();
    newStream.addTrack(e.track);
    console.log('onTrack', e.track);
    EventHub.emit('call_success', {
      targetPhone,
      newStream
    })
  }
  pc.onnegotiationneeded = function (e) {
    console.log("开始协商", e)
  }
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('candidate: ', event.candidate);
      socketClient.emit('candidate', {
        targetPhone: targetPhone,
        candidate: event.candidate
      })
    }
  }
}

// 3. A 接收 B 的响应
socketClient.on('answer', async (answer: any) => {
  console.log('answer', answer);
  await localPeerRtc.setRemoteDescription(answer)
})

// 2. B 响应 A
socketClient.on('offer', async ({ offer, formPhone }: any) => {
  console.log('offer', offer, formPhone)
  store.changeCallStatus(CallStatus.callIng)
  localPeerRtc = new window.RTCPeerConnection()

  let localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  for (const track of localStream.getTracks()) {
    localPeerRtc.addTrack(track);
  }
  pcEvent(localPeerRtc, formPhone)
  localPeerRtc.setRemoteDescription(offer)
  const answer = await localPeerRtc.createAnswer();
  localPeerRtc.setLocalDescription(answer);
  socketClient.emit('answer', { target: formPhone, answer })
  isRTCConnect = true

  isRTCConnect = true
})

let store: any

export default () => {
  const user = userStore()

  store = systemStore()

  // 1. A 呼叫 B
  const call = async (targetPhone: string) => {
    console.log('call')
    store.changeCallStatus(CallStatus.callIng)
    localPeerRtc = new window.RTCPeerConnection()

    let localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    for (const track of localStream.getTracks()) {
      localPeerRtc.addTrack(track);
    }

    pcEvent(localPeerRtc, targetPhone)
    const offer = await localPeerRtc.createOffer();
    localPeerRtc.setLocalDescription(offer)
    socketClient.emit('call', { phone: user.data.phone, targetPhone, offer })

    isRTCConnect = true
  }

  return {
    call
  }
}