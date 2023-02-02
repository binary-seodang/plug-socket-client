import { createContext, FC, ReactNode, useRef } from "react"
import { Manager as M, Socket } from "socket.io-client"
import { SocketOptions } from "socket.io-client/build/esm/socket"

class Manager extends M {
  private sockets: { [key: string]: Socket } = {}
  create_socket(
    nsp: string,
    opts?: Partial<SocketOptions> | undefined
  ): Socket {
    if (this.sockets.hasOwnProperty(nsp)) {
      return this.sockets[nsp]
    }
    const socket = this.socket(nsp, opts)
    socket.listen = (ev, lisnter) => {
      if (!socket.hasListeners(ev)) {
        socket.on(ev, lisnter)
      }
      return socket
    }
    this.sockets[nsp] = socket
    return socket
  }
}
export const manager = new Manager(import.meta.env.VITE_SOCKET_SERVER_URL, {
  path: "/",
  transports: ["websocket"],
})

export const SocketContext = createContext<{
  socket: Socket | null
  manager: Manager
}>({
  socket: null,
  manager,
})
const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const socket = useRef(manager.create_socket("/"))
  return (
    <SocketContext.Provider value={{ socket: socket.current, manager }}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider

//  Manager context -> hook(socketId) -> socketId === Manager.find(socket => socket.id === socketId) -> components
