import { AnimatePresence, motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactDOM from 'react-dom'
import { User } from './PostCard'
import { useTranslation } from 'react-i18next'
import {
  MessageSquare,
  CircleArrowUp,
  CircleArrowDown,
  AlertTriangle,
  Flame,
  Waves,
  Tornado,
  Ellipsis,
  EditIcon,
  Trash,
  MapPin,
  ChevronDown,
  ShieldAlert,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import TrustScoreBadge from './TrustScoreBadge'
import VerifyBadge from '@/assets/VerifiedBadge.svg?react'
import { formatNumber } from '@/helpers/helpers'
import CommentCard from './CommentCard'
import CommentInputBox from './CommentInputBox'
import { fakeComments } from './constants/fakeComments'
import { backdropVariants, modalVariants } from './constants/constants'
import {
  Map as MapView,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapControls,
} from '@/components/ui/map'

interface reportDetailProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  _id: string
  user: User
  trustScore: number
  isDebunked: boolean
  location: string
  coords: { lat: number; lng: number }
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

const DISASTER_CONFIG: Record<
  string,
  { icon: React.ElementType; label: string }
> = {
  earthquake: { icon: AlertTriangle, label: 'Earthquake' },
  flood: { icon: Waves, label: 'Flood' },
  fire: { icon: Flame, label: 'Fire' },
  storm: { icon: Tornado, label: 'Storm' },
  other: { icon: AlertTriangle, label: 'Other' },
}

const ReportDetailModal: React.FC<reportDetailProps> = ({
  className,
  isOpen,
  setIsOpen,
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
  coords,
}) => {
  const { t } = useTranslation()
  const [showMenu, setShowMenu] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const isOwner = String(reporterId) === String(loginUser)
  const hasImages = images && images.length > 0
  const normalizedType = disasterType.toLowerCase()
  const disaster = DISASTER_CONFIG[normalizedType] ?? DISASTER_CONFIG.other
  const DisasterIcon = disaster.icon

  const trustWarningVisible = isDebunked || trustScore <= 20
  const trustWarningMessage = isDebunked
    ? t('common.contentDebunked')
    : t('common.lowTrust')

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px]',
            className,
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className='shadow-elevated relative flex max-h-[92vh] w-[680px] flex-col overflow-hidden rounded-2xl bg-white'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Hero Image Area ── */}
            {hasImages && (
              <div className='relative h-72 w-full shrink-0 overflow-hidden bg-gray-100'>
                <motion.img
                  key={heroIndex}
                  src={images[heroIndex]}
                  alt={`Report image ${heroIndex + 1}`}
                  className='h-full w-full object-cover'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Gradient overlay for readability */}
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20' />

                {/* Image counter */}
                {images.length > 1 && (
                  <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5'>
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroIndex(i)}
                        className={clsx(
                          'h-1.5 rounded-full transition-all duration-200',
                          i === heroIndex
                            ? 'w-5 bg-white'
                            : 'w-1.5 bg-white/50 hover:bg-white/70',
                        )}
                      />
                    ))}
                  </div>
                )}

                {/* Prev / Next */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setHeroIndex(
                          (prev) => (prev - 1 + images.length) % images.length,
                        )
                      }
                      className='absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50'
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() =>
                        setHeroIndex((prev) => (prev + 1) % images.length)
                      }
                      className='absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50'
                    >
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </>
                )}

                {/* Disaster badge — overlaid on image */}
                <div className='bg-danger/90 absolute top-3 left-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-white backdrop-blur-sm'>
                  <DisasterIcon className='h-3.5 w-3.5' />
                  <span className='text-xs font-semibold capitalize'>
                    {t(`disasters.${normalizedType}` as never)}
                  </span>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className={clsx(
                'absolute top-3 right-3 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors',
                hasImages
                  ? 'bg-black/30 text-white hover:bg-black/50'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
              )}
            >
              <X className='h-4 w-4' strokeWidth={2.5} />
            </button>

            {/* ── Scrollable Content ── */}
            <div
              ref={scrollAreaRef}
              className='custom-scroll flex-1 overflow-y-auto'
            >
              <div className='px-7 pt-5 pb-3'>
                {/* Trust warning banner */}
                {trustWarningVisible && (
                  <div className='bg-danger-light mb-4 flex items-center gap-2 rounded-lg px-3.5 py-2.5'>
                    <ShieldAlert className='text-danger h-4 w-4 shrink-0' />
                    <span className='text-danger text-xs font-medium'>
                      {trustWarningMessage}
                    </span>
                  </div>
                )}

                {/* Disaster badge when no images */}
                {!hasImages && (
                  <div className='bg-danger/10 mb-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1'>
                    <DisasterIcon className='text-danger h-3.5 w-3.5' />
                    <span className='text-danger text-xs font-semibold capitalize'>
                      {t(`disasters.${normalizedType}` as never)}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h2 className='text-xl leading-snug font-semibold tracking-tight text-gray-900'>
                  {title}
                </h2>

                {/* User info row */}
                <div className='mt-3 flex items-center justify-between'>
                  <div className='flex items-center gap-2.5'>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='h-8 w-8 rounded-full object-cover'
                      />
                    ) : (
                      <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                        <span className='text-primary text-sm font-semibold'>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-1.5'>
                        <span className='text-sm font-medium text-gray-900'>
                          {user.name}
                        </span>
                        {user.isVerified && (
                          <VerifyBadge className='text-info h-3.5 w-3.5' />
                        )}
                      </div>
                      <span className='text-xs text-gray-400'>
                        {createdAt
                          ? formatDistanceToNow(createdAt, { addSuffix: true })
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <TrustScoreBadge score={trustScore} />
                    {isDebunked && (
                      <span className='bg-danger rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase'>
                        {t('common.debunked')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className='my-4 border-t border-gray-100' />

                {/* Content */}
                <p className='text-sm leading-relaxed text-gray-600'>
                  {content}
                </p>

                {/* Image thumbnails (for multi-image navigation) */}
                {hasImages && images.length > 1 && (
                  <div className='mt-4 flex gap-2'>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setHeroIndex(i)
                          scrollAreaRef.current?.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                          })
                        }}
                        className={clsx(
                          'h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                          i === heroIndex
                            ? 'border-primary ring-primary/20 ring-2'
                            : 'border-transparent opacity-60 hover:opacity-100',
                        )}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${i + 1}`}
                          className='h-full w-full object-cover'
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Location Map Card ── */}
                <div className='mt-5'>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className='flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50'
                  >
                    <div className='flex items-center gap-2.5'>
                      <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
                        <MapPin className='text-primary h-4 w-4' />
                      </div>
                      <div className='text-left'>
                        <p className='text-sm font-medium text-gray-900'>
                          {location}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={clsx(
                        'h-4 w-4 text-gray-400 transition-transform duration-200',
                        showMap && 'rotate-180',
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {showMap && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className='overflow-hidden'
                      >
                        <div className='mt-2 h-48 w-full overflow-hidden rounded-xl border border-gray-200'>
                          <MapView
                            center={[
                              coords.lng ?? 108.2022,
                              coords.lat ?? 16.0544,
                            ]}
                            zoom={13}
                            scrollZoom={false}
                          >
                            <MapControls
                              position='bottom-right'
                              showZoom
                              showLocate={false}
                            />
                            <MapMarker
                              longitude={coords.lng ?? 108.2022}
                              latitude={coords.lat ?? 16.0544}
                            >
                              <MarkerContent>
                                <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 shadow-lg'>
                                  <div className='h-2 w-2 rounded-full bg-white' />
                                </div>
                              </MarkerContent>
                              <MarkerTooltip>Reported location</MarkerTooltip>
                            </MapMarker>
                          </MapView>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ── Action Bar ── */}
                <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-3'>
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={onUpvote}
                      className={clsx(
                        'flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                        upvotes > downvotes
                          ? 'text-primary hover:bg-primary/5'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600',
                      )}
                    >
                      <CircleArrowUp
                        className='h-[18px] w-[18px]'
                        strokeWidth={1.5}
                      />
                      {upvotes > 0 && (
                        <span className='text-xs font-medium'>
                          {formatNumber(upvotes)}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={onDownvote}
                      className={clsx(
                        'flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                        downvotes > upvotes
                          ? 'text-danger hover:bg-danger/5'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600',
                      )}
                    >
                      <CircleArrowDown
                        className='h-[18px] w-[18px]'
                        strokeWidth={1.5}
                      />
                      {downvotes > 0 && (
                        <span className='text-xs font-medium'>
                          {formatNumber(downvotes)}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={onComment}
                      className='flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600'
                    >
                      <MessageSquare
                        className='h-[18px] w-[18px]'
                        strokeWidth={1.5}
                      />
                      {comments > 0 && (
                        <span className='text-xs font-medium'>
                          {formatNumber(comments)}
                        </span>
                      )}
                    </button>
                  </div>

                  {isOwner && (
                    <div className='relative'>
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600'
                      >
                        <Ellipsis className='h-4 w-4' />
                      </button>
                      {showMenu && (
                        <div className='shadow-card-hover absolute right-0 bottom-full z-[100] mb-1 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white'>
                          <button
                            onClick={() => console.log('Edit Post')}
                            className='flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-50'
                            disabled
                          >
                            <EditIcon className='h-3.5 w-3.5' /> Edit
                          </button>
                          <button
                            onClick={() => console.log('Delete Post')}
                            className='text-danger hover:bg-danger-light flex w-full cursor-pointer items-center gap-2.5 px-3.5 py-2.5 text-xs transition-colors'
                          >
                            <Trash className='h-3.5 w-3.5' /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Comments ── */}
                <div className='mt-4 border-t border-gray-100 pt-4'>
                  <p className='mb-3 text-xs font-medium tracking-wider text-gray-400 uppercase'>
                    Comments ({fakeComments.length})
                  </p>
                  <div className='flex flex-col gap-1'>
                    {fakeComments.map((cmt, index) => (
                      <CommentCard
                        key={index}
                        name={cmt.name}
                        avatar={cmt.avatar}
                        isVerified={cmt.isVerified}
                        content={cmt.content}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Comment Input (sticky bottom) ── */}
            <CommentInputBox VerifyBadge={VerifyBadge} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
export default ReportDetailModal
