// components/CommentInputBox.tsx
import { Image, Send, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { useUserProfile } from '@/services/network/lib/user'

interface CommentInputBoxProps {
  VerifyBadge?: React.FC<React.SVGProps<SVGSVGElement>>
}

const CommentInputBox: React.FC<CommentInputBoxProps> = () => {
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
  const avatar = userProfile.profile_image

  return (
    <div className='shrink-0 border-t border-gray-100 bg-white px-7 py-4'>
      {/* Image preview */}
      {imagePreview && (
        <div className='relative mb-3 inline-block'>
          <img
            src={imagePreview}
            alt='preview'
            className='h-16 w-16 rounded-lg object-cover'
          />
          <button
            onClick={handleRemoveImage}
            className='absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-700'
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className='flex items-center gap-2.5'>
        {avatar ? (
          <img
            src={avatar}
            alt={fullName}
            className='h-8 w-8 shrink-0 rounded-full object-cover'
          />
        ) : (
          <div className='bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full'>
            <span className='text-primary text-sm font-semibold'>
              {fullName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className='focus-within:border-primary/30 flex min-w-0 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 py-2 pr-2 pl-4 transition-colors focus-within:bg-white'>
          <input
            type='text'
            placeholder='Write a comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400'
          />
          <div className='flex shrink-0 items-center gap-1'>
            <button
              type='button'
              onClick={handleImageClick}
              className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
            >
              <Image className='h-4 w-4' />
            </button>
            <button
              type='button'
              onClick={handleSend}
              className='text-primary hover:bg-primary/10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors'
            >
              <Send className='h-4 w-4' />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          className='hidden'
        />
      </div>
    </div>
  )
}

export default CommentInputBox
