import { useEffect, useState } from 'react'
import Profile from '@/assets/Profile.svg?react'
import {
  CirclePlus,
  HandHelping,
  HeartHandshake,
  Map,
  Phone,
} from 'lucide-react'
import { AppConstantRoutes } from '@/services/routes/path'
import { useLocation, useNavigate } from 'react-router'
import Home from '@/assets/icons/home.svg?react'

const NavbarItems = [
  {
    icon: (active: boolean) => (
      <Home
        className={`icon-svg text-black/30 ${active ? 'icon-svg--active' : ''}`}
      />
    ),
    title: 'home',
    path: AppConstantRoutes.paths.home,
  },
  {
    icon: (active: boolean) => (
      <Phone
        size={38}
        strokeWidth={1}
        className={`icon-svg text-black/30 ${active ? 'icon-svg--active' : ''}`}
      />
    ),
    title: 'contact',
    path: '',
  },
  {
    icon: (active: boolean) => (
      <Map
        size={40}
        strokeWidth={1}
        className={`icon-svg text-black/30 ${active ? 'icon-svg--active' : ''}`}
      />
    ),
    title: 'map',
    path: AppConstantRoutes.paths.map,
  },
  {
    icon: (active: boolean) => (
      <HeartHandshake
        size={40}
        strokeWidth={1}
        className={`icon-svg text-black/30 ${active ? 'icon-svg--active' : ''}`}
      />
    ),
    title: 'heart',
    path: '',
  },
  {
    icon: (active: boolean) => (
      <HandHelping
        size={42}
        strokeWidth={1}
        className={`icon-svg text-black/30 ${active ? 'icon-svg--active' : ''}`}
      />
    ),
    title: 'help',
    path: '',
  },
]

const Navbar = () => {
  const [activeIcon, setActiveIcon] = useState<string>('home')
  const navigate = useNavigate()

  const handleIconClick = (title: string, path?: string) => {
    setActiveIcon(title)
    if (path) navigate(path) /**will chang it later */
  }

  //map page
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  useEffect(() => {
    const currentPath = location.pathname
    const matchedItem = NavbarItems.find(
      (item) => item.path && currentPath.includes(item.path),
    )
    if (matchedItem) {
      setActiveIcon(matchedItem.title)
    }
  }, [location.pathname])

  return (
    <div
      className={`fixed top-0 right-0 ${isMapPage ? 'left-30' : 'left-68'} flex items-center justify-between bg-white mr-6 ml-3 py-4 text-black transition-all duration-300 ease-in-out`}
    >
      {/* Navbar Icons */}
      <div className='flex h-14 w-150 items-center justify-between rounded-xl border border-black/30 px-12 mr-5'>
        {NavbarItems.map((item) => (
          <button
            key={item.title}
            onClick={() => handleIconClick(item.title, item.path)}
            disabled={!item.path}
          >
            {item.icon(activeIcon === item.title)}
          </button>
        ))}
      </div>

      {/* Create Post */}
      <button className='bg-primary flex h-14 w-60 items-center justify-center rounded-xl px-4 py-1 font-light text-white hover:cursor-pointer'>
        <CirclePlus size={30} strokeWidth={1} />
        <span className='ml-3 text-[18px]'>Report a disaster</span>
      </button>

      {/* Profile */}
      <div className='flex h-14 w-60 ml-5 items-center justify-center space-x-2 rounded-xl border border-black/30 px-4 py-1'>
        <Profile className='h-12 w-12 rounded-full border-1 border-black/30 object-cover' />
        <span className='ml-3 text-[16px]'>Sweeny Sydney</span>
      </div>
    </div>
  )
}

export default Navbar
