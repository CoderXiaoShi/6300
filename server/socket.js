import { Server } from 'socket.io'
import { hSet } from './redis.js'
import {
  getMsg,
} from './common.js'

const userMap = new Map();
const roomMap = new Map()

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
    this.userId = '';
    this.roomId = '';
    this._run();
  }
  _run = () => {
    this.listen();
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
    this.client.on('candidate', ({ targetPhone, candidate }) => {
      if (userMap.get(targetPhone)) {
        userMap.get(targetPhone).client.emit('candidate', candidate)
      } else {
        console.log('用户不在线')
      }
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
    new Sock(sock); // 一个链接, 代表一个用户
  })
}
