import { Outlet, useLocation } from 'react-router'
import Sidebar from '../common/Sidebar'
import NavBar from '../common/NavBar'

const LayoutWithAuth = () => {
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        <Sidebar />
        <div className='w-full flex-col'>
          <div>
            {/* NavBar */}
            {location.pathname !== '/profile' && <NavBar />}
          </div>
          <main className={`mt-18 ${isMapPage ? 'ml-26' : 'ml-68'} p-8`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default LayoutWithAuth
