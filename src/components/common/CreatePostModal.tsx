import clsx from 'clsx'
import { X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

// Create Post Modal Interfaace
interface createPostProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

//animation effects
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 40,
    transition: {
      duration: 0.2,
      ease: 'easeInOut' as const,
    },
  },
}

// select disaster type
export interface DisasterOption {
  value: string
  label: string
}
// disaster type select
export interface DisasterTypeSelectOption {
  onSelect: (selectedValue: string) => void
  initialValue?: string
}

// Create Post Modal
const CreatePostModal: React.FC<createPostProps> = ({
  className,
  isOpen,
  setIsOpen,
}) => {
  const [disasterType, setDisasterType] = useState<string>('earthquake')
  const [description, setDescription] = useState<string>('')
  const [location, setLocation] = useState<any>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedImages((prev) => [...prev, ...acceptedFiles])
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewImages((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  // cancel button
  const handleCancel = () => {
    setDisasterType('earthquake')
    setDescription('')
    setLocation(null)
    setPreviewImages([])
  }

  // submit button
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      disasterType,
      description,
      location,
      uploadedImages,
    }
    console.log('Form Submittede: ', formData)
    alert('Create Post successfully!')
    handleCancel()
    setIsOpen(false)
  }

  // remove selected image
  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    )
    setPreviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    )
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-50 flex items-center justify-center bg-black/30',
            className,
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          <motion.div
            className='relative h-auto w-189 rounded-lg bg-white px-8 py-6 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <div className='border-b-1 border-black/30 pb-5'>
              <h1 className='text-2xl font-bold'>Create Post</h1>

              <button
                onClick={() => setIsOpen(false)}
                className='absolute top-6 right-4 text-white hover:cursor-pointer hover:opacity-20'
              >
                <X
                  className='h-8 w-8 rounded-full bg-black/30 p-1.5'
                  strokeWidth={2}
                />
              </button>
            </div>
            {/* Form */}
            <form>{/* Select Disaster Type */}</form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
export default CreatePostModal
