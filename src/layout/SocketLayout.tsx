import useSocket from 'hooks/useSocket'
import { useLayoutEffect } from 'react'
import { Outlet } from 'react-router-dom'

const SocketLayout = () => {
  const { socket, isConnected, isPending } = useSocket({
    url: '/',
  })
  return <div>{isConnected ? <Outlet /> : <>Loading..</>}</div>
}

export default SocketLayout
