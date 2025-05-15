import Image1 from '@/assets/Image1.svg'
import Image2 from '@/assets/Image2.svg'
import Image3 from '@/assets/Image3.svg'
import sentria from '@/assets/sentria.svg'
import { useEffect, useState } from 'react'
const ImageSlide = () => {
  const slides = [
    {
      id: 1,
      title:
        "In every disaster, there's a survivor's voice. Let yours be heard.",
      imageUrl: Image1,
    },
    {
      id: 2,
      title: "Hope isn't lost - it's shared. Sentria helps you find it again.",
      imageUrl: Image2,
    },
    {
      id: 3,
      title : sentria,
      imageUrl: Image3,
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])
  return (
    <div className='bg-gray-50'>
      <div
        className='relative h-[700px] w-full overflow-hidden'
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {slides.map((slide, index) => {
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
                currentSlide === index ? 'z-10 opacity-100' : 'z-0 opacity-0'
              }`}
            >
              <div
                className='absolute inset-0 bg-cover bg-center'
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              >
                <div className='absolute inset-0 bg-black/40' />
              </div>

              <div className='relative z-20 flex h-full flex-col items-center justify-center px-6 text-center'>
                <div className='mx-auto max-w-3xl text-white'>
                  <div className='mb-6 flex justify-center'></div>
                  {slide.id === 3 ? (
                    <img src={slide.title} alt="Slide Image" className="mx-auto mb-4 max-h-80" />
                  ) : (
                    <h2 className='mb-4 text-2xl font-bold'>{slide.title}</h2>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <div className='absolute right-0 bottom-8 left-0 z-30 flex justify-center'>
          <div className='flex space-x-2'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'scale-125 bg-white'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageSlide
