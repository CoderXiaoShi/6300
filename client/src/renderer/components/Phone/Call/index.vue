<script setup lang="ts">
import { chunk } from 'lodash';
import { onUnmounted, reactive } from 'vue'
import Header from '@/components/Phone/Header/index.vue'
import EventHub from "@/utils/eventHub";
import useRoomHooks from '@/hooks/useRoomHooks';

const roomHook = useRoomHooks()

const state = reactive({
  targetPhone: '',
})

const renderCallStatus = ({ targetPhone, newStream }: any) => {
  console.log('renderCallStatus')
  state.targetPhone = targetPhone
  renderMedia('#remoteVideo', newStream)
  renderCanvas(newStream)
}

EventHub.on('call_success', renderCallStatus)

onUnmounted(() => {
  EventHub.off('call_success', renderCallStatus)
})

/*
  正在和xx通话
  绘制波形
*/

const renderMedia = (domId: any, newStream: any) => {
  let videoDom = document.querySelector(domId)
  let stream = videoDom.srcObject;
  if (stream) {
    stream.getAudioTracks().forEach((e: any) => stream.removeTrack(e));
    stream.getVideoTracks().forEach((e: any) => stream.removeTrack(e));
  }
  videoDom.srcObject = newStream;
}

let isInit = false;
let analyser: any; // 分析波形节点
let dataArray: any; // 存储分析好的对象

const renderCanvas = (newStream: MediaStream) => {

  const cvs: any = document.querySelector('#canvas')
  const ctx: any = cvs.getContext('2d')

  const audioCtx = new AudioContext();
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
    console.log('dataArray ----', dataArray);

    // 简化音柱: 需要 10 个音柱
    let num = 10; // 音柱的数量
    const offset = 2; // 音柱间隙
    let arr = chunk(dataArray, Math.ceil(dataArray.length / num)).map((arrItem: Array<number>) => {
      let sum = arrItem.reduce((res: number, item: number) => {
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
      const x1 = (width / 2) + (i * barWidth);
      const x2 = (width / 2) - ((i + 1) * barWidth);
      const y = height - barHeight;

      ctx.fillRect(x1 + offset, y, barWidth - offset, barHeight);
      ctx.fillRect(x2 + offset, y, barWidth - offset, barHeight);
    }
  }

  draw()
}

</script>
<template>
  <div class="page">
    <Header />
    <div class="call-container">
      <p>正在和 {{ state.targetPhone }} 通话</p>
      <canvas id="canvas" width="170" height="100"></canvas>
      <video id="remoteVideo" autoplay style="width: 300px; height: 200px;" controls></video>

    </div>
    <div class="bottom">
      <span style="text-align: left;">添加</span>
      <span style="text-align: right;">删除</span>
    </div>
  </div>
</template>
<style lang="less" scoped>
.call-container {
  display: flex;
  flex-direction: column;

  p {
    margin-bottom: 15px;
  }
}

#remoteVideo {
  display: none;
}
</style>