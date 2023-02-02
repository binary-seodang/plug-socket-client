import { Manager } from 'libs/Manager'
import { createContext, FC, ReactNode, useRef } from 'react'
import { Socket } from 'socket.io-client'

export const manager = new Manager(import.meta.env.VITE_SOCKET_SERVER_URL, {
  path: '/',
  transports: ['websocket'],
})

export const SocketContext = createContext<{
  socket: Socket | null
  manager: Manager
}>({
  socket: null,
  manager,
})
const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const socket = useRef(manager.create_socket('/'))
  return (
    <SocketContext.Provider value={{ socket: socket.current, manager }}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider

//  Manager context -> hook(socketId) -> socketId === Manager.find(socket => socket.id === socketId) -> components
