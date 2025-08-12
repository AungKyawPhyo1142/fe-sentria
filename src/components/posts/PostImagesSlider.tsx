import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PostImageSlider = ({ images }: { images?: string[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return
    const scrollAmount = 200
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className='relative bg-white'>
      {/* Left Arrow */}
      {images.length > 4 && (
        <button
          onClick={() => scroll('left')}
          className='absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100'
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Scrollable Images */}
      <div
        ref={scrollRef}
        className='scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth'
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`image-${index}`}
            className='h-36 w-44 flex-shrink-0 rounded-md object-cover'
          />
        ))}
      </div>

      {/* Right Arrow */}
      {images.length > 4 && (
        <button
          onClick={() => scroll('right')}
          className='absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100'
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  )
}

export default PostImageSlider
