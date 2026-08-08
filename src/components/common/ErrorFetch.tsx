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
    <div className='flex flex-col items-center justify-center'>
      <ErrorFetchIcon className='size-[300px]' />
      <div className='flex flex-col items-center justify-center gap-y-3'>
        <h1 className='text-3xl font-medium text-[#939090]'>{heading}</h1>
        <h3 className='text-base font-light text-[#A0A0A0]'>{subHeading}</h3>
        {/* button to reload */}
        <Button
          tertiary
          className='flex items-center justify-center px-7'
          onClick={handleRefetch}
          disabled={isRefetching}
        >
          <RotateCw
            size={35}
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
