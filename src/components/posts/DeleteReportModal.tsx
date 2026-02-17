import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import ReactDOM from 'react-dom'
import { backdropVariants, modalVariants } from './constants/constants'
import Button from '../common/Button'
import { toast } from '@/lib/toast'
import { useDeleteReport } from '@/services/network/lib/disasterReport'
import { X } from 'lucide-react'

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
  const [isDeleting, setIsDeleting] = React.useState(false)
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
      setIsDeleting(true)
      const res = await deleteReportById(id)
      if (res.status === 'SUCCESS') {
        toast.success('Report deleted successfully!')
      }
      setIsOpen(false)
      setIsDeleting(false)
    } catch (error) {
      // error already handled in the hook
      console.error(error)
      toast.error('Something went wrong. Please try again.')
      setIsOpen(false)
      setIsDeleting(false)
    }
  }

  const cancelButton = () => {
    setIsOpen(false)
  }
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/30',
            className,
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          {/* <motion.div className='relative rounded-lg bg-white p-8 shadow-xl'>
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
          </motion.div> */}
          <motion.div
            className='relative w-[400px] rounded-lg bg-white p-6 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Delete Report
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className='cursor-pointer text-gray-400 hover:text-gray-600'
                disabled={isDeleting}
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <div className='mb-6'>
              <p className='text-gray-600'>
                Are you sure you want to delete this report? This action cannot
                be undone.
              </p>
            </div>

            <div className='flex justify-end space-x-3'>
              <Button
                variant='secondary'
                onClick={cancelButton}
                disabled={isDeleting}
                type='button'
                className='w-full'
              >
                Cancel
              </Button>
              <Button
                variant='danger'
                onClick={handleDelete}
                disabled={isDeleting}
                className='w-full'
                type='button'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default DeleteReportModal
