import { SocketContext } from 'context/socketManager'
import useSocket from 'hooks/useSocket'
import { useContext, useLayoutEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
const SocketLayout = () => {
  const { socket } = useSocket({ nsp: '/' })
  const [loading, setLoading] = useState(true)
  useLayoutEffect(() => {
    const nickname = localStorage.getItem('plug_nickname')
    if (socket && nickname) {
      socket.emit('set_nickname', nickname, (nickname: string) => {
        if (nickname) {
          localStorage.setItem('plug_nickname', nickname)
        } else {
          // todo
        }
      })
    }
    setLoading(false)
  }, [])
  return <div>{loading ? 'loading...' : <Outlet />}</div>
}

export default SocketLayout
