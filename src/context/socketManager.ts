import { createContext } from 'react'
import { Manager } from 'socket.io-client'

console.log(import.meta.env)

export const manager = new Manager({
  path: '/',
  protocols: 'http',
  host: 'localhost',
  port: 3050,
  transports: ['websocket'],
})

// const import.meta.env.
export const SocketManager = createContext(manager)
