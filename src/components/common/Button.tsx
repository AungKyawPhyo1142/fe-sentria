import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
  className?: string
}

const variantStyles: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 bg-white',
  ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
  danger: 'bg-danger text-white hover:opacity-90',
}

const sizeStyles: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-8 px-3 text-sm rounded-md',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-base rounded-lg',
}

const Spinner = ({ variant }: { variant: Props['variant'] }) => {
  const colorClass =
    variant === 'secondary' || variant === 'outline' || variant === 'ghost'
      ? 'text-gray-700'
      : 'text-white'
  return (
    <svg
      className={clsx('h-5 w-5 animate-spin', colorClass)}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      ></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  )
}

const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex cursor-pointer items-center justify-center text-sm font-medium transition-all duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {!loading ? (
        (children ?? 'Button')
      ) : (
        <div className='flex justify-center'>
          <Spinner variant={variant} />
        </div>
      )}
    </button>
  )
}

export default Button
