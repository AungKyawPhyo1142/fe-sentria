import { useState, useRef, useEffect } from 'react'
import { X, MapPin, Trash, CloudUpload, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSave?: (resourceData: ResourceFormData) => void
}

interface ResourceFormData {
  title: string
  description: string
  resourceType: string
  images: File[]
  location: {
    lat: number
    lng: number
    address: string
  } | null
  hotlineNumbers: string[]
  hotlineEmail: string
}

const CreateResourceModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  onSave,
}) => {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    resourceType: '',
    images: [],
    location: null,
    hotlineNumbers: [''],
    hotlineEmail: '',
  })

  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resourceTypes = [
    'First Aid',
    'Shelter',
    'Water',
    'Food',
    'Medical',
    'Emergency Contact',
  ]

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  function resetModal() {
    setFormData({
      title: '',
      description: '',
      resourceType: '',
      images: [],
      location: null,
      hotlineNumbers: [''],
      hotlineEmail: '',
    })
    previewUrls.forEach((url) => URL.revokeObjectURL(url))
    setPreviewUrls([])
    setIsDragOver(false)
  }

  function closeModal() {
    setIsOpen(false)
    resetModal()
  }

  function handleSave() {
    if (!formData.title.trim() || !formData.resourceType) {
      alert('Please fill in required fields')
      return
    }
    onSave?.(formData)
    closeModal()
  }

  function handleImageSelect(files: FileList) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (imageFiles.length === 0) return

    const newImages = [...formData.images, ...imageFiles]
    const newPreviewUrls = [
      ...previewUrls,
      ...imageFiles.map((file) => URL.createObjectURL(file)),
    ]

    setFormData((prev) => ({ ...prev, images: newImages }))
    setPreviewUrls(newPreviewUrls)
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previewUrls[index])
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
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

  function addHotlineNumber() {
    setFormData((prev) => ({
      ...prev,
      hotlineNumbers: [...prev.hotlineNumbers, ''],
    }))
  }

  function updateHotlineNumber(index: number, value: string) {
    setFormData((prev) => ({
      ...prev,
      hotlineNumbers: prev.hotlineNumbers.map((num, i) =>
        i === index ? value : num,
      ),
    }))
  }

  function removeHotlineNumber(index: number) {
    if (formData.hotlineNumbers.length > 1) {
      setFormData((prev) => ({
        ...prev,
        hotlineNumbers: prev.hotlineNumbers.filter((_, i) => i !== index),
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className='relative max-h-[90vh] w-full max-w-[50%] overflow-y-auto rounded-lg bg-white px-6'>
        <div className='sticky top-0 z-10 flex items-baseline justify-between border-b border-[#33333430] bg-white px-3 py-4'>
          <h2 className='text-[24px] font-semibold'>Create Resource</h2>
          <button
            onClick={closeModal}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='h-8 w-8' />
          </button>
        </div>

        <div className='space-y-6 p-6'>
          {/* Resource Type Selection */}
          <div>
            <label className='mb-2 block text-[20px] font-medium text-black'>
              What kind of resource you wanna share?{' '}
              <span className='text-red'>*</span>
            </label>
            <p className='mb-3 text-xs font-medium text-[#33333450]'>
              You can select multiple categories
            </p>
            <div className='relative z-0'>
              <select
                value={formData.resourceType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    resourceType: e.target.value,
                  }))
                }
                className='w-full appearance-none rounded-lg border border-[#33333430] p-3 text-[16px] font-normal'
              >
                <option value=''>Select the types of resource</option>
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-black' />
            </div>
          </div>

          {/* Title/Description */}
          <div>
            <label className='mb-2 block text-[20px] font-medium text-black'>
              Add a First Aid Tip or share your experience{' '}
              <span className='text-red'>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder='Write your tip or experience here...'
              className='h-32 w-full resize-none rounded-lg border border-[#33333430] p-3 text-[16px] font-extralight focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Location */}
          <div>
            <div className='mb-3 flex items-baseline justify-between'>
              <label className='mb-2 text-[20px] font-medium text-black'>
                Your location
              </label>
              <p className='mb-3 text-[14px] font-normal text-[#33333450]'>
                Drag the pin to set your exact location
              </p>
            </div>
            <div className='flex h-48 items-center justify-center rounded-lg border bg-gray-50 p-4'>
              <div className='text-center text-gray-500'>
                <MapPin className='mx-auto mb-2 h-8 w-8' />
                <p className='text-sm'>Map view would go here</p>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className='mb-2 block text-[20px] font-medium text-black'>
              Drop or upload your images here
            </label>

            <div
              className={clsx(
                'flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed p-8 text-center text-[#33333430] transition-colors',
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-black hover:border-black/50',
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CloudUpload className='mx-auto mb-2 h-5 w-5' />
              <p className='text-sm'>
                {isDragOver ? 'Drop images here' : 'Drop a file here to upload'}
              </p>
              <p className='mb-2 text-sm'>or</p>
              <button className='mt-2 flex h-7 w-21 items-center justify-center rounded-lg px-4 py-2 text-[12px] font-medium'>
                Browse
              </button>
            </div>

            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept='image/*'
              onChange={handleFileChange}
              className='hidden'
            />

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className='mt-4 grid grid-cols-4 gap-4'>
                {previewUrls.map((url, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className='aspect-square w-full rounded-lg object-cover'
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className='absolute -top-2 -right-2 rounded-full bg-[#33333450] p-1 text-white hover:bg-black'
                    >
                      <X className='h-5 w-5' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hotline Numbers */}
          <div>
            <label className='text-[24px] font-medium text-black'>
              Enter Your Hotline Number
            </label>
            <div className='mt-4 space-y-3'>
              {formData.hotlineNumbers.map((number, index) => (
                <div
                  key={index}
                  className='flex w-[45%] items-center space-x-2'
                >
                  <input
                    type='tel'
                    value={number}
                    onChange={(e) => updateHotlineNumber(index, e.target.value)}
                    placeholder='+12345'
                    className='flex-1 rounded-lg border border-[#33333410] p-3 text-[13px] font-semibold focus:border-transparent'
                  />
                  {formData.hotlineNumbers.length > 1 && (
                    <button
                      onClick={() => removeHotlineNumber(index)}
                      className='text-red p-2 hover:text-red-700'
                    >
                      <Trash className='h-5 w-5' />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addHotlineNumber}
                className='border-primary/60 flex items-center rounded-lg border px-4 py-2 text-sm font-semibold text-[#33333450] hover:text-[#333334]'
              >
                <span>Add another number</span>
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className='mb-2 block text-[24px] font-medium text-black'>
              Enter Your Hotline Email (if Available)
            </label>
            <input
              type='email'
              value={formData.hotlineEmail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hotlineEmail: e.target.value,
                }))
              }
              placeholder='your.email@example.com'
              className='w-full rounded-lg border border-[#33333410] p-3 text-[13px] font-semibold focus:border-transparent focus:ring-2'
            />
          </div>
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 flex justify-end space-x-4 border-t border-[#33333410] bg-white px-6 py-4'>
          <div className='flex space-x-4'>
            <button
              onClick={closeModal}
              className='border-primary flex h-8 w-30 items-center justify-center rounded-lg border bg-white px-6 py-3 text-[15px] font-medium text-black hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='bg-primary/60 hover:bg-primary flex h-8 w-30 items-center justify-center rounded-lg px-6 py-3 font-medium text-white'
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateResourceModal
