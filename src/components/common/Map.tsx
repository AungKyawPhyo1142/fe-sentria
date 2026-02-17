import { useGetActivities } from '@/services/network/lib/activity'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet'
import FoodAvailable from '../../assets/foodBlue.svg'
import FoodNeeded from '../../assets/foodRed.svg'
import ShelterAvailable from '../../assets/houseBlue.svg'
import ShelterNeeded from '../../assets/houseRed.svg'
import WaterAvailable from '../../assets/waterBlue.svg'
import WaterNeeded from '../../assets/waterRed.svg'
import WifiAvailable from '../../assets/wifiBlue.svg'
import WifiNeeded from '../../assets/wifiRed.svg'
import HelpInfo from './HelpInfo'
import LocateButton from './LocateButton'
import MapFilter from './MapFilter'
import { useMapFilter } from './MapFilterContext'

const LocationMarker = ({
  setPosition,
}: {
  setPosition: (pos: [number, number]) => void
}) => {
  const map = useMapEvents({
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      map.setView(e.latlng, map.getZoom())
    },
  })

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 16,
      watch: false,
      enableHighAccuracy: true,
    })
  }, [map])

  return null
}

function isWithinDistance(
  pos1: [number, number],
  pos2: [number, number],
  maxMeters: number,
) {
  const latLng1 = L.latLng(pos1[0], pos1[1])
  const latLng2 = L.latLng(pos2[0], pos2[1])
  return latLng1.distanceTo(latLng2) <= maxMeters
}

function getMarkerIcon(helpType: string, activityType: string) {
  const iconMap: Record<string, Record<string, string>> = {
    SHELTER: { REQUEST: ShelterNeeded, OFFER: ShelterAvailable },
    WATER: { REQUEST: WaterNeeded, OFFER: WaterAvailable },
    FOOD: { REQUEST: FoodNeeded, OFFER: FoodAvailable },
    WIFI: { REQUEST: WifiNeeded, OFFER: WifiAvailable },
  }
  const iconUrl =
    iconMap[helpType]?.[activityType] || ShelterAvailable

  return L.icon({
    iconUrl,
    iconSize: [40, 60],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
}

type DisasterHelp = {
  id: string
  helpType: string
  activityType: 'REQUEST' | 'OFFER'
  position: [number, number]
}

const Map = () => {
  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
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
        <MapContainer
          center={position || [0, 0]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <LocateButton position={position} />

          {/* Legend */}
          <div className='absolute bottom-4 left-4 z-[400] flex items-center gap-2'>
            <HelpInfo label='Available' type='available' />
            <HelpInfo label='Needed' type='needed' />
          </div>

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          <LocationMarker setPosition={setPosition} />
          {position && (
            <Marker
              position={position}
              icon={L.icon({
                iconUrl:
                  'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl:
                  'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
                shadowSize: [41, 41],
              })}
            >
              <Popup>You are here!</Popup>
            </Marker>
          )}

          {filteredHelpList.map((help) => (
            <Marker
              key={help.id}
              position={help.position}
              icon={getMarkerIcon(help.helpType, help.activityType)}
            >
              <Popup>
                {`${help.helpType} ${help.activityType === 'OFFER' ? 'available' : 'needed'}`}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Filter sidebar */}
      <MapFilter />
    </div>
  )
}

export default Map
