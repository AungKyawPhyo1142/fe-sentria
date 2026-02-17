import SentriaLogo from '@/assets/sentria-logo.svg?react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className='flex min-h-screen'>
      {/* Left Panel - Brand */}
      <div className='bg-primary relative hidden w-[45%] overflow-hidden md:flex md:flex-col md:items-center md:justify-center'>
        {/* Decorative circles */}
        <div className='bg-primary-dark/20 absolute -top-20 -left-20 h-72 w-72 rounded-full' />
        <div className='bg-primary-dark/15 absolute -right-16 -bottom-16 h-96 w-96 rounded-full' />
        <div className='absolute top-1/4 right-12 h-24 w-24 rounded-full bg-white/5' />
        <div className='absolute bottom-1/3 left-10 h-16 w-16 rounded-full bg-white/8' />

        {/* Content */}
        <div className='relative z-10 flex flex-col items-center gap-8 px-12'>
          <SentriaLogo className='h-14 w-auto brightness-0 invert' />
          <div className='text-center'>
            <p className='text-3xl leading-tight font-light text-white lg:text-4xl'>
              Stay safe.
            </p>
            <p className='text-3xl leading-tight font-light text-white lg:text-4xl'>
              Stay connected.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className='flex w-full flex-col items-center justify-center bg-white px-6 py-12 md:w-[55%]'>
        {/* Mobile logo - shown only on small screens */}
        <div className='mb-8 md:hidden'>
          <SentriaLogo className='h-10 w-auto' />
        </div>

        <div className='w-full max-w-sm'>{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout
