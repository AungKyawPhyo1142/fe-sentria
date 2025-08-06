import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import ReactDOM from 'react-dom'
import { backdropVariants, modalVariants } from './constants/constants'
import { ChevronDown, CloudUpload, X } from 'lucide-react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useGetDisasterReportDetail } from '@/services/network/lib/disasterReport'
import { useDropzone } from 'react-dropzone'
import LocationEditor from '../common/LocationEditor'

interface EditReportModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
  id: string
}

const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  setIsOpen,
  className,
  id,
}) => {
  const { data, isLoading, isError } = useGetDisasterReportDetail(id)
  const report = data?.data?.report?.data

  const [incidentType, setIncidentType] = useState('earthquake')
  const [severity, setSeverity] = useState('UNKNOWN')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [updatedLocation, setUpdatedLocation] = useState({
    lat: report?.location?.latitude || 0,
    lng: report?.location?.longitude || 0,
  })

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      const imageUrls = acceptedFiles.map((file) => URL.createObjectURL(file))
      setPreviewImages((prev) => [...prev, ...imageUrls])
    },
  })

  const handleRemoveImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  // handle position change from LocationEditor
const handlePositionChange = (position: { lat: number; lng: number }) => {
  console.log('New position:', position)
  setUpdatedLocation(position)
}


  useEffect(() => {
    if (report) {
      setIncidentType(report.incidentType || 'earthquake')
      setSeverity(report?.severity || 'UNKNOWN')
      setTitle(report.reportName || '')
      setDescription(report.description || '')

      const images =
        report?.media
          ?.filter(
            (m) =>
              typeof m?.type === 'string' &&
              m.type.toLowerCase() === 'image' &&
              typeof m.url === 'string' &&
              m.url.trim() !== '',
          )
          .map((m) => m.url) ?? []
      setPreviewImages(images)
    }
  }, [report])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted edit for ID:', id)
    const payload = {
      incidentType,
      severity,
      title,
      description,
      location: {
        latitude: updatedLocation.lat,
        longitude: updatedLocation.lng,
      },
      images: previewImages,
    }

    console.log('Submitting payload:', payload) 
    // TODO: Call your update API here
    setIsOpen(false)
  }

  if (isLoading) return <div>Loading...</div>
  if (isError || !report) return <div>Error loading report details</div>

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
              <h1 className='text-2xl font-semibold'>Edit Report</h1>

              <button
                onClick={() => setIsOpen(false)}
                className='absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700'
              >
                <X className='h-8 w-8' strokeWidth={2} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-5 pt-6'>
              {/* Disaster type edit */}
              <div>
                <label
                  htmlFor='incidentType'
                  className='mb-2 block text-xl font-semibold'
                >
                  Edit disaster type
                </label>
                <div className='relative w-full'>
                  <select
                    id='incidentType'
                    name='incidentType'
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                  >
                    <option value='earthquake'>Earthquake</option>
                    <option value='flood'>Flood</option>
                    <option value='fire'>Fire</option>
                    <option value='storm'>Storm</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-black'>
                    <ChevronDown />
                  </div>
                </div>
              </div>

              {/* Edit Severity Type */}
              <div>
                <label
                  htmlFor='severity'
                  className='mb-2 block text-xl font-semibold'
                >
                  Edit severity type
                </label>
                <div className='relative w-full'>
                  <select
                    id='severity'
                    name='severity'
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                  >
                    <option value='UNKOWN'>Unknown </option>
                    <option value='MINOR'>Minor</option>
                    <option value='MODERATE'>Moderate</option>
                    <option value='SEVERE'>Severe</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-black'>
                    <ChevronDown />
                  </div>
                </div>
              </div>

              {/* edit title/name */}
              <div>
                <label
                  htmlFor='name'
                  className='mb-2 block text-xl font-semibold'
                >
                  Edit title
                </label>
                <Input
                  type='text'
                  id='name'
                  name='name'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='block w-full rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                />
              </div>

              {/* edit description */}
              <div>
                <label
                  htmlFor='description'
                  className='mb-2 block text-xl font-semibold'
                >
                  Edit description
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='block w-full rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                />
              </div>

              {/* loacation editor */}
              <LocationEditor
                postLocation={updatedLocation}
                onPositionChange={handlePositionChange}
              />

              {/* Preview Existing Images */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  Uploaded Images
                </label>
                <div
                  {...getRootProps()}
                  className='cursor-pointer rounded-lg border-2 border-dashed border-zinc-300 px-6 py-10 text-center'
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className='text-gray-500'>Drop the files here...</p>
                  ) : (
                    <div className='flex flex-col items-center justify-center text-black/30 hover:text-black'>
                      <p>
                        <CloudUpload className='mb-2' />
                      </p>
                      <p className='mb-2'>Upload Images</p>
                      <p className='mb-2'>or</p>
                      <button
                        type='button'
                        onClick={open}
                        className='rounded-[10px] border border-black/30 px-4 py-2 transition-colors hover:cursor-pointer'
                      >
                        Browse
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
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveImage(index)
                          }}
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
                  onClick={() => console.log('cancel edit')}
                >
                  Cancel
                </Button>
                <Button className='w-40' primary type='submit'>
                  Save Changes
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

export default EditReportModal
