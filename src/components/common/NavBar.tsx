import { useState } from 'react'
import Profile from '@/assets/Profile.svg?react'
import {
  MdHome,
  MdPhone,
  MdMap,
  MdHandshake,
  MdVolunteerActivism,
} from 'react-icons/md'
import { CirclePlus } from 'lucide-react'
import { AppConstantRoutes } from '@/services/routes/path'
import { useLocation, useNavigate } from 'react-router'

const NavbarItems = [
  {
    icon: <MdHome size={50} />,
    title: 'home',
    path: AppConstantRoutes.paths.home,
  },
  {
    icon: <MdPhone size={50} />,
    title: 'contact',
    path: '',
  },
  {
    icon: <MdMap size={50} />,
    title: 'map',
    path: AppConstantRoutes.paths.map,
  },
  {
    icon: <MdHandshake size={50} />,
    title: 'heart',
    path: '',
  },
  {
    icon: <MdVolunteerActivism size={50} />,
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

  const iconClass = (icon: string) =>
    `transition-colors hover:cursor-pointer hover:text-primary duration-200 ${activeIcon === icon ? 'text-primary' : 'text-black/30'}`

  //map page
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  return (
    <div
      className={`fixed top-0 right-0 ${isMapPage ? 'left-30' : 'left-68'} flex items-center justify-between space-x-6 bg-white px-8 py-4 text-black transition-all duration-300 ease-in-out`}
    >
      {/* Navbar Icons */}
      <div className='flex w-1/2 items-center justify-between rounded-xl border border-black/30 px-16 py-1'>
        {NavbarItems.map((item) => (
          <div key={item.title}>
            <button
              onClick={() => handleIconClick(item.title, item.path)}
              className={iconClass(item.title)}
              disabled={!item.path}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Create Post */}
      <button className='bg-primary flex w-1/4 items-center justify-center rounded-xl px-4 py-4 font-light text-white hover:cursor-pointer'>
        <CirclePlus size={30} />
        <span className='ml-3 text-[18px]'>Report a disaster</span>
      </button>

      {/* Profile */}
      <div className='flex w-1/4 items-center justify-center space-x-2 rounded-xl border border-black/30 px-4 py-2'>
        <Profile className='h-12 w-12 rounded-full object-cover' />
        <span className='ml-3 text-[16px]'>Sweeny Sydney</span>
      </div>
    </div>
  )
}

export default Navbar
