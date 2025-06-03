import { Outlet, useLocation } from 'react-router'
import Sidebar from '../common/Sidebar'
import NavBar from '../common/NavBar'

const LayoutWithAuth = () => {
  const location = useLocation()

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        {location.pathname !== '/profile' && <Sidebar />}
        <div className='flex-col w-full'>
          <div>
            {/* NavBar */}
            <NavBar />
          </div>
          <main className='p-5 ml-68 mt-26'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default LayoutWithAuth
