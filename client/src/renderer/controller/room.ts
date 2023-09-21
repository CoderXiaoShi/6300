import socketClient from '@/utils/socket'

let localPeerRtc: RTCPeerConnection | any = null

/*
  呼叫
    成功
      创建房间
      对方是否应答, 服务端设置超时时间
    失败
      对方不在线
      空号


  const PeerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;

var pc = new PeerConnection()

pc.ontrack = (e) => {
  console.log('ontrack', e.track)
  this.setRemoteDomVideoStream('#remotedemo01', e.track);
}
pc.onnegotiationneeded = function (e) {
  console.log("重新协商", e)
}
pc.onicecandidate = event => {
  if (event.candidate) {
    console.log('candidate: ', event.candidate);
  } else {
    console.log('本次协商结束')
  }
}

var offer = await pc.createOffer({ iceRestart: true });

await pc.setLocalDescription(offer)

var answer = await pc.createAnswer()
*/

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
    1. 呼叫
    2. 创建房间
    3. socket 将房间同步到 另一个人
    3. 创建 peerConnection, 并设置 offer
    4. 将 offer 发给 房间里的另一个人

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

export const call = async (phone: string, targetPhone: string) => {
  console.log('call')
  localPeerRtc = new window.RTCPeerConnection()
  pcEvent(localPeerRtc)
  const offer = await localPeerRtc.createOffer({ iceRestart: true });
  localPeerRtc.setLocalDescription(offer)

  socketClient.emit('call', { phone, targetPhone, offer })
}
socketClient.on('call_fail', (data: any) => {
  console.log('call_fail', data)
})


socketClient.on('roomInfo', (data: any) => {
  room = new Room(data.id, data.users)
  console.log('roomInfo', room)
})

socketClient.on('offer', async ({ offer, formPhone }: any) => {
  console.log('offer', offer, formPhone)

  localPeerRtc = new window.RTCPeerConnection()
  pcEvent(localPeerRtc)
  localPeerRtc.setRemoteDescription(offer)
  const answer = await localPeerRtc.createAnswer();
  localPeerRtc.setLocalDescription(answer);
  socketClient.emit('answer', { target: formPhone, answer })

})
socketClient.on('answer', async (answer: any) => {
  console.log('answer', answer);
  await localPeerRtc.setRemoteDescription(answer)
})


const pcEvent = (pc) => {
  console.log('pcEvent')
  pc.ontrack = (e) => {
    console.log('ontrack')
  }
  pc.onnegotiationneeded = function (e) {
    console.log("重新协商", e)
  }
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('candidate: ', event.candidate);
      // this.linkSocket.emit('candidate', {
      //   targetUid: remoteUId,
      //   userId: localUId,
      //   candidate: event.candidate
      // })
    } else {
      console.log('本次协商结束')
    }
  }
}