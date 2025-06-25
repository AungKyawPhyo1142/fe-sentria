import VerifyBadge from '@/assets/VerifiedBadge.svg?react'
import { MapPinned } from 'lucide-react'
import Survival from '@/assets/icons/Survival.svg?react'
import Hotline from '@/assets/icons/Hotline.svg?react'
import FirstAid from '@/assets/icons/FirstAid.svg?react'
import PostImages from '../posts/PostImages'
import '../RichTextStyles.css'

interface User {
  name: string
  avatar: string | null
  isVerified: boolean
}

interface ResourceCardProps {
  user: User
  location: string
  description: string
  images?: string[]
  resourceTypes: string[]
  createdAt?: Date
  onReadMore?: () => void // open full post modal
}

const ResourceCard = ({
  user,
  location,
  description,
  resourceTypes,
  images,
  onReadMore,
}: ResourceCardProps) => {
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  const getPreviewHtml = (html: string, maxLength: number) => {
    const stripped = stripHtml(html)
    if (stripped.length <= maxLength) return html

    const ratio = html.length / stripped.length
    const estimatedPosition = Math.floor(maxLength * ratio)

    const closeTagPos = html.indexOf('>', estimatedPosition)
    return closeTagPos !== -1
      ? html.substring(0, closeTagPos + 1) + '...'
      : html.substring(0, estimatedPosition) + '...'
  }

  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'survival':
        return <Survival className='h-4 w-4' />
      case 'hotline':
        return <Hotline className='h-4 w-4' />
      case 'first_aid':
        return <FirstAid className='h-4 w-4' />
      default:
        return null
    }
  }

  return (
    <div className='mx-6 flex w-full flex-col space-y-10 rounded-lg border border-[#33333430] px-8 py-7'>
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

            <div>
              <div className='flex items-center space-x-2'>
                <h3 className='text-[16px] font-medium text-black'>
                  {user.name}
                </h3>
                {user.isVerified && (
                  <VerifyBadge
                    className='h-4 w-4 text-[#1560BD]'
                    aria-label='Verified user'
                  />
                )}
              </div>
            </div>
          </div>
          {/* resources */}
          <div className='flex items-center space-x-2'>
            {resourceTypes.length > 0 &&
              resourceTypes.map((resource) => (
                <div
                  key={resource}
                  className='bg-secondary flex h-8 w-8 items-center justify-center rounded px-2 py-1 text-xs font-medium text-black'
                  aria-label={`Resource: ${resource}`}
                >
                  {getResourceIcon(resource)}
                </div>
              ))}
          </div>
        </div>

        {/* location */}
        {location && (
          <div className='mt-2 flex items-center text-sm text-black'>
            <MapPinned className='mr-1 h-6 w-6 stroke-1' aria-hidden='true' />
            <span className='ml-2 text-[16px] font-semibold'>{location}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='mb-2'>
        {description && stripHtml(description).length > 300 ? (
          <div className='rich-text-content'>
            <div
              className='mb-3 text-[12px] leading-relaxed font-extralight text-[#333334]'
              dangerouslySetInnerHTML={{
                __html: getPreviewHtml(description, 300),
              }}
            />
            <button
              className='text-primary hover:text-primary/80 ml-1 text-[13px] font-medium'
              onClick={onReadMore}
              aria-label='Read more about this resource'
            >
              Read More
            </button>
          </div>
        ) : (
          <div
            className='rich-text-content mb-3 text-[12px] leading-relaxed font-extralight text-[#333334]'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

      {/* Images */}
      <div className='flex items-center space-x-2 text-xs'>
        {images && images.length > 0 && <PostImages images={images} />}
      </div>
    </div>
  )
}

export default ResourceCard
