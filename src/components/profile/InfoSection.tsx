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
        <h3 className='text-2xl font-medium text-gray-900'>{name}</h3>
        {isVerified && <VerifyBadge className='text-info h-5 w-5' />}
      </div>
      {isVerified && (
        <span className='text-sm font-medium text-gray-300'>
          Verified Profile
        </span>
      )}
      <div className='mt-3 flex items-center text-sm text-gray-900'>
        <MapPinned className='mr-1 h-6 w-6 stroke-1' />
        <span className='ml-2 text-base font-medium'>{location}</span>
      </div>
    </div>
  )
}
