import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

/*
    TODO: change the color & style of the button as needed
*/

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  icon?: string
  loading?: boolean
  primary?: boolean
  secondary?: boolean
  destructive?: boolean
  tertiary?: boolean
  outline?: boolean
  primaryOutline?: boolean
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
}
const Spinner = () => {
  return (
    <svg
      className='h-7 w-7 animate-spin text-white'
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
const Button: React.FC<Props> = (props) => {
  const {
    className,
    loading,
    primary,
    secondary,
    tertiary,
    destructive,
    outline,
    primaryOutline,
    children,
    ...rest // rest of the props, this comes from ButtonHTMLAttributes<HTMLButtonElement>
  } = props

  return (
    <button
      {...rest}
      className={clsx(
        'min-h-[50px] cursor-pointer rounded-lg py-2 text-base font-light text-white transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100',
        primary && 'bg-primary text-black disabled:bg-[#B3B3B3]',
        secondary && 'bg-secondary disabled:bg-[#B3B3B3]',
        tertiary && 'bg-black/25 text-white',
        destructive && 'bg-red disabled:bg-[#B3B3B3]',
        primaryOutline &&
          'border-primary !text-primary border hover:bg-black/8',
        outline &&
          'border-secondary !text-secondary hover:bg-secondary border hover:!text-white disabled:bg-[#B3B3B3]',
        className,
      )}
    >
      {!loading ? (
        (children ?? 'Button')
      ) : (
        <div className='flex justify-center'>
          <Spinner />
        </div>
      )}
    </button>
  )
}

export default Button
