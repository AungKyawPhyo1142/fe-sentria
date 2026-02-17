import clsx from 'clsx'
import React, { useState } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: string
  hint?: string
  showSearchIcon?: boolean
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
    showSearchIcon,
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
        className='absolute right-3 cursor-pointer text-gray-400 hover:text-gray-700'
        size={18}
        strokeWidth={1.5}
      />
    ) : (
      <EyeOff
        onClick={onEyeIconClick}
        className='absolute right-3 cursor-pointer text-gray-400 hover:text-gray-700'
        size={18}
        strokeWidth={1.5}
      />
    )
  }

  const handleSearchIcon = () => {
    return showSearchIcon ? (
      <Search className='absolute left-3 text-gray-400' size={18} />
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
            'focus:border-primary focus:ring-primary/20 h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 ring-0 transition-colors duration-150 outline-none placeholder:text-gray-400 focus:ring-2',
            disabled ? 'bg-gray-50 text-gray-400' : 'border-gray-200',
            type === 'password' && 'pr-10',
            type === 'file' && 'opacity-0',
            error ? 'border-danger' : '',
            showSearchIcon && 'pl-10',
            className,
          )}
          readOnly={readOnly}
          ref={inputRef}
        />
        {type === 'password' && handlePasswordDisplayIcon()}
      </div>
      {hint && !error && (
        <span className='block pt-1 pl-1 text-xs text-gray-400'>{hint}</span>
      )}
      {error && (
        <span className='text-danger block pt-1 pl-1 text-xs'>{error}</span>
      )}
    </div>
  )
}

export default Input
