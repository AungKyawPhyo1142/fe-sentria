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
      <div className='relative flex flex-col items-start'>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            'focus:border-primary h-10 w-full rounded-lg border px-3 py-2 text-base font-normal ring-0 transition-colors duration-200 outline-none placeholder:text-gray-400',
            disabled ? 'text-gray-500' : 'border-gray-200 text-gray-900',
            value === '' ? 'text-gray-400' : 'text-gray-900',
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
                  className='text-base font-normal text-gray-900'
                >
                  {item}
                </option>
              ))
            : itemList instanceof Map
              ? Array.from(itemList.entries()).map(([key, val]) => (
                  <option
                    key={key}
                    value={key}
                    className='text-base font-normal text-gray-900'
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
