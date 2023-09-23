import { io } from 'socket.io-client'
import EventHub from '@/utils/eventHub'

const socketClient = io(import.meta.env.VITE_URL_WS_ROOT, {
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
})

socketClient.on('connect', () => {
  console.log('socket 连接成功')
  EventHub.emit('SocketConnect')
})
socketClient.on('error', (err: any) => {
  console.log('socket 连接错误', err)
  EventHub.emit('SocketError', err)
})

export default socketClient
