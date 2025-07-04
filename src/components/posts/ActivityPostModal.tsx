import { useState } from 'react'
import { X, MapPin } from 'lucide-react'
import Button from '../common/Button'

type ActivityType = 'offer' | 'request'

interface ActivityFormData {
  type: ActivityType
  helpTypes: string[]
  quantities: { [key: string]: number }
  description: string
  location: string
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
    })
  }

  function closeModal() {
    setIsOpen(false)
    resetModal()
  }

  function handleTypeChange(type: ActivityType) {
    setFormData((prev) => ({ ...prev, type }))
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
      <div className='relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white'>
        <div className='sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4'>
          <h2 className='text-lg font-medium text-gray-600'>
            Request / Offer Help
          </h2>
          <button
            onClick={closeModal}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='space-y-6 p-6'>
          <div>
            <h3 className='mb-4 text-xl font-medium'>
              {formData.type === 'request' ? 'Request for help' : 'Offer help'}
            </h3>
            <p className='mb-4 text-sm text-gray-500'>
              Please fill up the following form to{' '}
              {formData.type === 'request' ? 'request' : 'offer'} help.
            </p>

            <div className='space-y-2'>
              <p className='text-sm font-medium'>I want to:</p>
              <div className='flex gap-4'>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='activityType'
                    checked={formData.type === 'offer'}
                    onChange={() => handleTypeChange('offer')}
                    className='mr-2'
                  />
                  <span className='text-sm'>Offer help</span>
                </label>
                <label className='flex items-center'>
                  <input
                    type='radio'
                    name='activityType'
                    checked={formData.type === 'request'}
                    onChange={() => handleTypeChange('request')}
                    className='mr-2'
                  />
                  <span className='text-sm'>Request for help</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <p className='mb-3 text-sm font-medium'>
              What kind of help do you need?
            </p>
            <div className='space-y-3'>
              {helpOptions.map((option) => (
                <div
                  key={option.id}
                  className='flex items-center justify-between'
                >
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={formData.helpTypes.includes(option.id)}
                      onChange={() => handleHelpTypeToggle(option.id)}
                      className='mr-3 h-4 w-4 text-blue-600'
                    />
                    <span className='text-sm'>{option.label}</span>
                  </label>

                  {formData.helpTypes.includes(option.id) &&
                    option.id !== 'wifi' && (
                      <div className='flex items-center gap-2'>
                        <span className='text-xs text-gray-500'>
                          For how many people
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
                          className='w-12 rounded border border-gray-300 px-2 py-1 text-xs'
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder='Some texts here'
              className='h-24 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>
              Your location
            </label>
            <div className='relative'>
              <MapPin className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
              <input
                type='text'
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder='Drag this pin to set your exact location'
                className='w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-sm'
              />
            </div>
          </div>

          <div className='flex gap-3 pt-4'>
            <Button outline onClick={closeModal} className='flex-1'>
              Cancel
            </Button>
            <Button
              destructive
              onClick={handleSubmit}
              className='flex-1'
              disabled={
                !formData.description.trim() ||
                !formData.location.trim() ||
                formData.helpTypes.length === 0
              }
            >
              {formData.type === 'request' ? 'Request for help' : 'Offer help'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityPostModal
