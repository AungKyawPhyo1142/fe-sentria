import {
  MapPinned,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Flame,
  Waves,
  Tornado,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import VerifyBadge from '@/assets/VerifiedBadge.svg?react'

import { formatNumber } from '@/helpers/helpers'
import PostImages from './PostImages'
import TrustScoreBadge from './TrustScoreBadge'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import ReportDetailModal from './ReportDetailModal'
import { useGetDisasterReportDetail } from '@/services/network/lib/disasterReport'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import DeleteReportModal from './DeleteReportModal'
import EditReportModal from './EditReportModal'
import DropdownMenu from '../common/DropdownMenu'
import LogoLoader from '../common/LogoLoader'

export const PostCardSkeleton = () => {
  return (
    <div className='rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]'>
      {/* Trust accent bar */}
      <div className='mb-5 h-1 w-16 animate-pulse rounded-full bg-gray-100' />

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 animate-pulse rounded-full bg-gray-100' />
          <div className='flex flex-col gap-1.5'>
            <div className='h-3.5 w-28 animate-pulse rounded-md bg-gray-100' />
            <div className='h-3 w-20 animate-pulse rounded-md bg-gray-100' />
          </div>
        </div>
        <div className='h-8 w-8 animate-pulse rounded-full bg-gray-100' />
      </div>

      {/* Location + Title */}
      <div className='mt-4 h-3 w-36 animate-pulse rounded-md bg-gray-100' />
      <div className='mt-2 h-4 w-3/4 animate-pulse rounded-md bg-gray-100' />

      {/* Body */}
      <div className='mt-4 space-y-2'>
        <div className='h-3 w-full animate-pulse rounded-md bg-gray-100' />
        <div className='h-3 w-full animate-pulse rounded-md bg-gray-100' />
        <div className='h-3 w-2/3 animate-pulse rounded-md bg-gray-100' />
      </div>

      {/* Images */}
      <div className='mt-5 grid grid-cols-4 gap-2'>
        <div className='aspect-square animate-pulse rounded-xl bg-gray-100' />
        <div className='aspect-square animate-pulse rounded-xl bg-gray-100' />
        <div className='aspect-square animate-pulse rounded-xl bg-gray-100' />
      </div>

      {/* Action row */}
      <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-4'>
        <div className='flex items-center gap-5'>
          <div className='h-5 w-14 animate-pulse rounded-md bg-gray-100' />
          <div className='h-5 w-14 animate-pulse rounded-md bg-gray-100' />
          <div className='h-5 w-14 animate-pulse rounded-md bg-gray-100' />
        </div>
        <div className='h-6 w-24 animate-pulse rounded-full bg-gray-100' />
      </div>
    </div>
  )
}

export interface User {
  name: string
  avatar: string | null
  isVerified: boolean
}
type DisasterType = 'earthquake' | 'flood' | 'fire' | 'storm' | 'other'

export interface PostCardProps {
  id: string
  user: User
  trustScore: number
  isDebunked: boolean
  location: string
  title: string
  content: string
  images?: string[]
  disasterType: string
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
  id,
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
  const { userId } = useAuthStore(selectAuth)
  const isOwner = String(reporterId) === String(loginUser)

  const [showDetail, setShowDetail] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const getDisasterIcon = (type: string) => {
    const iconClass = 'h-3 w-3'
    switch (type) {
      case 'earthquake':
        return <AlertTriangle className={iconClass} />
      case 'flood':
        return <Waves className={iconClass} />
      case 'fire':
        return <Flame className={iconClass} />
      case 'storm':
        return <Tornado className={iconClass} />
      default:
        return <AlertTriangle className={iconClass} />
    }
  }

  // Trust accent bar color
  const getTrustAccentColor = () => {
    if (isDebunked) return 'bg-danger'
    if (trustScore <= 20) return 'bg-warning'
    if (trustScore <= 50) return 'bg-warning/60'
    return 'bg-primary'
  }

  // data fetch
  const { data, isLoading, isError } = useGetDisasterReportDetail(id)
  if (isLoading) return <LogoLoader />
  if (isError) return <p>Error fetching detail</p>

  const reportDetail = data?.data?.report?.data
  const imgUrl =
    reportDetail?.media
      ?.filter(
        (m) =>
          typeof m?.type === 'string' &&
          m.type.toLowerCase() === 'image' &&
          typeof m.url === 'string' &&
          m.url.trim() !== '',
      )
      .map((m) => m.url) ?? []

  const handleDelete = () => {
    setIsDelete(true)
  }
  const handleEdit = () => {
    setIsEdit(true)
  }

  return (
    <article
      className={`group rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] ${
        isDebunked ? 'opacity-75' : ''
      }`}
    >
      {/* Trust accent bar */}
      <div className='mb-5 flex items-center gap-3'>
        <div className={`h-1 w-12 rounded-full ${getTrustAccentColor()}`} />
        {isDebunked && (
          <span className='text-danger text-[11px] font-semibold tracking-wider uppercase'>
            {t('common.debunked')}
          </span>
        )}
        {!isDebunked && trustScore <= 20 && (
          <span className='text-warning text-[11px] font-semibold tracking-wider uppercase'>
            {t('common.lowTrust')}
          </span>
        )}
      </div>

      <div onClick={() => setShowDetail(true)} className='cursor-pointer'>
        {/* Header: avatar + name + meta | trust score */}
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

          <TrustScoreBadge score={trustScore} />
        </div>

        {/* Location */}
        <div className='mt-3.5 flex items-center gap-1.5'>
          <MapPinned className='h-3.5 w-3.5 text-gray-400' strokeWidth={2} />
          <span className='text-[12px] font-medium text-gray-500'>
            {location}
          </span>
        </div>

        {/* Title */}
        <h3 className='mt-1.5 text-[15px] leading-snug font-semibold text-gray-900'>
          {title}
        </h3>

        {/* Body */}
        <p className='mt-2 text-[13px] leading-relaxed text-gray-500'>
          {content && content.length > 200 ? (
            <>
              {content.slice(0, 200)}...
              <button
                className='text-primary hover:text-primary-dark ml-1 font-medium'
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDetail(true)
                }}
              >
                Read more
              </button>
            </>
          ) : (
            content
          )}
        </p>

        {/* Images */}
        {images && images.length > 0 && (
          <div className='mt-4'>
            <PostImages images={images} />
          </div>
        )}
      </div>

      {/* Detail modal */}
      {showDetail && (
        <ReportDetailModal
          _id={id}
          isOpen={showDetail}
          setIsOpen={setShowDetail}
          user={{
            name: `${reportDetail?.generatedBy.firstName} ${reportDetail?.generatedBy.lastName}`,
            avatar: reportDetail?.generatedBy.profile_image ?? null,
            isVerified: true,
          }}
          trustScore={reportDetail?.factCheck?.overallPercentage ?? 0}
          isDebunked={reportDetail?.factCheck.goService.status === 'debunked'}
          location={`${reportDetail?.location.city}, ${reportDetail?.location.country}`}
          coords={{
            lat: reportDetail?.location.latitude ?? 0,
            lng: reportDetail?.location.longitude ?? 0,
          }}
          title={reportDetail?.reportName ?? ''}
          content={reportDetail?.description ?? ''}
          images={imgUrl}
          disasterType={(reportDetail?.incidentType as DisasterType) ?? 'other'}
          upvotes={reportDetail?.factCheck.communityScore?.upvotes ?? 0}
          downvotes={reportDetail?.factCheck.communityScore?.downvotes ?? 0}
          comments={12}
          createdAt={new Date(reportDetail?.createdAt ?? Date.now())}
          onUpvote={() => alert('Upvoted')}
          onDownvote={() => alert('Downvoted')}
          onComment={() => alert('Commented')}
          reporterId={reportDetail?.generatedBy.id}
          loginUser={userId}
        />
      )}

      {/* Action row */}
      <div className='mt-5 flex items-center justify-between border-t border-gray-100 pt-4'>
        {/* Votes + comments */}
        <div className='flex items-center gap-1'>
          <button
            onClick={onUpvote}
            className={`flex h-8 items-center gap-1 rounded-lg px-2 transition-all duration-150 ${
              upvotes > downvotes
                ? 'bg-primary/8 text-primary'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <ChevronUp size={16} strokeWidth={2.5} />
            <span className='text-[12px] font-medium tabular-nums'>
              {formatNumber(upvotes)}
            </span>
          </button>

          <button
            onClick={onDownvote}
            className={`flex h-8 items-center gap-1 rounded-lg px-2 transition-all duration-150 ${
              downvotes > upvotes
                ? 'bg-danger-light text-danger'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
          >
            <ChevronDown size={16} strokeWidth={2.5} />
            <span className='text-[12px] font-medium tabular-nums'>
              {formatNumber(downvotes)}
            </span>
          </button>

          <button
            onClick={onComment}
            className='flex h-8 items-center gap-1 rounded-lg px-2 text-gray-400 transition-all duration-150 hover:bg-gray-50 hover:text-gray-600'
          >
            <MessageSquare size={15} strokeWidth={2} />
            <span className='text-[12px] font-medium tabular-nums'>
              {formatNumber(comments)}
            </span>
          </button>
        </div>

        {/* Disaster badge + owner menu */}
        <div className='flex items-center gap-2'>
          <span className='flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500'>
            {getDisasterIcon(disasterType)}
            <span className='capitalize'>{disasterType}</span>
          </span>

          {isOwner && (
            <DropdownMenu onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {/* Modals */}
      {isDelete && (
        <DeleteReportModal isOpen={isDelete} setIsOpen={setIsDelete} id={id} />
      )}
      {isEdit && (
        <EditReportModal isOpen={isEdit} setIsOpen={setIsEdit} id={id} />
      )}
    </article>
  )
}

export default PostCard
