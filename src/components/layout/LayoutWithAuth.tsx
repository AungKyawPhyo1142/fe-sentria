import { Outlet, useLocation } from 'react-router'
import Sidebar from '../common/Sidebar'
import NavBar from '../common/NavBar'
import NotificationManager from '../common/NotificationManager'
import { ToastContainer } from 'react-toastify'

const LayoutWithAuth = () => {
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  return (
    <div className='flex min-h-screen flex-col'>
      <ToastContainer/>
      <div className='flex flex-1'>
        <Sidebar />
        <div className='w-full flex-col'>
          <div>
            {/* NavBar */}
            {location.pathname !== '/profile' && <NavBar />}
          </div>
          <main className={`mt-18 ${isMapPage ? 'ml-26' : 'ml-68'} p-5`}>
            <Outlet />
          </main>
          <NotificationManager />
        </div>
      </div>
    </div>
  )
}

export default LayoutWithAuth
