import { Locate } from "lucide-react"
import { useMap } from "react-leaflet"

const LocateButton = ({ position }: { position: [number, number] | null }) => {
  const map = useMap()

  return (
    <div className='group bg-primary absolute top-3 left-15 z-[400] cursor-pointer rounded-sm p-2 text-white'>
      <Locate
        className=''
        onClick={() => {
          if (position) {
            map.flyTo(position, 15)
          }
        }}
      />
      <div className='pointer-events-none absolute top-1/2 left-full ml-2 w-auto -translate-y-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
        Locate me
      </div>
    </div>
  )
}

export default LocateButton