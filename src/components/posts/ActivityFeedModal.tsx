import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import Button from '../common/Button'
import LocateButton from '../common/LocateButton'
import RichTextEditor from '../RichTextEditor'

type ActivityType = 'offer' | 'request'

interface ActivityFormData {
  type: ActivityType
  helpTypes: string[]
  quantities: { [key: string]: number }
  description: string
  location: string
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
  onSubmit?: (data: ActivityFormData) => void
}

const ActivityPostModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    type: 'request',
    helpTypes: [],
    quantities: {},
    description: '',
    location: '',
    coordinates: null,
  })

  const helpOptions = [
    { id: 'food', label: 'Food' },
    { id: 'water', label: 'Water' },
    { id: 'shelter', label: 'Shelter' },
    { id: 'wifi', label: 'Wifi (Internet Connection)' },
  ]

  function resetModal() {
    setFormData({
      type: 'request',
      helpTypes: [],
      quantities: {},
      description: '',
      location: '',
      coordinates: null,
    })
  }

  function closeModal() {
    setIsOpen(false)
    resetModal()
  }

  function handleTypeChange(type: ActivityType) {
    setFormData((prev) => ({ ...prev, type }))
  }

  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev,
        description: html,
      },
    }))
  }

  function handleHelpTypeToggle(helpType: string) {
    setFormData((prev) => {
      const isSelected = prev.helpTypes.includes(helpType)
      const newHelpTypes = isSelected
        ? prev.helpTypes.filter((t) => t !== helpType)
        : [...prev.helpTypes, helpType]

      const newQuantities = { ...prev.quantities }
      if (!isSelected) {
        newQuantities[helpType] = 3
      } else {
        delete newQuantities[helpType]
      }

      return {
        ...prev,
        helpTypes: newHelpTypes,
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
    if (
      !formData.description.trim() ||
      !formData.location.trim() ||
      formData.helpTypes.length === 0
    ) {
      return
    }
    onSubmit?.(formData)
    closeModal()
  }

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className='relative max-h-[90vh] w-full max-w-[50%] overflow-y-auto rounded-lg bg-white px-10'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-black/30 bg-white py-6'>
          <h2 className='text-2xl font-medium text-black'>
            Request / Offer Help
          </h2>
          <button
            onClick={closeModal}
            className='cursor-pointer text-black hover:text-gray-700'
          >
            <X className='h-7 w-7' />
          </button>
        </div>

        <div className='space-y-6 py-5'>
          <div>
            <h3 className='mb-3 text-[32px] font-semibold'>
              {formData.type === 'request' ? 'Request for help' : 'Offer help'}
            </h3>
            <p className='mb-6 text-[20px] font-medium text-black/50'>
              Please fill up the following form to{' '}
              {formData.type === 'request' ? 'request' : 'offer'} help.
            </p>

            <div className='space-y-2'>
              <p className='text-[24px] font-medium'>I want to:</p>
              <div className='ml-2 flex gap-4'>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='activityType'
                    checked={formData.type === 'offer'}
                    onChange={() => handleTypeChange('offer')}
                    className='accent-primary mr-2 h-[30px] w-[30px]'
                  />
                  <span className='text-[20px] font-medium'>Offer help</span>
                </label>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='activityType'
                    checked={formData.type === 'request'}
                    onChange={() => handleTypeChange('request')}
                    className='accent-primary mr-2 h-[30px] w-[30px]'
                  />
                  <span className='text-[20px] font-medium'>
                    Request for help
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <p className='mb-3 text-2xl font-medium'>
              What kind of help can you provide?
            </p>
            <div className='space-y-3 rounded-xl border border-black/30 px-8 py-6'>
              {helpOptions.map((option) => (
                <div key={option.id} className='flex flex-col space-y-2'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={formData.helpTypes.includes(option.id)}
                      onChange={() => handleHelpTypeToggle(option.id)}
                      className='accent-primary mr-3 h-6 w-6'
                    />
                    <span className='text-[20px] font-medium'>
                      {option.label}
                    </span>
                  </label>
                  {formData.helpTypes.includes(option.id) &&
                    option.id !== 'wifi' && (
                      <div className='ml-9 flex items-center gap-2'>
                        <span className='text-[16px] font-medium text-black'>
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
                          className='h-8 w-12 rounded border border-black/30 px-2 py-2 text-[16px]'
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className='mb-2 block text-2xl font-medium'>
              Description
            </label>
            <RichTextEditor
              content={formData.description}
              onChange={handleDescriptionChange}
              minHeight='128px'
              className='h-44'
            />
          </div>

          <div>
            <div className='mb-3 flex items-center justify-between'>
              <label className='mb-2 block text-2xl font-medium'>
                Your location
              </label>
              <div className='text-sm font-medium text-black/50'>
                Click or drag the pin to set your exact location
              </div>
            </div>
            <div className='h-60 w-full overflow-hidden rounded-lg border border-gray-300'>
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
                      location: `${pos[0].toFixed(6)}, ${pos[1].toFixed(6)}`,
                    }))
                  }}
                />
              </MapContainer>
            </div>
            {formData.coordinates && (
              <div className='mt-2 text-sm text-gray-600'>
                Coordinates: {formData.coordinates[0].toFixed(6)},{' '}
                {formData.coordinates[1].toFixed(6)}
              </div>
            )}
          </div>

          <div className='flex items-center justify-between pt-4 text-[20px]'>
            <Button onClick={closeModal} className='h-8 w-25 bg-black/25'>
              Cancel
            </Button>
            <Button
              destructive={formData.type === 'request'}
              primary={formData.type === 'offer'}
              onClick={handleSubmit}
              className={`h-8 w-45`}
            >
              {formData.type === 'request'
                ? 'Request for help'
                : 'Help people in need'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityPostModal
