import Logo from '@/assets/sentria-logo.svg?react'
import CircleLogo from '@/assets/CircleLogo.svg?react'
import { Bell, Bookmark, LogOut } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { AppConstantRoutes } from '@/services/routes/path'
import { cleanupAfterLogout } from '@/zustand/authStore'
import { useTranslation } from 'react-i18next'
import LanguageDropdown from './LanguageDropdown'

const Sidebar = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // for style change
  const location = useLocation()
  const isMapPage = location.pathname === '/map'
  const isFavPage = location.pathname.includes(AppConstantRoutes.paths.fav)
  const { t } = useTranslation()

  //for logout
  const handleLogout = () => {
    cleanupAfterLogout()
    queryClient.clear()
    navigate(AppConstantRoutes.paths.auth.login)
  }

  const getIconClass = (isActive: boolean) =>
    `transition-all duration-300 ease-linear ${
      isActive ? 'fill-primary' : 'fill-none'
    }`

  return (
    <aside
      className={`fixed left-0 z-40 hidden h-full ${isMapPage ? 'w-22' : 'w-64'} rounded-tr-2xl rounded-br-2xl border-r-1 border-black/30 bg-white pt-3 transition-[width] duration-300 ease-linear md:block`}
    >
      {isMapPage ? (
        <CircleLogo
          onClick={() => navigate(AppConstantRoutes.paths.home)}
          className='mx-auto mt-3 w-12 cursor-pointer transition-all duration-300 ease-linear hover:opacity-80'
        />
      ) : (
        <Logo
          onClick={() => navigate(AppConstantRoutes.paths.home)}
          className='mx-4 w-38 cursor-pointer transition-all duration-300 ease-linear hover:opacity-80'
        />
      )}
      <div className='mt-10 flex h-[87%] flex-col justify-between'>
        {/* SideBar items */}
        <div className='text-primary space-y-6 pl-6 text-[16px]'>
          {/* fav  */}
          <span
            className={`flex px-2 transition-all duration-300 ease-linear hover:cursor-pointer hover:opacity-50 ${isFavPage ? 'font-semibold hover:opacity-100' : ''}`}
            onClick={() => navigate(AppConstantRoutes.paths.fav)}
          >
            <Bookmark className={getIconClass(isFavPage)} />
            {!isMapPage && (
              <span className='ml-2'>{t('sidebar.Favorites')}</span>
            )}
          </span>
          {/* bar */}
          <hr className='mr-5 text-[#D9D9D9] transition-all duration-300 ease-linear' />
          {/* noti */}
          <span className='flex px-2 transition-all duration-300 ease-linear hover:cursor-pointer hover:opacity-50'>
            <Bell className='transition-all duration-200 ease-linear' />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && <p>{t('sidebar.Notifications')}</p>}
            </span>
          </span>
        </div>
        {/* Language and Logout */}
        <div className='text-primary space-y-6 border-t-1 border-[#D9D9D9] py-6 pl-6 text-[16px]'>
          <span className='flex cursor-pointer px-2 transition-all duration-300 ease-linear hover:opacity-70'>
            {/* <Languages />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && <p>{t('sidebar.Language')}</p>}
            </span> */}

            <span className='flex hover:cursor-pointer'>
              <LanguageDropdown />
            </span>
          </span>

          <span
            className='flex cursor-pointer px-2 transition-all duration-300 ease-linear hover:opacity-70'
            onClick={handleLogout}
          >
            <LogOut />
            <span className='ml-2 transition-all duration-330 ease-linear'>
              {!isMapPage && <p>{t('sidebar.LogOut')}</p>}
            </span>
          </span>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
