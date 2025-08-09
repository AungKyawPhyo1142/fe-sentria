import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import { CreateActivityRequest } from '@/services/network/lib/activity'
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
  initialData?: Partial<CreateActivityFormValues> // For editing existing activities
}

const ActivityPostModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<CreateActivityFormValues>({
    activityType: initialData?.activityType || 'request',
    helpItems: initialData?.helpItems || [],
    quantities: initialData?.quantities || {},
    description: initialData?.description || '',
    city: initialData?.city || 'London',
    country: initialData?.country || 'United Kingdom',
    coordinates: initialData?.coordinates || null,
  })

  const helpOptions = [
    { id: 'food', label: 'Food' },
    { id: 'water', label: 'Water' },
    { id: 'shelter', label: 'Shelter' },
    { id: 'wifi', label: 'Wifi (Internet Connection)' },
  ]

  useEffect(() => {
    if (initialData) {
      setFormData({
        activityType: initialData.activityType || 'request',
        helpItems: initialData.helpItems || [],
        quantities: initialData.quantities || {},
        description: initialData.description || '',
        city: initialData.city || 'London',
        country: initialData.country || 'United Kingdom',
        coordinates: initialData.coordinates || null,
      })
    }
  }, [initialData])

  function resetModal() {
    const defaultData = {
      activityType: 'request' as const,
      helpItems: [],
      quantities: {},
      description: '',
      city: 'London',
      country: 'United Kingdom',
      coordinates: null,
    }

    // Use initialData if provided (for editing), otherwise use default
    setFormData(
      initialData
        ? {
            activityType: initialData.activityType || 'request',
            helpItems: initialData.helpItems || [],
            quantities: initialData.quantities || {},
            description: initialData.description || '',
            city: initialData.city || 'London',
            country: initialData.country || 'United Kingdom',
            coordinates: initialData.coordinates || null,
          }
        : defaultData,
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
    setFormData((prev) => ({
      ...prev,
      description: html,
    }))
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

      return {
        ...prev,
        helpItems: newHelpTypes,
        quantities: newQuantities,
      }
    })
  }

  function handleQuantityChange(helpType: string, quantity: number) {
    setFormData((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [helpType]: quantity,
      },
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
            className='custom-scroll relative max-h-[90vh] w-[756px] rounded-lg bg-white px-8 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Header */}
            <div className='sticky top-0 z-20 flex items-baseline justify-between border-b-1 border-black/30 bg-white py-5'>
              <h1 className='text-2xl font-semibold'>
                {initialData ? 'Edit Activity' : 'Request / Offer Help'}
              </h1>
              <button
                onClick={closeModal}
                className='absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700'
              >
                <X className='h-8 w-8' strokeWidth={2} />
              </button>
            </div>

            {/* Form */}
            <form className='space-y-5 pt-6'>
              <div>
                <h3 className='mb-3 text-[32px] font-semibold'>
                  {formData.activityType === 'request'
                    ? 'Request for help'
                    : 'Offer help'}
                </h3>
                <p className='mb-6 text-[20px] font-medium text-black/50'>
                  Please fill up the following form to{' '}
                  {formData.activityType === 'request' ? 'request' : 'offer'}{' '}
                  help.
                </p>

                <div className='space-y-2'>
                  <p className='mb-2 text-xl font-semibold'>I want to:</p>
                  <div className='ml-2 flex gap-4'>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='activityType'
                        checked={formData.activityType === 'offer'}
                        onChange={() => handleTypeChange('offer')}
                        className='accent-primary mr-2 h-[30px] w-[30px]'
                      />
                      <span className='text-base font-light'>Offer help</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='activityType'
                        checked={formData.activityType === 'request'}
                        onChange={() => handleTypeChange('request')}
                        className='accent-primary mr-2 h-[30px] w-[30px]'
                      />
                      <span className='text-base font-light'>
                        Request for help
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <p className='mb-2 text-xl font-semibold'>
                  What kind of help can you provide?
                </p>
                <div className='space-y-3 rounded-[10px] border border-zinc-300 px-8 py-6'>
                  {helpOptions.map((option) => (
                    <div key={option.id} className='flex flex-col space-y-2'>
                      <label className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={formData.helpItems.includes(option.id)}
                          onChange={() => handleHelpTypeToggle(option.id)}
                          className='accent-primary mr-3 h-6 w-6'
                        />
                        <span className='text-base font-light'>
                          {option.label}
                        </span>
                      </label>
                      {formData.helpItems.includes(option.id) &&
                        option.id !== 'wifi' && (
                          <div className='ml-9 flex items-center gap-2'>
                            <span className='text-sm font-light text-black'>
                              For how many people:
                            </span>
                            <input
                              type='number'
                              min='1'
                              value={formData.quantities[option.id] || 3}
                              onChange={(e) =>
                                handleQuantityChange(
                                  option.id,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className='h-8 w-12 rounded-[10px] border border-zinc-300 px-2 py-2 text-sm'
                            />
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  Description <span className='text-red'>*</span>
                </label>
                <RichTextEditor
                  content={formData.description}
                  onChange={handleDescriptionChange}
                  minHeight='112px'
                  className='block min-h-28 w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                />
              </div>

              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  Your location <span className='text-red'>*</span>
                </label>
                <p className='mb-2 text-sm font-thin text-black/50'>
                  Click or drag the pin to set your exact location
                </p>
                <div className='h-60 w-full overflow-hidden rounded-[10px] border border-zinc-300'>
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
                        setFormData((prev) => ({
                          ...prev,
                          coordinates: pos,
                          // These will be automatically determined from coordinates later
                          city: 'Location Selected',
                          country: 'United Kingdom',
                        }))
                      }}
                    />
                  </MapContainer>
                </div>
                {formData.coordinates && (
                  <div className='mt-2 space-y-1'>
                    <div className='text-sm text-gray-600'>
                      Coordinates: {formData.coordinates[0].toFixed(6)},{' '}
                      {formData.coordinates[1].toFixed(6)}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Location: {formData.city}, {formData.country}
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className='sticky bottom-0 z-20 flex justify-end space-x-5 bg-white py-4'>
                <Button
                  className='w-[116px] bg-black/25'
                  type='button'
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  destructive={formData.activityType === 'request'}
                  primary={formData.activityType === 'offer'}
                  onClick={handleSubmit}
                  className='w-[116px]'
                  type='button'
                >
                  {initialData
                    ? 'Update Activity'
                    : formData.activityType === 'request'
                      ? 'Request for help'
                      : 'Help people in need'}
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

export default ActivityPostModal
export type { CreateActivityFormValues }
