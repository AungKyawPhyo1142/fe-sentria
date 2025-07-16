import {
  MapPinned,
  MessageSquare,
  CircleArrowUp,
  CircleArrowDown,
  AlertTriangle,
  Flame,
  Waves,
  Tornado,
  Dot,
  Ellipsis,
  EditIcon,
  Trash,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import VerifyBadge from '@/assets/VerifiedBadge.svg?react'

import { formatNumber } from '@/helpers/helpers'
import PostImages from './PostImages'
import TrustScoreBadge from './TrustScoreBadge'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
interface User {
  name: string
  avatar: string | null
  isVerified: boolean
}

interface PostCardProps {
  id: string
  user: User
  trustScore: number
  isDebunked: boolean
  location: string
  title: string
  content: string
  images?: string[]
  disasterType: 'earthquake' | 'flood' | 'fire' | 'storm' | 'other'
  upvotes?: number
  downvotes?: number
  comments?: number
  createdAt?: Date
  onUpvote?: () => void
  onDownvote?: () => void
  onComment?: () => void
  reporterId?: string
  loginUser?: string
}

const PostCard = ({
  user,
  trustScore,
  isDebunked = false,
  location,
  title,
  content,
  images,
  disasterType,
  upvotes = 0,
  downvotes = 0,
  comments = 0,
  createdAt,
  onUpvote,
  onDownvote,
  onComment,
  reporterId,
  loginUser,
}: PostCardProps) => {
  const { t } = useTranslation()
  const isOwner = String(reporterId) === String(loginUser)
  console.log('Owner / reporter', isOwner)
  console.log('reporterId: ', reporterId)
  console.log('loginUser: ', loginUser)
  console.log('reporterId type:', typeof reporterId)
  console.log('loginUser type:', typeof loginUser)

  const [showMenu, setShowMenu] = useState(false)
  const getTrustWarning = (score: number, isDebunked: boolean) => {
    if (isDebunked) {
      return {
        show: true,
        message: t('common.contentDebunked'),
        bgColor: 'bg-[#B22222]',
      }
    }
    if (score <= 20) {
      return {
        show: true,
        message: t('common.lowTrust'),
        bgColor: 'bg-[#B22222]',
      }
    }
    return { show: false }
  }

  const getDisasterIcon = (type: string) => {
    const iconClass = 'w-4 h-4 text-white'
    switch (type) {
      case 'earthquake':
        return <AlertTriangle className={iconClass} />
      case 'flood':
        return <Waves className={iconClass}></Waves>
      case 'fire':
        return <Flame className={iconClass} />
      case 'storm':
        return <Tornado className={iconClass} />

      default:
        return <AlertTriangle className={iconClass} />
    }
  }

  const trustWarning = getTrustWarning(trustScore, isDebunked)

  return (
    <div className='mb-4 max-w-full bg-white'>
      {/* bg-white */}
      {/* Trust Score Warning - Outside border */}
      {trustWarning.show && (
        <div
          className={`mb-0 ml-6 w-fit rounded-t-xl ${trustWarning.bgColor} px-4 py-1`}
        >
          <span className='text-[10px] font-medium text-white'>
            {trustWarning.message}
          </span>
        </div>
      )}
      <div className='rounded-lg border border-[#33333430] px-8 pt-7'>
        {/* header */}
        <div className='mb-2'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* avatar */}
              <div className='relative'>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className='h-10 w-10 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <span className='text-lg font-semibold text-blue-600'>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className='flex flex-col'>
                {/* username and Badge */}
                <div className='flex items-center space-x-2'>
                  <h3 className='text-[16px] font-medium text-black'>
                    {user.name}
                  </h3>
                  {user.isVerified && (
                    <VerifyBadge className='h-4 w-4 text-[#1560BD]' />
                  )}
                </div>
                {/* Created At */}
                <div className='text-xs font-light text-zinc-500'>
                  {createdAt
                    ? `${formatDistanceToNow(createdAt, { addSuffix: true })}`
                    : ''}
                </div>
              </div>
            </div>

            {/* Trust Score and Disaster Badge */}
            <div className='flex items-center space-x-3'>
              <TrustScoreBadge score={trustScore} />
              {isDebunked && (
                <div className='flex h-7 items-center space-x-1 rounded-sm bg-[#B22222] px-2 py-1 text-xs font-medium text-white'>
                  <span>{t('common.debunked')}</span>
                </div>
              )}
              <div
                className={`flex h-7 items-center space-x-1 rounded-sm px-2 py-1 text-xs font-medium text-white ${isDebunked ? 'bg-[#33333430]' : 'bg-[#B22222]'}`}
              >
                {getDisasterIcon(disasterType)}
                <span className='capitalize'>
                  {t(`disasters.${disasterType}`)}
                </span>
              </div>
            </div>
          </div>

          {/* location */}
          <div className='mt-2 flex items-center text-sm text-black'>
            <MapPinned className='mr-1 h-6 w-6 stroke-1' />
            <span className='ml-2 text-[16px] font-semibold'>{location}</span>
          </div>
          <div className='mt-2 text-[14px]'>{title}</div>
        </div>

        {/* Content */}
        <div className='mb-8'>
          <p className='mb-6 text-[12px] leading-relaxed font-extralight text-[#333334]'>
            {content && content.length > 300 ? (
              <>
                {content.slice(0, 300)}...
                <button
                  className='text-primary hover:text-primary/80 ml-1 text-[13px] font-medium'
                  onClick={() => {
                    // show post modal
                  }}
                >
                  Read More
                </button>
              </>
            ) : (
              content
            )}
          </p>
          <div className='flex items-center space-x-2 text-xs text-gray-500'>
            <PostImages images={images} />
          </div>
        </div>

        {/* actions */}
        <div className='pt-3'>
          <div className='flex items-center text-[9px] font-semibold text-[#33333430]'>
            {upvotes > downvotes ? (
              <span className='text-primary'>
                {formatNumber(upvotes)} upvotes
              </span>
            ) : (
              <span className='text-[#B22222]'>
                {formatNumber(downvotes)} downvotes
              </span>
            )}

            <Dot className='h-5 w-5 text-[#33333430]' />
            <span>{formatNumber(comments)} comments</span>
          </div>
          {/* up/dowwn/cmt -> menu */}
          <div className='my-2 flex items-center justify-between border-t border-[#33333430] pt-2'>
            {/* up/down/cmt */}
            <div className='flex w-full items-center space-x-4'>
              <button
                onClick={onUpvote}
                className={`flex min-h-0 items-center space-x-1 border-none bg-transparent p-0 ${upvotes > downvotes ? 'text-primary hover:text-primary/80' : 'text-[#33333430] hover:text-[3333430]/80'}`}
              >
                <CircleArrowUp className='h-6 w-6 stroke-1' />
              </button>

              <button
                onClick={onDownvote}
                className={`flex items-center space-x-1 ${downvotes > upvotes ? 'text-[#B22222] hover:text-[#B22222]/80' : 'text-[#33333430] hover:text-[#33333430]/80'}`}
              >
                <CircleArrowDown className='h-6 w-6 stroke-1' />
              </button>

              <button
                onClick={onComment}
                className='flex items-center space-x-1 text-[#33333430] hover:text-[#33333430]/80'
              >
                <MessageSquare className='h-6 w-6 stroke-1' />
              </button>
            </div>
            {/* menu */}
            {isOwner && (
              <div className='relative'>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className='text-[#33333430] focus-within:ring-0 hover:cursor-pointer hover:text-[#33333430]/80 focus:ring-0 focus:outline-none focus-visible:ring-0'
                >
                  <Ellipsis className='h-6 w-6 stroke-1' />
                </button>
                {showMenu && (
                  <div className='absolute -right-9 bottom-full z-50 mb-1 w-28 rounded-md border border-[#333334]/30 bg-white'>
                    <button
                      onClick={() => console.log('Edit Post')}
                      className='flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-xs text-[#333334]/80 hover:text-[#333334]/30 focus:ring-0 focus:outline-none focus-visible:ring-0'
                      disabled
                    >
                      <EditIcon className='h-4 w-4' /> Edit
                    </button>
                    <button
                      onClick={() => console.log('Delete Post')}
                      className='flex w-full items-center gap-2 px-4 py-2 text-xs text-[#B22222] hover:cursor-pointer hover:text-[#B22222]/80 focus:ring-0 focus:outline-none focus-visible:ring-0'
                    >
                      <Trash className='h-4 w-4' /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
