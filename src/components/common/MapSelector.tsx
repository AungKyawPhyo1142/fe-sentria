import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'

// fixing default icon issue
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

export interface PlaceInfo {
  lat: number
  lon: number
  display: string
  street?: string
  city?: string
}

interface MapSelectorProps {
  onLocationChange: (Location: PlaceInfo) => void
}

const MapSelector = ({ onLocationChange }: MapSelectorProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [loadingPlace, setLoadingPlace] = useState(false)

  // define gocode
  async function reverseGeocode([lat, lon]: [number, number]) {
    setLoadingPlace(true)
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`
    const res = await fetch(url)
    const data = await res.json()
    const { road, city, town, village } = data.address
    const place: PlaceInfo = {
      lat,
      lon,
      display: data.display_name,
      street: road,
      city: city || town || village,
    }
    onLocationChange(place)
    setLoadingPlace(false)
  }

  //   get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ]
        setPosition(loc)
        reverseGeocode(loc)
      },
      () => {
        const fallback: [number, number] = [51.505, -0.09]
        setPosition(fallback)
        reverseGeocode(fallback)
      },
    )
  }, [])
  if (!position) {
    return <div>Loading map....</div>
  }

  function onDragEnd(e: L.DragEndEvent) {
    const m = e.target as L.Marker
    const newCoords: [number, number] = [m.getLatLng().lat, m.getLatLng().lng]
    setPosition(newCoords)
    reverseGeocode(newCoords)
  }

  return (
    <div className='relative'>
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
          eventHandlers={{ dragend: onDragEnd }}
        >
          <Popup>Choose Location that you want to post!</Popup>
        </Marker>
        <SetViewLocation position={position} />
      </MapContainer>
      {loadingPlace && (
        <div className='bg-opacity-75 absolute inset-0 flex items-center justify-center bg-white'>
          Getting address…
        </div>
      )}
    </div>
  )
}

export default MapSelector
