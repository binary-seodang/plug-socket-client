import { SocketContext } from 'context/socketManager'
import useSocket from 'hooks/useSocket'
import { useContext, useLayoutEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'
const SocketLayout = () => {
  const cookie = Cookie.get('_PLUG_AUTH_')
  const { socket } = useSocket({ nsp: '/' })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  useLayoutEffect(() => {
    if (socket && cookie) {
      // socket.emit('set_nickname', nickname, (nickname: string) => {
      //   if (nickname) {
      //     localStorage.setItem('plug_nickname', nickname)
      //   } else {
      //     // todo
      //   }
      // })
      setLoading(false)
    } else {
      navigate('/login')
    }
  }, [])
  return <div>{loading ? 'loading...' : <Outlet />}</div>
}

export default SocketLayout
