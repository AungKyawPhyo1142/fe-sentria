import Logo from '@/assets/sentria-logo.svg?react'
import CircleLogo from '@/assets/CircleLogo.svg?react'
import { Bell, Heart, Languages, LogOut } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { AppConstantRoutes } from '@/services/routes/path'
import { cleanupAfterLogout } from '@/zustand/authStore'

const Sidebar = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  //for logout
  const handleLogout = () => {
    cleanupAfterLogout()
    queryClient.clear()
    navigate(AppConstantRoutes.paths.auth.login)
  }

  // for style change
  const location = useLocation()
  const isMapPage = location.pathname === '/map'
  return (
    <aside
      className={`fixed left-0 z-40 hidden h-full ${isMapPage ? 'w-22' : 'w-64'} rounded-2xl border-r-1 border-black/30 bg-white pt-3 transition-all duration-300 ease-in-out md:block`}
    >
      {isMapPage ? (
        <CircleLogo
          onClick={() => navigate(AppConstantRoutes.paths.home)}
          className='mx-auto mt-3 w-12 cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80'
        />
      ) : (
        <Logo
          onClick={() => navigate(AppConstantRoutes.paths.home)}
          className='mx-4 w-38 cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80'
        />
      )}
      <div className='mt-10 flex h-[87%] flex-col justify-between'>
        {/* SideBar items */}
        <div className='text-primary space-y-6 pl-6 text-[16px]'>
          <span className='flex px-2 hover:cursor-pointer'>
            <Heart className='hover:stroke-primary/70 transition-all duration-200 ease-linear' />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && 'Favorites'}
            </span>
          </span>
          <hr className='mr-5 text-[#D9D9D9] transition-all duration-300 ease-in-out' />
          <span className='flex px-2 transition-all duration-300 ease-in-out hover:cursor-pointer'>
            <Bell className='hover:stroke-primary/70 transition-all duration-200 ease-linear' />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && 'Notifications'}
            </span>
          </span>
        </div>
        {/* Language and Logout */}
        <div className='text-primary space-y-6 border-t-1 border-[#D9D9D9] py-6 pl-6 text-[16px]'>
          <span className='flex cursor-pointer px-2 transition-all duration-300 ease-in-out hover:opacity-70'>
            <Languages />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && 'Burmese'}
            </span>
          </span>
          <span
            className='flex cursor-pointer px-2 transition-all duration-300 ease-in-out hover:opacity-70'
            onClick={handleLogout}
          >
            <LogOut />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && 'Logout'}
            </span>
          </span>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
