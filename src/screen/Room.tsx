// import useSocket from 'hooks/useSocket'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SocketContext } from 'context/socketManager'
import { Welcome } from 'types/dtos/socketResponse.dto'

const Room = () => {
  const { roomName } = useParams()
  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)
  const [userList, setUserList] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const myVideo = useRef<HTMLVideoElement>(null)
  const peerVideo = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [myPeer, setMypeer] = useState<RTCPeerConnection>()
  const [myDataChannel, setMyDataChannel] = useState<RTCDataChannel>()

  const handleIce = useCallback(
    (data: RTCPeerConnectionIceEvent) => {
      if (socket) {
        socket?.emit('ice', { ice: data.candidate, roomName })
      }
    },
    [socket],
  )

  const handleAddStream = useCallback(
    (data: RTCTrackEvent) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = data.streams[0]
      }
    },
    [peerVideo.current],
  )

  const sendOffer = useCallback(async () => {
    if (myPeer && socket) {
      const datachannel = myPeer.createDataChannel('chat')
      datachannel.addEventListener('message', (message) => console.log(message))
      const offer = await myPeer.createOffer()
      myPeer.setLocalDescription(offer)
      socket.emit('offer', { offer, roomName })
    }
  }, [myPeer, socket])

  const getMedia = useCallback(async () => {
    if (socket) {
      setLoading(true)
      if (myVideo.current) {
        const myStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: 'user' },
        })

        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302',
              ],
            },
          ],
        })

        peer.addEventListener('icecandidate', handleIce)
        peer.addEventListener('track', handleAddStream)
        myVideo.current.srcObject = myStream
        myStream.getTracks().forEach((track) => peer.addTrack(track, myStream))
        setStream(myStream)
        setMypeer(peer)
      }
    }
    setLoading(false)
  }, [socket])

  const addIceCandidate = useCallback(
    (ice: RTCIceCandidate) => {
      if (myPeer) {
        myPeer.addIceCandidate(ice)
      }
    },
    [myPeer],
  )

  useEffect(() => {
    if (socket && myPeer && !socket.hasListeners('ice')) {
      socket.on('ice', (ice) => {
        console.log('received candidate')
        addIceCandidate(ice)
      })
    }
  }, [socket, myPeer])
  useLayoutEffect(() => {
    if (socket && roomName) {
      !socket.hasListeners('leave') &&
        socket.on('leave', ({ userList: users }: Pick<Welcome, 'userList'>) => {
          setUserList(users)
        })
      socket.emit('join_room', roomName, ({ nickname, userList: users, ok }: Welcome) => {
        if (!ok) {
          navigate('/')
          return
        }
        loading && setUserList(users)
      })

      getMedia()
    }
    return () => {
      if (socket) {
        // ?????? ????????? ???????????? ?????? ??????
        // navigator.mediaDevices.enumerateDevices()

        // ?????? ????????? ?????? ?????? ?????????
        // stream?.getTracks().forEach(function (track) {
        //   track.stop()
        // })
        socket.emit('leave_room', roomName)
        socket.off('welcome', (data) => console.log('welcome', data))
        socket.off('leave', (data) => console.log('leave', data))
      }
    }
  }, [])

  useEffect(() => {
    if (socket && !socket.hasListeners('welcome') && myPeer) {
      socket.on('welcome', ({ nickname, userList: users }: Welcome) => {
        setUserList(users)
        sendOffer()
      })
    }
  }, [myPeer, socket])
  return (
    <div>
      <video autoPlay ref={myVideo}></video>
      <video autoPlay ref={peerVideo}></video>
      {userList.map((user, index) => (
        <div key={user + '' + index}>
          <span>User : {user}</span>
        </div>
      ))}
    </div>
  )
}

export default Room
