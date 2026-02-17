import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { X, CloudUpload, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import maplibregl from 'maplibre-gl'
import {
  Map as MapView,
  MapMarker,
  MarkerContent,
  MapControls,
  type MapRef,
} from '@/components/ui/map'
import { apiClient } from '@/services/network/apiClient'
import { ApiConstantRoutes } from '@/services/network/path'
import Button from '../common/Button'
import Input from '../common/Input'
import RichTextEditor from '../RichTextEditor'
import {
  ResourceType,
  CreateResourceFormValues,
  CreateResourceFormValuesWithFiles,
} from '@/services/network/lib/resources'
import { backdropVariants, modalVariants } from '../posts/constants/constants'
import { toast } from '@/lib/toast'

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

  const mapRef = useRef<MapRef>(null)

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

  const getLocation = async (lat: number, lng: number) => {
    try {
      const response = await apiClient.post(
        ApiConstantRoutes.paths.location.reverseGeocode,
        {
          lat: lat,
          lng: lng,
        },
      )
      const data = await response.data
      return {
        city: data.city || 'Location Selected',
        country: data.country || 'Thailand',
      }
    } catch (error) {
      console.error('Error fetching location:', error)
      return {
        city: 'Location Selected',
        country: 'Thailand',
      }
    }
  }

  const handleMapPositionChange = (pos: [number, number]) => {
    getLocation(pos[0], pos[1]).then((location) => {
      setFormData((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          location: {
            ...prev.parameters.location,
            latitude: pos[0],
            longitude: pos[1],
            city: location.city,
            country: location.country,
          },
        },
      }))
    })
  }

  // Auto-locate on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleMapPositionChange([pos.coords.latitude, pos.coords.longitude])
          mapRef.current?.flyTo({
            center: [pos.coords.longitude, pos.coords.latitude],
            zoom: 13,
            duration: 1500,
          })
        },
        (err) => console.error('Error getting location:', err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    }
  }, [])

  // Click-to-place handler
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const handleClick = (e: maplibregl.MapMouseEvent) => {
      handleMapPositionChange([e.lngLat.lat, e.lngLat.lng])
    }
    map.on('click', handleClick)
    return () => {
      map.off('click', handleClick)
    }
  }, [mapRef.current])

  function resetModal() {
    setFormData({
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
      toast.warning('Please fill in required fields.')
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
            'fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/30',
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
            <div className='sticky top-0 z-[9998] flex items-baseline justify-between border-b border-gray-200 bg-white py-5'>
              <h1 className='text-[26px] font-semibold'>Create Resource</h1>
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
                  className='focus:ring-primary/20 block h-10 w-full appearance-none rounded-xl border border-gray-200 px-4 py-2 text-base font-normal text-gray-900 transition-colors duration-200 focus:ring-2 focus:outline-none'
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
                    className='focus:ring-primary/20 block h-10 w-full appearance-none rounded-xl border border-gray-200 px-4 py-2 text-base font-normal text-gray-900 transition-colors duration-200 focus:ring-2 focus:outline-none'
                  >
                    <option value=''>Select the types of resource</option>
                    {resourceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-gray-900'>
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
                  className='focus:ring-primary/20 block min-h-28 w-full appearance-none rounded-xl border border-gray-200 px-4 py-2 text-base font-normal text-gray-900 transition-colors duration-200 focus:ring-2 focus:outline-none'
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
                <div className='h-48 w-full overflow-hidden rounded-xl border border-gray-200'>
                  <MapView
                    ref={mapRef}
                    center={
                      formData.parameters.location.latitude !== 0 &&
                      formData.parameters.location.longitude !== 0
                        ? [
                            formData.parameters.location.longitude,
                            formData.parameters.location.latitude,
                          ]
                        : [0, 0]
                    }
                    zoom={13}
                    scrollZoom={true}
                  >
                    <MapControls
                      position='bottom-right'
                      showZoom
                      showLocate
                      onLocate={(coords) => {
                        handleMapPositionChange([
                          coords.latitude,
                          coords.longitude,
                        ])
                      }}
                    />
                    {formData.parameters.location.latitude !== 0 &&
                      formData.parameters.location.longitude !== 0 && (
                        <MapMarker
                          longitude={formData.parameters.location.longitude}
                          latitude={formData.parameters.location.latitude}
                          draggable
                          onDragEnd={(lngLat) =>
                            handleMapPositionChange([lngLat.lat, lngLat.lng])
                          }
                        >
                          <MarkerContent>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg'>
                              <div className='h-2 w-2 rounded-full bg-white' />
                            </div>
                          </MarkerContent>
                        </MapMarker>
                      )}
                  </MapView>
                </div>
                {formData.parameters.location.latitude !== 0 &&
                  formData.parameters.location.longitude !== 0 && (
                    <div className='mt-2 space-y-1'>
                      <div className='text-sm text-gray-600'>
                        Coordinates:{' '}
                        {formData.parameters.location.latitude.toFixed(6)},{' '}
                        {formData.parameters.location.longitude.toFixed(6)}
                      </div>
                      <div className='text-xs text-gray-500'>
                        Location: {formData.parameters.location.city},{' '}
                        {formData.parameters.location.country}
                      </div>
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
                    'cursor-pointer rounded-xl border-2 border-dashed border-gray-200 px-6 py-10 text-center transition-colors hover:border-gray-200',
                    isDragOver && 'border-gray-200',
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className='flex flex-col items-center justify-center text-gray-900/30 hover:text-gray-900'>
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
                      className='rounded-xl border border-gray-200 px-4 py-2 transition-colors hover:cursor-pointer'
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
                        className='group relative h-26 w-full overflow-hidden rounded-xl'
                      >
                        <img
                          src={url}
                          alt={`preview-${index + 1}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white transition-opacity group-hover:cursor-pointer group-hover:bg-gray-900/30'
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
                  variant='secondary'
                  type='button'
                  onClick={closeModal}
                  className='w-30'
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  type='button'
                  onClick={handleSave}
                  className='w-30'
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
