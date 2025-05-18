import clsx from 'clsx'
import React, { useState } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  itemList?: Map<string, string> | string[]
  disabled?: boolean
  placeholder?: string // like "Country"
}

const DropDown: React.FC<Props> = (props) => {
  const { className, itemList, disabled, placeholder = 'Select' } = props

  const [selectedValue, setSelectedValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <div className='w-full'>
      <div className='relative flex items-center'>
        <select
          value={selectedValue}
          onChange={handleChange}
          disabled={disabled}
          className={clsx(
            'min-h-[50px] w-full rounded-lg border-1 px-3 py-2 text-base font-light ring-0 transition-colors duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500',
            disabled ? 'text-zinc-500' : 'border-zinc-300 text-black',
            selectedValue === '' ? 'text-zinc-400' : 'text-black',
            className,
          )}
        >
          <option value='' disabled hidden>
            {placeholder}
          </option>

          {Array.isArray(itemList)
            ? itemList.map((item, index) => (
                <option
                  key={index}
                  value={item}
                  className='text-base font-light text-black'
                >
                  {item}
                </option>
              ))
            : itemList instanceof Map
              ? Array.from(itemList.entries()).map(([key, value]) => (
                  <option
                    key={key}
                    value={key}
                    className='text-base font-light text-black'
                  >
                    {value}
                  </option>
                ))
              : null}
        </select>
      </div>
    </div>
  )
}

export default DropDown
