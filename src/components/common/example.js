import clsx from 'clsx'
import { X } from 'lucide-react'
import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone' // Import useDropzone for drag and drop

// Create Post Modal Interface
interface createPostProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// Animation effects
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

// Create Post Modal
const CreatePostModal: React.FC<createPostProps> = ({
  className,
  isOpen,
  setIsOpen,
}) => {
  const [disasterType, setDisasterType] = useState<string>('earthquake')
  const [description, setDescription] = useState<string>('')
  const [location, setLocation] = useState<any>(null) // This will be set by your Leaflet map
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

  const handleCancel = () => {
    setDisasterType('earthquake')
    setDescription('')
    setLocation(null)
    setUploadedImages([])
    setPreviewImages([])
    setIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = {
      disasterType,
      description,
      location,
      uploadedImages,
    }
    console.log('Form Submitted:', formData)
    alert('Form Submitted successfully!')
    handleCancel(); // Clear form after submission
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };


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
            className='relative h-auto w-[680px] rounded-lg bg-white px-8 py-6 shadow-xl' // Adjusted width to fit content
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <div className='border-b border-gray-300 pb-5'>
              <h1 className='text-2xl font-bold'>Create Post</h1>

              <button
                onClick={() => setIsOpen(false)}
                className='absolute top-6 right-4 text-white hover:cursor-pointer hover:opacity-70'
              >
                <X
                  className='h-8 w-8 rounded-full bg-black/30 p-1.5'
                  strokeWidth={2}
                />
              </button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className='pt-6 space-y-5'>
              {/* Select Disaster Type */}
              <div>
                <label htmlFor='disasterType' className='block text-lg font-bold mb-2'>
                  Pick Disaster Type <span className='text-red-500'>*</span>
                </label>
                <div className='relative w-full'>
                  <select
                    id='disasterType'
                    className='block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500'
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    required
                  >
                    <option value='earthquake'>Earthquake</option>
                    <option value='flood'>Flood</option>
                    <option value='storm'>Storm</option>
                    <option value='fire'>Fire</option>
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                    <svg
                      className='fill-current h-4 w-4'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor='description' className='block text-lg font-bold mb-2'>
                  Description <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='description'
                  className='w-full p-3 border border-gray-300 rounded-lg resize-y min-h-[100px] focus:outline-none focus:border-blue-500'
                  placeholder='It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Pick the location where the disaster occurred */}
              <div>
                <label className='block text-lg font-bold mb-2'>
                  Pick the location where the disaster occurred{' '}
                  <span className='text-red-500'>*</span>
                </label>
                {/* Placeholder for Leaflet map */}
                <div className='w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500'>
                  {/* Your Leaflet map component will go here */}
                  <p>Map Placeholder (Leaflet Integration)</p>
                </div>
              </div>

              {/* Drop or upload your images here */}
              <div>
                <label className='block text-lg font-bold mb-2'>
                  Drop or upload your images here
                </label>
                <div
                  {...getRootProps()}
                  className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors'
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <>
                      <p className='text-gray-500 mb-2'>Drag a file here to upload</p>
                      <p className='text-gray-500 mb-2'>or</p>
                      <button
                        type='button'
                        className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
                      >
                        Browse
                      </button>
                    </>
                  )}
                </div>
                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className='mt-4 grid grid-cols-3 gap-4'>
                    {previewImages.map((src, index) => (
                      <div key={index} className='relative w-full h-32 rounded-lg overflow-hidden group'>
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className='w-full h-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(index)}
                          className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                          aria-label='Remove image'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end space-x-4 pt-4'>
                <button
                  type='button'
                  onClick={handleCancel}
                  className='px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors'
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
export default CreatePostModal