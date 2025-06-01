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

interface User {
  name: string
  avatar: string | null
  isVerified: boolean
}

interface PostCardProps {
  id: string
  user: User
  trustScore: number
  isDebunked?: boolean | false
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
  id,
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
  createdAt,
  onUpvote,
  onDownvote,
  onComment,
}: PostCardProps) => {
  const getTrustWarning = (score: number, isDebunked: boolean) => {
    if (isDebunked) {
      return {
        show: true,
        message: 'Content debunked - Will be removed soon',
        bgColor: 'bg-[#B22222]',
      }
    }
    if (score <= 20) {
      return {
        show: true,
        message: 'Very low trust rate - Be cautious!',
        bgColor: 'bg-[#B22222]',
      }
    }
    return { show: false }
  }

  const getTrustScoreColor = (score: number) => {
    if (score <= 20) return 'bg-[#B22222]'
    if (score <= 69) return 'bg-[#F6BD16]'
    return 'bg-[#09CD5F]'
  }

  const getDisasterIcon = (type: string) => {
    const iconClass = 'w-4 h-4 text-white bg-red'
    switch (type) {
      case 'earthquake':
        return <AlertTriangle className={iconClass} />
      case 'flood':
        return <Waves className='h-4 w-4 rounded'></Waves>
      case 'fire':
        return <Flame className={iconClass} />
      case 'storm':
        return <Tornado className={iconClass} />

      default:
        return <AlertTriangle className={iconClass} />
    }
  }

  const formatNumber = (num: number) => {
    if (num < 1000) return num.toString()
    if (num < 1000000) return (num / 1000).toFixed(1).replace('.0', '') + 'k'
    if (num < 1000000000)
      return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
    return (num / 1000000000).toFixed(1).replace('.0', '') + 'B'
  }

  const renderImages = () => {
    if (!images || images.length === 0) return null

    const displayImages = images.slice(0, 4)

    return (
      <div className='mt-1 grid grid-cols-4 gap-3'>
        {displayImages.map((image, index) => (
          <div key={index} className='relative'>
            <img
              src={image}
              alt={`Disaster image ${index + 1}`}
              className='h-34 w-full rounded-lg object-cover'
            />
          </div>
        ))}
      </div>
    )
  }

  const trustWarning = getTrustWarning(trustScore, isDebunked)

  return (
    <div className='mb-4 max-w-2xl bg-white'>
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
        {/* Header */}
        <div className='mb-2'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* Avatar */}
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

              {/* User Name and Badge */}
              <div className='flex items-center space-x-2'>
                <h3 className='text-[16px] font-medium text-gray-900'>
                  {user.name}
                </h3>
                {user.isVerified && (
                  <VerifyBadge className='h-4 w-4 text-[#1560BD]' />
                )}
              </div>
            </div>

            {/* Trust Score and Disaster Badge */}
            <div className='flex items-center space-x-3'>
              <div
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full px-2 py-1 text-xs font-medium text-white ${getTrustScoreColor(trustScore)}`}
              >
                {trustScore}%
              </div>
              {isDebunked && (
                <div className='flex h-7 items-center space-x-1 rounded-sm bg-[#B22222] px-2 py-1 text-xs font-medium text-white'>
                  <span>Debunked</span>
                </div>
              )}
              <div
                className={`flex h-7 items-center space-x-1 rounded-sm px-2 py-1 text-xs font-medium text-white ${isDebunked ? 'bg-[#33333430]' : 'bg-[#B22222]'}`}
              >
                {getDisasterIcon(disasterType)}
                <span className='capitalize'>{disasterType}</span>
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
          {renderImages()}
        </div>

        {/* Actions */}
        <div className='border-gray-100 pt-3'>
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
          <div className='mt-2 flex w-full items-center space-x-4 border-t pt-2'>
            {/* Upvote */}
            <button
              onClick={onUpvote}
              className={`flex min-h-0 items-center space-x-1 border-none bg-transparent p-0 ${upvotes > downvotes ? 'text-primary hover:text-primary/80' : 'text-[#33333430] hover:text-[3333430]/80'}`}
            >
              <CircleArrowUp className='h-6 w-6 stroke-1' />
            </button>

            {/* Downvote */}
            <button
              onClick={onDownvote}
              className={`flex items-center space-x-1 ${downvotes > upvotes ? 'text-[#B22222] hover:text-[#B22222]/80' : 'text-[#33333430] hover:text-[#33333430]/80'}`}
            >
              <CircleArrowDown className='h-6 w-6 stroke-1' />
            </button>

            {/* Comments */}
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
