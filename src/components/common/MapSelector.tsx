import React, { useEffect, useRef, useState } from 'react'
import {
  Map as MapView,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapControls,
  type MapRef,
} from '@/components/ui/map'
import {
  selectUserCurrentLocation,
  useUserCurrentLocationStore,
} from '@/zustand/userCurrentLocationStore'

export interface LocationCoordinates {
  lat: number | null
  lng: number | null
}

interface MapSelectorProps {
  onPositionChange: (position: { lat: number; lng: number }) => void
}

const DEFAULT_LNG = 108.2022
const DEFAULT_LAT = 16.0544

const MapSelector: React.FC<MapSelectorProps> = ({ onPositionChange }) => {
  const [position, setPosition] = useState<LocationCoordinates | null>(null)
  const mapRef = useRef<MapRef>(null)

  //! use the global state instead of calling the useEffect again
  // because user current location will & should be available almost everytime
  const userCurrentLocation = useUserCurrentLocationStore(
    selectUserCurrentLocation,
  )
  useEffect(() => {
    setPosition(userCurrentLocation)
  }, [userCurrentLocation])

  // Fly to new position when it changes (replaces SetViewLocation)
  useEffect(() => {
    if (position?.lat != null && position?.lng != null) {
      mapRef.current?.flyTo({
        center: [position.lng, position.lat],
        zoom: 13,
        duration: 1500,
      })
    }
  }, [position?.lat, position?.lng])

  const handleDragEnd = (lngLat: { lng: number; lat: number }) => {
    const newCoords = {
      lat: lngLat.lat,
      lng: lngLat.lng,
    }
    setPosition(newCoords)
    onPositionChange(newCoords)
  }

  const handleLocate = (coords: { longitude: number; latitude: number }) => {
    const newCoords = {
      lat: coords.latitude,
      lng: coords.longitude,
    }
    setPosition(newCoords)
    onPositionChange(newCoords)
  }

  if (!position) {
    return <div>Loading map...</div>
  }

  const lng = position.lng ?? DEFAULT_LNG
  const lat = position.lat ?? DEFAULT_LAT

  return (
    <div className='relative z-0'>
      <div className='h-[400px] w-full overflow-hidden rounded-lg'>
        <MapView ref={mapRef} center={[lng, lat]} zoom={13} scrollZoom={false}>
          <MapControls
            position='bottom-right'
            showZoom
            showLocate
            onLocate={handleLocate}
          />
          <MapMarker
            longitude={lng}
            latitude={lat}
            draggable
            onDragEnd={(lngLat) => handleDragEnd(lngLat)}
          >
            <MarkerContent>
              <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg'>
                <div className='h-2 w-2 rounded-full bg-white' />
              </div>
            </MarkerContent>
            <MarkerTooltip>Choose location for your post</MarkerTooltip>
          </MapMarker>
        </MapView>
      </div>
    </div>
  )
}

export default MapSelector
