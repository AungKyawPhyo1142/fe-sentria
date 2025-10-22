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
        <h1 className='text-3xl font-medium text-[#939090]'>{heading}</h1>
        <h3 className='text-base font-light text-[#A0A0A0]'>{subHeading}</h3>
      </div>
    </div>
  )
}
export default NoFavStatement
