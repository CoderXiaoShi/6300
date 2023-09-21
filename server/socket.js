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

class Room {
  constructor(id, users) {
    this.id = id
    this.users = users
    this.caller = users[0]
    this.callee = users[1]
    this.created()
  }
  // 通知所有人 房间创建成功
  created() {
    for (const phone of this.users) {
      const u = userMap.get(phone)
      if (u) {
        u.client.emit('roomInfo', this)
      }
    }
  }
}

/*
  解析参数
  绑定事件
  webRtc 交互
*/
class Sock {
  constructor(s) {
    this.client = s;
    this.params = this.getParams();
    this.userId = '';
    this.roomId = '';
    this._run();
  }
  _run = () => {
    this.listen();
  }
  enterRoom = async () => {
    if (this.params.roomId) {
      await hSet(roomKey + roomId, userId, await getUserDataByUid(userId, roomId, nickname, pub));
      console.log(`roomId: ${roomId}`);
      oneToRoomMany(roomId, getMsg('join', userId + ' join then room', 200, { userId, nickname }));
    }
  }
  listen = () => {
    /*
      事件分为
        用户 -> server
        用户 -> room
    */
    // 用户 -> server
    this.client.on('online', phone => {
      this.userId = phone;
      console.log('online ', this.userId);
      userMap.set(this.userId, this);
    })
    this.client.on('disconnect', () => {
      console.log('offline ', this.userId);
      userMap.delete(this.userId);
      const room = roomMap.get(this.roomId);
      if (room) {
        delete room[this.userId];
      }
    })
    // 用户 -> room
    this.client.on('call', ({ phone, targetPhone, offer }) => {
      console.log('call', phone, targetPhone)
      // 不在线
      if (userMap.get(targetPhone) === undefined) {
        this.client.emit('call_fail', { targetPhone, msg: '不在线' })
        return
      }
      // 在线: 创建 room, 并把 roomId 返回出去
      const room = new Room(Date.now(), [phone, targetPhone])
      roomMap.set(room.id, room);
      userMap.get(targetPhone).client.emit('offer', { offer, formPhone: phone }); // webRtc 呼叫
    })
    this.client.on('answer', data => {
      const { target, answer } = data;
      userMap.get(target).client.emit('answer', answer)
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
    // let query = decodeURI(s.client.request.url.split('?')[1])
    // let vars = query.split('&');
    // for (var i = 0; i < vars.length; i++) {
    //   var pair = vars[i].split("=");
    //   obj[pair[0]] = pair[1]
    // }
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
    new Sock(sock)
    // let userSock = new Sock(sock)
    // userMap.set(userSock.userId, userSock);
    // const room = roomMap.get(userSock.roomId)
    // if (room) {
    //   room[userSock.userId] = userSock.userId;
    // } else {
    //   roomMap.set(userSock.roomId, { userId: userSock.userId });
    // }
  })

}
