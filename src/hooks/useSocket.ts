import { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { SocketContext } from 'context/socketManager'

interface useSocketProps {
  nsp: string
}

const useSocket = ({ nsp }: useSocketProps) => {
  const { manager } = useContext(SocketContext)
  const [isError, setIsError] = useState<string | null>(null)

  const socket = useRef(
    manager.create_socket(nsp, {
      auth: {
        token: localStorage.getItem('_PLUG_AUTH_') || '',
      },
    }),
  )
  useEffect(() => {
    if (socket.current) {
      socket.current.listen('connect_error', ({ message }: Error) => {
        if (!isError) {
          setIsError(message)
        }
      })
      socket.current.listen('connect', () => {
        if (isError) {
          setIsError(null)
        }
      })
    }
  }, [socket.current, isError])
  return {
    manager,
    socket: socket.current,
    isError,
    isConnected: socket.current.connected,
    isLoading: !socket.current,
  }
}

export default useSocket
