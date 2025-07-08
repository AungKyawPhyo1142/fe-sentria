import Map from '@/components/common/Map'
import { MapFilterProvider } from '@/components/common/MapFilterContext'
import { useState } from 'react'
const MapPage = () => {
  const [page, setPage] = useState(1)
  const pageList = [
    {
      id: 1,
      label: 'Map',
      component: (
        <div className='flex w-full flex-row items-start py-10'>
          <MapFilterProvider>
            <Map />
          </MapFilterProvider>
        </div>
      ),
    },
    { id: 2, label: 'Posts', component: <div>Activity Feed</div> },
    { id: 3, label: 'Resources', component: <div>Resources</div> },
  ]

  return (
    <div className='fade-in flex h-screen flex-col items-center justify-start '>
      <div className='flex w-full flex-row items-center justify-between gap-x-5 rounded-lg bg-[#3333340e] p-2 '>
        {pageList.map((item) => (
          <button
            key={item.id}
            name={item.label}
            className={`min-h-[30px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${
              page === item.id
                ? 'border-[#33333430] bg-white text-black'
                : 'border-none text-gray-400 hover:bg-gray-200 hover:text-black'
            }`}
            onClick={() => setPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {pageList.find((item) => item.id === page)?.component}
    </div>
  )
}
export default MapPage
