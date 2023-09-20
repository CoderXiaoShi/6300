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

// app.use(express.static('./dist'))
// app.use((req, res, next) => {
//   res.sendFile('./dist/index.html');
// })



const server = http.createServer(app);
const io = new Server(server, {
  allowEIO3: true,
  // 跨域
  cors: {
    origin: '*',
    credentials: true
  }
});

server.listen(18080, () => {
  console.log('服务启动成功', 18080)
})

const roomKey = `meeting-room::`;
const userMap = new Map();

io.on('connection', (sock) => {
  console.log('新链接进来')
  onListener(sock)
})

const getUserDataByUid = (userId, roomId, nickname, pub) => {
  let res = JSON.stringify({ userId, roomId, nickname, pub })
  return res
}

/**
 * 获取房间数据, 原始的 redis 数据
 * @param {*} roomId 
 * @returns 
 */
const getRoomUser = async (roomId) => {
  return await hGetAll(roomKey + roomId)
}

/**
 * 获取房间数据, 返回 Array 类型
 */
const getRoomOnlyUserList = async (roomId) => {
  let resList = []
  let uMap = await hGetAll(roomKey + roomId)
  console.log('uMap', uMap)
  for (const key in uMap) {
    let detail = JSON.parse(uMap[key])
    resList.push(detail)
  }
  return resList;
}

// 通知某个用户
const oneToOne = (uid, msg) => {
  let s = userMap.get(uid)
  if (s) {
    s.emit('msg', msg)
  } else {
    console.log(`${uid}, 用户不在线`)
  }
}
// 通知房间里的所有人
const oneToRoomMany = async (roomId, msg) => {
  let uMap = await getRoomUser(roomId);
  for (const uid in uMap) {
    oneToOne(uid, msg)
  }
}

const onListener = async (s) => {
  let url = s.client.request.url
  let userId = getParams(url, 'userId')
  let roomId = getParams(url, 'roomId')
  let nickname = getParams(url, 'nickname')
  let pub = getParams(url, 'pub')
  console.log('client uid: ', userId, roomId, nickname, pub)
  userMap.set(userId, s);

  // 用户登录
  if (roomId) {
    await hSet(roomKey + roomId, userId, await getUserDataByUid(userId, roomId, nickname, pub))
    console.log(`roomId: ${roomId}`)
    oneToRoomMany(roomId, getMsg('join', userId + ' join then room', 200, { userId, nickname }))
  }

  // 一个客户端向所在房间的所有人发消息
  s.on('msg', async (data) => {
    await oneToRoomMany(roomId, data);
  })

  // 客户端断开链接
  s.on('disconnect', async () => {
    console.log(`client uid: ${userId}, roomId ${roomId} ${nickname} offline`);
    userMap.delete(userId)
    if (roomId) {
      await hDel(roomKey + roomId, userId);
      oneToRoomMany(roomId, getMsg('leave', `${userId} leave the room `, 200, { userId, nickname }));
    }
  })
  // 客户端请求 房间的用户列表 
  s.on('roomUserList', async (data = {}) => {
    let roomId = data['roomId']
    if (roomId) {
      s.emit('roomUserList', await getRoomOnlyUserList(roomId))
    }
  })
  // 发起呼叫
  s.on('call', data => {
    const targetUid = data['targetUid'];
    const u = userMap.get(targetUid);
    if (u) {
      oneToOne(targetUid, getMsg('call', '远程呼叫', 200, data));
    } else {
      console.log('call ', targetUid, '不在线');
    }
  })
  // 双方交换 候选 链接方式
  s.on('candidate', data => {
    const targetUid = data['targetUid']
    const u = userMap.get(targetUid)
    if (u) {
      oneToOne(targetUid, getMsg('candidate', 'ice candidate', 200, data))
    } else {
      console.log(targetUid, '不在线')
    }
  })
  // 发送 链接请求
  s.on('offer', data => {
    const targetUid = data['targetUid']
    const u = userMap.get(targetUid)
    if (u) {
      oneToOne(targetUid, getMsg('offer', 'rtc offer', 200, data))
    } else {
      console.log(targetUid, '不在线')
    }
  })
  // 相应 链接请求
  s.on('answer', data => {
    const targetUid = data['targetUid']
    const u = userMap.get(targetUid)
    if (u) {
      oneToOne(targetUid, getMsg('answer', 'rtc answer', 200, data))
    } else {
      console.log(targetUid, '不在线')
    }
  })
}
