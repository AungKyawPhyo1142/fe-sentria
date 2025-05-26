import { Outlet, useLocation } from 'react-router'

const LayoutWithAuth = () => {
  const location = useLocation()

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {location.pathname !== '/profile' && (
        <aside className='hidden w-60 bg-white shadow-md md:block'>
          {/* Placeholder Sidebar */}
          <div className='p-4'>Sidebar</div>
        </aside>
      )}

      <main className='flex-1 p-5'>
        <Outlet />
      </main>
    </div>
  )
}

export default LayoutWithAuth
