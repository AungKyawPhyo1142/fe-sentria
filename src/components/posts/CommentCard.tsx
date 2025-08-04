// components/CommentCard.tsx
import React from 'react'
import VerifyBadge from '@/assets/VerifiedBadge.svg?react'

// fake comt

interface CommentCardProps {
  name: string
  avatar?: string
  isVerified?: boolean
  content: string
}

const CommentCard: React.FC<CommentCardProps> = ({
  name,
  avatar,
  isVerified,
  content,
}) => {
  return (
    <div className='mb-4 flex items-start space-x-3'>
      {/* Avatar */}
      <div className='relative'>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className='h-10 w-10 rounded-full object-cover'
          />
        ) : (
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
            <span className='text-lg font-semibold text-blue-600'>
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Comment content */}
      <div className='rounded-md bg-[#333334]/9 px-3 py-2'>
        <div className='flex items-center space-x-2'>
          <h3 className='text-[16px] font-medium text-black'>{name}</h3>
          {isVerified && <VerifyBadge className='h-4 w-4 text-[#1560BD]' />}
        </div>
        <div className='text-[15px] font-light'>{content}</div>
      </div>
    </div>
  )
}

export default CommentCard
