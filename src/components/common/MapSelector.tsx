import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useEffect, useState } from 'react'
import { useReverseGeocode } from '@/services/network/lib/useReverseGeocode'

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

interface MapSelectorProps {
  onLocationChange: (location: {
    city: string
    country: string
    lat: number
    lng: number
  }) => void
}

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationChange }) => {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const { fetchLocation, data, loading } = useReverseGeocode()

  // Get user location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ]
        setPosition(loc)
      },
      () => {
        const fallback: [number, number] = [16.0544, 108.2022]
        setPosition(fallback)
      },
    )
  }, [])

  // Fetch location info when position updates
  useEffect(() => {
    if (position) {
      fetchLocation({ lat: position[0], lng: position[1] })
    }
  }, [position])

  // Trigger onLocationChange when data is received
  useEffect(() => {
    console.log('📥 data from useReverseGeocode hook:', data)
    if (data) {
      console.log('📥 useEffect triggered by data change:', data)
      onLocationChange({
        city: data.city,
        country: data.country,
        lat: data.lat,
        lng: data.lng,
      })
    }
  }, [data])
  // useEffect(() => {
  //   const testData = {
  //     city: 'Test City',
  //     country: 'Test Country',
  //     lat: 1,
  //     lng: 1,
  //   }

  //   console.log('🧪 Testing onLocationChange directly')
  //   onLocationChange(testData)
  // }, [])

  const handleDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target as L.Marker
    const newCoords: [number, number] = [
      marker.getLatLng().lat,
      marker.getLatLng().lng,
    ]
    setPosition(newCoords)
  }

  if (!position) {
    return <div>Loading map…</div>
  }

  return (
    <div className='relative z-0'>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker
          position={position}
          draggable
          eventHandlers={{ dragend: handleDragEnd }}
        >
          <Popup>Choose Location that you want to post!</Popup>
        </Marker>
        <SetViewLocation position={position} />
      </MapContainer>
      {loading && (
        <div className='bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white'>
          Getting address…
        </div>
      )}
    </div>
  )
}

export default MapSelector
