// components/CommentInputBox.tsx
import { Image, Send, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { useUserProfile } from '@/services/network/lib/user'

interface CommentInputBoxProps {
  VerifyBadge: React.FC<React.SVGProps<SVGSVGElement>>
}

const CommentInputBox: React.FC<CommentInputBoxProps> = ({ VerifyBadge }) => {
  const { userId } = useAuthStore(selectAuth)
  const { data: userProfile, isLoading, error } = useUserProfile(userId)

  const [comment, setComment] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSend = () => {
    console.log('Comment:', comment)
    console.log('Image:', imagePreview)
    setComment('')
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (isLoading) return <p>Loading user...</p>
  if (error || !userProfile) return <p>Failed to load user.</p>

  const fullName = `${userProfile.firstName} ${userProfile.lastName}`
  const isVerified = userProfile.verified_profile
  const avatar = userProfile.profile_image

  return (
    <div className='sticky bottom-0 z-[999] rounded-lg rounded-t-[10px] bg-[#bbbbc5] px-8 py-5'>
      {/* user comment */}
      <div className='flex items-center space-x-3'>
        <div className='relative'>
          {avatar ? (
            <img
              src={avatar}
              alt={fullName}
              className='h-10 w-10 rounded-full object-cover'
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
              <span className='text-lg font-semibold text-blue-600'>
                {fullName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          <h3 className='text-[16px] font-medium text-black'>{fullName}</h3>
          {isVerified && <VerifyBadge className='h-4 w-4 text-[#1560BD]' />}
        </div>
      </div>

      {/* input box */}
      <div className='mt-3 flex w-full justify-between rounded-full bg-white py-2 shadow-2xs'>
        <input
          type='text'
          placeholder='Comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='w-full border-none px-3 text-sm outline-none focus:ring-0 focus:outline-none'
        />

        <div className='flex space-x-2 px-3 text-[#333334]/30'>
          <Image onClick={handleImageClick} className='cursor-pointer' />
          <Send onClick={handleSend} className='cursor-pointer' />
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          className='hidden'
        />
      </div>

      {/* Preview selected image */}
      {imagePreview && (
        <div className='relative mt-2 h-24 w-24 rounded-md bg-[#e0e0e0]'>
          <img
            src={imagePreview}
            alt='preview'
            className='h-full w-full rounded-md object-cover'
          />
          <button
            onClick={handleRemoveImage}
            className='absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white hover:cursor-pointer'
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default CommentInputBox
