import VerifyBadge from '@/assets/VerifiedBadge.svg?react'
import { MapPinned } from 'lucide-react'

interface InfoSectionProps {
  name: string
  location: string
  isVerified: boolean
}

export default function InfoSection({
  name,
  location,
  isVerified,
}: InfoSectionProps) {
  return (
    <div className='ml-4 flex flex-col justify-center'>
      <div className='flex items-center space-x-3'>
        <h3 className='text-[25px] font-medium text-black'>{name}</h3>
        {isVerified && <VerifyBadge className='h-5 w-5 text-[#1560BD]' />}
      </div>
      {isVerified && (
        <span className='text-sm font-medium text-[#33333430]'>
          Verified Profile
        </span>
      )}
      <div className='mt-3 flex items-center text-sm text-black'>
        <MapPinned className='mr-1 h-6 w-6 stroke-1' />
        <span className='ml-2 text-[16px] font-medium'>{location}</span>
      </div>
    </div>
  )
}
