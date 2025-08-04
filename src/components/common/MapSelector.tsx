import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useEffect, useState } from 'react'
import {
  selectUserCurrentLocation,
  useUserCurrentLocationStore,
} from '@/zustand/userCurrentLocationStore'

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function SetViewLocation({ position }: { position: [number, number] }) {
  const map = useMap()
  map.setView(position, 13)
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

  // Get user location on load
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => {
  //       const loc: [number, number] = [
  //         pos.coords.latitude,
  //         pos.coords.longitude,
  //       ]
  //       setPosition(loc)
  //     },
  //     () => {
  //       const fallback: [number, number] = [16.0544, 108.2022]
  //       setPosition(fallback)
  //     },
  //   )
  // }, [])

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

  if (!position) {
    return <div>Loading map…</div>
  }

  return (
    <div className='relative z-0'>
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
        >
          <Popup>Choose Location that you want to post!</Popup>
        </Marker>
        <SetViewLocation
          position={[position.lat ?? 16.0544, position.lng ?? 108.2022]}
        />
      </MapContainer>
      {/* {loading && (
        <div className='bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white'>
          Getting address…
        </div>
      )} */}
    </div>
  )
}

export default MapSelector
