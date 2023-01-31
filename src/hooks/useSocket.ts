import { SocketManager } from 'context/socketManager'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import * as io from 'socket.io-client'

interface SocketProps {
  url: string
  namespace?: string | Function
  autoConnect?: boolean
}

interface SocketHookReturnedValue {
  socket: io.Socket | null
  isConnected: boolean
  isPending: boolean
}

type useSocketHook = (args: SocketProps) => SocketHookReturnedValue
const useSocket: useSocketHook = ({ url, namespace, autoConnect = true }) => {
  const manager = useContext(SocketManager)
  const [socket, setSocket] = useState<io.Socket | null>(null)
  const pending = useRef(true)

  useLayoutEffect(() => {
    const newSocket = manager.socket(url)
    if (autoConnect) {
      newSocket.connect()
    }
    setSocket(() => newSocket)
    pending.current = false

    return () => {
      if (newSocket.connected) {
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
