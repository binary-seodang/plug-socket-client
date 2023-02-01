import { createContext, FC, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

// export const manager = new Manager(import.meta.env.VITE_SOCKET_SERVER_URL, {
//   path: '/',
//   transports: ['websocket'],
// })

const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
  path: '/',
  transports: ['websocket'],
})

export const SocketContext = createContext<{ socket: Socket | null }>({ socket: null })
const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}
export default SocketProvider
