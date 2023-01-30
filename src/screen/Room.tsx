import useSocket from 'hooks/useSocket'
import { useParams } from 'react-router-dom'

const Room = () => {
  const { roomName } = useParams()
  const {} = useSocket({ url: '/' })
  console.log(roomName)
  return <div></div>
}

export default Room
