import Button from '@/components/common/Button'
import NotificationSidebar from '@/components/common/NotificationSidebar'
import { ApiConstantRoutes } from '@/services/network/path'
import { AppConstantRoutes } from '@/services/routes/path'
import { cleanupAfterLogout } from '@/zustand/authStore'
import { useSocketStore } from '@/zustand/socketStore'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const Home = () => {
  const connect = useSocketStore((state) => state.connect)
  const earthquakeAlertListener = useSocketStore(
    (state) => state.earthquakeAlertListener,
  )
  const sendUserLocation = useSocketStore((state) => state.sendUserLocation)
  const isConnected = useSocketStore((state) => state.isConnected)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  //use effect
  useEffect(() => {
    connect()
    earthquakeAlertListener()
  }, [])
  useEffect(() => {
    if (isConnected) {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      })
    }
  }, [isConnected])

  const handleLogout = () => {
    cleanupAfterLogout()
    queryClient.clear()
    navigate(ApiConstantRoutes.paths.auth.login)
  }
  return (
    <div>
      <h1>Home Page</h1>
      <Button className='my-5 w-25' primary onClick={handleLogout}>
        Log out
      </Button>
      <Button
        className='my-5 w-25'
        secondary
        onClick={() => navigate(AppConstantRoutes.paths.example.webSocket)}
      >
        Test Websocket
      </Button>

      <NotificationSidebar />
    </div>
  )
}
export default Home
