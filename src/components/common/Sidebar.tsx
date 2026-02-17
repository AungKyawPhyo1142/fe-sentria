import CircleLogo from '@/assets/CircleLogo.svg?react'
import {
  Home,
  Map,
  BookOpen,
  Bookmark,
  Bell,
  LogOut,
  Globe,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router'
import { AppConstantRoutes } from '@/services/routes/path'
import { cleanupAfterLogout } from '@/zustand/authStore'
import i18next from 'i18next'
import { useUserProfile } from '@/services/network/lib/user'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { generateDefaultProfileImage } from '@/helpers/helpers'

interface NavItem {
  icon: React.ElementType
  path: string
  label: string
}

const mainNavItems: NavItem[] = [
  { icon: Home, label: 'Home', path: AppConstantRoutes.paths.home },
  { icon: Map, label: 'Map', path: AppConstantRoutes.paths.map },
  {
    icon: BookOpen,
    label: 'Resources',
    path: AppConstantRoutes.paths.resources,
  },
]

const personalNavItems: NavItem[] = [
  { icon: Bookmark, label: 'Favorites', path: AppConstantRoutes.paths.fav },
  { icon: Bell, label: 'Alerts', path: '' },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()
  const { userId } = useAuthStore(selectAuth)
  const { data: userProfile } = useUserProfile(userId)

  const handleLogout = () => {
    cleanupAfterLogout()
    queryClient.clear()
    navigate(AppConstantRoutes.paths.auth.login)
  }

  const toggleLanguage = () => {
    const next = i18next.language === 'en' ? 'mm' : 'en'
    i18next.changeLanguage(next)
  }

  const isActive = (path: string) => {
    if (!path) return false
    return location.pathname === path
  }

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    const active = isActive(item.path)

    return (
      <div key={item.label} className='group relative flex justify-center'>
        {/* Active indicator bar */}
        {active && (
          <div className='bg-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full' />
        )}

        <button
          onClick={() => item.path && navigate(item.path)}
          disabled={!item.path}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
            active
              ? 'bg-primary/10 text-primary'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          } ${!item.path ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
        >
          <Icon size={20} strokeWidth={active ? 2 : 1.5} />
        </button>

        {/* Tooltip */}
        <div className='pointer-events-none absolute top-1/2 left-full ml-3 -translate-y-1/2 rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100'>
          {item.label}
          <div className='absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-800' />
        </div>
      </div>
    )
  }

  return (
    <aside className='fixed top-0 left-0 z-40 hidden h-screen w-16 flex-col items-center bg-white md:flex'>
      {/* Logo */}
      <div className='flex h-14 items-center justify-center'>
        <CircleLogo
          onClick={() => navigate(AppConstantRoutes.paths.home)}
          className='w-8 cursor-pointer transition-transform duration-200 hover:scale-105'
        />
      </div>

      {/* Thin separator */}
      <div className='mx-3 h-px w-8 bg-gray-200' />

      {/* Main nav */}
      <nav className='mt-4 flex flex-1 flex-col items-center'>
        <div className='space-y-1'>{mainNavItems.map(renderNavItem)}</div>

        <div className='mx-3 my-4 h-px w-8 bg-gray-100' />

        <div className='space-y-1'>{personalNavItems.map(renderNavItem)}</div>
      </nav>

      {/* Bottom actions */}
      <div className='mb-4 flex flex-col items-center space-y-1'>
        {/* Language toggle */}
        <div className='group relative flex justify-center'>
          <button
            onClick={toggleLanguage}
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-600'
          >
            <Globe size={20} strokeWidth={1.5} />
          </button>
          <div className='pointer-events-none absolute top-1/2 left-full ml-3 -translate-y-1/2 rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100'>
            {i18next.language === 'en' ? 'Myanmar' : 'English'}
            <div className='absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-800' />
          </div>
        </div>

        {/* Logout */}
        <div className='group relative flex justify-center'>
          <button
            onClick={handleLogout}
            className='hover:bg-danger-light hover:text-danger flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-400 transition-all duration-150'
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
          <div className='pointer-events-none absolute top-1/2 left-full ml-3 -translate-y-1/2 rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100'>
            Logout
            <div className='absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-800' />
          </div>
        </div>

        {/* Separator */}
        <div className='mx-3 h-px w-8 bg-gray-200' />

        {/* User avatar */}
        <button
          onClick={() => navigate(AppConstantRoutes.paths.profile)}
          className='mt-2 cursor-pointer'
        >
          {userProfile?.profile_image ? (
            <img
              src={userProfile.profile_image}
              alt='profile'
              className='hover:ring-primary/30 h-8 w-8 rounded-full object-cover ring-2 ring-gray-100 transition-all duration-150'
            />
          ) : (
            <div className='bg-primary/10 text-primary hover:ring-primary/30 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-gray-100 transition-all duration-150'>
              {generateDefaultProfileImage(userProfile?.firstName)}
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
