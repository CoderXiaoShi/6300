<script setup lang="ts">
import { userStore } from '@/store/user';
import { computed, onMounted, onUnmounted, reactive, watchEffect } from 'vue'
import Header from '../../components/Phone/Header/index.vue'
import EventHub from "@/utils/eventHub";
import { KeyboardCode } from '@/constant/enum';
import { useRouter } from 'vue-router'

const router = useRouter()
const user = userStore()
const state = reactive(<any>{
  phone: '',
  name: '',
})

const goBack = () => {
  router.go(-1)
}
const save = () => {
  if (state.phone) {
    user.editContact({ phone: state.phone, name: state.name })
    router.go(-1)
  }
}

onMounted(() => {
  // EventHub.on(KeyboardCode.ArrowUp, arrowUp)
  // EventHub.on(KeyboardCode.ArrowDown, arrowDown)
  EventHub.on(KeyboardCode.btnLeftTop, save)
  EventHub.on(KeyboardCode.btnRightTop, goBack)
})

onUnmounted(() => {
  // EventHub.off(KeyboardCode.ArrowUp, arrowUp)
  // EventHub.off(KeyboardCode.ArrowDown, arrowDown)
  EventHub.off(KeyboardCode.btnLeftTop, save)
  EventHub.off(KeyboardCode.btnRightTop, goBack)
})

</script>
<template>
  <div class="page">
    <Header />
    <div class="contacts">
      <h3>添加联系人</h3>
      <ul>
        <li>
          <span>姓名:</span>
          <input v-model="state.name" autofocus maxlength="20" />
        </li>
        <li>
          <span>电话:</span>
          <input v-model="state.phone" maxlength="11" />
        </li>
      </ul>
      <!-- <ul>
      <li :class="['phone', item.phone === state.active && 'active']" v-for="item of contacts">{{ item.phone }}</li>
    </ul> -->
    </div>
    <div class="bottom">
      <span style="text-align: left;">添加</span>
      <span style="text-align: right;">返回</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.contacts {
  height: 100%;
  width: 100%;
  color: #fff;
  background: rgba(255, 255, 255, 0.3);

  li {
    list-style: none;

    span {
      font-size: 14px;
    }

    &.active {
      font-weight: bold;
    }
  }

  h3 {
    font-size: 16px;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }

  .phone {
    font-size: 12px;
    color: #666;
    padding: 5px;
    color: #fff;
    border-bottom: 1px solid #ccc;
  }

}
</style>
