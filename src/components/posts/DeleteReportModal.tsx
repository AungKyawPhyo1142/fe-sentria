import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import ReactDOM from 'react-dom'
import { backdropVariants } from './constants/constants'
import Button from '../common/Button'
import { toast } from 'react-toastify'
import { useDeleteReport } from '@/services/network/lib/disasterReport'

// Props
interface DeleteReportModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
  id: string
}

const DeleteReportModal: React.FC<DeleteReportModalProps> = ({
  isOpen,
  setIsOpen,
  className,
  id,
}) => {
  const { deleteReportById } = useDeleteReport()
  const handleDelete = async () => {
    // console.log('deleted post!', id)
    // alert(`Post with ID "${id}" deleted successfully!`)
    // setIsOpen(false)
    // try {
    //   const res = await deleteReportById(id)
    //   console.log('ID of deleted post:', id)
    //   console.log('Delete response:', res)
    //   setIsOpen(false)
    // } catch (error) {
    //   console.error(error)
    //   toast.error('Something went wrong. Please try again.')
    //   setIsOpen(false)
    // }
    try {
      await deleteReportById(id)
      setIsOpen(false)
    } catch (error) {
      // error already handled in the hook
      console.error(error)
      toast.error('Something went wrong. Please try again.')
      setIsOpen(false)
    }
  }

  const cancelButton = () => {
    console.log('cancel clicked!')
    // alert('cancel delete!')
    setIsOpen(false)
    toast.info('Cancel delete post!')
  }
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[100] flex items-center justify-center bg-black/30',
            className,
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          <motion.div className='relative rounded-lg bg-white p-8 shadow-xl'>
            <div className='flex flex-col space-y-5'>
              <h1 className='text-2xl font-semibold'>
                Are you sure you want to delete this post?
              </h1>
              <p className='text-xl font-light'>
                This will delete your post permanently. You cannot undo this
                action.
              </p>
              <div className='flex flex-row space-x-8'>
                <Button
                  className='px-5 text-[15px]'
                  onClick={cancelButton}
                  tertiary
                >
                  Cancel
                </Button>
                <Button
                  className='px-5 text-[15px]'
                  onClick={handleDelete}
                  destructive
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default DeleteReportModal
