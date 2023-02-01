import { SocketContext } from 'context/socketManager'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface JoinRoomInput {
  roomName: string
}

const Home = () => {
  const { socket } = useContext(SocketContext)

  useEffect(() => {}, [])
  const [rooms, setRooms] = useState<string[] | []>([])
  const { register, handleSubmit } = useForm<JoinRoomInput>()
  const navigate = useNavigate()
  const onJoinRoom = useCallback(
    ({ roomName }: JoinRoomInput) => {
      navigate(roomName)
    },
    [socket?.on],
  )

  useEffect(() => {
    if (socket) {
      socket.on('room_change', (data) => setRooms(data))
      if (!socket.connected) {
        socket.connect()
      }
    }
  }, [socket?.connected])

  return (
    <>
      <form onSubmit={handleSubmit(onJoinRoom)}>
        <input
          {...register('roomName', {
            required: '필수',
          })}
        />
        <input type='submit' value='join' />
      </form>
      <section>
        {rooms.length ? (
          <ul>
            {rooms.map((room) => (
              <li key={room} onClick={() => onJoinRoom({ roomName: room })}>
                {room}
              </li>
            ))}
          </ul>
        ) : (
          <>Not found.</>
        )}
      </section>
    </>
  )
}

export default Home
