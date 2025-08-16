import { PencilLine } from 'lucide-react'
import ImageSelectModal from './ImageSelectModal'
import React, { useState } from 'react'
import { generateDefaultProfileImage } from '@/helpers/helpers'
import { User } from '@/services/network/lib/user'

interface ImageSelectionProps {
  userProfile: User
  imageUrl?: string | null
  handleUpdateProfileImage: (file: File) => Promise<void>
}

export default function ImageSelection({
  userProfile,
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
    <>
      <div className='group relative h-60 w-60 rounded-lg border border-[#33333430] p-1'>
        {isUploading && (
          <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black'>
            <div className='text-white'>Uploading...</div>
          </div>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt='Profile'
            className='h-full w-full rounded-lg object-cover'
          />
        ) : (
          <div className='bg-primary flex h-full w-full items-center justify-center text-7xl text-white'>
            {generateDefaultProfileImage(userProfile?.firstName)}
          </div>
        )}

        <div className='absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
          <PencilLine
            onClick={handleEditClick}
            className='h-13 w-13 stroke-1 text-white'
          />
        </div>
      </div>
      <ImageSelectModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSave={handleOnSave}
      />
    </>
    // <div className='group relative h-60 w-60 overflow-hidden rounded-xl'>
    //   {isUploading && (
    //     <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black'>
    //       <div className='text-white'>Uploading...</div>
    //     </div>
    //   )}

    //   <img
    //     src={imageUrl ?? defaultProfile}
    //     alt='Profile'
    //     className='h-full w-full object-cover'
    //     onError={(e) => {
    //       ;(e.target as HTMLImageElement).src = defaultProfile
    //     }}
    //   />
    //   <div className='absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
    //     <PencilLine
    //       onClick={handleEditClick}
    //       className='h-13 w-13 stroke-1 text-white'
    //     />
    //   </div>
    //   <ImageSelectModal
    //     isOpen={isOpen}
    //     setIsOpen={setIsOpen}
    //     onSave={handleOnSave}
    //   />
    // </div>
  )
}
