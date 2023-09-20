import { Server } from 'socket.io'
import { hSet, hGetAll } from './redis.js'
import {
  getMsg,
} from './common.js'

const userMap = new Map();
const roomMap = new Map()

/**
 * 获取房间数据, 原始的 redis 数据
 * @param {*} roomId 
 * @returns 
 */
const getRoomUser = async (roomId) => {
  return await hGetAll(roomKey + roomId)
}

const getUserDataByUid = (userId, roomId, nickname, pub) => {
  let res = JSON.stringify({ userId, roomId, nickname, pub })
  return res
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

/*
  解析参数
  绑定事件
  webRtc 交互
*/
class Sock {
  constructor(s) {
    this.client = s
    this.params = this.getParams()
    this.userId = this.params.userId
    this.roomId = this.params.roomId
    this._run()
  }
  _run = () => {
    // 通知房间里所有人
    this.enterRoom()
    // this.listen()
  }
  enterRoom = async () => {
    if (this.params.roomId) {
      await hSet(roomKey + roomId, userId, await getUserDataByUid(userId, roomId, nickname, pub));
      console.log(`roomId: ${roomId}`);
      oneToRoomMany(roomId, getMsg('join', userId + ' join then room', 200, { userId, nickname }));
    }
  }
  listen = () => {
    this.client.on('disconnect', () => {
      userMap.delete(this.userId);
      const room = roomMap.get(this.roomId);
      delete room[this.userId];
    })
    /*
      msg
      disconnect
      roomUserList
      call
      candidate
      offer
      answer
    */
  }

  getParams = () => {
    let obj = {}
    let query = decodeURI(s.client.request.url.split('?')[1])
    let vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      obj[pair[0]] = pair[1]
    }
    return obj;
  }
}

export default (httpServer) => {
  const io = new Server(httpServer, {
    allowEIO3: true,
    cors: {
      origin: '*',
      credentials: true
    }
  });

  console.log('socket.io start')

  io.on('connection', (sock) => {
    console.log('new sock')
    let userSock = new Sock(sock)
    userMap.set(userSock.userId, userSock);
    const room = roomMap.get(userSock.roomId)
    if (room) {
      room[userSock.userId] = userSock.userId;
    } else {
      roomMap.set(userSock.roomId, { userId: userSock.userId });
    }
  })

}
