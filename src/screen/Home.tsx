import { SocketContext } from 'context/socketManager'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

interface JoinRoomInput {
  roomName: string
}
interface NicknameInput {
  nickname: string
}

const Home = () => {
  const { socket } = useContext(SocketContext)

  useEffect(() => {}, [])
  const [rooms, setRooms] = useState<string[] | []>([])
  const { register: roomRegister, handleSubmit: roomSubmit } = useForm<JoinRoomInput>()
  const { register: nicknameRegister, handleSubmit: nicknameSubmit } = useForm<NicknameInput>({
    defaultValues: {
      nickname: localStorage.getItem('plug_nickname') || '',
    },
  })
  const navigate = useNavigate()
  const onJoinRoom = useCallback(
    ({ roomName }: JoinRoomInput) => {
      navigate(roomName)
    },
    [socket?.on],
  )

  const onSetNickname = useCallback(
    ({ nickname }: NicknameInput) => {
      socket?.emit('set_nickname', nickname, (nickname: string) => {
        if (nickname) {
          localStorage.setItem('plug_nickname', nickname)
        } else {
          // todo
        }
      })
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
      <form onSubmit={nicknameSubmit(onSetNickname)}>
        <input
          placeholder='닉네임을 설정해주세요'
          {...nicknameRegister('nickname', {
            required: '필수',
          })}
        />
        <input type='submit' value='submit' />
      </form>
      <form onSubmit={roomSubmit(onJoinRoom)}>
        <input
          {...roomRegister('roomName', {
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
