import VerifyBadge from '@/assets/VerifiedBadge.svg?react'
import {
  MapPinned,
  BriefcaseMedical,
  FlameKindling,
  PhoneCall,
} from 'lucide-react'
import PostImages from '../posts/PostImages'
import '../RichTextStyles.css'
import { formatDistanceToNow } from 'date-fns'
import FavoriteButton from '../common/FavoriteButton'

interface User {
  name: string
  avatar: string | null
  isVerified: boolean
}

interface ResourceCardProps {
  user: User
  resourceId: string
  location: string
  description: string
  images?: string[]
  resourceTypes: string[]
  createdAt?: Date
  onReadMore?: () => void
}

export const ResourceCardSkeleton = () => {
  return (
    <div className='rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 animate-pulse rounded-full bg-gray-100' />
          <div className='flex flex-col gap-1.5'>
            <div className='h-3.5 w-28 animate-pulse rounded-md bg-gray-100' />
            <div className='h-3 w-20 animate-pulse rounded-md bg-gray-100' />
          </div>
        </div>
        <div className='h-6 w-20 animate-pulse rounded-full bg-gray-100' />
      </div>

      {/* Location */}
      <div className='mt-4 h-3 w-36 animate-pulse rounded-md bg-gray-100' />

      {/* Body */}
      <div className='mt-3 space-y-2'>
        <div className='h-3 w-full animate-pulse rounded-md bg-gray-100' />
        <div className='h-3 w-full animate-pulse rounded-md bg-gray-100' />
        <div className='h-3 w-2/3 animate-pulse rounded-md bg-gray-100' />
      </div>

      {/* Images */}
      <div className='mt-4 grid grid-cols-4 gap-2'>
        <div className='aspect-square animate-pulse rounded-xl bg-gray-100' />
        <div className='aspect-square animate-pulse rounded-xl bg-gray-100' />
      </div>

      {/* Action row */}
      <div className='mt-5 flex items-center justify-end border-t border-gray-100 pt-4'>
        <div className='h-5 w-5 animate-pulse rounded bg-gray-100' />
      </div>
    </div>
  )
}

const RESOURCE_CONFIG: Record<
  string,
  { icon: React.ElementType; label: string }
> = {
  survival: { icon: FlameKindling, label: 'Survival' },
  hotline: { icon: PhoneCall, label: 'Hotline' },
  first_aid: { icon: BriefcaseMedical, label: 'First Aid' },
}

const ResourceCard = ({
  user,
  resourceId,
  location,
  description,
  resourceTypes,
  createdAt,
  images,
  onReadMore,
}: ResourceCardProps) => {
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  const plainText = stripHtml(description)
  const isTruncated = plainText.length > 200

  return (
    <article className='group rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]'>
      {/* Header: avatar + name + meta | resource type badge */}
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='h-10 w-10 rounded-full object-cover ring-1 ring-gray-100'
            />
          ) : (
            <div className='bg-primary/8 ring-primary/10 flex h-10 w-10 items-center justify-center rounded-full ring-1'>
              <span className='text-primary text-sm font-semibold'>
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <div className='flex items-center gap-1.5'>
              <span className='text-[14px] font-semibold text-gray-800'>
                {user.name}
              </span>
              {user.isVerified && (
                <VerifyBadge className='text-info h-3.5 w-3.5' />
              )}
            </div>
            <span className='text-[12px] text-gray-400'>
              {createdAt
                ? formatDistanceToNow(createdAt, { addSuffix: true })
                : ''}
            </span>
          </div>
        </div>

        {/* Resource type badges */}
        <div className='flex items-center gap-1.5'>
          {resourceTypes.map((type) => {
            const config = RESOURCE_CONFIG[type.toLowerCase()]
            if (!config) return null
            const Icon = config.icon
            return (
              <span
                key={type}
                className='flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500'
              >
                <Icon className='h-3 w-3' />
                <span>{config.label}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Location */}
      {location && (
        <div className='mt-3.5 flex items-center gap-1.5'>
          <MapPinned className='h-3.5 w-3.5 text-gray-400' strokeWidth={2} />
          <span className='text-[12px] font-medium text-gray-500'>
            {location}
          </span>
        </div>
      )}

      {/* Content */}
      <div className='mt-2'>
        {isTruncated ? (
          <>
            <p className='text-[13px] leading-relaxed text-gray-500'>
              {plainText.slice(0, 200)}...
              <button
                className='text-primary hover:text-primary-dark ml-1 font-medium'
                onClick={onReadMore}
              >
                Read more
              </button>
            </p>
          </>
        ) : description ? (
          <div
            className='rich-text-content text-[13px] leading-relaxed text-gray-500'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
      </div>

      {/* Images */}
      {images && images.length > 0 && (
        <div className='mt-4'>
          <PostImages images={images} />
        </div>
      )}

      {/* Action row */}
      <div className='mt-5 flex items-center justify-end border-t border-gray-100 pt-4'>
        <FavoriteButton postId={resourceId} postType='RESOURCE' />
      </div>
    </article>
  )
}

export default ResourceCard
