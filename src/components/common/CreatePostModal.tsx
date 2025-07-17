import clsx from 'clsx'
import { ChevronDown, CloudUpload, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Button from './Button'
import MapSelector from './MapSelector'
import { useTranslation } from 'react-i18next'
import Input from './Input'
import {
  CreateReport,
  useCreateDisasterReport,
} from '@/services/network/lib/disasterReport'

// Create Post Modal Interfaace
interface createPostProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

//animation effects
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}
export const modalVariants = {
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
  const [severityType, setSeverityType] = useState<string>('moderate')
  const [title, setTitle] = useState<string>('')
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
    setIsOpen(false)
  }

  // submit button
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   const formData = {
  //     disasterType,
  //     severityType,
  //     title,
  //     description,
  //     location,
  //     uploadedImages,
  //   }
  //   console.log('Form Submittede: ', formData)
  //   alert('Create Post successfully!')
  //   handleCancel()
  //   setIsOpen(false)
  // }

  const { mutate: createReport, isPending } = useCreateDisasterReport()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Title is required.')
      return
    }

    const reportData: CreateReport = {
      reportImage: uploadedImages,
      imageCaption: '', // always blank
      reportType: disasterType,
      name: title,
      parameters: {
        description,
        incidentType: disasterType.toUpperCase(), // optional: if needed in uppercase
        severity: severityType.toUpperCase(), // optional: uppercase
        incidentTimestamp: new Date().toISOString(), // current time; or use a date input
        location: {
          city: location.city,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        media: [],
      },
    }

    createReport(reportData, {
      onSuccess: (res) => {
        console.log('Report created:', res.data)
        alert('Create Post successfully!')
        handleCancel()
      },
      onError: (err) => {
        console.error('Failed to create report:', err)
        alert('Failed to create post.')
      },
    })
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

  const { t } = useTranslation()

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
          <motion.div
            className='custom-scroll relative max-h-[90vh] w-189 rounded-lg bg-white px-8 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Header */}
            <div className='sticky top-0 z-20 flex items-baseline justify-between border-b-1 border-black/30 bg-white py-5'>
              <h1 className='text-2xl font-semibold'>
                {t('createPost.create')}
              </h1>

              <button
                onClick={() => setIsOpen(false)}
                className='absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700'
              >
                <X className='h-8 w-8' strokeWidth={2} />
              </button>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-5 pt-6'>
              {/* Select Disaster Type */}
              <div>
                <label
                  htmlFor='disasterType'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.disaster')} <span className='text-red'>*</span>
                </label>
                <div className='relative w-full'>
                  <select
                    id='disasterType'
                    className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    required
                  >
                    <option value='earthquake'>
                      {t('createPost.earthquake')}
                    </option>
                    <option value='flood'>{t('createPost.flood')}</option>
                    <option value='storm'>{t('createPost.storm')}</option>
                    <option value='fire'>{t('createPost.fire')}</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-black'>
                    <ChevronDown />
                  </div>
                </div>
              </div>

              {/* Pick Severity type */}
              <div>
                <label
                  htmlFor='severityType'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.severity')} <span className='text-red'>*</span>
                </label>
                <div className='relative w-full'>
                  <select
                    id='severityType'
                    className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                    value={severityType}
                    onChange={(e) => setSeverityType(e.target.value)}
                    required
                  >
                    <option value='unknown'>{t('severity.unknown')} </option>
                    <option value='minor'>{t('severity.minor')}</option>
                    <option value='moderate'>{t('severity.moderate')}</option>
                    <option value='severe'>{t('severity.severe')}</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-black'>
                    <ChevronDown />
                  </div>
                </div>
              </div>
              {/* title is name */}
              <div>
                <label
                  htmlFor='title'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.title')}
                  <span className='text-red'>*</span>
                </label>
                <Input
                  type='title'
                  name='title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              {/* description */}
              <div>
                <label
                  htmlFor='description'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.description')}
                  <span className='text-red'>*</span>
                </label>
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='block min-h-28 w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                  required
                ></textarea>
              </div>

              {/* Pick the location where the disaster occurred */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  {t('createPost.location')}
                  <span className='text-red'>*</span>
                </label>
                <p className='mb-2 text-sm font-thin text-black/50'>
                  {t('createPost.dragPin')}
                </p>

                {/* Placeholder for Leaflet map */}
                <MapSelector onLocationChange={(loc) => setLocation(loc)} />
              </div>

              {/* drop or upload images */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  {t('createPost.images')}
                </label>
                <div
                  {...getRootProps()}
                  className='cursor-pointer rounded-lg border-2 border-dashed border-zinc-300 px-6 py-10 text-center transition-colors hover:border-black/30'
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>{t('createPost.dropFile')} ...</p>
                  ) : (
                    <div className='flex flex-col items-center justify-center text-black/30 hover:text-black'>
                      <p>
                        <CloudUpload className='mb-2' />
                        {/* optional size and margin */}
                      </p>
                      <p className='mb-2'>{t('createPost.upload')}</p>
                      <p className='mb-2'>{t('createPost.or')}</p>
                      <button
                        type='button'
                        className='rounded-[10px] border border-black/30 px-4 py-2 transition-colors hover:cursor-pointer'
                      >
                        {t('createPost.browse')}
                      </button>
                    </div>
                  )}
                </div>
                {/* image preview */}
                {previewImages.length > 0 && (
                  <div className='mt-4 grid grid-cols-5 gap-4'>
                    {previewImages.map((src, index) => (
                      <div
                        key={index}
                        className='group relative h-26 w-full overflow-hidden rounded-[10px]'
                      >
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(index)}
                          className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white transition-opacity group-hover:cursor-pointer group-hover:bg-black/30'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className='sticky bottom-0 z-20 flex justify-end space-x-5 bg-white py-4'>
                <Button
                  className='w-29'
                  tertiary
                  type='button'
                  onClick={handleCancel}
                >
                  {t('createPost.cancel')}
                </Button>
                <Button
                  className='w-29'
                  primary
                  type='submit'
                  disabled={isPending}
                >
                  {isPending ? 'Submitting...' : t('createPost.submit')}
                </Button>
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
