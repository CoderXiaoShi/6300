import socketClient from '@/utils/socket'
import { userStore } from '@/store/user'
import { chunk } from 'lodash'

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

const renderMedia = (domId: any, newStream: any) => {
  let videoDom = document.querySelector(domId)
  let stream = videoDom.srcObject;
  if (stream) {
    stream.getAudioTracks().forEach((e: any) => stream.removeTrack(e));
    stream.getVideoTracks().forEach((e: any) => stream.removeTrack(e));
  }
  videoDom.srcObject = newStream;
}

socketClient.on('candidate', (candidate: any) => {
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


let isInit = false;
let analyser; // 分析波形节点
let dataArray; // 存储分析好的对象

const renderCanvas = (newStream) => {

  const cvs = document.querySelector('#canvas')
  const ctx = cvs.getContext('2d')
  cvs.width = cvs.width * devicePixelRatio
  cvs.height = (cvs.height / 2) * devicePixelRatio

  const audioCtx = new AudioContext();
  // const source = audioCtx.createMediaElementSource(audioDom);
  const source = audioCtx.createMediaStreamSource(newStream);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  isInit = true;
  console.log('dataArray', dataArray);
  const draw = () => {

    const { width, height } = cvs
    ctx.clearRect(0, 0, width, height)

    requestAnimationFrame(draw)
    if (!isInit) {
      return
    }

    analyser.getByteFrequencyData(dataArray);

    // 简化音柱: 需要 10 个音柱
    let num = 10; // 音柱的数量
    const offset = 2; // 音柱间隙
    let arr = chunk(dataArray, Math.ceil(dataArray.length / num)).map(arrItem => {
      let sum = arrItem.reduce((res, item) => {
        res += item;
        return res;
      }, 0);
      let avg = Math.floor(sum / arrItem.length);
      return avg;
    })

    const gradient = ctx.createLinearGradient(0, height, 0, 0)

    // 添加颜色停止点
    gradient.addColorStop(0, 'rgba(67, 225, 16, 1)');       // 开始处的颜色
    gradient.addColorStop(0.5, 'rgba(67, 225, 16, .2)');      // 结束处的颜色

    ctx.fillStyle = gradient;

    let barWidth = (width / 2) / num; // 音柱的宽度
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const barHeight = (item / 255) * height; // 音柱的高度
      // const barHeight = height; // 音柱的高度
      const x1 = (width / 2) + (i * barWidth);
      const x2 = (width / 2) - ((i + 1) * barWidth);
      const y = height - barHeight;

      ctx.fillRect(x1 + offset, y, barWidth - offset, barHeight);
      ctx.fillRect(x2 + offset, y, barWidth - offset, barHeight);
    }

  }

  draw()
}

const pcEvent = (pc: RTCPeerConnection, targetPhone: string) => {
  pc.ontrack = (e) => {
    let newStream = new MediaStream()
    newStream.addTrack(e.track)
    renderMedia('#remoteVideo', newStream)
    renderCanvas(newStream)
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
  localPeerRtc = new window.RTCPeerConnection()

  isRTCConnect = true

  // let localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  // for (const track of localStream.getTracks()) {
  //   localPeerRtc.addTrack(track);
  // }

  pcEvent(localPeerRtc, formPhone)
  localPeerRtc.setRemoteDescription(offer)
  const answer = await localPeerRtc.createAnswer();
  localPeerRtc.setLocalDescription(answer);
  socketClient.emit('answer', { target: formPhone, answer })

})

export default () => {
  const user = userStore()

  // 1. A 呼叫 B
  const call = async (targetPhone: string) => {
    console.log('call')
    localPeerRtc = new window.RTCPeerConnection()

    let localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    for (const track of localStream.getTracks()) {
      localPeerRtc.addTrack(track);
    }

    pcEvent(localPeerRtc, targetPhone)
    const offer = await localPeerRtc.createOffer({ iceRestart: true });
    localPeerRtc.setLocalDescription(offer)

    socketClient.emit('call', { phone: user.data.phone, targetPhone, offer })
  }

  return {
    call
  }
}