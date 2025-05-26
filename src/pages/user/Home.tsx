import Button from '@/components/common/Button'
import { ApiConstantRoutes } from '@/services/network/path'
import { cleanupAfterLogout } from '@/zustand/authStore'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
    </div>
  )
}
export default Home
