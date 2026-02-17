import React, { useState } from 'react'
import ErrorFetchIcon from '@/assets/icons/NoNetwrok.svg?react'
import Button from './Button'
import { RotateCw } from 'lucide-react'
import { QueryObserverResult } from '@tanstack/react-query'

interface ErrorFetchProps {
  heading: string
  subHeading: string
  reFetch: () => Promise<QueryObserverResult> | void
}

const ErrorFetch: React.FC<ErrorFetchProps> = ({
  heading,
  subHeading,
  reFetch,
}) => {
  const [isRefetching, setIsRefetching] = useState(false)
  const handleRefetch = async () => {
    try {
      setIsRefetching(true)
      await reFetch()
    } finally {
      setIsRefetching(false)
    }
  }
  return (
    <div className='flex flex-col items-center justify-center py-20'>
      <ErrorFetchIcon className='h-48 w-48 opacity-60' />
      <div className='mt-6 flex flex-col items-center justify-center gap-y-2 text-center'>
        <h2 className='text-lg font-semibold text-gray-700'>{heading}</h2>
        <p className='max-w-sm text-sm text-gray-400'>{subHeading}</p>
        <Button
          variant='secondary'
          size='sm'
          className='mt-4'
          onClick={handleRefetch}
          disabled={isRefetching}
        >
          <RotateCw
            size={16}
            className={`transition-transform duration-700 ${
              isRefetching ? 'animate-spin' : ''
            }`}
          />
        </Button>
      </div>
    </div>
  )
}

export default ErrorFetch
