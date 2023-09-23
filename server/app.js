import http from 'http'
import express from 'express'
import { hSet, hGetAll } from './redis.js'
import socket from './socket.js'

const app = express();

app.use(express.json());

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
      // 如果找不到 就说明这是新的电话号码
      if (!users || !users[phone]) {
        user = {
          phone,
          createAt: Date.now(),
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
    res.send(result)
  }
})

const server = http.createServer(app);
server.listen(18080, () => {
  console.log('服务启动成功', 18080)
})

socket(server);
