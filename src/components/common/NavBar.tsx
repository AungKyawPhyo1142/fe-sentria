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

const Navbar = () => {
  const [activeIcon, setActiveIcon] = useState<string>('home')

  const iconClass = (icon: string) =>
    `transition-colors hover:cursor-pointer duration-200 ${activeIcon === icon ? 'text-primary' : 'text-black/30'}`

  return (
    <div className='fixed top-0 right-0 left-68 flex items-center justify-between space-x-7 bg-white px-8 py-4 text-black shadow-sm'>
      {/* Left Icons */}
      <div className='flex w-1/2 items-center justify-between rounded-xl border border-black/30 px-16 py-3'>
        <button
          onClick={() => setActiveIcon('home')}
          className={iconClass('home')}
        >
          <MdHome size={40} />
        </button>
        <button
          onClick={() => setActiveIcon('contact')}
          className={iconClass('contact')}
        >
          <MdPhone size={40} />
        </button>
        <button
          onClick={() => setActiveIcon('map')}
          className={iconClass('map')}
        >
          <MdMap size={40} />
        </button>
        <button
          onClick={() => setActiveIcon('heart')}
          className={iconClass('heart')}
        >
          <MdHandshake size={40} />
        </button>
        <button
          onClick={() => setActiveIcon('help')}
          className={iconClass('help')}
        >
          <MdVolunteerActivism size={40} />
        </button>
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
