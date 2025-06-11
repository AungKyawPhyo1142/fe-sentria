import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMapEvents,
} from 'react-leaflet'

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
    enableHighAccuracy: true 
  });
}, [map]);

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
          enableHighAccuracy: true, // <-- This is the key
          timeout: 10000,
          maximumAge: 0,
        },
      )
    }
  }, [])

  return (
    <div className='flex h-[500px] w-[800px] items-center justify-center rounded-md border border-[#33333430] p-10'>
      <MapContainer
        center={position || [0, 0]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '60vh', width: '60vw' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <LocationMarker setPosition={setPosition} />

        {position && (
          <Marker position={position}>
            <Popup>You are here!</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default Map
