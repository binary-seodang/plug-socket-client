import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSocket from 'hooks/useSocket'
import { useNavigate } from 'react-router-dom'

interface JoinRoomInput {
  roomName: string
}

const Home = () => {
  const { socket, isConnected, isPending } = useSocket({
    url: '/',
    autoConnect: false,
  })
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
      if (!isConnected) {
        socket.connect()
      }
    }
  }, [isPending])
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
