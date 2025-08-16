import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import Button from '../common/Button'
import { backdropVariants, modalVariants } from './constants/constants'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  isDeleting?: boolean
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Activity',
  message = 'Are you sure you want to delete this activity? This action cannot be undone.',
  isDeleting = false,
}) => {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[9999] flex items-center justify-center bg-black/30',
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          <motion.div
            className='relative w-[400px] rounded-lg bg-white p-6 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
              <button
                onClick={onClose}
                className='cursor-pointer text-gray-400 hover:text-gray-600'
                disabled={isDeleting}
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <div className='mb-6'>
              <p className='text-gray-600'>{message}</p>
            </div>

            <div className='flex justify-end space-x-3'>
              <Button
                className='w-full bg-black/25 text-gray-800 hover:bg-gray-300'
                onClick={onClose}
                disabled={isDeleting}
                type='button'
              >
                Cancel
              </Button>
              <Button
                destructive
                onClick={onConfirm}
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

export default DeleteConfirmationModal
