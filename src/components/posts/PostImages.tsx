const PostImages = ({ images }: { images?: string[] }) => {
  if (!images || images.length === 0) return null

  const displayImages = images.slice(0, 4)
  return (
    <div className='mt-1 grid grid-cols-4 gap-3'>
      {displayImages.map((image, index) => (
        <div key={index} className='relative'>
          <img
            src={image}
            alt={`Disaster image ${index + 1}`}
            className='aspect-square w-full rounded-lg object-cover'
          />
        </div>
      ))}
    </div>
  )
}

export default PostImages
