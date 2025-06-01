import clsx from 'clsx'
import React from 'react'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  itemList?: Map<string, string> | string[]
  disabled?: boolean
  placeholder?: string
  errorMessage?: string
  value?: string // for controlled input (Formik)
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void // Formik’s onChange
}

const DropDown: React.FC<Props> = (props) => {
  const {
    className,
    itemList,
    disabled,
    placeholder = 'Select',
    errorMessage,
    value = '',
    onChange,
    name,
  } = props

  return (
    <div className='w-full'>
      <div className='relative flex items-start flex-col '>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            'min-h-[50px] w-full rounded-lg border-1 px-3 py-2 text-base font-light ring-0 transition-colors duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500',
            disabled ? 'text-zinc-500' : 'border-zinc-300 text-black',
            value === '' ? 'text-zinc-400' : 'text-black',
            className
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
              ? Array.from(itemList.entries()).map(([key, val]) => (
                  <option
                    key={key}
                    value={key}
                    className='text-base font-light text-black'
                  >
                    {val}
                  </option>
                ))
              : null}
        </select>

        {errorMessage && (
          <div className='mt-1 ml-2 text-sm text-red-500'>{errorMessage}</div>
        )}
      </div>
    </div>
  )
}

export default DropDown
