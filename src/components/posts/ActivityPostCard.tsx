import VerifyBadge from '@/assets/VerifiedBadge.svg?react'
import { MapPinned } from 'lucide-react'
import OfferHand3 from '@/assets/icons/OfferHand3.svg?react'
import OfferHelp from '@/assets/icons/OfferHelp.svg?react'
import Water from '@/assets/icons/Water.svg?react'
import Food from '@/assets/icons/Food.svg?react'
import Shelter from '@/assets/icons/Shelter.svg?react'
import { formatDistanceToNow } from 'date-fns'

interface User {
  name: string
  avatar: string | null
  isVerified: boolean
}

interface ActivityPostCardProps {
  user: User
  location: string
  content: string
  helpType: 'Offering Help' | 'Need Help'
  offeredHelp: string[]
  createdAt?: Date
  onReadMore?: () => void // to open full post content
}

const ActivityPostCard = ({
  user,
  location,
  content,
  helpType,
  offeredHelp,
  createdAt,
  onReadMore,
}: ActivityPostCardProps) => {
  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'water':
        return <Water className='h-4 w-4' />
      case 'food':
        return <Food className='h-4 w-4' />
      case 'shelter':
        return <Shelter className='h-4 w-4' />
      default:
        return null
    }
  }

  // Render resource type badge based on type
  const renderhelpTypeBadge = () => {
    const isOffering = helpType.toLowerCase() === 'offering help'
    return (
      <div
        className={`${
          isOffering ? 'bg-secondary' : 'bg-red'
        } flex h-7 items-center justify-center space-x-1 rounded-sm px-2 py-1 text-[10px] font-extralight text-white`}
      >
        {isOffering ? (
          <OfferHelp className='h-5 w-5 text-white' />
        ) : (
          <OfferHand3 className='h-5 w-5 text-white' />
        )}
        <span>{helpType}</span>
      </div>
    )
  }

  return (
    <div className='mx-6 rounded-lg border border-[#33333430] px-8 py-7'>
      {/* header */}
      <div className='mb-2'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* avatar */}
            <div className='relative'>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name}'s profile`}
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

            <div className='flex flex-col'>
              <div className='flex items-center space-x-2'>
                <h3 className='text-[16px] font-medium text-black'>
                  {user.name}
                </h3>
                {user.isVerified && (
                  <VerifyBadge className='h-4 w-4 text-[#1560BD]' />
                )}
              </div>

              <div className='text-xs font-light text-zinc-500'>
                {createdAt
                  ? `${formatDistanceToNow(createdAt, { addSuffix: true })}`
                  : ''}
              </div>
            </div>
          </div>
          {renderhelpTypeBadge()}
        </div>

        {/* location */}
        <div className='mt-2 flex items-center text-sm text-black'>
          <MapPinned className='mr-1 h-6 w-6 stroke-1' />
          <span className='ml-2 text-[16px] font-semibold'>{location}</span>
        </div>
      </div>

      {/* Content */}
      <div className='mb-2'>
        <p className='mb-6 text-[12px] leading-relaxed font-extralight text-[#333334]'>
          {content && content.length > 300 ? (
            <>
              {content.slice(0, 300)}...
              <button
                className='text-primary hover:text-primary/80 ml-1 text-[13px] font-medium'
                onClick={onReadMore}
              >
                Read More
              </button>
            </>
          ) : (
            content
          )}
        </p>
      </div>

      {/* helps */}
      <div className='flex items-center space-x-2'>
        {offeredHelp.length > 0 ? (
          offeredHelp.map((help) => (
            <div
              key={help}
              className={`${
                helpType === 'Offering Help' ? 'bg-secondary/70' : 'bg-red'
              } flex h-8 w-8 items-center justify-center rounded px-2 py-1 text-xs font-medium text-black`}
            >
              {getResourceIcon(help)}
            </div>
          ))
        ) : (
          <p className='text-xs text-gray-400'>No specific helps listed</p>
        )}
      </div>
    </div>
  )
}

export default ActivityPostCard
