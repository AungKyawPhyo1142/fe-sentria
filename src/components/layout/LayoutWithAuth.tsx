import { Outlet, useLocation } from 'react-router'
import Sidebar from '../common/Sidebar'
import NavBar from '../common/NavBar'
import NotificationManager from '../common/NotificationManager'
import { ToastContainer } from 'react-toastify'

const LayoutWithAuth = () => {
  const location = useLocation()
  const isMapPage = location.pathname === '/map'
  const isProfilePage = location.pathname === '/profile'

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <ToastContainer />
      <Sidebar />

      <div className='ml-16 flex flex-1 flex-col'>
        {!isProfilePage && <NavBar />}

        <main
          className={`flex-1 ${
            isMapPage ? '' : 'px-8 pt-20 pb-8'
          } ${isMapPage ? 'mt-14' : ''}`}
        >
          <Outlet />
        </main>

        <NotificationManager />
      </div>
    </div>
  )
}

export default LayoutWithAuth
