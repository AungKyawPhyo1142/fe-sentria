import { useEffect, useState } from 'react'
import { CirclePlus, HeartHandshake, Map, Phone } from 'lucide-react'
import { AppConstantRoutes } from '@/services/routes/path'
import { useLocation, useNavigate } from 'react-router'
import Home from '@/assets/icons/home.svg?react'
import Hand from '@/assets/icons/OfferHand2.svg?react'
import { useTranslation } from 'react-i18next'
import CreatePostModal from './CreatePostModal'
import ProfileNav from './ProfileNav'
import SearchBar from './SearchBar'

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
        size={28}
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
        size={30}
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
        size={30}
        strokeWidth={1}
        className={`icon-svg text-black/30 ${active ? 'icon-svg--active' : ''}`}
      />
    ),
    title: 'heart',
    path: '',
  },
  {
    icon: (active: boolean) => (
      <Hand
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
  const { t } = useTranslation()

  //open create post
  const [createPost, setCreatePost] = useState(false)

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
      className={`fixed top-0 right-0 z-20 ${isMapPage ? 'left-30' : 'left-68'} mr-6 flex items-center justify-between bg-white py-4 text-black transition-all duration-300 ease-in-out`}
    >
      <div
        className={`mx-6 ml-6 flex flex-1/2 ${isMapPage ? 'space-x-16' : 'space-x-8'}`}
      >
        {/* Navbar Icons */}
        <div className='flex h-12.5 w-80 items-center justify-between rounded-xl border border-black/30 p-4 px-12'>
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
        <button
          onClick={() => setCreatePost(true)}
          className='bg-primary flex h-12.5 w-50 items-center justify-center rounded-xl py-1 font-light text-white hover:cursor-pointer'
        >
          <CirclePlus size={26} strokeWidth={1} />
          <span className='ml-3 text-[16px]'>{t('sidebar.ReportPost')}</span>
        </button>
        {createPost && (
          <CreatePostModal isOpen={createPost} setIsOpen={setCreatePost} />
        )}

        {/* Search Post */}
        <SearchBar />
      </div>

      {/* Profile */}
      <ProfileNav />
    </div>
  )
}

export default Navbar
