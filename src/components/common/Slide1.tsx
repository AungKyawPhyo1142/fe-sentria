import React from 'react'
import Bg from '@/assets/img1.svg'
import Logo from '@/assets/logo.svg'

const Slide1: React.FC = () => {
  return (
    <div className='relative h-full w-fit'>
      <img
        src={Bg}
        alt='Slide 1 Background'
        className='h-full w-fit object-cover'
      />
      <img
        src={Logo}
        alt='Logo'
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform'
      />
    </div>
  )
}

export default Slide1
