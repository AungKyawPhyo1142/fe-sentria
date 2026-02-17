import { useGetActivities } from '@/services/network/lib/activity'
import { useEffect, useRef, useState } from 'react'
import {
  Map as MapView,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapControls,
  type MapRef,
} from '@/components/ui/map'
import { isWithinDistance } from '@/lib/geo'
import FoodAvailable from '../../assets/foodBlue.svg'
import FoodNeeded from '../../assets/foodRed.svg'
import ShelterAvailable from '../../assets/houseBlue.svg'
import ShelterNeeded from '../../assets/houseRed.svg'
import WaterAvailable from '../../assets/waterBlue.svg'
import WaterNeeded from '../../assets/waterRed.svg'
import WifiAvailable from '../../assets/wifiBlue.svg'
import WifiNeeded from '../../assets/wifiRed.svg'
import HelpInfo from './HelpInfo'
import MapFilter from './MapFilter'
import { useMapFilter } from './MapFilterContext'

const iconMap: Record<string, Record<string, string>> = {
  SHELTER: { REQUEST: ShelterNeeded, OFFER: ShelterAvailable },
  WATER: { REQUEST: WaterNeeded, OFFER: WaterAvailable },
  FOOD: { REQUEST: FoodNeeded, OFFER: FoodAvailable },
  WIFI: { REQUEST: WifiNeeded, OFFER: WifiAvailable },
}

function getMarkerIcon(helpType: string, activityType: string): string {
  return iconMap[helpType]?.[activityType] || ShelterAvailable
}

type DisasterHelp = {
  id: string
  helpType: string
  activityType: 'REQUEST' | 'OFFER'
  position: [number, number]
}

const Map = () => {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            duration: 1500,
          })
        },
        (err) => {
          console.error('Error getting location:', err)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    }
  }, [])

  const { data: activitiesData } = useGetActivities()

  const disasterHelpList: DisasterHelp[] =
    activitiesData?.data.map((activity) => ({
      id: activity.id,
      helpType: activity.helpItems[0].helpType,
      activityType: activity.activityType,
      position: [activity.latitude, activity.longitude],
    })) || []

  const { selectedTypes, needed, available } = useMapFilter()

  const filteredHelpList = disasterHelpList.filter((help) => {
    const matchesStatus =
      (needed && help.activityType === 'REQUEST') ||
      (available && help.activityType === 'OFFER')

    const matchesType =
      selectedTypes.size === 0 || selectedTypes.has(help.helpType)

    const matchesNear =
      !selectedTypes.has('near') ||
      (position && isWithinDistance(position, help.position, 500))

    return matchesStatus && matchesType && matchesNear
  })

  return (
    <div className='flex h-full w-full gap-5'>
      {/* Map container */}
      <div className='relative flex-1 overflow-hidden rounded-xl border border-gray-200'>
        <MapView
          ref={mapRef}
          center={position ? [position[1], position[0]] : [0, 0]}
          zoom={13}
          scrollZoom={true}
        >
          <MapControls
            position='top-right'
            showZoom
            showLocate
            onLocate={(coords) => {
              setPosition([coords.latitude, coords.longitude])
            }}
          />

          {/* Legend */}
          <div className='absolute bottom-4 left-4 z-10 flex items-center gap-2'>
            <HelpInfo label='Available' type='available' />
            <HelpInfo label='Needed' type='needed' />
          </div>

          {/* User location marker */}
          {position && (
            <MapMarker longitude={position[1]} latitude={position[0]}>
              <MarkerContent>
                <div className='relative flex h-6 w-6 items-center justify-center'>
                  <div className='absolute h-6 w-6 animate-ping rounded-full bg-blue-400/30' />
                  <div className='relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg' />
                </div>
              </MarkerContent>
              <MarkerTooltip>You are here!</MarkerTooltip>
            </MapMarker>
          )}

          {/* Activity markers */}
          {filteredHelpList.map((help) => (
            <MapMarker
              key={help.id}
              longitude={help.position[1]}
              latitude={help.position[0]}
            >
              <MarkerContent>
                <img
                  src={getMarkerIcon(help.helpType, help.activityType)}
                  alt={`${help.helpType} ${help.activityType}`}
                  className='h-10 w-7 drop-shadow-md'
                />
              </MarkerContent>
              <MarkerPopup className='min-w-[140px]'>
                <div className='flex items-center gap-2'>
                  <img
                    src={getMarkerIcon(help.helpType, help.activityType)}
                    alt=''
                    className='h-6 w-4'
                  />
                  <span className='text-sm font-medium text-gray-800'>
                    {help.helpType}{' '}
                    {help.activityType === 'OFFER' ? 'available' : 'needed'}
                  </span>
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </MapView>
      </div>

      {/* Filter sidebar */}
      <MapFilter />
    </div>
  )
}

export default Map
