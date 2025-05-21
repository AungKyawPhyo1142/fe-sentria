import ImageSlider from '@/components/imageSlider'
import { useLocation } from 'react-router'
import Login from './Login'
import Register from './Register'

const Container = () => {
  const route = useLocation()
  return (
    <div className='fade-in flex h-screen items-center justify-center'>
      <div className='flex w-full max-w-5xl overflow-hidden rounded-[10px] shadow-sm'>
        {/* Slider */}
        <div className='w-1/2 rounded-[10px]'>
          <ImageSlider />
        </div>
        {/* Login form */}
        <div className='relative flex w-1/2 flex-col items-center justify-center rounded-r-[10px] border border-l-0 border-[#333334]/30 bg-[#F5FEFD] p-5'>
          {/* 
          <div className='flex justify-end w-full'>
            <LanguageToggle />
          </div>
          
          */}
          {route.pathname === '/auth/login' ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  )
}

export default Container
