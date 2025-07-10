import { useState, useRef, useEffect } from 'react'
import { X, MapPin, CloudUpload, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import Button from '../common/Button'
import Input from '../common/Input'
import RichTextEditor from '../RichTextEditor'
import {
  ResourceType,
  CreateResourceFormValues,
  CreateResourceFormValuesWithFiles,
} from '@/services/network/lib/resources'

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
            className='cursor-pointer text-gray-500 hover:text-gray-700'
          >
            <X className='h-8 w-8' />
          </button>
        </div>

        <div className='space-y-6 p-6'>
          {/* Resource Name */}
          <div>
            <label className='mb-2 block text-[20px] font-medium text-black'>
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
              className='w-full rounded-lg border border-[#33333410] text-[16px] font-light'
            />
          </div>

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
                    resourceType: e.target.value as ResourceType,
                  }))
                }
                className='w-full appearance-none rounded-lg border border-[#33333430] p-3 text-[16px] font-normal'
              >
                <option value=''>Select the types of resource</option>
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className='pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-black' />
            </div>
          </div>

          {/* Title/Description with Rich Text Editor */}
          <div>
            <label className='mb-2 block text-[20px] font-medium text-black'>
              Add a First Aid Tip or share your experience{' '}
              <span className='text-red'>*</span>
            </label>

            <RichTextEditor
              content={formData.parameters.description}
              onChange={handleDescriptionChange}
              minHeight='128px'
              className='h-48'
            />
          </div>

          {/* Location & Address Placeholder */}
          <div>
            <div className='mb-3 flex items-baseline justify-between'>
              <label className='mb-2 text-[20px] font-medium text-black'>
                Location
              </label>
            </div>
            <div className='flex h-48 items-center justify-center rounded-lg border bg-gray-50 p-4'>
              <div className='text-center text-gray-500'>
                <MapPin className='mx-auto mb-2 h-8 w-8' />
                <p className='text-sm font-medium'>
                  Map integration coming soon
                </p>
                <p className='mt-2 text-xs text-[#33333480]'>
                  Location and address information will be provided through the
                  map interface
                </p>
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
              <button className='mt-2 flex h-7 w-21 items-center justify-center rounded-lg border-1 px-4 py-2 text-[12px] font-medium hover:bg-[#33333425]'>
                Browse
              </button>
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
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 space-x-4 border-t border-[#33333410] bg-white px-6 py-4'>
          <div className='flex justify-between space-x-4'>
            <Button
              onClick={closeModal}
              className='flex h-8 w-30 items-center justify-center rounded-lg border bg-[#33333425] px-6 py-3 text-[15px] font-medium text-white'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              primary={true}
              className='flex h-8 w-30 items-center justify-center rounded-lg px-6 py-3 font-medium text-white'
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateResourceModal
