import React, { useEffect, useRef, useState } from 'react'
import {
  Map as MapView,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapControls,
  type MapRef,
} from '@/components/ui/map'

export interface LocationCoordinates {
  lat: number
  lng: number
}

export interface LocationEditorProps {
  postLocation: LocationCoordinates
  onPositionChange: (position: LocationCoordinates) => void
}

const LocationEditor: React.FC<LocationEditorProps> = ({
  postLocation,
  onPositionChange,
}) => {
  const [position, setPosition] = useState<LocationCoordinates>(postLocation)
  const mapRef = useRef<MapRef>(null)

  // Reset to original post location when postLocation changes (e.g., after reload)
  useEffect(() => {
    setPosition(postLocation)
  }, [postLocation])

  // Fly to the new position when it changes
  useEffect(() => {
    mapRef.current?.flyTo({
      center: [position.lng, position.lat],
      zoom: 13,
      duration: 1500,
    })
  }, [position])

  const handleDragEnd = (lngLat: { lng: number; lat: number }) => {
    const newCoords = { lat: lngLat.lat, lng: lngLat.lng }
    setPosition(newCoords)
    onPositionChange(newCoords)
  }

  return (
    <div className='relative z-0'>
      <div className='h-[400px] w-full overflow-hidden rounded-lg'>
        <MapView
          ref={mapRef}
          center={[position.lng, position.lat]}
          zoom={13}
          scrollZoom={false}
        >
          <MapControls
            position='bottom-right'
            showZoom={true}
            showLocate={false}
          />
          <MapMarker
            longitude={position.lng}
            latitude={position.lat}
            draggable
            onDragEnd={(lngLat) => handleDragEnd(lngLat)}
          >
            <MarkerContent>
              <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-lg'>
                <div className='h-2 w-2 rounded-full bg-white' />
              </div>
            </MarkerContent>
            <MarkerTooltip>Drag to change post location</MarkerTooltip>
          </MapMarker>
        </MapView>
      </div>
    </div>
  )
}

export default LocationEditor
