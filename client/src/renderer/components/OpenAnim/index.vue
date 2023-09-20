<script setup lang="ts">
import { onMounted } from 'vue'
import logo from '../../assets/logo.png';
import music from '../../assets/start.mp3'
import { systemStore } from '../../store/system'
import { SystemStatus } from '../../constant/enum'
import { useRouter } from 'vue-router'

const store = systemStore()
const router = useRouter()

onMounted(() => {
  const audio = new Audio()
  audio.src = music;
  audio.loop = false
  audio.play()
  setTimeout(() => {
    console.log('播放完毕')
    router.push('/')
    store.changeState(SystemStatus.open)
  }, 4000)
})

</script>

<template>
  <div class="open-amin">
    <img class="logo animate__animated animate__bounceIn" :src="logo" />
    <p class="animate__animated animate__backInUp" >Hello Word</p>
  </div>
</template>
<style lang="less" scoped>
.open-amin{
  background: #fff;
  height: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  p{
    background-image: linear-gradient(to bottom, #eee, #666);
    -webkit-background-clip: text;
    color: transparent;
    margin-top: 10px;
  }
  .logo{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
}

</style>
