import Map from '@/components/common/Map'
import { MapFilterProvider } from '@/components/common/MapFilterContext'
import { ActivityFeed } from '@/components/posts/ActivityFeed'
import { MapIcon, ListFilter } from 'lucide-react'
import { useState } from 'react'

type TabId = 'map' | 'activity'

const tabs: { id: TabId; label: string; Icon: typeof MapIcon }[] = [
  { id: 'map', label: 'Map', Icon: MapIcon },
  { id: 'activity', label: 'Activity Feed', Icon: ListFilter },
]

const MapPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>('map')

  return (
    <div className='fade-in flex h-[calc(100vh-88px)] flex-col'>
      {/* Tab bar */}
      <div className='flex shrink-0 gap-1 rounded-lg bg-gray-100 p-1'>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all duration-150 ${
              activeTab === id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className='h-4 w-4' />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className='min-h-0 flex-1'>
        {activeTab === 'map' && (
          <div className='flex h-full pt-4'>
            <MapFilterProvider>
              <Map />
            </MapFilterProvider>
          </div>
        )}
        {activeTab === 'activity' && <ActivityFeed />}
      </div>
    </div>
  )
}
export default MapPage
