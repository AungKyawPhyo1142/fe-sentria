import Map from '@/components/common/Map'
import { MapFilterProvider } from '@/components/common/MapFilterContext'
import { ActivityFeed } from '@/components/posts/ActivityFeed'
import { useState } from 'react'
import ResourcePage from '@/components/resources/ResourcePage'
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
    { id: 2, label: 'Activity Feed', component: <ActivityFeed /> },
    { id: 3, label: 'Resources', component: <ResourcePage /> },
  ]

  return (
    <div className='fade-in flex h-screen flex-col items-center justify-start'>
      <div className='flex w-full flex-row items-center justify-between gap-x-5 rounded-lg bg-gray-50 p-2'>
        {pageList.map((item) => (
          <button
            key={item.id}
            name={item.label}
            className={`min-h-[30px] w-full cursor-pointer rounded-lg border py-2 text-base font-normal transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${
              page === item.id
                ? 'border-gray-200 bg-white text-gray-900'
                : 'border-none text-gray-400 hover:bg-gray-200 hover:text-gray-900'
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
