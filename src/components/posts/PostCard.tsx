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
} from 'lucide-react'

import VerifyBadge from '@/assets/VerifiedBadge.svg?react'

import { formatNumber } from '@/helpers/helpers'
import PostImages from './PostImages'
import TrustScoreBadge from './TrustScoreBadge'
import { useTranslation } from 'react-i18next'
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
}

const PostCard = ({
  user,
  trustScore,
  isDebunked = false,
  location,
  content,
  images,
  disasterType,
  upvotes = 0,
  downvotes = 0,
  comments = 0,
  onUpvote,
  onDownvote,
  onComment,
}: PostCardProps) => {
  const { t } = useTranslation()
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
      <div className='rounded-lg border border-[#33333430] px-8 py-7'>
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
                    className='h-9 w-9 rounded-full object-cover'
                  />
                ) : (
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-blue-100'>
                    <span className='text-lg font-semibold text-blue-600'>
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* username and Badge */}
              <div className='flex items-center space-x-2'>
                <h3 className='text-[16px] font-medium text-black'>
                  {user.name}
                </h3>
                {user.isVerified && (
                  <VerifyBadge className='h-4 w-4 text-[#1560BD]' />
                )}
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
          <div className='flex items-center space-x-2 text-xs text-gray-500'></div>
          <PostImages images={images} />
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
          <div className='mt-2 flex w-full items-center space-x-4 border-t border-[#33333430] pt-2'>
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
        </div>
      </div>
    </div>
  )
}

export default PostCard
