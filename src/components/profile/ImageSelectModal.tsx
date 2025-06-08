import clsx from 'clsx'
import { X, Image } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Button from '@/components/common/Button'

interface Props {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSave?: (file: File | null) => void
}

const ImageSelectModal: React.FC<Props> = ({
  className,
  isOpen,
  setIsOpen,
  onSave,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function resetModal() {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setIsDragOver(false)
  }

  function closeModal() {
    setIsOpen(false)
    resetModal()
  }

  function handleSave() {
    onSave?.(selectedFile)
    closeModal()
  }

  function handleFileSelect(file: File) {
    if (file?.type.startsWith('image/')) {
      // Cleanup previous URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  function handleDragLeave(event: React.DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)

    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/40',
        className,
      )}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className='relative w-[90%] max-w-lg rounded-lg bg-white px-12 py-10 shadow-lg'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />

        <button
          onClick={closeModal}
          className='absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-700'
        >
          <X className='h-6 w-6' strokeWidth={2} />
        </button>

        <div className='flex flex-col items-center space-y-6 text-center'>
          <div
            className={clsx(
              'mx-auto flex h-75 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors',
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-black/15 hover:bg-black/25',
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Preview'
                className='h-full w-full rounded-lg object-cover'
              />
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <Image
                  className='mb-2 h-24 w-24 text-[#33333430]'
                  strokeWidth={0.5}
                />
                <p className='text-sm font-medium text-[#33333430]'>
                  {isDragOver
                    ? 'Drop image here'
                    : 'Click here to upload profile image or drag & drop'}
                </p>
              </div>
            )}
          </div>

          <div className='flex w-full space-x-4'>
            <Button
              outline
              className='h-13 flex-1 text-[20px] font-medium'
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              className='bg-primary h-13 flex-1 text-[20px] font-medium'
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageSelectModal
