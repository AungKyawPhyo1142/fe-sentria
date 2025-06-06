import clsx from 'clsx'
import { X, Image } from 'lucide-react'
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
  function closeModal() {
    setIsOpen(false)
  }

  function handleSave() {
    // Handle save logic here
    onSave?.(null) // Pass selected file
    setIsOpen(false)
  }

  return (
    <div>
      {isOpen && (
        <div
          className={clsx(
            'fixed inset-0 z-50 flex items-center justify-center bg-black/40',
            className,
          )}
        >
          <div className='relative w-[90%] max-w-lg rounded-lg bg-white px-12 py-10 shadow-lg'>
            {/* Top Right Close (X) Button */}
            <button
              onClick={closeModal}
              className='absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-700'
            >
              <X className='h-6 w-6 cursor-pointer' strokeWidth={2} />
            </button>

            <div className='flex flex-col items-center space-y-6 text-center'>
              {/* Image Upload Area */}
              <div className='w-full'>
                <div className='mx-auto flex h-75 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-black/15 transition-colors hover:bg-black/25'>
                  <div className='flex flex-col items-center justify-center'>
                    <Image
                      className='mb-2 h-24 w-24 text-[#33333430]'
                      strokeWidth={0.5}
                    />
                    <p className='text-sm font-medium text-[#33333430]'>
                      Click here to upload profile image
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className='mt-10 flex w-full justify-between space-x-4'>
                <Button
                  outline={true}
                  className='h-13 w-37 flex-1 text-[20px] font-medium'
                  onClick={closeModal}
                >
                  Cancel
                </Button>

                <Button
                  className='bg-primary h-13 w-37 flex-1 text-[20px] font-medium'
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageSelectModal
