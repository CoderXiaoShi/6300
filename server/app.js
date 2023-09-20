import { hSet, hDel, hGetAll } from './redis.js'
import {
  getMsg,
  getParams
} from './common.js'

console.log('app.js')

import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express();

app.use(express.json());

// app.use(express.static('./dist'))
// app.use((req, res, next) => {
//   res.sendFile('./dist/index.html');
// })

/*
  注册
  user/register 随机返回一个电话号码
  联系人
    增
      user, friend
    删
      user, friend
    查
      user
*/
app.get('/user/register', async (req, res) => {
  let result = {
    status: 200,
    msg: '',
    data: {},
    error: null
  }
  try {
    let phone = null
    let users = null
    let user = null
    do {
      // 创建随机电话号, 遇到重复的就重新创建
      phone = `150${Math.random().toString().slice(2).substr(0, 8)}`
      users = await hGetAll('users')
      if (!users || !users[phone]) {
        user = {
          phone,
          createAt: Date.now(),
          contacts: {},
        }
        break;
      }
    } while (!users || !users[phone])
    console.log('注册新用户:', user);
    await hSet('users', phone, user)
    result.data = { phone }
    res.send(result)
  } catch (error) {
    result.error = error
    // res.setHeader(500)
    res.send(result)
  }
})

app.post('/user/contact', async (req, res) => {
  let result = {
    status: 200,
    msg: '',
    data: {},
    error: null
  }
  try {
    const { user, contact, isDelete } = req.body;

    const userMap = await hGetAll('users', user);
    let currUser = userMap[user];
    currUser = JSON.parse(currUser);
    if (isDelete) {
      delete currUser.contacts[contact];
      console.log('删除联系人: ', user, contact, currUser.contacts);
    } else {
      currUser.contacts[contact] = {
        contact,
        createAt: Date.now()
      }
      console.log('新增联系人: ', user, contact);
    }
    await hSet('users', user, currUser);
    res.send(result)
  } catch (error) {
    console.error(error);
    result.error = error
    res.header = 500
    // res.setHeader(500)
    res.send(result)
  }
})
app.get('/user/contact')

const server = http.createServer(app);
// const io = new Server(server, {
//   allowEIO3: true,
//   cors: {
//     origin: '*',
//     credentials: true
//   }
// });

server.listen(18080, () => {
  console.log('服务启动成功', 18080)
})
