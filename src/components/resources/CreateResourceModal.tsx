import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  X,
  CloudUpload,
  MapPin,
  Loader2,
  FlameKindling,
  PhoneCall,
  BriefcaseMedical,
} from 'lucide-react'
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
import RichTextEditor from '../RichTextEditor'
import {
  ResourceType,
  CreateResourceFormValues,
  CreateResourceFormValuesWithFiles,
} from '@/services/network/lib/resources'
import { backdropVariants, modalVariants } from '../posts/constants/constants'
import { toast } from '@/lib/toast'

const RESOURCE_TYPES = [
  { value: ResourceType.SURVIVAL, label: 'Survival', Icon: FlameKindling },
  { value: ResourceType.FIRST_AID, label: 'First Aid', Icon: BriefcaseMedical },
  { value: ResourceType.HOTLINE, label: 'Hotline', Icon: PhoneCall },
] as const

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
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [formData, setFormData] = useState<CreateResourceFormValues>({
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

  const mapRef = useRef<MapRef>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      parameters: { ...prev.parameters, description: html },
    }))
  }

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const getLocation = async (lat: number, lng: number) => {
    setIsGeocoding(true)
    try {
      const response = await apiClient.post(
        ApiConstantRoutes.paths.location.reverseGeocode,
        { lat, lng },
      )
      const data = await response.data
      return {
        city: data.city || 'Location Selected',
        country: data.country || '',
      }
    } catch (error) {
      console.error('Error fetching location:', error)
      return { city: 'Location Selected', country: '' }
    } finally {
      setIsGeocoding(false)
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
        location: { city: '', country: '', latitude: 0, longitude: 0 },
        address: { street: '', district: '', fullAddress: '' },
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

    const dataWithFiles: CreateResourceFormValuesWithFiles = {
      ...formData,
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

    setImages((prev) => [...prev, ...imageFiles])
    setPreviewUrls((prev) => [
      ...prev,
      ...imageFiles.map((file) => URL.createObjectURL(file)),
    ])
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previewUrls[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files) handleImageSelect(files)
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
    if (files) handleImageSelect(files)
  }

  const hasLocation =
    formData.parameters.location.latitude !== 0 &&
    formData.parameters.location.longitude !== 0

  const detectedCity = formData.parameters.location.city
  const detectedCountry = formData.parameters.location.country

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/30'
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          <motion.div
            className='custom-scroll relative max-h-[90vh] w-[756px] overflow-y-auto rounded-xl bg-white shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Header */}
            <div className='sticky top-0 z-[9998] border-b border-gray-200 bg-white px-8 py-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <h1 className='text-lg font-semibold text-gray-900'>
                    Create Resource
                  </h1>
                  <p className='mt-0.5 text-sm text-gray-500'>
                    Share survival tips, hotlines, or first aid guides with your
                    community.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
                >
                  <X className='h-5 w-5' strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className='px-8'>
              {/* Resource Type — icon card grid */}
              <div className='py-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Resource type <span className='text-danger'>*</span>
                </label>
                <div className='grid grid-cols-3 gap-2.5'>
                  {RESOURCE_TYPES.map(({ value, label, Icon }) => {
                    const isSelected = formData.resourceType === value
                    return (
                      <button
                        key={value}
                        type='button'
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            resourceType: value,
                          }))
                        }
                        className={clsx(
                          'flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 transition-all duration-150',
                          isSelected
                            ? 'border-primary bg-primary-light text-primary'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500',
                        )}
                      >
                        <Icon
                          className='h-5 w-5'
                          strokeWidth={isSelected ? 2.5 : 2}
                        />
                        <span className='text-xs font-medium'>{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className='border-t border-gray-100' />

              {/* Resource Name */}
              <div className='pt-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Resource name <span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder='e.g. CPR Guide, Emergency Hotline...'
                  className='focus:border-primary focus:ring-primary/20 block h-10 w-full rounded-lg border border-gray-200 px-3.5 text-sm text-gray-900 transition-colors duration-200 placeholder:text-gray-400 focus:ring-2 focus:outline-none'
                />
              </div>

              {/* Description */}
              <div className='pt-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Description <span className='text-danger'>*</span>
                </label>
                <RichTextEditor
                  content={formData.parameters.description}
                  onChange={handleDescriptionChange}
                  minHeight='96px'
                  className='focus-within:border-primary focus-within:ring-primary/20 block min-h-24 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 transition-colors duration-200 focus-within:ring-2'
                />
              </div>

              {/* Divider */}
              <div className='mt-5 border-t border-gray-100' />

              {/* Location */}
              <div className='py-5'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Location <span className='text-danger'>*</span>
                </label>
                <p className='mb-3 text-xs text-gray-400'>
                  {isGeocoding ? (
                    <span className='inline-flex items-center gap-1.5'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      Detecting location...
                    </span>
                  ) : (
                    'Click or drag the pin to set your location'
                  )}
                </p>

                {/* Detected location badge */}
                {detectedCity && detectedCountry && !isGeocoding && (
                  <div className='bg-primary-light text-primary mb-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm'>
                    <MapPin className='h-3.5 w-3.5' />
                    <span className='font-medium'>
                      {detectedCity}, {detectedCountry}
                    </span>
                  </div>
                )}

                <div className='h-56 w-full overflow-hidden rounded-xl border border-gray-200'>
                  <MapView
                    ref={mapRef}
                    center={
                      hasLocation
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
                    {hasLocation && (
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
              </div>

              {/* Divider */}
              <div className='border-t border-gray-100' />

              {/* Image Upload */}
              <div className='py-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Images
                  <span className='ml-1 text-xs font-normal text-gray-400'>
                    (optional)
                  </span>
                </label>
                <div
                  className={clsx(
                    'cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-150',
                    isDragOver
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragOver ? (
                    <p className='text-primary text-sm font-medium'>
                      Drop images here...
                    </p>
                  ) : (
                    <div className='flex flex-col items-center gap-2 text-gray-400'>
                      <CloudUpload className='h-8 w-8' strokeWidth={1.5} />
                      <div>
                        <p className='text-sm text-gray-500'>
                          Drop files or click to upload
                        </p>
                        <p className='mt-0.5 text-xs text-gray-400'>
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleFileChange}
                  className='hidden'
                />

                {/* Image previews */}
                {previewUrls.length > 0 && (
                  <div className='mt-3 grid grid-cols-5 gap-2.5'>
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className='group relative aspect-square w-full overflow-hidden rounded-lg'
                      >
                        <img
                          src={url}
                          alt={`preview-${index + 1}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className='sticky bottom-0 z-[9999] flex justify-end gap-3 border-t border-gray-100 bg-white py-4'>
                <Button variant='secondary' type='button' onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant='primary' type='button' onClick={handleSave}>
                  Create Resource
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

export default CreateResourceModal
