import { manager, SocketManager } from 'context/socketManager'
import SocketLayout from 'layout/SocketLayout'
import {
  createRoutesFromElements,
  Route,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import Home from 'screen/Home'
import Room from 'screen/Room'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<SocketLayout />}>
      <Route index element={<Home />} />
      <Route path='/:roomName' element={<Room />} />
    </Route>,
  ),
)
const Router = () => {
  return (
    <SocketManager.Provider value={manager}>
      <RouterProvider router={router} />
    </SocketManager.Provider>
  )
}

export default Router
