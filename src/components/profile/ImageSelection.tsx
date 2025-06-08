import { PencilLine } from 'lucide-react'
import ImageSelectModal from './ImageSelectModal'
import React from 'react'

export default function ImageSelection({ imageUrl }: { imageUrl?: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const handleEditClick = () => {
    setIsOpen(true)
  }
  return (
    <div className='group relative h-60 w-60 overflow-hidden rounded-xl'>
      <img
        src={imageUrl || 'https://via.placeholder.com/150'}
        alt='Profile'
        className='h-full w-full object-cover'
      />
      <div className='absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <PencilLine
          onClick={handleEditClick}
          className='h-13 w-13 stroke-1 text-white'
        />
      </div>
      <ImageSelectModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSave={() => {
          setIsOpen(false)
        }}
      />
    </div>
  )
}
