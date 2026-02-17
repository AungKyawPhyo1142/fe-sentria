import CircleLogo from '@/assets/CircleLogo.svg?react'
import ReactDOM from 'react-dom'

const LogoLoader = () => {
  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-gray-900/20 backdrop-blur-[2px]'>
      <div className='flex flex-col items-center gap-5'>
        {/* Logo with pulse ring */}
        <div className='relative flex items-center justify-center'>
          {/* Outer spinning ring */}
          <div className='border-t-primary absolute h-20 w-20 animate-[spin_2.5s_linear_infinite] rounded-full border-2 border-transparent' />

          {/* Subtle glow */}
          <div className='bg-primary/5 absolute h-16 w-16 rounded-full' />

          {/* Logo */}
          <CircleLogo className='relative h-10 w-10' />
        </div>

        {/* Loading text */}
        <span className='text-[13px] font-medium tracking-wide text-gray-500'>
          Loading...
        </span>
      </div>
    </div>,
    document.body,
  )
}

export default LogoLoader
