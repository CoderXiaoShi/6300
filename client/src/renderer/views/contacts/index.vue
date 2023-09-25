<script setup lang="ts">
import { userStore } from '@/store/user';
import { useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, reactive, watchEffect } from 'vue'
import Header from '@/components/Phone/Header/index.vue'
import EventHub from "@/utils/eventHub";
import { KeyboardCode } from '@/constant/enum';
import useRoomHooks from '@/hooks/useRoomHooks'

const router = useRouter()
const user = userStore()
const state = reactive(<any>{
  active: '',
  index: 0,
})
const roomHook = useRoomHooks()

const getPhone = (direction: 'up' | 'down' | 'init' = 'down') => {
  const arr = Reflect.ownKeys(user.data.contacts)
  if (arr.length) {
    if (direction === 'up') {
      if (state.index - 1 < 0) {
        state.index = arr.length - 1
      } else {
        state.index--
      }
    } else if (direction === 'down') {
      if (state.index + 1 > arr.length - 1) {
        state.index = 0
      } else {
        state.index++
      }
    }
    console.log(
      arr[state.index]
    )
    state.active = arr[state.index]
  }
  return ''
}

// 游标
const arrowUp = () => getPhone('up')
const arrowDown = () => getPhone('down')

// 添加|删除联系人

const delPhone = () => {
  const phone = Reflect.ownKeys(user.data.contacts)[state.index]
  const contactItem = user.data.contacts[phone]
  if (contactItem && contactItem.isSelf) {
    return
  }
  user.editContact({ phone }, true)
  if (state.index > Reflect.ownKeys(user.data.contacts).length - 1) {
    state.index--
  }
  state.active = Reflect.ownKeys(user.data.contacts)[state.index]
}

const addPhone = () => {
  router.push('/contacts/add')
}

const call = () => {
  const u = user.data.contacts[state.active]
  console.log(u, state.active)
  if (!u.isSelf) {
    roomHook.call(state.active)
    // router.push('/call')
  } else {
    console.log('不能向自己拨号')
  }
}
onMounted(() => {

  state.active = formatContacts()[0].phone
  state.index = 0

  EventHub.on(KeyboardCode.ArrowUp, arrowUp)
  EventHub.on(KeyboardCode.btnLeftBottom, call)
  EventHub.on(KeyboardCode.ArrowDown, arrowDown)
  EventHub.on(KeyboardCode.btnLeftTop, addPhone)
  EventHub.on(KeyboardCode.btnRightTop, delPhone)
})

onUnmounted(() => {
  EventHub.off(KeyboardCode.ArrowUp, arrowUp)
  EventHub.off(KeyboardCode.btnLeftBottom, call)
  EventHub.off(KeyboardCode.ArrowDown, arrowDown)
  EventHub.off(KeyboardCode.btnLeftTop, addPhone)
  EventHub.off(KeyboardCode.btnRightTop, delPhone)
})

const formatContacts = () => {
  let arr = []
  for (const phone of Reflect.ownKeys(user.data.contacts)) {
    const item = user.data.contacts[phone]
    arr.push(item)
  }
  arr = arr.sort((first, second) => {
    return first.createAt - second.createAt
  })
  return arr
}

const contacts = computed(() => {
  return formatContacts()
})

</script>
<template>
  <div class="page">
    <Header />
    <div class="contacts">
      <h3>联系人</h3>
      <ul>
        <li :class="['phone', item.phone === state.active && 'active']" v-for="(item, index) of contacts"
          @click="state.index = index; state.active = item.phone">
          {{ item.name }}
          <i>{{ item.phone }}</i>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <span style="text-align: left;">添加</span>
      <span style="text-align: right;">删除</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.contacts {
  height: 167px;
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.3);

  ul {
    height: 133px;
    overflow: auto;
  }

  li {
    list-style: none;

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

  .cur {
    color: #000 !important;
    font-size: 14px;
  }
}
</style>
