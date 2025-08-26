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

export const PostCardSkeleton = () => {
  return (
    <div className='mb-4 max-w-full bg-white'>
      {/* Trust Score Warning Skeleton with Shimmer */}
      <div className='mb-0 ml-6 w-32 animate-[shimmer_2s_infinite] rounded-t-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] px-4 py-1'>
        <div className='h-3 rounded bg-transparent'></div>
      </div>

      <div className='rounded-lg border border-[#33333430] px-8 pt-7 transition-all duration-300 ease-in-out hover:bg-gray-100/50'>
        {/* Header Skeleton */}
        <div className='mb-2'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* Avatar Skeleton with Shimmer */}
              <div className='relative'>
                <div className='h-10 w-10 animate-[shimmer_2s_infinite] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
              </div>

              <div className='flex flex-col space-y-2'>
                {/* Username and Badge Skeleton */}
                <div className='flex items-center space-x-2'>
                  <div className='h-4 w-24 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
                  <div className='h-4 w-4 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
                </div>
                {/* Created At Skeleton */}
                <div className='h-3 w-16 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
              </div>
            </div>

            {/* Trust Score and Disaster Badge Skeleton */}
            <div className='flex items-center space-x-3'>
              <div className='h-7 w-12 animate-[shimmer_2s_infinite] rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
              <div className='h-7 w-20 animate-[shimmer_2s_infinite] rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
              <div className='h-7 w-16 animate-[shimmer_2s_infinite] rounded-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            </div>
          </div>

          {/* Location Skeleton */}
          <div className='mt-2 flex items-center'>
            <div className='mr-3 h-6 w-6 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-4 w-32 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
          </div>

          {/* Post Title Skeleton */}
          <div className='mt-2 space-y-2'>
            <div className='h-4 w-full animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-4 w-3/4 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className='mb-8'>
          <div className='mb-6 space-y-2'>
            <div className='h-3 w-full animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-3 w-full animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-3 w-full animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-3 w-2/3 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
          </div>

          {/* Images Skeleton */}
          <div className='flex items-center space-x-2'>
            <div className='h-20 w-20 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-20 w-20 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-20 w-20 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
          </div>
        </div>

        {/* Actions Skeleton */}
        <div className='pt-3'>
          <div className='mb-2 flex items-center space-x-2'>
            <div className='h-3 w-16 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-3 w-1 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            <div className='h-3 w-20 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className='my-2 flex items-center justify-between border-t border-[#33333430] pt-2'>
            <div className='flex w-full items-center space-x-4'>
              <div className='h-6 w-6 animate-[shimmer_2s_infinite] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
              <div className='h-6 w-6 animate-[shimmer_2s_infinite] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
              <div className='h-6 w-6 animate-[shimmer_2s_infinite] rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
            </div>
            <div className='h-6 w-6 animate-[shimmer_2s_infinite] rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'></div>
          </div>
        </div>
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

interface PostCardProps {
  id: string
  user: User
  trustScore: number
  isDebunked: boolean
  location: string
  title: string
  content: string
  images?: string[]
  // disasterType: 'earthquake' | 'flood' | 'fire' | 'storm' | 'other'
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
  // const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDelete, setIsDelete] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

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

  // data fetch
  const { data, isLoading, isError } = useGetDisasterReportDetail(id)
  if (isLoading) return <p>Loading...</p>
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

  // delete
  const handleDelete = () => {
    console.log('delete button clicked!')
    setIsDelete(true)
  }
  // edit
  const handleEdit = () => {
    console.log('edit button clicked!')
    setIsEdit(true)
  }

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
      <div className='cursor-pointer rounded-lg border border-[#33333430] px-8 pt-7 transition-all duration-300 ease-in-out hover:bg-gray-100/50'>
        <div onClick={() => setShowDetail(true)}>
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
                    {/* {t(`disasters.${disasterType}`)} */}
                    {disasterType}
                  </span>
                </div>
              </div>
            </div>

            {/* location */}
            <div className='mt-2 flex items-center text-sm text-black'>
              <MapPinned className='mr-1 h-6 w-6 stroke-1' />
              <span className='ml-2 text-[16px] font-semibold'>{location}</span>
            </div>
            {/* post title */}
            <div className='mt-2 text-[14px] hover:cursor-pointer'>{title}</div>
          </div>

          {/* Content */}
          <div className='mb-8'>
            <p className='mb-6 text-[12px] leading-relaxed font-extralight text-[#333334]'>
              {content && content.length > 300 ? (
                <>
                  {content.slice(0, 300)}...
                  <button
                    className='text-primary hover:text-primary/80 ml-1 text-[13px] font-medium hover:cursor-pointer'
                    onClick={() =>
                      // show post modal
                      setShowDetail(true)
                    }
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
        </div>
        {/* show post detail */}
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
            // disasterType={reportDetail?.incidentType as any}
            disasterType={
              (reportDetail?.incidentType as DisasterType) ?? 'other'
            }
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

        {/* actions */}
        <div className='pt-3'>
          <div className='flex items-center text-[10px] font-semibold text-[#33333430]'>
            {upvotes === 0 || downvotes === 0 ? (
              <span className='text-[#33333430]'>No votes yet</span>
            ) : (
              <>
                {upvotes > downvotes ? (
                  <span className='text-primary'>
                    {formatNumber(upvotes)} upvotes
                  </span>
                ) : (
                  <span className='text-[#B22222]'>
                    {formatNumber(downvotes)} downvotes
                  </span>
                )}
              </>
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
              <DropdownMenu onEdit={handleEdit} onDelete={handleDelete} />
            )}
            {isDelete && (
              <DeleteReportModal
                isOpen={isDelete}
                setIsOpen={setIsDelete}
                id={id}
              />
            )}
            {isEdit && (
              <EditReportModal isOpen={isEdit} setIsOpen={setIsEdit} id={id} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
