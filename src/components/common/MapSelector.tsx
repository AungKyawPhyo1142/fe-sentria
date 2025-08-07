import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useEffect, useRef, useState } from 'react'
import {
  selectUserCurrentLocation,
  useUserCurrentLocationStore,
} from '@/zustand/userCurrentLocationStore'
import { Locate } from 'lucide-react'

// Fix Leaflet default icon
// delete (L.Icon.Default.prototype as any)._getIconUrl
function deleteDefaultIconUrl() {
  const proto = L.Icon.Default.prototype as unknown as {
    _getIconUrl?: () => string
  }
  delete proto._getIconUrl
}
deleteDefaultIconUrl()

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function SetViewLocation({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(position, 13)
  }, [position, map])
  return null
}

export interface LocationCoordinates {
  lat: number | null
  lng: number | null
}

interface MapSelectorProps {
  onPositionChange: (position: { lat: number; lng: number }) => void
}

const MapSelector: React.FC<MapSelectorProps> = ({ onPositionChange }) => {
  const [position, setPosition] = useState<LocationCoordinates | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  //! use the global state instead of calling the useEffect again
  // because user current location will & should be available almost everytime
  const userCurrentLocation = useUserCurrentLocationStore(
    selectUserCurrentLocation,
  )
  useEffect(() => {
    setPosition(userCurrentLocation)
  }, [userCurrentLocation])

  const handleDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target as L.Marker
    const newCoords = {
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng,
    }
    setPosition(newCoords)
    onPositionChange(newCoords)
  }

  const handleLocateMe = () => {
    if (userCurrentLocation.lat && userCurrentLocation.lng) {
      const newCoords = {
        lat: userCurrentLocation.lat,
        lng: userCurrentLocation.lng,
      }
      setPosition(newCoords)

      // Move the marker manually
      if (markerRef.current) {
        markerRef.current.setLatLng(newCoords)
      }

      onPositionChange(newCoords)
    }
  }

  if (!position) {
    return <div>Loading map…</div>
  }

  return (
    <div className='relative z-0'>
      <div className='bg-primary absolute top-3 left-15 z-[1000] cursor-pointer rounded-sm p-2 text-white'>
        <div onClick={handleLocateMe} className='relative'>
          <Locate />
          <div className='pointer-events-none absolute top-1/2 left-full ml-2 w-auto -translate-y-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            Locate me
          </div>
        </div>
      </div>
      <MapContainer
        center={[position.lat ?? 16.0544, position.lng ?? 108.2022]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker
          position={[position.lat ?? 16.0544, position.lng ?? 108.2022]}
          draggable
          eventHandlers={{ dragend: handleDragEnd }}
          ref={(ref) => {
            markerRef.current = ref
          }}
        >
          <Popup>Choose Location that you want to post!</Popup>
        </Marker>
        <SetViewLocation
          position={[position.lat ?? 16.0544, position.lng ?? 108.2022]}
        />
      </MapContainer>
    </div>
  )
}

export default MapSelector
