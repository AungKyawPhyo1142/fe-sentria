import { Locate } from 'lucide-react'
import { useMap } from 'react-leaflet'

const LocateButton = ({ position }: { position: [number, number] | null }) => {
  const map = useMap()

  return (
    <div className='group absolute top-24 left-3 z-[400]'>
      <button
        onClick={() => {
          if (position) {
            map.flyTo(position, 15)
          }
        }}
        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-gray-50'
      >
        <Locate className='h-4 w-4 text-gray-700' />
      </button>
      <div className='pointer-events-none absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100'>
        Locate me
      </div>
    </div>
  )
}

export default LocateButton
