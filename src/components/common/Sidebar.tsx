import Logo from '@/assets/sentria-logo.svg?react'
import { Bell, Heart, Languages, LogOut } from 'lucide-react'

const Sidebar = () => {
  return (
    <aside className='fixed left-0 z-40 hidden h-full w-68 rounded-2xl border-r-1 border-black/30 bg-white pt-8 shadow-md md:block'>
      <Logo className='mx-4 w-38' />
      <div className='mt-12 flex h-[80%] flex-col justify-between'>
        <div className='text-primary space-y-6 pl-6 text-[16px]'>
          <span className='flex px-3'>
            <Heart className='mr-2 p-0.5' /> Favorites
          </span>
          <hr className='mr-5 text-[#D9D9D9]' />
          <span className='flex px-3'>
            <Bell className='mr-2 p-0.5' /> Notifications
          </span>
        </div>
        <div className='text-primary space-y-6 border-t-1 border-[#D9D9D9] p-6 text-[16px]'>
          <span className='flex px-3'>
            <Languages className='mr-2 p-0.5' /> Burmese
          </span>
          <span className='flex px-3'>
            <LogOut className='mr-2 p-0.5' /> Logout
          </span>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
