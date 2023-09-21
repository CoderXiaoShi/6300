<script setup lang="ts">
import { userStore } from '@/store/user'
import { call } from '@/controller/room'

// 初始化部分
// 1. 初始化手机号
const user = userStore()

user.editContact('15063785123')
user.editContact('15020555923')
user.editContact('150')

</script>
<template>
  <h4>room</h4>

  <hr>
  <div>
    {{ user.data.phone }}
    <ul>
      <li v-for="contactItem of user.data.contacts">
        {{ contactItem.phone }}
        <button @click="call(user.data.phone, contactItem.phone)"
          v-if="contactItem.phone !== user.data.phone">call</button>
      </li>
    </ul>
  </div>
</template>
