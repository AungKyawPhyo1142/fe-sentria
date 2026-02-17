import { apiClient } from '@/services/network/apiClient'
import ReactDOM from 'react-dom'
import { CreateActivityRequest } from '@/services/network/lib/activity'
import { ApiConstantRoutes } from '@/services/network/path'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  X,
  HandHeart,
  Megaphone,
  Utensils,
  Droplets,
  HouseIcon,
  Wifi,
  MapPin,
  Loader2,
  Minus,
  Plus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import Button from '../common/Button'
import LocateButton from '../common/LocateButton'
import RichTextEditor from '../RichTextEditor'
import { backdropVariants, modalVariants } from './constants/constants'

type ActivityType = 'offer' | 'request'

interface CreateActivityFormValues
  extends Pick<CreateActivityRequest, 'description'> {
  activityType: ActivityType
  helpItems: string[]
  quantities: { [key: string]: number }
  city: string
  country: string
  coordinates: [number, number] | null
}

const HELP_OPTIONS = [
  { id: 'food', label: 'Food', Icon: Utensils },
  { id: 'water', label: 'Water', Icon: Droplets },
  { id: 'shelter', label: 'Shelter', Icon: HouseIcon },
  { id: 'wifi', label: 'Wifi', Icon: Wifi },
] as const

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
  onSubmit?: (data: CreateActivityFormValues) => void
  initialData?: Partial<CreateActivityFormValues>
}

const ActivityPostModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  initialData,
}) => {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [formData, setFormData] = useState<CreateActivityFormValues>({
    activityType: initialData?.activityType || 'request',
    helpItems: initialData?.helpItems || [],
    quantities: initialData?.quantities || {},
    description: initialData?.description || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    coordinates: initialData?.coordinates || null,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        activityType: initialData.activityType || 'request',
        helpItems: initialData.helpItems || [],
        quantities: initialData.quantities || {},
        description: initialData.description || '',
        city: initialData.city || '',
        country: initialData.country || '',
        coordinates: initialData.coordinates || null,
      })
    }
  }, [initialData])

  function resetModal() {
    setFormData(
      initialData
        ? {
            activityType: initialData.activityType || 'request',
            helpItems: initialData.helpItems || [],
            quantities: initialData.quantities || {},
            description: initialData.description || '',
            city: initialData.city || '',
            country: initialData.country || '',
            coordinates: initialData.coordinates || null,
          }
        : {
            activityType: 'request',
            helpItems: [],
            quantities: {},
            description: '',
            city: '',
            country: '',
            coordinates: null,
          },
    )
  }

  function closeModal() {
    setIsOpen(false)
    resetModal()
  }

  function handleTypeChange(type: ActivityType) {
    setFormData((prev) => ({ ...prev, activityType: type }))
  }

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({ ...prev, description: html }))
  }

  function handleHelpTypeToggle(helpType: string) {
    setFormData((prev) => {
      const isSelected = prev.helpItems.includes(helpType)
      const newHelpTypes = isSelected
        ? prev.helpItems.filter((t) => t !== helpType)
        : [...prev.helpItems, helpType]

      const newQuantities = { ...prev.quantities }
      if (!isSelected) {
        newQuantities[helpType] = 3
      } else {
        delete newQuantities[helpType]
      }

      return { ...prev, helpItems: newHelpTypes, quantities: newQuantities }
    })
  }

  function handleQuantityChange(helpType: string, quantity: number) {
    if (quantity < 1) return
    setFormData((prev) => ({
      ...prev,
      quantities: { ...prev.quantities, [helpType]: quantity },
    }))
  }

  function handleSubmit() {
    if (!formData.description.trim() || formData.helpItems.length === 0) {
      alert('Please fill in all required fields.')
      return
    }
    onSubmit?.(formData)
    closeModal()
  }

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

  const isRequest = formData.activityType === 'request'

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
                    {initialData ? 'Edit Activity' : 'Need or Offer Help'}
                  </h1>
                  <p className='mt-0.5 text-sm text-gray-500'>
                    {initialData
                      ? 'Update your help request or offer details.'
                      : 'Connect with people nearby who need or can provide help.'}
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
              {/* Activity Type — two cards */}
              <div className='py-5'>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  I want to:
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    type='button'
                    onClick={() => handleTypeChange('offer')}
                    className={clsx(
                      'flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150',
                      !isRequest
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500',
                    )}
                  >
                    <HandHeart
                      className='h-5 w-5'
                      strokeWidth={!isRequest ? 2.5 : 2}
                    />
                    <div className='text-left'>
                      <span className='text-sm font-medium'>Offer Help</span>
                      <p
                        className={clsx(
                          'text-xs',
                          !isRequest ? 'text-primary/70' : 'text-gray-400',
                        )}
                      >
                        I can provide assistance
                      </p>
                    </div>
                  </button>
                  <button
                    type='button'
                    onClick={() => handleTypeChange('request')}
                    className={clsx(
                      'flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 transition-all duration-150',
                      isRequest
                        ? 'border-danger bg-danger-light text-danger'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500',
                    )}
                  >
                    <Megaphone
                      className='h-5 w-5'
                      strokeWidth={isRequest ? 2.5 : 2}
                    />
                    <div className='text-left'>
                      <span className='text-sm font-medium'>Request Help</span>
                      <p
                        className={clsx(
                          'text-xs',
                          isRequest ? 'text-danger/70' : 'text-gray-400',
                        )}
                      >
                        I need assistance
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Help Items — toggleable cards with icons */}
              <div className='pb-5'>
                <label className='mb-2 block text-sm font-medium text-gray-700'>
                  What kind of help?{' '}
                  <span className='text-danger'>*</span>
                </label>
                <div className='grid grid-cols-4 gap-2.5'>
                  {HELP_OPTIONS.map(({ id, label, Icon }) => {
                    const isSelected = formData.helpItems.includes(id)
                    return (
                      <button
                        key={id}
                        type='button'
                        onClick={() => handleHelpTypeToggle(id)}
                        className={clsx(
                          'flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 transition-all duration-150',
                          isSelected
                            ? isRequest
                              ? 'border-danger bg-danger-light text-danger'
                              : 'border-primary bg-primary-light text-primary'
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

                {/* Quantity inputs for selected items */}
                {formData.helpItems.length > 0 && (
                  <div className='mt-3 space-y-2'>
                    {formData.helpItems
                      .filter((id) => id !== 'wifi')
                      .map((id) => {
                        const option = HELP_OPTIONS.find((o) => o.id === id)
                        if (!option) return null
                        const qty = formData.quantities[id] || 3
                        return (
                          <div
                            key={id}
                            className='flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5'
                          >
                            <span className='text-sm text-gray-600'>
                              {option.label} — for how many people?
                            </span>
                            <div className='flex items-center gap-2'>
                              <button
                                type='button'
                                onClick={() =>
                                  handleQuantityChange(id, qty - 1)
                                }
                                className='flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100'
                              >
                                <Minus className='h-3.5 w-3.5' />
                              </button>
                              <span className='w-6 text-center text-sm font-medium text-gray-900'>
                                {qty}
                              </span>
                              <button
                                type='button'
                                onClick={() =>
                                  handleQuantityChange(id, qty + 1)
                                }
                                className='flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100'
                              >
                                <Plus className='h-3.5 w-3.5' />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className='border-t border-gray-100' />

              {/* Description */}
              <div className='py-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  Description <span className='text-danger'>*</span>
                </label>
                <RichTextEditor
                  content={formData.description}
                  onChange={handleDescriptionChange}
                  minHeight='96px'
                  className='block min-h-24 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 transition-colors duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
                />
              </div>

              {/* Divider */}
              <div className='border-t border-gray-100' />

              {/* Location */}
              <div className='py-5'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Your location <span className='text-danger'>*</span>
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

                {/* Location badge */}
                {formData.city && formData.country && !isGeocoding && (
                  <div
                    className={clsx(
                      'mb-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm',
                      isRequest
                        ? 'bg-danger-light text-danger'
                        : 'bg-primary-light text-primary',
                    )}
                  >
                    <MapPin className='h-3.5 w-3.5' />
                    <span className='font-medium'>
                      {formData.city}, {formData.country}
                    </span>
                  </div>
                )}

                <div className='h-56 w-full overflow-hidden rounded-xl border border-gray-200'>
                  <MapContainer
                    center={formData.coordinates || [0, 0]}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <LocateButton position={formData.coordinates} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    <DraggableMarker
                      position={formData.coordinates}
                      onPositionChange={(pos) => {
                        getLocation(pos[0], pos[1]).then((location) => {
                          setFormData((prev) => ({
                            ...prev,
                            coordinates: pos,
                            city: location.city,
                            country: location.country,
                          }))
                        })
                      }}
                    />
                  </MapContainer>
                </div>
              </div>

              {/* Footer */}
              <div className='sticky bottom-0 z-[9999] flex justify-end gap-3 border-t border-gray-100 bg-white py-4'>
                <Button variant='secondary' type='button' onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant={
                    !initialData && isRequest ? 'danger' : 'primary'
                  }
                  onClick={handleSubmit}
                  type='button'
                >
                  {initialData
                    ? 'Update Activity'
                    : isRequest
                      ? 'Request Help'
                      : 'Offer Help'}
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

export default ActivityPostModal
export type { CreateActivityFormValues }
