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
    <div className='flex flex-col items-center justify-center gap-y-5  w-2/6'>
      <div className='flex flex-col  w-full gap-y-4 rounded-lg border border-[#33333430] p-4'>
        <h2 className='text-lg font-light text-[#3333344d]'>Filter by</h2>
        <hr className='mb-1 border-t border-[#33333430]' />
        <div className='flex flex-col gap-y-5'>
          {filterItemList.map((item) => (
            <label
              key={item.id}
              htmlFor={item.id}
              className='flex flex-row items-center cursor-pointer justify-between gap-x-2'
            >
              <div className='flex flex-row items-center gap-x-5'>
                {item.icon}
                <span className='text-base text-gray-700'>
                  {item.label}
                </span>
              </div>
              <input
                type='checkbox'
                id={item.id}
                className='accent-primary h-4 w-4 rounded border-gray-300 cursor-pointer'
                checked={selectedTypes.has(item.id)}
                onChange={() => toggleType(item.id)}
              />
            </label>
          ))}
        </div>
      </div>
      <button
        className={`min-h-[50px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${needed
          ? 'bg-red text-white border-red'
          : 'bg-transparent text-red border-red hover:bg-red/80 hover:text-white'
          }`}
        onClick={() => setNeeded(!needed)}
      >
        Help Needed
      </button>
      <button
        className={`min-h-[50px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${available
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
