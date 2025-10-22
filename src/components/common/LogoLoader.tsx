import CircleLogo from '@/assets/CircleLogo.svg?react'

const LogoLoader = () => {
  return (
    <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/30'>
      <div className='loader'>
        <div className='circle outer-circle'></div>
        <div className='circle inner-circle'></div>
        <div className='orbit'>
          <div className='ball'></div>
        </div>
        {/* Inner circle  */}
        <CircleLogo className='custom-svg rounded-full bg-white object-center' />
      </div>
    </div>
  )
}

export default LogoLoader
