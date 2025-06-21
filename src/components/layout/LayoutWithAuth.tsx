import { Outlet, useLocation } from 'react-router'
import NotificationManager from '../common/NotificationManager'
import { toast, ToastContainer } from 'react-toastify'
import Button from '../common/Button'

const LayoutWithAuth = () => {
  const location = useLocation()



  return (
    <div className='flex min-h-screen bg-gray-100'>
      <ToastContainer />
      {location.pathname !== '/profile' && (
        <aside className='hidden w-60 bg-white shadow-md md:block'>
          {/* Placeholder Sidebar */}
          <div className='p-4'>Sidebar</div>
        </aside>
      )}

      <main className='flex-1 p-5'>
        <Outlet />
      </main>

      <NotificationManager />
    </div>
  )
}

export default LayoutWithAuth
