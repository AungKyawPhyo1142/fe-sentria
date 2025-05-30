import clsx from 'clsx'
import { CircleAlert, CircleCheck, CircleX, Info } from 'lucide-react'
import Button from './Button'
interface Props {
  className?: string
  title?: string
  content?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  type?: 'info' | 'warning' | 'error' | 'success' | 'custom'
  icon?: React.ReactNode
  withButtons?: boolean
  onClick?: () => void
}

const Modal: React.FC<Props> = ({
  className,
  title,
  content,
  isOpen,

  setIsOpen,
  onClick,
  icon,
  withButtons = true,
  type = 'info',
}) => {
  function closeModal() {
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
          <div className='relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg'>
            {/* Top Right Close (X) Button */}
            <button
              onClick={closeModal}
              className='absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-700'
            >
              &times;
            </button>

            <div className='flex flex-col items-center space-y-4 text-center'>
              {type && (
                <div
                  className={clsx(
                    'flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-2xl',
                  )}
                >
                  {type === 'info' && (
                    <Info
                      className='text-secondary'
                      size={40}
                      strokeWidth={1}
                    />
                  )}
                  {type === 'warning' && (
                    <CircleAlert
                      className='text-amber-600'
                      size={40}
                      strokeWidth={1}
                    />
                  )}
                  {type === 'error' && (
                    <CircleX className='text-red' size={40} strokeWidth={1} />
                  )}
                  {type === 'success' && (
                    <CircleCheck
                      className='text-primary'
                      size={40}
                      strokeWidth={1}
                    />
                  )}
                  {type === 'custom' && icon}
                </div>
              )}

              {title && (
                <h2 className='text-xl font-bold text-gray-800'>{title}</h2>
              )}

              {content && <p className='text-gray-600'>{content}</p>}

              {withButtons && (
                <div className='flex space-x-9'>
                  <Button
                    outline
                    className='w-[100px] px-5'
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    className={clsx(
                      'w-[100px] px-5',
                      type === 'error'
                        ? 'bg-red hover:bg-red/90'
                        : type === 'success'
                          ? 'bg-primary hover:bg-primary/90'
                          : type === 'warning'
                            ? 'bg-amber-600 hover:bg-amber-500'
                            : 'bg-secondary hover:bg-secondary/90',
                    )}
                    onClick={onClick}
                  >
                    Confirm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Modal
