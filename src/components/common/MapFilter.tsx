import { Droplets, HouseIcon, MapPinHouse, Utensils, Wifi } from 'lucide-react'
import clsx from 'clsx'
import { useMapFilter } from './MapFilterContext'

const filterItemList = [
  {
    label: 'Shelter',
    id: 'SHELTER',
    icon: <HouseIcon className='h-4 w-4' strokeWidth={1.5} />,
  },
  {
    label: 'Water',
    id: 'WATER',
    icon: <Droplets className='h-4 w-4' strokeWidth={1.5} />,
  },
  {
    label: 'Food',
    id: 'FOOD',
    icon: <Utensils className='h-4 w-4' strokeWidth={1.5} />,
  },
  {
    label: 'Wifi',
    id: 'WIFI',
    icon: <Wifi className='h-4 w-4' strokeWidth={1.5} />,
  },
  {
    label: 'Nearby',
    id: 'near',
    icon: <MapPinHouse className='h-4 w-4' strokeWidth={1.5} />,
  },
]

const MapFilter = () => {
  const {
    selectedTypes,
    toggleType,
    needed,
    setNeeded,
    available,
    setAvailable,
  } = useMapFilter()

  return (
    <div className='flex w-64 shrink-0 flex-col gap-3'>
      {/* Filter checkboxes */}
      <div className='rounded-xl border border-gray-200 p-4'>
        <h3 className='mb-3 text-xs font-medium tracking-wide text-gray-400 uppercase'>
          Filter by
        </h3>
        <div className='flex flex-col gap-2.5'>
          {filterItemList.map((item) => (
            <label
              key={item.id}
              htmlFor={`map-filter-${item.id}`}
              className='flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50'
            >
              <div className='flex items-center gap-3 text-gray-600'>
                {item.icon}
                <span className='text-sm'>{item.label}</span>
              </div>
              <input
                type='checkbox'
                id={`map-filter-${item.id}`}
                className='accent-primary h-3.5 w-3.5 cursor-pointer rounded'
                checked={selectedTypes.has(item.id)}
                onChange={() => toggleType(item.id)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Status toggles */}
      <div className='flex flex-col gap-2'>
        <button
          onClick={() => setNeeded(!needed)}
          className={clsx(
            'flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150',
            needed
              ? 'border-danger bg-danger text-white'
              : 'border-danger/30 text-danger hover:bg-danger-light',
          )}
        >
          Help Needed
        </button>
        <button
          onClick={() => setAvailable(!available)}
          className={clsx(
            'flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150',
            available
              ? 'border-info bg-info text-white'
              : 'border-info/30 text-info hover:bg-info-light',
          )}
        >
          Help Available
        </button>
      </div>
    </div>
  )
}

export default MapFilter
