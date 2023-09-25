import { defineStore } from 'pinia'
import { reactive } from 'vue'
import axios from '../app/axios'
import socketClient from '@/utils/socket'

/*
  注册 user/register 随机返回一个电话号码
  联系人
    增
    删
    查
*/

console.log("localStorage['phone']", localStorage['phone'])

export const userStore = defineStore('user', () => {

  let contacts = localStorage['contacts']
  if (contacts) {
    contacts = JSON.parse(contacts)
  } else {
    contacts = {}
  }

  const data = reactive({
    phone: localStorage['phone'],
    contacts
  })
  const register = async () => {
    try {
      if (!data.phone) {
        let user = await axios.get('/user/register');
        data.phone = user.data.data.phone;
        localStorage['phone'] = data.phone;
        editContact({ phone: data.phone, name: '本机号', isSelf: true })
      }
      socketClient.emit('online', data.phone)
    } catch (error) {
      console.error(error);
    }
  }

  // 添加 | 删除联系人
  const editContact = async ({ phone, name, isSelf }: any, isDelete: boolean = false) => {
    try {
      if (isDelete) {
        delete data.contacts[phone];
      } else {
        data.contacts[phone] = {
          phone,
          name,
          isSelf,
          createAt: Date.now()
        }
      }
      localStorage['contacts'] = JSON.stringify(data.contacts)
      console.log('data.contacts', data.contacts)
    } catch (error) {
      console.error('修改联系人失败', error)
    }
  }
  return {
    data,
    register,
    editContact,
  }
})
