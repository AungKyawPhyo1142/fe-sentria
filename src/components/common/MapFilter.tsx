import { Droplets, HouseIcon, MapPinHouse, Utensils, Wifi } from 'lucide-react'
import { useMapFilter } from './MapFilterContext'

const MapFilter = () => {
  const {
    selectedTypes,
    toggleType,
    needed,
    setNeeded,
    available,
    setAvailable,
  } = useMapFilter()
  const filterItemList = [
    { label: 'Shelter', id: 'shelter', icon: <HouseIcon strokeWidth={1.5} /> },
    { label: 'Water', id: 'water', icon: <Droplets strokeWidth={1.5} /> },
    { label: 'Food', id: 'food', icon: <Utensils strokeWidth={1.5} /> },
    { label: 'Wifi', id: 'wifi', icon: <Wifi strokeWidth={1.5} /> },
    {
      label: 'Nearest Location',
      id: 'near',
      icon: <MapPinHouse strokeWidth={1.5} />,
    },
  ]
  return (
    <div className='flex flex-col items-center justify-center gap-y-5'>
      <div className='flex w-[219px] flex-col gap-y-4 rounded-lg border border-[#33333430] p-4'>
        <h2 className='text-xl font-normal text-[#33333430]'>Filter By</h2>
        <hr className='my-1 border-t border-[#33333430]' />
        <div className='flex flex-col gap-y-2'>
          {filterItemList.map((item) => (
            <div
              key={item.id}
              className='flex flex-row items-center justify-between gap-x-2'
            >
              <div className='flex flex-row items-center gap-x-2'>
                {item.icon}
                <label htmlFor={item.id} className='text-sm text-gray-700'>
                  {item.label}
                </label>
              </div>
              <input
                type='checkbox'
                id={item.id}
                className='accent-primary h-4 w-4 rounded border-gray-300'
                checked={selectedTypes.has(item.id)}
                onChange={() => toggleType(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className={`min-h-[50px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${
          needed
        ? 'bg-red text-white border-red'
        : 'bg-transparent text-red border-red hover:bg-red/80 hover:text-white'
        }`}
        onClick={() => setNeeded(!needed)}
      >
        Help Needed
      </button>
      <button
        className={`min-h-[50px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${
          available
        ? 'bg-secondary text-white border-secondary'
        : 'bg-transparent text-secondary border-secondary hover:bg-secondary/80 hover:text-white'
        }`}
        onClick={() => setAvailable(!available)}
      >
        Help Available
      </button>
    </div>
  )
}

export default MapFilter
