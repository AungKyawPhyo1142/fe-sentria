import Logo from '@/assets/sentria-logo.svg?react'
import CircleLogo from '@/assets/CircleLogo.svg?react'
import { Bell, Heart,  LogOut } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { AppConstantRoutes } from '@/services/routes/path'
import { cleanupAfterLogout } from '@/zustand/authStore'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from './LanguageDropdown'

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
  const { t } = useTranslation()
  return (
    <aside
      className={`fixed left-0 z-40 hidden h-full ${isMapPage ? 'w-22' : 'w-64'} border-r-1 rounded-2xl border-black/30 bg-white pt-3 transition-all duration-300 ease-in-out md:block`}
    >
      {isMapPage ? (
        <CircleLogo
          onClick={() => navigate(AppConstantRoutes.paths.home)}
          className='mx-auto mt-3 w-12 cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80'
        />
      ) : (
        <Logo
          onClick={() => navigate(AppConstantRoutes.paths.home)}
          className='w-38 mx-4 cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80'
        />
      )}
      <div className='mt-10 flex h-[87%] flex-col justify-between'>
        {/* SideBar items */}
        <div className='text-primary space-y-6 pl-6 text-[16px]'>
          <span className='flex px-2 hover:cursor-pointer'>
            <Heart className='hover:stroke-primary/70 transition-all duration-200 ease-linear' />
            <span className='duration-330 ml-2 transition-all ease-linear'>
              {!isMapPage && <p>{t('sidebar.Favorites')}</p>}
            </span>
          </span>
          <hr className='mr-5 text-[#D9D9D9] transition-all duration-300 ease-in-out' />
          <span className='flex px-2 transition-all duration-300 ease-in-out hover:cursor-pointer'>
            <Bell className='hover:stroke-primary/70 transition-all duration-200 ease-linear' />
            <span className='duration-330 ml-2 transition-all ease-linear'>
              {!isMapPage && <p>{t('sidebar.Notifications')}</p>}
            </span>
          </span>
        </div>
        {/* Language and Logout */}
        <div className='text-primary border-t-1 space-y-6 border-[#D9D9D9] py-6 pl-6 text-[16px]'>
          <span className='flex cursor-pointer px-2 transition-all duration-300 ease-in-out hover:opacity-70'>
            {/* <Languages />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && <p>{t('sidebar.Language')}</p>}
            </span> */}

            <span className='flex px-2 hover:cursor-pointer'>
              <LanguageDropdown />
            </span>
          </span>

          <span
            className='flex cursor-pointer px-2 transition-all duration-300 ease-in-out hover:opacity-70'
            onClick={handleLogout}
          >
            <LogOut />
            <span className='duration-330 ml-2 transition-all ease-linear'>
              {!isMapPage && <p>{t('sidebar.LogOut')}</p>}
            </span>
          </span>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
