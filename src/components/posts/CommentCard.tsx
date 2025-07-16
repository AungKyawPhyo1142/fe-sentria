// components/CommentCard.tsx
import React from 'react'
import VerifyBadge from '@/assets/VerifiedBadge.svg?react'

// fake comt
export const fakeComments = [
  {
    name: 'Jennie Kim',
    avatar:
      'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
    isVerified: true,
    content: 'This is really helpful. Thanks for sharing!',
  },
  {
    name: 'Lisa',
    avatar:
      'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
    isVerified: true,
    content: 'I saw the same thing in my area. Be careful!',
  },
  {
    name: 'Rose',
    avatar:
      'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
    isVerified: false,
    content: 'Is this confirmed news?',
  },
  {
    name: 'Jisoo',
    avatar:
      'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg',
    isVerified: true,
    content: 'Stay safe, everyone!',
  },
  {
    name: 'Taehyung',
    avatar:
      'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-men-profile-sign-business-concept_157943-38867.jpg',
    isVerified: false,
    content: 'Thanks for the update. Hope things are better now.',
  },
]

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
