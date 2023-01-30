import { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSocket from '../hooks/useSocket'

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
  const onJoinRoom = useCallback(
    ({ roomName }: JoinRoomInput) => {
      socket?.emit('join_room', roomName)
    },
    [socket?.on],
  )

  useEffect(() => {
    if (socket) {
      socket.on('room_change', (data) => setRooms(data))
      socket.on('welcome', (data) => console.log('welcome', data))
      if (!isConnected) {
        socket.connect()
      }
    }
  }, [isPending])
  console.log(rooms)
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
    </>
  )
}

export default Home
