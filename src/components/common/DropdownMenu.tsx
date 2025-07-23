import React, { useState, useRef, useEffect } from 'react'
import { Edit, Trash2, MoreHorizontal } from 'lucide-react'

interface DropdownMenuProps {
  onEdit: () => void
  onDelete: () => void
  className?: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onEdit,
  onDelete,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleEdit = () => {
    onEdit()
    setIsOpen(false)
  }

  const handleDelete = () => {
    onDelete()
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
        aria-label='More options'
      >
        <MoreHorizontal className='h-5 w-5' />
      </button>

      {isOpen && (
        <div className='absolute top-[100%] right-5 z-200 mt-1 w-32 rounded-lg border border-gray-200 bg-white shadow-lg'>
          <div className='py-2'>
            <button
              onClick={handleEdit}
              className='flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50'
            >
              <Edit className='mr-3 h-4 w-4 text-gray-400' />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className='flex w-full items-center px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50'
            >
              <Trash2 className='mr-3 h-4 w-4' />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
