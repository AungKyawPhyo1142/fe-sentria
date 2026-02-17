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
      <div className='flex shrink-0 items-center gap-6 border-b border-gray-200'>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors duration-150 ${
              activeTab === id
                ? 'border-primary text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
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
