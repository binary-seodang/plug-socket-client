import { createContext } from 'react'
import { Manager } from 'socket.io-client'

export const manager = new Manager(import.meta.env.VITE_SOCKET_SERVER_URL, {
  path: '/',
  transports: ['websocket'],
})

export const SocketManager = createContext(manager)
