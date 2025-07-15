const PostImages = ({ images }: { images?: string[] }) => {
  if (!images || images.length === 0) return null

  const displayImages = images.slice(0, 4)

  const extraImageCount = images.length - displayImages.length

  return (
    <div className='mt-1 grid grid-cols-4 gap-3'>
      {displayImages.map((image, index) => (
        <div key={index} className='relative'>
          <img
            src={image}
            alt={`Disaster image ${index + 1}`}
            className='aspect-square w-full rounded-lg object-cover'
          />
          {index === displayImages.length - 1 && extraImageCount > 0 && (
            <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-500/30 text-lg font-semibold text-white hover:cursor-pointer'>
              +{extraImageCount}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PostImages
