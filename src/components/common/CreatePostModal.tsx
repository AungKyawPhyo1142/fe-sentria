import clsx from 'clsx'
import { ChevronDown, CloudUpload, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Button from './Button'
import MapSelector from './MapSelector'
import { useTranslation } from 'react-i18next'

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

    // set current locaiotn
    // navigator.geolocation.getCurrentPosition(async (pos) => {
    //   const lat = pos.coords.latitude
    //   const lon = pos.coords.longitude

    //   const res = await fetch(
    //     `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`,
    //   )
    //   const data = await res.json()
    //   const { road, city, town, village } = data.address
    //   const place: PlaceInfo = {
    //     lat,
    //     lon,
    //     display: data.display_name,
    //     street: road,
    //     city: city || town || village,
    //   }
    //   setLocation(place)
    // })
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

  const { t } = useTranslation()

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
            className='relative h-auto max-h-screen w-189 overflow-y-auto rounded-lg bg-white px-8 py-6 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <div className='border-b-1 border-black/30 pb-5'>
              <h1 className='text-2xl font-bold'>{t('createPost.create')}</h1>

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
            <form onSubmit={handleSubmit} className='space-y-5 pt-6'>
              {/* Select Disaster Type */}
              <div>
                <label
                  htmlFor='disasterType'
                  className='mb-2 block text-2xl font-bold'
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

              {/* description */}
              <div>
                <label
                  htmlFor='description'
                  className='mb-2 block text-2xl font-bold'
                >
                  {t('createPost.description')}{' '}
                  <span className='text-red'>*</span>
                </label>
                {/* <Input
                  type='description'
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                /> */}
                <textarea
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                  required
                ></textarea>
              </div>

              {/* Pick the location where the disaster occurred */}
              <div>
                <label className='mb-2 block text-2xl font-bold'>
                  {t('createPost.location')}
                  <span className='text-red'>*</span>
                </label>
                {/* Placeholder for Leaflet map */}
                <MapSelector onLocationChange={(loc) => setLocation(loc)} />
              </div>

              {/* drop or upload images */}
              <div>
                <label className='mb-2 block text-2xl font-bold'>
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
              <div className='flex justify-end space-x-5 pt-4'>
                <Button
                  className='w-29'
                  primaryOutline
                  type='button'
                  onClick={handleCancel}
                >
                  {t('createPost.cancel')}
                </Button>
                <Button className='w-29' primary type='submit'>
                  {t('createPost.submit')}
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
