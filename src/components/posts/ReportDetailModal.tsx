import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import clsx from 'clsx'
import { backdropVariants, modalVariants } from '../common/CreatePostModal'
import { X } from 'lucide-react'
import ReactDOM from 'react-dom'
import { User } from './PostCard'
import { useTranslation } from 'react-i18next'
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
import TrustScoreBadge from './TrustScoreBadge'
import VerifyBadge from '@/assets/VerifiedBadge.svg?react'
import PostImageSlider from './PostImagesSlider'
import { formatNumber } from '@/helpers/helpers'
import CommentCard, { fakeComments } from './CommentCard'
import CommentInputBox from './CommentInputBox'

interface reportDetailProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  _id: string
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
  _id,
}) => {
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

  const isOwner = String(reporterId) === String(loginUser)
  const [showMenu, setShowMenu] = useState(false)

  const trustWarning = getTrustWarning(trustScore, isDebunked)

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/30',
            className,
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          {/* Trust Score Warning - Outside border */}
          {trustWarning.show && (
            <div
              className={`mb-0 w-fit rounded-t-xl ${trustWarning.bgColor} px-4 py-1`}
            >
              <span className='text-[12px] font-medium text-white'>
                {trustWarning.message}
              </span>
            </div>
          )}
          <motion.div
            className='custom-scroll relative flex max-h-[90vh] w-189 flex-col rounded-lg bg-white shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <div className='px-8 pt-3'>
              {/* header  with justify between*/}
              <div className='sticky top-0 z-[9990] flex items-center justify-between bg-white pb-2 align-middle'>
                {/* user verified */}
                <div className='flex space-x-2'>
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

                  {/* user naem and verify and create at */}
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

                {/* trust Score */}
                <div className='mr-6'>
                  <TrustScoreBadge score={trustScore} />
                </div>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className='fix cursor-pointe top-0 right-0 my-3 text-gray-500 hover:cursor-pointer hover:text-gray-700'
                >
                  <X className='h-8 w-8' strokeWidth={2} />
                </button>
              </div>

              {/* post detail */}
              <div className='sticky top-0 z-[999] bg-white'>
                {/* disaster type and isDebunked */}
                <div className='my-2 flex flex-row space-y-2'>
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

                {/* Location */}
                <div className='mt-2 flex items-center text-sm text-black'>
                  <MapPinned className='mr-1 h-6 w-6 stroke-1' />
                  <span className='ml-2 text-[16px] font-semibold'>
                    {location}
                  </span>
                </div>
                {/* post title */}
                <div className='my-3 text-[14px]'>{title}</div>

                {/* Content */}
                <div className=''>
                  <p className='mb-6 text-[12px] leading-relaxed font-extralight text-[#333334]'>
                    {content}
                  </p>
                </div>

                {/* Images */}
                <PostImageSlider images={images} />

                {/* footer with up/down/cmt and menu */}
                <div className='sticky bottom-0 bg-white pt-3'>
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
                  <div className='my-2 flex items-center justify-between border-t border-b border-[#33333430] py-2 text-center align-middle'>
                    {/* up/down/cmt */}
                    <div className='flex w-full items-center space-x-4'>
                      <button
                        onClick={onUpvote}
                        className={`flex min-h-0 items-center space-x-1 border-none bg-transparent p-0 ${upvotes > downvotes ? 'text-primary hover:text-primary/80' : 'text-[#33333430] hover:text-[#3333430]/80'}`}
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
                          className='items-center align-middle text-[#33333430] focus-within:ring-0 hover:cursor-pointer hover:text-[#33333430]/80 focus:ring-0 focus:outline-none focus-visible:ring-0'
                        >
                          <Ellipsis className='h-6 w-6 stroke-1' />
                        </button>
                        {showMenu && (
                          <div className='absolute -right-3 bottom-full z-[100] mb-1 w-28 rounded-md border border-[#333334]/30 bg-white'>
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

              {/* show comments sections */}
              <div className='flex flex-col'>
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

            {/* comment */}
            <CommentInputBox VerifyBadge={VerifyBadge} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
export default ReportDetailModal
