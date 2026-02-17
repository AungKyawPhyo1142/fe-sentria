import React from 'react'
import NoFavIcon from '@/assets/icons/NoFav.svg?react'

interface NoFavStatementProps {
  heading: string
  subHeading: string
}

const NoFavStatement: React.FC<NoFavStatementProps> = ({
  heading,
  subHeading,
}) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <NoFavIcon className='size-[300px]' />
      <div className='flex flex-col items-center justify-center gap-y-3'>
        <h1 className='text-3xl font-medium text-gray-400'>{heading}</h1>
        <h3 className='text-base font-normal text-gray-400'>{subHeading}</h3>
      </div>
    </div>
  )
}
export default NoFavStatement
