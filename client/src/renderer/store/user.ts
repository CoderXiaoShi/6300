import { defineStore } from 'pinia'
import { reactive } from 'vue'
import axios from '../app/axios'

/*
  注册 user/register 随机返回一个电话号码
  联系人
    增
    删
    查
*/

export const userStore = defineStore('user', () => {

  let contacts = localStorage['contacts']
  if (contacts) {
    contacts = JSON.parse(contacts)
  } else {
    contacts = {}
  }

  const data = reactive({
    phone: '',
    contacts
  })
  const register = async () => {
    try {
      if (localStorage['phone']) {
        data.phone = localStorage['phone'];
      } else {
        let user = await axios.get('/user/register');
        data.phone = user.data.data.phone;
        localStorage['phone'] = data.phone;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 添加 | 删除联系人
  const editContact = async (phone: string, isDelete: boolean = false) => {
    try {
      if (isDelete) {
        delete data.contacts[phone];
      } else {
        data.contacts[phone] = {
          phone,
          createAt: Date.now()
        }
      }
    } catch (error) {
      console.error('修改联系人失败', error)
    }
  }
  return {
    data,
    register,
    editContact
  }
})
