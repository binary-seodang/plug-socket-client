import { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { SocketContext } from 'context/socketManager'
import { Socket } from 'socket.io-client'
interface useSocketProps {
  nsp: string
}

const useSocket = ({ nsp }: useSocketProps) => {
  const { manager } = useContext(SocketContext)

  const socket = useRef(manager.create_socket(nsp))
  return {
    manager,
    socket: socket.current,
  }
}

export default useSocket
