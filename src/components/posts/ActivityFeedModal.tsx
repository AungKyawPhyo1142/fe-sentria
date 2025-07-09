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
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder='Some texts here'
              className='h-42 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-[16px]'
            />
          </div>

          <div>
            <div className='mb-3 flex items-center justify-between'>
              <label className='mb-2 block text-2xl font-medium'>
                Your location
              </label>
              <div className='text-sm font-medium text-black/50'>
                Drag this pin to set your exact location
              </div>
            </div>
            <div className='relative'>
              <MapPin className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400' />
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

          <div className='flex items-center justify-between pt-4 text-[20px]'>
            <Button onClick={closeModal} className='h-16 w-35 bg-black/25'>
              Cancel
            </Button>
            <Button
              destructive={formData.type === 'request'}
              primary={formData.type === 'offer'}
              onClick={handleSubmit}
              className={`h-16 w-60`}
              disabled={
                !formData.description.trim() ||
                !formData.location.trim() ||
                formData.helpTypes.length === 0
              }
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
