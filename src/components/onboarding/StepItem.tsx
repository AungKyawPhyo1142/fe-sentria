import React from 'react'

interface StepItemProps {
  id: number
  title: string
  isActive: boolean
  isLast: boolean
  click: (id: number) => void
}

// for each step label
const StepItem: React.FC<StepItemProps> = ({
  id,
  title,
  isActive,
  isLast,
  click,
}) => {
  return (
    <div className='flex items-baseline'>
      <div className='mr-7 flex flex-col items-center'>
        <button
          onClick={() => click(id)}
          className={`bg-primary flex h-16 w-16 cursor-pointer items-center justify-center rounded-full text-[24px] text-white ${isActive ? '' : 'opacity-55 hover:opacity-100'}`}
        >
          {id}
        </button>
        {!isLast && (
          <div
            className={`bg-primary h-12 w-1 ${isActive ? '' : 'opacity-55'}`}
          ></div>
        )}
      </div>
      <div className='pt-1'>
        <div
          className={`text-primary text-left text-[32px] ${isActive ? '' : 'opacity-55'}`}
        >
          {title}
        </div>
      </div>
    </div>
  )
}

export default StepItem
