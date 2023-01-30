import { SocketManager } from 'context/socketManager'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import * as io from 'socket.io-client'

interface SocketProps {
  url: string
  namespace?: string | Function
  autoConnect?: boolean
}

interface SocketHookReturnedValue {
  socket: io.Socket | undefined
  isConnected: boolean
  isPending: boolean
}

type useSocketHook = (args: SocketProps) => SocketHookReturnedValue
const useSocket: useSocketHook = ({ url, namespace, autoConnect = true }) => {
  const manager = useContext(SocketManager)
  const [socket, setSocket] = useState<io.Socket>()
  const pending = useRef(true)

  useLayoutEffect(() => {
    const newSocket = manager.socket(url)
    if (autoConnect) {
      console.log(autoConnect, 'autoConnect')
      const soc = newSocket.connect()
      console.log(newSocket.connected, 'newSocket.connected`')
      console.log(soc.connected, 'newSocket.connected`')
    }
    setSocket(() => newSocket)
    pending.current = false

    return () => {
      if (newSocket.connected) {
        console.log(pending.current, 'pending.current')
        newSocket.disconnect()
      }
    }
  }, [pending, socket])
  return {
    socket,
    isConnected: !!socket?.connected,
    isPending: !!pending.current,
  }
}

export default useSocket
