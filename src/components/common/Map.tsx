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
  }, [position])

  type DisasterHelp = {
    id: number
    disasterType: string
    helpType: 'needed' | 'available'
    position: [number, number]
  }

  const disasterHelpList: DisasterHelp[] = [
    {
      id: 1,
      disasterType: 'shelter',
      helpType: 'needed',
      position: position
        ? [position[0] + 0.003, position[1] + 0.003]
        : [0.003, 0.003],
    },
    {
      id: 2,
      disasterType: 'water',
      helpType: 'available',
      position: position
        ? [position[0] - 0.003, position[1] - 0.003]
        : [-0.003, -0.003],
    },
    {
      id: 3,
      disasterType: 'food',
      helpType: 'needed',
      position: position
        ? [position[0] + 0.003, position[1] - 0.003]
        : [0.003, -0.003],
    },
    {
      id: 4,
      disasterType: 'wifi',
      helpType: 'available',
      position: position
        ? [position[0] - 0.003, position[1] + 0.003]
        : [-0.003, 0.003],
    },
    {
      id: 5,
      disasterType: 'shelter',
      helpType: 'available',
      position: position ? [position[0] + 0.006, position[1]] : [0.006, 0],
    },
    {
      id: 6,
      disasterType: 'water',
      helpType: 'needed',
      position: position ? [position[0], position[1] + 0.006] : [0, 0.006],
    },
    {
      id: 7,
      disasterType: 'food',
      helpType: 'available',
      position: position ? [position[0] - 0.006, position[1]] : [-0.006, 0],
    },
    {
      id: 8,
      disasterType: 'wifi',
      helpType: 'needed',
      position: position ? [position[0], position[1] - 0.006] : [0, -0.006],
    },
    {
      id: 9,
      disasterType: 'shelter',
      helpType: 'needed',
      position: position
        ? [position[0] + 0.0045, position[1] + 0.0045]
        : [0.0045, 0.0045],
    },
    {
      id: 10,
      disasterType: 'food',
      helpType: 'available',
      position: position
        ? [position[0] - 0.0045, position[1] - 0.0045]
        : [-0.0045, -0.0045],
    },
    // Places over 0.5km (~0.005 deg latitude/longitude) from current position
    {
      id: 11,
      disasterType: 'shelter',
      helpType: 'available',
      position: position
        ? [position[0] + 0.01, position[1] + 0.01]
        : [0.01, 0.01],
    },
    {
      id: 12,
      disasterType: 'water',
      helpType: 'needed',
      position: position
        ? [position[0] - 0.012, position[1] + 0.012]
        : [-0.012, 0.012],
    },
    {
      id: 13,
      disasterType: 'food',
      helpType: 'available',
      position: position
        ? [position[0] + 0.015, position[1] - 0.015]
        : [0.015, -0.015],
    },
    {
      id: 14,
      disasterType: 'wifi',
      helpType: 'needed',
      position: position
        ? [position[0] - 0.02, position[1] - 0.02]
        : [-0.02, -0.02],
    },
  ]

  const { selectedTypes, needed, available } = useMapFilter()

  const filteredHelpList = disasterHelpList.filter((help) => {
    const matchesStatus =
      (needed && help.helpType === 'needed') ||
      (available && help.helpType === 'available')

    const matchesType =
      selectedTypes.size === 0 || selectedTypes.has(help.disasterType)

    const matchesNear =
      !selectedTypes.has('near') ||
      (position && isWithinDistance(position, help.position, 500)) // 500 meters

    return matchesStatus && matchesType && matchesNear
  })

  {
    /* Function to check if two positions are within a certain distance */
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

  return (
    <div className='flex w-full items-start justify-center gap-x-10'>
      <div className='flex w-auto items-center justify-center rounded-md border border-[#33333430] p-10'>
        <MapContainer
          center={position || [0, 0]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '60vh', width: '50vw' }}
        >
          <LocateButton position={position} />

          {/* Custom marker icon for the default marker */}
          <div className='absolute bottom-3 left-5 z-[400] flex cursor-pointer flex-row items-center gap-4'>
            <div className='group flex cursor-pointer flex-row items-center rounded-sm bg-[#F6BD16]'>
              <HelpInfo title='Help Available' type='available' />
            </div>
            <div className='group flex cursor-pointer flex-row items-center rounded-sm bg-[#F6BD16]'>
              <HelpInfo title='Help Needed' type='needed' />
            </div>
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

          {filteredHelpList.map((help) => {
            return (
              <Marker
                key={help.id}
                position={help.position}
                icon={L.icon({
                  iconUrl:
                    help.disasterType === 'shelter'
                      ? help.helpType === 'needed'
                        ? ShelterNeeded
                        : ShelterAvailable
                      : help.disasterType === 'water'
                        ? help.helpType === 'needed'
                          ? WaterNeeded
                          : WaterAvailable
                        : help.disasterType === 'food'
                          ? help.helpType === 'needed'
                            ? FoodNeeded
                            : FoodAvailable
                          : help.disasterType === 'wifi'
                            ? help.helpType === 'needed'
                              ? WifiNeeded
                              : WifiAvailable
                            : ShelterAvailable,
                  iconSize: [40, 60],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                })}
              >
                <Popup>{`Help Type: ${help.disasterType}`}</Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
      <MapFilter />
    </div>
  )
}

export default Map
