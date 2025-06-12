import { PencilLine } from 'lucide-react'
import ImageSelectModal from './ImageSelectModal'

import defaultProfile from '@/assets/defaultProfile.png'
import React, { useState } from 'react'

interface ImageSelectionProps {
  imageUrl?: string | null
  handleUpdateProfileImage: (file: File) => Promise<void>
}

export default function ImageSelection({
  imageUrl,
  handleUpdateProfileImage,
}: ImageSelectionProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleEditClick = () => {
    setIsOpen(true)
  }

  const handleOnSave = async (file: File | null) => {
    if (file) {
      setIsUploading(true)
      await handleUpdateProfileImage(file)
      setIsUploading(false)
    }
    setIsOpen(false)
  }

  return (
    <div className='group relative h-60 w-60 overflow-hidden rounded-xl'>
      {isUploading && (
        <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black'>
          <div className='text-white'>Uploading...</div>
        </div>
      )}

      <img
        src={imageUrl ?? defaultProfile}
        alt='Profile'
        className='h-full w-full object-cover'
        onError={(e) => {
          ;(e.target as HTMLImageElement).src = defaultProfile
        }}
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
        onSave={handleOnSave}
      />
    </div>
  )
}
