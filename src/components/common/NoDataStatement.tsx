import React from 'react'
import NoDataIcon from '@/assets/icons/NoData.svg?react'

interface NoDataStatementProps {
  heading: string
  subHeading: string
}

const NoDataStatement: React.FC<NoDataStatementProps> = ({
  heading,
  subHeading,
}) => {
  return (
    <div className='flex flex-col items-center justify-center py-20'>
      <NoDataIcon className='h-48 w-48 opacity-60' />
      <div className='mt-6 flex flex-col items-center justify-center gap-y-2 text-center'>
        <h2 className='text-lg font-semibold text-gray-700'>{heading}</h2>
        <p className='max-w-sm text-sm text-gray-400'>{subHeading}</p>
      </div>
    </div>
  )
}

export default NoDataStatement
