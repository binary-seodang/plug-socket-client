import useSocket from 'hooks/useSocket'
import { useParams } from 'react-router-dom'
import { useLayoutEffect } from 'react'

const Room = () => {
  const { roomName } = useParams()
  const { socket } = useSocket({ url: '/' })
  useLayoutEffect(() => {
    if (socket && roomName) {
      socket.on('welcome', (data) => console.log('welcome', data))
      socket.emit('join_room', roomName, (ok: string) => {
        if (!!ok) {
          console.log(ok)
        }
      })
    }
  }, [socket?.on])
  return <div></div>
}

export default Room
