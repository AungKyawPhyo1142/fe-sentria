import React from 'react'
import DefaultIcon from '@/assets/step-1.svg?react'

interface StepContentProps {
  title: string
  content: string
  iconPath?: string
  isActive: boolean
}

// for each step content box
const StepContent: React.FC<StepContentProps> = ({
  title,
  content,
  iconPath,
  isActive,
}) => {
  return (
    <div
      className={`border-grey-5 mb-8 w-xl rounded-lg border px-8 py-6 hover:brightness-120 ${isActive ? '' : 'opacity-40'}`}
    >
      <div className='text-primary mb-8 flex items-center'>
        {iconPath ? (
          <img src={iconPath} alt='Icon' className='mr-2 h-12 w-12' />
        ) : (
          <DefaultIcon className='mr-2 h-12 w-12' />
        )}
        <span className='text-[32px]'>{title}</span>
      </div>
      <p className='text-primary text-[24px] leading-loose'>{content}</p>
    </div>
  )
}

export default StepContent
