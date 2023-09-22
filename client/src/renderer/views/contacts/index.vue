<script setup lang="ts">
import { userStore } from '@/store/user';
import { computed } from 'vue'

const user = userStore()

const contacts = computed(() => {
  return user.data.contacts
})

</script>
<template>
  <div class="contacts">
    <h3>联系人</h3>
    <ul>
      <li :class="['phone', item.phone === '15080720954' && 'cur']" v-for="item of contacts">{{ item.phone }}</li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.contacts {
  height: 100%;
  width: 100%;
  background: #fff;

  h3 {
    font-size: 16px;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .phone {
    font-size: 12px;
    color: #666;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }

  .cur {
    color: #000 !important;
    font-size: 14px;
  }
}
</style>
