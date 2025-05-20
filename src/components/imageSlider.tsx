import Slide2 from '@/assets/img2.svg'
import Slide3 from '@/assets/img3.svg'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import Slide1 from './common/Slide1'

const Slide_Interval = 4000
const ImageSlider: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const slides = [
    <Slide1 key='slide1' />,
    <img src={Slide2} alt='Slide 2' key='slide2' className='h-full w-fit object-cover'/>,
    <img src={Slide3} alt='Slide 3' key='slide3' className='h-full w-fit object-cover'/>,
  ]

  const slideCount = slides.length

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount)
      // triggerTransition();
    }, Slide_Interval)
    return () => clearInterval(interval)
  }, [])

  //Manual Slide
  const goToSlide = (index: number) => {
    setCurrent(index)
  }
  return (
    <div className='relative h-[825px] w-[513px] overflow-hidden'>
      {/* Slide Track */}
      <div
        className='flex h-full w-full transition-transform duration-500 ease-in-out'
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className='h-full w-fit flex-shrink-0'>
            {slide}
          </div>
        ))}
      </div>
      <div className='absolute bottom-5 left-[43%] flex justify-center space-x-3 rounded-tl-full rounded-tr-full rounded-br-full rounded-bl-full bg-zinc-500/50 p-2 backdrop-blur-[10px]'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={clsx(
              'h-3 w-3 rounded-full transition-opacity duration-300 hover:cursor-pointer hover:bg-white hover:opacity-100',
              index === current
                ? 'bg-white opacity-100'
                : 'bg-white opacity-48',
            )}
          />
        ))}
      </div>
    </div>
  )
}
export default ImageSlider
// const ImageSlider = () => {
//   return <div>slider</div>
// }
// export default ImageSlider
