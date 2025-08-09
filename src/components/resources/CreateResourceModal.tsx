import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { X, CloudUpload, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import Button from '../common/Button'
import Input from '../common/Input'
import LocateButton from '../common/LocateButton'
import RichTextEditor from '../RichTextEditor'
import {
  ResourceType,
  CreateResourceFormValues,
  CreateResourceFormValuesWithFiles,
} from '@/services/network/lib/resources'
import { backdropVariants, modalVariants } from '../posts/constants/constants'

const DraggableMarker = ({
  position,
  onPositionChange,
}: {
  position: [number, number] | null
  onPositionChange: (pos: [number, number]) => void
}) => {
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng]
      onPositionChange(newPos)
    },
    locationfound(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng]
      onPositionChange(newPos)
      map.setView(e.latlng, map.getZoom())
    },
  })

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 16,
      watch: false,
      enableHighAccuracy: true,
    })
  }, [map])

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const newPos = marker.getLatLng()
          onPositionChange([newPos.lat, newPos.lng])
        },
      }}
      icon={L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      })}
    />
  ) : null
}

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSave?: (resourceData: CreateResourceFormValuesWithFiles) => void
}

const CreateResourceModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  onSave,
}) => {
  const [formData, setFormData] = useState<CreateResourceFormValues>({
    name: '',
    resourceType: ResourceType.SURVIVAL,
    parameters: {
      description: '',
      location: {
        city: 'Bangkok',
        country: 'Thailand',
        latitude: 0,
        longitude: 0,
      },
      address: {
        street: '123 Main St',
        district: 'Central',
        fullAddress: '123 Main St, Central, Bangkok, Thailand',
      },
    },
  })

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        description: html,
      },
    }))
  }

  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resourceTypes = [
    { value: ResourceType.SURVIVAL, label: 'Survival' },
    { value: ResourceType.FIRST_AID, label: 'First Aid' },
    { value: ResourceType.HOTLINE, label: 'Hotline' },
  ]

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  function resetModal() {
    setFormData({
      name: '',
      resourceType: ResourceType.SURVIVAL,
      parameters: {
        description: '',
        location: {
          city: '',
          country: '',
          latitude: 0,
          longitude: 0,
        },
        address: {
          street: '',
          district: '',
          fullAddress: '',
        },
      },
    })

    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    setPreviewUrls([])
    setImages([])
    setIsDragOver(false)
  }

  function closeModal() {
    setIsOpen(false)
    resetModal()
  }

  function handleSave() {
    if (!formData.name.trim() || !formData.resourceType) {
      alert('Please fill in required fields')
      return
    }

    const formDataToSubmit = {
      ...formData,
      parameters: {
        ...formData.parameters,
      },
    }
    //  add the images to the form data
    const dataWithFiles: CreateResourceFormValuesWithFiles = {
      ...formDataToSubmit,

      imageFiles: images.length > 0 ? images : undefined,
    }

    onSave?.(dataWithFiles)
    closeModal()
  }

  function handleImageSelect(files: FileList) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (imageFiles.length === 0) return

    const newImages = [...images, ...imageFiles]

    const newPreviewUrls = [
      ...previewUrls,
      ...imageFiles.map((file) => URL.createObjectURL(file)),
    ]

    // Update states
    setImages(newImages)
    setPreviewUrls(newPreviewUrls)

    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        imageFiles: newImages,
      },
    }))
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previewUrls[index])

    // Remove from preview arrays
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files) {
      handleImageSelect(files)
    }
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOver(false)
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    setIsDragOver(false)

    const files = event.dataTransfer.files
    if (files) {
      handleImageSelect(files)
    }
  }

  if (!isOpen) return null

  const modalContent = (
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
            className='scrollbar-hide relative max-h-[90vh] w-[756px] overflow-y-auto rounded-lg bg-white px-8 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Header */}
            <div className='sticky top-0 z-[9998] flex items-baseline justify-between border-b-1 border-black/30 bg-white py-5'>
              <h1 className='text-[32px] font-semibold'>Create Resource</h1>
              <button
                onClick={closeModal}
                className='absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700'
              >
                <X className='h-8 w-8' strokeWidth={2} />
              </button>
            </div>

            {/* Form */}
            <div className='space-y-5 pt-6'>
              {/* Resource Name */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  Resource Name <span className='text-red'>*</span>
                </label>
                <Input
                  type='text'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder='Enter resource name'
                  className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                />
              </div>

              {/* Resource Type Selection */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  What kind of resource you wanna share?{' '}
                  <span className='text-red'>*</span>
                </label>
                <p className='mb-3 text-sm font-thin text-black/50'>
                  You can select multiple categories
                </p>
                <div className='relative w-full'>
                  <select
                    value={formData.resourceType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        resourceType: e.target.value as ResourceType,
                      }))
                    }
                    className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                  >
                    <option value=''>Select the types of resource</option>
                    {resourceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-black'>
                    <ChevronDown />
                  </div>
                </div>
              </div>

              {/* Description with Rich Text Editor */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  Add a First Aid Tip or share your experience{' '}
                  <span className='text-red'>*</span>
                </label>
                <RichTextEditor
                  content={formData.parameters.description}
                  onChange={handleDescriptionChange}
                  minHeight='112px'
                  className='block min-h-28 w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                />
              </div>

              {/* Location & Address */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  Location <span className='text-red'>*</span>
                </label>
                <p className='mb-2 text-sm font-thin text-black/50'>
                  Click or drag the pin to set your location
                </p>
                <div className='h-48 w-full overflow-hidden rounded-[10px] border border-zinc-300'>
                  <MapContainer
                    center={
                      formData.parameters.location.latitude !== 0 &&
                      formData.parameters.location.longitude !== 0
                        ? [
                            formData.parameters.location.latitude,
                            formData.parameters.location.longitude,
                          ]
                        : [0, 0]
                    }
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <LocateButton
                      position={
                        formData.parameters.location.latitude !== 0 &&
                        formData.parameters.location.longitude !== 0
                          ? [
                              formData.parameters.location.latitude,
                              formData.parameters.location.longitude,
                            ]
                          : null
                      }
                    />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    <DraggableMarker
                      position={
                        formData.parameters.location.latitude !== 0 &&
                        formData.parameters.location.longitude !== 0
                          ? [
                              formData.parameters.location.latitude,
                              formData.parameters.location.longitude,
                            ]
                          : null
                      }
                      onPositionChange={(pos) => {
                        setFormData((prev) => ({
                          ...prev,
                          parameters: {
                            ...prev.parameters,
                            location: {
                              ...prev.parameters.location,
                              latitude: pos[0],
                              longitude: pos[1],
                            },
                          },
                        }))
                      }}
                    />
                  </MapContainer>
                </div>
                {formData.parameters.location.latitude !== 0 &&
                  formData.parameters.location.longitude !== 0 && (
                    <div className='mt-2 text-sm text-gray-600'>
                      Coordinates:{' '}
                      {formData.parameters.location.latitude.toFixed(6)},{' '}
                      {formData.parameters.location.longitude.toFixed(6)}
                    </div>
                  )}
              </div>

              {/* Image Upload */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  Drop or upload your images here
                </label>
                <div
                  className={clsx(
                    'cursor-pointer rounded-[10px] border-2 border-dashed border-zinc-300 px-6 py-10 text-center transition-colors hover:border-black/30',
                    isDragOver && 'border-black/30',
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className='flex flex-col items-center justify-center text-black/30 hover:text-black'>
                    <p>
                      <CloudUpload className='mb-2' />
                    </p>
                    <p className='mb-2'>
                      {isDragOver
                        ? 'Drop images here'
                        : 'Drop a file here to upload'}
                    </p>
                    <p className='mb-2'>or</p>
                    <button
                      type='button'
                      className='rounded-[10px] border border-black/30 px-4 py-2 transition-colors hover:cursor-pointer'
                    >
                      Browse
                    </button>
                  </div>
                </div>

                <Input
                  inputRef={fileInputRef}
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleFileChange}
                  className='hidden'
                />

                {/* Image Previews */}
                {previewUrls.length > 0 && (
                  <div className='mt-4 grid grid-cols-5 gap-4'>
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className='group relative h-26 w-full overflow-hidden rounded-[10px]'
                      >
                        <img
                          src={url}
                          alt={`preview-${index + 1}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
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
              <div className='sticky bottom-0 z-[9999] flex justify-end space-x-5 bg-white py-4'>
                <Button
                  className='w-30 bg-black/25'
                  type='button'
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  className='w-30'
                  primary
                  type='button'
                  onClick={handleSave}
                >
                  Create
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return ReactDOM.createPortal(modalContent, document.body)
}

export default CreateResourceModal
