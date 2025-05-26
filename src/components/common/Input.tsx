import clsx from 'clsx'
import React, { useState } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  classsName?: string
  error?: string
  hint?: string
  primary?: boolean
  secondary?: boolean
  showSearchIcon?: boolean // Add the new search icon
  inputRef?: React.Ref<HTMLInputElement>
}

type InputState = {
  inputType: React.HTMLInputTypeAttribute
  showPassword: boolean
}

const Input: React.FC<Props> = (props) => {
  const {
    className,
    error,
    hint,
    primary,
    secondary,
    showSearchIcon, // Destructure the new icon
    defaultValue,
    type,
    readOnly,
    inputRef,
    disabled,
    ...rest
  } = props

  const [inputState, setInputState] = useState<InputState>({
    inputType: type || 'text',
    showPassword: false,
  })

  // toggle password visibility
  const onEyeIconClick = () => {
    setInputState((prev) => ({
      inputType: prev.inputType === 'password' ? 'text' : 'password',
      showPassword: !prev.showPassword,
    }))
  }

  const handlePasswordDisplayIcon = () => {
    return inputState.showPassword ? (
      <Eye
        onClick={onEyeIconClick}
        className='absolute right-4 cursor-pointer'
        size={20}
        strokeWidth={1}
        color={'black'}
      />
    ) : (
      <EyeOff
        onClick={onEyeIconClick}
        className='absolute right-4 cursor-pointer'
        size={20}
        strokeWidth={1}
        color={'black'}
      />
    )
  }
  const handleSearchIcon = () => {
    return showSearchIcon ? (
      <Search
        className='absolute left-4 cursor-pointer'
        size={20}
        color={'gray'}
      />
    ) : null
  }

  return (
    <div className='w-full'>
      <div className='relative flex items-center'>
        {handleSearchIcon()}
        <input
          {...rest}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          autoComplete={props.autoComplete}
          disabled={disabled}
          type={inputState.inputType}
          className={clsx(
            'min-h-[50px] w-full rounded-lg border-1 px-3 py-2 text-base font-light ring-0 transition-colors duration-200 outline-none placeholder:text-zinc-400 focus:border-zinc-500',
            disabled ? 'text-zinc-500' : 'border-zinc-300 text-black',
            primary && 'text-white outline-none',
            secondary && 'bg-[#FFFFFF] !text-[#121212]',
            type === 'password' && 'pr-8',
            type === 'file' && 'opacity-0',
            error ? 'border-red-500' : 'border-gray-500',
            className,
          )}
          readOnly={readOnly}
          ref={inputRef}
        />
        {type === 'password' && handlePasswordDisplayIcon()}
      </div>
      {hint && !error && (
        <span className='text-dark-400 block pt-1 pl-2 text-sm'>{hint}</span>
      )}
      {error && (
        <span className='block pt-1 pl-2 text-sm text-red-500'>{error}</span>
      )}
    </div>
  )
}

export default Input
