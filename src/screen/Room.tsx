// import useSocket from 'hooks/useSocket'
import { useParams } from 'react-router-dom'
import { useContext, useLayoutEffect } from 'react'
import { SocketContext } from 'context/socketManager'

const Room = () => {
  const { roomName } = useParams()
  const { socket } = useContext(SocketContext)

  useLayoutEffect(() => {
    if (socket && roomName) {
      !socket.hasListeners('welcome') &&
        socket.on('welcome', (data) => console.log('welcome', data))
      !socket.hasListeners('leave') && socket.on('leave', (data) => console.log('leave', data))
      socket.emit('join_room', roomName, (ok: string) => {
        if (!!ok) {
          console.log(ok)
        }
      })
    }
    return () => {
      if (socket) {
        socket.off('welcome', (data) => console.log('welcome', data))
        socket.off('leave', (data) => console.log('leave', data))
        socket.emit('leave_room', roomName)
      }
    }
  }, [])
  return <div></div>
}

export default Room
