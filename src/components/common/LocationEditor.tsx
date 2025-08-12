import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useEffect, useState } from 'react'

// Fix Leaflet default icon
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
  lat: number
  lng: number
}

interface LocationEditorProps {
  postLocation: LocationCoordinates
  onPositionChange: (position: LocationCoordinates) => void
}

const LocationEditor: React.FC<LocationEditorProps> = ({
  postLocation,
  onPositionChange,
}) => {
  const [position, setPosition] = useState<LocationCoordinates>(postLocation)

  // Reset to original post location when postLocation changes (e.g., after reload)
  useEffect(() => {
    setPosition(postLocation)
  }, [postLocation])

  const handleDragEnd = (e: L.DragEndEvent) => {
    const marker = e.target as L.Marker
    const newCoords = {
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng,
    }
    setPosition(newCoords)
    onPositionChange(newCoords)
  }

  return (
    <div className='relative z-0'>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker
          position={[position.lat, position.lng]}
          draggable
          eventHandlers={{ dragend: handleDragEnd }}
        >
          <Popup>Drag to change post location</Popup>
        </Marker>
        <SetViewLocation position={[position.lat, position.lng]} />
      </MapContainer>
    </div>
  )
}

export default LocationEditor
