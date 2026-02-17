import clsx from 'clsx'

const HelpInfo = ({ label, type }: { label: string; type: string }) => {
  return (
    <div className='flex items-center gap-1.5 rounded-md bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm'>
      <div
        className={clsx(
          'h-2.5 w-2.5 rounded-full',
          type === 'available' ? 'bg-info' : 'bg-danger',
        )}
      />
      <span className='text-xs font-medium text-gray-700'>{label}</span>
    </div>
  )
}

export default HelpInfo
